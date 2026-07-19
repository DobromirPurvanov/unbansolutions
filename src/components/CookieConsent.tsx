import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cookie, X } from 'lucide-react';
import { getConsent, saveConsent, trackPageView } from '@/lib/analytics';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(!getConsent()), 500);
    const openSettings = () => setIsVisible(true);
    window.addEventListener('unban-open-cookie-settings', openSettings);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('unban-open-cookie-settings', openSettings);
    };
  }, []);

  if (!isVisible) return null;

  const choose = (analytics: boolean, marketing: boolean) => {
    const previous = getConsent();
    saveConsent(analytics, marketing);
    if ((!previous?.analytics && analytics) || (!previous?.marketing && marketing)) {
      trackPageView(`${window.location.pathname}${window.location.search}`, document.title);
    }
    setIsVisible(false);
  };

  return (
    <section
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Cookie size={20} className="text-blue-700" />
          </div>
          <div>
            <h2 id="cookie-consent-title" className="text-slate-900 text-sm font-bold mb-1">
              {isBg ? 'Настройки за поверителност' : 'Privacy settings'}
            </h2>
            <p id="cookie-consent-description" className="text-slate-600 text-xs leading-relaxed">
              {isBg
                ? 'Необходимите технологии поддържат сайта. Аналитични и маркетингови технологии се включват само след вашето съгласие.'
                : 'Essential technologies keep the site working. Analytics and marketing technologies load only after your consent.'}{' '}
              <Link to="/privacy-policy" className="text-blue-700 hover:text-blue-900 underline font-medium">
                {isBg ? 'Научете повече' : 'Learn more'}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => choose(false, false)}
            className="min-h-11 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {isBg ? 'Само необходими' : 'Essential only'}
          </button>
          <button
            type="button"
            onClick={() => choose(true, true)}
            className="min-h-11 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {isBg ? 'Приемам всички' : 'Accept all'}
          </button>
          <button
            type="button"
            onClick={() => choose(false, false)}
            className="w-11 h-11 text-slate-500 hover:text-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label={isBg ? 'Затвори и използвай само необходимите' : 'Close and use essential only'}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
