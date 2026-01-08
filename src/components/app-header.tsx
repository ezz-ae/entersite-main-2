'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';

export function AppHeader() {
  const pathname = usePathname();

  // Define base routes where the main site header should be hidden
  const hiddenHeaderRoutes = [
    '/builder',
    '/dashboard',
    '/admin',
    '/profile',
  ];

  // Check if the current pathname starts with any of the hidden routes
  const shouldHideHeader = hiddenHeaderRoutes.some(route => pathname.startsWith(route));

  if (shouldHideHeader) {
    return null;
  }

  return <SiteHeader />;
}
