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
          {isBg ? 'Не намерихме тази страница' : 'We could not find this page'}
        </h1>
        <p className="text-slate-600 mb-6">
          {isBg
            ? 'Адресът може да е променен. Може би търсите справочника на санкциите или блога.'
            : 'The address may have changed. You might be looking for the sanctions reference or the blog.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="glow-btn min-h-11">
            <ArrowLeft size={16} aria-hidden="true" />
            {isBg ? 'Към началната страница' : 'Back to homepage'}
          </Link>
          <Link
            to="/vidove-sanktsii"
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
          >
            {isBg ? 'Справочник на санкциите' : 'Sanctions reference'}
          </Link>
          <Link
            to="/blog"
            className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-800"
          >
            {isBg ? 'Блог' : 'Blog'}
          </Link>
        </div>
      </div>
    </main>
  );
}
