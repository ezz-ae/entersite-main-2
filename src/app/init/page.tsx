'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Server, 
  Network,
  Radio,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Key,
  CreditCard,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function InitControlRoom() {
    const [status, setStatus] = useState<'analyzing' | 'live'>('analyzing');
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev.slice(-15), msg]);

    useEffect(() => {
        const events = [
            "Initializing OS Kernel...",
            "Synchronizing with Master Node Dubai-01",
            "Verifying AI Logic Cluster (Vertex AI)",
            "Auditing Firestore Security Rules",
            "Handshake with Vercel Edge Node",
            "Payment Gateway Heartbeat: PayPal Active",
            "Payment Gateway Heartbeat: Ziina Active",
            "Messaging Node: SendGrid Ready",
            "Messaging Node: Twilio Ready",
            "System Integrity Check: 100% Secure",
            "DEPLOYMENT READY."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < events.length) {
                addLog(events[i]);
                i++;
            } else {
                setStatus('live');
                clearInterval(interval);
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-[#020202] text-zinc-300 font-mono p-8 md:p-20 overflow-hidden relative">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
            
            {/* 1. TOP STATUS BAR */}
            <div className="max-w-[1800px] mx-auto flex justify-between items-start mb-20 border-b border-white/5 pb-8 relative z-10">
                <div className="flex gap-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">System OS</p>
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Entrestate Control</h1>
                    </div>
                    <div className="h-12 w-px bg-white/5" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Global Node</p>
                        <p className="text-xl font-bold text-blue-500 uppercase">DXB-MASTER-01</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right space-y-1">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Status</p>
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full animate-pulse", status === 'live' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-orange-500")} />
                            <span className={cn("text-xs font-bold uppercase", status === 'live' ? "text-green-500" : "text-orange-500")}>
                                {status === 'live' ? 'System Fully Operational' : 'Synchronizing Clusters...'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                
                {/* 2. LIVE TELEMETRY LOG */}
                <div className="lg:col-span-1 space-y-8">
                     <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                            <Terminal className="h-3 w-3" /> Boot Sequence
                        </h4>
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-[400px] overflow-hidden">
                            <div className="space-y-2">
                                {log.map((entry, i) => (
                                    <p key={i} className={cn(
                                        "text-[11px] leading-relaxed",
                                        entry.includes('READY') ? "text-green-500 font-bold" : "text-zinc-500"
                                    )}>
                                        <span className="opacity-30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {entry}
                                    </p>
                                ))}
                                {status === 'analyzing' && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mt-4" />}
                            </div>
                        </div>
                     </div>

                     <div className="p-8 rounded-2xl bg-blue-600/5 border border-blue-500/10 space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Active Intelligence</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                            "AI Agents are currently processing 1,240+ project data points for the live dashboard feed."
                        </p>
                     </div>
                </div>

                {/* 3. CORE INFRASTRUCTURE STATUS */}
                <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
                    <StatusCard title="Database Node" icon={Database} status="Connected" sub="Firestore Persistence" />
                    <StatusCard title="AI Intelligence" icon={Cpu} status="Optimized" sub="Gemini & Vertex AI" />
                    <StatusCard title="Edge Network" icon={Globe} status="Live" sub="Vercel Nodes Active" />
                    <StatusCard title="Messaging Hub" icon={Radio} status="Ready" sub="Twilio & SendGrid Sync" />
                    <StatusCard title="Revenue Engine" icon={CreditCard} status="Secure" sub="PayPal & Ziina Wired" />
                    <StatusCard title="Ad Master Node" icon={Target} status="Standby" sub="Google Ads API Pool" />

                    {/* BIG STATUS MONITOR */}
                    <div className="md:col-span-3">
                        <Card className="bg-zinc-950 border-white/5 rounded-[3rem] overflow-hidden border-2 border-blue-600/20 shadow-2xl">
                            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">System Pulse Monitor</h3>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Real-time Latency Across Global Nodes</p>
                                </div>
                                <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] font-black uppercase px-4 py-2 rounded-full">Optimal Performance</Badge>
                            </div>
                            <CardContent className="p-10">
                                <div className="h-64 flex items-end gap-2">
                                    {[60, 45, 80, 55, 90, 70, 85, 100, 95, 110, 105, 120, 115, 130, 140, 135, 150, 145, 160, 155].map((h, i) => (
                                        <motion.div 
                                            key={i} 
                                            className="flex-1 bg-gradient-to-t from-blue-600/5 to-blue-600/40 rounded-t-lg relative group"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.05, duration: 1.5 }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[8px] font-black px-2 py-1 rounded">
                                                {h}ms
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-4 gap-10 mt-12 pt-10 border-t border-white/5">
                                    <MetricItem label="AI Latency" value="840ms" />
                                    <MetricItem label="DB Throughput" value="12.4K req/s" />
                                    <MetricItem label="Network Uptime" value="99.99%" />
                                    <MetricItem label="Load Balancing" value="Active" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </main>
    );
}

function StatusCard({ title, icon: Icon, status, sub }: any) {
    return (
        <Card className="bg-zinc-900 border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/20 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="h-7 w-7" />
                </div>
                <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {status}
                </Badge>
            </div>
            <h4 className="text-xl font-bold text-white uppercase italic tracking-tighter leading-none mb-2">{title}</h4>
            <p className="text-zinc-500 text-xs font-medium">{sub}</p>
        </Card>
    )
}

function MetricItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">{label}</p>
            <p className="text-xl font-black text-white italic">{value}</p>
        </div>
    )
}
