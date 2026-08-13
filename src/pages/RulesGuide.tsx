import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { ArrowRight, Check, ListChecks, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { rulesGuides, type RulesGuide as Guide, type RulesGuideKey } from '@/data/reference';

const SITE_URL = 'https://www.unbansolutions.com';
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const OTHER_GUIDE: Record<RulesGuideKey, { key: RulesGuideKey; label: string }> = {
  organic: { key: 'ads', label: 'Правилата за реклами' },
  ads: { key: 'organic', label: 'Правилата за органично съдържание' },
};

function guideUrl(guide: Guide) {
  return `${SITE_URL}/pravila/${guide.slug}`;
}

// Отразява схемата, която scripts/prerender.mjs слага в статичния HTML.
function buildGuideSchema(guide: Guide) {
  const url = guideUrl(guide);
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
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Видове санкции', item: `${SITE_URL}/vidove-sanktsii` },
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

export default function RulesGuidePage({ guideKey }: { guideKey: RulesGuideKey }) {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';
  const guide = rulesGuides[guideKey];
  const other = rulesGuides[OTHER_GUIDE[guideKey].key];

  return (
    <>
      <SEOMeta
        title={guide.metaTitle}
        description={guide.metaDescription}
        keywords={guide.keywords}
        canonical={guideUrl(guide)}
        structuredData={buildGuideSchema(guide)}
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 pt-24 pb-9 sm:pt-28 sm:pb-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-[90px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{guide.kicker}</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2rem,6vw,3.4rem)] font-extrabold leading-[1.07] tracking-[-0.04em] text-slate-950">
              {guide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">{guide.lead}</p>
            {!isBg && (
              <p className="mt-5 max-w-2xl rounded-xl bg-violet-50 px-4 py-3 text-xs leading-relaxed text-violet-800">
                This guide is written in Bulgarian. An English version is planned.
              </p>
            )}

            <nav aria-label={isBg ? 'Съдържание' : 'Contents'} className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {guide.topics.map((topic, index) => (
                <a
                  key={topic.id}
                  href={`#${topic.id}`}
                  className="flex min-h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 backdrop-blur transition-colors hover:border-blue-300 hover:text-blue-800"
                >
                  <span className="text-xs font-extrabold text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                  {topic.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {guide.intro.map((block) => (
                <article key={block.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                  <h2 className="text-xl font-bold text-slate-950">{block.title}</h2>
                  <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-700">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-indigo-200 bg-gradient-to-br from-blue-50 to-violet-50 p-5 sm:p-6">
              <ShieldCheck size={22} className="mt-0.5 shrink-0 text-indigo-700" aria-hidden="true" />
              <div>
                <p className="text-base font-bold text-slate-950">{guide.goldenRule.title}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-700">{guide.goldenRule.detail}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl space-y-5 px-5 sm:px-6">
            {guide.topics.map((topic, index) => (
              <article
                key={topic.id}
                id={topic.id}
                className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-7"
                data-reveal
                style={{ '--reveal-delay': `${Math.min(index, 2) * 45}ms` } as CSSProperties}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-extrabold text-blue-700">{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="text-2xl font-bold text-slate-950">{topic.title}</h2>
                </div>
                {topic.standard && (
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{topic.standard}</p>
                )}
                <p className="mt-3 text-base leading-7 text-slate-700">{topic.restricted}</p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-rose-800">
                      <X size={16} aria-hidden="true" />
                      {isBg ? 'Какво поваля публикацията' : 'What gets it taken down'}
                    </p>
                    <ul className="mt-2.5 space-y-2 text-sm leading-6 text-slate-700">
                      {topic.avoid.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                      <Check size={16} aria-hidden="true" />
                      {isBg ? 'Вместо това' : 'Do this instead'}
                    </p>
                    <ul className="mt-2.5 space-y-2 text-sm leading-6 text-slate-700">
                      {topic.instead.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{isBg ? 'Преди' : 'Before'}</p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">{topic.example.before}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{isBg ? 'След' : 'After'}</p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-700">{topic.example.after}</p>
                  </div>
                </div>

                <p className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-900">
                  <ListChecks size={16} className="text-blue-700" aria-hidden="true" />
                  {isBg ? 'Преди да публикувате' : 'Before you publish'}
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                  {topic.checklist.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Check size={15} className="mt-1 shrink-0 text-blue-700" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {guide.templates && (
          <section className="bg-white py-10 sm:py-12">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <p className="section-kicker">{isBg ? 'Готови формулировки' : 'Ready-made wording'}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                {isBg ? 'Текстове, които минават прегледа' : 'Wording that passes review'}
              </h2>
              <ul className="mt-6 grid gap-3 md:grid-cols-3">
                {guide.templates.map((template) => (
                  <li key={template} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {template}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="border-t border-slate-200 bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-950">{guide.closing.title}</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {guide.closing.steps.map((step, index) => (
                <li key={step} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-700 text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/pravila/${other.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
              >
                {OTHER_GUIDE[guideKey].label} <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                to="/vidove-sanktsii"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
              >
                {isBg ? 'Справочник на санкциите' : 'Sanctions reference'} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-8 text-xs leading-6 text-slate-500">
              {isBg
                ? 'Unban Solutions не е свързана с Meta, TikTok или друга платформа. Ръководството следва публично публикуваните правила, които се променят — при съмнение проверявайте актуалната версия в помощния център на платформата. Не е юридически съвет.'
                : 'Unban Solutions is not affiliated with Meta, TikTok or any other platform. This guide follows publicly published policies, which change over time. Not legal advice.'}
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-800 via-indigo-800 to-violet-800 py-10 sm:py-12">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white">
                {isBg ? 'Мярката вече е наложена?' : 'Already sanctioned?'}
              </h2>
              <p className="mt-3 text-base leading-7 text-blue-100">
                {isBg
                  ? 'Разберете коя точно е санкцията и какви са първите стъпки, или изпратете казуса за оценка.'
                  : 'Identify the exact measure and the first steps, or send the case for assessment.'}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/diagnostika"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-800 hover:bg-blue-50"
              >
                {isBg ? 'Диагностика' : 'Diagnostic'} <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-base font-bold text-white hover:bg-white/10"
              >
                {isBg ? 'Изпратете казуса' : 'Send your case'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
