'use client';

import React from 'react';
import { Smartphone, Zap, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SmsLeadBlockProps {
  headline?: string;
  subtext?: string;
  buttonText?: string;
  projectContext?: string;
}

export function SmsLeadBlock({
  headline = "Get Instant Updates via SMS",
  subtext = "Never miss a price drop or a new unit release. Join our VIP broadcast list.",
  buttonText = "Join VIP List",
  projectContext = "Creek Harbour"
}: SmsLeadBlockProps) {
  return (
    <div className="py-24 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center mx-auto mb-8">
                <Smartphone className="h-8 w-8 text-green-500" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                {headline}
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">
                {subtext}
            </p>

            <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-2 rounded-[2rem] max-w-md mx-auto flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 gap-2">
                    <span className="text-zinc-500 font-bold text-sm">+971</span>
                    <input 
                        type="tel" 
                        placeholder="5X XXX XXXX"
                        className="bg-transparent border-0 focus:ring-0 text-white placeholder:text-zinc-700 w-full font-mono tracking-widest text-lg"
                    />
                </div>
                <Button className="h-14 px-8 rounded-[1.5rem] bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-lg shadow-green-900/20 group">
                    {buttonText} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40 grayscale">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Instant Alerts
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> No Spam
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> WhatsApp Ready
                </div>
            </div>
        </div>
    </div>
  );
}
