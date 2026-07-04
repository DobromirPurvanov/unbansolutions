import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import {
  Shield, Lock, TrendingUp, Zap, Clock, CheckCircle2, Award, ArrowRight, Eye, FileText,
  ShieldCheck, Globe, MessageSquare, Phone, Layers,
} from 'lucide-react';

export default function Home() {
  const servicesRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  useEffect(() => {
    // Skip animations on mobile - they hurt performance more than they help
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    if (isMobile) return;

    let ctx: any = null;

    const initAnimations = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from('.hero-content > *', { y: 30, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power3.out' });
        const sections = [servicesRef, processRef, resultsRef, testimonialsRef];
        sections.forEach((ref) => {
          gsap.from(ref.current, { y: 40, duration: 0.6, ease: 'power2.out',
            scrollTrigger: { trigger: ref.current, start: 'top 88%', toggleActions: 'play none none reverse' },
          });
        });
        gsap.from('.service-card', { y: 30, duration: 0.4, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: servicesRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
        gsap.from('.process-step', { y: 20, duration: 0.4, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: processRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
        gsap.from('.stat-item', { y: 30, duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: resultsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
        gsap.from('.testimonial-card', { y: 20, duration: 0.4, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });
    };

    initAnimations();
    return () => { if (ctx) ctx.revert(); };
  }, []);

  const services = [
    { icon: Shield, title: t('svc.s1.title'), desc: t('svc.s1.desc'), color: 'bg-blue-100' },
    { icon: Lock, title: t('svc.s2.title'), desc: t('svc.s2.desc'), color: 'bg-violet-100' },
    { icon: TrendingUp, title: t('svc.s3.title'), desc: t('svc.s3.desc'), color: 'bg-cyan-100' },
    { icon: Zap, title: t('svc.s4.title'), desc: t('svc.s4.desc'), color: 'bg-blue-100' },
    { icon: Eye, title: t('svc.s5.title'), desc: t('svc.s5.desc'), color: 'bg-violet-100' },
    { icon: FileText, title: t('svc.s6.title'), desc: t('svc.s6.desc'), color: 'bg-cyan-100' },
  ];

  const steps = [
    { num: '01', title: t('proc.step1'), desc: t('proc.step1desc'), icon: Shield },
    { num: '02', title: t('proc.step2'), desc: t('proc.step2desc'), icon: Zap },
    { num: '03', title: t('proc.step3'), desc: t('proc.step3desc'), icon: TrendingUp },
    { num: '04', title: t('proc.step4'), desc: t('proc.step4desc'), icon: Lock },
  ];

  const stats = [
    { value: '1-4 с.', label: t('res.stat2'), icon: Clock },
    { value: '95%', label: t('res.stat3'), icon: Award },
    { value: '8+', label: isBg ? 'Платформи' : 'Platforms', icon: Layers },
  ];

  const testimonials = [
    { quote: t('test.q1'), name: t('test.n1'), title: t('test.t1') },
    { quote: t('test.q2'), name: t('test.n2'), title: t('test.t2') },
    { quote: t('test.q3'), name: t('test.n3'), title: t('test.t3') },
  ];

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter / X', 'Facebook', 'LinkedIn', 'Snapchat', 'Pinterest'];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Unban Solutions | Възстановяване на баннати акаунти Instagram TikTok YouTube' : 'Unban Solutions | Recover Banned Instagram TikTok YouTube Accounts'}
        description={isBg
          ? 'Експертни услуги за възстановяване на баннати акаунти в Instagram, TikTok, YouTube, Facebook. 95% успеваемост. Безплатна консултация. Работим с всички платформи.'
          : 'Expert account recovery services for Instagram, TikTok, YouTube, Facebook. 95% success rate. Free consultation. We work with all platforms.'
        }
        keywords={isBg
          ? 'възстановяване акаунт instagram, баннат акаунт tiktok, shadowban, откраднат профил, хакнат акаунт, дигитална защита'
          : 'recover instagram account, banned tiktok account, shadowban removal, hacked account recovery, digital protection'
        }
        canonical="https://www.unbansolutions.com/"
      />
      <main>
        {/* HERO */}
        <section className="relative pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-violet-50 overflow-hidden" style={{ minHeight: '70vh' }}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-200/30 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-200/30 rounded-full filter blur-[80px]" />
          <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-cyan-200/20 rounded-full filter blur-[60px]" />
          <div className="absolute inset-0 opacity-[0.4]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 hero-content">
            <h1 className="text-[clamp(2rem,5.5vw,3.8rem)] font-extrabold leading-[1.1] text-slate-900 mb-4">
              {t('hero.title')}
              <span className="gradient-text">{t('hero.titleSpan')}</span>
            </h1>
            <p className="text-slate-700 text-base max-w-[480px] mb-6">{t('hero.desc')}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/contact" className="glow-btn inline-flex items-center gap-2">
                <span>{t('hero.cta1')}</span><ArrowRight size={15} />
              </Link>
              <Link to="/services" className="outline-btn inline-flex items-center gap-2">{t('hero.cta2')}</Link>
              <a
                href="tel:0883391411"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
                onClick={() => {
                  if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'phone_click', { event_category: 'cta', event_label: 'hero_phone' });
                  }
                  if (typeof window.fbq !== 'undefined') {
                    window.fbq('track', 'Contact', { content_name: 'Phone Call Hero' });
                  }
                }}
              >
                <Phone size={15} />
                <span>{t('hero.call')}</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { num: '95%', text: t('hero.stat2') },
                { text: t('hero.stat3') },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-300 shadow-sm">
                  {s.num && <span className="text-base font-bold gradient-text">{s.num}</span>}
                  <span className="text-slate-700 text-xs">{s.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-5">
              {[
                { icon: ShieldCheck, text: t('hero.badge1') },
                { icon: Globe, text: t('hero.badge2') },
                { icon: MessageSquare, text: t('hero.badge3') },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-slate-700 text-xs">
                  <item.icon size={14} className="text-blue-600" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="py-4 bg-slate-50 border-y border-slate-200 overflow-hidden">
          <div className="relative">
            <div className="marquee-left flex items-center gap-16 whitespace-nowrap">
              {[...Array(2)].map((_, si) => (
                <div key={si} className="flex items-center gap-16">
                  {platforms.map((p) => (
                    <span key={`${si}-${p}`} className="text-slate-500 text-sm font-medium select-none">{p}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section ref={servicesRef} className="py-12 bg-white relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-8">
              <div>
                <p className="label-mono mb-2">{t('svc.label')}</p>
                <h2 className="text-2xl font-bold text-slate-900">{t('svc.title')}<span className="gradient-text">{t('svc.titleSpan')}</span></h2>
              </div>
              <Link to="/services" className="text-blue-700 text-sm font-medium flex items-center gap-1 hover:text-blue-500">{t('svc.all')} <ArrowRight size={14} /></Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {services.map((s) => (
                <div key={s.title} className="service-card glass-card-hover p-5 group cursor-default flex flex-col h-full">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <s.icon size={18} className="text-blue-800" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">{s.title}</h3>
                  <p className="text-slate-700 text-xs leading-relaxed flex-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section ref={processRef} className="py-12 bg-gradient-to-b from-slate-50 to-white relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-8">
              <p className="label-mono mb-2">{t('proc.label')}</p>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('proc.title')}<span className="gradient-text">{t('proc.titleSpan')}</span></h2>
              <p className="text-slate-700 text-sm">{t('proc.sub')}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div key={step.num} className="process-step glass-card p-4 text-center relative">
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold shadow-md">{step.num}</div>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 flex items-center justify-center">
                    <step.icon size={16} className="text-blue-700" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-slate-700 text-xs">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              {[t('proc.tag1'), t('proc.tag2'), t('proc.tag3')].map((tag) => (
                <div key={tag} className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-300 shadow-sm">
                  <CheckCircle2 size={14} className="text-blue-600" />
                  <span className="text-slate-700 text-xs font-medium">{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section ref={resultsRef} className="py-12 bg-gradient-to-b from-white to-blue-50/50 relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-8">
              <p className="label-mono mb-2">{t('res.label')}</p>
              <h2 className="text-2xl font-bold text-slate-900">{t('res.title')}<span className="gradient-text">{t('res.titleSpan')}</span></h2>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-[700px] mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="stat-item text-center glass-card p-4 sm:p-8">
                  <s.icon size={24} className="sm:w-7 sm:h-7 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <div className="text-xl sm:text-[2rem] font-extrabold gradient-text mb-1 sm:mb-2 leading-tight">{s.value}</div>
                  <div className="text-slate-600 text-xs sm:text-sm font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {platforms.map((p) => (
                <span key={p} className="px-3 py-1.5 bg-white rounded-lg text-slate-700 text-xs font-medium border border-slate-300">{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section ref={testimonialsRef} className="py-12 bg-gradient-to-b from-blue-50/50 to-violet-50/30 relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="text-center mb-8">
              <p className="label-mono mb-2">{t('test.label')}</p>
              <h2 className="text-2xl font-bold text-slate-900">{t('test.title')}<span className="gradient-text">{t('test.titleSpan')}</span></h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((item) => (
                <div key={item.name} className="testimonial-card glass-card p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (<span key={j} className="text-blue-500 text-sm">&#9733;</span>))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-4">&ldquo;{item.quote}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-semibold text-xs">{item.name.charAt(0)}</div>
                    <div>
                      <p className="text-slate-900 text-xs font-bold">{item.name}</p>
                      <p className="text-slate-700 text-[11px]">{item.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-gradient-to-br from-blue-600 to-violet-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
          <div className="relative max-w-[600px] mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">{t('cta.title')}</h2>
            <p className="text-blue-100 text-sm mb-6">{t('cta.desc')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg">{t('cta.btn1')} <ArrowRight size={15} /></Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-lg font-medium text-sm hover:bg-white/20 transition-colors">{t('cta.btn2')}</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
