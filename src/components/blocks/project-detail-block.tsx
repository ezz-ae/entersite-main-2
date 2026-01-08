'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Download, ExternalLink, MapPin } from "lucide-react";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { SAFE_IMAGES, getRandomImage } from "@/lib/images";

interface ProjectDetailBlockProps {
  projectName?: string;
  developer?: string;
  description?: string;
  features?: string[];
  brochureUrl?: string;
  locationMapUrl?: string;
  imageUrl?: string;
  stats?: { label: string; value: string }[];
}

export function ProjectDetailBlock({
  projectName = "Elysian Residence",
  developer = "Mfour Development",
  description = "Elysian Residence redefines urban sophistication in Jumeirah Garden City. Designed for those who appreciate the finer things in life, these residences feature contemporary aesthetics, premium finishes, and a suite of lifestyle amenities that cater to your every need.",
  features = ["Rooftop Garden", "Infinity Pool", "State-of-the-art Gym", "24/7 Concierge", "Smart Home System", "Valet Parking"],
  brochureUrl = "#",
  locationMapUrl = "#",
  imageUrl,
  stats = [
      { label: "Starting Price", value: "AED 1.1M" },
      { label: "Handover", value: "Q4 2025" },
      { label: "Payment Plan", value: "60/40" },
      { label: "Units", value: "150+" }
  ]
}: ProjectDetailBlockProps) {
  
  const displayImage = imageUrl || getRandomImage('hero');

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-10">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                        {developer}
                    </Badge>
                    <div className="h-px flex-1 bg-border/50" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground leading-[1.05]">{projectName}</h2>
                <div className="prose prose-lg text-muted-foreground leading-relaxed">
                    <p>{description}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-muted/30 p-5 rounded-2xl border border-border/50">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
                 <Button size="lg" className="h-14 px-8 rounded-full shadow-lg hover:scale-105 transition-transform" onClick={() => window.open(brochureUrl, '_blank')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Brochure
                 </Button>
                 <Button variant="outline" size="lg" className="h-14 px-8 rounded-full" onClick={() => window.open(locationMapUrl, '_blank')}>
                    <MapPin className="mr-2 h-4 w-4" />
                    View Location
                 </Button>
            </div>
          </div>

          {/* Right Column: Visuals & Amenities */}
          <div className="space-y-8">
             <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
                 <ResponsiveImage 
                    src={displayImage} 
                    alt={projectName} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                 
                 <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                     <Button variant="secondary" className="backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-0 rounded-full h-10 px-6">
                         View Gallery <ExternalLink className="ml-2 h-3 w-3" />
                     </Button>
                 </div>
             </div>

             <div className="bg-muted/10 rounded-3xl p-8 border border-border/50">
                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                     <span className="w-1.5 h-6 bg-primary rounded-full" />
                     Premium Amenities
                 </h3>
                 <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                     {features.map((feature, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                             <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="h-3.5 w-3.5 text-primary" />
                             </div>
                             <span>{feature}</span>
                         </li>
                     ))}
                 </ul>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
