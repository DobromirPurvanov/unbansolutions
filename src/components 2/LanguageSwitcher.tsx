import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  const toggle = () => {
    setLang(lang === 'bg' ? 'en' : 'bg');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
      title={lang === 'bg' ? 'Switch to English' : 'Превключи на български'}
    >
      <Globe size={13} />
      <span>{t('nav.lang')}</span>
    </button>
  );
}
