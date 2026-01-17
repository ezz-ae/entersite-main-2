import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
  const siteUrl = `https://${rootDomain}`;
  const now = new Date();

  const routes = [
    '/',
    '/google-ads',
    '/sender',
    '/builder',
    '/chat-agent',
    '/market',
    '/inventory',
    '/leads',
    '/agencies',
    '/integrations',
    '/knowledge',
    '/analytics',
    '/quality-index',
    '/docs',
    '/docs/library',
    '/support',
    '/status',
    '/login',
    '/account',
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
