
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, Globe, Building } from "lucide-react";
import Image from "next/image";

interface CityGuideBlockProps {
  city?: string;
  headline?: string;
  description?: string;
  stats?: { label: string; value: string }[];
  image?: string;
}

export function CityGuideBlock({
  city = "Dubai",
  headline = "Why Invest in Dubai?",
  description = "Dubai offers modern infrastructure, strong rental demand, and a global lifestyle. Use this section to highlight what makes your area attractive to buyers.",
  stats = [
      { label: "Residency Options", value: "Available" },
      { label: "Rental Demand", value: "Strong" },
      { label: "Infrastructure", value: "Modern" },
      { label: "Lifestyle", value: "Global" }
  ],
  image = "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&q=80&w=1200"
}: CityGuideBlockProps) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl group">
                <Image 
                    src={image} 
                    alt={city} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-white text-3xl font-bold mb-2">{city}</h3>
                    <p className="text-white/80">The City of the Future</p>
                </div>
            </div>

            <div className="space-y-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Globe className="h-4 w-4" />
                        Global Investment Hub
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight mb-6">{headline}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-muted/30 p-5 rounded-xl border hover:border-primary/50 transition-colors">
                            <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                        Investor Benefits
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                            Residency options may be available for eligible investors.
                        </li>
                        <li className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                            Clear purchase processes and buyer protections.
                        </li>
                        <li className="flex items-start gap-3 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                            World-class infrastructure and connectivity.
                        </li>
                    </ul>
                </div>

                <Button size="lg" className="h-12 px-8">
                    Download Investment Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
    </section>
  );
}
