// API endpoint for contact form - uses Resend with full security

import { Resend } from "resend";
import Busboy from "busboy";
import { buildEmailTemplate, buildClientConfirmationTemplate } from "./email-template.js";

// API ключът се чете САМО от environment променлива (Vercel → Settings → Environment Variables).
// НИКОГА не слагайте ключа директно в кода – репото е публично и GitHub/Resend
// автоматично деактивират всеки ключ, който бъде комитнат.
// .trim() маха случайни интервали/нови редове, попаднали при пействането във Vercel.
const RESEND_API_KEY = (process.env.RESEND_API_KEY || "").trim();

if (!RESEND_API_KEY) {
  console.error("[Contact API] FATAL: RESEND_API_KEY environment variable is not set!");
}
const resend = new Resend(RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_EMAIL || "support@unbansolutions.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Unban Solutions <noreply@unbansolutions.com>";

// ======== RATE LIMITER ========
const RATE_LIMIT = 5; // max 5 requests
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes in ms
const ipStore = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record) {
    ipStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (now - record.firstRequest > RATE_WINDOW) {
    // Window expired, reset
    ipStore.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((RATE_WINDOW - (now - record.firstRequest)) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

// ======== INPUT VALIDATION ========
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, 5000); // max 5000 chars
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    if (!req.headers["content-type"]) {
      reject(new Error("Missing Content-Type header"));
      return;
    }

    const busboy = Busboy({ headers: req.headers });
    const data = {};
    const attachments = [];

    busboy.on("file", (_fieldname, file, info) => {
      const { filename, mimeType } = info;
      const buffer = [];

      file.on("data", (chunk) => buffer.push(chunk));

      file.on("end", () => {
        const fileBuffer = Buffer.concat(buffer);
        // Validate file size (max 10MB)
        if (fileBuffer.length > 10 * 1024 * 1024) {
          reject(new Error(`File ${filename} exceeds 10MB limit`));
          return;
        }
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(mimeType)) {
          reject(new Error(`File type ${mimeType} not allowed`));
          return;
        }
        if (fileBuffer.length > 0) {
          attachments.push({
            filename,
            content: fileBuffer.toString("base64"),
            mimetype: mimeType,
          });
        }
      });
    });

    busboy.on("field", (fieldname, val) => {
      data[fieldname] = val;
    });

    busboy.on("finish", () => {
      resolve({ ...data, attachments });
    });

    busboy.on("error", (err) => {
      reject(err);
    });

    req.pipe(busboy);
  });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ======== CONFIG CHECK ========
    if (!RESEND_API_KEY) {
      return res.status(500).json({
        error: "Server misconfiguration: RESEND_API_KEY is not set in environment variables.",
      });
    }

    // ДИАГНОСТИКА: отпечатък на ключа, който продукцията реално ползва.
    // Не разкрива целия ключ – само първите 8 символа и дължините.
    const rawKey = process.env.RESEND_API_KEY || "";
    console.log(
      `[Contact API] Key fingerprint: starts=${RESEND_API_KEY.slice(0, 8)}..., trimmedLength=${RESEND_API_KEY.length}, rawLength=${rawKey.length}` +
      (rawKey.length !== RESEND_API_KEY.length ? " ⚠️ КЛЮЧЪТ СЪДЪРЖАШЕ ПРАЗНИ СИМВОЛИ (оправено с trim)" : "")
    );

    // ======== RATE LIMITING ========
    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(',')[0].trim();
    console.log("[Contact API] Request from IP:", clientIp);
    console.log("[Contact API] Content-Type:", req.headers["content-type"]);
    
    const rateCheck = checkRateLimit(clientIp);
    
    if (!rateCheck.allowed) {
      res.setHeader("Retry-After", rateCheck.retryAfter);
      return res.status(429).json({ 
        error: "Too many requests. Please try again later.",
        retryAfter: rateCheck.retryAfter
      });
    }

    console.log("[Contact API] Parsing form...");
    const formData = await parseForm(req);
    console.log("[Contact API] Form parsed. Fields:", Object.keys(formData).filter(k => k !== 'attachments'));
    console.log("[Contact API] Attachments:", formData.attachments?.length || 0);

    // ======== HONEYPOT CHECK ========
    if (formData._gotcha && formData._gotcha.trim() !== '') {
      // Bot detected - silently accept but don't send
      console.log(`Bot detected from IP: ${clientIp}`);
      return res.status(200).json({ success: true, message: "Received" });
    }

    // ======== reCAPTCHA v3 ПРОВЕРКА ========
    // Токенът идва от фронтенда; проверяваме го при Google.
    // score < 0.5 или невалиден токен = бот → тихо "успех" без изпращане.
    // Ако RECAPTCHA_SECRET_KEY липсва във Vercel, проверката се пропуска
    // (останалите филтри пазят), за да не спре формата от липсваща env променлива.
    const recaptchaSecret = (process.env.RECAPTCHA_SECRET_KEY || "").trim();
    if (recaptchaSecret) {
      const token = formData._recaptcha;
      if (!token) {
        console.log(`[Contact API] Bot suspected (no reCAPTCHA token) IP: ${clientIp}`);
        return res.status(200).json({ success: true, message: "Received" });
      }
      try {
        const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ secret: recaptchaSecret, response: token, remoteip: clientIp }),
        });
        const verify = await verifyRes.json();
        console.log(`[Contact API] reCAPTCHA: success=${verify.success}, score=${verify.score}, action=${verify.action}`);
        if (!verify.success || (typeof verify.score === "number" && verify.score < 0.5)) {
          console.log(`[Contact API] Bot suspected (reCAPTCHA score: ${verify.score ?? "n/a"}, errors: ${JSON.stringify(verify["error-codes"] || [])}) IP: ${clientIp}`);
          return res.status(200).json({ success: true, message: "Received" });
        }
      } catch (recaptchaErr) {
        // Google недостъпен – пропускаме проверката, не наказваме клиента
        console.error("[Contact API] reCAPTCHA verify failed:", recaptchaErr?.message || recaptchaErr);
      }
    } else {
      console.warn("[Contact API] RECAPTCHA_SECRET_KEY не е зададен – проверката е пропусната");
    }

    const name = sanitizeInput(formData.name);
    const email = sanitizeInput(formData.email);
    const platforms = sanitizeInput(formData.platforms);
    const issue = sanitizeInput(formData.issue);
    const message = sanitizeInput(formData.message);
    const attachments = formData.attachments || [];

    // ======== VALIDATION ========
    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }
    
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // ======== ЕДНОКРАТНИ (DISPOSABLE) ИМЕЙЛИ ========
    const DISPOSABLE_DOMAINS = [
      "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
      "temp-mail.org", "yopmail.com", "sharklasers.com", "trashmail.com",
      "getnada.com", "maildrop.cc", "fakeinbox.com", "dispostable.com",
    ];
    const emailDomain = email.split("@")[1]?.toLowerCase() || "";
    if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
      return res.status(400).json({ error: "Моля, използвайте реален имейл адрес, за да можем да се свържем с вас." });
    }

    // ======== ЛИНК СПАМ ФИЛТЪР ========
    // Клиент може да пейстне линк-два към профила си – това е ок.
    // Съобщение с 4+ линка или HTML/BBCode линкове е почти сигурно спам: тих отказ.
    const linkCount = ((message || "").match(/https?:\/\/|www\./gi) || []).length;
    if (linkCount > 3 || /\[url=|<a\s+href/i.test(message || "")) {
      console.log(`[Contact API] Spam dropped (links: ${linkCount}) IP: ${clientIp}`);
      return res.status(200).json({ success: true, message: "Received" });
    }
    
    if (!message || message.length < 10) {
      return res.status(400).json({ error: "Message must be at least 10 characters" });
    }

    // Max 5 attachments
    if (attachments.length > 5) {
      return res.status(400).json({ error: "Maximum 5 attachments allowed" });
    }

    // ======== BUILD EMAIL ========
    const userAgent = req.headers["user-agent"] || "";
    
    const html = buildEmailTemplate({
      name,
      email,
      platforms,
      issue,
      message,
      attachmentsCount: attachments.length,
      ip: clientIp,
      userAgent,
      timestamp: Date.now(),
    });

    const emailAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content,
    }));

    // ======== SEND EMAIL ========
    console.log("[Contact API] Sending email...");
    console.log("[Contact API] From:", FROM_EMAIL);
    console.log("[Contact API] To:", TO_EMAIL);
    console.log("[Contact API] ReplyTo:", email);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Ново запитване от ${name}${platforms ? " · " + platforms : ""}`,
      html,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    });

    if (error) {
      console.error("[Contact API] Resend error:", JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        error: "Failed to send email", 
        details: error.message || error.name || JSON.stringify(error),
        from: FROM_EMAIL,
        to: TO_EMAIL
      });
    }
    
    console.log("[Contact API] Email sent! ID:", data?.id);

    // ======== АВТО-ОТГОВОР ДО КЛИЕНТА ========
    // Потвърждение „Получихме запитването ви". Ако то се провали,
    // НЕ проваляме заявката – известието до екипа вече е изпратено.
    try {
      const confirmation = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        replyTo: "support@unbansolutions.com",
        subject: "Получихме запитването ви — Unban Solutions",
        html: buildClientConfirmationTemplate({ name, platforms, issue, message }),
      });
      if (confirmation.error) {
        console.error("[Contact API] Client confirmation error:", JSON.stringify(confirmation.error));
      } else {
        console.log("[Contact API] Client confirmation sent! ID:", confirmation.data?.id);
      }
    } catch (confirmErr) {
      console.error("[Contact API] Client confirmation failed:", confirmErr?.message || confirmErr);
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      emailId: data?.id,
      attachmentsCount: attachments.length,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
