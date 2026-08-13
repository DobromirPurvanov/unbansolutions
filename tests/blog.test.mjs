import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { loadArticles, markdownToHtml } from '../scripts/blog-lib.mjs';

const { all, published, upcoming } = await loadArticles();

test('every article carries complete frontmatter', () => {
  assert.ok(all.length >= 6);
  for (const article of all) {
    assert.ok(article.title, `${article.slug}: missing title`);
    assert.ok(article.titleEn, `${article.slug}: missing titleEn`);
    assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/, `${article.slug}: bad date`);
    assert.ok(article.excerpt, `${article.slug}: missing excerpt`);
    assert.ok(article.description, `${article.slug}: missing description`);
    assert.ok(article.description.length <= 200, `${article.slug}: description too long for a meta tag`);
    assert.ok(article.keywords, `${article.slug}: missing keywords`);
    assert.ok(article.tags.length > 0, `${article.slug}: missing tags`);
  }
});

test('articles are long-form but under the 1500-word brief', () => {
  for (const article of all) {
    assert.ok(article.wordCount >= 800, `${article.slug}: only ${article.wordCount} words`);
    assert.ok(article.wordCount <= 1600, `${article.slug}: ${article.wordCount} words exceeds the brief`);
  }
});

test('every article has an FAQ block for the FAQPage schema', () => {
  for (const article of all) {
    assert.ok(article.faq.length >= 3, `${article.slug}: only ${article.faq.length} FAQ items`);
    for (const item of article.faq) {
      assert.ok(item.question.endsWith('?'), `${article.slug}: FAQ question without a question mark`);
      assert.ok(item.answer.length > 40, `${article.slug}: thin FAQ answer`);
    }
  }
});

test('slugs and publish dates are unique (weekly cadence, no cannibalization)', () => {
  assert.equal(new Set(all.map((a) => a.slug)).size, all.length);
  assert.equal(new Set(all.map((a) => a.date)).size, all.length);
});

test('published/upcoming split matches the publish dates', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const article of published) assert.ok(article.date <= today);
  for (const article of upcoming) assert.ok(article.date > today);
  assert.equal(published.length + upcoming.length, all.length);
});

test('generated HTML contains no unconverted markdown', () => {
  for (const article of all) {
    const html = article.bodyHtml + article.faq.map((f) => f.answerHtml).join('');
    assert.ok(!html.includes('**'), `${article.slug}: raw bold marker in HTML`);
    assert.ok(!/\]\(/.test(html), `${article.slug}: raw markdown link in HTML`);
    assert.ok(!/^#/m.test(html), `${article.slug}: raw heading marker in HTML`);
  }
});

test('internal blog links only point to real articles', () => {
  const slugs = new Set(all.map((a) => a.slug));
  for (const article of all) {
    const html = article.bodyHtml + article.faq.map((f) => f.answerHtml).join('');
    for (const [, href] of html.matchAll(/href="\/blog\/([^"]+)"/g)) {
      assert.ok(slugs.has(href), `${article.slug}: links to unknown article ${href}`);
    }
  }
});

test('internal links from articles point to routes that exist', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const routes = new Set([...app.matchAll(/path="(\/[^"*:]*)"/g)].map((match) => match[1]));

  for (const article of all) {
    const html = article.bodyHtml + article.faq.map((f) => f.answerHtml).join('');
    for (const [, href] of html.matchAll(/href="(\/[^"]+)"/g)) {
      if (href.startsWith('/blog/')) continue; // покрито от теста по-горе
      const path = href.split('#')[0];
      assert.ok(routes.has(path), `${article.slug}: сочи към несъществуващ маршрут ${path}`);
    }
  }
});

test('unpublished articles are never linked, published ones are', () => {
  const today = new Date().toISOString().slice(0, 10);
  const publishedSlugs = new Set(all.filter((a) => a.date <= today).map((a) => a.slug));
  const cases = [
    { md: '[линк](/blog/some-future-post)', linked: false },
    { md: `[линк](/blog/${[...publishedSlugs][0]})`, linked: true },
  ];
  for (const { md, linked } of cases) {
    const html = markdownToHtml(md, publishedSlugs);
    assert.equal(html.includes('<a '), linked, md);
  }
});
