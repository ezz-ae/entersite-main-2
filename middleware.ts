import { NextRequest, NextResponse } from 'next/server';

const normalizeDomain = (domain: string) => domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');

const ROOT_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com');
const SITE_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${ROOT_DOMAIN}`);

function mapLegacyPath(pathname: string) {
  if (pathname === '/ads/google' || pathname.startsWith('/ads/google/')) return '/google-ads';
  if (pathname === '/dashboard') return '/account';
  if (pathname.startsWith('/dashboard/campaigns')) {
    return pathname.replace('/dashboard/campaigns', '/google-ads/campaigns');
  }
  if (pathname.startsWith('/dashboard/google-ads')) return '/google-ads';
  if (pathname.startsWith('/dashboard/ai-tools')) return '/account';
  if (pathname.startsWith('/dashboard/chat-agent')) {
    return pathname.replace('/dashboard/chat-agent', '/chat-agent');
  }
  if (pathname.startsWith('/dashboard/leads')) {
    return pathname.replace('/dashboard/leads', '/leads');
  }
  if (pathname.startsWith('/dashboard/sites')) {
    return pathname.replace('/dashboard/sites', '/builder/sites');
  }
  if (pathname.startsWith('/dashboard/domain')) return '/account/integrations';
  if (pathname.startsWith('/dashboard/billing')) return '/account/billing';
  if (pathname.startsWith('/dashboard/team')) return '/account/team';
  if (pathname.startsWith('/dashboard/usage')) return '/account/usage';
  if (pathname.startsWith('/dashboard/assets')) return '/builder/library';
  if (pathname.startsWith('/dashboard/brand')) return '/builder';
  if (pathname.startsWith('/dashboard/flex')) return '/account/integrations';
  if (pathname.startsWith('/dashboard/jobs')) return '/admin/jobs';
  if (pathname.startsWith('/dashboard/sender-queue')) return '/sender/queue';
  if (pathname.startsWith('/dashboard/email-marketing')) return '/sender/sequences';
  if (pathname.startsWith('/dashboard/sms-marketing')) return '/sender/sequences';
  if (pathname.startsWith('/dashboard/marketing')) return '/google-ads';
  if (pathname.startsWith('/dashboard/meta-audience')) return '/market';
  if (pathname.startsWith('/dashboard/reports')) return '/analytics';
  if (pathname.startsWith('/dashboard/audience')) return '/market';
  if (pathname.startsWith('/profile')) return '/account/profile';
  if (pathname.startsWith('/discover')) {
    return pathname.replace('/discover', '/inventory');
  }
  if (pathname.startsWith('/smart-sender')) {
    return pathname.replace('/smart-sender', '/sender');
  }
  if (pathname.startsWith('/audience-network')) return '/market';
  return null;
}

export function middleware(req: NextRequest) {
  const hostHeader = req.headers.get('host') || '';
  const host = hostHeader.split(':')[0];
  const legacyPath = mapLegacyPath(req.nextUrl.pathname);
  if (legacyPath) {
    const url = req.nextUrl.clone();
    url.pathname = legacyPath;
    return NextResponse.redirect(url);
  }

  if (!host || req.nextUrl.pathname.startsWith('/p/')) {
    return NextResponse.next();
  }

  if (
    host === ROOT_DOMAIN ||
    host === `www.${ROOT_DOMAIN}` ||
    host.endsWith('.vercel.app') ||
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.startsWith('127.')
  ) {
    return NextResponse.next();
  }

  if (host.endsWith(`.${SITE_DOMAIN}`)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/p/${host}`;
  url.searchParams.set('domain', host);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
