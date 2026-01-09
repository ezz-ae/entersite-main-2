'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  ArrowRight,
  MessageSquare,
  BarChart,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function InstagramAssistantPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
              <Bot className="h-3.5 w-3.5" />
              Instagram Assistant
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white italic uppercase">
              Never Miss <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 not-italic">
                A Lead Again.
              </span>
            </h1>

            <p className="text-zinc-500 text-2xl md:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
              Reply to Instagram DMs in seconds, qualify buyers, and hand off warm leads to your team.
              It can also be added to your website chat when you are ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="h-16 rounded-full bg-white text-black font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10"
              >
                <Link href="/dashboard/chat-agent">
                  Get Your Assistant <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-16 rounded-full border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10"
              >
                <Link href="/instagram-assistant/demo">See how it qualifies leads</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUESTIONS IT HANDLES */}
      <section className="py-20 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 max-w-6xl text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
              Lead-Ready Answers
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Answers the questions your inbox gets every day.</h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Set the answers once, then let the assistant reply instantly, collect details, and keep your team focused.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left text-sm text-zinc-400">
            {[
              { title: 'Availability & pricing', desc: 'Shares what is available and what to expect for price ranges.' },
              { title: 'Location & amenities', desc: 'Explains neighborhoods, nearby landmarks, and building features.' },
              { title: 'Handover & plans', desc: 'Clarifies timelines and typical payment plan steps.' },
              { title: 'Book a viewing', desc: 'Captures name, phone, and preferred time for your team.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT USES */}
      <section className="py-20 border-t border-white/5 bg-zinc-950">
        <div className="container mx-auto px-6 max-w-6xl text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
              Your Approved Answers
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built from your listings and FAQs.</h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Add your key details once and the assistant replies using the same wording your team trusts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-left text-sm text-zinc-400">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Listings</h3>
              <p>Pricing ranges, inventory status, and handover timelines.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Market Guidance</h3>
              <p>Payment plan basics, area highlights, and common buyer questions.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-3">
              <h3 className="text-lg font-bold text-white uppercase italic tracking-tight">Lead Handoff</h3>
              <p>Captures name, phone, budget, and timing before a handoff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-36 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white uppercase italic">
              Simple Setup. <br />
              <span className="text-zinc-600 not-italic">Clear Results.</span>
            </h2>
            <p className="text-zinc-500 text-xl font-light leading-relaxed mt-6">
              Configurable, trained on your FAQs, and ready to answer the same questions your team gets every day.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <HowItWorksStep
              step="01"
              title="Connect Instagram"
              desc="Link your Instagram account and choose your response tone."
            />
            <HowItWorksStep
              step="02"
              title="Add Your Listings"
              desc="Upload answers, prices, and key details so replies stay accurate."
            />
            <HowItWorksStep
              step="03"
              title="Go Live"
              desc="Auto-collect name, phone, and interest before a handoff."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-36">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <Card className="relative bg-zinc-900 border-white/10 rounded-[4rem] p-12 overflow-hidden shadow-2xl">
                <div className="space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                      <Zap className="h-8 w-8" />
                    </div>
                    <Badge className="bg-green-500 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest">
                      Fast Replies
                    </Badge>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-4xl font-bold italic text-white uppercase tracking-tighter">Instant Engagement</h3>
                    <p className="text-zinc-400 text-lg font-light">
                      Respond to every DM quickly with consistent, on-brand answers.
                    </p>
                    <div className="space-y-3 text-sm text-zinc-400">
                      {[
                        'Collects key details before a handoff',
                        'Routes hot leads to your team',
                        'Keeps conversations organized',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="space-y-12">
              <FeatureItem
                icon={MessageSquare}
                title="Natural Conversations"
                desc="Keep replies friendly and clear while staying on message."
              />
              <FeatureItem
                icon={BarChart}
                title="Listing-Aware Replies"
                desc="Answer pricing, handover, and availability using your approved details."
              />
              <FeatureItem
                icon={Zap}
                title="Smooth Handoff"
                desc="Hand the conversation to your team when a lead is ready."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HowItWorksStep({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className="border border-white/5 rounded-3xl p-8 bg-zinc-950/50">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-black text-indigo-400 italic">{step}</span>
        <ArrowRight className="h-5 w-5 text-zinc-700" />
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight italic uppercase mb-3">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
        <Icon className="h-6 w-6 text-zinc-400" />
      </div>
      <h4 className="text-xl font-bold text-white tracking-tight italic uppercase">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
    </div>
  );
}
