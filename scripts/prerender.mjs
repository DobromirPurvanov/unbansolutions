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

// Справочните страници се хранят от същия JSON, който React импортира.
const sanctionsReference = JSON.parse(
  await readFile(path.join(root, 'src', 'data', 'reference', 'sanctions.json'), 'utf8'),
);
const diagnosticTree = JSON.parse(
  await readFile(path.join(root, 'src', 'data', 'reference', 'diagnostic.json'), 'utf8'),
);
const rulesGuides = await Promise.all(
  ['rules-organic.json', 'rules-ads.json'].map(async (file) =>
    JSON.parse(await readFile(path.join(root, 'src', 'data', 'reference', file), 'utf8')),
  ),
);

const routes = [
  { path: '/', title: 'Unban Solutions | Защита и възстановяване на акаунти', description: 'Професионална оценка, подготовка на обжалвания и съдействие при ограничени, спрени или компрометирани акаунти. Изпратете казуса си за оценка.' },
  { path: '/services', title: 'Услуги за възстановяване на акаунти | Unban Solutions', description: 'Оценка на казуса, подготовка на обжалване, съдействие при компрометирани профили и превантивен одит за основните социални платформи.' },
  { path: '/pricing', title: 'Цени за съдействие при проблеми с акаунти | Unban Solutions', description: 'Ясни цени за консултация, оценка и подготовка на казуси, без обещание за решение от платформата. Вижте какво включва всяка услуга.' },
  { path: '/process', title: 'Как протича работата по вашия казус | Unban Solutions', description: 'От първоначалната оценка и събирането на доказателства до подаването на обжалване и проследяването на отговора по вашия казус.' },
  { path: '/contact', title: 'Контакт и безплатна първоначална оценка | Unban Solutions', description: 'Опишете проблема с вашия акаунт и изпратете нужните доказателства чрез защитената форма. Ще получите ясна първоначална оценка на казуса.' },
  { path: '/blog', title: 'Блог за защита и възстановяване на акаунти | Unban Solutions', description: 'Практически статии за спрени акаунти, шадоубан, рестрикции, фишинг и правилата за съдържание в социалните мрежи. Нова статия всяка седмица.' },
  {
    path: '/vidove-sanktsii',
    title: 'Видове санкции в Instagram и Facebook | Unban Solutions',
    description: 'Дванадесетте вида санкции в социалните мрежи: как изглежда всяка, къде се вижда в приложението, какви са типичните причини и кои са първите стъпки в първите 48 часа.',
    schema: referenceSchema(),
    rootHtml: referenceStaticHtml(),
  },
  {
    path: '/diagnostika',
    title: 'Каква е моята санкция? Бърза диагностика | Unban Solutions',
    description: 'Отговорете на два-три въпроса и разберете коя мярка е наложена на профила ви, къде се вижда официално и какви са първите стъпки.',
    schema: diagnosticSchema(),
    rootHtml: diagnosticStaticHtml(),
  },
  { path: '/privacy-policy', title: 'Политика за поверителност | Unban Solutions', description: 'Как Unban Solutions събира, използва, съхранява и защитава личните данни.' },
  { path: '/terms', title: 'Общи условия | Unban Solutions', description: 'Условията за използване на сайта и възлагане на услуги на Unban Solutions.' },
  { path: '/payments-and-refunds', title: 'Плащания, отказ и възстановяване | Unban Solutions', description: 'Условия за плащане, право на отказ и възстановяване на суми при възложени услуги.' },
];

function referenceSchema() {
  const url = `${siteUrl}/vidove-sanktsii`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: 'Видове санкции в социалните мрежи',
        description: 'Дванадесетте вида санкции в Instagram и Facebook: как изглежда всяка, къде се вижда, какви са причините и кои са първите стъпки.',
        url,
        inLanguage: 'bg',
        dateModified: sanctionsReference.updated,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Видове санкции', item: url },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#sanctions`,
        name: 'Видове санкции',
        itemListElement: sanctionsReference.sanctions.map((sanction, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: sanction.title,
          description: sanction.summary,
          item: `${url}#${sanction.id}`,
        })),
      },
    ],
  };
}

