import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/assets/unbansolutions.png" alt="Unban Solutions" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{t('foot.desc')}</p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/unban.solutions" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 transition-all" aria-label="Instagram"><Instagram size={14} /></a>
              <a href="https://www.facebook.com/share/19KmiZmda7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all" aria-label="Facebook"><Facebook size={14} /></a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-all" aria-label="LinkedIn"><Linkedin size={14} /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t('foot.services')}</h4>
            <ul className="space-y-2">
              {[
                { name: t('svc.s1.title'), path: '/services' },
                { name: t('svc.s2.title'), path: '/services' },
                { name: t('svc.s3.title'), path: '/services' },
                { name: t('svc.s4.title'), path: '/services' },
                { name: t('svc.s5.title'), path: '/services' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 text-xs hover:text-white transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t('foot.company')}</h4>
            <ul className="space-y-2">
              <li><Link to="/process" className="text-slate-400 text-xs hover:text-white transition-colors">{t('nav.process')}</Link></li>
              <li><Link to="/pricing" className="text-slate-400 text-xs hover:text-white transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link to="/contact" className="text-slate-400 text-xs hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm mb-4">{t('nav.contact')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-400 text-xs"><Mail size={12} /> support@unbansolutions.com</li>
              <li className="flex items-center gap-2 text-slate-400 text-xs"><Phone size={12} /> 0883 391411</li>
              <li className="flex items-start gap-2 text-slate-400 text-xs"><MapPin size={12} className="flex-shrink-0 mt-0.5" /> София, Шипченски Проход 18</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-[11px]">&copy; {currentYear} Unban Solutions. {t('foot.rights')}</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-slate-500 text-[11px] hover:text-white transition-colors">{t('foot.privacy')}</Link>
            <Link to="/terms" className="text-slate-500 text-[11px] hover:text-white transition-colors">{t('foot.terms')}</Link>
            <Link to="/payments-and-refunds" className="text-slate-500 text-[11px] hover:text-white transition-colors">{t('foot.payments')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
