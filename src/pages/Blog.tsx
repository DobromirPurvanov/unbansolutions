import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { ArrowRight, CalendarDays, Clock3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { publishedArticles, upcomingArticles } from '@/generated/blog-data';
import { formatDate } from '@/lib/dates';

const CARD_COLORS = [
  { color: 'bg-blue-100', iconColor: 'text-blue-700' },
  { color: 'bg-violet-100', iconColor: 'text-violet-700' },
  { color: 'bg-cyan-100', iconColor: 'text-cyan-700' },
  { color: 'bg-emerald-100', iconColor: 'text-emerald-700' },
  { color: 'bg-amber-100', iconColor: 'text-amber-700' },
  { color: 'bg-pink-100', iconColor: 'text-pink-700' },
];

export default function Blog() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  return (
    <>
      <SEOMeta
        title={isBg
          ? 'Блог за защита и възстановяване на акаунти | Unban Solutions'
          : 'Account Protection & Recovery Blog | Unban Solutions'}
        description={isBg
          ? 'Практически статии за спрени акаунти, шадоубан, рестрикции, фишинг и правилата за съдържание в социалните мрежи. Нова статия всяка седмица.'
          : 'Practical articles about suspended accounts, shadowbans, restrictions, phishing and social media content rules. A new article every week.'}
        keywords={isBg
          ? 'спрян акаунт, шадоубан, рестрикции, хакнат профил, поддръжка на instagram, правила за съдържание'
          : 'suspended account, shadowban, restrictions, hacked profile, instagram support, content rules'}
        canonical="https://www.unbansolutions.com/blog"
      />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-24 pb-8 sm:pt-28 sm:pb-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-[90px]" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="label-mono mb-2">{isBg ? 'Блог' : 'Blog'}</p>
            <h1 className="mb-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900">
              {isBg ? 'Практични материали за ' : 'Practical guides to '}
              <span className="gradient-text">{isBg ? 'вашия акаунт' : 'your account'}</span>
            </h1>
            <p className="max-w-[590px] text-sm leading-relaxed text-slate-600">
              {isBg
                ? 'Как работят ограниченията в социалните мрежи и какво реално помага. Публикуваме нова статия всяка седмица.'
                : 'How social media restrictions work and what actually helps. We publish a new article every week. Articles are currently available in Bulgarian.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publishedArticles.map((article, index) => {
                const palette = CARD_COLORS[index % CARD_COLORS.length];
                return (
                  <article
                    key={article.slug}
                    className="glass-card-hover flex h-full flex-col p-5"
                    data-reveal
                    style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as CSSProperties}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${palette.color}`}>
                        <CalendarDays size={18} className={palette.iconColor} aria-hidden="true" />
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                        {article.tags[0]}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{formatDate(article.date, lang)}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock3 size={11} aria-hidden="true" />
                        {isBg ? article.readTime : article.readTimeEn}
                      </span>
                    </div>
                    <h2 className="mb-2 text-sm font-bold leading-snug text-slate-900">
                      <Link to={`/blog/${article.slug}`} className="transition-colors hover:text-blue-700">
                        {isBg ? article.title : article.titleEn}
                      </Link>
                    </h2>
                    <p className="flex-1 text-xs leading-relaxed text-slate-600">
                      {isBg ? article.excerpt : article.excerptEn}
                    </p>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 transition-colors hover:text-blue-900"
                    >
                      {isBg ? 'Прочетете статията' : 'Read the article'}
                      <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>

            {upcomingArticles.length > 0 && (
              <div className="mt-10">
                <p className="label-mono mb-3">{isBg ? 'Предстоящи теми' : 'Coming next'}</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingArticles.map((article) => (
                    <article key={article.title} className="glass-card flex h-full flex-col p-5 opacity-80">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock3 size={11} aria-hidden="true" />
                          {isBg ? article.readTime : article.readTimeEn}
                        </span>
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                          {isBg ? 'Скоро' : 'Coming soon'}
                        </span>
                      </div>
                      <h3 className="mb-2 text-sm font-bold leading-snug text-slate-900">
                        {isBg ? article.title : article.titleEn}
                      </h3>
                      <p className="flex-1 text-xs leading-relaxed text-slate-600">
                        {isBg ? article.excerpt : article.excerptEn}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 py-10">
          <div className="mx-auto max-w-[520px] px-6 text-center">
            <h2 className="mb-3 text-xl font-bold text-white">
              {isBg ? 'Имате проблем с акаунта си сега?' : 'Having an account issue right now?'}
            </h2>
            <p className="mb-5 text-sm text-blue-100">
              {isBg ? 'Не чакайте статиите — поискайте безплатна оценка.' : 'You do not have to wait for the articles — request a free assessment.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50"
            >
              {isBg ? 'Безплатна оценка' : 'Free assessment'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
