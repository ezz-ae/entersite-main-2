'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Search, Bot, Zap, Cpu, Target, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function SystemInsights() {
  return (
    <section className="py-40 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      
      <div className="container mx-auto px-6 max-w-[1800px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="space-y-12">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                        <Cpu className="h-3.5 w-3.5" />
                        Growth Insights
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">Built for <br/><span className="text-zinc-600 italic uppercase">Real Estate Teams.</span></h2>
                    <p className="text-zinc-500 text-2xl font-light leading-relaxed max-w-xl">
                        Entrestate keeps listings, leads, and follow-ups in one simple workspace so your team stays organized without extra tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InsightItem 
                        icon={Search} 
                        title="Get Found on Google" 
                        desc="We format each listing so it looks great in search and is easy to share with buyers."
                    />
                    <InsightItem 
                        icon={Target} 
                        title="Ad Launch" 
                        desc="Pick a budget and area, then launch ads with guided setup and clear previews."
                    />
                    <InsightItem 
                        icon={Bot} 
                        title="Lead Assistant" 
                        desc="Answer common questions, share details, and book viewings without manual typing."
                    />
                    <InsightItem 
                        icon={LineChart} 
                        title="Market Snapshots" 
                        desc="See pricing, handover timelines, and availability in one clean view."
                    />
                </div>
            </div>

            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-600 rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
                <Card className="relative bg-zinc-900/50 border border-white/10 backdrop-blur-3xl rounded-[3rem] overflow-hidden p-12 shadow-2xl">
                    <div className="space-y-10">
                        <div className="flex items-center justify-between border-b border-white/5 pb-8">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Platform Performance</p>
                                <h3 className="text-3xl font-black text-white">Growth Overview</h3>
                            </div>
                            <div className="h-16 w-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                                <Zap className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <StatBar label="Search Visibility" value={72} valueLabel="Improving" color="blue" />
                            <StatBar label="Ad Lead Flow" value={68} valueLabel="Growing" color="orange" />
                            <StatBar label="Lead Responses" value={74} valueLabel="On Track" color="green" />
                            <StatBar label="Listing Updates" value={80} valueLabel="Up to Date" color="purple" />
                        </div>

                        <div className="pt-10 grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Build Time</p>
                                <p className="text-3xl font-black text-white">Minutes, not days</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Listing Updates</p>
                                <p className="text-3xl font-black text-white">Keeps up with changes</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

        </div>
      </div>
    </section>
  );
}

function InsightItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all">
                <Icon className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <h4 className="text-xl font-bold text-white">{title}</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
        </div>
    )
}

function StatBar({ label, value, valueLabel, color }: { label: string, value: number, valueLabel: string, color: string }) {
    const colors: any = {
        blue: "bg-blue-600",
        orange: "bg-orange-600",
        green: "bg-green-600",
        purple: "bg-purple-600"
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span>{label}</span>
                <span className="text-white font-mono">{valueLabel}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn("h-full", colors[color])}
                />
            </div>
        </div>
    )
}
