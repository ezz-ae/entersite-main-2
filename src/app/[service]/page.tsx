'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Globe, Bot, Search, Facebook, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// --- Content Configuration ---
const SERVICE_DATA = {
  website: {
    title: "Website Builder",
    tagline: "Brochure to Web in 30 Seconds",
    description: "Upload a brochure and get a ready-to-share project page in minutes. We pull the details, write the copy, and build the layout for you.",
    icon: Globe,
    color: "blue",
    features: [
      "Auto-pull project details and specs",
      "Sales copy written for you",
      "Looks great on mobile",
      "Connected to live market data",
      "Preview link included (sitename.site.entrestate.com)"
    ],
    cta: "Launch Architect",
    href: "/builder"
  },
  'ai-market-expert': {
    title: "Market Intelligence",
    tagline: "Real-time UAE Project Data",
    description: "Access a centralized market hub with curated projects, pricing insights, and inventory updates.",
    icon: Bot,
    color: "orange",
    features: [
        "Real-time ROI & Yield analytics",
        "Developer performance insights",
        "Historical price trend visualization",
        "Branded PDF export for investors",
        "Direct campaign generation"
    ],
    cta: "Explore Market Data",
    href: "/inventory"
  },
  'google-ads': {
    title: "Ads Synchronization",
    tagline: "High-Intent Search Campaigns",
    description: "Launch targeted Google Search campaigns directly from your project data. We handle keyword grouping, ad copy, and budget guidance to drive more leads.",
    icon: Search,
    color: "green",
    features: [
        "One-click campaign launch",
        "High-intent keyword grouping",
        "Smart-optimized ad copy variations",
        "Real-time performance indicators",
        "Automatic tracking setup"
    ],
    cta: "Connect Google Ads",
    href: "/google-ads"
  },
  'instagram-bot': {
    title: "Social Automation",
    tagline: "Always-On Instagram Replies",
    description: "Turn your Instagram profile into a sales engine. Our Smart bot handles project inquiries, qualifies investors, and pushes hot leads to your WhatsApp.",
    icon: Facebook,
    color: "pink",
    features: [
        "Official Meta connection",
        "Speaks 40+ languages natively",
        "Automated project info sharing",
        "Lead qualification & CRM updates",
        "Zero missed inquiries policy"
    ],
    cta: "Launch Instagram Assistant",
    href: "/instagram-assistant"
  }
};

interface PageProps {
  params: Promise<{ service: string }>;
}

export default function ServicePage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const serviceKey = resolvedParams.service as keyof typeof SERVICE_DATA;
  const service = SERVICE_DATA[serviceKey];

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const colorMap: any = {
      blue: "from-blue-600 to-indigo-600",
      orange: "from-orange-500 to-red-600",
      green: "from-green-500 to-emerald-600",
      pink: "from-pink-500 to-purple-600"
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/20">
      
      {/* Header Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
          <div className={cn("absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-20 bg-gradient-to-r", colorMap[service.color])} />
          
          <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                  <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] mx-auto", `text-${service.color}-500`)}>
                    <Activity className="h-3.5 w-3.5" />
                    Service Overview
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">{service.title}<br/><span className="text-zinc-600 italic uppercase">{service.tagline}</span></h1>
                  <p className="text-zinc-500 text-2xl max-w-3xl mx-auto font-light leading-relaxed">
                      {service.description}
                  </p>
              </motion.div>
          </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  
                  <div className="space-y-12">
                      <div>
                          <h2 className="text-4xl font-bold mb-8">What You Get</h2>
                          <div className="space-y-6">
                              {service.features.map((feature, i) => (
                                  <div key={i} className="flex items-start gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                      </div>
                                      <p className="text-lg text-zinc-300 font-light">{feature}</p>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <Link href={service.href}>
                        <Button className="h-16 px-12 rounded-full bg-white text-black font-black text-xl hover:scale-105 transition-all shadow-2xl">
                            {service.cta} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                  </div>

                  <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden p-12">
                      <div className="space-y-8">
                          <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border", `bg-${service.color}-600/10 border-${service.color}-500/20 text-${service.color}-500`)}>
                                  <Icon className="h-8 w-8" />
                              </div>
                              <div>
                                  <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Service Status</p>
                                  <h4 className="text-xl font-bold text-white">{service.title}</h4>
                              </div>
                          </div>
                          
                          <div className="space-y-6">
                              <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                                  <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Connection Status</p>
                                  <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                      <p className="text-sm font-bold text-white">Connected to UAE market data</p>
                                  </div>
                              </div>
                              <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                                  <p className="text-[10px] font-bold text-zinc-600 uppercase mb-2">Smart Optimization</p>
                                  <p className="text-lg font-black text-white">Smart tuning active</p>
                              </div>
                          </div>

                          <div className="pt-4">
                              <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">
                                  <span>Efficiency Rating</span>
                                  <span className="text-blue-500">98.4%</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full w-[98%] bg-blue-600" />
                              </div>
                          </div>
                      </div>
                  </Card>
              </div>
          </div>
      </section>

      {/* System Note */}
      <section className="py-40 bg-zinc-950 border-y border-white/5 text-center">
          <div className="container mx-auto px-6 max-w-4xl space-y-6">
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-4xl font-bold">Part of Your Growth Toolkit.</h3>
              <p className="text-zinc-500 text-xl font-light leading-relaxed">
                  All Entrestate services work together. Your website, ads, and chat assistant stay connected so you can follow up faster and close more.
              </p>
          </div>
      </section>

    </main>
  );
}
