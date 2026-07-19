import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(
        mobileMenuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || [],
      ).filter((element) => element.tabIndex !== -1);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktop);
    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    });
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktop);
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.process'), path: '/process' },
    { name: t('nav.blog'), path: '/blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      aria-label={isBg ? 'Основна навигация' : 'Main navigation'}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        isScrolled || isMenuOpen
          ? 'border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl'
          : 'border-transparent bg-white/90 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-[68px] items-center justify-between">
          <Link to="/" className="flex min-h-11 items-center rounded-lg" aria-label="Unban Solutions">
            <img
              src="/assets/unbansolutions.png"
              alt="Unban Solutions"
              className="h-9 w-auto"
              width="250"
              height="92"
              loading="eager"
              fetchPriority="high"
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              to="/contact"
              className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-800"
            >
              {t('nav.help')} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <LanguageSwitcher />
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen
                ? (isBg ? 'Затвори меню' : 'Close menu')
                : (isBg ? 'Отвори меню' : 'Open menu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 top-[68px] -z-10 bg-slate-950/25 md:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-label={isBg ? 'Затвори менюто' : 'Close navigation'}
          />
          <div ref={mobileMenuRef} id="mobile-navigation" className="border-t border-slate-200 bg-white p-4 shadow-xl md:hidden">
            <div className="mx-auto max-w-md">
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="mb-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-bold text-white"
              >
                {t('nav.help')} <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
