// API endpoint for contact form - uses Resend with full security

import { Resend } from "resend";
import Busboy from "busboy";
import { buildEmailTemplate } from "./email-template.js";

const resend = new Resend(process.env.RESEND_API_KEY || "re_cCCoCVQE_yB4qQ6FhmZvtL2HuPvjLiHsa");

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
    // ======== RATE LIMITING ========
    const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").split(',')[0].trim();
    const rateCheck = checkRateLimit(clientIp);
    
    if (!rateCheck.allowed) {
      res.setHeader("Retry-After", rateCheck.retryAfter);
      return res.status(429).json({ 
        error: "Too many requests. Please try again later.",
        retryAfter: rateCheck.retryAfter
      });
    }

    const formData = await parseForm(req);

    // ======== HONEYPOT CHECK ========
    if (formData._gotcha && formData._gotcha.trim() !== '') {
      // Bot detected - silently accept but don't send
      console.log(`Bot detected from IP: ${clientIp}`);
      return res.status(200).json({ success: true, message: "Received" });
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
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `📬 ${name} — нов запитване от Unban Solutions`,
      html,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error, null, 2));
      return res.status(500).json({ 
        error: "Failed to send email", 
        details: error.message || error.name || JSON.stringify(error),
        from: FROM_EMAIL,
        to: TO_EMAIL
      });
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
