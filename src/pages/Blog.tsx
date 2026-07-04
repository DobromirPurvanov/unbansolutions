import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Instagram, Lock, AlertTriangle, Video, ShieldCheck } from 'lucide-react';

export default function Blog() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const articles = isBg ? [
    {
      title: 'Как да предпазите Instagram акаунта си от бан',
      excerpt: 'Научете най-важните правила на Instagram, които трябва да спазвате, за да избегнете банване на профила си. Съвети за сигурно съдържание и съответствие с политиките на платформата.',
      readTime: '5 мин',
      icon: Instagram,
      color: 'bg-pink-100',
      iconColor: 'text-pink-700',
    },
    {
      title: 'Как работи shadowban в TikTok',
      excerpt: 'Разберете какво е shadowban, как да разберете дали сте засегнати и какви стъпки да предприемете за възстановяване на видимостта на видеоклиповете си.',
      readTime: '6 мин',
      icon: Video,
      color: 'bg-cyan-100',
      iconColor: 'text-cyan-700',
    },
    {
      title: 'Сигурност на профила: двуфакторна автентикация',
      excerpt: 'Защо двуфакторната автентикация е задължителна за всеки, който разчита на социалните мрежи за бизнес. Практическо ръководство за настройка.',
      readTime: '4 мин',
      icon: Lock,
      color: 'bg-violet-100',
      iconColor: 'text-violet-700',
    },
    {
      title: 'Ad Account ограничения в Meta и как да ги избегнете',
      excerpt: 'Разберете най-честите причини за ограничаване на рекламни акаунти в Meta и как да защитите своя бизнес рекламен акаунт.',
      readTime: '7 мин',
      icon: AlertTriangle,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
    },
    {
      title: 'Права при банване в социалните мрежи',
      excerpt: 'Какви са вашите права като потребител на социалните мрежи и какво можете да направите, ако смятате, че сте баннати неправилно.',
      readTime: '8 мин',
      icon: ShieldCheck,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Как да подготвите обжалване към платформа',
      excerpt: 'Практически съвети за подготовка на успешно обжалване към Instagram, TikTok, YouTube и други платформи при банване.',
      readTime: '6 мин',
      icon: Instagram,
      color: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
  ] : [
    {
      title: 'How to Protect Your Instagram Account from Banning',
      excerpt: 'Learn the most important Instagram rules you need to follow to avoid getting your profile banned. Tips for safe content and compliance with platform policies.',
      readTime: '5 min',
      icon: Instagram,
      color: 'bg-pink-100',
      iconColor: 'text-pink-700',
    },
    {
      title: 'How Shadowban Works on TikTok',
      excerpt: 'Understand what shadowban is, how to know if you are affected, and what steps to take to restore visibility of your videos.',
      readTime: '6 min',
      icon: Video,
      color: 'bg-cyan-100',
      iconColor: 'text-cyan-700',
    },
    {
      title: 'Account Security: Two-Factor Authentication',
      excerpt: 'Why two-factor authentication is essential for anyone who relies on social media for business. Practical setup guide.',
      readTime: '4 min',
      icon: Lock,
      color: 'bg-violet-100',
      iconColor: 'text-violet-700',
    },
    {
      title: 'Ad Account Restrictions in Meta and How to Avoid Them',
      excerpt: 'Learn the most common reasons for advertising account restrictions in Meta and how to protect your business ad account.',
      readTime: '7 min',
      icon: AlertTriangle,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-700',
    },
    {
      title: 'Your Rights When Banned on Social Media',
      excerpt: 'What are your rights as a user of social networks and what can you do if you believe you have been wrongly banned.',
      readTime: '8 min',
      icon: ShieldCheck,
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'How to Prepare an Appeal to a Platform',
      excerpt: 'Practical tips for preparing a successful appeal to Instagram, TikTok, YouTube and other platforms when banned.',
      readTime: '6 min',
      icon: Instagram,
      color: 'bg-blue-100',
      iconColor: 'text-blue-700',
    },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Блог | Полезни съвети за защита на акаунти | Unban Solutions' : 'Blog | Tips for Account Protection | Unban Solutions'}
        description={isBg
          ? 'Полезни статии за защита на акаунти в Instagram, TikTok, YouTube, Facebook. Как да избегнете бан и да защитите профила си.'
          : 'Useful articles about account protection on Instagram, TikTok, YouTube, Facebook. How to avoid bans and protect your profile.'
        }
        keywords={isBg
          ? 'защита акаунт instagram, избегни бан tiktok, двуфакторна автентикация, ad account ограничение, обжалване бан'
          : 'account protection instagram, avoid tiktok ban, two factor authentication, ad account restriction, ban appeal'
        }
        canonical="https://www.unbansolutions.com/blog"
      />
      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-10 bg-gradient-to-br from-blue-50 via-white to-violet-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="label-mono mb-2">{isBg ? 'Блог' : 'Blog'}</p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900 mb-3">
              {isBg ? 'Полезни ' : 'Useful '}
              <span className="gradient-text">{isBg ? 'съвети' : 'tips'}</span>
            </h1>
            <p className="text-slate-600 text-sm max-w-[500px]">
              {isBg
                ? 'Съвети за защита на вашите акаунти и предотвратяване на проблеми със социалните мрежи.'
                : 'Tips for protecting your accounts and preventing issues with social networks.'}
            </p>
          </div>
        </section>

        {/* Articles Grid - NO links, just informational cards */}
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article, idx) => (
                <div
                  key={idx}
                  className="glass-card-hover p-5 flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${article.color} flex items-center justify-center`}>
                      <article.icon size={18} className={article.iconColor} />
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Clock size={10} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <h2 className="text-slate-900 font-bold text-sm leading-snug mb-2">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-gradient-to-br from-blue-600 to-violet-700">
          <div className="max-w-[500px] mx-auto px-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">
              {isBg ? 'Имате проблем с акаунта си?' : 'Having issues with your account?'}
            </h2>
            <p className="text-blue-100 text-sm mb-5">
              {isBg ? 'Свържете се за безплатна оценка.' : 'Contact us for a free assessment.'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              {isBg ? 'Свържете се' : 'Contact us'}
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
