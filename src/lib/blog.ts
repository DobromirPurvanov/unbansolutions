import matter from 'gray-matter';
import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
  html: string;
  coverImage?: string;
  tags?: string[];
}

/**
 * Load all blog posts from markdown files in /blog/*.md
 */
export async function loadBlogPosts(): Promise<BlogPost[]> {
  const modules = import.meta.glob('/public/blog/*.md', {
    query: '?raw',
    import: 'default',
  });

  const posts: BlogPost[] = [];

  for (const path in modules) {
    const raw = await modules[path]() as string;
    const { data, content } = matter(raw);
    const slug = path.replace('/public/blog/', '').replace('.md', '');

    posts.push({
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      date: data.date || new Date().toISOString().split('T')[0],
      readTime: data.readTime || estimateReadTime(content),
      content,
      html: await marked(content),
      coverImage: data.coverImage,
      tags: data.tags || [],
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Load a single blog post by slug
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/blog/${slug}.md`);
    if (!response.ok) return null;

    const raw = await response.text();
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || content.slice(0, 150) + '...',
      date: data.date || new Date().toISOString().split('T')[0],
      readTime: data.readTime || estimateReadTime(content),
      content,
      html: await marked(content),
      coverImage: data.coverImage,
      tags: data.tags || [],
    };
  } catch {
    return null;
  }
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min`;
}
