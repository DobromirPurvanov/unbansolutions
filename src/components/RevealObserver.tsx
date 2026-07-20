import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const REVEAL_SELECTOR = '[data-reveal]';

function forEachRevealElement(root: ParentNode, callback: (element: HTMLElement) => void) {
  if (root instanceof HTMLElement && root.matches(REVEAL_SELECTOR)) {
    callback(root);
  }

  root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(callback);
}

export default function RevealObserver() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const documentElement = document.documentElement;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    let motionEnabled = supportsIntersectionObserver && !reducedMotionQuery.matches;

    let intersectionObserver: IntersectionObserver | null = null;

    const reveal = (element: HTMLElement) => {
      element.classList.add('is-visible');
      intersectionObserver?.unobserve(element);
    };

    if (supportsIntersectionObserver) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target instanceof HTMLElement) {
              reveal(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.08,
        },
      );
    }

    const register = (element: HTMLElement) => {
      if (!motionEnabled || element.classList.contains('is-visible')) {
        reveal(element);
        return;
      }

      intersectionObserver?.observe(element);
    };

    const applyMotionPreference = () => {
      motionEnabled = supportsIntersectionObserver && !reducedMotionQuery.matches;

      if (!motionEnabled) {
        documentElement.classList.remove('motion-ready');
        forEachRevealElement(document, reveal);
        return;
      }

      documentElement.classList.add('motion-ready');
      forEachRevealElement(document, register);
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;

      const revealElement = event.target.closest<HTMLElement>(REVEAL_SELECTOR);
      if (revealElement) reveal(revealElement);
    };

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
          if (mutation.target.matches(REVEAL_SELECTOR)) {
            register(mutation.target);
          } else {
            intersectionObserver?.unobserve(mutation.target);
          }
          return;
        }

        mutation.removedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          forEachRevealElement(node, (element) => intersectionObserver?.unobserve(element));
        });

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          forEachRevealElement(node, register);
        });
      });
    });

    document.addEventListener('focusin', handleFocusIn);
    reducedMotionQuery.addEventListener('change', applyMotionPreference);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-reveal'],
    });
    applyMotionPreference();

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      reducedMotionQuery.removeEventListener('change', applyMotionPreference);
      mutationObserver.disconnect();
      intersectionObserver?.disconnect();
      documentElement.classList.remove('motion-ready');
    };
  }, [pathname]);

  return null;
}
