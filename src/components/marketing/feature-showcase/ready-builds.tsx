'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, FileText, Zap, ShieldCheck, UploadCloud, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const BLUEPRINTS = [
    {
        id: 'brochure-to-web',
        title: "Brochure Architect",
        type: "Conversion Engine",
        focus: "PDF to Landing Page",
        color: "blue",
        isNew: true
    },
    {
        id: 'off-plan-brokerage',
        title: "Lead Magnet",
        type: "Multi-Listing",
        focus: "High Lead Volume",
        color: "orange"
    },
    {
        id: 'investor-roi-tracker',
        title: "Yield Expert",
        type: "ROI Dashboard",
        focus: "Investor Conversion",
        color: "purple"
    }
];

export function ReadyBuilds() {
  return (
    <section className="py-40 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-6 max-w-[1800px] relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 border-b border-white/5 pb-16">
            <div className="max-w-4xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" /> Industry First
                </div>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none">
                    Brochure to <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Lead Gen in Seconds.</span>
                </h2>
                <p className="text-2xl text-zinc-400 max-w-2xl font-light">
                    Stop manually building sites. Upload your project PDF brochure, and Entrestate will architect a high-converting landing page automatically.
                </p>
            </div>
            <Link href="/builder">
                <Button className="h-16 px-10 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-all gap-3 shadow-xl">
                    Try Brochure Upload <UploadCloud className="h-5 w-5" />
                </Button>
            </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
            {BLUEPRINTS.map((bp, i) => (
                <motion.div
                    key={bp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                >
                    <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-zinc-950 border border-white/10 group-hover:border-blue-500/30 transition-all duration-700 p-10 flex flex-col justify-between">
                        {/* Decorative Background Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                             <Layout className="w-64 h-64 -rotate-12" />
                        </div>

                        <div className="relative z-10 flex justify-between items-start">
                            <Badge className="bg-white/5 border-white/10 text-zinc-400 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {bp.type}
                            </Badge>
                            {bp.isNew && (
                                <div className="px-3 py-1 rounded-full bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white">
                                    AI Engine
                                </div>
                            )}
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <p className={cn(
                                    "text-xs font-bold uppercase tracking-[0.2em]",
                                    bp.color === 'blue' && "text-blue-500",
                                    bp.color === 'orange' && "text-orange-500",
                                    bp.color === 'purple' && "text-purple-500",
                                )}>{bp.focus}</p>
                                <h3 className="text-5xl font-bold text-white tracking-tighter leading-none">{bp.title}</h3>
                            </div>
                            
                            <div className="pt-8 border-t border-white/5">
                                <Link href={`/builder?template=${bp.id}`}>
                                    <Button className="w-full h-16 rounded-2xl bg-white text-black font-bold group-hover:bg-blue-600 group-hover:text-white transition-all text-lg">
                                        Launch Build <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-32">
            <FeatureCard 
                icon={FileText} 
                title="Brochure Intelligence" 
                desc="Extract floor plans, amenities, and pricing directly from your PDF documents." 
            />
            <FeatureCard 
                icon={Zap} 
                title="Instant Architect" 
                desc="Generate a fully functional lead-gen site in under 10 seconds from any source." 
            />
            <FeatureCard 
                icon={ShieldCheck} 
                title="Verified Data" 
                desc="Cross-referenced with our 3,750+ project database for market accuracy." 
            />
            <FeatureCard 
                icon={UploadCloud} 
                title="Bulk Import" 
                desc="Sync your entire inventory by simply dragging folders of brochures into the OS." 
            />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
    return (
        <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white">{title}</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}
