import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Check,
  Crown,
  Eye,
  FileText,
  Lock,
  Scale,
  Shield,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Services() {
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  const services = [
    { icon: Shield, title: t('sp.s1.title'), desc: t('sp.s1.desc'), features: [t('sp.s1.f1'), t('sp.s1.f2'), t('sp.s1.f3'), t('sp.s1.f4')], href: '/contact?issue=banned' },
    { icon: Lock, title: t('sp.s2.title'), desc: t('sp.s2.desc'), features: [t('sp.s2.f1'), t('sp.s2.f2'), t('sp.s2.f3'), t('sp.s2.f4')], href: '/contact?issue=shadowban' },
    { icon: Eye, title: t('sp.s3.title'), desc: t('sp.s3.desc'), features: [t('sp.s3.f1'), t('sp.s3.f2'), t('sp.s3.f3'), t('sp.s3.f4')], href: '/contact?issue=hacked' },
    { icon: TrendingUp, title: t('sp.s4.title'), desc: t('sp.s4.desc'), features: [t('sp.s4.f1'), t('sp.s4.f2'), t('sp.s4.f3'), t('sp.s4.f4')], href: '/contact?issue=other' },
    { icon: FileText, title: t('sp.s5.title'), desc: t('sp.s5.desc'), features: [t('sp.s5.f1'), t('sp.s5.f2'), t('sp.s5.f3'), t('sp.s5.f4')], href: '/contact?issue=restricted' },
    { icon: Scale, title: t('sp.s6.title'), desc: t('sp.s6.desc'), features: [t('sp.s6.f1'), t('sp.s6.f2'), t('sp.s6.f3'), t('sp.s6.f4')], href: '/contact?issue=other' },
  ];

  const audiences = [
    { icon: User, title: t('sp.a1.title'), desc: t('sp.a1.desc') },
    { icon: Users, title: t('sp.a2.title'), desc: t('sp.a2.desc') },
    { icon: Crown, title: t('sp.a3.title'), desc: t('sp.a3.desc') },
    { icon: Building2, title: t('sp.a4.title'), desc: t('sp.a4.desc') },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Услуги за възстановяване на акаунти | Unban Solutions' : 'Account recovery services | Unban Solutions'}
        description={isBg
          ? 'Оценка на казуса, подготовка на обжалване, съдействие при компрометирани профили и превантивен одит за основните социални платформи.'
          : 'Case assessment, appeal preparation, compromised profile assistance and preventive audits for major social platforms.'}
        keywords="възстановяване акаунт, баннат instagram, shadowban tiktok, откраднат профил, хакнат акаунт, дигитална защита"
        canonical="https://www.unbansolutions.com/services"
      />

      <main>
        <section className="border-b border-slate-200 bg-slate-50 pt-24 pb-10 sm:pt-28 sm:pb-14">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <p className="section-kicker">{t('sp.hero.label')}</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.3rem,7vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-slate-950">
              {isBg ? 'Съдействие според ' : 'Support built around '}<span className="text-blue-700">{isBg ? 'реалния проблем' : 'the actual issue'}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {isBg
                ? 'Започваме с оценка на конкретния казус, след което предлагаме подходящия обхват на работа.'
                : 'We start by assessing the specific case, then recommend the appropriate scope of work.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] sm:p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <service.icon size={22} aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 text-xl font-bold text-slate-950">{service.title}</h2>
                  <p className="mt-2 text-base leading-7 text-slate-600">{service.desc}</p>
                  <ul className="mt-5 flex-1 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
                        <Check size={16} className="mt-1 shrink-0 text-blue-700" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={service.href} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">
                    {isBg ? 'Оцени този казус' : 'Assess this case'} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-6">
            <div className="text-center">
              <p className="section-kicker">{t('sp.aud.label')}</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                {isBg ? 'Подходящо за лични и професионални профили' : 'For both personal and professional accounts'}
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
              {audiences.map((audience) => (
                <div key={audience.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-center sm:p-5">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <audience.icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-slate-950">{audience.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{audience.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-blue-700 py-12 sm:py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-5 sm:px-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white">{t('sp.cta.title')}</h2>
              <p className="mt-3 text-base leading-7 text-blue-100">{t('sp.cta.desc')}</p>
            </div>
            <Link to="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-blue-800 hover:bg-blue-50 sm:w-auto">
              {t('sp.cta.btn')} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
