import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    }));
    setIsVisible(false);
    // Enable GA4 and Meta Pixel
    if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted' });
    if (window.fbq) window.fbq('track', 'PageView');
  };

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    }));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isBg = lang === 'bg';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Cookie size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-slate-800 text-sm font-medium mb-1">
              {isBg ? 'Ние използваме бисквитки' : 'We use cookies'}
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              {isBg
                ? 'Използваме бисквитки за подобряване на вашето преживяване, анализ на трафика и персонализиране на съдържанието. Можете да управлявате предпочитанията си по всяко време.'
                : 'We use cookies to improve your experience, analyze traffic and personalize content. You can manage your preferences at any time.'}
              {' '}
              <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline font-medium">
                {isBg ? 'Научете повече' : 'Learn more'}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={acceptEssential}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            {isBg ? 'Само необходими' : 'Essential only'}
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-lg transition-all shadow-md"
          >
            {isBg ? 'Приемам всички' : 'Accept all'}
          </button>
          <button
            onClick={acceptEssential}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            title={isBg ? 'Затвори' : 'Close'}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
