'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BannerCtaBlockProps {
  headline?: string;
  subtext?: string;
  ctaText?: string;
  backgroundImage?: string;
}

export function BannerCtaBlock({
  headline = "Limited Availability: Only 5 Units Left",
  subtext = "Don't miss out on this exclusive opportunity. Secure your unit today with a 5% down payment.",
  ctaText = "Reserve Now",
  backgroundImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
}: BannerCtaBlockProps) {
  return (
    <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-multiply">
             {/* Using a pattern or image here */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="container relative z-10 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    {headline}
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    {subtext}
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-semibold shadow-2xl">
                        {ctaText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    </section>
  );
}
