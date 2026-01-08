'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GalleryBlockProps {
  data: {
    headline?: string;
    subtext?: string;
    images?: string[];
  };
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  const { 
    headline = "Project Gallery", 
    subtext = "Experience the visual splendor of our projects through this curated collection.",
    images = [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1600596542815-275084988866?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    ]
  } = data;

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {(headline || subtext) && (
          <div className="text-center mb-10 max-w-3xl mx-auto">
            {headline && <h2 className="text-3xl font-bold mb-4">{headline}</h2>}
            {subtext && <p className="text-lg text-muted-foreground">{subtext}</p>}
          </div>
        )}

        <div className="relative group max-w-5xl mx-auto">
          <div className="aspect-video relative overflow-hidden rounded-xl shadow-xl">
            <Image
              src={images[currentIndex]}
              alt={`Gallery Image ${currentIndex + 1}`}
              fill
              className="object-cover transition-transform duration-500"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          
           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-4 mt-4 max-w-5xl mx-auto">
            {images.map((img, index) => (
                <div 
                    key={index} 
                    className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${index === currentIndex ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setCurrentIndex(index)}
                >
                    <Image 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        fill 
                        className="object-cover"
                    />
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}
