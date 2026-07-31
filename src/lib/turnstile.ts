/**
 * Cloudflare Turnstile (invisible) — loads the script lazily and mints a
 * single-use token for the contact form. The backend verifies it.
 *
 * Invisible mode draws nothing on screen and, unlike reCAPTCHA, needs no
 * attribution badge in the form. Its one condition is a reference to
 * Cloudflare's Turnstile Privacy Addendum in the privacy policy.
 *
 * The site key is public by design; only the secret key on the server matters.
 */

const SITE_KEY = '0x4AAAAAAECvtOOF3qb_VZeM';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback': () => void;
  'timeout-callback': () => void;
};

type TurnstileApi = {
  render: (el: HTMLElement, opts: TurnstileOptions) => string | undefined;
  remove: (widgetId: string) => void;
};

type TurnstileWindow = Window & { turnstile?: TurnstileApi };

let loadPromise: Promise<void> | null = null;

export function loadTurnstile(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  const browserWindow = window as TurnstileWindow;
  if (browserWindow.turnstile?.render) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Turnstile failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile failed to load'));
    document.head.appendChild(script);
  });
  return loadPromise;
}

/**
 * Returns a single-use token, or null when Turnstile is unreachable (blocker,
 * network, timeout). Never throws — bot protection must not be able to break
 * a real visitor's submission; the server decides what to do with a missing
 * token.
 *
 * Tokens expire and cannot be reused, so this runs per submit rather than once
 * on mount.
 */
export async function getTurnstileToken(): Promise<string | null> {
  try {
    await loadTurnstile();
    const turnstile = (window as TurnstileWindow).turnstile;
    if (!turnstile?.render) return null;

    // Even the invisible widget needs a container to render into.
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    host.setAttribute('aria-hidden', 'true');
    document.body.appendChild(host);

    return await new Promise<string | null>((resolve) => {
      let settled = false;

      const finish = (token: string | null) => {
        if (settled) return;
        settled = true;
        /* Cleanup is deferred on purpose: the callback can fire synchronously
           inside render(), before widgetId is assigned. The timeout guarantees
           we read it only after render() returned. */
        setTimeout(() => {
          if (widgetId) {
            try {
              turnstile.remove(widgetId);
            } catch {
              // already removed
            }
          }
          host.remove();
        }, 0);
        resolve(token);
      };

      const widgetId = turnstile.render(host, {
        sitekey: SITE_KEY,
        callback: (token) => finish(token),
        'error-callback': () => finish(null),
        'timeout-callback': () => finish(null),
      });

      if (widgetId === undefined) finish(null);
    });
  } catch {
    return null;
  }
}
