'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  ArrowRight,
  Target,
  Mail,
  Smartphone,
  ChevronRight,
  DatabaseZap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AudienceNetworkPublicPage() {
    const handleScrollToSegments = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.getElementById('segments')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            
            {/* 1. DATA MASTER HERO */}
            <section className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-[1200px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
                            <Network className="h-3.5 w-3.5" />
                            Pilot Buyer Network
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white uppercase italic">
                            Audience <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 not-italic">Network.</span>
                        </h1>
                        
                        <p className="text-zinc-500 text-base sm:text-lg md:text-2xl max-w-4xl mx-auto font-light leading-relaxed">
                            Run your campaigns with an invite-only audience pool or bring your own list. Designed for broker teams who want clean, organized outreach.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Button asChild className="h-12 sm:h-14 md:h-16 px-8 md:px-10 rounded-full bg-blue-600 text-white font-black text-base sm:text-lg hover:bg-blue-700 shadow-[0_0_50px_-10px_rgba(37,99,235,0.5)] transition-all w-full sm:w-auto">
                            <Link href="/dashboard/billing">Unlock Buyer Pool <ArrowRight className="ml-2 h-6 w-6" /></Link>
                        </Button>
                        <Button onClick={handleScrollToSegments} variant="outline" className="h-12 sm:h-14 md:h-16 px-8 md:px-10 rounded-full border-white/10 bg-white/5 text-white font-bold text-base sm:text-lg hover:bg-white/10 w-full sm:w-auto">
                            Explore Segments
                        </Button>
                    </div>

                    {/* Live Counter */}
                    <div className="pt-12 sm:pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                         <CounterItem label="Access" value="Invite-only" />
                         <CounterItem label="Data Source" value="Broker-owned" />
                         <CounterItem label="List Type" value="Opt-in only" />
                         <CounterItem label="Status" value="Pilot Live" />
                    </div>
                </div>
            </section>

            {/* 2. THREE-PRONGED DELIVERY (The Money Maker) */}
            <section id="segments" className="py-24 md:py-32 bg-zinc-950 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="text-center mb-32 space-y-4">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">One Pool. <span className="text-zinc-600">Total Reach.</span></h2>
                        <p className="text-zinc-500 text-base sm:text-lg md:text-2xl font-light">Choose your delivery channel and start a sequence.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Meta Ads Feed */}
                        <DeliveryCard 
                            icon={Target}
                            title="Meta Lookalike Feed"
                            desc="Use your own list or approved pilot segments to seed lookalikes."
                            price="Pilot access"
                            tag="INVITE-ONLY"
                            color="blue"
                        />
                        {/* SMS VIP Broadcast */}
                        <DeliveryCard 
                            icon={Smartphone}
                            title="SMS VIP Broadcast"
                            desc="Private SMS and WhatsApp sequences for pre-launch updates."
                            price="Pilot access"
                            tag="PILOT"
                            color="green"
                        />
                        {/* Email Intelligence */}
                        <DeliveryCard 
                            icon={Mail}
                            title="Email Intelligence"
                            desc="Structured email sequences with clear follow-up steps."
                            price="Pilot access"
                            tag="PILOT"
                            color="purple"
                        />
                    </div>
                </div>
            </section>

            {/* 3. TRUST & MARKET INTELLIGENCE */}
            <section className="py-24 md:py-32 bg-black">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <Badge className="bg-blue-600 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase tracking-widest border-0">Pilot Access</Badge>
                                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white uppercase">Broker-Owned <br/><span className="text-zinc-600 italic uppercase">Audiences.</span></h2>
                                <p className="text-zinc-500 text-base sm:text-lg md:text-xl font-light leading-relaxed">
                                    Use your own list or get invited to pilot segments. Everything stays controlled by your team and shared only with your approval.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <TrustPoint title="You control the list" desc="Only contacts you approve are used for outreach." />
                                <TrustPoint title="Opt-in only" desc="Every contact is permission-based and easy to remove." />
                                <TrustPoint title="Pilot safeguards" desc="Manual review before any campaign goes live." />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-blue-600 rounded-[3rem] blur-3xl opacity-20 animate-pulse" />
                            <Card className="relative bg-zinc-900 border-white/10 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-8 md:p-12 overflow-hidden shadow-2xl">
                                <div className="space-y-8 sm:space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                            <DatabaseZap className="h-6 w-6 sm:h-8 sm:w-8" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Pilot Access</span>
                                        </div>
                                    </div>
                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg sm:text-xl font-bold italic uppercase tracking-tighter text-white">Segment Activity</h4>
                                            <span className="text-xs font-bold text-zinc-500">Sample View</span>
                                        </div>
                                        <div className="space-y-4">
                                            <ActivityRow label="European Luxury Search" value="High" color="blue" />
                                            <ActivityRow label="Indian High Yield Interest" value="Moderate" color="blue" />
                                            <ActivityRow label="Local Off-Plan Registrations" value="Critical" color="orange" />
                                        </div>
                                    </div>
                                    <div className="pt-6 sm:pt-8 border-t border-white/5 text-center">
                                        <Button asChild className="w-full h-12 sm:h-14 md:h-16 rounded-2xl bg-white text-black font-black text-base sm:text-lg hover:scale-105 transition-all">
                                            <Link href="/dashboard/meta-audience">View Audience Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}

function CounterItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-2xl sm:text-3xl md:text-5xl font-black text-white italic tracking-tighter">{value}</p>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
        </div>
    )
}

function DeliveryCard({ icon: Icon, title, desc, price, tag, color }: any) {
    return (
        <Card className="bg-zinc-900 border-white/5 rounded-[2.5rem] p-6 sm:p-8 md:p-10 flex flex-col hover:border-blue-500/30 transition-all group h-full">
            <div className="flex justify-between items-start mb-8 sm:mb-10">
                <div className={cn(
                    "w-12 h-12 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center border",
                    color === 'blue' ? "bg-blue-600/10 border-blue-500/20 text-blue-500" :
                    color === 'green' ? "bg-green-600/10 border-green-500/20 text-green-500" :
                    "bg-purple-600/10 border-purple-500/20 text-purple-500"
                )}>
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <Badge className="bg-white/5 text-zinc-500 border-white/5 text-[8px] font-black uppercase tracking-widest">{tag}</Badge>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{title}</h4>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-10 flex-grow">{desc}</p>
            <div className="space-y-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter">{price}</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pilot plan required</p>
                <Button asChild className="w-full h-14 rounded-2xl bg-white text-black font-black hover:bg-zinc-200">
                    <Link href="/dashboard/billing">Join Pilot <ChevronRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        </Card>
    )
}

function TrustPoint({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 mt-1">
                <Check className="h-3 w-3 stroke-[4px]" />
            </div>
            <div>
                <h5 className="font-bold text-white text-sm uppercase italic tracking-widest">{title}</h5>
                <p className="text-xs text-zinc-500 mt-1">{desc}</p>
            </div>
        </div>
    )
}

function ActivityRow({ label, value, color }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/5">
            <span className="text-xs font-bold text-zinc-400">{label}</span>
            <span className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                color === 'blue' ? "bg-blue-600/10 text-blue-500" : "bg-orange-600/10 text-orange-500"
            )}>{value}</span>
        </div>
    )
}

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
