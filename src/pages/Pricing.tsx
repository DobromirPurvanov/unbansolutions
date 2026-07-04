import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Check, ArrowRight, Star, ShieldCheck } from 'lucide-react';

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (window.innerWidth < 768) return;
    let ctx: any;
    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from('.pricing-card', { y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });
    };
    init();
    return () => { if (ctx) ctx.revert(); };
  }, []);

  const plans = [
    { name: t('pp.p1.name'), desc: t('pp.p1.desc'), price: '250 EUR', features: [t('pp.p1.f1'), t('pp.p1.f2'), t('pp.p1.f3'), t('pp.p1.f4')], popular: false },
    { name: t('pp.p2.name'), desc: t('pp.p2.desc'), price: '500 EUR', features: [t('pp.p2.f1'), t('pp.p2.f2'), t('pp.p2.f3'), t('pp.p2.f4'), t('pp.p2.f5'), t('pp.p2.f6')], popular: true },
    { name: t('pp.p3.name'), desc: t('pp.p3.desc'), price: '100 EUR', features: [t('pp.p3.f1'), t('pp.p3.f2'), t('pp.p3.f3'), t('pp.p3.f4'), t('pp.p3.f5'), t('pp.p3.f6')], popular: false },
  ];

  return (
    <>
      <SEOMeta
        title={t('pp.hero.label') + ' | Цени за възстановяване на акаунти | Unban Solutions'}
        description="Прозрачни цени за възстановяване на баннати акаунти. Лек казус 250 EUR, Тежък казус 500 EUR, Консултация 100 EUR. Без скрити такси."
        keywords="цена възстановяване акаунт, колко струва unban, цена instagram акаунт, консултация shadowban"
        canonical="https://www.unbansolutions.com/pricing"
      />
      <main>
        <section className="relative pt-24 pb-10 bg-gradient-to-br from-violet-50 via-white to-blue-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-200/30 rounded-full filter blur-[80px]" />
          <div className="relative max-w-[1400px] mx-auto px-6 text-center">
            <p className="label-mono mb-2">{t('pp.hero.label')}</p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900 mb-3">{t('pp.hero.title')}<span className="gradient-text">{t('pp.hero.titleSpan')}</span></h1>
            <p className="text-slate-700 text-sm max-w-[400px] mx-auto">{t('pp.hero.desc')}</p>
          </div>
        </section>

        <section ref={ref} className="py-10 bg-white">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">{t('pp.plans.title')}</h2>
              <p className="text-slate-700 text-xs">{t('pp.plans.sub')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 items-stretch">
              {plans.map((plan) => (
                <div key={plan.name} className={`pricing-card relative p-5 rounded-xl border-2 transition-all flex flex-col h-full ${plan.popular ? 'bg-gradient-to-b from-blue-50 to-white border-blue-400 shadow-lg shadow-blue-500/10' : 'glass-card-hover'}`}>
                  {plan.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <span className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md"><Star size={8} /> {t('pp.p2.badge')}</span>
                    </div>
                  )}
                  <div className="mb-3">
                    <h3 className="text-slate-900 text-sm font-bold">{plan.name}</h3>
                    <p className="text-slate-700 text-[11px]">{plan.desc}</p>
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold gradient-text">{plan.price}</span>
                  </div>
                  <ul className="space-y-2 mb-5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-slate-700 text-xs"><Check size={12} className="text-blue-600 mt-0.5 flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`block text-center py-2.5 rounded-lg font-bold text-xs transition-all mt-auto ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md' : 'border-2 border-slate-300 text-slate-800 hover:border-blue-400 hover:text-blue-700'}`}>{t('pp.btn')}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-gradient-to-br from-blue-600 to-violet-700">
          <div className="max-w-[500px] mx-auto px-6 text-center">
            <ShieldCheck size={32} className="text-white/80 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">{t('pp.guarantee.title')}</h2>
            <p className="text-blue-100 text-sm mb-5">{t('pp.guarantee.desc')}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50">{t('pp.guarantee.btn')} <ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
