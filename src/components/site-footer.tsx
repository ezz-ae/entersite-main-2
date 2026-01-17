'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { EntrestateLogo } from '@/components/icons';
import { FOOTER_KNOWLEDGE_LINKS, FOOTER_PLATFORM_LINKS } from '@/data/navigation';

const ACCOUNT_LINKS = [
  { href: '/account', label: 'Control Room' },
  { href: '/account/billing', label: 'Billing' },
  { href: '/account/billing#invoices', label: 'Invoices' },
  { href: '/account/usage', label: 'Usage' },
  { href: '/analytics/quality', label: 'Quality Index' },
];

const LEGAL_LINKS = [
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/data-usage', label: 'Data Usage' },
  { href: '/legal/compliance', label: 'Compliance' },
  { href: '/support', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/10 pb-10 pt-14">
      <div className="container mx-auto px-6 max-w-[1800px]">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <Link href="/market" className="hover:opacity-80 transition-opacity w-fit block">
                <EntrestateLogo />
              </Link>
              <p className="text-sm text-zinc-400 max-w-xs">
                A system-first platform for real estate execution, signals, and follow-up.
              </p>
            </div>
            <FooterColumn title="Platform" links={FOOTER_PLATFORM_LINKS} />
          </div>

          <FooterColumn title="Knowledge" links={FOOTER_KNOWLEDGE_LINKS} />
          <FooterColumn title="Account" links={ACCOUNT_LINKS} />
          <FooterColumn title="Legal & Control" links={LEGAL_LINKS} />
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-zinc-600">
          <p>© Entrestate</p>
          <p>Market infrastructure for real estate.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">{title}</h4>
      <ul className="space-y-3 text-sm text-zinc-400">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>
              {link.label}
              <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
    >
      {children}
    </Link>
  );
}
