'use client';

import React, { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layout, Search, Map, Building2, MousePointer2, CreditCard, BarChart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from 'next/link';

const templates = [
    {
        id: 'full-company',
        title: "Brokerage Firm",
        category: "Corporate",
        icon: Building2,
        // Wireframe: Classic Corp
        mockup: (
            <div className="flex flex-col h-full w-full bg-[#0A0A0A] border border-white/5">
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
                    <div className="w-20 h-3 bg-zinc-800 rounded-full" />
                    <div className="flex gap-2">
                        <div className="w-8 h-2 bg-zinc-800 rounded-full" />
                        <div className="w-8 h-2 bg-zinc-800 rounded-full" />
                    </div>
                </div>
                <div className="h-40 bg-zinc-900 border-b border-white/5 flex items-center px-6">
                     <div className="space-y-2">
                         <div className="w-32 h-4 bg-zinc-800 rounded-md" />
                         <div className="w-20 h-2 bg-zinc-800/50 rounded-md" />
                     </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="h-24 bg-zinc-900 rounded-md border border-white/5" />
                    <div className="h-24 bg-zinc-900 rounded-md border border-white/5" />
                </div>
            </div>
        )
    },
    {
        id: 'map-focused',
        title: "Listing Portal",
        category: "Search",
        icon: Map,
        // Wireframe: Map Sidebar
        mockup: (
            <div className="flex h-full w-full bg-[#0A0A0A] border border-white/5">
                <div className="w-1/3 border-r border-white/5 p-3 space-y-3">
                    <div className="h-6 w-full bg-zinc-800 rounded-md" />
                    <div className="h-16 w-full bg-zinc-900 rounded-md border border-white/5" />
                    <div className="h-16 w-full bg-zinc-900 rounded-md border border-white/5" />
                </div>
                <div className="flex-1 bg-zinc-900 relative overflow-hidden">
                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                     <div className="absolute top-8 left-8 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                     <div className="absolute bottom-12 right-12 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                     <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                </div>
            </div>
        )
    },
    {
        id: 'roadshow',
        title: "Launch Event",
        category: "Campaign",
        icon: Layout,
        // Wireframe: Hero Heavy
        mockup: (
            <div className="flex flex-col h-full w-full bg-[#0A0A0A] border border-white/5 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black opacity-50" />
                 <div className="absolute inset-0 flex items-center justify-center z-20 flex-col gap-3 text-center">
                     <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                         <div className="w-1 h-4 bg-orange-500 rounded-full" />
                     </div>
                     <div className="w-32 h-4 bg-white/10 rounded-md backdrop-blur-sm" />
                     <div className="w-24 h-8 bg-white text-black text-[8px] font-bold flex items-center justify-center rounded-md">
                         REGISTER NOW
                     </div>
                 </div>
            </div>
        )
    },
    {
        id: 'ads-launch',
        title: "Lead Funnel",
        category: "Conversion",
        icon: Search,
        // Wireframe: Form Focus
        mockup: (
            <div className="flex flex-col h-full w-full bg-[#0A0A0A] border border-white/5">
                 <div className="h-1/2 bg-zinc-900 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-zinc-800/50 border border-white/5" />
                 </div>
                 <div className="flex-1 p-4 flex flex-col justify-center gap-2">
                     <div className="w-full h-8 bg-zinc-900 border border-white/5 rounded-md" />
                     <div className="w-full h-8 bg-zinc-900 border border-white/5 rounded-md" />
                     <div className="w-full h-8 bg-blue-600 rounded-md" />
                 </div>
            </div>
        )
    },
];

export function TemplateShowcase({
  headline = "Start with a World-Class Foundation",
  subtext = "Choose from specialized architectures designed for every real estate use case."
}: { headline?: string, subtext?: string }) {
  
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <section ref={targetRef} className="py-32 bg-black text-white overflow-hidden border-t border-white/5 relative">
      
      <div className="container mx-auto px-6 max-w-[1800px] mb-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-2xl space-y-4">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white">
                    Architected <br/> <span className="text-zinc-500">for Scale.</span>
                </h2>
            </div>
            <Button variant="outline" className="rounded-full h-12 px-8 text-base border-white/10 text-white hover:bg-white hover:text-black transition-all bg-transparent">
                View All Patterns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
      
      <div className="relative w-full overflow-hidden">
          {/* Fade Edges */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
          
          <motion.div style={{ x }} className="flex gap-8 w-max px-8">
                {[...templates, ...templates, ...templates].map((template, i) => (
                    <Link key={`${template.id}-${i}`} href={`/builder?template=${template.id}`}>
                        <div className="group cursor-pointer w-[400px] flex-shrink-0">
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#050505] border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-2xl">
                                {template.mockup}
                                
                                {/* Hover Interaction */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                    <div className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-xs transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <MousePointer2 className="h-3 w-3" />
                                        Select Template
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 px-1">
                                <div className="flex items-center gap-3">
                                    <div className="text-zinc-500 group-hover:text-white transition-colors">
                                        <template.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-mono text-sm font-medium text-zinc-400 group-hover:text-white transition-colors uppercase tracking-wider">{template.title}</h3>
                                </div>
                                <div className="text-[10px] font-mono text-zinc-600 border border-zinc-800 px-2 py-1 rounded bg-zinc-900">
                                    {template.category}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
          </motion.div>
      </div>
    </section>
  );
}
