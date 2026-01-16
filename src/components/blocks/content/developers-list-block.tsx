'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import Image from "next/image";

interface DeveloperCardProps {
  name: string;
  logo: string;
  description: string;
  projectsCount: number;
}

interface DevelopersListBlockProps {
  headline?: string;
  subtext?: string;
  developers?: DeveloperCardProps[];
}

export function DevelopersListBlock({
  headline = "Top Developers",
  subtext = "Partnering with the visionaries shaping the skyline.",
  developers = [
      { name: "Emaar Properties", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Emaar_Properties_logo.svg/2560px-Emaar_Properties_logo.svg.png", description: "The master developer behind Downtown Dubai and Burj Khalifa.", projectsCount: 85 },
      { name: "Damac Properties", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Damac_Properties_Logo.jpg/1200px-Damac_Properties_Logo.jpg", description: "Luxury living concepts with international brand partnerships.", projectsCount: 62 },
      { name: "Sobha Realty", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sobha_Realty_Logo.jpg/1200px-Sobha_Realty_Logo.jpg", description: "Known for impeccable quality and 'Backward Integration' model.", projectsCount: 24 },
      { name: "Meraas", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Meraas_logo.svg/1200px-Meraas_logo.svg.png", description: "Creators of unique lifestyle destinations like City Walk and Bluewaters.", projectsCount: 31 },
  ]
}: DevelopersListBlockProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developers.map((dev, i) => (
                <div key={i} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center">
                    <div className="w-24 h-24 relative mb-6 grayscale group-hover:grayscale-0 transition-all duration-300">
                        <Image src={dev.logo} alt={dev.name} fill className="object-contain" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{dev.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{dev.description}</p>
                    
                    <div className="w-full pt-4 border-t flex items-center justify-between">
                        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded">
                            {dev.projectsCount} Projects
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
