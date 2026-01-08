
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Image from "next/image";

interface ComingSoonHeroBlockProps {
  headline?: string;
  subtext?: string;
  backgroundImage?: string;
}

export function ComingSoonHeroBlock({
  headline = "Something Extraordinary is Coming",
  subtext = "We are crafting a new standard of luxury in the heart of Dubai. Stay tuned for the reveal.",
  backgroundImage = "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000"
}: ComingSoonHeroBlockProps) {
  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-black text-white">
        <div className="absolute inset-0 z-0 opacity-40">
             <Image 
                src={backgroundImage} 
                alt="Coming Soon" 
                fill 
                className="object-cover grayscale"
            />
        </div>
        
        <div className="container relative z-10 px-4 text-center">
            <div className="mb-8 flex justify-center">
                <div className="h-20 w-1 bg-gradient-to-b from-transparent to-white/50"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
                {headline}
            </h1>
            
            <div className="h-px w-24 bg-white/30 mx-auto mb-8"></div>
            
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 font-serif italic">
                "{subtext}"
            </p>

            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-black gap-2 transition-all duration-300 rounded-full px-8">
                <Bell className="h-4 w-4" />
                Notify Me When Live
            </Button>
        </div>
    </section>
  );
}
