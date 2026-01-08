'use client';

import React from "react";
import { Check, Star, Trophy, Users } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface StatsBlockProps {
  headline?: string;
  subtext?: string;
  stats?: StatItem[];
}

export function StatsBlock({
  headline = "Highlights That Build Trust",
  subtext = "Add the proof points your buyers care about.",
  stats = [
      { value: "Fast", label: "Setup", icon: <Trophy className="h-6 w-6" /> },
      { value: "Mobile", label: "First", icon: <Users className="h-6 w-6" /> },
      { value: "Clear", label: "Details", icon: <Star className="h-6 w-6" /> },
      { value: "Trusted", label: "Support", icon: <Check className="h-6 w-6" /> },
  ]
}: StatsBlockProps) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
          <p className="text-lg text-primary-foreground/80">{subtext}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                    <div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white">
                        {stat.icon}
                    </div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm font-medium uppercase tracking-wider text-white/80">{stat.label}</div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
