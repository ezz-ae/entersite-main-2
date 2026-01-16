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
            <section className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
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
                        
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white italic uppercase">
                            Google Ads <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 not-italic">Made Simple.</span>
                        </h1>
                        
                        <p className="text-zinc-500 text-base sm:text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                            Build a plan in minutes. We write the ads and launch them for you. No Google setup needed.
                        </p>
                        <Button asChild className="h-12 sm:h-14 md:h-16 w-full sm:w-auto rounded-full bg-white text-black font-black text-base sm:text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10">
                            <Link href="/dashboard/google-ads">Build Plan <ChevronRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* MANAGED LAUNCH */}
            <section className="py-16 md:py-20 bg-zinc-950 border-t border-white/5">
                <div className="container mx-auto px-6 max-w-6xl text-center space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            Managed Launch
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">No Google setup? We run it for you.</h2>
                        <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                            We launch the campaigns for you with a managed ads team and keep it simple.
                            If you already use Google Ads, we can connect it and keep billing your way.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Option A</p>
                            <h3 className="text-xl font-bold text-white">Use your Google Ads</h3>
                            <p>Connect your current setup and keep billing as-is.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Option B</p>
                            <h3 className="text-xl font-bold text-white">We run it for you</h3>
                            <p>No setup or card? We launch it and share access when ready.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Visibility</p>
                            <h3 className="text-xl font-bold text-white">Clear access & reporting</h3>
                            <p>See every campaign, lead, and spend update in plain language.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT YOU NEED */}
            <section className="py-16 md:py-20 border-t border-white/5 bg-black">
                <div className="container mx-auto px-6 max-w-5xl text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                        What We Need
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Before we launch</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-zinc-400">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                            Your goal and target area (example: leads for Dubai Marina)
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                            Daily budget and campaign length in AED
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
                            The landing page you want to send traffic to
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart PLAN PREVIEW */}
            <section className="py-20 md:py-24 border-t border-white/5 bg-zinc-950">
                <div className="container mx-auto px-6 max-w-6xl text-center space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            Plan Preview
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">See the plan before you launch.</h2>
                        <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                            Keywords, ad copy, and budget expectations in clear language.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 text-left text-sm text-zinc-400">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Keywords</p>
                            <p>buy apartment dubai marina</p>
                            <p>off plan projects dubai</p>
                            <p>luxury villas palm jumeirah</p>
                            <p>invest in dubai property</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Ad Copy</p>
                            <p className="text-xs text-zinc-500">Smart Writer prepares headlines and descriptions for you.</p>
                            <p className="text-white font-semibold">Dubai Marina Homes From AED 1.9M</p>
                            <p>Secure a viewing today. Flexible payment plans.</p>
                            <p className="text-white font-semibold">Off-Plan Launches Now Open</p>
                            <p>Verified listings with clear handover timelines.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Expectations</p>
                            <p>Estimated clicks and lead range based on budget.</p>
                            <p>Projected cost per lead in AED ranges.</p>
                            <p>Adjustments suggested weekly by the Smart plan.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT HAPPENS NEXT */}
            <section className="py-16 md:py-20 border-t border-white/5 bg-black">
                <div className="container mx-auto px-6 max-w-6xl text-center space-y-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            What Happens Next
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">We launch it for you.</h2>
                        <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                            Share your goal and budget, review the Smart plan, and we take care of the launch.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 text-left text-sm text-zinc-400">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Step 1</p>
                            <h3 className="text-xl font-bold text-white">Share your goal</h3>
                            <p>Tell us the area, budget, and landing page.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Step 2</p>
                            <h3 className="text-xl font-bold text-white">Review the plan</h3>
                            <p>Smart Writer prepares the ads and shows expectations.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Step 3</p>
                            <h3 className="text-xl font-bold text-white">Go live</h3>
                            <p>We launch and share updates in plain language.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild className="h-12 w-full sm:w-auto rounded-full bg-white text-black font-black text-base hover:scale-105 transition-all shadow-2xl shadow-white/10">
                            <Link href="/dashboard/google-ads">Start Google Ads <ChevronRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                        <Button asChild variant="outline" className="h-12 w-full sm:w-auto rounded-full border-white/10 bg-white/5 text-white font-bold">
                            <Link href="/support">Talk to support</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 2. VALUE PROPOSITION */}
            <section className="py-24 md:py-32 bg-zinc-950 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white uppercase italic">Clear Results, <br/><span className="text-zinc-600 not-italic">Simple Actions.</span></h2>
                            <p className="text-zinc-500 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl">
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
