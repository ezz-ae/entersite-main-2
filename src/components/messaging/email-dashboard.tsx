'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Mail, Users, Zap, Send, Sparkles, 
    MousePointerClick, Eye, Clock, Image as ImageIcon,
    Loader2, DatabaseZap, Upload, ChevronRight, CreditCard, Network,
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
import { ImportContactsDialog } from './import-contacts-dialog';
import { apiFetch } from '@/lib/apiFetch';

const EMAIL_SEQUENCES = [
    {
        id: 'investor-welcome',
        name: 'HNW Investor Welcome',
        desc: '3-step high-impact sequence with ROI analysis and project brochure.',
        stats: '45% Open Rate',
        price: '$0.85 / lead'
    },
    {
        id: 'monthly-yield',
        name: 'Monthly Yield Report',
        desc: 'Automated newsletter showcasing the top 5 highest ROI projects this month.',
        stats: '32% Clicks',
        price: '$0.15 / Email'
    }
];

const deliverySpeeds = {
    drip: { name: 'Drip (1 message / 48h)', icon: Clock },
    instant: { name: 'Instant Blast', icon: Send },
}

type DeliverySpeed = keyof typeof deliverySpeeds;

export function EmailCampaignDashboard() {
    const [useMasterPool, setUseMasterPool] = useState(true);
    const [selectedSequence, setSelectedSequence] = useState('investor-welcome');
    const [isDeploying, setIsDeploying] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importedContactsCount, setImportedContactsCount] = useState(0);
    const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('drip');
    const { toast } = useToast();

    const handleDeploy = async () => {
        setIsDeploying(true);

        try {
            // Simulate API call to deploy the sequence
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Example: send a notification email about the deployment
            await apiFetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'team@example.com', // Internal notification
                    subject: `🚀 Email Sequence Deployed: ${selectedSequence}`,
                    body: `The sequence '${EMAIL_SEQUENCES.find(s => s.id === selectedSequence)?.name}' has been deployed to ${useMasterPool ? 'Master Investor Pool' : `${importedContactsCount} imported contacts`}.`
                }),
            });

            toast({
                title: "Campaign Deployed!",
                description: "Your email sequence is now live and sending.",
            });

        } catch (error) {
            console.error("Deployment failed", error);
            toast({
                title: "Deployment Failed",
                description: "Could not start the email sequence. Please try again.",
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

    const selectedSegmentName = useMasterPool ? `Verified Global HNW (10K+)` : `Imported Contacts (${importedContactsCount})`;
    const SelectedDeliveryIcon = deliverySpeeds[deliverySpeed].icon;

    return (
        <>
            <ImportContactsDialog 
                open={showImportDialog} 
                onOpenChange={setShowImportDialog} 
                onImportComplete={handleImportComplete}
            />
            <div className="space-y-10 pb-20 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Email Intelligence Node</h1>
                        <p className="text-zinc-500 text-lg font-light">Hyper-personalized investor sequences powered by Vertex AI.</p>
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
                            useMasterPool ? "border-blue-600 shadow-[0_0_50px_-10px_rgba(37,99,235,0.3)]" : "border-white/5"
                        )}>
                            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0",
                                    useMasterPool ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-600"
                                )}>
                                    <DatabaseZap className="h-10 w-10" />
                                </div>
                                <div className="flex-1 space-y-2 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Master Investor Pool</h3>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-0 text-[8px] font-black uppercase tracking-widest">Active Node</Badge>
                                    </div>
                                    <p className="text-zinc-500 font-medium">Broadcast to our network of <span className="text-white">10,000+ verified UAE property buyers</span>.</p>
                                </div>
                                <Button 
                                    onClick={() => setUseMasterPool(!useMasterPool)}
                                    variant={useMasterPool ? "default" : "outline"}
                                    className={cn(
                                        "h-14 px-8 rounded-2xl font-bold",
                                        useMasterPool ? "bg-white text-black hover:bg-zinc-200" : "border-white/10 text-zinc-400"
                                    )}
                                >
                                    {useMasterPool ? "Pool Active" : "Activate Pool"}
                                </Button>
                            </div>
                        </Card>

                        {/* Sequence Library */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                                    <Zap className="h-4 w-4 text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">AI Sequences</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {EMAIL_SEQUENCES.map(seq => (
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
                                            <DropdownMenuItem onSelect={() => setUseMasterPool(true)}>Verified Global HNW (10K+)</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setUseMasterPool(false)} disabled={importedContactsCount === 0}>
                                                Imported Contacts ({importedContactsCount})
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Delivery Speed</label>
                                <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full h-14 bg-black border-white/10 rounded-2xl flex items-center justify-between px-4 text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <SelectedDeliveryIcon className="h-4 w-4 text-zinc-600" /> 
                                                    {deliverySpeeds[deliverySpeed].name}
                                                </div>
                                                <ChevronDown className="h-4 w-4 text-zinc-600" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuItem onSelect={() => setDeliverySpeed('drip')}>Drip (1 message / 48h)</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => setDeliverySpeed('instant')}>Instant Blast</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={handleDeploy}
                                disabled={isDeploying || (!useMasterPool && importedContactsCount === 0)}
                                className="w-full h-20 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-2xl shadow-2xl hover:scale-[1.01] transition-transform gap-4"
                            >
                                {isDeploying ? <Loader2 className="h-8 w-8 animate-spin" /> : <><CreditCard className="h-7 w-7" /> Deploy Intelligence Sequence</>}
                            </Button>
                        </div>
                    </div>

                    {/* Right side: Preview */}
                    <div className="space-y-8">
                        <div className="bg-white text-black rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="bg-zinc-100 p-4 border-b flex items-center gap-2">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                                <div className="text-[10px] text-zinc-400 font-bold uppercase ml-2">Investor Preview</div>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="border-b pb-4">
                                    <h4 className="font-bold text-lg">Subject: {selectedSequence === 'investor-welcome' ? '🔥 8.4% ROI: Waterfront Launch Invite' : 'Monthly Yield Report: Oct 2024'}</h4>
                                    <p className="text-[10px] text-zinc-400 mt-1">From: Sarah, Advisor at EntreSite</p>
                                </div>
                                <p className="text-xs leading-relaxed text-zinc-600">
                                    Hi {`{Name}`},<br/><br/>
                                    Our Master Node flagged this project as a top-tier match for your previous interest in Dubai Marina. 
                                    <br/><br/>
                                    <strong>The Opportunity:</strong><br/>
                                    • Guaranteed 8% Net ROI<br/>
                                    • 5-Year Post-Handover Plan
                                </p>
                                <div className="pt-4">
                                    <div className="w-full h-10 bg-blue-600 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
                            <div className="flex items-center gap-3 text-blue-500">
                                <Sparkles className="h-5 w-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">AI Personalization Node</span>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                Every message is dynamically generated based on the recipient's <span className="text-white font-bold text-xs italic">Master Data Profile</span>.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
