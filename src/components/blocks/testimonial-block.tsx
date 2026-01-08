'use client';

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

interface TestimonialBlockProps {
  headline?: string;
  subtext?: string;
  testimonials?: Testimonial[];
}

export function TestimonialBlock({
  headline = "Trusted by Real Estate Teams",
  subtext = "See how brokers and developers simplify marketing with Entrestate.",
  testimonials = [
    {
      quote: "Entrestate made it easy to turn brochures into clean, shareable pages and keep our messaging consistent.",
      author: "Fatima Al-Marzouqi",
      role: "CEO, Prestige Properties",
    },
    {
      quote: "The ads tools give us a clear starting point and help our team launch campaigns faster.",
      author: "Johnathan Smith",
      role: "Marketing Director, Skyline Developments",
    },
    {
      quote: "The chat assistant answers common questions and routes serious inquiries to our team.",
      author: "Chen Wei",
      role: "Founder, Urban Nest Realty",
    },
  ],
}: TestimonialBlockProps) {
  return (
    <section className="py-32 bg-black border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-[1800px] relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-none">{headline}</h2>
          <p className="text-xl text-zinc-500 font-light">{subtext}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => {
            return (
              <div
                key={i}
                className="bg-zinc-900/50 p-10 rounded-[3rem] border border-white/10 flex flex-col group hover:border-blue-500/30 transition-all duration-500 backdrop-blur-3xl"
              >
                <div className="mb-8 flex justify-between items-start">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="h-4 w-4 text-blue-500 fill-current" />
                        ))}
                    </div>
                    <Quote className="h-10 w-10 text-white/5 group-hover:text-blue-500/10 transition-colors" />
                </div>
                
                <p className="text-lg text-zinc-300 font-light leading-relaxed mb-10 flex-grow italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                  <Avatar className="h-12 w-12 border border-white/10">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">
                        {testimonial.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-white">{testimonial.author}</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
