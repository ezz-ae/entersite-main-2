'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Zap,
  MapPin,
  CircleDollarSign,
  ShieldCheck,
  Network,
  ChevronRight,
  Loader2,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AudienceBuilderTool() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [useMasterNetwork, setUseMasterNetwork] = useState(true);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
    }, 3000);
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Audience Architect</h2>
          <p className="text-zinc-500 text-lg font-light">Launch precision targeting using EntreSite's Master Investor Network.</p>
        </div>
        <div className="flex gap-3">
             <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2 rounded-full">
                <Database className="h-3 w-3 mr-2" /> Master Pool: Pilot List
             </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Build Rules */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Master Seeding Activation */}
           <Card className={cn(
               "bg-zinc-900 border-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden group",
               useMasterNetwork ? "border-blue-600 shadow-[0_0_50px_-10px_rgba(37,99,235,0.3)]" : "border-white/5"
           )}>
                <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                    <div className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 transition-colors",
                        useMasterNetwork ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-600"
                    )}>
                        <Network className="h-10 w-10" />
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Master Network Seeding</h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[8px] font-black uppercase tracking-widest">Recommended</Badge>
                        </div>
                        <p className="text-zinc-500 font-medium">Seed your Meta audience with approved pilot segments or your own list.</p>
                    </div>
                    <Button 
                        onClick={() => setUseMasterNetwork(!useMasterNetwork)}
                        variant={useMasterNetwork ? "default" : "outline"}
                        className={cn(
                            "h-14 px-8 rounded-2xl font-bold transition-all",
                            useMasterNetwork ? "bg-white text-black hover:bg-zinc-200" : "border-white/10 text-zinc-400"
                        )}
                    >
                        {useMasterNetwork ? "Seeding Active" : "Activate Seeding"}
                    </Button>
                </div>
           </Card>

           <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem] p-10 space-y-10">
              <div>
                 <CardTitle className="text-xl text-white">Targeting Blueprint</CardTitle>
                 <CardDescription className="text-zinc-500">Refine the Master Network to match this specific project.</CardDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Geographic Heatmap</label>
                    <div className="flex flex-wrap gap-2">
                        {['Dubai Marina', 'Business Bay', 'UK Investors', 'India HNW', 'GCC Residents'].map(tag => (
                            <Badge key={tag} className="bg-zinc-900 border-white/5 text-zinc-400 px-4 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                                {tag}
                            </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="h-8 border-dashed border-white/10 text-zinc-500 rounded-full hover:bg-white/5"><Plus className="h-3 w-3 mr-1" /> Add Region</Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Financial Profile</label>
                    <div className="space-y-3">
                        <ProfileOption label="High-intent buyers" active />
                        <ProfileOption label="Frequent real estate search" active />
                        <ProfileOption label="Luxury brand interest" />
                    </div>
                </div>
              </div>
           </Card>

           <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="outline" className="flex-1 h-16 rounded-[1.5rem] border-white/5 bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-xs">Save Blueprint</Button>
              <Button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1 h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg gap-3 shadow-2xl shadow-blue-900/40"
              >
                 {isSyncing ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Sparkles className="h-6 w-6" /> Sync to Meta Network</>}
              </Button>
           </div>
        </div>

        {/* Right Column: Audience Summary */}
        <div className="space-y-8">
           <Card className="bg-zinc-900/50 border-white/5 text-white rounded-[2.5rem] overflow-hidden border-2 border-blue-500/10">
              <CardHeader className="p-8 pb-4">
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Projected Delivery</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter">Estimate</span>
                    <span className="text-zinc-500 font-bold text-xs">REACH</span>
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="h-48 w-full bg-black/40 rounded-[2rem] relative overflow-hidden flex items-center justify-center border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
                    <div className="absolute w-40 h-40 rounded-full border border-blue-500/20 animate-pulse" />
                    <div className="absolute w-24 h-24 rounded-full border border-blue-500/40" />
                    <Network className="h-12 w-12 text-blue-500 relative z-10" />
                    <p className="absolute bottom-4 text-[8px] font-black text-blue-500/60 uppercase tracking-[0.4em]">Optimizing Overlap</p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Yield Prediction</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl bg-black border border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">CPL Range</p>
                          <p className="text-2xl font-black text-green-500">Estimate</p>
                       </div>
                       <div className="p-5 rounded-2xl bg-black border border-white/5">
                          <p className="text-[10px] text-zinc-500 uppercase font-black mb-1">Quality</p>
                          <p className="text-2xl font-black text-blue-400">Prime</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-zinc-400 text-xs">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span>Compliance: Meta Advantage+ Ready</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="p-8 rounded-[2.5rem] bg-orange-600/5 border border-dashed border-orange-500/20 space-y-4">
                <div className="flex items-center gap-2 text-orange-500">
                    <Zap className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Insight</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                    European investors are currently showing <span className="text-white">40% higher click-through</span> on waterfront villa projects.
                </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProfileOption({ label, active }: { label: string; active?: boolean }) {
    return (
        <div className={cn(
            "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer",
            active ? "bg-blue-600/5 border-blue-500/20" : "bg-black border-white/5 hover:bg-white/5"
        )}>
            <span className={cn("text-xs font-bold", active ? "text-white" : "text-zinc-500")}>{label}</span>
            {active && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
        </div>
    )
}

function CheckCircle2(props: any) {
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
