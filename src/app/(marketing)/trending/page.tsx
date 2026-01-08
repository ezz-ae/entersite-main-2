'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot,
  ArrowRight,
  MessageSquare,
  BarChart, 
  Zap
} from 'lucide-react';

export default function AiAgentPublicPage() {
    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            
            {/* 1. HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            <Bot className="h-3.5 w-3.5" />
                            AI Sales Agent
                        </div>
                        
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-white italic uppercase">
                            Never Miss <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 not-italic">A Lead Again.</span>
                        </h1>
                        
                        <p className="text-zinc-500 text-2xl md:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
                            Deploy an AI-powered sales agent to your Instagram DMs to instantly engage leads, answer questions, and book appointments, 24/7.
                        </p>
                        <Button asChild className="h-16 rounded-full bg-white text-black font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-white/10">
                            <Link href="/dashboard/ai-agent">Get Your AI Agent <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* 2. HOW IT WORKS */}
            <section className="py-40 bg-zinc-950 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                      <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white uppercase italic">Works While <br/><span className="text-zinc-600 not-italic">You Sleep.</span></h2>
                      <p className="text-zinc-500 text-xl font-light leading-relaxed mt-6">
                          Our AI agent integrates seamlessly with your Instagram account, acting as your frontline sales force. It's always on, always learning, and always closing.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <HowItWorksStep 
                          step="01"
                          title="Connect Your Instagram"
                          desc="Securely link your Instagram account with a single click. No technical skills required."
                        />
                        <HowItWorksStep 
                          step="02"
                          title="Train Your Agent"
                          desc="Feed the AI your property data, FAQs, and brand voice guidelines. It learns your business in minutes."
                        />
                        <HowItWorksStep 
                          step="03"
                          title="Go Live & Scale"
                          desc="Activate your agent and watch as it handles incoming DMs, qualifies leads, and grows your business."
                        />
                    </div>
                </div>
            </section>

            {/* 3. FEATURES SECTION */}
            <section className="py-40">
                <div className="container mx-auto px-6 max-w-7xl">
                  <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                      <Card className="relative bg-zinc-900 border-white/10 rounded-[4rem] p-12 overflow-hidden shadow-2xl">
                          <div className="space-y-10">
                              <div className="flex justify-between items-start">
                                  <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 flex items-center justify-center text-indigo-500">
                                      <Zap className="h-8 w-8" />
                                  </div>
                                  <Badge className="bg-green-500 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest">24/7 Availability</Badge>
                              </div>
                              <div className="space-y-6">
                                  <h3 className="text-4xl font-bold italic text-white uppercase tracking-tighter">Instant Engagement</h3>
                                  <p className="text-zinc-400 text-lg font-light">Respond to every DM within seconds, ensuring no potential lead is left waiting. Capture interest the moment it strikes.</p>
                              </div>
                          </div>
                      </Card>
                    </div>
                    <div className="space-y-12">
                        <FeatureItem 
                            icon={MessageSquare}
                            title="Natural Conversations"
                            desc="Our AI is designed to understand and replicate human-like conversation, building rapport with your potential clients."
                        />
                        <FeatureItem 
                            icon={BarChart}
                            title="Lead Qualification"
                            desc="The agent intelligently qualifies leads based on your criteria, so you only spend time on the most promising prospects."
                        />
                        <FeatureItem 
                            icon={Zap}
                            title="Seamless Handoff"
                            desc="When a lead is ready to talk to a human, the agent seamlessly transfers the conversation to your sales team."
                        />
                    </div>
                  </div>
                </div>
            </section>

        </main>
    );
}

function HowItWorksStep({ step, title, desc }: { step: string, title: string, desc: string }) {
  return (
    <div className="border border-white/5 rounded-3xl p-8 bg-zinc-950/50">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-black text-indigo-400 italic">{step}</span>
        <ArrowRight className="h-5 w-5 text-zinc-700" />
      </div>
      <h3 className="text-2xl font-bold text-white tracking-tight italic uppercase mb-3">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
    </div>
  )
}

function FeatureItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <Icon className="h-6 w-6 text-zinc-400" />
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight italic uppercase">{title}</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-light">{desc}</p>
        </div>
    )
}
