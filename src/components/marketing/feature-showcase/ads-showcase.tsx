'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MousePointerClick, TrendingUp, Sparkles, Target, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function AdsShowcase() {
  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1800px]">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Left: Visual */}
          <div className="order-2 lg:order-1 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[100px] rounded-full" />
             
             <div className="relative space-y-6">
                {/* Search Result Mockup */}
                <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl max-w-lg"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-[10px] text-zinc-400">Ad</Badge>
                        <span className="text-xs text-zinc-500">https://luxury.emaar-beachfront.ai</span>
                    </div>
                    <h4 className="text-xl font-bold text-blue-400 mb-2">Luxury Waterfront Apartments | Emaar Beachfront Launch</h4>
                    <p className="text-sm text-zinc-400">Secure your dream home with 10% down payment. Private beach access, stunning views. Limited units remaining...</p>
                </motion.div>

                {/* Dashboard Snippet */}
                <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white text-black p-8 rounded-3xl shadow-2xl max-w-lg ml-auto relative z-10"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Campaign ROI</p>
                            <h3 className="text-4xl font-bold">12.4x</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold border-b pb-4">
                            <span className="text-zinc-500">Leads Captured</span>
                            <span>842</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold border-b pb-4">
                            <span className="text-zinc-500">Cost Per Lead</span>
                            <span className="text-blue-600">AED 42.50</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-zinc-500">Conversion Rate</span>
                            <span className="text-green-600">8.2%</span>
                        </div>
                    </div>
                </motion.div>
             </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
               <Target className="h-3 w-3" /> Growth Engine
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              Google Ads <br/>
              <span className="text-zinc-500 font-light">on Autopilot.</span>
            </h2>
            
            <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
              Don't waste money on broad keywords. Our AI builds high-intent search campaigns that target the right investors at the right time.
            </p>

            <div className="space-y-6">
               <AdFeature title="Dynamic Keyword Insertion" desc="Automatically targets terms like 'Apartments in Dubai Creek' based on real demand." />
               <AdFeature title="Automated Bidding" desc="Our engine optimizes your budget 24/7 for the lowest cost per lead." />
               <AdFeature title="Meta Audience Sync" desc="Create lookalike audiences from our database of verified buyers." />
            </div>

            <Button size="lg" className="h-16 px-10 rounded-full bg-white text-black font-bold text-lg mt-8 group">
              Start Scaling <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}

function AdFeature({ title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="h-3 w-3 text-blue-500" />
            </div>
            <div>
                <h4 className="font-bold text-white mb-1">{title}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
