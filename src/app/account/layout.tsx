'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sections = [
  { href: '/account', label: 'Overview' },
  { href: '/account/profile', label: 'Profile & Company' },
  { href: '/account/billing', label: 'Billing & Invoices' },
  { href: '/account/usage', label: 'Usage' },
  { href: '/account/integrations', label: 'Integrations' },
  { href: '/account/team', label: 'Team' },
  { href: '/account/notifications', label: 'Notifications' },
  { href: '/account/security', label: 'Security & Sessions' },
  { href: '/account/support', label: 'Support' },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Account Control Room</p>
          <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm text-zinc-400">Settings, billing, integrations, and security live here.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-2">
          {sections.map((section) => {
            const isActive =
              section.href === '/account'
                ? pathname === section.href
                : pathname?.startsWith(section.href);
            return (
              <Link
                key={section.href}
                href={section.href}
                className={cn(
                  'block rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                )}
              >
                {section.label}
              </Link>
            );
          })}
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
