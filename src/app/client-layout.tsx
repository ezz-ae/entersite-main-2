'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/hooks/useAuth';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const HIDDEN_PREFIXES = ['/dashboard', '/builder', '/admin', '/api'];
const HIDDEN_ROUTES = new Set(['/init', '/profile']);

function shouldShowPublicChrome(pathname: string) {
  if (HIDDEN_ROUTES.has(pathname)) {
    return false;
  }

  if (pathname.startsWith('/p/')) {
    return false;
  }

  return !HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showPublicChrome = useMemo(() => shouldShowPublicChrome(pathname), [pathname]);

  return (
    <AuthProvider>
      {showPublicChrome && <SiteHeader />}
      {children}
      {showPublicChrome && <SiteFooter />}
    </AuthProvider>
  );
}
