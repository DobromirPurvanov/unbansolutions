import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyConsent, trackPageView } from '@/lib/analytics';

export default function AnalyticsPageView() {
  const location = useLocation();

  useEffect(() => {
    applyConsent();
    const timer = window.setTimeout(() => {
      trackPageView(`${location.pathname}${location.search}`, document.title);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
