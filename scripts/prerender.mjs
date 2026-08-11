import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadArticles } from './blog-lib.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const baseHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
const siteUrl = 'https://www.unbansolutions.com';
const organizationId = `${siteUrl}/#organization`;

const { published } = await loadArticles();
const latestDate = published[0]?.date || '2026-07-19';

const routes = [
  { path: '/', title: 'Unban Solutions | Защита и възстановяване на акаунти', description: 'Професионална оценка, подготовка на обжалвания и съдействие при ограничени, спрени или компрометирани акаунти. Изпратете казуса си за оценка.' },
  { path: '/services', title: 'Услуги за възстановяване на акаунти | Unban Solutions', description: 'Оценка на казуса, подготовка на обжалване, съдействие при компрометирани профили и превантивен одит за основните социални платформи.' },
  { path: '/pricing', title: 'Цени за съдействие при проблеми с акаунти | Unban Solutions', description: 'Ясни цени за консултация, оценка и подготовка на казуси, без обещание за решение от платформата. Вижте какво включва всяка услуга.' },
  { path: '/process', title: 'Как протича работата по вашия казус | Unban Solutions', description: 'От първоначалната оценка и събирането на доказателства до подаването на обжалване и проследяването на отговора по вашия казус.' },
  { path: '/contact', title: 'Контакт и безплатна първоначална оценка | Unban Solutions', description: 'Опишете проблема с вашия акаунт и изпратете нужните доказателства чрез защитената форма. Ще получите ясна първоначална оценка на казуса.' },
  { path: '/blog', title: 'Блог за защита и възстановяване на акаунти | Unban Solutions', description: 'Практически статии за спрени акаунти, шадоубан, рестрикции, фишинг и правилата за съдържание в социалните мрежи. Нова статия всяка седмица.' },
  { path: '/privacy-policy', title: 'Политика за поверителност | Unban Solutions', description: 'Как Unban Solutions събира, използва, съхранява и защитава личните данни.' },
  { path: '/terms', title: 'Общи условия | Unban Solutions', description: 'Условията за използване на сайта и възлагане на услуги на Unban Solutions.' },
  { path: '/payments-and-refunds', title: 'Плащания, отказ и възстановяване | Unban Solutions', description: 'Условия за плащане, право на отказ и възстановяване на суми при възложени услуги.' },
];

function articleSchema(article) {
  const url = `${siteUrl}/blog/${article.slug}`;
  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: article.title,
      description: article.description,
      url,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: 'bg',
      wordCount: article.wordCount,
      keywords: article.keywords,
      articleSection: article.tags.join(', '),
      author: { '@id': organizationId },
      publisher: { '@id': organizationId },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: `${siteUrl}/icon-512.png`,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Блог', item: `${siteUrl}/blog` },
        { '@type': 'ListItem', position: 2, name: article.title, item: url },
      ],
    },
  ];
  if (article.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: article.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

// Static article markup injected into #root so crawlers that skip JavaScript
// (most AI bots included) still see the full text. React replaces it on load.
function articleStaticHtml(article) {
  const faqHtml = article.faq.length
    ? `<section><h2>Често задавани въпроси</h2>${article.faq
        .map((item) => `<details><summary>${item.question}</summary>${item.answerHtml}</details>`)
        .join('')}</section>`
    : '';
  return [
    '<main class="article-static">',
    '<article>',
    `<p><a href="/blog">Блог</a></p>`,
    `<h1>${article.title}</h1>`,
    `<p>Публикувано на ${article.date} · ${article.readTime} четене</p>`,
    `<div class="article-body">${article.bodyHtml}</div>`,
    faqHtml,
    '</article>',
    '</main>',
  ].join('');
}

for (const article of published) {
  routes.push({
    path: `/blog/${article.slug}`,
    title: `${article.title} | Unban Solutions`,
    description: article.description,
    type: 'article',
    schema: articleSchema(article),
    rootHtml: articleStaticHtml(article),
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
    html = html.replace('</head>', `    <script id="route-schema" type="application/ld+json">${json}</script>\n  </head>`);
  }
  if (route.rootHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${route.rootHtml}</div>`);
  }
  return html;
}

for (const route of routes) {
  const target = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.path.slice(1)}.html`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, render(route), 'utf8');
}

// sitemap.xml: static routes plus every published article. public/sitemap.xml
// is only the pre-blog fallback; this generated file overwrites it in dist.
const staticSitemapEntries = [
  { loc: `${siteUrl}/`, lastmod: '2026-07-19', changefreq: 'weekly', priority: '1.0' },
  { loc: `${siteUrl}/services`, lastmod: '2026-07-19', changefreq: 'monthly', priority: '0.9' },
  { loc: `${siteUrl}/pricing`, lastmod: '2026-07-19', changefreq: 'monthly', priority: '0.9' },
  { loc: `${siteUrl}/process`, lastmod: '2026-07-19', changefreq: 'monthly', priority: '0.8' },
  { loc: `${siteUrl}/contact`, lastmod: '2026-07-19', changefreq: 'monthly', priority: '0.8' },
  { loc: `${siteUrl}/blog`, lastmod: latestDate, changefreq: 'weekly', priority: '0.8' },
  { loc: `${siteUrl}/privacy-policy`, lastmod: '2026-07-19', changefreq: 'yearly', priority: '0.4' },
  { loc: `${siteUrl}/terms`, lastmod: '2026-07-19', changefreq: 'yearly', priority: '0.4' },
  { loc: `${siteUrl}/payments-and-refunds`, lastmod: '2026-07-19', changefreq: 'yearly', priority: '0.4' },
];
const articleSitemapEntries = published.map((article) => ({
  loc: `${siteUrl}/blog/${article.slug}`,
  lastmod: article.date,
  changefreq: 'monthly',
  priority: '0.7',
}));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticSitemapEntries, ...articleSitemapEntries]
  .map((e) => `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`)
  .join('\n')}\n</urlset>\n`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');

// llms.txt: append the published articles so AI assistants can find them.
if (published.length) {
  const llmsPath = path.join(dist, 'llms.txt');
  const llmsBase = await readFile(llmsPath, 'utf8');
  const articlesSection = [
    '## Articles (in Bulgarian)',
    '',
    ...published.map((a) => `- [${a.title}](${siteUrl}/blog/${a.slug}): ${a.description}`),
    '',
  ].join('\n');
  await writeFile(llmsPath, llmsBase.replace('## Policies', `${articlesSection}\n## Policies`), 'utf8');
}

console.log(`Generated metadata HTML for ${routes.length} indexable routes (${published.length} blog articles).`);
