import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEOMeta from '@/components/SEOMeta';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 pt-20 pb-12 bg-slate-50">
      <SEOMeta title={isBg ? 'Страницата не е намерена | Unban Solutions' : 'Page not found | Unban Solutions'} noindex />
      <div className="max-w-lg text-center">
        <p className="label-mono mb-3">404</p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          {isBg ? 'Страницата не е намерена' : 'Page not found'}
        </h1>
        <p className="text-slate-600 mb-6">
          {isBg ? 'Адресът може да е променен или страницата вече да не съществува.' : 'The address may have changed or the page may no longer exist.'}
        </p>
        <Link to="/" className="glow-btn min-h-11">
          <ArrowLeft size={16} aria-hidden="true" />
          {isBg ? 'Към началната страница' : 'Back to homepage'}
        </Link>
      </div>
    </main>
  );
}
