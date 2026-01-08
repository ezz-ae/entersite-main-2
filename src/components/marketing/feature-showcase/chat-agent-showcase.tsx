'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Instagram, MessageSquare, Zap, Globe, Sparkles, Send, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  side: 'left' | 'right';
  text: string;
  isPdf?: boolean;
}

export function ChatAgentShowcase() {
  const [messages, setMessages] = useState<Message[]>([
    { side: 'left', text: 'Hi! I saw the post about the new launch in Creek Beach. Can you send me the floor plans for 2BR apartments?' },
    { side: 'right', text: 'Certainly! Emaar just released the \'Creek Waters\' phase. 2BR apartments start from AED 2.1M. Here is the floor plan PDF.', isPdf: true },
    { side: 'right', text: 'Would you like to schedule a private viewing or speak to an area specialist?' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessages: Message[] = [...messages, { side: 'left', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { side: 'right', text: 'I am a demo version. For full functionality, please sign up.' }]);
    }, 1000);
  };

  return (
    <section className="py-32 bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-[1800px]">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          {/* Left: Content */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest">
               <Sparkles className="h-3 w-3" /> Omnichannel Intelligence
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
              Your 24/7 <br/>
              <span className="text-blue-500">Expert Sales Agent.</span>
            </h2>
            
            <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
              Trained on our database of 3,750+ UAE projects. Deploy it to your Instagram DMs, WhatsApp, or any website in seconds. It doesn't just chat—it sells.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6">
                <Feature icon={Instagram} title="Instagram Bio" desc="Automate lead capture from your bio link." />
                <Feature icon={MessageSquare} title="WhatsApp Sync" desc="Share brochures and plans instantly." />
                <Feature icon={Globe} title="Web Embed" desc="Add to your current site with one line of code." />
                <Feature icon={Zap} title="Live Data" desc="Answers based on real-time price updates." />
            </div>

            <Button size="lg" className="h-16 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg mt-8 shadow-xl shadow-blue-900/20">
              Build Your Agent Now
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
                         <p className="font-bold text-white">Creek Expert AI</p>
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
                    <React.Fragment key={i}>
                      <ChatMessage side={msg.side} text={msg.text} />
                      {msg.isPdf && (
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-zinc-800 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-white">2BR_Creek_Waters.pdf</p>
                                <p className="text-[10px] text-zinc-500">2.4 MB • PDF Document</p>
                            </div>
                          </div>
                          <Download className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                   <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 h-12 rounded-full bg-zinc-900 border border-white/5 px-6 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                   <button onClick={handleSendMessage} className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <Send className="h-5 w-5" />
                   </button>
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

function ChatMessage({ side, text }: { side: 'left' | 'right', text: string }) {
    return (
        <div className={cn(
            "flex",
            side === 'right' ? "justify-start" : "justify-end"
        )}>
            <div className={cn(
                "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed",
                side === 'right' 
                    ? "bg-zinc-800 text-zinc-100 rounded-tl-none" 
                    : "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
            )}>
                {text}
            </div>
        </div>
    )
}
