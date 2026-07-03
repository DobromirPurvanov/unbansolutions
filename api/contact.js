// API endpoint for contact form - uses Resend to send beautiful emails

import { Resend } from "resend";
import Busboy from "busboy";
import { buildEmailTemplate } from "./email-template.js";

const resend = new Resend(process.env.RESEND_API_KEY || "re_cCCoCVQE_yB4qQ6FhmZvtL2HuPvjLiHsa");

const TO_EMAIL = process.env.CONTACT_EMAIL || "support@unbansolutions.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Unban Solutions <contact@unbansolutions.com>";

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
    const formData = await parseForm(req);

    const name = formData.name || "";
    const email = formData.email || "";
    const platforms = formData.platforms || "";
    const issue = formData.issue || "";
    const message = formData.message || "";
    const attachments = formData.attachments || [];

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }

    // Build attachments for Resend
    const emailAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content,
    }));

    // Get client info
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";

    // Build beautiful email using template
    const html = buildEmailTemplate({
      name,
      email,
      platforms,
      issue,
      message,
      attachmentsCount: attachments.length,
      ip,
      userAgent,
      timestamp: Date.now(),
    });

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `📬 ${name} — нов запитване от Unban Solutions`,
      html,
      attachments: emailAttachments.length > 0 ? emailAttachments : undefined,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email" });
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
