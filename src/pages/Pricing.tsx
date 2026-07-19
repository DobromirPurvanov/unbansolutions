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
        <section className="border-b border-slate-200 bg-slate-50 pt-24 pb-10 sm:pt-28 sm:pb-14">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
            <p className="section-kicker">{t('pp.hero.label')}</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-[clamp(2.3rem,7vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950">
              {isBg ? 'Ясни цени според ' : 'Clear pricing based on '}<span className="text-blue-700">{isBg ? 'сложността на казуса' : 'case complexity'}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {isBg
                ? 'Първо оценяваме ситуацията. Конкретният обхват и цена се потвърждават с писмена оферта преди започване.'
                : 'We assess the situation first. The exact scope and price are confirmed in writing before work begins.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-stretch gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={`relative flex h-full flex-col rounded-3xl border p-5 sm:p-7 ${
                    plan.featured
                      ? 'border-blue-300 bg-blue-50/60 shadow-[0_20px_55px_rgba(29,78,216,0.13)]'
                      : 'border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]'
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-5 rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white sm:left-7">
                      {isBg ? 'За ограничени функции' : 'For feature restrictions'}
                    </span>
                  )}

                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
                    <plan.icon size={22} aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-2xl font-bold text-slate-950">{plan.name}</h2>
                  <p className="mt-2 min-h-14 text-base leading-7 text-slate-600">{plan.description}</p>

                  <div className="mt-5 border-y border-slate-200 py-5">
                    <p className="text-4xl font-extrabold tracking-[-0.04em] text-slate-950">{plan.price}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{isBg ? 'еднократна цена' : 'one-time price'}</p>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-base leading-6 text-slate-700">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
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
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex sm:items-start sm:gap-4 sm:p-6">
              <ShieldCheck size={24} className="shrink-0 text-blue-700" aria-hidden="true" />
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
