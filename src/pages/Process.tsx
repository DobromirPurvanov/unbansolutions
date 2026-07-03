import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Search, ClipboardList, Rocket, Shield, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-card', { y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });
    return () => ctx.revert();
  }, []);

  const steps = [
    { icon: Search, num: t('pr.step1.num'), title: t('pr.step1.title'), desc: t('pr.step1.desc'), details: [t('pr.step1.d1'), t('pr.step1.d2'), t('pr.step1.d3'), t('pr.step1.d4')], time: t('pr.step1.time'), color: 'bg-blue-100' },
    { icon: ClipboardList, num: t('pr.step2.num'), title: t('pr.step2.title'), desc: t('pr.step2.desc'), details: [t('pr.step2.d1'), t('pr.step2.d2'), t('pr.step2.d3'), t('pr.step2.d4')], time: t('pr.step2.time'), color: 'bg-violet-100' },
    { icon: Rocket, num: t('pr.step3.num'), title: t('pr.step3.title'), desc: t('pr.step3.desc'), details: [t('pr.step3.d1'), t('pr.step3.d2'), t('pr.step3.d3'), t('pr.step3.d4')], time: t('pr.step3.time'), color: 'bg-cyan-100' },
    { icon: Shield, num: t('pr.step4.num'), title: t('pr.step4.title'), desc: t('pr.step4.desc'), details: [t('pr.step4.d1'), t('pr.step4.d2'), t('pr.step4.d3'), t('pr.step4.d4')], time: t('pr.step4.time'), color: 'bg-blue-100' },
  ];

  const timeline = [
    { stage: t('pr.step1.title'), duration: t('pr.step1.time'), color: '#2563EB' },
    { stage: t('pr.step2.title'), duration: t('pr.step2.time'), color: '#7C3AED' },
    { stage: t('pr.step3.title'), duration: t('pr.step3.time'), color: '#0891B2' },
    { stage: t('pr.step4.title'), duration: t('pr.step4.time'), color: '#60A5FA' },
  ];

  return (
    <>
      <SEOMeta title={t('pr.hero.label') + ' | Unban Solutions'} description={t('pr.hero.sub')} />
      <main>
        <section className="relative pt-24 pb-10 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="label-mono mb-2">{t('pr.hero.label')}</p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900 mb-3">{t('pr.hero.title')}<span className="gradient-text">{t('pr.hero.titleSpan')}</span> {t('pr.hero.desc')}</h1>
            <p className="text-slate-700 text-sm max-w-[450px]">{t('pr.hero.sub')}</p>
          </div>
        </section>

        <section className="py-5 border-y border-slate-200 bg-slate-50">
          <div className="max-w-[700px] mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-2">
              {timeline.map((item, idx) => (
                <div key={item.stage} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-300 shadow-sm">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    <p className="text-slate-800 text-[11px] font-bold">{item.stage}</p>
                  </div>
                  {idx < timeline.length - 1 && <ArrowRight size={10} className="text-slate-500" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section ref={ref} className="py-10 lg:py-14 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-[800px] mx-auto px-6 lg:px-10">
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.num} className="process-card glass-card-hover p-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center`}>
                        <step.icon size={18} className="text-blue-800" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-700 text-[10px] font-mono font-bold">{step.num}</span>
                        <h3 className="text-slate-900 text-sm font-bold">{step.title}</h3>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed mb-2">{step.desc}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {step.details.map((d) => (
                          <span key={d} className="text-slate-700 text-[11px] flex items-center gap-1">
                            <CheckCircle2 size={9} className="text-blue-600" />{d}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock size={10} className="text-blue-700" />
                        <span className="text-blue-700 text-[10px] font-bold">{step.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-14 relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-white/10 rounded-full filter blur-[60px]" />
          <div className="relative max-w-[500px] mx-auto px-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t('pr.cta.title')}<span className="text-blue-200">{t('pr.cta.titleSpan')}</span>?</h2>
            <p className="text-blue-100 text-sm mb-5">{t('pr.cta.desc')}</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg"><span>{t('pr.cta.btn')}</span><ArrowRight size={14} /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
