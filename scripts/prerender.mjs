import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const baseHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const siteUrl = 'https://www.unbansolutions.com';

const routes = [
  { path: '/', title: 'Unban Solutions | Защита и възстановяване на акаунти', description: 'Професионална оценка, подготовка на обжалвания и съдействие при ограничени, спрени или компрометирани акаунти. Изпратете казуса си за оценка.' },
  { path: '/services', title: 'Услуги за възстановяване на акаунти | Unban Solutions', description: 'Оценка на казуса, подготовка на обжалване, съдействие при компрометирани профили и превантивен одит за основните социални платформи.' },
  { path: '/pricing', title: 'Цени за съдействие при проблеми с акаунти | Unban Solutions', description: 'Ясни цени за консултация, оценка и подготовка на казуси, без обещание за решение от платформата. Вижте какво включва всяка услуга.' },
  { path: '/process', title: 'Как протича работата по вашия казус | Unban Solutions', description: 'От първоначалната оценка и събирането на доказателства до подаването на обжалване и проследяването на отговора по вашия казус.' },
  { path: '/contact', title: 'Контакт и безплатна първоначална оценка | Unban Solutions', description: 'Опишете проблема с вашия акаунт и изпратете нужните доказателства чрез защитената форма. Ще получите ясна първоначална оценка на казуса.' },
  { path: '/blog', title: 'Блог | Предстоящи материали | Unban Solutions', description: 'Подготвяме практически материали за защита на акаунти и работа с ограничения в социалните мрежи.' },
  { path: '/privacy-policy', title: 'Политика за поверителност | Unban Solutions', description: 'Как Unban Solutions събира, използва, съхранява и защитава личните данни.' },
  { path: '/terms', title: 'Общи условия | Unban Solutions', description: 'Условията за използване на сайта и възлагане на услуги на Unban Solutions.' },
  { path: '/payments-and-refunds', title: 'Плащания, отказ и възстановяване | Unban Solutions', description: 'Условия за плащане, право на отказ и възстановяване на суми при възложени услуги.' },
];

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function render(route) {
  const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
  const title = escapeAttribute(route.title);
  const description = escapeAttribute(route.description);
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${route.type || 'website'}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta name="twitter:url" content="[^"]*"\s*\/>/, `<meta name="twitter:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);
  if (route.schema) {
    const json = JSON.stringify(route.schema).replaceAll('<', '\\u003c');
    html = html.replace('</head>', `    <script id="route-schema" type="application/ld+json">${json}</script>\n  </head>`);
  }
  return html;
}

for (const route of routes) {
  const target = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.path.slice(1)}.html`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, render(route), 'utf8');
}

console.log(`Generated metadata HTML for ${routes.length} indexable routes.`);
