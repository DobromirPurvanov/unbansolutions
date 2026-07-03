import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.process'), path: '/process' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200' : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[60px]">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/unbansolutions.png" alt="Unban Solutions" className="h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`px-3 py-1.5 text-[0.8rem] font-medium transition-colors rounded-lg ${
                  isActive(link.path) ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                {link.name}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link to="/contact"
              className="ml-2 px-4 py-2 text-[0.75rem] font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all shadow-md shadow-blue-500/20">
              {t('nav.help')}
            </Link>
          </div>

          <button className="md:hidden text-slate-700 hover:text-slate-900 transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex items-center gap-2 px-4">
              <LanguageSwitcher />
            </div>
            <div className="pt-2">
              <Link to="/contact" className="block text-center px-4 py-2.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-violet-600">
                {t('nav.help')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
