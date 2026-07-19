import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { openCookieSettings } from '@/lib/analytics';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <div className="mb-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/assets/unbansolutions.png" alt="Unban Solutions" className="h-8 w-auto bg-white rounded-md p-0.5" width="32" height="32" loading="lazy" />
            </Link>
            <p className="mb-4 max-w-sm text-sm leading-6 text-slate-300">{t('foot.desc')}</p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/unban.solutions" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 transition-colors hover:bg-slate-700" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="https://www.facebook.com/share/19KmiZmda7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 transition-colors hover:bg-blue-700" aria-label="Facebook"><Facebook size={18} /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-sm mb-4">{t('foot.services')}</h3>
            <ul className="space-y-2">
              {[
                { name: t('svc.s1.title'), path: '/services' },
                { name: t('svc.s2.title'), path: '/services' },
                { name: t('svc.s3.title'), path: '/services' },
                { name: t('svc.s4.title'), path: '/services' },
                { name: t('svc.s5.title'), path: '/services' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="inline-flex min-h-8 items-center text-sm text-slate-300 transition-colors hover:text-white">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm mb-4">{t('foot.company')}</h3>
            <ul className="space-y-2">
              <li><Link to="/process" className="inline-flex min-h-8 items-center text-sm text-slate-300 transition-colors hover:text-white">{t('nav.process')}</Link></li>
              <li><Link to="/pricing" className="inline-flex min-h-8 items-center text-sm text-slate-300 transition-colors hover:text-white">{t('nav.pricing')}</Link></li>
              <li><Link to="/contact" className="inline-flex min-h-8 items-center text-sm text-slate-300 transition-colors hover:text-white">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-bold text-sm mb-4">{t('nav.contact')}</h3>
            <ul className="space-y-2">
              <li><a href="mailto:support@unbansolutions.com" className="flex min-h-8 items-center gap-2 text-sm text-slate-300 hover:text-white"><Mail size={14} /> support@unbansolutions.com</a></li>
              <li><a href="tel:0883391411" className="flex min-h-8 items-center gap-2 text-sm text-slate-300 hover:text-white"><Phone size={14} /> 0883 391411</a></li>
              <li className="flex items-start gap-2 text-sm leading-6 text-slate-300"><MapPin size={14} className="mt-1 flex-shrink-0" /> София, Шипченски Проход 18</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs leading-5 text-slate-400">&copy; {currentYear} Unban Solutions. {t('foot.rights')}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/privacy-policy" className="text-xs text-slate-400 transition-colors hover:text-white">{t('foot.privacy')}</Link>
            <Link to="/terms" className="text-xs text-slate-400 transition-colors hover:text-white">{t('foot.terms')}</Link>
            <Link to="/payments-and-refunds" className="text-xs text-slate-400 transition-colors hover:text-white">{t('foot.payments')}</Link>
            <button type="button" onClick={openCookieSettings} className="min-h-8 text-xs text-slate-400 transition-colors hover:text-white">
              {t('foot.cookies') || 'Бисквитки'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
