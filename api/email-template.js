/**
 * Unban Solutions — premium notification email template
 * Bulletproof дизайн: таблици + inline стилове (Gmail/Outlook/Apple Mail safe).
 * Без външни фонтове, без <style> зависимости, без скриптове.
 */

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  return new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Разбива "Instagram, Facebook" на отделни цветни pill-чета */
function renderPills(str, color, bg, border) {
  if (!str || !str.trim()) {
    return `<span style="display:inline-block;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;color:#64748B;background-color:#F1F5F9;border:1px solid #E2E8F0;">Не е посочено</span>`;
  }
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(
      (item) =>
        `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:700;color:${color};background-color:${bg};border:1px solid ${border};">${escapeHtml(item)}</span>`
    )
    .join("");
}

export function buildEmailTemplate({
  name,
  email,
  platforms,
  issue,
  message,
  attachmentsCount,
  ip,
  userAgent,
  timestamp,
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const firstName = escapeHtml((name || "").trim().split(/\s+/)[0] || "клиента");
  const date = formatDate(timestamp);
  const preheader = `Ново запитване от ${safeName} · ${escapeHtml(platforms || "без платформа")} · ${escapeHtml(issue || "общ въпрос")}`;

  const replyHref = `mailto:${safeEmail}?subject=${encodeURIComponent(
    "Re: Вашето запитване към Unban Solutions"
  )}&body=${encodeURIComponent(`Здравейте, ${(name || "").trim().split(/\s+/)[0] || ""}!\n\nБлагодарим за запитването ви.\n\n`)}`;

  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const attachmentsBlock =
    attachmentsCount > 0
      ? `
      <!-- Attachments -->
      <tr>
        <td style="padding:0 32px 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td bgcolor="#FFFBEB" style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:14px 18px;">
                <span style="font-family:${font};font-size:14px;font-weight:700;color:#A16207;">📎 ${attachmentsCount} ${attachmentsCount === 1 ? "прикачен файл" : "прикачени файла"}</span>
                <span style="font-family:${font};font-size:13px;color:#A16207;"> — отворете прикачените към този имейл</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="bg" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Ново запитване — Unban Solutions</title>
</head>
<body style="margin:0;padding:0;background-color:#EDF1F7;-webkit-text-size-adjust:100%;">

  <!-- Preheader (скрит preview текст в inbox-а) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EDF1F7;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#EDF1F7" style="background-color:#EDF1F7;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;">

          <!-- ═══ HERO ═══ -->
          <tr>
            <td bgcolor="#0F172A" style="background-color:#0F172A;border-radius:16px 16px 0 0;padding:0;">
              <!-- Градиентна акцентна лента -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td height="5" bgcolor="#7C3AED" style="height:5px;line-height:5px;font-size:5px;border-radius:16px 16px 0 0;background-color:#7C3AED;background-image:linear-gradient(90deg,#2563EB 0%,#7C3AED 50%,#0891B2 100%);">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center" style="padding:36px 32px 32px 32px;">
                    <div style="font-family:${font};font-size:13px;font-weight:800;letter-spacing:0.22em;color:#94A3B8;text-transform:uppercase;padding-bottom:18px;">
                      UNBAN&nbsp;SOLUTIONS
                    </div>
                    <div style="padding-bottom:16px;">
                      <span style="display:inline-block;padding:7px 18px;border-radius:999px;background-color:#1D4ED8;background-image:linear-gradient(90deg,#2563EB,#7C3AED);font-family:${font};font-size:12px;font-weight:800;letter-spacing:0.12em;color:#FFFFFF;text-transform:uppercase;">
                      ⚡ Ново запитване
                      </span>
                    </div>
                    <div style="font-family:${font};font-size:26px;line-height:1.3;font-weight:800;color:#FFFFFF;">
                      ${safeName} ви написа
                    </div>
                    <div style="font-family:${font};font-size:14px;color:#94A3B8;padding-top:10px;">
                      ${date} ч. · през формата на сайта
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ БЯЛО ТЯЛО ═══ -->
          <tr>
            <td bgcolor="#FFFFFF" style="background-color:#FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

                <!-- Клиент -->
                <tr>
                  <td style="padding:30px 32px 8px 32px;">
                    <div style="font-family:${font};font-size:11px;font-weight:800;letter-spacing:0.14em;color:#2563EB;text-transform:uppercase;padding-bottom:12px;">
                      От кого
                    </div>
                    <div style="font-family:${font};font-size:21px;font-weight:800;color:#0F172A;padding-bottom:4px;">
                      ${safeName}
                    </div>
                    <a href="mailto:${safeEmail}" style="font-family:${font};font-size:15px;color:#2563EB;text-decoration:none;font-weight:600;">${safeEmail}</a>
                  </td>
                </tr>

                <!-- Разделител -->
                <tr><td style="padding:20px 32px 0 32px;"><div style="border-top:1px solid #E9EEF5;font-size:0;line-height:0;">&nbsp;</div></td></tr>

                <!-- Детайли: платформи + проблем -->
                <tr>
                  <td style="padding:20px 32px 6px 32px;">
                    <div style="font-family:${font};font-size:11px;font-weight:800;letter-spacing:0.14em;color:#2563EB;text-transform:uppercase;padding-bottom:12px;">
                      Платформи
                    </div>
                    ${renderPills(platforms, "#1D4ED8", "#EFF6FF", "#BFDBFE")}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 32px 24px 32px;">
                    <div style="font-family:${font};font-size:11px;font-weight:800;letter-spacing:0.14em;color:#7C3AED;text-transform:uppercase;padding-bottom:12px;">
                      Проблем
                    </div>
                    ${renderPills(issue, "#6D28D9", "#F5F3FF", "#DDD6FE")}
                  </td>
                </tr>

                <!-- Съобщение -->
                <tr>
                  <td style="padding:0 32px 24px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td bgcolor="#F8FAFC" style="background-color:#F8FAFC;border-left:4px solid #7C3AED;border-radius:0 12px 12px 0;padding:20px 22px;">
                          <div style="font-family:${font};font-size:11px;font-weight:800;letter-spacing:0.14em;color:#64748B;text-transform:uppercase;padding-bottom:10px;">
                            Съобщение
                          </div>
                          <div style="font-family:${font};font-size:15px;line-height:1.75;color:#1E293B;white-space:pre-wrap;">${escapeHtml(message)}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${attachmentsBlock}

                <!-- CTA бутон (bulletproof) -->
                <tr>
                  <td align="center" style="padding:6px 32px 34px 32px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" bgcolor="#2563EB" style="border-radius:12px;background-color:#2563EB;background-image:linear-gradient(90deg,#2563EB,#7C3AED);">
                          <a href="${replyHref}" style="display:inline-block;padding:15px 42px;font-family:${font};font-size:15px;font-weight:800;color:#FFFFFF;text-decoration:none;border-radius:12px;">
                            Отговори на ${firstName} &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                    <div style="font-family:${font};font-size:12px;color:#94A3B8;padding-top:12px;">
                      Отговорът отива директно на имейла на клиента
                    </div>
                  </td>
                </tr>

                <!-- Технически детайли -->
                <tr>
                  <td style="padding:0 32px 30px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td bgcolor="#F1F5F9" style="background-color:#F1F5F9;border-radius:12px;padding:16px 20px;">
                          <div style="font-family:${font};font-size:10px;font-weight:800;letter-spacing:0.14em;color:#94A3B8;text-transform:uppercase;padding-bottom:8px;">
                            Технически детайли
                          </div>
                          <div style="font-family:Consolas,Menlo,'Courier New',monospace;font-size:11px;line-height:1.9;color:#64748B;">
                            IP: ${escapeHtml(ip || "N/A")}<br>
                            Получено: ${date} ч. (София)<br>
                            Браузър: ${escapeHtml((userAgent || "N/A").slice(0, 110))}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td bgcolor="#0F172A" style="background-color:#0F172A;border-radius:0 0 16px 16px;padding:26px 32px;" align="center">
              <div style="font-family:${font};font-size:16px;font-weight:800;color:#FFFFFF;padding-bottom:6px;">
                Unban <span style="color:#A78BFA;">Solutions</span>
              </div>
              <div style="font-family:${font};font-size:12px;color:#64748B;padding-bottom:14px;">
                Възстановяване на акаунти · Дигитална защита · Правни консултации
              </div>
              <div style="font-family:${font};font-size:12px;">
                <a href="https://unbansolutions.com" style="color:#94A3B8;text-decoration:none;">unbansolutions.com</a>
                <span style="color:#334155;">&nbsp;·&nbsp;</span>
                <a href="tel:+359883391411" style="color:#94A3B8;text-decoration:none;">0883 391 411</a>
                <span style="color:#334155;">&nbsp;·&nbsp;</span>
                <a href="mailto:support@unbansolutions.com" style="color:#94A3B8;text-decoration:none;">support@unbansolutions.com</a>
              </div>
            </td>
          </tr>

          <!-- Под-футър -->
          <tr>
            <td align="center" style="padding:18px 20px 0 20px;">
              <div style="font-family:${font};font-size:11px;color:#94A3B8;">
                Автоматично известие от контактната форма на unbansolutions.com
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Авто-отговор до КЛИЕНТА: „Получихме запитването ви".
 * Същият бранд, но обърнат към човека отсреща.
 */
export function buildClientConfirmationTemplate({ name, platforms, issue, message }) {
  const firstName = escapeHtml((name || "").trim().split(/\s+/)[0] || "");
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
  const preheader = `Здравейте${firstName ? ", " + firstName : ""}! Запитването ви е при нас и екипът вече го разглежда.`;

  const steps = [
    ["1", "Преглед на казуса", "Специалист от екипа анализира ситуацията и платформите ви."],
    ["2", "Връзка с вас", "Ще се свържем на посочения имейл — обикновено до 24 часа."],
    ["3", "План за действие", "Получавате конкретни стъпки за възстановяване и защита."],
  ]
    .map(
      ([n, title, text]) => `
      <tr>
        <td width="44" valign="top" style="padding:0 0 18px 0;">
          <table cellpadding="0" cellspacing="0" role="presentation"><tr>
            <td align="center" bgcolor="#EFF6FF" style="width:32px;height:32px;border-radius:999px;background-color:#EFF6FF;border:1px solid #BFDBFE;font-family:${font};font-size:14px;font-weight:800;color:#2563EB;">${n}</td>
          </tr></table>
        </td>
        <td valign="top" style="padding:0 0 18px 0;">
          <div style="font-family:${font};font-size:15px;font-weight:800;color:#0F172A;padding:5px 0 3px 0;">${title}</div>
          <div style="font-family:${font};font-size:13px;line-height:1.6;color:#64748B;">${text}</div>
        </td>
      </tr>`
    )
    .join("");

  const summaryBlock =
    message && message.trim()
      ? `
      <tr>
        <td style="padding:0 32px 26px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td bgcolor="#F8FAFC" style="background-color:#F8FAFC;border-left:4px solid #2563EB;border-radius:0 12px 12px 0;padding:18px 22px;">
                <div style="font-family:${font};font-size:11px;font-weight:800;letter-spacing:0.14em;color:#64748B;text-transform:uppercase;padding-bottom:8px;">
                  Вашето запитване${issue ? " · " + escapeHtml(issue) : ""}${platforms ? " · " + escapeHtml(platforms) : ""}
                </div>
                <div style="font-family:${font};font-size:14px;line-height:1.7;color:#334155;white-space:pre-wrap;">${escapeHtml(message)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="bg" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Получихме запитването ви — Unban Solutions</title>
</head>
<body style="margin:0;padding:0;background-color:#EDF1F7;-webkit-text-size-adjust:100%;">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#EDF1F7;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" bgcolor="#EDF1F7" style="background-color:#EDF1F7;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;">

          <!-- HERO -->
          <tr>
            <td bgcolor="#0F172A" style="background-color:#0F172A;border-radius:16px 16px 0 0;padding:0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td height="5" bgcolor="#7C3AED" style="height:5px;line-height:5px;font-size:5px;border-radius:16px 16px 0 0;background-color:#7C3AED;background-image:linear-gradient(90deg,#2563EB 0%,#7C3AED 50%,#0891B2 100%);">&nbsp;</td>
                </tr>
                <tr>
                  <td align="center" style="padding:36px 32px 32px 32px;">
                    <div style="font-family:${font};font-size:13px;font-weight:800;letter-spacing:0.22em;color:#94A3B8;text-transform:uppercase;padding-bottom:18px;">
                      UNBAN&nbsp;SOLUTIONS
                    </div>
                    <div style="padding-bottom:16px;">
                      <span style="display:inline-block;padding:7px 18px;border-radius:999px;background-color:#059669;font-family:${font};font-size:12px;font-weight:800;letter-spacing:0.12em;color:#FFFFFF;text-transform:uppercase;">
                      ✓ Заявката е приета
                      </span>
                    </div>
                    <div style="font-family:${font};font-size:26px;line-height:1.3;font-weight:800;color:#FFFFFF;">
                      Получихме запитването ви
                    </div>
                    <div style="font-family:${font};font-size:14px;color:#94A3B8;padding-top:10px;">
                      Екипът ни вече го разглежда
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ТЯЛО -->
          <tr>
            <td bgcolor="#FFFFFF" style="background-color:#FFFFFF;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

                <tr>
                  <td style="padding:30px 32px 22px 32px;">
                    <div style="font-family:${font};font-size:17px;font-weight:800;color:#0F172A;padding-bottom:10px;">
                      Здравейте${firstName ? ", " + firstName : ""}! 👋
                    </div>
                    <div style="font-family:${font};font-size:14px;line-height:1.75;color:#475569;">
                      Благодарим, че се обърнахте към нас. Запитването ви е регистрирано и специалист от екипа вече работи по него. Ето какво следва:
                    </div>
                  </td>
                </tr>

                <!-- Стъпки -->
                <tr>
                  <td style="padding:0 32px 10px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      ${steps}
                    </table>
                  </td>
                </tr>

                ${summaryBlock}

                <!-- Спешен контакт -->
                <tr>
                  <td style="padding:0 32px 30px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td bgcolor="#F1F5F9" align="center" style="background-color:#F1F5F9;border-radius:12px;padding:18px 20px;">
                          <div style="font-family:${font};font-size:13px;color:#475569;padding-bottom:6px;">
                            Спешен случай? Работим <strong>24/7</strong> за критични ситуации:
                          </div>
                          <a href="tel:+359883391411" style="font-family:${font};font-size:17px;font-weight:800;color:#2563EB;text-decoration:none;">📞 0883 391 411</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td bgcolor="#0F172A" style="background-color:#0F172A;border-radius:0 0 16px 16px;padding:26px 32px;" align="center">
              <div style="font-family:${font};font-size:16px;font-weight:800;color:#FFFFFF;padding-bottom:6px;">
                Unban <span style="color:#A78BFA;">Solutions</span>
              </div>
              <div style="font-family:${font};font-size:12px;color:#64748B;padding-bottom:14px;">
                Възстановяване на акаунти · Дигитална защита · Правни консултации
              </div>
              <div style="font-family:${font};font-size:12px;">
                <a href="https://unbansolutions.com" style="color:#94A3B8;text-decoration:none;">unbansolutions.com</a>
                <span style="color:#334155;">&nbsp;·&nbsp;</span>
                <a href="mailto:support@unbansolutions.com" style="color:#94A3B8;text-decoration:none;">support@unbansolutions.com</a>
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:18px 20px 0 20px;">
              <div style="font-family:${font};font-size:11px;color:#94A3B8;">
                Това е автоматично потвърждение — можете да отговорите директно на този имейл.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
