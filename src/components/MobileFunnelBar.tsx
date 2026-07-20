import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';

const VISIBLE_PATHS = new Set(['/', '/services', '/pricing', '/process']);

export default function MobileFunnelBar() {
  const location = useLocation();
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  if (!VISIBLE_PATHS.has(location.pathname)) return null;

  return (
    <>
      <div className="h-20 md:hidden" aria-hidden="true" />
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        aria-label={isBg ? 'Бързи действия' : 'Quick actions'}
      >
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href="tel:+359883391411"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800"
            aria-label={isBg ? 'Обадете се' : 'Call us'}
            onClick={() => trackEvent('phone_cta_clicked', { location: 'mobile_funnel_bar' }, 'Contact')}
          >
            <Phone size={20} aria-hidden="true" />
          </a>
          <Link
            to="/pricing"
            className="inline-flex h-12 shrink-0 flex-col items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-3 text-violet-800"
            aria-label={isBg ? 'Вижте цените от 100 евро' : 'See pricing from 100 euros'}
          >
            <span className="text-xs font-bold leading-none">{isBg ? 'Цени' : 'Prices'}</span>
            <span className="mt-1 text-[10px] font-extrabold leading-none">100 EUR</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-3 text-sm font-bold text-white shadow-sm min-[370px]:px-5 min-[370px]:text-base"
          >
            <span className="whitespace-nowrap min-[370px]:hidden">{isBg ? 'Изпрати' : 'Send'}</span>
            <span className="hidden whitespace-nowrap min-[370px]:inline">{isBg ? 'Изпрати казуса' : 'Send your case'}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </>
  );
}
