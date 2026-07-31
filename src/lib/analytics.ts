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

/**
 * Loads GA4 on every page view with Google Consent Mode v2 defaults set to
 * denied. In that state gtag writes no cookies and sends no identifiers — only
 * anonymous pings Google aggregates into modelled traffic. That is the
 * officially supported GDPR mode and it means visitors who never touch the
 * banner are still measured, instead of being invisible.
 *
 * Consent is raised later via updateGoogleConsent(). Ordering matters: the
 * `consent default` command must reach dataLayer before gtag.js executes,
 * otherwise the first hit goes out with cookies.
 *
 * ad_* stay denied even after consent — this site runs Meta Pixel, not Google
 * Ads, so there is nothing that needs them.
 */
function loadGoogleAnalytics() {
  if (!GA_ID) return;

  const browserWindow = getBrowserWindow();
  browserWindow.dataLayer = browserWindow.dataLayer || [];
  if (!browserWindow.gtag) {
    browserWindow.gtag = function gtag() {
      // gtag.js processes only `arguments` objects pushed to dataLayer; plain arrays are silently ignored.
      // eslint-disable-next-line prefer-rest-params
      browserWindow.dataLayer?.push(arguments);
    };
  }
  if (document.getElementById('unban-ga-script')) return;

  browserWindow.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    // Give a stored choice up to 500 ms to raise consent before the first hit
    // leaves, so returning visitors are not counted as anonymous.
    wait_for_update: 500,
  });
  // Without cookies the link between pages travels in the URL instead.
  browserWindow.gtag('set', 'ads_data_redaction', true);
  browserWindow.gtag('set', 'url_passthrough', true);

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

/** Raises or lowers Google consent. Safe to call repeatedly. */
function updateGoogleConsent(analyticsGranted: boolean) {
  getBrowserWindow().gtag?.('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
  });
}

function loadMetaPixel() {
  if (!META_PIXEL_ID) return;

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
  if (document.getElementById('unban-meta-pixel')) return;
  browserWindow.fbq('init', META_PIXEL_ID);
  const script = document.createElement('script');
  script.id = 'unban-meta-pixel';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

/**
 * Runs on every page load and on every change in the banner.
 *
 * GA4 always loads — denied by default, granted once the visitor accepts
 * analytics cookies. Meta Pixel stays fully gated behind marketing consent,
 * because it has no cookieless equivalent and loading it would already
 * disclose the visitor's IP to Meta.
 */
export function applyConsent(preferences = getConsent()) {
  const browserWindow = getBrowserWindow();

  loadGoogleAnalytics();
  updateGoogleConsent(Boolean(preferences?.analytics));

  if (preferences?.marketing) loadMetaPixel();
  else browserWindow.fbq?.('consent', 'revoke');
}

/**
 * Езикът на сайта, залепен за всяко събитие. Сайтът е двуезичен и без това
 * няма как да се види коя версия конвертира — GA4 има вградено измерение
 * „Език", но то отразява настройката на браузъра, а не коя версия човекът
 * реално е чел.
 *
 * Чете се от localStorage, а не от React контекста, за да остане analytics.ts
 * независим от UI слоя. Ключът е същият, който LanguageContext записва.
 *
 * Взима се при всяко изпращане, а не веднъж в `config`, защото превключвателят
 * сменя езика по средата на сесията.
 */
function siteLanguage(): 'bg' | 'en' {
  try {
    return localStorage.getItem('lang') === 'en' ? 'en' : 'bg';
  } catch {
    return 'bg';
  }
}

export function trackEvent(name: string, properties: EventProperties = {}, metaEvent?: string) {
  const consent = getConsent();
  const browserWindow = getBrowserWindow();
  /* No consent check for gtag: Consent Mode already decides what may be stored.
     Without consent the event still leaves, but anonymously and cookieless —
     that is the whole point of loading GA in denied mode. Meta has no such
     mode, so it stays gated. */
  browserWindow.gtag?.('event', name, { ...properties, site_language: siteLanguage() });
  if (consent?.marketing && metaEvent) {
    const method = ['Lead', 'Contact'].includes(metaEvent) ? 'track' : 'trackCustom';
    browserWindow.fbq?.(method, metaEvent, properties);
  }
}

export function trackPageView(path: string, title: string) {
  const consent = getConsent();
  const browserWindow = getBrowserWindow();
  // Sent for everyone; Consent Mode decides whether it carries an identifier.
  browserWindow.gtag?.('event', 'page_view', {
    page_location: `${window.location.origin}${path}`,
    page_title: title,
    site_language: siteLanguage(),
  });
  if (consent?.marketing) browserWindow.fbq?.('track', 'PageView');
}

/**
 * Fires a Meta PageView only. Needed when marketing consent is granted
 * mid-page: the Pixel loads at that moment and would otherwise miss the
 * current page until the next route change.
 *
 * Deliberately does not touch gtag — GA4 already sent its page_view on load,
 * and re-sending it here would double-count every visitor who accepts.
 */
export function trackMetaPageView() {
  if (!getConsent()?.marketing) return;
  getBrowserWindow().fbq?.('track', 'PageView');
}

export function openCookieSettings() {
  window.dispatchEvent(new Event('unban-open-cookie-settings'));
}
