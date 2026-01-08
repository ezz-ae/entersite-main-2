'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Layout, 
  Palette, 
  Smartphone, 
  Search, 
  Rocket,
  MousePointerClick,
  BarChart3
} from 'lucide-react';

export function BuilderShowcase() {
  return (
    <section className="py-24 bg-muted/10 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">A Professional Studio, <br/>Simplified.</h2>
          <p className="text-lg text-muted-foreground">
            Experience a builder that feels like a creative tool, not a form. Drag, drop, and design with unprecedented freedom.
          </p>
        </div>

        {/* The "Screenshot" UI Mockup */}
        <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />
            <div className="relative bg-background border border-border/50 rounded-xl shadow-2xl overflow-hidden aspect-[16/9] group">
                {/* Fake Window Controls */}
                <div className="h-10 border-b bg-muted/30 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    <div className="ml-4 flex-1 flex justify-center">
                        <div className="bg-muted/50 h-6 w-64 rounded-md flex items-center justify-center text-[10px] text-muted-foreground">
                            entresite.ai/builder
                        </div>
                    </div>
                </div>

                {/* UI Composition */}
                <div className="flex h-full">
                    {/* Left Sidebar */}
                    <div className="w-16 border-r bg-muted/10 flex flex-col items-center py-4 gap-4">
                        {[Layout, Palette, Search, BarChart3].map((Icon, i) => (
                            <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                                <Icon className="h-5 w-5" />
                            </div>
                        ))}
                    </div>
                    
                    {/* Center Canvas */}
                    <div className="flex-1 bg-muted/5 p-8 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#fff_1px,transparent_1px)]" />
                        
                        {/* The "Site" being built */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-[80%] h-[90%] bg-background rounded-lg shadow-lg border flex flex-col overflow-hidden relative z-10"
                        >
                            {/* Hero Block Mock */}
                            <div className="h-[60%] bg-zinc-900 relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20" />
                                <div className="text-center space-y-4 relative z-10">
                                    <div className="h-8 w-64 bg-white/10 rounded mx-auto animate-pulse" />
                                    <div className="h-4 w-96 bg-white/5 rounded mx-auto" />
                                    <div className="h-10 w-32 bg-white rounded-full mx-auto mt-4 shadow-lg" />
                                </div>
                            </div>
                            {/* Grid Block Mock */}
                            <div className="flex-1 p-4 grid grid-cols-3 gap-4 bg-background">
                                {[1,2,3].map(i => (
                                    <div key={i} className="bg-muted/30 rounded-lg border h-full relative overflow-hidden group/card">
                                        <div className="h-[60%] bg-muted/50" />
                                        <div className="p-2 space-y-2">
                                            <div className="h-3 w-3/4 bg-muted-foreground/20 rounded" />
                                            <div className="h-2 w-1/2 bg-muted-foreground/10 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floating Cursor */}
                        <motion.div 
                            className="absolute top-1/2 left-1/2 pointer-events-none z-20"
                            animate={{ x: [0, 100, 100, 0], y: [0, 50, 0, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <MousePointerClick className="h-6 w-6 text-primary fill-primary/20" />
                            <div className="ml-3 mt-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                Sarah is editing...
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-64 border-l bg-background p-4 space-y-6">
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-muted rounded" />
                            <div className="h-8 w-full bg-muted/30 rounded border" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-muted rounded" />
                            <div className="h-24 w-full bg-muted/30 rounded border" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div className="h-8 w-full bg-primary/10 rounded border border-primary/20" />
                             <div className="h-8 w-full bg-muted/30 rounded border" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
