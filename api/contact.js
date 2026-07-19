import Busboy from 'busboy';
import { createHash } from 'node:crypto';
import { buildEmailTemplate } from './email-template.js';
import { RATE_LIMIT, checkRateLimit, sanitizeText, validateEmail } from './contact-utils.js';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'support@unbansolutions.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Unban Solutions <noreply@unbansolutions.com>';

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const MAX_TOTAL_FILE_SIZE = 4 * 1024 * 1024;
const MAX_FILES = 3;
const MAX_BODY_SIZE = Math.floor(4.25 * 1024 * 1024);
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]);
const ALLOWED_FIELDS = new Set(['name', 'email', 'platforms', 'issue', 'message', '_gotcha']);

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
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const keyHash = createHash('sha256')
    .update(`${process.env.RATE_LIMIT_SALT || process.env.SITE_URL || 'unban-solutions'}:${ip}`)
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
    const canonicalHost = new URL(process.env.SITE_URL || 'https://www.unbansolutions.com').host;
    return originHost === requestHost || originHost === canonicalHost || originHost === 'unbansolutions.com';
  } catch {
    return false;
  }
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      reject(new ClientError(415, 'Форматът на заявката не се поддържа.'));
      return;
    }

    const contentLength = Number(req.headers['content-length'] || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_SIZE) {
      reject(new ClientError(413, 'Файловете са твърде големи.'));
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
          fieldSize: 5000,
          parts: ALLOWED_FIELDS.size + MAX_FILES,
        },
      });
    } catch {
      reject(new ClientError(400, 'Невалидни данни във формата.'));
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
      const filename = cleanFilename(info.filename);
      const chunks = [];
      let fileSize = 0;

      if (!ALLOWED_TYPES.has(mimeType)) {
        fail(new ClientError(400, 'Позволени са само JPG, PNG, GIF, WebP и PDF файлове.'));
        file.resume();
        return;
      }

      file.on('limit', () => fail(new ClientError(413, `Файлът ${filename} надвишава 3 MB.`)));
      file.on('data', (chunk) => {
        fileSize += chunk.length;
        totalFileSize += chunk.length;
        if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
          fail(new ClientError(413, 'Общият размер на файловете надвишава 4 MB.'));
          return;
        }
        chunks.push(chunk);
      });
      file.on('end', () => {
        if (parsingError || fileSize === 0) return;
        const buffer = Buffer.concat(chunks);
        if (!hasValidSignature(buffer, mimeType)) {
          fail(new ClientError(400, `Съдържанието на файла ${filename} не отговаря на типа му.`));
          return;
        }
        attachments.push({ filename, content: buffer.toString('base64') });
      });
    });

    busboy.on('field', (fieldname, value) => {
      if (ALLOWED_FIELDS.has(fieldname)) data[fieldname] = value;
    });
    busboy.on('filesLimit', () => fail(new ClientError(413, `Можете да прикачите до ${MAX_FILES} файла.`)));
    busboy.on('fieldsLimit', () => fail(new ClientError(400, 'Формата съдържа твърде много полета.')));
    busboy.on('partsLimit', () => fail(new ClientError(400, 'Формата съдържа твърде много части.')));
    busboy.on('error', () => reject(new ClientError(400, 'Невалидни данни във формата.')));
    busboy.on('finish', () => {
      if (parsingError) reject(parsingError);
      else resolve({ ...data, attachments });
    });

    req.pipe(busboy);
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Origin');

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Заявката е отказана.' });
  }

  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Методът не се поддържа.' });
  }

  const clientIp = getClientIp(req);
  const localRateCheck = checkRateLimit(clientIp);
  const distributedRateCheck = localRateCheck.allowed ? await checkDistributedRateLimit(clientIp) : null;
  const rateCheck = distributedRateCheck || localRateCheck;
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT));
  res.setHeader('X-RateLimit-Remaining', String(rateCheck.remaining));
  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', String(rateCheck.retryAfter));
    return res.status(429).json({ error: 'Твърде много опити. Моля, опитайте отново след малко.' });
  }

  try {
    const formData = await parseForm(req);
    if (sanitizeText(formData._gotcha, 100)) {
      return res.status(200).json({ success: true });
    }

    const name = sanitizeText(formData.name, 120);
    const email = sanitizeText(formData.email, 254).toLowerCase();
    const platforms = sanitizeText(formData.platforms, 300);
    const issue = sanitizeText(formData.issue, 200);
    const message = sanitizeText(formData.message, 5000);
    const attachments = formData.attachments || [];

    if (name.length < 2) throw new ClientError(400, 'Името трябва да е поне 2 символа.');
    if (!validateEmail(email)) throw new ClientError(400, 'Моля, въведете валиден имейл адрес.');
    if (message.length < 10) throw new ClientError(400, 'Съобщението трябва да е поне 10 символа.');

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[Contact API] RESEND_API_KEY is not configured.');
      return res.status(503).json({ error: 'Формата временно не е достъпна. Моля, свържете се по телефон или имейл.' });
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
      return res.status(502).json({ error: 'Съобщението не беше изпратено. Моля, опитайте отново или се свържете по телефон.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof ClientError) return res.status(error.status).json({ error: error.message });
    console.error('[Contact API] Unexpected error:', error instanceof Error ? error.name : 'unknown_error');
    return res.status(500).json({ error: 'Възникна неочаквана грешка. Моля, опитайте отново.' });
  }
}
