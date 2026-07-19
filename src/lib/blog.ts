import { blogPosts } from '@/generated/blog-posts';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  date: string;
  readTime: string;
  content: string;
  html: string;
  coverImage?: string;
  tags?: string[];
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
}

export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return blogPosts.find((post) => post.slug === slug) || null;
}
