'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileBottomNav } from '@/components/mobile-app/mobile-bottom-nav';
import { cn } from '@/lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  const isEditor = pathname?.startsWith('/builder');
  const isAccount = pathname?.startsWith('/account');
  const isAdmin = pathname?.startsWith('/admin');
  const isProfile = pathname?.startsWith('/profile');
  const isPublished = pathname?.startsWith('/p/');
  const isTrending = pathname === '/instagram-assistant';

  // Hide global header/footer on app-like pages
  const hideChrome = isEditor || isAccount || isAdmin || isProfile || isPublished || isTrending;

  return (
    <div className={cn(isMobile && isAccount && "pb-20", "relative z-10")}>
      <div className="min-h-screen">
          {children}
      </div>
      
      {/* Mobile module navigation */}
  {isMobile && (isAccount || isTrending) && <MobileBottomNav />}
    </div>
  );
}
