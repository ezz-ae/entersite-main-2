
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, BedDouble, Bath, Ruler, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface FeaturedListingBlockProps {
  headline?: string;
  subtext?: string;
  listingImage?: string;
  listingTitle?: string;
  price?: string;
  location?: string;
  beds?: number;
  baths?: number;
  area?: string;
  features?: string[];
}

export function FeaturedListingBlock({
  headline = "Property of the Month",
  subtext = "Our top pick for exceptional value, design, and location.",
  listingImage = "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
  listingTitle = "Luxury Penthouse with Sea Views",
  price = "AED 15,500,000",
  location = "Palm Jumeirah, Dubai",
  beds = 4,
  baths = 5,
  area = "5,200 sq.ft",
  features = ["Private Pool", "Full Sea View", "Maids Room", "Smart Home System", "3 Parking Spaces"]
}: FeaturedListingBlockProps) {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Editor's Choice</Badge>
            <h2 className="text-3xl font-bold">{headline}</h2>
            <p className="text-muted-foreground mt-2">{subtext}</p>
        </div>

        <div className="max-w-6xl mx-auto bg-card rounded-3xl overflow-hidden shadow-2xl border flex flex-col lg:flex-row">
            <div className="lg:w-3/5 relative min-h-[400px]">
                <Image 
                    src={listingImage} 
                    alt={listingTitle} 
                    fill 
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                        <Badge className="bg-primary text-primary-foreground mb-2 hover:bg-primary">Exclusive</Badge>
                        <h3 className="text-3xl font-bold">{listingTitle}</h3>
                        <div className="flex items-center mt-2 opacity-90">
                            <MapPin className="h-4 w-4 mr-1" />
                            {location}
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-background">
                <div className="mb-8">
                    <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium mb-1">Asking Price</p>
                    <div className="text-4xl font-bold text-primary">{price}</div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y mb-8">
                    <div className="text-center">
                        <BedDouble className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <div className="font-semibold">{beds} Beds</div>
                    </div>
                    <div className="text-center border-x border-dashed">
                        <Bath className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <div className="font-semibold">{baths} Baths</div>
                    </div>
                    <div className="text-center">
                        <Ruler className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <div className="font-semibold">{area}</div>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-sm">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 mt-auto">
                    <Button size="lg" className="flex-1 h-12">
                        View Details
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1 h-12">
                        Schedule Tour
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
