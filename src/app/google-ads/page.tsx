'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  MousePointerClick, 
  ShieldCheck, 
  TrendingUp,
  Cpu,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function GoogleAdsPublicPage() {
    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            
            {/* 1. HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            <Sparkles className="h-3.5 w-3.5" />
                            Your Ads, Amplified
                        </div>
                        
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white italic uppercase">
                            Google Ads <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 not-italic">Made Simple.</span>
                        </h1>
                        
                        <p className="text-zinc-500 text-2xl md:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
                            Start your ads setup and get clear campaign summaries with guided next steps, while we handle the account setup for you.
                        </p>
                        <Button asChild className="h-16 rounded-full bg-white text-black font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10">
                            <Link href="/dashboard/google-ads">Start Setup <ChevronRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* MANAGED SETUP */}
            <section className="py-20 bg-zinc-950 border-t border-white/5">
                <div className="container mx-auto px-6 max-w-6xl text-center space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            Managed Setup
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">No Google Ads account? We will set it up.</h2>
                        <p className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                            We can create a client account for you under our main ads account and handle the setup.
                            You still get access, clean reporting, and full visibility into performance.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Option A</p>
                            <h3 className="text-xl font-bold text-white">Use your account</h3>
                            <p>Connect your existing Google Ads account and keep billing as-is.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Option B</p>
                            <h3 className="text-xl font-bold text-white">We create your client account</h3>
                            <p>No account or card? We can set it up and share access when ready.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Clarity</p>
                            <h3 className="text-xl font-bold text-white">Clear access & reporting</h3>
                            <p>See every campaign, lead, and spend update in plain language.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT YOU NEED */}
            <section className="py-20 border-t border-white/5 bg-black">
                <div className="container mx-auto px-6 max-w-5xl text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                        What You Need
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Before you connect</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                            Google Ads ID (10 digits) - we can provide this if we set it up
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                            Billing details if you use your own account
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                            Access to the ad account (or we create one for you)
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. VALUE PROPOSITION */}
            <section className="py-40 bg-zinc-950 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white uppercase italic">Clear Results, <br/><span className="text-zinc-600 not-italic">Simple Actions.</span></h2>
                            <p className="text-zinc-500 text-xl font-light leading-relaxed max-w-xl">
                                See what is working, what needs attention, and what to do next without digging through reports.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <FeatureItem 
                                    icon={Target}
                                    title="Campaign Overview"
                                    desc="See every campaign at a glance, with clear status and health indicators."
                                />
                                <FeatureItem 
                                    icon={MousePointerClick}
                                    title="Search Performance"
                                    desc="See which search terms bring the most inquiries."
                                />
                                <FeatureItem 
                                    icon={TrendingUp}
                                    title="Performance Trends"
                                    desc="Track changes over time and adjust budgets with confidence."
                                />
                                <FeatureItem 
                                    icon={ShieldCheck}
                                    title="Smart Suggestions"
                                    desc="Get clear recommendations to improve results and reduce wasted spend."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-1 bg-blue-600 rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
                            <Card className="relative bg-zinc-900 border-white/10 rounded-[4rem] p-12 overflow-hidden shadow-2xl">
                                <div className="space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                                            <Cpu className="h-8 w-8" />
                                        </div>
                                        <Badge className="bg-green-500 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest">Optimizing</Badge>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Ad Performance</p>
                                            <div className="h-40 flex items-end gap-1.5">
                                                {[30, 45, 60, 50, 80, 90, 70, 85, 100, 110, 95, 120].map((h, i) => (
                                                    <motion.div 
                                                        key={i} 
                                                        className="flex-1 bg-blue-600/20 rounded-t-lg"
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${h}%` }}
                                                        transition={{ delay: i * 0.05, duration: 1 }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                            <div>
                                                <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Click Activity</p>
                                                <p className="text-3xl font-black text-white italic">Steady</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Lead Quality</p>
                                                <p className="text-3xl font-black text-blue-500 italic">Improving</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}

function FeatureItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-all">
                <Icon className="h-6 w-6 text-zinc-400" />
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight italic uppercase">{title}</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
        </div>
    )
}
