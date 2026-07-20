import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, Clock3, Rocket, Search, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Process() {
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  const steps = [
    { icon: Search, num: t('pr.step1.num'), title: t('pr.step1.title'), desc: t('pr.step1.desc'), details: [t('pr.step1.d1'), t('pr.step1.d2'), t('pr.step1.d3'), t('pr.step1.d4')], time: t('pr.step1.time') },
    { icon: ClipboardList, num: t('pr.step2.num'), title: t('pr.step2.title'), desc: t('pr.step2.desc'), details: [t('pr.step2.d1'), t('pr.step2.d2'), t('pr.step2.d3'), t('pr.step2.d4')], time: t('pr.step2.time') },
    { icon: Rocket, num: t('pr.step3.num'), title: t('pr.step3.title'), desc: t('pr.step3.desc'), details: [t('pr.step3.d1'), t('pr.step3.d2'), t('pr.step3.d3'), t('pr.step3.d4')], time: t('pr.step3.time') },
    { icon: Shield, num: t('pr.step4.num'), title: t('pr.step4.title'), desc: t('pr.step4.desc'), details: [t('pr.step4.d1'), t('pr.step4.d2'), t('pr.step4.d3'), t('pr.step4.d4')], time: t('pr.step4.time') },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Как протича работата по вашия казус | Unban Solutions' : 'How we handle your case | Unban Solutions'}
        description={isBg
          ? 'От първоначалната оценка и събирането на доказателства до подаването на обжалване и проследяването на отговора по вашия казус.'
          : 'From initial assessment and evidence collection to appeal submission and follow-up on the platform response.'}
        keywords="процес възстановяване акаунт, как се възстановява instagram, стъпки shadowban, колко време отнема"
        canonical="https://www.unbansolutions.com/process"
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-violet-50/60 pt-24 pb-8 sm:pt-28 sm:pb-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-[90px]" aria-hidden="true" />
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <p className="section-kicker">{t('pr.hero.label')}</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.3rem,7vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950">
              {isBg ? 'От първоначална оценка до ' : 'From initial assessment to '}<span className="gradient-text">{isBg ? 'проследяване на казуса' : 'case follow-up'}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {isBg
                ? 'Всяка стъпка има ясна цел. Точният обхват и срок зависят от случая и от отговорите на платформата.'
                : 'Every step has a clear purpose. The exact scope and timing depend on the case and the platform responses.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-10 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-6">
            <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-9 before:top-8 before:w-px before:bg-slate-200 sm:before:left-12">
              {steps.map((step, index) => (
                <li
                  key={step.num}
                  className="relative rounded-3xl border border-slate-200 bg-white p-5 pl-20 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-7 sm:pl-24"
                  data-reveal
                  style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as CSSProperties}
                >
                  <span className={`absolute left-3 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_0_0_6px_white] sm:left-4 sm:top-7 sm:h-16 sm:w-16 ${index % 2 === 1 ? 'bg-violet-700' : 'bg-blue-700'}`}>
                    <step.icon size={22} aria-hidden="true" />
                  </span>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold tracking-[0.14em] text-blue-700">{step.num}</p>
                      <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">{step.title}</h2>
                    </div>
                    <span className="inline-flex min-h-9 items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                      <Clock3 size={15} aria-hidden="true" /> {step.time}
                    </span>
                  </div>

                  <p className="mt-3 text-base leading-7 text-slate-600">{step.desc}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {step.details.map((detail) => (
                      <span key={detail} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                        <CheckCircle2 size={16} className="mt-1 shrink-0 text-blue-700" aria-hidden="true" />
                        {detail}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 rounded-2xl border border-violet-200 bg-gradient-to-r from-blue-50 to-violet-50 p-4 text-sm leading-6 text-slate-800 sm:p-5 sm:text-base">
              {isBg
                ? 'Посочените срокове са ориентировъчни. Решението и времето за отговор на платформата не са под контрола на Unban Solutions.'
                : 'The listed timeframes are indicative. The platform decision and response time are outside the control of Unban Solutions.'}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 py-11 text-white sm:py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white">{isBg ? 'Първата стъпка е кратка оценка' : 'The first step is a short assessment'}</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">{t('pr.cta.desc')}</p>
            </div>
            <Link to="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-slate-950 hover:bg-slate-100 sm:w-auto">
              {t('pr.cta.btn')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
