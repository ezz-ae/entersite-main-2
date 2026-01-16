'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Info } from 'lucide-react';

const AREAS = [
    { name: "Dubai Marina", x: 20, y: 70, price: "1.8M" },
    { name: "Downtown Dubai", x: 60, y: 40, price: "2.5M" },
    { name: "Palm Jumeirah", x: 15, y: 30, price: "5.2M" },
    { name: "Dubai Hills", x: 55, y: 60, price: "3.1M" },
    { name: "Business Bay", x: 62, y: 45, price: "1.6M" },
];

export function DubaiMapBlock({
    headline = "Explore Prime Locations",
    subtext = "Discover investment hotspots across the city.",
}: { headline?: string, subtext?: string }) {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">{headline}</h2>
                    <p className="text-muted-foreground">{subtext}</p>
                </div>

                <div className="relative w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden border shadow-2xl group">
                    {/* Abstract Map Background */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                        {/* Coastline simulation */}
                        <svg className="absolute left-0 top-0 h-full w-1/3 text-zinc-800 fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
                             <path d="M0 0 L40 0 C60 20 20 50 50 80 L0 100 Z" />
                        </svg>
                    </div>

                    {/* Interactive Pins */}
                    {AREAS.map((area, i) => (
                        <div 
                            key={i} 
                            className="absolute group/pin cursor-pointer"
                            style={{ left: `${area.x}%`, top: `${area.y}%` }}
                        >
                            <div className="relative">
                                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316] animate-pulse" />
                                <div className="absolute -inset-2 bg-orange-500/20 rounded-full animate-ping" />
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl opacity-0 group-hover/pin:opacity-100 transition-all duration-300 translate-y-2 group-hover/pin:translate-y-0 z-20 pointer-events-none">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-white font-bold text-sm">{area.name}</h4>
                                    <MapPin className="h-3 w-3 text-orange-500" />
                                </div>
                                <div className="text-xs text-zinc-400">Avg. Price: <span className="text-white">{area.price}</span></div>
                                <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> High Demand
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur p-4 rounded-xl border border-white/10 max-w-xs">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-white">Market Insight</p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Downtown and Palm Jumeirah are seeing the highest capital appreciation this quarter.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
