import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com';
  const siteUrl = `https://${rootDomain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/builder',
          '/admin',
          '/api',
          '/init',
          '/profile',
          '/_next',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
