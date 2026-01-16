'use client';

import React from 'react';
import Link from 'next/link';
import { EntrestateLogo } from '@/components/icons';
import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin, ShieldCheck, Users, Zap } from 'lucide-react';

const PLATFORM_LINKS = [
  { href: '/instagram-assistant', label: 'Instagram Assistant' },
  { href: '/google-ads', label: 'Google Ads' },
  { href: '/audience-network', label: 'Buyer Audience' },
  { href: '/discover', label: 'Market Feed' },
];

const COMPANY_LINKS = [
  { href: '/start', label: 'Get Started' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/blog', label: 'Insights' },
];

const SUPPORT_LINKS = [
  { href: '/support', label: 'Support Center' },
  { href: '/docs', label: 'Guides' },
  { href: '/status', label: 'System Status' },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Secure Workspaces',
    description: 'Private access with clear team roles.',
  },
  {
    icon: Users,
    title: 'Team-Ready',
    description: 'Assign leads and follow-up together.',
  },
  {
    icon: Zap,
    title: 'Fast Launch',
    description: 'Pages and campaigns ready in minutes.',
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-black text-white border-t border-white/10 pb-12 pt-16">
      <div className="container mx-auto px-6 max-w-[1800px]">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 md:flex md:items-center md:justify-between md:gap-10">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
              Built for broker teams
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              Launch listings, capture leads, follow up fast.
            </h3>
            <p className="text-zinc-400 max-w-2xl">
              Entrestate keeps your listings, follow-up, and campaigns in one clear workflow designed for mobile-first teams.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <FooterCta href="/start">Start Now</FooterCta>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-white">
                <item.icon className="h-5 w-5" />
                <p className="font-semibold">{item.title}</p>
              </div>
              <p className="text-sm text-zinc-400 mt-3">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-12 gap-10 border-t border-white/10 pt-12">
          <div className="col-span-2 md:col-span-4 space-y-6">
            <Link href="/" className="hover:opacity-80 transition-opacity w-fit block">
              <EntrestateLogo />
            </Link>
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              A real estate growth platform built for brokers who want simple tools, clean reporting, and fast execution.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://www.linkedin.com" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="https://www.instagram.com" icon={Instagram} label="Instagram" />
              <SocialLink href="mailto:support@entrestate.com" icon={Mail} label="Email Support" />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 text-white">
                <Mail className="h-4 w-4" />
                <p className="text-sm font-semibold">Support</p>
              </div>
              <p className="text-sm text-zinc-400 mt-3">
                Need help onboarding your team or launching a listing?
              </p>
              <div className="mt-4 space-y-2">
                {SUPPORT_LINKS.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </FooterLink>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm text-zinc-400">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div>
                <p className="text-white font-semibold">Dubai, UAE</p>
                <p>Serving brokers across the UAE market.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-zinc-600">
          <p>© 2024 Entrestate. All rights reserved.</p>
          <p>Entrestate is built for real estate teams who need clarity and speed.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
    >
      {children}
    </Link>
  );
}

function FooterCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
    >
      {children}
      <ArrowUpRight className="h-4 w-4" />
    </Link>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      aria-label={label}
      className="text-zinc-500 hover:text-white transition-all hover:scale-105"
    >
      <Icon className="h-5 w-5" strokeWidth={2} />
    </Link>
  );
}
