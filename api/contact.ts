import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { parseForm } from "./utils/parseForm";

const resend = new Resend(process.env.RESEND_API_KEY || "re_FG9uxTat_3QxmVxvmP252bZYbiP7ogkft");

const TO_EMAIL = process.env.CONTACT_EMAIL || "support@unbansolutions.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "Unban Solutions <contact@unbansolutions.com>";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const name = (formData.name as string) || "";
    const email = (formData.email as string) || "";
    const platforms = (formData.platforms as string) || "";
    const issue = (formData.issue as string) || "";
    const message = (formData.message as string) || "";
    const attachments = formData.attachments || [];

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }

    // Build email HTML
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

    // Build attachments for Resend
    const emailAttachments = attachments.map((att) => ({
      filename: att.filename,
      content: att.content,
    }));

    // Send email via Resend
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
  } catch (err: any) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
