'use client';

import React, { Suspense } from 'react';
import { LandingHeroContainer } from '@/components/marketing/landing-hero-container';
import { ReadyBuilds } from '@/components/marketing/feature-showcase/ready-builds';
import { BuilderShowcase } from '@/components/marketing/feature-showcase/builder-showcase';
import { AdsShowcase } from '@/components/marketing/feature-showcase/ads-showcase';
import { ChatAgentShowcase } from '@/components/marketing/feature-showcase/chat-agent-showcase';
import { SeoShowcase } from '@/components/marketing/feature-showcase/seo-showcase';
import { ProjectDiscoveryClient } from '@/components/marketing/project-discovery-client';
import { SystemInsights } from '@/components/marketing/system-insights';
import { FinalCTA } from '@/components/marketing/final-cta';
import { ProjectData } from '@/lib/types';

function LandingPage({ initialProjects }: { initialProjects: ProjectData[] }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <main className="min-h-screen bg-black selection:bg-blue-500/30 overflow-x-hidden">
      
      <LandingHeroContainer />

      <section className="py-8 border-y border-white/5 bg-zinc-950 flex items-center justify-center overflow-hidden">
         <div className="flex gap-16 animate-marquee whitespace-nowrap">
            <TickerItem label="Smart Listings" status="Ready" />
            <TickerItem label="Market Feed" status="Pilot" />
            <TickerItem label="Social Ads" status="Connected" />
            <TickerItem label="Photo Enhancer" status="Active" />
            <TickerItem label="DIFC Focus" status="Live" />
            <TickerItem label="Smart Listings" status="Ready" />
            <TickerItem label="Market Feed" status="Pilot" />
            <TickerItem label="Social Ads" status="Connected" />
         </div>
      </section>

      <ProjectDiscoveryClient initialProjects={initialProjects} />

      <SystemInsights />

      <ReadyBuilds />

      <BuilderShowcase />

      <div className="space-y-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-orange-500/5 pointer-events-none" />
          <AdsShowcase />
          <ChatAgentShowcase />
          <SeoShowcase />
      </div>

      <FinalCTA />

    </main>
    </Suspense>
  );
}

function TickerItem({ label, status }: { label: string, status: string }) {
    return (
        <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-xs font-mono text-white">{status}</span>
        </div>
    )
}

export function HomeClient({ initialProjects }: { initialProjects: ProjectData[] }) {
    return <LandingPage initialProjects={initialProjects} />;
}
