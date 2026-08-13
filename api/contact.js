import Busboy from 'busboy';
import { createHash } from 'node:crypto';
import { buildEmailTemplate } from './email-template.js';
import { RATE_LIMIT, checkRateLimit, sanitizeHeader, sanitizeText, validateEmail } from './contact-utils.js';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL?.trim() || 'support@unbansolutions.com';
const FROM_EMAIL = process.env.FROM_EMAIL?.trim() || 'Unban Solutions <noreply@unbansolutions.com>';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 4 * 1024 * 1024;
const MAX_FILES = 3;
const MAX_BODY_SIZE = Math.floor(4.25 * 1024 * 1024);
const MAX_FIELD_SIZE = 20_000;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);
const SAFE_FILE_EXTENSIONS = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/gif', '.gif'],
  ['image/webp', '.webp'],
  ['application/pdf', '.pdf'],
]);
// captchaToken трябва да е тук — busboy изхвърля тихо всяко поле извън
// списъка, а лимитите `fields`/`parts` по-долу се извеждат от размера му.
const ALLOWED_FIELDS = new Set(['name', 'email', 'platforms', 'issue', 'message', '_gotcha', 'captchaToken']);

class ClientError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function cleanFilename(input) {
  const filename = sanitizeText(input, 120)
    .replace(/[\\/\0-\x1f\x7f]/g, '-')
    .replace(/\.{2,}/g, '.');
  return filename || 'attachment';
}

function normalizeFilename(input, mimeType) {
  const extension = SAFE_FILE_EXTENSIONS.get(mimeType) || '';
  const cleaned = cleanFilename(input);
  const withoutExtension = cleaned.replace(/\.[^.]*$/, '').replace(/[. ]+$/g, '') || 'attachment';
  return `${withoutExtension.slice(0, Math.max(1, 120 - extension.length))}${extension}`;
}

function hasValidSignature(buffer, mimeType) {
  if (mimeType === 'image/jpeg') return buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (mimeType === 'image/png') return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === 'image/gif') return buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'));
  if (mimeType === 'image/webp') return buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (mimeType === 'application/pdf') return buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  return false;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return sanitizeText(firstForwarded || req.socket?.remoteAddress || 'unknown', 64);
}

async function checkDistributedRateLimit(ip) {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const keyHash = createHash('sha256')
    .update(`${process.env.RATE_LIMIT_SALT?.trim() || process.env.SITE_URL?.trim() || 'unban-solutions'}:${ip}`)
    .digest('hex')
    .slice(0, 32);
  const key = `contact-rate:${keyHash}`;
  const script = "local count=redis.call('INCR',KEYS[1]); if count==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]); end; local ttl=redis.call('PTTL',KEYS[1]); return {count,ttl}";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['EVAL', script, 1, key, 15 * 60 * 1000]),
      signal: AbortSignal.timeout(1_500),
    });
    if (!response.ok) throw new Error('rate_limit_provider_error');
    const payload = await response.json();
    const [count, ttl] = Array.isArray(payload.result) ? payload.result.map(Number) : [];
    if (!Number.isFinite(count) || !Number.isFinite(ttl)) throw new Error('invalid_rate_limit_response');
    return {
      allowed: count <= RATE_LIMIT,
      remaining: Math.max(0, RATE_LIMIT - count),
      retryAfter: Math.max(1, Math.ceil(ttl / 1000)),
    };
  } catch (error) {
    console.error('[Contact API] Distributed rate limiter unavailable:', error instanceof Error ? error.name : 'unknown_error');
    return null;
  }
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  try {
    const originHost = new URL(origin).host;
    const requestHost = sanitizeText(req.headers.host, 255);
    const canonicalHost = new URL(process.env.SITE_URL?.trim() || 'https://www.unbansolutions.com').host;
    return originHost === requestHost || originHost === canonicalHost || originHost === 'unbansolutions.com';
  } catch {
    return false;
  }
}