// Същият текст, който React рендира — за ботовете, които не изпълняват JavaScript.
function referenceStaticHtml() {
  const { strikePaths, sanctions, statusPlaces, reportOutcomes, reportSignals, reportSop, myths } = sanctionsReference;
  const escape = (value) => escapeAttribute(value);
  const list = (items) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`;

  return [
    '<main class="article-static">',
    '<h1>Дванадесетте вида санкции и какво прави всяка от тях</h1>',
    '<p>Първата задача при всяка мярка е да разберете коя точно е тя. Оттам следват срокът, мястото, където се вижда, и стъпките, които имат смисъл.</p>',
    '<h2>Четирите strike пътеки</h2>',
    strikePaths
      .map((path) => [
        `<h3>${escape(path.name)} (${escape(path.scope)})</h3>`,
        `<p>Тригери: ${escape(path.triggers)}</p>`,
        `<p>Ескалация: ${escape(path.escalation)}</p>`,
        `<p>Какво помага: ${escape(path.response)}</p>`,
      ].join(''))
      .join(''),
    '<p>Точните прагове и срокове не са публични и се променят. Използвайте това като оперативен ориентир, не като правилник.</p>',
    '<h2>Санкция по санкция</h2>',
    sanctions
      .map((sanction) => [
        `<section id="${escape(sanction.id)}">`,
        `<h3>${escape(sanction.title)}</h3>`,
        `<p>${escape(sanction.summary)}</p>`,
        `<p>Как изглежда: ${escape(sanction.looksLike)}</p>`,
        `<p>Къде се вижда: ${escape(sanction.whereToSee)}</p>`,
        `<p>Типични причини: ${escape(sanction.causes)}</p>`,
        '<p>Първи стъпки (до 48 часа):</p>',
        list(sanction.firstSteps),
        sanction.article ? `<p><a href="/blog/${escape(sanction.article)}">Подробна статия по темата</a></p>` : '',
        '</section>',
      ].join(''))
      .join(''),
    '<h2>Къде се вижда статусът на акаунта</h2>',
    `<ul>${statusPlaces.map((place) => `<li>${escape(place.name)}: ${escape(place.detail)}</li>`).join('')}</ul>`,
    '<h2>Когато ви залеят със сигнали</h2>',
    '<p>Сигналът от потребител не е присъда, а повод за проверка.</p>',
    '<h3>Възможните изходи</h3>',
    list(reportOutcomes),
    '<h3>Признаци за координирана вълна</h3>',
    list(reportSignals),
    '<h3>Какво да направите по ред</h3>',
    `<ol>${reportSop.map((step) => `<li>${escape(step.title)}: ${escape(step.detail)}</li>`).join('')}</ol>`,
    '<h2>Митове и реалност</h2>',
    `<ul>${myths.map((item) => `<li>„${escape(item.myth)}“ — ${escape(item.reality)}</li>`).join('')}</ul>`,
    '<p>Unban Solutions не е свързана с Meta, TikTok или друга платформа. Работим по публично публикуваните правила и процедури за обжалване. Съдържанието тук е оперативен ориентир, не юридически съвет.</p>',
    '<p><a href="/contact">Изпратете казуса си за оценка</a></p>',
    '</main>',
  ].join('');
}

function diagnosticSchema() {
  const url = `${siteUrl}/diagnostika`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: 'Каква е моята санкция',
        description: 'Кратка диагностика, която разпознава коя санкция е наложена по описанието на симптомите и показва първите стъпки.',
        url,
        inLanguage: 'bg',
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Видове санкции', item: `${siteUrl}/vidove-sanktsii` },
          { '@type': 'ListItem', position: 3, name: 'Диагностика', item: url },
        ],
      },
    ],
  };
}

// Въпросникът е интерактивен, затова статичният вариант изрежда въпросите и
// извежда всички възможни изхода като линкове към справочника.
function diagnosticStaticHtml() {
  const escape = (value) => escapeAttribute(value);
  const questions = Object.values(diagnosticTree.nodes)
    .map((node) => [
      `<h2>${escape(node.question)}</h2>`,
      node.hint ? `<p>${escape(node.hint)}</p>` : '',
      `<ul>${node.options.map((option) => `<li>${escape(option.label)} — ${escape(option.detail)}</li>`).join('')}</ul>`,
    ].join(''))
    .join('');

  return [
    '<main class="article-static">',
    '<h1>Каква е вашата санкция?</h1>',
    '<p>Два-три въпроса по симптомите. Резултатът показва коя мярка стои зад тях, къде се вижда официално и какво има смисъл да направите първо.</p>',
    questions,
    '<h2>Възможните резултати</h2>',
    `<ul>${sanctionsReference.sanctions
      .map((sanction) => `<li><a href="/vidove-sanktsii#${escape(sanction.id)}">${escape(sanction.title)}</a>: ${escape(sanction.summary)}</li>`)
      .join('')}</ul>`,
    '<p>Диагностиката е ориентир по описаните симптоми, а не официално становище. Unban Solutions не е свързана с Meta, TikTok или друга платформа.</p>',
    '<p><a href="/contact">Изпратете казуса си за оценка</a></p>',
    '</main>',
  ].join('');
}

function guideSchema(guide) {
  const url = `${siteUrl}/pravila/${guide.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: guide.title,
        description: guide.metaDescription,
        url,
        inLanguage: 'bg',
        dateModified: guide.updated,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Видове санкции', item: `${siteUrl}/vidove-sanktsii` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#topics`,
        name: guide.title,
        itemListElement: guide.topics.map((topic, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: topic.title,
          description: topic.restricted,
          item: `${url}#${topic.id}`,
        })),
      },
    ],
  };
}

