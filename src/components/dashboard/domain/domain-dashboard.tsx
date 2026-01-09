
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
import { authorizedFetch } from '@/lib/auth-fetch';

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

export function DomainDashboard() {
  const [domain, setDomain] = useState('');
  const [purchaseDomain, setPurchaseDomain] = useState('');
  const [purchaseProvider, setPurchaseProvider] = useState<'namecheap' | 'vercel'>('namecheap');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [verificationRecords, setVerificationRecords] = useState<DnsRecord[]>([]);
  const { toast } = useToast();
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await authorizedFetch('/api/sites');
        const data = await res.json();
        if (res.ok) {
          const siteList = data.sites || [];
          setSites(siteList);
          if (!selectedSiteId && siteList.length) {
            setSelectedSiteId(siteList[0].id);
          }
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
      const res = await authorizedFetch('/api/domains', { 
        method: 'POST',
        body: JSON.stringify({ domain, siteId: selectedSiteId || undefined })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.records?.length) {
          setVerificationRecords(data.records);
          toast({ title: "Connection started", description: "Add these two lines where you bought your web address to connect your site." });
          try {
            const refresh = await authorizedFetch('/api/sites');
            const refreshData = await refresh.json();
            if (refresh.ok) {
              setSites(refreshData.sites || []);
            }
          } catch (refreshError) {
            console.error('Failed to refresh sites', refreshError);
          }
        } else {
          toast({ title: "Connected", description: "Connection request sent. Updates may take a few minutes." });
        }
      } else {
        toast({ title: "Connection failed", description: data.error || data.message || "Could not connect web address.", variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const res = await authorizedFetch('/api/domains/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: purchaseDomain,
          provider: purchaseProvider,
          siteId: selectedSiteId || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: 'Request sent',
          description: 'We will buy the web address and connect it to your site.',
        });
        setPurchaseDomain('');
      } else {
        toast({
          title: 'Request failed',
          description: data.error || data.message || 'Could not submit the request.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsPurchasing(false);
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
          <h2 className="text-3xl font-bold tracking-tight text-white uppercase italic">Web Addresses</h2>
          <p className="text-zinc-500">Connect your web address to your site.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1">
             <Zap className="h-3 w-3 mr-1.5" /> Fast hosting included
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
                    <CardDescription>Your published and draft sites.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <div className="space-y-4">
                        {sites.length === 0 ? (
                          <p className="text-sm text-zinc-500">No sites yet. Build your first site to connect a web address.</p>
                        ) : (
                          sites.map((site) => (
                              <div key={site.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                                  <div className="flex items-center gap-4">
                                      <div className={cn("w-2.5 h-2.5 rounded-full", site.published ? 'bg-green-500' : 'bg-yellow-500')} />
                                      <div>
                                        <p className="font-bold text-white">{site.title}</p>
                                        <p className="text-xs text-zinc-500">{site.url || 'Draft not published yet'}</p>
                                      </div>
                                  </div>
                                  {site.url ? (
                                    <a href={site.url} target="_blank" rel="noopener noreferrer">
                                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          Visit
                                      </Button>
                                    </a>
                                  ) : (
                                    <Button variant="ghost" size="sm" className="text-zinc-600" disabled>
                                      Draft
                                    </Button>
                                  )}
                              </div>
                          ))
                        )}
                    </div>
                </CardContent>
            </Card>

           {/* Section 2: External Domain */}
           <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <Globe className="h-6 w-6 text-blue-500" />
                    Connect a Web Address
                 </CardTitle>
                 <CardDescription>Already own a web address? Connect it to your site.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Choose Site</p>
                    <select
                        className="w-full h-12 bg-black/40 border border-white/10 rounded-2xl px-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={selectedSiteId}
                        onChange={(e) => setSelectedSiteId(e.target.value)}
                    >
                        {sites.map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.title || site.name || site.id}
                          </option>
                        ))}
                    </select>
                 </div>
                 <div className="flex gap-3">
                    <Input 
                        placeholder="e.g. miamiluxury.com" 
                        className="bg-black/40 border-white/10 h-14 text-lg rounded-2xl text-white"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                    />
                    <Button 
                        onClick={handleVerify}
                        disabled={!domain || isVerifying || !selectedSiteId}
                        className="h-14 px-8 bg-white text-black font-bold rounded-2xl min-w-[140px]"
                    >
                        {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : "Connect"}
                    </Button>
                 </div>
                 
                 {verificationRecords.length > 0 && (
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-4 border-t border-white/5"
                     >
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Add these two lines</p>
                        <div className="grid grid-cols-1 gap-3">
                            {verificationRecords.map((record, index) => (
                                <DnsRecordRow key={index} type={record.type} name={record.name} value={record.value} onCopy={copyValue} />
                            ))}
                        </div>
                     </motion.div>
                 )}
              </CardContent>
           </Card>

           {/* Section 3: Buy a Domain */}
           <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    Buy a Web Address
                 </CardTitle>
                 <CardDescription>We will buy it for you and connect it to your site.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Delivery Speed</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-12 rounded-xl border-white/10 bg-black/40 text-sm font-semibold",
                          purchaseProvider === 'namecheap'
                            ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                            : "text-zinc-400"
                        )}
                        onClick={() => setPurchaseProvider('namecheap')}
                        disabled={isPurchasing}
                      >
                        Standard
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-12 rounded-xl border-white/10 bg-black/40 text-sm font-semibold",
                          purchaseProvider === 'vercel'
                            ? "border-blue-500/60 bg-blue-500/10 text-blue-300"
                            : "text-zinc-400"
                        )}
                        onClick={() => setPurchaseProvider('vercel')}
                        disabled={isPurchasing}
                      >
                        Priority
                      </Button>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Choose Site</p>
                    <select
                        className="w-full h-12 bg-black/40 border border-white/10 rounded-2xl px-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={selectedSiteId}
                        onChange={(e) => setSelectedSiteId(e.target.value)}
                    >
                        {sites.map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.title || site.name || site.id}
                          </option>
                        ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Web Address</p>
                    <Input 
                        placeholder="e.g. dubaihomefinder.com" 
                        className="bg-black/40 border-white/10 h-14 text-lg rounded-2xl text-white"
                        value={purchaseDomain}
                        onChange={(e) => setPurchaseDomain(e.target.value)}
                    />
                 </div>
                 <Button 
                    onClick={handlePurchase}
                    disabled={!purchaseDomain || isPurchasing || !selectedSiteId}
                    className="h-14 px-8 bg-white text-black font-bold rounded-2xl w-full"
                 >
                    {isPurchasing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Buy for me"}
                 </Button>
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
                 <CardTitle className="text-2xl font-bold italic uppercase">Fast Hosting Included</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6 relative z-10">
                 <p className="text-blue-100 text-lg font-light leading-relaxed">
                    Your custom web address runs on fast hosting so your site stays quick and secure.
                 </p>
                 <div className="space-y-4 pt-4 border-t border-blue-500">
                    <FeatureItem text="Fast worldwide delivery" />
                    <FeatureItem text="Secure browsing" />
                    <FeatureItem text="Instant updates" />
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
                        <p className="text-[8px] font-black text-zinc-600 uppercase mb-1 tracking-widest">Name</p>
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
