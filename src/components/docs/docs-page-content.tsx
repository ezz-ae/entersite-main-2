'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Book,
  Terminal,
  Settings,
  Zap,
  Bot,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Search,
  MessageSquare,
  Globe,
  FolderOpen,
  Copy,
} from 'lucide-react';
import { DocSummary } from '@/types/docs';

const DOCS_CATEGORIES = [
  {
    title: 'Getting Started',
    icon: Zap,
    links: ['Quick Start Guide', 'System Overview', 'Mobile Setup', 'Authentication'],
  },
  {
    title: 'AI Architect',
    icon: Bot,
    links: ['Brochure Ingestion', 'Prompt Engineering', 'Site Generation', 'Data Schema'],
  },
  {
    title: 'Chat Expert',
    icon: MessageSquare,
    links: ['Instagram Auth', 'Knowledge Base Setup', 'Sales Agent Training', 'Widget Embed'],
  },
  {
    title: 'Infrastructure',
    icon: Globe,
    links: ['Vercel Domains', 'PayPal Integration', 'DNS Configuration', 'Security & SSL'],
  },
];

interface DocsPageContentProps {
  recentDocs: DocSummary[];
}

export function DocsPageContent({ recentDocs }: DocsPageContentProps) {
  const handleCopy = useCallback((value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {
      // no-op
    });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white py-40">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <Book className="h-3 w-3" /> Documentation
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            The OS <br />
            <span className="text-zinc-600">Manual.</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
            Everything you need to master the Entrestate Operating System and scale your real estate business.
          </p>
          <div className="max-w-xl mx-auto pt-8">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Search for a topic, tool, or guide..."
                className="w-full h-16 bg-zinc-900 border border-white/5 rounded-2xl pl-16 pr-6 text-lg focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {DOCS_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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
                      key={link}
                      href="#"
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 group transition-colors"
                    >
                      <span className="text-zinc-400 group-hover:text-white font-medium">{link}</span>
                      <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {recentDocs.length > 0 && (
          <section className="mt-32 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-white/5 border-white/10 text-zinc-400">Internal Docs</Badge>
                <h2 className="text-3xl font-bold mt-4">Latest Playbooks</h2>
                <p className="text-zinc-500 mt-2">Surfaced directly from the /docs directory in this workspace.</p>
              </div>
              <div className="hidden md:flex gap-3 text-xs uppercase tracking-[0.3em] text-zinc-600">
                <ShieldCheck className="h-4 w-4" />
                Source Controlled
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {recentDocs.map((doc) => (
                <Card key={doc.slug} className="bg-zinc-900/60 border border-white/5 p-6 rounded-3xl">
                  <div className="flex items-center gap-3 text-sm text-zinc-500 uppercase tracking-[0.3em]">
                    <FolderOpen className="h-4 w-4 text-blue-400" />
                    Markdown
                  </div>
                  <h3 className="text-2xl font-bold mt-4">{doc.title}</h3>
                  <p className="text-zinc-400 mt-2">{doc.summary}</p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="text-xs font-mono text-zinc-500 truncate">/{doc.path}</div>
                    <button
                      className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-200 transition-colors"
                      onClick={() => handleCopy(doc.path)}
                    >
                      <Copy className="h-3.5 w-3.5" /> Copy Path
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="mt-40 border-t border-white/5 pt-20 text-center space-y-6">
          <h4 className="text-2xl font-bold">Still need help?</h4>
          <p className="text-zinc-500">Our engineering team is live in the community discord 24/7.</p>
          <button className="h-14 px-10 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
            Join Community
          </button>
        </div>
      </div>
    </main>
  );
}
