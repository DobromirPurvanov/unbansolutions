import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { loadBlogPost, type BlogPost as BlogPostType } from '@/lib/blog';
import { ArrowLeft, Clock, CalendarDays, Tag } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    loadBlogPost(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {isBg ? 'Статията не е намерена' : 'Article not found'}
          </h1>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            {isBg ? 'Обратно към блога' : 'Back to blog'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <SEOMeta
        title={`${post.title} | Unban Solutions`}
        description={post.excerpt}
        canonical={`https://www.unbansolutions.com/blog/${post.slug}`}
      />
      <main>
        {/* Article Header */}
        <section className="relative pt-24 pb-10 bg-gradient-to-br from-blue-50 via-white to-violet-50 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
          <div className="relative max-w-[800px] mx-auto px-6 lg:px-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-slate-500 text-xs mb-4 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={12} />
              {isBg ? 'Всички статии' : 'All articles'}
            </Link>

            <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold text-slate-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs">
              <div className="flex items-center gap-1">
                <CalendarDays size={12} />
                <span>{new Date(post.date).toLocaleDateString(isBg ? 'bg-BG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{post.readTime}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag size={12} />
                  <span>{post.tags.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-10 bg-white">
          <div className="max-w-[800px] mx-auto px-6 lg:px-10">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto rounded-xl mb-8 object-cover max-h-[400px]"
              />
            )}

            <article
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {/* Back to blog */}
            <div className="mt-12 pt-6 border-t border-slate-100">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                <ArrowLeft size={14} />
                {isBg ? 'Виж всички статии' : 'See all articles'}
              </Link>
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
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
