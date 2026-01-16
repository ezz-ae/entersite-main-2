import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
  const siteUrl = `https://${rootDomain}`;
  const now = new Date();

  const routes = [
    '/',
    '/instagram-assistant',
    '/instagram-assistant/demo',
    '/google-ads',
    '/audience-network',
    '/discover',
    '/docs',
    '/docs/library',
    '/support',
    '/status',
    '/start',
    '/blog',
    '/roadmap',
    '/changelog',
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.6,
  }));
}