function guideStaticHtml(guide) {
  const escape = (value) => escapeAttribute(value);
  const list = (items) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`;

  return [
    '<main class="article-static">',
    `<h1>${escape(guide.title)}</h1>`,
    `<p>${escape(guide.lead)}</p>`,
    guide.intro.map((block) => `<h2>${escape(block.title)}</h2>${list(block.items)}`).join(''),
    `<h2>${escape(guide.goldenRule.title)}</h2><p>${escape(guide.goldenRule.detail)}</p>`,
    guide.topics
      .map((topic) => [
        `<section id="${escape(topic.id)}">`,
        `<h2>${escape(topic.title)}</h2>`,
        topic.standard ? `<p>${escape(topic.standard)}</p>` : '',
        `<p>Какво се ограничава: ${escape(topic.restricted)}</p>`,
        '<p>Какво поваля публикацията:</p>',
        list(topic.avoid),
        '<p>Вместо това:</p>',
        list(topic.instead),
        `<p>Преди: ${escape(topic.example.before)}</p>`,
        `<p>След: ${escape(topic.example.after)}</p>`,
        '<p>Преди да публикувате:</p>',
        list(topic.checklist),
        '</section>',
      ].join(''))
      .join(''),
    guide.templates ? `<h2>Текстове, които минават прегледа</h2>${list(guide.templates)}` : '',
    `<h2>${escape(guide.closing.title)}</h2><ol>${guide.closing.steps.map((step) => `<li>${escape(step)}</li>`).join('')}</ol>`,
    '<p>Unban Solutions не е свързана с Meta, TikTok или друга платформа. Ръководството следва публично публикуваните правила, които се променят. Не е юридически съвет.</p>',
    '<p><a href="/vidove-sanktsii">Справочник на санкциите</a> · <a href="/diagnostika">Диагностика</a> · <a href="/contact">Изпратете казуса си</a></p>',
    '</main>',
  ].join('');
}

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

for (const guide of rulesGuides) {
  routes.push({
    path: `/pravila/${guide.slug}`,
    title: guide.metaTitle,
    description: guide.metaDescription,
    schema: guideSchema(guide),
    rootHtml: guideStaticHtml(guide),
  });
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
  { loc: `${siteUrl}/vidove-sanktsii`, lastmod: sanctionsReference.updated, changefreq: 'monthly', priority: '0.9' },
  { loc: `${siteUrl}/diagnostika`, lastmod: sanctionsReference.updated, changefreq: 'monthly', priority: '0.8' },
  { loc: `${siteUrl}/blog`, lastmod: latestDate, changefreq: 'weekly', priority: '0.8' },
  { loc: `${siteUrl}/privacy-policy`, lastmod: '2026-07-19', changefreq: 'yearly', priority: '0.4' },
  { loc: `${siteUrl}/terms`, lastmod: '2026-07-19', changefreq: 'yearly', priority: '0.4' },
  { loc: `${siteUrl}/payments-and-refunds`, lastmod: '2026-07-19', changefreq: 'yearly', priority: '0.4' },
];
const guideSitemapEntries = rulesGuides.map((guide) => ({
  loc: `${siteUrl}/pravila/${guide.slug}`,
  lastmod: guide.updated,
  changefreq: 'monthly',
  priority: '0.8',
}));
const articleSitemapEntries = published.map((article) => ({
  loc: `${siteUrl}/blog/${article.slug}`,
  lastmod: article.date,
  changefreq: 'monthly',
  priority: '0.7',
}));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticSitemapEntries, ...guideSitemapEntries, ...articleSitemapEntries]
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
