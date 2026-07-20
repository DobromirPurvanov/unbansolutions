import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  ChevronRight,
  Clock3,
  EyeOff,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Home() {
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  const commonCases = [
    {
      icon: Ban,
      title: isBg ? 'Спрян или изтрит профил' : 'Suspended or deleted account',
      text: isBg ? 'Оценка на ограничението и възможните официални канали.' : 'Assessment of the restriction and available official channels.',
      issue: 'banned',
    },
    {
      icon: KeyRound,
      title: isBg ? 'Хакнат или откраднат профил' : 'Hacked or stolen account',
      text: isBg ? 'Подреждане на доказателствата и стъпките за възстановяване.' : 'Organising the evidence and recovery steps.',
      issue: 'hacked',
    },
    {
      icon: EyeOff,
      title: isBg ? 'Shadowban или ограничения' : 'Shadowban or restrictions',
      text: isBg ? 'Преглед на видимостта, функциите и приложимите правила.' : 'Review of visibility, features and relevant policies.',
      issue: 'shadowban',
    },
  ];

  const steps = [
    {
      num: '01',
      icon: MessageSquareText,
      title: isBg ? 'Изпращате казуса' : 'Send your case',
      text: isBg ? 'Посочвате платформата, проблема и наличните известия.' : 'Tell us the platform, issue and any notices you have.',
    },
    {
      num: '02',
      icon: SearchCheck,
      title: isBg ? 'Получавате оценка' : 'Receive an assessment',
      text: isBg ? 'Преглеждаме информацията и обясняваме реалистичните опции.' : 'We review the information and explain the realistic options.',
    },
    {
      num: '03',
      icon: FileCheck2,
      title: isBg ? 'Действаме по план' : 'Proceed with a plan',
      text: isBg ? 'След писмена оферта подготвяме и проследяваме официалните действия.' : 'After a written offer, we prepare and follow the official actions.',
    },
  ];

  const commitments = [
    {
      icon: Clock3,
      title: isBg ? 'Първи отговор до 24 часа' : 'First response within 24 hours',
      text: isBg ? 'Получавате първоначална оценка и ясна следваща стъпка.' : 'You receive an initial assessment and a clear next step.',
    },
    {
      icon: LockKeyhole,
      title: isBg ? 'Без пароли и кодове' : 'No passwords or codes',
      text: isBg ? 'Никога не искаме парола или код за двуфакторна защита.' : 'We never ask for a password or two-factor authentication code.',
    },
    {
      icon: ShieldCheck,
      title: isBg ? 'Реалистична комуникация' : 'Realistic communication',
      text: isBg ? 'Не обещаваме решение, което зависи от самата платформа.' : 'We do not promise an outcome controlled by the platform.',
    },
  ];

  const platforms = ['Instagram', 'TikTok', 'Facebook', 'YouTube', 'X', 'LinkedIn', 'Snapchat', 'Pinterest'];
  const priceOptions = [
    { name: t('pp.p3.name'), price: '100 EUR' },
    { name: t('pp.p1.name'), price: '250 EUR' },
    { name: t('pp.p2.name'), price: '500 EUR' },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Unban Solutions | Защита и възстановяване на акаунти' : 'Unban Solutions | Account protection and recovery'}
        description={isBg
          ? 'Професионална оценка, подготовка на обжалвания и съдействие при ограничени, спрени или компрометирани акаунти в социалните мрежи.'
          : 'Professional assessment, appeal preparation and assistance with restricted, suspended or compromised social media accounts.'
        }
        keywords={isBg
          ? 'възстановяване акаунт instagram, баннат акаунт tiktok, shadowban, откраднат профил, хакнат акаунт, дигитална защита'
          : 'recover instagram account, banned tiktok account, shadowban removal, hacked account recovery, digital protection'
        }
        canonical="https://www.unbansolutions.com/"
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 pt-24 pb-9 sm:pt-28 sm:pb-12 lg:pt-28 lg:pb-14">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
            <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-800 shadow-sm">
                <ShieldCheck size={17} aria-hidden="true" />
                {isBg ? 'Професионално съдействие за дигитални профили' : 'Professional support for digital accounts'}
              </div>

              <h1 className="max-w-3xl text-[clamp(2.35rem,8vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-slate-950">
                {t('hero.title')}
                <span className="gradient-text">{t('hero.titleSpan')}</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                {t('hero.desc')}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/contact" className="primary-cta w-full sm:w-auto">
                  {t('hero.cta1')}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link to="/pricing" className="secondary-cta w-full sm:w-auto">
                  {isBg ? 'Виж цените — от 100 EUR' : 'See pricing — from 100 EUR'}
                </Link>
              </div>

              <ul className="mt-7 grid gap-3 text-sm text-slate-700 sm:grid-cols-2" aria-label={isBg ? 'Важна информация' : 'Important information'}>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                  {t('hero.stat2')}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                  {t('hero.stat3')}
                </li>
              </ul>
            </div>

            <aside className="hero-panel-intro rounded-3xl border border-violet-200/70 bg-white p-4 shadow-[0_24px_70px_rgba(63,47,120,0.13)] sm:p-6" aria-labelledby="case-start-title">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-sm font-semibold text-blue-700">{isBg ? 'Кратка първоначална оценка' : 'Quick initial assessment'}</p>
                  <h2 id="case-start-title" className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                    {isBg ? 'Започнете от проблема' : 'Start with the issue'}
                  </h2>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <SearchCheck size={22} aria-hidden="true" />
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {commonCases.map((item) => (
                  <Link
                    key={item.issue}
                    to="/contact"
                    state={{ issue: item.issue }}
                    className="group flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
                      <item.icon size={19} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-900 sm:text-base">{item.title}</span>
                      <span className="mt-0.5 hidden text-sm leading-5 text-slate-600 sm:block">{item.text}</span>
                    </span>
                    <ChevronRight size={18} className="shrink-0 text-slate-400 transition-colors group-hover:text-blue-700" aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-900 px-4 py-3.5 text-white">
                <LockKeyhole size={18} className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
                <p className="text-sm leading-5 text-slate-200">
                  {isBg ? 'Формата е кратка. Не изпращайте пароли или кодове за потвърждение.' : 'The form is short. Never send passwords or verification codes.'}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-4" aria-labelledby="home-pricing-title">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p id="home-pricing-title" className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">
                  {isBg ? 'Цената е ясна предварително' : 'Know the price upfront'}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {isBg ? 'Точният обхват се потвърждава писмено.' : 'The exact scope is confirmed in writing.'}
                </p>
              </div>
              <Link to="/pricing" className="hidden min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-blue-700 hover:text-violet-700 sm:inline-flex">
                {isBg ? 'Всички цени' : 'All pricing'} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <dl className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 py-3">
              {priceOptions.map((option) => (
                <div key={option.price} className="min-w-0 px-2 text-center sm:px-5 sm:text-left">
                  <dt className="truncate text-[10px] font-semibold text-slate-500 sm:text-xs">{option.name}</dt>
                  <dd className="mt-0.5 text-base font-extrabold tracking-[-0.03em] text-slate-950 sm:text-xl">{option.price}</dd>
                </div>
              ))}
            </dl>

            <Link to="/pricing" className="mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-blue-700 hover:text-violet-700 sm:hidden">
              {isBg ? 'Какво включват цените' : 'What the prices include'} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-5" aria-label={isBg ? 'Поддържани платформи' : 'Supported platforms'}>
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:px-6 lg:flex-row lg:items-center lg:gap-8">
            <p className="shrink-0 text-sm font-semibold text-slate-500">
              {isBg ? 'Казуси за основните платформи' : 'Cases across major platforms'}
            </p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <span key={platform} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="section-kicker">{isBg ? 'Най-чести казуси' : 'Common cases'}</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                  {isBg ? 'Изберете проблема, който описва ситуацията ви' : 'Choose the issue that best describes your situation'}
                </h2>
              </div>
              <Link to="/services" className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-blue-700 hover:text-blue-900 sm:self-auto">
                {t('svc.all')} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {commonCases.map((item, index) => (
                <Link
                  key={item.issue}
                  to="/contact"
                  state={{ issue: item.issue }}
                  className="case-card group"
                  data-reveal
                  style={{ '--reveal-delay': `${index * 55}ms` } as CSSProperties}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 1 ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>
                    <item.icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{item.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    {isBg ? 'Оцени този казус' : 'Assess this case'}
                    <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="max-w-2xl">
              <p className="section-kicker">{t('proc.label')}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                {isBg ? 'Три ясни стъпки, без излишно обикаляне' : 'Three clear steps without unnecessary back-and-forth'}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{t('proc.sub')}</p>
            </div>

            <ol className="mt-9 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <li
                  key={step.num}
                  className="relative rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
                  data-reveal
                  style={{ '--reveal-delay': `${index * 55}ms` } as CSSProperties}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${index === 1 ? 'bg-violet-700' : 'bg-blue-700'}`}>
                      <step.icon size={20} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold tracking-[0.16em] text-slate-400">{step.num}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">{step.text}</p>
                </li>
              ))}
            </ol>

            <Link to="/process" className="secondary-cta mt-7 w-full sm:w-auto">
              {isBg ? 'Подробно за процеса' : 'See the full process'}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="bg-slate-950 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky-300">{isBg ? 'Какво да очаквате' : 'What to expect'}</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {isBg ? 'Ясна работа по казуса, без нереалистични обещания' : 'Clear case handling without unrealistic promises'}
              </h2>
            </div>

            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {commitments.map((item, index) => (
                <div
                  key={item.title}
                  className="border-l border-slate-700 pl-5"
                  data-reveal
                  style={{ '--reveal-delay': `${index * 55}ms` } as CSSProperties}
                >
                  <item.icon size={23} className={index === 1 ? 'text-violet-300' : 'text-sky-300'} aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 py-12 sm:py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-7 px-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">{t('cta.title')}</h2>
              <p className="mt-3 text-base leading-7 text-blue-100 sm:text-lg">{t('cta.desc')}</p>
            </div>
            <Link to="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-800 shadow-lg transition-colors hover:bg-blue-50 sm:w-auto">
              {t('cta.btn1')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
