'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ProjectData } from "@/lib/types";

interface ListingGridMapBlockProps {
  headline?: string;
  subtext?: string;
  projects?: ProjectData[];
}

export function ListingGridMapBlock({ 
    headline = "Explore Projects on Map", 
    subtext = "Visualize the location of this premium developments.",
    projects = []
}: ListingGridMapBlockProps) {
  
  // Use a slice of projects for display to avoid overwhelming the UI
  const displayProjects = projects.slice(0, 5);

  const pins = displayProjects.map((p, i) => ({
    x: `${20 + (i * 15)}%`,
    y: `${30 + (i % 2 === 0 ? i * 5 : -(i * 5))}%`,
    name: p.name
  }));

  return (
    <section className="h-[800px] flex flex-col md:flex-row bg-background border-t">
        {/* Map Side (Left) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-muted relative group overflow-hidden">
             {/* Simulating a Map View */}
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/USA_location_map.svg')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
             
             {/* Simulated Map Pins */}
             {pins.map((pin, i) => (
                 <div 
                    key={i}
                    className="absolute w-8 h-8 -ml-4 -mt-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform z-10"
                    style={{ 
                        top: pin.y, 
                        left: pin.x 
                    }}
                 >
                     <MapPin className="h-4 w-4" />
                 </div>
             ))}

             <div className="absolute bottom-6 left-6 z-20 bg-background/90 backdrop-blur p-4 rounded-lg shadow-lg border max-w-xs">
                 <h4 className="font-semibold mb-1">Interactive Map</h4>
                 <p className="text-xs text-muted-foreground">Click on pins to view project details or browse the list.</p>
             </div>
        </div>

        {/* Listings Side (Right) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-background p-6 lg:p-10 border-l">
             <div className="mb-8">
                 <h2 className="text-2xl font-bold mb-2">{headline}</h2>
                 <p className="text-muted-foreground">{subtext}</p>
             </div>

             <div className="space-y-6">
                 {displayProjects.map((project) => (
                     <Card key={project.id} className="flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                         <div className="relative w-full sm:w-40 aspect-video sm:aspect-auto">
                             <Image 
                                src={project.images?.[0] || 'https://picsum.photos/400/300'} 
                                alt={project.name}
                                fill
                                className="object-cover"
                             />
                         </div>
                         <div className="flex-1 p-4 flex flex-col justify-between">
                             <div>
                                 <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold group-hover:text-primary transition-colors">{project.name}</h3>
                                    <Badge variant="secondary" className="text-[10px] h-5">{project.availability}</Badge>
                                 </div>
                                 <p className="text-xs text-muted-foreground mb-2">{project.location?.area}</p>
                                 <p className="text-sm font-medium text-primary">{project.price?.label}</p>
                             </div>
                             <div className="flex justify-end mt-2">
                                 <Button variant="ghost" size="sm" className="h-8 text-xs">
                                     View Details <ArrowRight className="ml-1 h-3 w-3" />
                                 </Button>
                             </div>
                         </div>
                     </Card>
                 ))}
             </div>
        </div>
    </section>
  );
}
