'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Instagram, MessageSquare, Zap, Globe, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

export function ChatAgentShowcase() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: 'Hi! Ask me about pricing, availability, or upcoming launches. I can shortlist the best options.' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const quickPrompts = ['Price range in Dubai Marina', 'Best off-plan launches', 'Payment plan options'];

  const handleSendMessage = async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || isLoading) return;

    const nextMessages: Message[] = [...messages, { role: 'user', text: content }];
    setMessages(nextMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/bot/preview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: nextMessages.slice(-6).map((entry) => ({
            role: entry.role === 'user' ? 'user' : 'agent',
            text: entry.text,
          })),
          context:
            'Marketing preview. You are a UAE real estate assistant. Ask for budget, area, timeline, and contact when appropriate.',
        }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: data.reply || 'I can share options and help schedule a viewing. What area and budget should I focus on?',
        },
      ]);
    } catch (error) {
      console.error('Chat preview error', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          text: 'I can share options and help schedule a viewing. What area and budget should I focus on?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-32 bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-[1800px]">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Left: Content */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
               <Sparkles className="h-3 w-3" /> Instant Replies
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              Your Always-On <br/>
              <span className="text-blue-500">Sales Assistant.</span>
            </h2>
            
            <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
              Answer common questions and share listings on Instagram, WhatsApp, or your website to capture leads faster.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
                <Feature icon={Instagram} title="Instagram Bio" desc="Automate lead capture from your bio link." />
                <Feature icon={MessageSquare} title="WhatsApp Sync" desc="Share brochures and plans instantly." />
                <Feature icon={Globe} title="Website Chat" desc="We add it to your site for you." />
                <Feature icon={Zap} title="Up-to-date Answers" desc="Uses your latest pricing and availability." />
            </div>

            <Button asChild size="lg" className="h-16 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg mt-8 shadow-xl shadow-blue-900/20">
              <a href="/dashboard/chat-agent">Start Chat Assistant</a>
            </Button>
          </div>

          {/* Right: Visual Mockup */}
          <div className="relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
             
             <div className="relative bg-black border border-white/10 rounded-[3rem] p-8 aspect-[4/5] shadow-2xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                         <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div>
                         <p className="font-bold text-white">Creek Expert Assistant</p>
                         <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <div className="p-2 rounded-lg bg-white/5"><Instagram className="h-4 w-4 text-zinc-400" /></div>
                      <div className="p-2 rounded-lg bg-white/5"><MessageSquare className="h-4 w-4 text-zinc-400" /></div>
                   </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} text={msg.text} />
                  ))}
                  {isLoading && (
                    <ChatMessage role="agent" text="Typing..." />
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                   <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 h-12 rounded-full bg-zinc-900 border border-white/5 px-6 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                   <button onClick={() => handleSendMessage()} className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <Send className="h-5 w-5" />
                   </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-400 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, desc }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-200">
                <Icon className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-sm">{title}</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
        </div>
    )
}

function ChatMessage({ role, text }: { role: 'user' | 'agent'; text: string }) {
    return (
        <div className={cn(
            "flex",
            role === 'agent' ? "justify-start" : "justify-end"
        )}>
            <div className={cn(
                "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed",
                role === 'agent' 
                    ? "bg-zinc-800 text-zinc-100 rounded-tl-none" 
                    : "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
            )}>
                {text}
            </div>
        </div>
    )
}
