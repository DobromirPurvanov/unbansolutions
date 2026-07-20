import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  Instagram,
  LockKeyhole,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Blog() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const articles = isBg
    ? [
        {
          title: 'Как да предпазите Instagram акаунта си от бан',
          excerpt: 'Практични правила за съдържание, сигурност и съответствие с политиките на платформата.',
          readTime: '5 мин',
          icon: Instagram,
          color: 'bg-pink-100',
          iconColor: 'text-pink-700',
        },
        {
          title: 'Как работи shadowban в TikTok',
          excerpt: 'Как да разпознаете ограничената видимост и какви разумни стъпки да предприемете.',
          readTime: '6 мин',
          icon: Video,
          color: 'bg-cyan-100',
          iconColor: 'text-cyan-700',
        },
        {
          title: 'Сигурност на профила: двуфакторна автентикация',
          excerpt: 'Практическо ръководство за по-добра защита на профили, свързани с бизнес и аудитория.',
          readTime: '4 мин',
          icon: LockKeyhole,
          color: 'bg-violet-100',
          iconColor: 'text-violet-700',
        },
        {
          title: 'Ad Account ограничения в Meta и как да ги избегнете',
          excerpt: 'Най-честите причини за ограничения и полезни навици за защита на рекламния акаунт.',
          readTime: '7 мин',
          icon: AlertTriangle,
          color: 'bg-amber-100',
          iconColor: 'text-amber-700',
        },
        {
          title: 'Права при банване в социалните мрежи',
          excerpt: 'Основните възможности, когато смятате, че акаунтът ви е ограничен или спрян неправилно.',
          readTime: '8 мин',
          icon: ShieldCheck,
          color: 'bg-emerald-100',
          iconColor: 'text-emerald-700',
        },
        {
          title: 'Как да подготвите обжалване към платформа',
          excerpt: 'Ясна структура за събиране на факти и подготовка на спокойно, конкретно обжалване.',
          readTime: '6 мин',
          icon: ShieldCheck,
          color: 'bg-blue-100',
          iconColor: 'text-blue-700',
        },
      ]
    : [
        {
          title: 'How to Protect Your Instagram Account from Banning',
          excerpt: 'Practical content, security, and platform-policy habits that can help protect your account.',
          readTime: '5 min',
          icon: Instagram,
          color: 'bg-pink-100',
          iconColor: 'text-pink-700',
        },
        {
          title: 'How Shadowban Works on TikTok',
          excerpt: 'How to recognize limited visibility and which reasonable steps you can take next.',
          readTime: '6 min',
          icon: Video,
          color: 'bg-cyan-100',
          iconColor: 'text-cyan-700',
        },
        {
          title: 'Account Security: Two-Factor Authentication',
          excerpt: 'A practical guide to stronger protection for accounts connected to a business or audience.',
          readTime: '4 min',
          icon: LockKeyhole,
          color: 'bg-violet-100',
          iconColor: 'text-violet-700',
        },
        {
          title: 'Meta Ad Account Restrictions and How to Avoid Them',
          excerpt: 'Common causes of restrictions and useful habits for protecting a business advertising account.',
          readTime: '7 min',
          icon: AlertTriangle,
          color: 'bg-amber-100',
          iconColor: 'text-amber-700',
        },
        {
          title: 'Your Rights When Banned on Social Media',
          excerpt: 'The main options available when you believe an account was limited or disabled incorrectly.',
          readTime: '8 min',
          icon: ShieldCheck,
          color: 'bg-emerald-100',
          iconColor: 'text-emerald-700',
        },
        {
          title: 'How to Prepare an Appeal to a Platform',
          excerpt: 'A clear way to gather the facts and prepare a calm, specific appeal to a platform.',
          readTime: '6 min',
          icon: ShieldCheck,
          color: 'bg-blue-100',
          iconColor: 'text-blue-700',
        },
      ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Блог | Предстоящи материали | Unban Solutions' : 'Blog | Upcoming Resources | Unban Solutions'}
        description={isBg
          ? 'Подготвяме практически материали за защита на акаунти и работа с ограничения в социалните мрежи.'
          : 'We are preparing practical resources about account protection and social media restrictions.'
        }
        keywords={isBg
          ? 'защита акаунт instagram, избегни бан tiktok, двуфакторна автентикация, обжалване бан'
          : 'account protection instagram, avoid tiktok ban, two factor authentication, ban appeal'
        }
        canonical="https://www.unbansolutions.com/blog"
      />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-24 pb-8 sm:pt-28 sm:pb-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-violet-200/40 blur-[90px]" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <p className="label-mono mb-2">{isBg ? 'Блог' : 'Blog'}</p>
            <h1 className="mb-3 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900">
              {isBg ? 'Практични материали ' : 'Practical resources '}
              <span className="gradient-text">{isBg ? 'идват скоро' : 'coming soon'}</span>
            </h1>
            <p className="max-w-[590px] text-sm leading-relaxed text-slate-600">
              {isBg
                ? 'Подготвяме темите внимателно. Дотогава можете да разгледате какво предстои или да поискате персонална оценка.'
                : 'We are preparing each topic carefully. Until then, preview what is coming or request a personal assessment.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <article
                  key={article.title}
                  className="glass-card-hover flex h-full flex-col p-5"
                  data-reveal
                  style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as CSSProperties}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${article.color}`}>
                      <article.icon size={18} className={article.iconColor} aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-700">
                      {isBg ? 'Скоро' : 'Coming soon'}
                    </span>
                  </div>
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock3 size={11} aria-hidden="true" />
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="mb-2 text-sm font-bold leading-snug text-slate-900">{article.title}</h2>
                  <p className="flex-1 text-xs leading-relaxed text-slate-600">{article.excerpt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 py-10">
          <div className="mx-auto max-w-[520px] px-6 text-center">
            <h2 className="mb-3 text-xl font-bold text-white">
              {isBg ? 'Имате проблем с акаунта си сега?' : 'Having an account issue right now?'}
            </h2>
            <p className="mb-5 text-sm text-blue-100">
              {isBg ? 'Не е нужно да чакате статиите — поискайте безплатна оценка.' : 'You do not have to wait for the articles — request a free assessment.'}
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
