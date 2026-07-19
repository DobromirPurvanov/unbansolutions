import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Shield, Lock, TrendingUp, Eye, FileText, Scale, Users, Building2, Crown, User, ArrowRight } from 'lucide-react';

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  useEffect(() => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: { revert: () => void } | undefined;
    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from('.svc-card', { y: 30, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });
    };
    init();
    return () => { if (ctx) ctx.revert(); };
  }, []);

  const services = [
    { icon: Shield, title: t('sp.s1.title'), desc: t('sp.s1.desc'), features: [t('sp.s1.f1'), t('sp.s1.f2'), t('sp.s1.f3'), t('sp.s1.f4')], color: 'bg-blue-100' },
    { icon: Lock, title: t('sp.s2.title'), desc: t('sp.s2.desc'), features: [t('sp.s2.f1'), t('sp.s2.f2'), t('sp.s2.f3'), t('sp.s2.f4')], color: 'bg-violet-100' },
    { icon: Eye, title: t('sp.s3.title'), desc: t('sp.s3.desc'), features: [t('sp.s3.f1'), t('sp.s3.f2'), t('sp.s3.f3'), t('sp.s3.f4')], color: 'bg-cyan-100' },
    { icon: TrendingUp, title: t('sp.s4.title'), desc: t('sp.s4.desc'), features: [t('sp.s4.f1'), t('sp.s4.f2'), t('sp.s4.f3'), t('sp.s4.f4')], color: 'bg-blue-100' },
    { icon: FileText, title: t('sp.s5.title'), desc: t('sp.s5.desc'), features: [t('sp.s5.f1'), t('sp.s5.f2'), t('sp.s5.f3'), t('sp.s5.f4')], color: 'bg-violet-100' },
    { icon: Scale, title: t('sp.s6.title'), desc: t('sp.s6.desc'), features: [t('sp.s6.f1'), t('sp.s6.f2'), t('sp.s6.f3'), t('sp.s6.f4')], color: 'bg-cyan-100' },
  ];

  const audiences = [
    { icon: User, title: t('sp.a1.title'), desc: t('sp.a1.desc'), color: 'bg-blue-100' },
    { icon: Users, title: t('sp.a2.title'), desc: t('sp.a2.desc'), color: 'bg-violet-100' },
    { icon: Crown, title: t('sp.a3.title'), desc: t('sp.a3.desc'), color: 'bg-cyan-100' },
    { icon: Building2, title: t('sp.a4.title'), desc: t('sp.a4.desc'), color: 'bg-blue-100' },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Услуги за възстановяване на акаунти | Unban Solutions' : 'Account recovery services | Unban Solutions'}
        description={isBg ? 'Оценка на казуса, подготовка на обжалване, съдействие при компрометирани профили и превантивен одит за основните социални платформи.' : 'Case assessment, appeal preparation, compromised profile assistance and preventive audits for major social platforms.'}
        keywords="възстановяване акаунт, баннат instagram, shadowban tiktok, откраднат профил, хакнат акаунт, дигитална защита"
        canonical="https://www.unbansolutions.com/services"
      />
      <main>
        <section className="relative pt-24 pb-10 bg-gradient-to-br from-blue-50 via-white to-violet-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="label-mono mb-2">{t('sp.hero.label')}</p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900 mb-3">{t('sp.hero.title')}<span className="gradient-text">{t('sp.hero.titleSpan')}</span></h1>
            <p className="text-slate-700 text-sm max-w-[450px]">{t('sp.hero.desc')}</p>
          </div>
        </section>

        <section ref={ref} className="py-10 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {services.map((s) => (
                <div key={s.title} className="svc-card glass-card-hover p-5 group flex flex-col h-full">
                  <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                    <s.icon size={16} className="text-blue-800" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">{s.title}</h3>
                  <p className="text-slate-700 text-xs mb-3">{s.desc}</p>
                  <ul className="space-y-1 flex-1">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-700 text-[11px]"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-6">
              <p className="label-mono mb-2">{t('sp.aud.label')}</p>
              <h2 className="text-xl font-bold text-slate-900">{t('sp.aud.title')}<span className="gradient-text">{t('sp.aud.titleSpan')}</span></h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {audiences.map((a) => (
                <div key={a.title} className="text-center glass-card-hover p-5">
                  <div className={`w-11 h-11 mx-auto mb-2 rounded-xl ${a.color} flex items-center justify-center`}>
                    <a.icon size={20} className="text-blue-800" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm">{a.title}</h3>
                  <p className="text-slate-700 text-xs">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-gradient-to-br from-blue-600 to-violet-700">
          <div className="max-w-[500px] mx-auto px-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">{t('sp.cta.title')}</h2>
            <p className="text-blue-100 text-sm mb-5">{t('sp.cta.desc')}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">{t('sp.cta.btn')} <ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
