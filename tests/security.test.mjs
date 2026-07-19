import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { Readable } from 'node:stream';
import test from 'node:test';
import contactHandler, { parseForm } from '../api/contact.js';
import { checkRateLimit, sanitizeHeader, sanitizeText, validateEmail } from '../api/contact-utils.js';
import { buildEmailTemplate, escapeHtml } from '../api/email-template.js';

test('email validation accepts normal addresses and rejects header injection', () => {
  assert.equal(validateEmail('client@example.com'), true);
  assert.equal(validateEmail('client@example.com\r\nBcc: attacker@example.com'), false);
  assert.equal(validateEmail('missing-domain@'), false);
});

test('text sanitization trims and applies the requested length limit', () => {
  assert.equal(sanitizeText('  hello  ', 20), 'hello');
  assert.equal(sanitizeText('123456', 4), '1234');
  assert.equal(sanitizeText(null, 10), '');
});

test('email header values cannot inject additional headers', () => {
  assert.equal(sanitizeHeader('Client\r\nBcc: attacker@example.com'), 'Client Bcc: attacker@example.com');
  assert.equal(sanitizeHeader('  Client   Name  '), 'Client Name');
});

test('email template escapes all user-controlled HTML', () => {
  const html = buildEmailTemplate({
    name: '<img src=x onerror=alert(1)>',
    email: 'client@example.com',
    platforms: '<script>alert(1)</script>',
    issue: 'test',
    message: '<a href="javascript:alert(1)">click</a>',
    attachmentsCount: 0,
    timestamp: 0,
  });
  assert.equal(html.includes('<script>alert(1)</script>'), false);
  assert.equal(html.includes('<a href="javascript:alert(1)">'), false);
  assert.match(html, /&lt;a href=&quot;javascript:alert\(1\)&quot;&gt;click&lt;\/a&gt;/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.equal(escapeHtml(`'"<&>`), '&#039;&quot;&lt;&amp;&gt;');
});

test('rate limiter rejects the sixth request in one window', () => {
  const ip = `test-${Date.now()}-${Math.random()}`;
  for (let index = 0; index < 5; index += 1) {
    assert.equal(checkRateLimit(ip, 1_000).allowed, true);
  }
  const blocked = checkRateLimit(ip, 1_000);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(blocked.retryAfter > 0);
});

test('server source contains no embedded Resend API key', async () => {
  const source = await readFile(new URL('../api/contact.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /re_[A-Za-z0-9]{20,}/);
  assert.match(source, /process\.env\.RESEND_API_KEY\?\.trim\(\)/);
});

test('analytics receives generic funnel events without case metadata', async () => {
  const contact = await readFile(new URL('../src/pages/Contact.tsx', import.meta.url), 'utf8');
  const pageViews = await readFile(new URL('../src/components/AnalyticsPageView.tsx', import.meta.url), 'utf8');
  const cookieConsent = await readFile(new URL('../src/components/CookieConsent.tsx', import.meta.url), 'utf8');
  const analytics = await readFile(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8');
  const entry = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8');

  assert.doesNotMatch(contact, /issue_type|platforms_count|has_attachments/);
  assert.doesNotMatch(pageViews, /location\.search/);
  assert.doesNotMatch(cookieConsent, /location\.search/);
  assert.match(entry, /searchParams\.delete\('issue'\)/);
  assert.match(entry, /searchParams\.delete\('platform'\)/);
  assert.match(analytics, /getElementById\('unban-ga-script'\)[\s\S]*gtag\('consent', 'update', grantedConsent\)/);
  assert.ok(
    analytics.indexOf("browserWindow.fbq('consent', 'grant')")
      < analytics.indexOf("getElementById('unban-meta-pixel')"),
  );

  for (const relativePath of ['../src/pages/Home.tsx', '../src/pages/Services.tsx', '../src/pages/Pricing.tsx']) {
    const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\/contact\?(?:issue|platform)=/);
  }
});

test('blog output has one page heading and explicit article typography', async () => {
  const generated = await readFile(new URL('../src/generated/blog-posts.ts', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  const prerender = await readFile(new URL('../scripts/prerender.mjs', import.meta.url), 'utf8');

  assert.doesNotMatch(generated, /"html": "\\u003ch1>/);
  assert.match(styles, /\.prose-blog h2/);
  assert.match(styles, /\.prose-blog ul/);
  assert.match(prerender, /id="route-schema"/);
  assert.doesNotMatch(prerender, /id="page-schema"/);
});

test('sitemap article URLs exactly match the markdown slugs', async () => {
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const files = (await readdir(new URL('../public/blog/', import.meta.url))).filter((file) => file.endsWith('.md'));
  for (const filename of files) {
    const slug = filename.slice(0, -3);
    assert.match(sitemap, new RegExp(`<loc>https://www\\.unbansolutions\\.com/blog/${slug}</loc>`));
  }
});

function createResponse() {
  return {
    statusCode: 200,
    headers: new Map(),
    body: undefined,
    setHeader(name, value) { this.headers.set(name.toLowerCase(), value); },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    end() { return this; },
  };
}

function multipartRequest(parts, boundary = 'unban-test-boundary') {
  const body = Buffer.from(parts.map((part) => `--${boundary}\r\n${part}\r\n`).join('') + `--${boundary}--\r\n`);
  const request = Readable.from(body);
  request.method = 'POST';
  request.headers = {
    host: 'www.unbansolutions.com',
    origin: 'https://www.unbansolutions.com',
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(body.length),
    'x-forwarded-for': `test-${Date.now()}-${Math.random()}`,
  };
  request.socket = { remoteAddress: '127.0.0.1' };
  return request;
}

test('contact endpoint rejects cross-origin requests before parsing a body', async () => {
  const request = Readable.from([]);
  request.method = 'POST';
  request.headers = { host: 'www.unbansolutions.com', origin: 'https://attacker.example' };
  const response = createResponse();
  await contactHandler(request, response);
  assert.equal(response.statusCode, 403);
});

test('contact endpoint rejects a spoofed image by file signature', async () => {
  const request = multipartRequest([
    'Content-Disposition: form-data; name="name"\r\n\r\nTest Client',
    'Content-Disposition: form-data; name="email"\r\n\r\nclient@example.com',
    'Content-Disposition: form-data; name="message"\r\n\r\nThis is a sufficiently long test message.',
    'Content-Disposition: form-data; name="attachments"; filename="fake.png"\r\nContent-Type: image/png\r\n\r\nnot-a-real-png',
  ]);
  const response = createResponse();
  await contactHandler(request, response);
  assert.equal(response.statusCode, 400);
  assert.match(response.body.error, /не отговаря на типа му/);
});

test('attachment filenames and content types follow the verified MIME type', async () => {
  const request = multipartRequest([
    'Content-Disposition: form-data; name="name"\r\n\r\nTest Client',
    'Content-Disposition: form-data; name="email"\r\n\r\nclient@example.com',
    'Content-Disposition: form-data; name="message"\r\n\r\nThis is a sufficiently long test message.',
    'Content-Disposition: form-data; name="attachments"; filename="active.html"\r\nContent-Type: image/gif\r\n\r\nGIF89a-safe-test',
  ]);
  const parsed = await parseForm(request);
  assert.equal(parsed.attachments.length, 1);
  assert.equal(parsed.attachments[0].filename, 'active.gif');
  assert.equal(parsed.attachments[0].contentType, 'image/gif');
});

test('multipart text preserves 5,000 Cyrillic characters and rejects truncation', async () => {
  const validMessage = 'я'.repeat(5_000);
  const validRequest = multipartRequest([
    `Content-Disposition: form-data; name="message"\r\n\r\n${validMessage}`,
  ]);
  const parsed = await parseForm(validRequest);
  assert.equal(parsed.message, validMessage);

  const oversizedRequest = multipartRequest([
    `Content-Disposition: form-data; name="message"\r\n\r\n${'a'.repeat(20_001)}`,
  ]);
  await assert.rejects(parseForm(oversizedRequest), (error) => error.status === 413);
});

test('contact endpoint fails safely when the email provider key is absent', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  const request = multipartRequest([
    'Content-Disposition: form-data; name="name"\r\n\r\nTest Client',
    'Content-Disposition: form-data; name="email"\r\n\r\nclient@example.com',
    'Content-Disposition: form-data; name="message"\r\n\r\nThis is a sufficiently long test message.',
  ]);
  const response = createResponse();
  await contactHandler(request, response);
  if (previousKey) process.env.RESEND_API_KEY = previousKey;
  assert.equal(response.statusCode, 503);
  assert.doesNotMatch(JSON.stringify(response.body), /RESEND_API_KEY|support@|noreply@/);
});
