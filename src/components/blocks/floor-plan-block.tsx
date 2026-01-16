'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FloorPlan {
  id: string;
  name: string;
  type: string;
  area: string;
  bedrooms: number;
  image: string;
}

interface FloorPlanBlockProps {
  headline?: string;
  subtext?: string;
  floorPlans?: FloorPlan[];
}

export function FloorPlanBlock({
  headline = "Floor Plans & Layouts",
  subtext = "Choose from a variety of thoughtfully designed layouts to suit your lifestyle.",
  floorPlans = [
      { id: "fp1", name: "Type A - Studio", type: "Studio", area: "450 sq.ft", bedrooms: 0, image: "https://images.adsttc.com/media/images/5e5e/34c7/6ee6/7e3b/0900/017c/large_jpg/02_Floor_Plan.jpg?1583224001" },
      { id: "fp2", name: "Type B - 1 Bedroom", type: "1 Bedroom", area: "850 sq.ft", bedrooms: 1, image: "https://images.adsttc.com/media/images/5e5e/34c7/6ee6/7e3b/0900/017c/large_jpg/02_Floor_Plan.jpg?1583224001" },
      { id: "fp3", name: "Type C - 2 Bedroom", type: "2 Bedroom", area: "1,200 sq.ft", bedrooms: 2, image: "https://images.adsttc.com/media/images/5e5e/34c7/6ee6/7e3b/0900/017c/large_jpg/02_Floor_Plan.jpg?1583224001" },
  ]
}: FloorPlanBlockProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-muted-foreground">{subtext}</p>
        </div>

        <div className="max-w-5xl mx-auto">
            <Tabs defaultValue={floorPlans[0]?.id} className="w-full">
                <div className="flex justify-center mb-8">
                    <TabsList className="h-auto flex-wrap justify-center p-1 bg-muted/50">
                        {floorPlans.map((plan) => (
                            <TabsTrigger key={plan.id} value={plan.id} className="px-6 py-2">
                                {plan.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                
                {floorPlans.map((plan) => (
                    <TabsContent key={plan.id} value={plan.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                            <div className="relative w-full md:w-2/3 aspect-video bg-white rounded-lg border p-4">
                                <Image 
                                    src={plan.image} 
                                    alt={plan.name} 
                                    fill 
                                    className="object-contain"
                                />
                                <Button size="icon" variant="secondary" className="absolute top-4 right-4">
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <div className="w-full md:w-1/3 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-muted-foreground text-sm">Perfect for individuals or young couples.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between py-3 border-b">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="font-semibold">{plan.type}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b">
                                        <span className="text-muted-foreground">Total Area</span>
                                        <span className="font-semibold">{plan.area}</span>
                                    </div>
                                    <div className="flex justify-between py-3 border-b">
                                        <span className="text-muted-foreground">Bedrooms</span>
                                        <span className="font-semibold">{plan.bedrooms}</span>
                                    </div>
                                </div>

                                <Button className="w-full" size="lg">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Floor Plan
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
      </div>
    </section>
  );
}
