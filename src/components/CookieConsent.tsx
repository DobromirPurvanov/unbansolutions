import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cookie, X } from 'lucide-react';
import { getConsent, saveConsent, trackPageView } from '@/lib/analytics';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => getConsent()?.analytics ?? false);
  const [marketingEnabled, setMarketingEnabled] = useState(() => getConsent()?.marketing ?? false);
  const panelRef = useRef<HTMLElement>(null);
  const focusOnOpen = useRef(false);
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  useEffect(() => {
    const saved = getConsent();
    const timer = window.setTimeout(() => setIsVisible(!saved), 500);
    const openSettings = () => {
      const current = getConsent();
      setAnalyticsEnabled(current?.analytics ?? false);
      setMarketingEnabled(current?.marketing ?? false);
      focusOnOpen.current = true;
      setIsVisible(true);
    };
    window.addEventListener('unban-open-cookie-settings', openSettings);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('unban-open-cookie-settings', openSettings);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    panelRef.current?.focus();
  }, [isVisible]);

  if (!isVisible) return null;

  const choose = (analytics: boolean, marketing: boolean) => {
    const previous = getConsent();
    saveConsent(analytics, marketing);
    if ((!previous?.analytics && analytics) || (!previous?.marketing && marketing)) {
      trackPageView(window.location.pathname, document.title);
    }
    setIsVisible(false);
  };

  const close = () => {
    if (!getConsent()) {
      choose(false, false);
      return;
    }
    setIsVisible(false);
  };

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      className="fixed bottom-0 left-0 right-0 z-[100] max-h-[90dvh] overflow-y-auto border-t border-slate-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] focus:outline-none"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="relative mx-auto max-w-6xl px-5 py-5 sm:px-6">
        <button
          type="button"
          onClick={close}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:right-5"
          aria-label={isBg ? 'Затвори настройките' : 'Close settings'}
        >
          <X size={19} aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3 pr-12">
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

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label htmlFor="cookie-analytics" className="flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50/60">
            <input
              id="cookie-analytics"
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(event) => setAnalyticsEnabled(event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700"
            />
            <span>
              <span className="block text-sm font-bold text-slate-900">{isBg ? 'Аналитични' : 'Analytics'}</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-600">
                {isBg ? 'Помагат ни да измерваме общото използване и стъпките във фунията.' : 'Help us measure overall usage and generic funnel steps.'}
              </span>
            </span>
          </label>

          <label htmlFor="cookie-marketing" className="flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-colors hover:border-blue-300 hover:bg-blue-50/60">
            <input
              id="cookie-marketing"
              type="checkbox"
              checked={marketingEnabled}
              onChange={(event) => setMarketingEnabled(event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700"
            />
            <span>
              <span className="block text-sm font-bold text-slate-900">{isBg ? 'Маркетингови' : 'Marketing'}</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-600">
                {isBg ? 'Позволяват измерване на реклами чрез Meta Pixel.' : 'Allow advertising measurement through Meta Pixel.'}
              </span>
            </span>
          </label>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => choose(false, false)}
            className="min-h-11 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {isBg ? 'Само необходими' : 'Essential only'}
          </button>
          <button
            type="button"
            onClick={() => choose(analyticsEnabled, marketingEnabled)}
            className="min-h-11 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800 transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {isBg ? 'Запази избора' : 'Save selection'}
          </button>
          <button
            type="button"
            onClick={() => choose(true, true)}
            className="min-h-11 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {isBg ? 'Приемам всички' : 'Accept all'}
          </button>
        </div>
      </div>
    </section>
  );
}
