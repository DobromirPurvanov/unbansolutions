import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { publishedArticles, type BlogArticle } from '@/generated/blog-data';
import { formatDate } from '@/lib/dates';
import NotFound from '@/pages/NotFound';

const SITE_URL = 'https://www.unbansolutions.com';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

// Mirrors the schema injected by scripts/prerender.mjs so the client render
// replaces the prerendered JSON-LD with identical content.
function buildStructuredData(article: BlogArticle) {
  const url = `${SITE_URL}/blog/${article.slug}`;
  const graph: Record<string, unknown>[] = [
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
      author: { '@id': ORGANIZATION_ID },
      publisher: { '@id': ORGANIZATION_ID },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      image: `${SITE_URL}/icon-512.png`,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Блог', item: `${SITE_URL}/blog` },
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

export default function BlogPost() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const article = publishedArticles.find((a) => a.slug === slug);
  const structuredData = useMemo(
    () => (article ? buildStructuredData(article) : undefined),
    [article],
  );

  if (!article) return <NotFound />;

  const related = publishedArticles.filter((a) => a.slug !== article.slug).slice(0, 3);
  // Английската версия се показва само ако е преведена; иначе остава българската с бележка.
  const english = !isBg && article.hasEnglish;
  const bodyHtml = english ? article.bodyHtmlEn : article.bodyHtml;
  const faq = english ? article.faqEn : article.faq;
  const tags = english ? article.tagsEn : article.tags;

  return (
    <>
      <SEOMeta
        title={`${english ? article.titleEn : article.title} | Unban Solutions`}
        description={english ? article.descriptionEn : article.description}
        keywords={english ? article.keywordsEn : article.keywords}
        canonical={`${SITE_URL}/blog/${article.slug}`}
        type="article"
        structuredData={structuredData}
      />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-24 pb-8 sm:pt-28 sm:pb-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-[90px]" />
          <div className="relative mx-auto max-w-[820px] px-6">
            <Link
              to="/blog"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 transition-colors hover:text-blue-900"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              {isBg ? 'Всички статии' : 'All articles'}
            </Link>
            <h1 className="mb-4 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-tight text-slate-900">
              {english ? article.titleEn : article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={12} aria-hidden="true" />
                {isBg ? 'Публикувано на ' : 'Published '}
                {formatDate(article.date, lang)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={12} aria-hidden="true" />
                {isBg ? `${article.readTime} четене` : `${article.readTimeEn} read`}
              </span>
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
            {!isBg && !article.hasEnglish && (
              <p className="mt-4 rounded-lg bg-violet-50 px-4 py-3 text-xs leading-relaxed text-violet-800">
                This article is available in Bulgarian. An English version is planned.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-[820px] px-6">
            <article>
              <div className="article-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

              {faq.length > 0 && (
                <section className="mt-10">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">
                    {isBg ? 'Често задавани въпроси' : 'Frequently asked questions'}
                  </h2>
                  <div className="space-y-3">
                    {faq.map((item) => (
                      <details key={item.question} className="faq-item glass-card group">
                        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-bold text-slate-900">
                          {item.question}
                        </summary>
                        <div
                          className="article-body px-5 pb-4 pt-0 text-sm"
                          dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                        />
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-slate-50 py-10">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
              <p className="label-mono mb-3">{isBg ? 'Още по темата' : 'Related articles'}</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <article key={item.slug} className="glass-card-hover flex h-full flex-col p-5">
                    <div className="mb-2 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{formatDate(item.date, lang)}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={11} aria-hidden="true" />
                        {isBg ? item.readTime : item.readTimeEn}
                      </span>
                    </div>
                    <h3 className="mb-2 text-sm font-bold leading-snug text-slate-900">
                      <Link to={`/blog/${item.slug}`} className="transition-colors hover:text-blue-700">
                        {isBg ? item.title : item.titleEn}
                      </Link>
                    </h3>
                    <p className="flex-1 text-xs leading-relaxed text-slate-600">
                      {isBg ? item.excerpt : item.excerptEn}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 py-10">
          <div className="mx-auto max-w-[520px] px-6 text-center">
            <h2 className="mb-3 text-xl font-bold text-white">
              {isBg ? 'Проблемът вече е факт?' : 'Already dealing with this issue?'}
            </h2>
            <p className="mb-5 text-sm text-blue-100">
              {isBg
                ? 'Опишете казуса си и ще получите безплатна първоначална оценка до 24 часа.'
                : 'Describe your case and get a free initial assessment within 24 hours.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50"
            >
              {isBg ? 'Изпрати казуса' : 'Send your case'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
