import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, Eye, Flag, ListChecks, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import RiskBadge from '@/components/RiskBadge';
import { rulesGuides, sanctionsReference } from '@/data/reference';

const SITE_URL = 'https://www.unbansolutions.com';
const PAGE_URL = `${SITE_URL}/vidove-sanktsii`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const { strikePaths, sanctions, statusPlaces, reportOutcomes, reportSignals, reportSop, myths, updated } =
  sanctionsReference;

// Отразява схемата, която scripts/prerender.mjs слага в статичния HTML.
function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        name: 'Видове санкции в социалните мрежи',
        description:
          'Дванадесетте вида санкции в Instagram и Facebook: как изглежда всяка, къде се вижда, какви са причините и кои са първите стъпки.',
        url: PAGE_URL,
        inLanguage: 'bg',
        dateModified: updated,
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Видове санкции', item: PAGE_URL },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${PAGE_URL}#sanctions`,
        name: 'Видове санкции',
        itemListElement: sanctions.map((sanction, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: sanction.title,
          description: sanction.summary,
          item: `${PAGE_URL}#${sanction.id}`,
        })),
      },
    ],
  };
}

// Съдържанието е статично, затова схемата се сглобява веднъж при зареждане на модула.
const structuredData = buildStructuredData();

export default function Sanctions() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  return (
    <>
      <SEOMeta
        title={isBg
          ? 'Видове санкции в Instagram и Facebook | Unban Solutions'
          : 'Types of sanctions on Instagram and Facebook | Unban Solutions'}
        description={isBg
          ? 'Дванадесетте вида санкции в социалните мрежи: как изглежда всяка, къде се вижда в приложението, какви са типичните причини и кои са първите стъпки в първите 48 часа.'
          : 'The twelve types of sanctions on social platforms: what each looks like, where to find it, typical causes and the first steps within 48 hours.'}
        keywords="видове санкции, strike система, премахнато съдържание, демотиране, ограничени функции, деактивиран акаунт, отказана реклама, авторски права"
        canonical={PAGE_URL}
        structuredData={structuredData}
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 pt-24 pb-9 sm:pt-28 sm:pb-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-[90px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-24 bottom-[-9rem] h-64 w-64 rounded-full bg-blue-200/25 blur-[90px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Справочник' : 'Reference'}</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.1rem,6.4vw,3.6rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-slate-950">
              {isBg ? 'Дванадесетте вида ' : 'The twelve types of '}
              <span className="gradient-text">{isBg ? 'санкции' : 'sanctions'}</span>
              {isBg ? ' и какво прави всяка от тях' : ' and what each one does'}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {isBg
                ? 'Първата задача при всяка мярка е да разберете коя точно е тя. Оттам следват срокът, мястото, където се вижда, и стъпките, които имат смисъл.'
                : 'The first task in any enforcement case is identifying which measure you are actually facing. The deadline, the place to check it and the steps that matter all follow from that.'}
            </p>
            {!isBg && (
              <p className="mt-5 max-w-2xl rounded-xl bg-violet-50 px-4 py-3 text-xs leading-relaxed text-violet-800">
                This reference is written in Bulgarian. An English version is planned.
              </p>
            )}
            <Link
              to="/diagnostika"
              className="group mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-[filter] hover:brightness-95"
            >
              {isBg ? 'Не знаете коя е вашата? Направете диагностиката' : 'Not sure which one? Take the diagnostic'}
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { href: '#patheki', label: 'Strike пътеките' },
                { href: '#sanktsii', label: '12-те санкции' },
                { href: '#status', label: 'Къде се вижда статусът' },
                { href: '#reporti', label: 'Вълна от сигнали' },
                { href: '#mitove', label: 'Митове и реалност' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-sm font-bold text-slate-700 backdrop-blur transition-colors hover:border-blue-300 hover:text-blue-800"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="patheki" className="scroll-mt-24 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Как се натрупва' : 'How it accumulates'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {isBg ? 'Четирите strike пътеки' : 'The four strike paths'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {isBg
                ? 'Нарушенията не се събират в един общ кош. Всяка пътека има свои тригери и своя ескалация, затова чист профил в едната не ви пази в другата.'
                : 'Violations are not pooled together. Each path has its own triggers and escalation, so a clean record in one does not protect the others.'}
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {strikePaths.map((path, index) => (
                <article
                  key={path.id}
                  className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6"
                  data-reveal
                  style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as CSSProperties}
                >
                  <span className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${index % 2 === 1 ? 'via-violet-400' : 'via-blue-400'} to-transparent`} aria-hidden="true" />
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold text-slate-950">{path.name}</h3>
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{path.scope}</span>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm leading-6">
                    <div>
                      <dt className="font-bold text-slate-900">{isBg ? 'Тригери' : 'Triggers'}</dt>
                      <dd className="text-slate-600">{path.triggers}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-900">{isBg ? 'Ескалация' : 'Escalation'}</dt>
                      <dd className="text-slate-600">{path.escalation}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-900">{isBg ? 'Какво помага' : 'What helps'}</dt>
                      <dd className="text-slate-600">{path.response}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
              {isBg
                ? 'Точните прагове и срокове не са публични и се променят. Използвайте таблицата като оперативен ориентир, не като правилник.'
                : 'Exact thresholds and deadlines are not public and they change. Treat this as an operational guide, not a rulebook.'}
            </p>
          </div>
        </section>

        <section id="sanktsii" className="scroll-mt-24 border-y border-slate-200 bg-gradient-to-br from-slate-50 via-white to-violet-50/40 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Справочник' : 'Reference'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {isBg ? 'Санкция по санкция' : 'Sanction by sanction'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {isBg
                ? 'За всяка мярка: как изглежда отвън, къде се вижда официално, какво обикновено я причинява и какво има смисъл да направите в първите 48 часа.'
                : 'For each measure: what it looks like, where it is officially visible, what usually causes it and what makes sense in the first 48 hours.'}
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {sanctions.map((sanction, index) => (
                <article
                  key={sanction.id}
                  id={sanction.id}
                  className="flex h-full scroll-mt-24 flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6"
                  data-reveal
                  style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as CSSProperties}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-700">
                      {index + 1}
                    </span>
                    <RiskBadge risk={sanction.risk} />
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-slate-950">{sanction.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{sanction.summary}</p>

                  <dl className="mt-4 space-y-2.5 text-sm leading-6">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-bold text-slate-900 sm:w-[8.5rem]">{isBg ? 'Как изглежда' : 'What it looks like'}</dt>
                      <dd className="text-slate-600">{sanction.looksLike}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-bold text-slate-900 sm:w-[8.5rem]">{isBg ? 'Къде се вижда' : 'Where to check'}</dt>
                      <dd className="text-slate-600">{sanction.whereToSee}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-bold text-slate-900 sm:w-[8.5rem]">{isBg ? 'Типични причини' : 'Typical causes'}</dt>
                      <dd className="text-slate-600">{sanction.causes}</dd>
                    </div>
                  </dl>

                  <p className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <ListChecks size={16} className="text-blue-700" aria-hidden="true" />
                    {isBg ? 'Първи стъпки (до 48 часа)' : 'First steps (within 48 hours)'}
                  </p>
                  <ol className="mt-2 flex-1 space-y-2 text-sm leading-6 text-slate-700">
                    {sanction.firstSteps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-4">
                    <Link
                      to="/contact"
                      state={{ issue: sanction.issue }}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                    >
                      {isBg ? 'Оцени този казус' : 'Assess this case'} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    {sanction.article && (
                      <Link
                        to={`/blog/${sanction.article}`}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <BookOpen size={15} aria-hidden="true" />
                        {isBg ? 'Подробна статия' : 'Full article'}
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="status" className="scroll-mt-24 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Проверка' : 'Where to check'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {isBg ? 'Къде се вижда статусът на акаунта' : 'Where the account status is visible'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {isBg
                ? 'Преди да гадаете по обхвата, отворете местата, където платформата сама изписва какво е наложила.'
                : 'Before guessing from your reach, open the places where the platform states what it has applied.'}
            </p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {statusPlaces.map((place) => (
                <li key={place.name} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="flex items-start gap-2.5 text-base font-bold text-slate-950">
                    <Eye size={18} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                    {place.name}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{place.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="reporti" className="scroll-mt-24 border-y border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Организирани сигнали' : 'Coordinated reports'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {isBg ? 'Когато ви залеят със сигнали' : 'When the reports come in waves'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {isBg
                ? 'Сигналът от потребител не е присъда, а повод за проверка. Платформата тегли обема и скоростта на сигналите, надеждността на подателите, историята на акаунта и контекста на темата.'
                : 'A user report is a trigger for review, not a verdict. Platforms weigh the volume and speed of reports, the reliability of the senders, the account history and the context.'}
            </p>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <Flag size={18} className="text-blue-700" aria-hidden="true" />
                  {isBg ? 'Възможните изходи' : 'Possible outcomes'}
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-700">
                  {reportOutcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="flex items-center gap-2 text-base font-bold text-slate-950">
                  <ShieldAlert size={18} className="text-violet-700" aria-hidden="true" />
                  {isBg ? 'Признаци за координирана вълна' : 'Signs of a coordinated wave'}
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-700">
                  {reportSignals.map((signal) => (
                    <li key={signal} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h3 className="mt-10 text-xl font-bold text-slate-950">
              {isBg ? 'Какво да направите по ред' : 'What to do, in order'}
            </h3>
            <ol className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportSop.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-700 text-sm font-extrabold text-white">
                    {index + 1}
                  </span>
                  <p className="mt-3 text-base font-bold text-slate-950">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="mitove" className="scroll-mt-24 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Проверка на фактите' : 'Fact check'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {isBg ? 'Митове и реалност' : 'Myths and reality'}
            </h2>
            <div className="mt-8 space-y-4">
              {myths.map((item) => (
                <div key={item.myth} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <p className="text-base font-bold text-slate-950">„{item.myth}“</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.reality}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs leading-6 text-slate-500">
              {isBg
                ? 'Unban Solutions не е свързана с Meta, TikTok или друга платформа. Работим по публично публикуваните правила и процедури за обжалване. Съдържанието тук е оперативен ориентир, не юридически съвет.'
                : 'Unban Solutions is not affiliated with Meta, TikTok or any other platform. We work from publicly published policies and appeal procedures. This page is operational guidance, not legal advice.'}
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Превенция' : 'Prevention'}</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {isBg ? 'Правилата, по които се стига дотук' : 'The rules behind these measures'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {isBg
                ? 'Санкцията е следствие. Причината почти винаги е конкретно правило — за съдържанието или за рекламата.'
                : 'A sanction is the consequence. The cause is almost always a specific rule — for content or for ads.'}
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[rulesGuides.organic, rulesGuides.ads].map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/pravila/${guide.slug}`}
                  className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-colors hover:border-blue-300 sm:p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">{guide.kicker}</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-950">{guide.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{guide.lead}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    {isBg ? `${guide.topics.length} теми` : `${guide.topics.length} topics`}
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-800 via-indigo-800 to-violet-800 py-10 sm:py-12">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white">
                {isBg ? 'Не сте сигурни коя точно е вашата санкция?' : 'Not sure which sanction you are facing?'}
              </h2>
              <p className="mt-3 text-base leading-7 text-blue-100">
                {isBg
                  ? 'Опишете какво се е случило и какво пише в уведомлението. Ще получите първоначална оценка и конкретните следващи стъпки.'
                  : 'Describe what happened and what the notification says. You will get an initial assessment and concrete next steps.'}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                to="/diagnostika"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-800 hover:bg-blue-50"
              >
                {isBg ? 'Направете диагностиката' : 'Take the diagnostic'} <ArrowRight size={18} aria-hidden="true" />
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
