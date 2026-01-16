'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Send, Instagram, Zap } from 'lucide-react';
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
  headline = "Speak to this Market Expert",
  subtext = "Get instant answers about floor plans, pricing, and availability.",
  agentName = "Creek Market Expert",
  placeholder = "Ask anything about this project...",
  theme = 'glass'
}: ChatAgentBlockProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Hello! I'm your market advisor. Ask me about pricing, availability, or upcoming launches." },
  ]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/bot/preview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6),
          context: `Agent: ${agentName}. Focus: ${headline}. ${subtext}`,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: data.reply || "I'm reviewing the latest listings. What area should I focus on?" },
      ]);
    } catch (error) {
      console.error('Chat agent error', error);
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: "I'm having trouble right now. Share your preferred area and budget and I'll follow up." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
                
                {/* Content Side */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" /> Market Assistant
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight text-white">{headline}</h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">{subtext}</p>
                    
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Instagram className="h-4 w-4" />
                            </div>
                            Instagram Inbox Ready
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                <Zap className="h-4 w-4" />
                            </div>
                            Project Details Ready
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
                                View Details
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            {messages.map((message, index) => (
                                <div key={`${message.role}-${index}`} className={cn("flex", message.role === 'user' ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl p-4 text-sm",
                                        message.role === 'user'
                                          ? "bg-blue-600 rounded-tr-none text-white shadow-lg shadow-blue-900/20"
                                          : "bg-zinc-800/80 rounded-tl-none text-zinc-200"
                                    )}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                              <div className="flex justify-start">
                                <div className="max-w-[80%] bg-zinc-800/80 rounded-2xl rounded-tl-none p-4 text-sm text-zinc-400">
                                  Typing…
                                </div>
                              </div>
                            )}
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
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                  className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all group-hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
                                  onClick={handleSend}
                                  disabled={isLoading}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex gap-4 mt-4">
                                {['Price Range', 'Floor Plans', 'Area Guide'].map(tag => (
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
