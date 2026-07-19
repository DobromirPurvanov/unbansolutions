export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: 1;
};

type EventValue = string | number | boolean;
type EventProperties = Record<string, EventValue>;

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: MetaPixelFunction;
};

const CONSENT_KEY = 'unban_cookie_consent';
const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-FD6BFR3X5T';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '1330505575908646';

function getBrowserWindow() {
  return window as AnalyticsWindow;
}

export function getConsent(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (
      parsed.version !== 1 ||
      parsed.essential !== true ||
      typeof parsed.analytics !== 'boolean' ||
      typeof parsed.marketing !== 'boolean' ||
      typeof parsed.timestamp !== 'number' ||
      Date.now() - parsed.timestamp > CONSENT_MAX_AGE
    ) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return parsed as ConsentPreferences;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  const preferences: ConsentPreferences = {
    essential: true,
    analytics,
    marketing,
    timestamp: Date.now(),
    version: 1,
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
  } catch {
    // Consent still applies to the current page even if storage is unavailable.
  }
  applyConsent(preferences);
  window.dispatchEvent(new CustomEvent('unban-consent-changed', { detail: preferences }));
}

function loadGoogleAnalytics() {
  if (!GA_ID || document.getElementById('unban-ga-script')) return;

  const browserWindow = getBrowserWindow();
  browserWindow.dataLayer = browserWindow.dataLayer || [];
  browserWindow.gtag = browserWindow.gtag || ((...args: unknown[]) => browserWindow.dataLayer?.push(args));
  browserWindow.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  browserWindow.gtag('js', new Date());
  browserWindow.gtag('config', GA_ID, {
    send_page_view: false,
    allow_google_signals: false,
    cookie_flags: 'SameSite=Lax;Secure',
  });

  const script = document.createElement('script');
  script.id = 'unban-ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

function loadMetaPixel() {
  if (!META_PIXEL_ID || document.getElementById('unban-meta-pixel')) return;

  const browserWindow = getBrowserWindow();
  if (!browserWindow.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else (fbq.queue ||= []).push(args);
    }) as MetaPixelFunction;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    browserWindow.fbq = fbq;
  }

  browserWindow.fbq('consent', 'grant');
  browserWindow.fbq('init', META_PIXEL_ID);
  const script = document.createElement('script');
  script.id = 'unban-meta-pixel';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

export function applyConsent(preferences = getConsent()) {
  if (!preferences) return;
  const browserWindow = getBrowserWindow();

  if (preferences.analytics) loadGoogleAnalytics();
  else browserWindow.gtag?.('consent', 'update', { analytics_storage: 'denied' });

  if (preferences.marketing) loadMetaPixel();
  else browserWindow.fbq?.('consent', 'revoke');
}

export function trackEvent(name: string, properties: EventProperties = {}, metaEvent?: string) {
  const consent = getConsent();
  const browserWindow = getBrowserWindow();
  if (consent?.analytics) browserWindow.gtag?.('event', name, properties);
  if (consent?.marketing && metaEvent) {
    const method = ['Lead', 'Contact'].includes(metaEvent) ? 'track' : 'trackCustom';
    browserWindow.fbq?.(method, metaEvent, properties);
  }
}

export function trackPageView(path: string, title: string) {
  const consent = getConsent();
  const browserWindow = getBrowserWindow();
  if (consent?.analytics) {
    browserWindow.gtag?.('event', 'page_view', {
      page_location: `${window.location.origin}${path}`,
      page_title: title,
    });
  }
  if (consent?.marketing) browserWindow.fbq?.('track', 'PageView');
}

export function openCookieSettings() {
  window.dispatchEvent(new Event('unban-open-cookie-settings'));
}
