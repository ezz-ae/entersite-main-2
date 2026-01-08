'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Image from "next/image";

interface VideoBlockProps {
  headline?: string;
  subtext?: string;
  videoThumbnail?: string;
  videoUrl?: string; // In a real app, this would be a YouTube/Vimeo embed or direct link
}

export function VideoBlock({
  headline = "Experience the Lifestyle",
  subtext = "Take a virtual tour of our community and see what life is like at Elysian Residence.",
  videoThumbnail = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
  videoUrl = "#"
}: VideoBlockProps) {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-white/70">{subtext}</p>
        </div>

        <div className="relative aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
            <Image 
                src={videoThumbnail} 
                alt="Video Thumbnail" 
                fill 
                className="object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-semibold text-lg">Watch Full Tour</p>
                <p className="text-sm text-white/70">Duration: 2:45</p>
            </div>
        </div>
      </div>
    </section>
  );
}
