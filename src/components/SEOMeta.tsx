import { useEffect } from 'react';

interface SEOMetaProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export default function SEOMeta({ title, description, keywords, ogImage = 'https://www.unbansolutions.com/og-image.jpg', canonical, noindex = false }: SEOMetaProps) {
  useEffect(() => {
    document.title = title;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', description);
    }

    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', keywords);
    }

    const ogTags: Record<string, string> = { 'og:title': title, 'og:image': ogImage };
    if (description) ogTags['og:description'] = description;
    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) tag.setAttribute('content', content);
    });

    const twitterTags: Record<string, string> = { 'twitter:title': title, 'twitter:image': ogImage };
    if (description) twitterTags['twitter:description'] = description;
    Object.entries(twitterTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) tag.setAttribute('content', content);
    });

    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (linkCanonical) linkCanonical.setAttribute('href', canonical);
    }

    if (noindex) {
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) metaRobots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    return () => {
      document.title = 'Unban Solutions | Възстановяване на Акаунти и Дигитална Защита';
    };
  }, [title, description, keywords, ogImage, canonical, noindex]);

  return null;
}
