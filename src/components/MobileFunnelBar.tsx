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
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        aria-label={isBg ? 'Бързи действия' : 'Quick actions'}
      >
        <div className="mx-auto flex max-w-md items-center gap-2">
          <a
            href="tel:0883391411"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-800"
            aria-label={isBg ? 'Обадете се' : 'Call us'}
            onClick={() => trackEvent('phone_cta_clicked', { location: 'mobile_funnel_bar' }, 'Contact')}
          >
            <Phone size={20} aria-hidden="true" />
          </a>
          <Link
            to="/contact"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-sm"
          >
            {isBg ? 'Изпрати казуса' : 'Send your case'}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
