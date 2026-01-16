
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Image from "next/image";

interface SplitContentBlockProps {
  headline?: string;
  subtext?: string;
  image?: string;
  imagePosition?: "left" | "right";
  ctaText?: string;
}

export function SplitContentBlock({
  headline = "Experience Waterfront Living Like Never Before",
  subtext = "Wake up to breathtaking views of the marina and enjoy a lifestyle that blends luxury with tranquility. Our exclusive waterfront residences offer the perfect escape from the city's hustle while keeping you connected to everything that matters.",
  image = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
  imagePosition = "right",
  ctaText = "Learn More"
}: SplitContentBlockProps) {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${imagePosition === 'left' ? 'lg:flex-row-reverse' : ''}`}>
            
            <div className="flex-1 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">{headline}</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
                <p className="text-lg text-muted-foreground leading-relaxed">{subtext}</p>
                
                <div className="flex gap-4 pt-4">
                    <Button size="lg" className="h-12 px-8">
                        {ctaText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 px-8 gap-2">
                        <PlayCircle className="h-4 w-4" />
                        Watch Video
                    </Button>
                </div>
            </div>

            <div className="flex-1 relative w-full aspect-square lg:aspect-[4/5] max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] transform rotate-3 scale-105 blur-lg opacity-50"></div>
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                    <Image 
                        src={image} 
                        alt="Feature" 
                        fill 
                        className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