export function parseForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      reject(new ClientError(415, 'Формата не беше приета в този вид. Презаредете страницата и опитайте отново.'));
      return;
    }

    const contentLength = Number(req.headers['content-length'] || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
      reject(new ClientError(413, 'Заедно файловете надхвърлят 4 MB. Махнете един — останалите можете да ни пратите после на имейл.'));
      return;
    }

    let busboy;
    try {
      busboy = Busboy({
        headers: req.headers,
        limits: {
          files: MAX_FILES,
          fileSize: MAX_FILE_SIZE,
          fields: ALLOWED_FIELDS.size,
          fieldSize: MAX_FIELD_SIZE,
          parts: ALLOWED_FIELDS.size + MAX_FILES,
        },
      });
    } catch {
      reject(new ClientError(400, 'Формата не беше приета. Проверете попълнените полета и опитайте отново.'));
      return;
    }

    const data = {};
    const attachments = [];
    let totalFileSize = 0;
    let parsingError = null;

    const fail = (error) => {
      if (!parsingError) parsingError = error;
    };

    busboy.on('file', (_fieldname, file, info) => {
      const mimeType = sanitizeText(info.mimeType, 100).toLowerCase();
      const filename = normalizeFilename(info.filename, mimeType);
      const chunks = [];
      let fileSize = 0;

      if (!ALLOWED_TYPES.has(mimeType)) {
        fail(new ClientError(400, 'Този формат не се отваря при нас. Приемаме JPG, PNG, GIF, WebP и PDF.'));
        file.resume();
        return;
      }

      file.on('limit', () => fail(new ClientError(413, `${filename} е над 3 MB. Изрежете екранната снимка или я запазете като JPG.`)));
      file.on('data', (chunk) => {
        fileSize += chunk.length;
        totalFileSize += chunk.length;
        if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
          fail(new ClientError(413, 'Заедно файловете надхвърлят 4 MB. Махнете един и опитайте отново.'));
          return;
        }
        chunks.push(chunk);
      });
      file.on('end', () => {
        if (parsingError || fileSize === 0) return;
        const buffer = Buffer.concat(chunks);
        if (!hasValidSignature(buffer, mimeType)) {
          fail(new ClientError(400, `${filename} не се разчита при нас — съдържанието му не отговаря на типа му. Отворете го и го запазете наново като JPG или PDF.`));
          return;
        }
        attachments.push({ filename, content: buffer.toString('base64'), contentType: mimeType });
      });
    });

    busboy.on('field', (fieldname, value, info) => {
      if (info.valueTruncated) {
        fail(new ClientError(413, 'Описанието надхвърля лимита. Оставете най-важното — за детайлите ще питаме по имейл.'));
        return;
      }
      if (ALLOWED_FIELDS.has(fieldname)) data[fieldname] = value;
    });
    busboy.on('filesLimit', () => fail(new ClientError(413, `Приемаме до ${MAX_FILES} файла — изберете най-важните.`)));
    busboy.on('fieldsLimit', () => fail(new ClientError(400, 'Формата не беше приета. Презаредете страницата и опитайте отново.')));
    busboy.on('partsLimit', () => fail(new ClientError(400, 'Формата не беше приета. Презаредете страницата и опитайте пак.')));
    busboy.on('error', () => reject(new ClientError(400, 'Формата не беше приета. Проверете попълнените полета и опитайте отново.')));
    busboy.on('finish', () => {
      if (parsingError) reject(parsingError);
      else resolve({ ...data, attachments });
    });

    req.pipe(busboy);
  });
}

/* ── Cloudflare Turnstile ────────────────────────────────────
   Три изхода, защото „бот" и „човек с блокер" не са едно и също:

     block — токен, който Cloudflare отхвърля (подправен, изтекъл, вече
             използван) или дошъл от чужд домейн. Блокерите не произвеждат
             счупен токен, те не произвеждат никакъв.
     flag  — липсващ токен. Минава, но се логва; TURNSTILE_REQUIRE_TOKEN=true
             го прави блок.
     allow — чист токен, или наша конфигурационна грешка / паднал Cloudflare.
             Никога не наказваме клиента за чужд отказ.
   ──────────────────────────────────────────────────────────── */
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_ALLOWED_HOSTS = ['unbansolutions.com', 'www.unbansolutions.com'];

