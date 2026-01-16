'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, SlidersHorizontal, BedDouble, Bath, Building } from "lucide-react";
import Image from "next/image";

interface MapBlockProps {
  headline?: string;
  subtext?: string;
}

export function MapBlock({
  headline = "Explore Properties on the Map",
  subtext = "Use this interactive map to find properties in your desired location."
}: MapBlockProps) {
  
  const pins = [
      { x: '25%', y: '30%', name: 'Elysian Residence' },
      { x: '50%', y: '50%', name: 'Skygate Tower' },
      { x: '70%', y: '40%', name: 'Damac Riverside' },
      { x: '35%', y: '65%', name: 'Soulever Towers' },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="w-full h-[600px] bg-muted rounded-2xl overflow-hidden border relative flex flex-col">
            {/* Map Controls Header */}
            <div className="p-4 bg-background/80 backdrop-blur-sm border-b z-10 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by location, project, or developer..." className="pl-10 h-11" />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 gap-2">
                        <SlidersHorizontal className="h-4 w-4" /> Filters
                    </Button>
                    <Button variant="outline" className="h-11 gap-2">
                        <BedDouble className="h-4 w-4" /> Beds
                    </Button>
                    <Button variant="outline" className="h-11 gap-2">
                        <Building className="h-4 w-4" /> Type
                    </Button>
                </div>
            </div>

            {/* Map Placeholder with Image */}
            <div className="flex-1 relative group">
                <Image 
                    src="https://images.unsplash.com/photo-1588412206496-2a0a4c575233?auto=format&fit=crop&q=80&w=2000"
                    alt="Map background"
                    fill
                    className="object-cover grayscale opacity-50"
                />

                {/* Simulated Pins */}
                {pins.map((pin, i) => (
                    <div 
                        key={i} 
                        className="absolute w-8 h-8 -ml-4 -mt-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-125 transition-transform group/pin"
                        style={{ top: pin.y, left: pin.x }}
                    >
                        <MapPin className="h-4 w-4" />
                        <div className="absolute bottom-full mb-2 w-max bg-card text-card-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
                            {pin.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
