
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiFetch';

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

export function DomainDashboard() {
  const [domain, setDomain] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationRecords, setVerificationRecords] = useState<DnsRecord[]>([]);
  const { toast } = useToast();
  const [sites, setSites] = useState<any[]>([]);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await apiFetch('/api/sites');
        const data = await res.json();
        if (res.ok) {
          setSites(data);
        }
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };
    fetchSites();
  }, []);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationRecords([]);
    try {
      const res = await apiFetch('/api/domain/vercel', { 
        method: 'POST',
        body: JSON.stringify({ domain })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'pending_verification') {
          setVerificationRecords(data.records);
          toast({ title: "Verification Initiated", description: "Please add the following DNS records to your domain provider." });
        } else {
            toast({ title: "Error", description: data.message || "An unexpected error occurred.", variant: 'destructive' });
        }
      } else {
        toast({ title: "Verification Failed", description: data.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    toast({ title: "Copied!", description: `Copied '${val}' to clipboard.` });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic">Domain Dashboard</h2>
          <p className="text-zinc-500">Manage your domains and connect them to your Vercel projects.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">
             <Zap className="h-3 w-3 mr-1.5" /> Powered by Vercel
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
           {/* Section 1: Your Sites */}
           <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Globe className="h-6 w-6 text-purple-500" />
                        Your Live Sites
                    </CardTitle>
                    <CardDescription>Domains you have connected to your account.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <div className="space-y-4">
                        {sites.map((site) => (
                            <div key={site.name} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-2.5 h-2.5 rounded-full", site.status === 'live' ? 'bg-green-500' : 'bg-yellow-500')} />
                                    <p className="font-bold text-white">{site.name}</p>
                                </div>
                                <a href={`http://${site.name}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Visit
                                </Button>
                                </a>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

           {/* Section 2: External Domain */}
           <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Globe className="h-6 w-6 text-blue-500" />
                    Connect External Domain
                 </CardTitle>
                 <CardDescription>Already own a domain? Connect it to your Vercel project.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="flex gap-3">
                    <Input 
                        placeholder="e.g. miamiluxury.com" 
                        className="bg-black/40 border-white/10 h-14 text-lg rounded-2xl text-white"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                    />
                    <Button 
                        onClick={handleVerify}
                        disabled={!domain || isVerifying}
                        className="h-14 px-8 bg-white text-black font-bold rounded-2xl min-w-[140px]"
                    >
                        {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
                    </Button>
                 </div>
                 
                 {verificationRecords.length > 0 && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-4 border-t border-white/5"
                     >
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Required DNS Records for Vercel</p>
                        <div className="grid grid-cols-1 gap-3">
                            {verificationRecords.map((record, index) => (
                                <DnsRecordRow key={index} type={record.type} name={record.name} value={record.value} onCopy={copyValue} />
                            ))}
                        </div>
                     </motion.div>
                 )}
              </CardContent>
           </Card>
        </div>

        {/* Info Column */}
        <div className="space-y-8">
           <Card className="bg-blue-600 border-none text-white overflow-hidden rounded-[2.5rem] relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Globe className="h-40 w-40" />
              </div>
              <CardHeader className="p-8">
                 <CardTitle className="text-2xl font-bold italic uppercase">Powered by Vercel</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6 relative z-10">
                 <p className="text-blue-100 text-lg font-light leading-relaxed">
                    Custom domains on our platform are powered by Vercel's robust infrastructure, ensuring optimal performance and reliability.
                 </p>
                 <div className="space-y-4 pt-4 border-t border-blue-500">
                    <FeatureItem text="Global Edge Network" />
                    <FeatureItem text="Automatic HTTPS" />
                    <FeatureItem text="Continuous Deployment" />
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

function DnsRecordRow({ type, name, value, onCopy }: any) {
    return (
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex flex-col items-center justify-center border border-white/5">
                    <span className="text-[10px] font-black text-blue-500 uppercase">{type}</span>
                </div>
                <div className="flex gap-10">
                    <div>
                        <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Host</p>
                        <p className="text-sm font-mono text-white">{name}</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Value</p>
                        <p className="text-sm font-mono text-white truncate max-w-[120px]">{value}</p>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="text-zinc-600 group-hover:text-white" onClick={() => onCopy(value)}>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
    )
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 text-blue-300" />
            <span className="uppercase tracking-widest">{text}</span>
        </div>
    )
}
