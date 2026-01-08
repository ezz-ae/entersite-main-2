'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Linkedin, Twitter, Instagram, User } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
}

interface TeamBlockProps {
  headline?: string;
  subtext?: string;
  members?: TeamMember[];
}

export function TeamBlock({
  headline = "Meet Our Experts",
  subtext = "Our team of seasoned professionals is dedicated to guiding you through every step of your real estate journey.",
  members = [
      { name: "Sarah Jenkins", role: "Senior Consultant", bio: "Specializing in luxury penthouses with over 10 years of experience." },
      { name: "David Chen", role: "Investment Advisor", bio: "Expert in high-yield property investments and portfolio management." },
      { name: "Maria Rodriguez", role: "Sales Director", bio: "Leading our sales strategies with a focus on client satisfaction." },
      { name: "James Wilson", role: "Property Manager", bio: "Ensuring your assets are maintained to the highest standards." }
  ]
}: TeamBlockProps) {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-[1800px]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{headline}</h2>
          <p className="text-lg text-zinc-500">{subtext}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => {
            return (
              <div key={index} className="bg-zinc-900/50 rounded-[2rem] overflow-hidden border border-white/5 group hover:border-blue-500/30 transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-800 flex items-center justify-center">
                    <User className="h-20 w-20 text-zinc-700 opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                       <div className="flex gap-4 text-white">
                           <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                               <Linkedin className="h-5 w-5" />
                           </Button>
                           <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                               <Twitter className="h-5 w-5" />
                           </Button>
                           <Button size="icon" variant="ghost" className="h-10 w-10 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                               <Instagram className="h-5 w-5" />
                           </Button>
                       </div>
                  </div>
                </div>
                <div className="p-8 text-center space-y-3">
                  <div>
                    <h3 className="font-bold text-xl text-white">{member.name}</h3>
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-500">{member.role}</p>
                  </div>
                  {member.bio && (
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{member.bio}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
