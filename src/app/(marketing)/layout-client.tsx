'use client';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function MarketingLayoutClient({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <>
            <SiteHeader />
            <main className="min-h-screen">
                {children}
            </main>
            <SiteFooter />
        </>
    )
}
