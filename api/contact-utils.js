export const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;

const rateLimitStore = globalThis.__unbanContactRateLimitStore || new Map();
globalThis.__unbanContactRateLimitStore = rateLimitStore;

export function validateEmail(email) {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/.test(email);
}

export function sanitizeText(input, maxLength = 5000) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

export function sanitizeHeader(input, maxLength = 200) {
  return sanitizeText(input, maxLength)
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ');
}

export function checkRateLimit(ip, now = Date.now()) {
  if (rateLimitStore.size > 2_000) {
    for (const [key, value] of rateLimitStore) {
      if (now - value.startedAt > RATE_WINDOW_MS) rateLimitStore.delete(key);
    }
  }

  const record = rateLimitStore.get(ip);
  if (!record || now - record.startedAt > RATE_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, startedAt: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - record.startedAt)) / 1000)),
    };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}
