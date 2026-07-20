import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MessageSquareText, SearchCheck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Pricing() {
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  const plans = [
    {
      id: 'consultation',
      name: t('pp.p3.name'),
      description: isBg
        ? 'За ориентация по правилата, съдържанието и възможните следващи стъпки.'
        : 'For guidance on policies, content and the possible next steps.',
      price: '100 EUR',
      icon: MessageSquareText,
      features: [t('pp.p3.f1'), t('pp.p3.f2'), t('pp.p3.f3'), t('pp.p3.f4'), t('pp.p3.f5'), t('pp.p3.f6')],
      issue: 'other',
      featured: false,
    },
    {
      id: 'standard',
      name: t('pp.p1.name'),
      description: isBg
        ? 'За ограничено съдържание, функции, разпространение или shadowban.'
        : 'For restricted content, features, distribution or a shadowban.',
      price: '250 EUR',
      icon: SearchCheck,
      features: [t('pp.p1.f1'), t('pp.p1.f2'), t('pp.p1.f3'), t('pp.p1.f4')],
      issue: 'restricted',
      featured: true,
    },
    {
      id: 'complex',
      name: t('pp.p2.name'),
      description: isBg
        ? 'За изтрит или откраднат профил и други казуси с по-голям обхват.'
        : 'For deleted or stolen accounts and other cases with a broader scope.',
      price: '500 EUR',
      icon: ShieldCheck,
      features: [t('pp.p2.f1'), t('pp.p2.f2'), t('pp.p2.f3'), t('pp.p2.f4'), t('pp.p2.f5'), t('pp.p2.f6')],
      issue: '',
      featured: false,
    },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Цени за съдействие при проблеми с акаунти | Unban Solutions' : 'Account assistance pricing | Unban Solutions'}
        description={isBg
          ? 'Ясни цени за консултация, оценка и подготовка на казуси, без обещание за решение от платформата. Вижте какво включва всяка услуга.'
          : 'Clear prices for consultation, assessment and case preparation, without promising a platform decision. See what each service includes.'}
        keywords="цена възстановяване акаунт, колко струва unban, цена instagram акаунт, консултация shadowban"
        canonical="https://www.unbansolutions.com/pricing"
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50/60 to-violet-50/70 pt-24 pb-7 sm:pt-28 sm:pb-10">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -right-24 -top-20 h-64 w-64 rounded-full bg-violet-200/35 blur-3xl" />
            <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-blue-200/35 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-6">
            <p className="section-kicker">{t('pp.hero.label')}</p>
            <h1 className="mx-auto mt-2 max-w-3xl text-[clamp(2.05rem,8.5vw,3.75rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-slate-950 [text-wrap:balance]">
              {isBg ? 'Ясни цени според ' : 'Clear pricing based on '}<span className="bg-gradient-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent">{isBg ? 'сложността на казуса' : 'case complexity'}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700 sm:mt-4 sm:text-lg">
              {isBg
                ? 'Първо оценяваме ситуацията. Конкретният обхват и цена се потвърждават с писмена оферта преди започване.'
                : 'We assess the situation first. The exact scope and price are confirmed in writing before work begins.'}
            </p>

            <a
              href="#plans"
              className="group mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-2xl border border-indigo-200 bg-white/90 px-3 py-2.5 text-left shadow-[0_10px_30px_rgba(79,70,229,0.1)] backdrop-blur sm:mt-5 sm:gap-3 sm:px-4"
              aria-label={isBg
                ? 'Към трите ценови варианта: 100, 250 и 500 евро'
                : 'Go to the three pricing options: 100, 250 and 500 euros'}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-indigo-700">
                {isBg ? '3 варианта' : '3 options'}
              </span>
              <span className="h-4 w-px bg-indigo-200" aria-hidden="true" />
              <span className="whitespace-nowrap text-sm font-extrabold tracking-[-0.02em] text-slate-950 sm:text-base">
                100 · 250 · 500 <span className="text-xs tracking-[0.08em] text-violet-700">EUR</span>
              </span>
              <ArrowRight size={15} className="shrink-0 rotate-90 text-indigo-500 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="plans" className="scroll-mt-20 bg-white py-6 sm:py-14" aria-label={isBg ? 'Ценови варианти' : 'Pricing options'}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
              {plans.map((plan, index) => {
                const [amount, currency] = plan.price.split(' ');

                return (
                  <article
                    key={plan.id}
                    className={`relative flex h-full flex-col rounded-3xl border p-5 sm:p-7 ${
                      plan.featured
                        ? 'border-indigo-300 bg-gradient-to-b from-blue-50/90 via-white to-violet-50/70 shadow-[0_20px_55px_rgba(79,70,229,0.15)]'
                        : 'border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]'
                    }`}
                    data-reveal
                    style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
                  >
                    <span className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${plan.featured ? 'via-violet-500' : 'via-blue-300'} to-transparent`} aria-hidden="true" />

                    {plan.featured && (
                      <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-blue-700 to-violet-700 px-3 py-1 text-xs font-bold text-white shadow-sm sm:left-7">
                        {isBg ? 'За ограничени функции' : 'For feature restrictions'}
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-violet-100 text-indigo-700 shadow-sm ring-1 ring-indigo-100">
                        <plan.icon size={22} aria-hidden="true" />
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-950 sm:text-2xl">{plan.name}</h2>
                    </div>

                    <div className={`mt-4 rounded-2xl border px-4 py-4 ${
                      plan.featured
                        ? 'border-indigo-200 bg-gradient-to-r from-blue-100/80 to-violet-100/70'
                        : 'border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/60'
                    }`}>
                      <p className="flex items-end gap-2 text-slate-950">
                        <span className="text-[3.5rem] font-black leading-[0.86] tracking-[-0.065em] sm:text-6xl">{amount}</span>
                        <span className="pb-1 text-sm font-extrabold tracking-[0.14em] text-violet-700 sm:text-base">{currency}</span>
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                        {isBg ? 'еднократна цена' : 'one-time price'}
                      </p>
                    </div>

                    <p className="mt-4 text-base leading-7 text-slate-600 lg:min-h-14">{plan.description}</p>

                    <ul className="mt-5 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-base leading-6 text-slate-700">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                            <Check size={13} aria-hidden="true" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact" state={plan.issue ? { issue: plan.issue } : undefined} className={plan.featured ? 'primary-cta mt-7 w-full' : 'secondary-cta mt-7 w-full'}>
                      {isBg ? 'Изпрати казус за оценка' : 'Send a Case for Assessment'}
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>

            <div className="mt-7 rounded-2xl border border-indigo-200 bg-gradient-to-r from-blue-50 to-violet-50/70 p-5 sm:flex sm:items-start sm:gap-4 sm:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100">
                <ShieldCheck size={22} aria-hidden="true" />
              </span>
              <div className="mt-3 sm:mt-0">
                <h2 className="text-lg font-bold text-slate-950">{t('pp.guarantee.title')}</h2>
                <p className="mt-2 text-base leading-7 text-slate-600">{t('pp.guarantee.desc')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-12 text-white sm:py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white">{isBg ? 'Не сте сигурни кой вариант е подходящ?' : 'Not sure which option fits your case?'}</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">{isBg ? 'Изпратете казуса и ще получите първоначална оценка преди да вземете решение.' : 'Send your case and receive an initial assessment before making a decision.'}</p>
            </div>
            <Link to="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-slate-950 hover:bg-slate-100 sm:w-auto">
              {isBg ? 'Безплатна оценка' : 'Free Assessment'} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
