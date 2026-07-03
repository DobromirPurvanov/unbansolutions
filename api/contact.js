// API endpoint for contact form - uses Resend to send emails

import { Resend } from "resend";
import Busboy from "busboy";

const resend = new Resend(process.env.RESEND_API_KEY || "re_FG9uxTat_3QxmVxvmP252bZYbiP7ogkft");
const TO_EMAIL = process.env.CONTACT_EMAIL || "support@unbansolutions.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Unban Solutions <contact@unbansolutions.com>";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

    const html = `
      <h2>Ново запитване от Unban Solutions</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Име</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Имейл</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Платформи</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(platforms)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Проблем</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(issue)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;background:#f5f5f5;">Съобщение</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
      </table>
      ${attachments.length > 0 ? `<p><strong>Прикачени файлове:</strong> ${attachments.length}</p>` : ""}
    `;

    const emailAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content,
    }));

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Ново запитване от ${name} - Unban Solutions`,
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
