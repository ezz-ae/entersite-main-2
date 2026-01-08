'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    MessageSquare, Users, Zap, Send, Phone, Clock, FileText, 
    CheckCircle2, AlertCircle, Sparkles, Loader2, Database,
    Smartphone, Network, Upload, Globe, DatabaseZap,
    ChevronRight,
    CreditCard,
    ChevronDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { ImportSmsContactsDialog } from './sms-import-contacts-dialog';
import { apiFetch } from '@/lib/apiFetch';

const READY_SEQUENCES = [
    {
        id: 'investor-nurture',
        name: '7-Day Investor Nurture',
        desc: '3 automated messages spaced over 7 days for maximum recall.',
        stats: '12% conversion',
        price: '$0.45 / lead'
    },
    {
        id: 'instant-hype',
        name: 'Instant Project Hype',
        desc: 'Mass broadcast to 1,000+ investors for new project launches.',
        stats: '98% open rate',
        price: '$0.05 / SMS'
    }
];

const throttleOptions = {
    250: '250 messages / day',
    500: '500 messages / day',
    1000: '1000 messages / day',
    9999: 'No limit'
}

type ThrottleOption = keyof typeof throttleOptions;

export function SmsCampaignDashboard() {
    const [useMasterPool, setUseMasterPool] = useState(true);
    const [selectedSequence, setSelectedSequence] = useState('investor-nurture');
    const [isDeploying, setIsDeploying] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importedContactsCount, setImportedContactsCount] = useState(0);
    const [throttle, setThrottle] = useState<ThrottleOption>(250);
    const { toast } = useToast();

    const handleDeploy = async () => {
        setIsDeploying(true);

        try {
            // Simulate API call to deploy the sequence
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Example: send a notification sms about the deployment
            await apiFetch('/api/sms/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: '+1234567890', // Internal notification
                    body: `The SMS sequence '${READY_SEQUENCES.find(s => s.id === selectedSequence)?.name}' has been deployed to ${useMasterPool ? 'Master Investor Pool' : `${importedContactsCount} imported contacts`}.`
                }),
            });

            toast({
                title: "Campaign Deployed!",
                description: "Your SMS sequence is now live and sending.",
            });

        } catch (error) {
            console.error("Deployment failed", error);
            toast({
                title: "Deployment Failed",
                description: "Could not start the SMS sequence. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeploying(false);
        }
    }

    const handleImportComplete = (count: number) => {
        setImportedContactsCount(count);
        setUseMasterPool(false); // Switch to imported contacts after a successful import
    };

    const selectedSegmentName = useMasterPool ? `Global HNW Investors (10K+)` : `Your Imported List (${importedContactsCount})`;

    return (
        <>
            <ImportSmsContactsDialog 
                open={showImportDialog} 
                onOpenChange={setShowImportDialog} 
                onImportComplete={handleImportComplete}
            />
            <div className="space-y-10 pb-20 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">VIP Broadcast Node</h1>
                        <p className="text-zinc-500 text-lg font-light">Precision SMS & WhatsApp delivery to global investor lists.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-white/10 rounded-full px-6 h-11 text-xs font-bold gap-2 uppercase tracking-widest text-zinc-400 hover:text-white" onClick={() => setShowImportDialog(true)}>
                            <Upload className="h-4 w-4" /> Import CSV / Drive
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Configuration side */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Master Data Pool Toggle */}
                        <Card className={cn(
                            "bg-zinc-900 border-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden",
                            useMasterPool ? "border-green-600 shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)]" : "border-white/5"
                        )}>
                            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0",
                                    useMasterPool ? "bg-green-600 text-white" : "bg-white/5 text-zinc-600"
                                )}>
                                    <DatabaseZap className="h-10 w-10" />
                                </div>
                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">EntreSite Lead Machine</h3>
                                        <Badge className="bg-green-500/20 text-green-400 border-0 text-[8px] font-black uppercase tracking-widest">Premium Node</Badge>
                                    </div>
                                    <p className="text-zinc-500 font-medium">Rent access to our verified pool of <span className="text-white">10,000+ active UAE investors</span>.</p>
                                </div>
                                <Button 
                                    onClick={() => setUseMasterPool(!useMasterPool)}
                                    variant={useMasterPool ? "default" : "outline"}
                                    className={cn(
                                        "h-14 px-8 rounded-2xl font-bold",
                                        useMasterPool ? "bg-white text-black hover:bg-zinc-200" : "border-white/10 text-zinc-400"
                                    )}
                                >
                                    {useMasterPool ? "Data Locked" : "Unlock Data"}
                                </Button>
                            </div>
                        </Card>

                        {/* Sequence Library */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                                    <Zap className="h-4 w-4 text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">Ready Sequences</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {READY_SEQUENCES.map(seq => (
                                    <button
                                        key={seq.id}
                                        onClick={() => setSelectedSequence(seq.id)}
                                        className={cn(
                                            "p-8 rounded-[2rem] border text-left transition-all group relative overflow-hidden",
                                            selectedSequence === seq.id ? "bg-zinc-950 border-blue-600 shadow-xl" : "bg-zinc-900 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-xl font-bold text-white">{seq.name}</h4>
                                                <Badge className="bg-blue-600/10 text-blue-500 border-0 text-[8px] font-black uppercase">{seq.stats}</Badge>
                                            </div>
                                            <p className="text-sm text-zinc-500 leading-relaxed">{seq.desc}</p>
                                            <div className="pt-4 flex items-center justify-between">
                                                <p className="text-lg font-black text-white">{seq.price}</p>
                                                <ChevronRight className={cn("h-5 w-5 transition-transform", selectedSequence === seq.id ? "text-blue-500 translate-x-1" : "text-zinc-700")} />
                                            </div>
                                        </div>
                                        {selectedSequence === seq.id && <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 bg-zinc-950 border border-white/5 rounded-[2.5rem] space-y-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Select Segment</label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full h-14 bg-black border-white/10 rounded-2xl flex items-center justify-between px-4 text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-4 w-4 text-zinc-600" /> 
                                                    {selectedSegmentName}
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-zinc-600" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuItem onSelect={() => setUseMasterPool(true)}>Global HNW Investors (10K+)</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setUseMasterPool(false)} disabled={importedContactsCount === 0}>
                                                Your Imported List ({importedContactsCount})
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Daily Throttle</label>
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full h-14 bg-black border-white/10 rounded-2xl flex items-center justify-between px-4 text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-4 w-4 text-zinc-600" /> 
                                                    {throttleOptions[throttle]}
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-zinc-600" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuItem onSelect={() => setThrottle(250)}>{throttleOptions[250]}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setThrottle(500)}>{throttleOptions[500]}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setThrottle(1000)}>{throttleOptions[1000]}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setThrottle(9999)}>{throttleOptions[9999]}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleDeploy}
                                disabled={isDeploying || (!useMasterPool && importedContactsCount === 0)}
                                className="w-full h-20 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl shadow-2xl hover:scale-[1.01] transition-transform gap-4"
                            >
                                {isDeploying ? <Loader2 className="h-8 w-8 animate-spin" /> : <><CreditCard className="h-7 w-7" /> Deploy VIP Broadcast</>}
                            </Button>
                        </div>
                    </div>

                    {/* Live Preview / Stats side */}
                    <div className="space-y-8">
                        <Card className="bg-zinc-900 border-white/5 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 border-b border-white/5">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preview Sequence</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-8 space-y-6">
                                    <SmsBubble text="Hi {name}, our Master Node flagged you for exclusive access to the Creek Beach launch. 5 units left." />
                                    <SmsBubble text="Reply ROI for the yield analysis report." isSystem />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-8 rounded-[2.5rem] bg-blue-600 border border-blue-500 shadow-2xl text-white space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <Network className="h-6 w-6" />
                                </div>
                                <Badge className="bg-black/20 text-white border-0 text-[8px] font-black uppercase tracking-widest">Active Sync</Badge>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">Master Node Verified</h4>
                                <p className="text-sm opacity-80 mt-1">Every recipient has a verified history of property interest in the last 90 days.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

function SmsBubble({ text, isSystem = false }: { text: string; isSystem?: boolean }) {
    return (
        <div className={cn(
            "p-5 rounded-2xl text-xs leading-relaxed max-w-[90%]",
            isSystem ? "bg-blue-600 text-white ml-auto rounded-tr-none shadow-lg" : "bg-black/40 border border-white/5 text-zinc-300 rounded-tl-none"
        )}>
            {text}
            <div className={cn("text-[8px] font-black uppercase tracking-widest mt-2 opacity-40", isSystem ? "text-right" : "text-left")}>10:42 AM</div>
        </div>
    )
}
