import { useEffect } from 'react';

type StructuredData = Record<string, unknown>;

interface SEOMetaProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  structuredData?: StructuredData;
}

const DEFAULT_IMAGE = 'https://www.unbansolutions.com/icon-512.png';

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  for (const [key, value] of Object.entries(attributes)) tag.setAttribute(key, value);
}

function ensureCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
}

export default function SEOMeta({
  title,
  description,
  keywords,
  ogImage = DEFAULT_IMAGE,
  canonical,
  noindex = false,
  type = 'website',
  structuredData,
}: SEOMetaProps) {
  useEffect(() => {
    const canonicalUrl = canonical || `https://www.unbansolutions.com${window.location.pathname}`;
    document.title = title;
    if (description) ensureMeta('meta[name="description"]', { name: 'description', content: description });
    if (keywords) ensureMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    ensureMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    });
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    if (description) ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });
    ensureMeta('meta[name="twitter:url"]', { name: 'twitter:url', content: canonicalUrl });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });
    if (description) ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    ensureCanonical(canonicalUrl);

    const schemaId = 'route-schema';
    document.getElementById(schemaId)?.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData).replace(/</g, '\\u003c');
      document.head.appendChild(script);
    }

    return () => document.getElementById(schemaId)?.remove();
  }, [title, description, keywords, ogImage, canonical, noindex, type, structuredData]);

  return null;
}
