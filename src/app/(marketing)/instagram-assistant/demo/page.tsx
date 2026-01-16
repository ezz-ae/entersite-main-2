'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function InstagramAssistantDemoPage() {
  return (
    <main className="min-h-screen bg-black text-white py-32">
      <div className="container mx-auto px-6 max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <MessageSquare className="h-3 w-3" /> Lead Qualification Demo
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">How It Qualifies Leads</h1>
          <p className="text-zinc-400 text-lg">
            A short example of how the assistant collects the right details before handing off to your team.
          </p>
        </div>

        <Card className="bg-zinc-900/60 border-white/10 rounded-3xl p-8 space-y-6">
          <div className="space-y-4 text-sm">
            <Bubble label="Buyer" text="Is this 2BR available this month? What’s the price range?" />
            <Bubble label="Assistant" text="Yes. It starts from AED 1.9M. Are you looking for ready or off-plan?" />
            <Bubble label="Buyer" text="Off-plan. Handover 2026 is OK." />
            <Bubble label="Assistant" text="Got it. Which area do you prefer, and what is your budget range?" />
            <Bubble label="Buyer" text="Dubai Marina, up to AED 2.5M." />
            <Bubble label="Assistant" text="Perfect. Do you want a flexible payment plan or a faster handover?" />
            <Bubble label="Buyer" text="Flexible plan." />
            <Bubble label="Assistant" text="Great. I can share 3 options and connect you with an agent now. What’s your name and WhatsApp?" />
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            'Collects timeline and budget',
            'Clarifies payment plan preference',
            'Gets phone before handoff',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="h-12 px-6 rounded-full bg-white text-black font-bold">
            <Link href="/dashboard/chat-agent">
              Set Up Your Assistant <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-12 px-6 rounded-full border-white/10 bg-white/5">
            <Link href="/instagram-assistant">Back to Overview</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function Bubble({ label, text }: { label: string; text: string }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</div>
      <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-zinc-200">{text}</div>
    </div>
  );
}
