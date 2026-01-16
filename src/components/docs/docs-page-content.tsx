'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  Zap,
  MessageSquare,
  Globe,
  Target,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const DOCS_CATEGORIES = [
  {
    title: 'Start Here',
    icon: Zap,
    links: [
      { label: 'Get your workspace ready', href: '#setup' },
      { label: 'Add your inventory', href: '#inventory' },
      { label: 'Build your first page', href: '#website' },
      { label: 'Capture leads', href: '#leads' },
    ],
  },
  {
    title: 'Marketing & Follow-Up',
    icon: Target,
    links: [
      { label: 'Launch Google Ads', href: '#ads' },
      { label: 'Stay on top of inquiries', href: '#followup' },
      { label: 'Share listings fast', href: '#sharing' },
      { label: 'Best posting schedule', href: '#posting' },
    ],
  },
  {
    title: 'Domains & Branding',
    icon: Globe,
    links: [
      { label: 'Connect your web address', href: '#domain' },
      { label: 'Choose your logo & colors', href: '#branding' },
      { label: 'Team access', href: '#team' },
      { label: 'Privacy & security', href: '#security' },
    ],
  },
  {
    title: 'Live Support',
    icon: MessageSquare,
    links: [
      { label: 'Talk to support', href: '#support' },
      { label: 'Book a walkthrough', href: '#support' },
      { label: 'Emergency help', href: '#support' },
      { label: 'Login help', href: '#support' },
    ],
  },
];

const GUIDE_SECTIONS = [
  {
    id: 'setup',
    title: 'Get Your Workspace Ready',
    subtitle: 'Get your profile ready in a few minutes.',
    steps: [
      'Add your logo, brand colors, and contact number.',
      'Update your office name and service areas.',
      'Invite your assistant or teammate if needed.',
    ],
  },
  {
    id: 'inventory',
    title: 'Add Your Inventory',
    subtitle: 'Make sure every listing looks complete and accurate.',
    steps: [
      'Upload brochures or add listings manually.',
      'Add photos, price range, and availability.',
      'Confirm handover dates and key amenities.',
    ],
  },
  {
    id: 'website',
    title: 'Build Your First Page',
    subtitle: 'Create a clean landing page for any project.',
    steps: [
      'Choose a layout and set your headline.',
      'Add listings, highlights, and a lead form.',
      'Preview on mobile and publish when ready.',
    ],
  },
  {
    id: 'leads',
    title: 'Capture Leads',
    subtitle: 'Never miss a buyer inquiry.',
    steps: [
      'Choose where leads go (email, SMS, or both).',
      'Add quick replies to save time.',
      'Assign leads to your team with one click.',
    ],
  },
  {
    id: 'ads',
    title: 'Launch Google Ads',
    subtitle: 'Start with a simple campaign you can grow.',
    steps: [
      'Start Google Ads from the dashboard (no billing needed).',
      'Pick a budget and the area you want to target.',
      'We launch the ads and keep you updated.',
    ],
  },
  {
    id: 'followup',
    title: 'Stay on Top of Inquiries',
    subtitle: 'Keep every lead warm without extra effort.',
    steps: [
      'Use the Leads tab to see new inquiries in one place.',
      'Add notes after calls or site visits.',
      'Set reminders so follow-ups never slip.',
    ],
  },
  {
    id: 'sharing',
    title: 'Share Listings Fast',
    subtitle: 'Send a clean project link in seconds.',
    steps: [
      'Open a listing and tap “Share.”',
      'Send the link over WhatsApp, email, or SMS.',
      'Track which links get the most attention.',
    ],
  },
  {
    id: 'posting',
    title: 'Best Posting Schedule',
    subtitle: 'Keep your feed consistent.',
    steps: [
      'Post 3–5 times per week for best reach.',
      'Mix project highlights with lifestyle content.',
      'Save your best posts and reuse them.',
    ],
  },
  {
    id: 'domain',
    title: 'Connect Your Web Address',
    subtitle: 'Use your own website name.',
    steps: [
      'Add your web address in the Web Address section.',
      'Copy the two lines we show and paste them where you bought your web address.',
      'We’ll confirm when it is connected.',
    ],
  },
  {
    id: 'branding',
    title: 'Choose Your Logo & Colors',
    subtitle: 'Keep everything on-brand.',
    steps: [
      'Upload your logo in the Brand area.',
      'Pick primary and accent colors.',
      'Check your pages on mobile before publishing.',
    ],
  },
  {
    id: 'team',
    title: 'Team Access',
    subtitle: 'Let your team work together.',
    steps: [
      'Add teammates by email.',
      'Choose what they can edit.',
      'Review changes before publishing.',
    ],
  },
  {
    id: 'security',
    title: 'Privacy & Security',
    subtitle: 'Keep your data and leads protected.',
    steps: [
      'Only share pages you want public.',
      'Use strong passwords for team logins.',
      'Contact support if you see anything unusual.',
    ],
  },
];

export function DocsPageContent() {
  return (
    <main className="min-h-screen bg-black text-white py-36">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <Book className="h-3 w-3" /> Support & Guides
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Help <br />
            <span className="text-zinc-600">Center.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
            Simple steps for real estate teams. Clear answers, fast start, and real support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="#setup"
              className="h-12 px-6 rounded-full border border-white/10 bg-white/5 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#inventory"
              className="h-12 px-6 rounded-full border border-white/10 bg-white/5 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              Inventory Help <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#support"
              className="h-12 px-6 rounded-full border border-blue-500/30 bg-blue-600/20 text-blue-200 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-blue-600/30 transition-all"
            >
              Talk to Support <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs/library"
              className="h-12 px-6 rounded-full border border-white/10 bg-black/40 text-zinc-200 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 hover:bg-white/5 transition-all"
            >
              Technical Docs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {DOCS_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="bg-zinc-900/50 border-white/5 hover:border-blue-500/30 transition-all duration-500 h-full p-8 rounded-[2.5rem]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <cat.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold">{cat.title}</h3>
                </div>
                <div className="space-y-3">
                  {cat.links.map((link) => (
                    <Link
                      key={`${cat.title}-${link.label}`}
                      href={link.href}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 group transition-colors"
                    >
                      <span className="text-zinc-400 group-hover:text-white font-medium">{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-white/5 border-white/10 text-zinc-400">Guides</Badge>
              <h2 className="text-3xl font-bold mt-4">Step-by-step help</h2>
              <p className="text-zinc-500 mt-2">Clear instructions you can follow on mobile.</p>
            </div>
          </div>

          <div className="grid gap-6">
            {GUIDE_SECTIONS.map((section) => (
              <Card key={section.id} id={section.id} className="bg-zinc-900/60 border border-white/5 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold">{section.title}</h3>
                <p className="text-zinc-500 mt-2">{section.subtitle}</p>
                <div className="mt-6 grid gap-3">
                  {section.steps.map((step) => (
                    <div key={step} className="flex items-start gap-3 text-zinc-300">
                      <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                      <span className="text-sm leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-24 border-t border-white/5 pt-16 text-center space-y-6" id="support">
          <h4 className="text-2xl font-bold">Still need help?</h4>
          <p className="text-zinc-500">We answer quickly and guide you step by step.</p>
          <Link
            href="/support"
            className="h-14 px-10 rounded-full border border-blue-500/30 bg-blue-600/20 text-blue-200 font-bold uppercase tracking-widest inline-flex items-center gap-2 hover:bg-blue-600/30 transition-all"
          >
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
