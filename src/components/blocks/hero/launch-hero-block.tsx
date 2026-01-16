
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { ResponsiveImage } from "@/components/ui/responsive-image"; // Use ResponsiveImage
import { SAFE_IMAGES } from "@/lib/images"; // Import safe images
import { motion } from "framer-motion";

interface LaunchHeroBlockProps {
  headline?: string;
  subtext?: string;
  launchDate?: string;
  backgroundImage?: string;
}

export function LaunchHeroBlock({
  headline = "The Future of Living Arrives Soon",
  subtext = "Be the first to know about this upcoming waterfront masterpiece. Exclusive pre-launch pricing for early registrants.",
  launchDate = "November 15, 2025",
  backgroundImage = SAFE_IMAGES.hero[0] // Use safe image
}: LaunchHeroBlockProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
             <motion.div 
               initial={{ scale: 1.2 }}
               animate={{ scale: 1 }}
               transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
               className="relative w-full h-full"
             >
                <ResponsiveImage 
                    src={backgroundImage} 
                    alt="Launch Background" 
                    fill 
                    className="object-cover opacity-60"
                    priority
                />
             </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80" />
        </div>

        <div className="container relative z-10 px-4 text-center text-white space-y-10 max-w-5xl">
            {/* Countdown Badge */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full mx-auto"
            >
                <div className="flex items-center gap-2 text-yellow-400 font-mono font-bold tracking-widest text-lg">
                    <Clock className="h-5 w-5" />
                    <span>04</span>:<span>12</span>:<span>45</span>:<span>30</span>
                </div>
                <div className="w-px h-4 bg-white/20" />
                <span className="text-sm font-medium text-white/70 uppercase tracking-widest">Until Reveal</span>
            </motion.div>

            <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
                {headline}
            </motion.h1>
            
            <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-3xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed"
            >
                {subtext}
            </motion.p>

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-xl mx-auto"
            >
                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                    <Input 
                        placeholder="Enter your email address" 
                        className="h-14 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 text-lg px-6"
                    />
                    <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-white/90 text-lg font-semibold rounded-xl transition-transform hover:scale-105">
                        Get Early Access
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
                <p className="text-sm text-white/40 mt-4 font-medium tracking-wide uppercase">
                    Join 2,500+ investors on the waitlist
                </p>
            </motion.div>
        </div>
    </section>
  );
}
