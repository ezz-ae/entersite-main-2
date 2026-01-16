'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeroBlockProps {
  headline?: string;
  subtext?: string;
  ctaText?: string;
  backgroundImage?: string;
}

export function HeroBlock({ 
    headline = "Discover Unparalleled Luxury", 
    subtext = "Experience the finest collection of premium properties in Dubai's most prestigious locations.", 
    ctaText = "Explore Properties",
    backgroundImage = "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&q=80&w=2000"
}: HeroBlockProps) {
  return (
    <section className="relative h-[90vh] min-h-[700px] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
          {backgroundImage && (
             <motion.div 
               initial={{ scale: 1.1 }}
               animate={{ scale: 1 }}
               transition={{ duration: 10, ease: "easeOut" }}
               className="relative w-full h-full"
             >
               <Image 
                  src={backgroundImage} 
                  alt="Hero Background" 
                  fill 
                  className="object-cover"
                  priority
              />
             </motion.div>
          )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center h-full pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center space-y-8 max-w-5xl"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/80 text-sm backdrop-blur-md mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Now Selling Phase 2
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
              {headline}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-lg">
              {subtext}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                {ctaText}
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all hover:border-white">
                View Brochure
              </Button>
            </div>
        </motion.div>
      </div>
      
       {/* Scroll Indicator */}
       <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1.5, duration: 1 }}
         className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
       >
           <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
       </motion.div>
    </section>
  );
}
