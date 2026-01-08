import { NextRequest, NextResponse } from 'next/server';

const normalizeDomain = (domain: string) => domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');

const ROOT_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'entrestate.com');
const SITE_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_SITE_DOMAIN || `site.${ROOT_DOMAIN}`);

export function middleware(req: NextRequest) {
  const hostHeader = req.headers.get('host') || '';
  const host = hostHeader.split(':')[0];

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
