import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ListChecks, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import RiskBadge from '@/components/RiskBadge';
import { diagnosticByLang, findSanction, type DiagnosticOption } from '@/data/reference';
import { trackEvent } from '@/lib/analytics';

const SITE_URL = 'https://www.unbansolutions.com';
const PAGE_URL = `${SITE_URL}/diagnostika`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      name: 'Каква е моята санкция',
      description:
        'Кратка диагностика, която разпознава коя санкция е наложена по описанието на симптомите и показва първите стъпки.',
      url: PAGE_URL,
      inLanguage: 'bg',
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumbs`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Видове санкции', item: `${SITE_URL}/vidove-sanktsii` },
        { '@type': 'ListItem', position: 3, name: 'Диагностика', item: PAGE_URL },
      ],
    },
  ],
};

interface Answer {
  node: string;
  label: string;
}

export default function Diagnostic() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const tree = diagnosticByLang[lang];
  const [current, setCurrent] = useState(tree.root);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);

  const node = tree.nodes[current];
  const result = resultId ? findSanction(resultId, lang) : undefined;

  const choose = (option: DiagnosticOption) => {
    if (!answers.length) trackEvent('diagnostic_started');
    if (option.result) {
      setAnswers((previous) => [...previous, { node: current, label: option.label }]);
      setResultId(option.result);
      // Само броим завършените диагностики — типът санкция е информация по казуса
      // и не заминава към аналитиката.
      trackEvent('diagnostic_completed');
      return;
    }
    if (!option.next) return;
    setAnswers((previous) => [...previous, { node: current, label: option.label }]);
    setCurrent(option.next);
  };

  const goBack = () => {
    const previous = answers.at(-1);
    if (!previous) return;
    setAnswers((rest) => rest.slice(0, -1));
    setResultId(null);
    setCurrent(previous.node);
  };

  const restart = () => {
    setAnswers([]);
    setResultId(null);
    setCurrent(tree.root);
  };

  return (
    <>
      <SEOMeta
        title={isBg ? 'Каква е моята санкция? Бърза диагностика | Unban Solutions' : 'Which sanction am I facing? | Unban Solutions'}
        description={isBg
          ? 'Отговорете на два-три въпроса и разберете коя мярка е наложена на профила ви, къде се вижда официално и какви са първите стъпки.'
          : 'Answer two or three questions to identify which measure was applied to your account, where it is officially visible and what the first steps are.'}
        keywords="каква е моята санкция, защо ми свалиха поста, защо не мога да публикувам, шадоубан проверка, отказана реклама, деактивиран акаунт"
        canonical={PAGE_URL}
        structuredData={structuredData}
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/60 pt-24 pb-8 sm:pt-28 sm:pb-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-[90px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
            <p className="section-kicker">{isBg ? 'Диагностика' : 'Diagnostic'}</p>
            <h1 className="mt-3 text-[clamp(2rem,5.5vw,3.1rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-950">
              {isBg ? 'Каква е ' : 'Which '}
              <span className="gradient-text">{isBg ? 'вашата санкция' : 'sanction'}</span>
              {isBg ? '?' : ' are you facing?'}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-700">
              {isBg
                ? 'Два-три въпроса по симптомите. Резултатът показва коя мярка стои зад тях, къде се вижда официално и какво има смисъл да направите първо.'
                : 'Two or three questions about the symptoms. The result names the measure behind them, where it is officially visible and what to do first.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-9 sm:py-12">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            {!result && node && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                    {isBg ? 'Въпрос' : 'Question'} {answers.length + 1}
                  </p>
                  {answers.length > 0 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-bold text-slate-600 transition-colors hover:text-slate-900"
                    >
                      <ArrowLeft size={15} aria-hidden="true" />
                      {isBg ? 'Назад' : 'Back'}
                    </button>
                  )}
                </div>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{node.question}</h2>
                {node.hint && <p className="mt-2 text-sm leading-6 text-slate-600">{node.hint}</p>}

                <div className="mt-6 grid gap-3">
                  {node.options.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => choose(option)}
                      className="group flex min-h-11 w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 transition-colors group-hover:border-blue-500">
                        <span className="h-2 w-2 rounded-full bg-transparent transition-colors group-hover:bg-blue-600" />
                      </span>
                      <span>
                        <span className="block text-base font-bold text-slate-950">{option.label}</span>
                        <span className="mt-0.5 block text-sm leading-6 text-slate-600">{option.detail}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {answers.length > 0 && (
                  <p className="mt-5 text-xs leading-6 text-slate-500">
                    {isBg ? 'Досега: ' : 'So far: '}
                    {answers.map((answer) => answer.label).join(' → ')}
                  </p>
                )}
              </div>
            )}

            {result && (
              <div aria-live="polite">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                    {isBg ? 'Най-вероятната мярка' : 'Most likely measure'}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-950">{result.title}</h2>
                    <RiskBadge risk={result.risk} />
                  </div>
                  <p className="mt-2 text-base leading-7 text-slate-600">{result.summary}</p>

                  <dl className="mt-5 space-y-2.5 text-sm leading-6">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-bold text-slate-900 sm:w-[8.5rem]">{isBg ? 'Къде се вижда' : 'Where to check'}</dt>
                      <dd className="text-slate-600">{result.whereToSee}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <dt className="shrink-0 font-bold text-slate-900 sm:w-[8.5rem]">{isBg ? 'Типични причини' : 'Typical causes'}</dt>
                      <dd className="text-slate-600">{result.causes}</dd>
                    </div>
                  </dl>

                  <p className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900">
                    <ListChecks size={16} className="text-blue-700" aria-hidden="true" />
                    {isBg ? 'Първи стъпки (до 48 часа)' : 'First steps (within 48 hours)'}
                  </p>
                  <ol className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                    {result.firstSteps.map((step, index) => (
                      <li key={step} className="flex gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-slate-100 pt-5">
                    <Link
                      to="/contact"
                      state={{ issue: result.issue }}
                      className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3 text-sm font-bold text-white transition-[filter] hover:brightness-95"
                    >
                      {isBg ? 'Изпратете казуса' : 'Send your case'} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <Link
                      to={`/vidove-sanktsii#${result.id}`}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                    >
                      {isBg ? 'Вижте в справочника' : 'Open in the reference'}
                    </Link>
                    {result.article && (
                      <Link
                        to={`/blog/${result.article}`}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                      >
                        <BookOpen size={15} aria-hidden="true" />
                        {isBg ? 'Подробна статия' : 'Full article'}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs leading-6 text-slate-500">
                    {isBg ? 'Вашите отговори: ' : 'Your answers: '}
                    {answers.map((answer) => answer.label).join(' → ')}
                  </p>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
                  >
                    <RotateCcw size={15} aria-hidden="true" />
                    {isBg ? 'Започнете отначало' : 'Start over'}
                  </button>
                </div>
              </div>
            )}

            <p className="mt-6 text-xs leading-6 text-slate-500">
              {isBg
                ? 'Диагностиката е ориентир по описаните симптоми, а не официално становище. Точната мярка се потвърждава от Състояние на акаунта и от уведомлението на платформата. Unban Solutions не е свързана с Meta, TikTok или друга платформа.'
                : 'This questionnaire is a guide based on symptoms, not an official statement. The exact measure is confirmed in Account Quality and in the platform notification. Unban Solutions is not affiliated with Meta, TikTok or any other platform.'}
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 py-9">
          <div className="mx-auto max-w-3xl px-5 text-center sm:px-6">
            <h2 className="text-xl font-bold text-slate-950">
              {isBg ? 'Нищо от изброеното не съвпада?' : 'None of these match?'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isBg
                ? 'Опишете какво се е случило и какво пише в уведомлението — ще получите първоначална оценка до 24 часа.'
                : 'Describe what happened and what the notification says — you will get an initial assessment within 24 hours.'}
            </p>
            <Link
              to="/contact"
              state={{ issue: 'other' }}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-blue-300 hover:text-blue-800"
            >
              {isBg ? 'Опишете казуса' : 'Describe your case'} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
