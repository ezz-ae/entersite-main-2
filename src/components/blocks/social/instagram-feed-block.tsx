'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getRandomImage } from '@/lib/images';

export function InstagramFeedBlock({
  headline = "Follow Us on Instagram",
  subtext = "See this latest property tours and market updates @RealEstateDubai",
  handle = "@RealEstateDubai"
}: { headline?: string, subtext?: string, handle?: string }) {
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white p-2 rounded-xl">
                        <Instagram className="h-6 w-6" />
                    </div>
                    {headline}
                </h2>
                <p className="text-muted-foreground">{subtext}</p>
            </div>
            <Button variant="outline" className="rounded-full">Follow {handle}</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group relative aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer">
                    <ResponsiveImage 
                        src={getRandomImage('interiors')} 
                        alt={`Instagram Post ${i}`} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 fill-white" /> {Math.floor(Math.random() * 500)}
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 fill-white" /> {Math.floor(Math.random() * 50)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
