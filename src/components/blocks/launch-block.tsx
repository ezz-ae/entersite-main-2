'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface LaunchBlockProps {
  headline?: string;
  subtext?: string;
  projectName?: string;
  launchDate?: string;
  imageUrl?: string;
}

export function LaunchBlock({
  headline = "Grand Launch Event",
  subtext = "Be the first to witness the unveiling of Dubai's newest icon. Secure your invitation to the exclusive launch ceremony.",
  projectName = "The Royal Atlantis II",
  launchDate = "Nov 2025",
  imageUrl = "https://images.unsplash.com/photo-1514525253440-b393452e3720?auto=format&fit=crop&q=80&w=2000"
}: LaunchBlockProps) {
  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
        {/* Split Background */}
        <div className="absolute inset-0 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-black text-white p-12 lg:p-24 flex flex-col justify-center z-10">
                <div className="space-y-6 max-w-lg animate-in slide-in-from-left duration-700">
                     <div className="inline-block border border-white/30 px-3 py-1 rounded text-xs uppercase tracking-widest mb-4">
                         Coming Soon • {launchDate}
                     </div>
                     <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                         {headline} <br/>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                             {projectName}
                         </span>
                     </h2>
                     <p className="text-lg text-white/60 leading-relaxed">
                         {subtext}
                     </p>
                     <div className="pt-6">
                         <Button size="lg" className="bg-white text-black hover:bg-white/90">
                             Request Invitation
                             <ArrowRight className="ml-2 h-4 w-4" />
                         </Button>
                     </div>
                </div>
            </div>
            <div className="w-full md:w-1/2 relative h-full">
                <Image 
                    src={imageUrl} 
                    alt="Launch Visual" 
                    fill 
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-black md:via-transparent" />
            </div>
        </div>
    </section>
  );
}
