'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Timer, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface OfferBlockProps {
  headline?: string;
  subtext?: string;
  offerTag?: string;
  expiryDate?: string;
  features?: string[];
  backgroundImage?: string;
}

export function OfferBlock({
  headline = "Exclusive Pre-Launch Offer",
  subtext = "Book your unit today and avail a special waiver on DLD fees plus a flexible post-handover payment plan.",
  offerTag = "Limited Time Only",
  expiryDate = "Offer Ends: Oct 31, 2025",
  features = ["4% DLD Waiver", "3 Years Post-Handover Plan", "Free Property Management for 1 Year"],
  backgroundImage = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
}: OfferBlockProps) {
  return (
    <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
             <Image 
                src={backgroundImage} 
                alt="Offer Background" 
                fill 
                className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white space-y-8">
                
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium animate-in slide-in-from-top-4 duration-700">
                    <Timer className="h-4 w-4 text-yellow-400" />
                    <span>{expiryDate}</span>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                    {headline}
                </h2>
                
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                    {subtext}
                </p>

                <div className="flex flex-wrap justify-center gap-4 py-4">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <span className="font-medium">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-xl max-w-3xl mx-auto shadow-2xl text-left transform translate-y-8">
                     <div className="grid md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label className="text-black">Name</Label>
                            <Input placeholder="Your Name" className="bg-gray-50 border-gray-200 text-black" />
                        </div>
                        <div className="space-y-2">
                             <Label className="text-black">Phone Number</Label>
                             <Input placeholder="+971..." className="bg-gray-50 border-gray-200 text-black" />
                        </div>
                        <Button className="w-full h-10 text-base font-semibold">
                            Claim Offer
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </div>
                     <p className="text-[10px] text-muted-foreground mt-3 text-center">
                         *Terms and conditions apply. Offer valid on select units only.
                     </p>
                </div>

            </div>
        </div>
    </section>
  );
}
