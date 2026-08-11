import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const FAQ_HEADING = 'Често задавани въпроси';
const WORDS_PER_MINUTE = 180;

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error('Missing frontmatter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^(\w+):\s*(.+)$/);
    if (!pair) continue;
    const [, key, value] = pair;
    if (value.startsWith('[')) {
      meta[key] = [...value.matchAll(/"([^"]*)"/g)].map((m) => m[1]);
    } else {
      meta[key] = value.replace(/^"|"$/g, '');
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

// Inline markdown: links first (URLs may contain characters the other rules touch),
// then bold and italic. `publishedSlugs` gates internal blog links so an article can
// reference a future post: the link renders as plain text until the target is live.
function renderInline(text, publishedSlugs) {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (full, label, url) => {
    if (url.startsWith('/blog/')) {
      const slug = url.slice('/blog/'.length).replace(/\/$/, '');
      return publishedSlugs.has(slug) ? `<a href="${url}">${label}</a>` : label;
    }
    if (url.startsWith('/')) return `<a href="${url}">${label}</a>`;
    if (url.startsWith('https://') || url.startsWith('http://')) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    }
    return full;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return html;
}

function stripInline(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}

function headingId(text) {
  return stripInline(text)
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function markdownToHtml(markdown, publishedSlugs = new Set()) {
  const lines = markdown.split('\n');
  const out = [];
  let list = null; // { tag: 'ul' | 'ol', items: [] }
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${renderInline(paragraph.join(' '), publishedSlugs)}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.tag}>${list.items.map((item) => `<li>${renderInline(item, publishedSlugs)}</li>`).join('')}</${list.tag}>`);
    list = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.max(heading[1].length, 2); // demote stray H1s: the page owns its H1
      out.push(`<h${level} id="${headingId(heading[2])}">${renderInline(heading[2], publishedSlugs)}</h${level}>`);
      continue;
    }
    const unordered = trimmed.match(/^-\s+(.*)$/);
    if (unordered) {
      flushParagraph();
      if (!list || list.tag !== 'ul') { flushList(); list = { tag: 'ul', items: [] }; }
      list.items.push(unordered[1]);
      continue;
    }
    const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      flushParagraph();
      if (!list || list.tag !== 'ol') { flushList(); list = { tag: 'ol', items: [] }; }
      list.items.push(ordered[1]);
      continue;
    }
    if (list) {
      // continuation line inside a list item
      list.items[list.items.length - 1] += ` ${trimmed}`;
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return out.join('\n');
}

function splitFaq(body) {
  const marker = `## ${FAQ_HEADING}`;
  const index = body.indexOf(marker);
  if (index === -1) return { main: body.trim(), faqSource: '' };
  return {
    main: body.slice(0, index).trim(),
    faqSource: body.slice(index + marker.length).trim(),
  };
}

function parseFaq(faqSource, publishedSlugs) {
  if (!faqSource) return [];
  return faqSource
    .split(/^###\s+/m)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [questionLine, ...rest] = chunk.split('\n');
      const answerMarkdown = rest.join('\n').trim();
      return {
        question: stripInline(questionLine.trim()),
        answer: stripInline(answerMarkdown).replace(/\s*\n\s*/g, ' '),
        answerHtml: markdownToHtml(answerMarkdown, publishedSlugs),
      };
    });
}

function countWords(markdown) {
  return stripInline(markdown)
    .replace(/^#{1,4}\s+/gm, '')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export async function loadArticles() {
  const files = (await readdir(CONTENT_DIR)).filter((name) => name.endsWith('.md')).sort();
  const cutoff = todayUtc();
  const parsed = [];
  for (const file of files) {
    const raw = await readFile(path.join(CONTENT_DIR, file), 'utf8');
    const { meta, body } = parseFrontmatter(raw);
    parsed.push({ slug: file.replace(/\.md$/, ''), meta, body });
  }
  const publishedSlugs = new Set(parsed.filter((a) => a.meta.date <= cutoff).map((a) => a.slug));

  const articles = parsed.map(({ slug, meta, body }) => {
    const { main, faqSource } = splitFaq(body);
    const words = countWords(body);
    const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
    return {
      slug,
      title: meta.title,
      titleEn: meta.titleEn || meta.title,
      date: meta.date,
      excerpt: meta.excerpt,
      excerptEn: meta.excerptEn || meta.excerpt,
      description: meta.description || meta.excerpt,
      keywords: meta.keywords || '',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      wordCount: words,
      readTime: `${minutes} мин`,
      readTimeEn: `${minutes} min`,
      bodyHtml: markdownToHtml(main, publishedSlugs),
      faq: parseFaq(faqSource, publishedSlugs),
    };
  });

  const published = articles
    .filter((a) => a.date <= cutoff)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const upcoming = articles
    .filter((a) => a.date > cutoff)
    .sort((a, b) => (a.date > b.date ? 1 : -1));
  return { published, upcoming, all: articles };
}
