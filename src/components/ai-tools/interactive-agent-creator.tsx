'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Instagram, 
  Globe, 
  MessageSquare, 
  Check, 
  ExternalLink,
  Zap,
  Target,
  BrainCircuit,
  Plus,
  Loader2,
  Building2,
  FileText,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Database,
  User,
  Sparkles,
  Send,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
    role: 'user' | 'agent';
    text: string;
}

const MARKET_KNOWLEDGE = [
    { id: 'dubai', label: 'Dubai Market' },
    { id: 'abudhabi', label: 'Abu Dhabi Market' },
    { id: 'sharjah', label: 'Sharjah Market' },
    { id: 'rasalkhaimah', label: 'Ras Al Khaimah Market' },
];

export function InteractiveAgentCreator() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [agentName, setAgentName] = useState('Agent');
    const [agentTone, setAgentTone] = useState('Professional & Persuasive');
    const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['dubai']);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'agent', text: "Hi! I'm your Entrestate chat assistant. I'm ready to learn your listings and FAQs. Ask me anything about your projects or the Dubai market." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [instagramHandle, setInstagramHandle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        const history = [...messages, { role: 'user', text: userMsg }].slice(-6);
        try {
            const response = await fetch(`/api/bot/preview/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history,
                    context: `Agent Name: ${agentName}, Tone: ${agentTone}, Knowledge: ${selectedMarkets.join(', ')}`,
                })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'agent', text: data.reply || "I'm processing that market data now. How can I help with your property search?" }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'agent', text: "I can help with pricing, projects, or areas. What would you like to know?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestConnection = async () => {
        const handle = instagramHandle.trim();
        if (!handle) {
            toast({ title: 'Add your Instagram handle', variant: 'destructive' });
            return;
        }
        if (!user?.email) {
            toast({ title: 'Sign in to continue', description: 'We need your email to confirm the connection.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.displayName || 'Entrestate user',
                    email: user.email,
                    topic: 'Chat Assistant',
                    message: `Please connect Instagram for ${handle}. Markets: ${selectedMarkets.join(', ') || 'UAE'}.`,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error || 'Request failed');
            }
            toast({ title: 'Request sent', description: 'We will reach out shortly to connect your Instagram.' });
            setInstagramHandle('');
            setIsConnecting(false);
        } catch (error: any) {
            toast({
                title: 'Could not send',
                description: error?.message || 'Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMarket = (id: string) => {
        setSelectedMarkets(prev => 
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex h-[calc(100vh-120px)] w-full bg-[#030303] rounded-[3rem] border border-white/5 overflow-hidden relative shadow-2xl animate-in fade-in duration-700">
            
            {/* 1. COLLAPSIBLE SIDE MENU */}
            <div className={cn(
                "transition-all duration-500 border-r border-white/5 bg-zinc-950 flex flex-col",
                isSidebarOpen ? "w-80 md:w-96" : "w-0 overflow-hidden opacity-0 border-none"
            )}>
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Settings2 className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Assistant Settings</h3>
                        </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500" onClick={() => setIsSidebarOpen(false)}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-8 py-6">
                    <div className="space-y-10">
                        
                        {/* Identity Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-blue-500">
                                <User className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Assistant Details</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assistant Name</label>
                                    <Input 
                                        value={agentName}
                                        onChange={(e) => setAgentName(e.target.value)}
                                        className="bg-black border-white/10 h-11 rounded-xl text-white"
                                        placeholder="e.g. Agent Sarah"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tone</label>
                                    <select 
                                        value={agentTone}
                                        onChange={(e) => setAgentTone(e.target.value)}
                                        className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option>Professional & Persuasive</option>
                                        <option>Friendly & Helpful</option>
                                        <option>High-Energy Closer</option>
                                        <option>Luxury Concierge</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Knowledge Section */}
                        <div className="space-y-6">
                             <div className="flex items-center gap-2 text-emerald-500">
                                <Database className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Market Coverage</span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {MARKET_KNOWLEDGE.map((market) => (
                                    <div 
                                        key={market.id}
                                        onClick={() => toggleMarket(market.id)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                            selectedMarkets.includes(market.id) ? "bg-emerald-500/5 border-emerald-500/20" : "bg-black border-white/5 hover:bg-white/5"
                                        )}
                                    >
                                        <span className={cn("text-xs font-bold", selectedMarkets.includes(market.id) ? "text-white" : "text-zinc-500")}>
                                            {market.label}
                                        </span>
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center",
                                            selectedMarkets.includes(market.id) ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                                        )}>
                                            {selectedMarkets.includes(market.id) && <Check className="h-3 w-3 text-black stroke-[3px]" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conversion Section */}
                        <div className="pt-6 border-t border-white/5 space-y-6">
                            <div className="p-6 rounded-2xl bg-blue-600 text-white space-y-4">
                                <h4 className="font-bold leading-tight">Connect Instagram</h4>
                                <p className="text-[10px] opacity-80 leading-relaxed">We will connect your Instagram and turn on auto replies.</p>
                                <Button 
                                    className="w-full bg-white text-blue-600 font-bold hover:bg-zinc-100 rounded-xl h-12 gap-2"
                                    onClick={() => setIsConnecting(true)}
                                >
                                    <Instagram className="h-4 w-4" /> Connect Instagram
                                </Button>
                            </div>
                            
                            <div className="flex justify-center gap-4 py-2">
                                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-zinc-600">
                                    <ShieldCheck className="h-3 w-3 text-blue-500" /> Meta Official
                                </div>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-zinc-600">
                                    <Lock className="h-3 w-3 text-blue-500" /> SSL Secured
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>
            </div>

            {/* 2. MAIN CHAT INTERFACE */}
            <div className="flex-1 flex flex-col relative bg-zinc-900/20">
                
                {/* Header */}
                <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between backdrop-blur-xl bg-black/40">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                             <Button variant="ghost" size="icon" className="h-10 w-10 bg-white/5 text-white rounded-xl" onClick={() => setIsSidebarOpen(true)}>
                                <Settings2 className="h-5 w-5" />
                             </Button>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-black text-white italic uppercase tracking-tighter text-xl">{agentName}</h2>
                                <Badge className="bg-green-500/10 text-green-500 border-0 text-[8px] font-black uppercase">Online</Badge>
                            </div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-0.5">Your assistant is ready</p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Response Time</span>
                            <span className="text-xs font-bold text-zinc-400">&lt; 1.2 Seconds</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                            <Sparkles className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth"
                >
                    {messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex animate-in fade-in slide-in-from-bottom-2 duration-500",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}>
                            <div className={cn(
                                "max-w-[80%] md:max-w-[65%] p-6 rounded-3xl relative",
                                msg.role === 'user' 
                                    ? "bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20" 
                                    : "bg-zinc-900 border border-white/5 text-zinc-200 rounded-tl-none shadow-2xl"
                            )}>
                                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest mt-4 block opacity-40",
                                    msg.role === 'user' ? "text-right" : "text-left"
                                )}>
                                    {msg.role === 'user' ? 'Investor' : agentName} • 10:42 AM
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl rounded-tl-none">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce [animation-delay:-.3s]" />
                                    <div className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce [animation-delay:-.5s]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-8 pt-0">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                        <div className="relative flex items-center bg-zinc-950 border border-white/10 rounded-2xl p-2 gap-2 pr-4 shadow-2xl">
                            <input 
                                className="flex-1 bg-transparent border-none text-white px-6 h-14 focus:outline-none font-medium placeholder:text-zinc-600"
                                placeholder={`Ask ${agentName} anything about UAE property...`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button 
                                onClick={handleSendMessage}
                                disabled={isLoading || !input.trim()}
                                className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white p-0 shadow-lg shadow-blue-600/20"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mt-4">Powered by Entrestate</p>
                </div>

            </div>

            {/* 3. PAYMENT / ACCOUNT OVERLAY */}
            {isConnecting && (
                <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-in zoom-in duration-500">
                    <Card className="max-w-xl w-full bg-zinc-950 border-white/10 text-white rounded-[3rem] shadow-[0_0_100px_-20px_rgba(37,99,235,0.4)]">
                        <CardHeader className="p-12 text-center space-y-6">
                            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/20 rotate-12">
                                <Instagram className="h-12 w-12 text-white" />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black italic uppercase tracking-tighter">Connect Instagram</h3>
                                <p className="text-zinc-500 text-lg font-light mt-2">Share your handle and we will connect it for you.</p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 pt-0 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Instagram handle</label>
                                <Input
                                    value={instagramHandle}
                                    onChange={(e) => setInstagramHandle(e.target.value)}
                                    placeholder="@youragency"
                                    className="h-12 bg-black/40 border-white/10 text-white"
                                />
                            </div>

                            <Button
                                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-2xl"
                                onClick={handleRequestConnection}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Request Connection'}
                            </Button>

                            <div className="flex flex-col items-center gap-4">
                                <button
                                    className="text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:text-zinc-400 transition-colors"
                                    onClick={() => setIsConnecting(false)}
                                >
                                    Maybe Later
                                </button>
                                <div className="flex gap-6 opacity-40">
                                    <Lock className="h-5 w-5" />
                                    <Globe className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </div>
    );
}
