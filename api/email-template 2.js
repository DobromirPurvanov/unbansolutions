/**
 * Beautiful email template for Unban Solutions contact form
 */

export function buildEmailTemplate({ name, email, platforms, issue, message, attachmentsCount, ip, userAgent, timestamp }) {
  const date = timestamp ? new Date(timestamp).toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' }) : new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' });
  
  return `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ново запитване - Unban Solutions</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      line-height: 1.6;
    }
    
    .wrapper {
      max-width: 640px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #0891B2 100%);
      border-radius: 16px 16px 0 0;
      padding: 40px 32px;
      text-align: center;
    }
    
    .header-icon {
      width: 64px;
      height: 64px;
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      backdrop-filter: blur(10px);
    }
    
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .header p {
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }
    
    /* Body */
    .body {
      background: #ffffff;
      padding: 32px;
    }
    
    /* Status badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #059669;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 999px;
      margin-bottom: 24px;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      background: #059669;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* Section title */
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #2563EB;
      margin-bottom: 12px;
    }
    
    /* Data table */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    
    .data-table tr {
      border-bottom: 1px solid #e2e8f0;
    }
    
    .data-table tr:last-child {
      border-bottom: none;
    }
    
    .data-table td {
      padding: 14px 0;
      vertical-align: top;
    }
    
    .data-table .label {
      width: 140px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .data-table .value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 500;
    }
    
    .data-table .value-highlight {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #2563EB;
      display: inline-block;
    }
    
    /* Message box */
    .message-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .message-box .message-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #2563EB;
      margin-bottom: 10px;
    }
    
    .message-box .message-text {
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    
    /* Attachments */
    .attachments {
      background: #fefce8;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    
    .attachments-header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #a16207;
    }
    
    .attachments-count {
      background: #fde68a;
      color: #a16207;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 999px;
    }
    
    /* Meta info */
    .meta {
      background: #f1f5f9;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 24px;
    }
    
    .meta-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 10px;
    }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .meta-row:last-child {
      border-bottom: none;
    }
    
    .meta-label {
      color: #64748b;
    }
    
    .meta-value {
      color: #334155;
      font-weight: 500;
      font-family: 'Courier New', monospace;
      font-size: 11px;
    }
    
    /* CTA Button */
    .cta-wrapper {
      text-align: center;
      margin: 28px 0 12px;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
    }
    
    /* Footer */
    .footer {
      background: #0f172a;
      border-radius: 0 0 16px 16px;
      padding: 28px 32px;
      text-align: center;
    }
    
    .footer-logo {
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .footer-logo span {
      background: linear-gradient(135deg, #60a5fa, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .footer-text {
      color: #64748b;
      font-size: 12px;
    }
    
    .footer-links {
      margin-top: 12px;
    }
    
    .footer-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 12px;
      margin: 0 8px;
    }
    
    /* Responsive */
    @media (max-width: 480px) {
      .header { padding: 28px 20px; }
      .header h1 { font-size: 20px; }
      .body { padding: 24px 20px; }
      .data-table .label { width: 100px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    
    <!-- Header -->
    <div class="header">
      <div class="header-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <h1>Ново запитване</h1>
      <p>Получено чрез формата за контакт</p>
    </div>
    
    <!-- Body -->
    <div class="body">
      
      <!-- Status -->
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Ново — чака обработка</span>
      </div>
      
      <!-- Section: Client Info -->
      <div class="section-title">Информация за клиента</div>
      <table class="data-table">
        <tr>
          <td class="label">Име</td>
          <td class="value">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td class="label">Имейл</td>
          <td class="value"><a href="mailto:${escapeHtml(email)}" style="color:#2563EB;text-decoration:none;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td class="label">Телефон</td>
          <td class="value"><a href="tel:0883391411" style="color:#2563EB;text-decoration:none;">0883 391411</a></td>
        </tr>
      </table>
      
      <!-- Section: Case Details -->
      <div class="section-title">Детайли за казуса</div>
      <table class="data-table">
        <tr>
          <td class="label">Платформи</td>
          <td class="value"><span class="value-highlight">${escapeHtml(platforms || 'Не е избрано')}</span></td>
        </tr>
        <tr>
          <td class="label">Проблем</td>
          <td class="value"><span class="value-highlight">${escapeHtml(issue || 'Не е избран')}</span></td>
        </tr>
      </table>
      
      <!-- Message -->
      <div class="message-box">
        <div class="message-label">Съобщение от клиента</div>
        <div class="message-text">${escapeHtml(message)}</div>
      </div>
      
      <!-- Attachments -->
      ${attachmentsCount > 0 ? `
      <div class="attachments">
        <div class="attachments-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
          <span>Прикачени файлове</span>
          <span class="attachments-count">${attachmentsCount}</span>
        </div>
      </div>
      ` : ''}
      
      <!-- Meta -->
      <div class="meta">
        <div class="meta-title">Технически детайли</div>
        <div class="meta-row">
          <span class="meta-label">Време на получаване</span>
          <span class="meta-value">${date}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">IP адрес</span>
          <span class="meta-value">${escapeHtml(ip || 'N/A')}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Браузър</span>
          <span class="meta-value">${escapeHtml(userAgent || 'N/A')}</span>
        </div>
      </div>
      
      <!-- CTA -->
      <div class="cta-wrapper">
        <a href="mailto:${escapeHtml(email)}?subject=Re: Запитване Unban Solutions&body=Здравейте ${escapeHtml(name)},%0D%0A%0D%0AБлагодарим за запитването!%0D%0A%0D%0A" class="cta-button">
          Отговори на клиента →
        </a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">Unban <span>Solutions</span></div>
      <div class="footer-text">Възстановяване на акаунти · Дигитална защита · Правни консултации</div>
      <div class="footer-links">
        <a href="https://unbansolutions.com">Сайт</a> ·
        <a href="tel:0883391411">0883 391411</a> ·
        <a href="mailto:support@unbansolutions.com">support@unbansolutions.com</a>
      </div>
    </div>
    
  </div>
</body>
</html>`;
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
