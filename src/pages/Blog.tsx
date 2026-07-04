import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

export default function Blog() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const articles = isBg ? [
    {
      slug: 'kak-da-vazstanovite-banat-instagram-akaunt',
      title: 'Как да възстановите баннат Instagram акаунт през 2025',
      excerpt: 'Пълно ръководство стъпка по стъпка за възстановяване на баннат, изтрит или хакнат Instagram профил. Научете кои са най-честите причини за бан и как да ги избегнете.',
      date: '15 юни 2025',
      readTime: '8 мин',
      category: 'Instagram',
    },
    {
      slug: 'shadowban-v-tiktok-kak-da-razberete-i-premahnete',
      title: 'Shadowban в TikTok: Как да разберете и премахнете',
      excerpt: 'Всичко, което трябва да знаете за shadowban в TikTok — симптоми, причини, инструменти за диагностика и доказани методи за възстановяване на видимостта.',
      date: '10 юни 2025',
      readTime: '6 мин',
      category: 'TikTok',
    },
    {
      slug: 'meta-business-suite-ad-account-restriction',
      title: 'Ограничение на Ad Account в Meta: Причини и решения',
      excerpt: 'Защо Facebook ограничава рекламни акаунти и как да възстановите достъпа си. Практически съвети за предотвратяване на бъдещи ограничения.',
      date: '5 юни 2025',
      readTime: '7 мин',
      category: 'Meta',
    },
    {
      slug: 'otkradnat-instagram-profil-kak-da-si-go-varnete',
      title: 'Откраднат Instagram профил — как да си го върнете',
      excerpt: 'Стъпка по стъпка ръководство за възстановяване на хакнат Instagram акаунт. Какво да правите незабавно и как да защитите профила си за вбъдеще.',
      date: '28 май 2025',
      readTime: '10 мин',
      category: 'Сигурност',
    },
    {
      slug: 'youtube-monetizaciya-problemi-i-resheniya',
      title: 'YouTube монетизация: Най-чести проблеми и решения',
      excerpt: 'Как да разрешите проблеми с YouTube монетизацията, Community Guidelines strikes и ограничения на канала. Полезни съвети за създатели.',
      date: '20 май 2025',
      readTime: '9 мин',
      category: 'YouTube',
    },
    {
      slug: 'kak-da-zashitite-digitalniya-si-akaunt',
      title: 'Как да защитите дигиталния си акаунт от бан и хакерски атаки',
      excerpt: 'Превантивни мерки за защита на вашите социални мрежи. Двуфакторна автентикация, силни пароли, съвети за сигурност от експертите на Unban Solutions.',
      date: '15 май 2025',
      readTime: '5 мин',
      category: 'Сигурност',
    },
  ] : [
    {
      slug: 'how-to-recover-banned-instagram-account',
      title: 'How to Recover a Banned Instagram Account in 2025',
      excerpt: 'Complete step-by-step guide to recovering a banned, deleted, or hacked Instagram profile. Learn the most common ban reasons and how to avoid them.',
      date: 'June 15, 2025',
      readTime: '8 min',
      category: 'Instagram',
    },
    {
      slug: 'tiktok-shadowban-how-to-detect-remove',
      title: 'TikTok Shadowban: How to Detect and Remove It',
      excerpt: 'Everything you need to know about TikTok shadowban — symptoms, causes, diagnostic tools, and proven methods to restore visibility.',
      date: 'June 10, 2025',
      readTime: '6 min',
      category: 'TikTok',
    },
    {
      slug: 'meta-ad-account-restriction-fix',
      title: 'Meta Ad Account Restriction: Causes and Solutions',
      excerpt: 'Why Facebook restricts ad accounts and how to restore access. Practical tips for preventing future restrictions.',
      date: 'June 5, 2025',
      readTime: '7 min',
      category: 'Meta',
    },
    {
      slug: 'hacked-instagram-account-recovery',
      title: 'Hacked Instagram Account — How to Get It Back',
      excerpt: 'Step-by-step guide to recovering a hacked Instagram account. What to do immediately and how to protect your profile in the future.',
      date: 'May 28, 2025',
      readTime: '10 min',
      category: 'Security',
    },
    {
      slug: 'youtube-monetization-issues-fixed',
      title: 'YouTube Monetization: Common Issues and Fixes',
      excerpt: 'How to resolve YouTube monetization problems, Community Guidelines strikes, and channel restrictions. Useful tips for creators.',
      date: 'May 20, 2025',
      readTime: '9 min',
      category: 'YouTube',
    },
    {
      slug: 'protect-your-digital-account',
      title: 'How to Protect Your Digital Account from Bans and Hacks',
      excerpt: 'Preventive measures to protect your social media accounts. Two-factor authentication, strong passwords, and security tips from Unban Solutions experts.',
      date: 'May 15, 2025',
      readTime: '5 min',
      category: 'Security',
    },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Блог | Как да възстановите баннат акаунт | Unban Solutions' : 'Blog | How to Recover Banned Accounts | Unban Solutions'}
        description={isBg
          ? 'Полезни статии за възстановяване на баннати акаунти в Instagram, TikTok, YouTube, Facebook. Съвети от експертите на Unban Solutions.'
          : 'Useful articles about recovering banned accounts on Instagram, TikTok, YouTube, Facebook. Tips from Unban Solutions experts.'
        }
        keywords={isBg
          ? 'как да възстановя instagram, баннат акаунт решение, shadowban tiktok, хакнат профил, мета ограничение'
          : 'recover instagram account, banned account fix, tiktok shadowban, hacked profile, meta restriction'
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
                ? 'Експертни съвети за възстановяване на акаунти, защита от shadowban и поддържане на дигиталното ви присъствие.'
                : 'Expert advice on account recovery, shadowban protection, and maintaining your digital presence.'}
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="glass-card-hover p-5 flex flex-col h-full group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-100">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-slate-900 font-bold text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
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