async function assessCaptcha(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const requireToken = process.env.TURNSTILE_REQUIRE_TOKEN === 'true';

  if (!secret) {
    // Шумно, защото отвън е неразличимо от работеща защита.
    console.error('[Contact API] TURNSTILE_SECRET_KEY липсва — формата е БЕЗ защита от ботове.');
    return { verdict: 'allow', note: null };
  }
  if (!token) {
    return requireToken
      ? { verdict: 'block', note: 'липсващ Turnstile токен' }
      : { verdict: 'flag', note: 'без Turnstile токен (блокер или бот)' };
  }

  let data;
  try {
    const body = new URLSearchParams({ secret, response: String(token) });
    if (remoteip && remoteip !== 'unknown') body.set('remoteip', remoteip);
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    data = await response.json();
  } catch (error) {
    console.error('[Contact API] Turnstile verify недостъпна:', error instanceof Error ? error.name : 'unknown_error');
    return { verdict: 'allow', note: 'Turnstile не можа да бъде проверена' };
  }

  if (!data?.success) {
    const codes = (data?.['error-codes'] || []).join(', ') || 'unknown';
    return { verdict: 'block', note: `Turnstile не премина (${codes})` };
  }
  if (data.hostname && !TURNSTILE_ALLOWED_HOSTS.includes(data.hostname)) {
    return { verdict: 'block', note: `Turnstile hostname не съвпада (${data.hostname})` };
  }
  return { verdict: 'allow', note: null };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Нещо ни попречи да приемем формата. Презаредете страницата и опитайте отново — ако пак спре, пишете ни на support@unbansolutions.com.' });
  }

  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Заявката не се поддържа от формата. Отворете страницата за контакт отново.' });
  }

  const clientIp = getClientIp(req);
  const localRateCheck = checkRateLimit(clientIp);
  const distributedRateCheck = localRateCheck.allowed ? await checkDistributedRateLimit(clientIp) : null;
  const rateCheck = distributedRateCheck || localRateCheck;
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT));
  res.setHeader('X-RateLimit-Remaining', String(rateCheck.remaining));
  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', String(rateCheck.retryAfter));
    return res.status(429).json({ error: 'Получихме няколко изпращания едно след друго. Изчакайте минута — написаното не е изгубено.' });
  }

  try {
    const formData = await parseForm(req);
    /* Honeypot: отвън изглежда като успех, за да не разбере ботът, че е
       хванат. `delivered: false` е за нас — без него клиентът праща Lead към
       GA4 и Meta, тоест спамът се брои като конверсия. */
    if (sanitizeText(formData._gotcha, 100)) {
      console.warn('[Contact API] honeypot улови заявка');
      return res.status(200).json({ success: true, delivered: false });
    }

    const captcha = await assessCaptcha(formData.captchaToken, clientIp);
    if (captcha.verdict === 'block') {
      console.warn('[Contact API] Turnstile отхвърли заявка:', captcha.note);
      return res.status(403).json({ error: 'Проверката, че не сте робот, не се получи — случва се и при бавна връзка. Презаредете страницата или ни пишете на support@unbansolutions.com.' });
    }
    if (captcha.verdict === 'flag') console.warn('[Contact API] съмнителна заявка:', captcha.note);

    const name = sanitizeHeader(formData.name, 120);
    const email = sanitizeText(formData.email, 254).toLowerCase();
    const platforms = sanitizeText(formData.platforms, 300);
    const issue = sanitizeText(formData.issue, 200);
    const message = sanitizeText(formData.message, 5000);
    const attachments = formData.attachments || [];

    if (name.length < 2) throw new ClientError(400, 'Напишете името си (поне 2 знака).');
    if (!validateEmail(email)) throw new ClientError(400, 'Този имейл изглежда непълен — на него ще изпратим оценката.');
    if (message.length < 10) throw new ClientError(400, 'Добавете кратко описание на случая — няколко изречения стигат.');

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      console.error('[Contact API] RESEND_API_KEY is not configured.');
      return res.status(503).json({ error: 'Формата е временно спряна. Копирайте описанието си, за да не го пишете пак, и ни го пратете на support@unbansolutions.com или на +359 887 704 737.' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    const html = buildEmailTemplate({
      name,
      email,
      platforms,
      issue,
      message,
      attachmentsCount: attachments.length,
      timestamp: Date.now(),
    });

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject: `${name} – ново запитване от Unban Solutions`,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error('[Contact API] Email provider rejected the request:', error.name || 'unknown_error');
      return res.status(502).json({ error: 'Съобщението не стигна до нас и вината не е ваша. Копирайте текста и опитайте пак или звъннете на +359 887 704 737.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof ClientError) return res.status(error.status).json({ error: error.message });
    console.error('[Contact API] Unexpected error:', error instanceof Error ? error.name : 'unknown_error');
    return res.status(500).json({ error: 'Проблемът е при нас, не при вас. Изчакайте минута и опитайте отново.' });
  }
}
