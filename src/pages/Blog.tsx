import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Link } from 'react-router-dom';
import { loadBlogPosts, type BlogPost } from '@/lib/blog';
import { ArrowRight, Clock, CalendarDays } from 'lucide-react';

export default function Blog() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

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

        {/* Loading State */}
        {loading && (
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass-card-hover p-5 flex flex-col h-full animate-pulse">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 mb-3" />
                    <div className="h-4 bg-slate-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-slate-200 rounded mb-1 w-full" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        {!loading && posts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="glass-card-hover p-5 flex flex-col h-full group"
                  >
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={12} aria-hidden="true" />
                        <span>{new Date(post.date).toLocaleDateString(isBg ? 'bg-BG' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} aria-hidden="true" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h2 className="text-slate-900 font-bold text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 text-xs leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-blue-600 text-xs font-medium group-hover:gap-2 transition-all">
                      {isBg ? 'Прочети' : 'Read'}
                      <ArrowRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <section className="py-12 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
              <p className="text-slate-500 text-sm">
                {isBg ? 'Все още няма публикувани статии.' : 'No articles published yet.'}
              </p>
            </div>
          </section>
        )}

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
