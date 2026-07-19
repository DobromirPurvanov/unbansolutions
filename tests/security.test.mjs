import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { Readable } from 'node:stream';
import test from 'node:test';
import contactHandler from '../api/contact.js';
import { checkRateLimit, sanitizeText, validateEmail } from '../api/contact-utils.js';
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
  assert.match(source, /process\.env\.RESEND_API_KEY/);
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
