'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface FeaturesBlockProps {
  headline?: string;
  subtext?: string;
  features?: string[];
}

export function FeaturesBlock({
    headline = "Why Choose This Project?",
    subtext = "Designed for a lifestyle of convenience, luxury, and holistic well-being.",
    features = [
        "Prime Location on Sheikh Zayed Road",
        "Direct Access to Metro Station",
        "Infinity Pool with Skyline Views",
        "State-of-the-art Fitness Center",
        "Dedicated Children's Play Areas",
        "24/7 Concierge & Security",
        "Smart Home Automation Included",
        "Retail & Dining Outlets on Ground Floor",
        "Pet-Friendly Community",
        "High ROI Potential",
        "Flexible Payment Plans",
        "Award-Winning Developer"
    ]
}: FeaturesBlockProps) {
  return (
    <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                 <Badge variant="outline" className="mb-2">Key Highlights</Badge>
                 <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
                 <p className="text-lg text-muted-foreground">{subtext}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-5xl mx-auto">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                        <div className="mt-1 bg-primary/10 p-1.5 rounded-full flex-shrink-0">
                             <Check className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-medium">{feature}</span>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-12">
                 <Button variant="secondary" size="lg">Download Features List</Button>
            </div>
        </div>
    </section>
  );
}
