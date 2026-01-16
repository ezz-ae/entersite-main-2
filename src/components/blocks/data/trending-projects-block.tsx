'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Eye } from 'lucide-react';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getRandomImage } from '@/lib/images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function TrendingProjectsBlock({
  headline = "Trending Now",
  subtext = "The most viewed and inquired-about properties this week."
}: { headline?: string, subtext?: string }) {
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-12">
            <div>
                <div className="inline-flex items-center gap-2 text-orange-500 font-bold uppercase tracking-wider text-xs mb-2">
                    <Flame className="h-4 w-4" /> Hot Projects
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
                <p className="text-muted-foreground mt-2">{subtext}</p>
            </div>
        </div>

        <Carousel className="w-full">
            <CarouselContent className="-ml-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                        <div className="group cursor-pointer">
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                                <ResponsiveImage 
                                    src={getRandomImage('hero')} 
                                    alt="Project" 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-white/90 text-black backdrop-blur border-0 shadow-sm">
                                        {i === 0 ? '#1 Trending' : 'Popular'}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Eye className="h-3 w-3" /> 1.2k views
                                </div>
                            </div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Emaar Beachfront - Tower {i}</h3>
                            <p className="text-sm text-muted-foreground">Starting from AED 2.5M</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8">
                <CarouselPrevious className="static translate-y-0" />
                <CarouselNext className="static translate-y-0" />
            </div>
        </Carousel>

      </div>
    </section>
  );
}
