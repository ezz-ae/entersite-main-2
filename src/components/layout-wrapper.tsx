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
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAdmin = pathname?.startsWith('/admin');
  const isProfile = pathname?.startsWith('/profile');
  const isPublished = pathname?.startsWith('/p/');
  const isTrending = pathname === '/trending'; // The AI Agent "Terminal" Page

  // Hide global header/footer on app-like pages or dashboard
  const hideChrome = isEditor || isDashboard || isAdmin || isProfile || isPublished || isTrending;

  return (
    <div className={cn(isMobile && isDashboard && "pb-20", "relative z-10")}>
      <div className="min-h-screen">
          {children}
      </div>
      
      {/* Mobile-Only Dashboard & App Navigation */}
      {isMobile && (isDashboard || isTrending) && <MobileBottomNav />}
    </div>
  );
}
