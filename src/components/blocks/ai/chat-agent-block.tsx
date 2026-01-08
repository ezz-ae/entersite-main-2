'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Send, Instagram, MessageSquare, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatAgentBlockProps {
  headline?: string;
  subtext?: string;
  agentName?: string;
  placeholder?: string;
  theme?: 'dark' | 'light' | 'glass';
}

export function ChatAgentBlock({
  headline = "Speak to our Market Expert",
  subtext = "Get instant answers about ROIs, floor plans, and availability.",
  agentName = "Creek AI Expert",
  placeholder = "Ask anything about this project...",
  theme = 'glass'
}: ChatAgentBlockProps) {
  const [input, setInput] = useState('');

  return (
    <div className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
                
                {/* Content Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" /> Expert Intelligence
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-white">{headline}</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">{subtext}</p>
                    
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Instagram className="h-4 w-4" />
                            </div>
                            Connected to Instagram DM
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Zap className="h-4 w-4" />
                            </div>
                            Live 3,750+ Project Knowledge
                        </div>
                    </div>
                </div>

                {/* Interactive Chat Side */}
                <div className="lg:col-span-3">
                    <div className={cn(
                        "rounded-[2.5rem] border overflow-hidden shadow-2xl flex flex-col aspect-[4/3] lg:aspect-[5/4]",
                        theme === 'glass' ? "bg-white/5 backdrop-blur-xl border-white/10" : "bg-zinc-900 border-white/5"
                    )}>
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">{agentName}</p>
                                    <p className="text-[10px] text-green-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-white">
                                View Full Knowledge Base
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-zinc-800/80 rounded-2xl rounded-tl-none p-4 text-sm text-zinc-200">
                                    Hello! I'm your AI market advisor. Ask me anything about current prices, ROIs in different areas, or upcoming launches.
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div className="max-w-[80%] bg-blue-600 rounded-2xl rounded-tr-none p-4 text-sm text-white shadow-lg shadow-blue-900/20">
                                    What's the best ROI in Dubai Marina right now?
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-zinc-800/80 rounded-2xl rounded-tl-none p-4 text-sm text-zinc-200">
                                    Currently, secondary market units in Dubai Marina are seeing 7.2% net ROI. However, for off-plan capital appreciation, Emaar Beachfront projects are outperforming with a projected 15% increase by handover. Would you like to see the comparison?
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-white/5 bg-black/10">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    className="w-full h-14 bg-zinc-950/50 border border-white/10 rounded-2xl px-6 pr-14 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
                                    placeholder={placeholder}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex gap-4 mt-4">
                                {['ROI Stats', 'Floor Plans', 'Area Guide'].map(tag => (
                                    <button key={tag} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
