'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function SeoShowcase() {
  return (
    <section className="py-32 bg-background border-t border-border/40">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-1 bg-gradient-to-tl from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative aspect-[4/3] bg-muted/20 rounded-2xl border border-border/50 flex items-center justify-center p-8 backdrop-blur-sm">
                
                {/* Mockup of the SEO Settings Dialog */}
                <Card className="w-full shadow-2xl border-border/50 overflow-hidden bg-background">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/30">
                        <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                            <Search className="h-4 w-4" /> Search Preview
                        </h4>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="p-4 bg-background rounded-lg border border-border/50 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1">
                                <span className="bg-[#f1f3f4] rounded-full w-3 h-3 inline-block" /> Google Search Preview
                            </h5>
                            <div className="font-sans pl-2">
                                <div className="text-sm text-[#202124] flex items-center gap-1 mb-1">
                                    <span className="text-muted-foreground text-xs">entresite.ai › dubai-hills</span>
                                </div>
                                <div className="text-lg text-[#1a0dab] font-medium truncate hover:underline cursor-pointer">
                                    Luxury Villas for Sale | Dubai Hills Estate
                                </div>
                                <div className="text-xs text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
                                    Discover exclusive 5-bedroom villas in Dubai Hills Estate. Gated community, golf course views, and flexible payment plans available.
                                </div>
                            </div>
                        </div>
                        
                        <div>
                             <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Suggested search keywords</div>
                             <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20">dubai luxury villas</Badge>
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20">golf course property</Badge>
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20">off-plan dubai</Badge>
                                <Badge variant="outline" className="text-muted-foreground border-dashed">+ 5 more</Badge>
                             </div>
                        </div>
                    </div>
                </Card>
            </div>
          </motion.div>

          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium border border-green-500/20">
              <TrendingUp className="h-3.5 w-3.5" />
              Get Found on Google
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1.05]">
                Show Up on Google, <br/>
                <span className="text-muted-foreground">Get More Calls.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We help your listings show up in search with clean titles, clear descriptions, and helpful keywords.
            </p>
            
            <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5"><CheckCircle className="h-4 w-4" /></div>
                    <span className="font-medium text-foreground/80">Search title & description</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5"><CheckCircle className="h-4 w-4" /></div>
                    <span className="font-medium text-foreground/80">Local keyword ideas</span>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5"><CheckCircle className="h-4 w-4" /></div>
                    <span className="font-medium text-foreground/80">Search-friendly page details</span>
                </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
