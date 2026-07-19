import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const dist = path.join(root, 'dist');
const baseHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const siteUrl = 'https://www.unbansolutions.com';
const image = `${siteUrl}/icon-512.png`;
function toMetaDescription(value) {
  let description = String(value).trim();
  if (description.length < 135) description += ' Практически насоки от Unban Solutions.';
  if (description.length > 160) description = `${description.slice(0, 157).trimEnd()}…`;
  return description;
}

const routes = [
  { path: '/', title: 'Unban Solutions | Защита и възстановяване на акаунти', description: 'Професионална оценка, подготовка на обжалвания и съдействие при ограничени, спрени или компрометирани акаунти. Изпратете казуса си за оценка.' },
  { path: '/services', title: 'Услуги за възстановяване на акаунти | Unban Solutions', description: 'Оценка на казуса, подготовка на обжалване, съдействие при компрометирани профили и превантивен одит за основните социални платформи.' },
  { path: '/pricing', title: 'Цени за съдействие при проблеми с акаунти | Unban Solutions', description: 'Ясни цени за консултация, оценка и подготовка на казуси, без обещание за решение от платформата. Вижте какво включва всяка услуга.' },
  { path: '/process', title: 'Как протича работата по вашия казус | Unban Solutions', description: 'От първоначалната оценка и събирането на доказателства до подаването на обжалване и проследяването на отговора по вашия казус.' },
  { path: '/contact', title: 'Контакт и безплатна първоначална оценка | Unban Solutions', description: 'Опишете проблема с вашия акаунт и изпратете нужните доказателства чрез защитената форма. Ще получите ясна първоначална оценка на казуса.' },
  { path: '/blog', title: 'Блог за защита и възстановяване на акаунти | Unban Solutions', description: 'Практически материали за сигурност, обжалвания, ограничения и превенция на проблеми в социалните мрежи, подготвени от Unban Solutions.' },
  { path: '/privacy-policy', title: 'Политика за поверителност | Unban Solutions', description: 'Как Unban Solutions събира, използва, съхранява и защитава личните данни.' },
  { path: '/terms', title: 'Общи условия | Unban Solutions', description: 'Условията за използване на сайта и възлагане на услуги на Unban Solutions.' },
  { path: '/payments-and-refunds', title: 'Плащания, отказ и възстановяване | Unban Solutions', description: 'Условия за плащане, право на отказ и възстановяване на суми при възложени услуги.' },
];

const blogDirectory = path.join(root, 'public', 'blog');
for (const filename of await readdir(blogDirectory)) {
  if (!filename.endsWith('.md')) continue;
  const raw = await readFile(path.join(blogDirectory, filename), 'utf8');
  const { data } = matter(raw);
  const slug = filename.slice(0, -3);
  const articleTitle = `${data.title || slug} | Unban Solutions`;
  routes.push({
    path: `/blog/${slug}`,
    title: articleTitle.length > 60 ? (data.title || slug) : articleTitle,
    description: toMetaDescription(data.excerpt || 'Практическа статия за защита и възстановяване на дигитални акаунти.'),
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: data.title || slug,
      description: data.excerpt || '',
      datePublished: data.date,
      dateModified: data.date,
      mainEntityOfPage: `${siteUrl}/blog/${slug}`,
      image,
      author: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Unban Solutions' },
      publisher: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Unban Solutions', logo: { '@type': 'ImageObject', url: image } },
      inLanguage: 'bg',
    },
  });
}

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
    html = html.replace('</head>', `    <script id="page-schema" type="application/ld+json">${json}</script>\n  </head>`);
  }
  return html;
}

for (const route of routes) {
  const target = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.path.slice(1)}.html`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, render(route), 'utf8');
}

console.log(`Generated metadata HTML for ${routes.length} indexable routes.`);
