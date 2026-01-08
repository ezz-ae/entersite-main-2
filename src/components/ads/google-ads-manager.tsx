'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
    CheckCircle2, TrendingUp, MousePointerClick, Eye, Globe, 
    Target, Loader2, BarChart3, MapPin, Zap, 
    Sparkles, CreditCard, Lock
} from "lucide-react";
import { GenerateAdsOutput } from "@/ai/flows/generate-ads-from-page-content";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { authorizedFetch } from "@/lib/auth-fetch";

interface PrefillPlan {
  id?: string;
  summary?: string;
  prompt?: string;
  locationCity?: string;
  projectName?: string;
  audience?: string | null;
  createdAt?: string;
  adCampaignConfig?: {
    budget?: number;
    keywords?: string[];
  };
}

type AdsTab = 'setup' | 'creative' | 'keywords';

interface GoogleAdsManagerProps {
  pageTitle: string;
  pageDescription: string;
  userEmail?: string; 
  prefillPlan?: PrefillPlan;
  prefillResetKey?: number;
  onPrefillReset?: () => void;
  initialTab?: AdsTab;
}

type CampaignStatus = 'draft' | 'generating' | 'funding' | 'active' | 'completed';

export function GoogleAdsManager({
  pageTitle,
  pageDescription,
  prefillPlan,
  prefillResetKey = 0,
  onPrefillReset,
  initialTab = 'setup',
}: GoogleAdsManagerProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<CampaignStatus>('draft');
  const [activeTab, setActiveTab] = useState<AdsTab>(initialTab);
  const [isLaunching, setIsLaunching] = useState(false);
  const [prefillApplied, setPrefillApplied] = useState(false);
  const [appliedPlanId, setAppliedPlanId] = useState<string | null>(null);
  
  // Campaign Settings
  const [budget, setBudget] = useState([50]); // Daily
  const [duration, setDuration] = useState([30]); // Days
  const [location, setLocation] = useState("Dubai, UAE");
  
  // AI Generated Content
  const [adData, setAdData] = useState<GenerateAdsOutput | null>(null);
  const [selectedVariation, setSelectedVariation] = useState(0);

  // Performance Mock Data
  const performance = {
      impressions: 12500,
      clicks: 480,
      ctr: 3.8,
      spend: 145.50,
      leads: 18,
      cpl: 8.08,
      roas: 4.5,
      qualityScore: 9
  };

  const handleGenerate = async () => {
      setStatus('generating');
      setTimeout(() => {
          setAdData({
            variations: [
                { id: "v1", headlines: ["Luxury Marina Apartments", "Flexible Payment Plan"], descriptions: ["Own a piece of the Dubai skyline. Book your viewing today.", "Exclusive waterfront living with world-class amenities."] },
                { id: "v2", headlines: ["Invest in Dubai Marina", "Investor-Friendly Options"], descriptions: ["Prime location with strong rental demand. Perfect for investors.", "Secure your unit with flexible payment options."] }
            ],
            keywordGroups: [
                { category: "High Intent", keywords: ["buy apartment dubai marina", "luxury flats for sale dubai", "emaar beachfront sale"] },
                { category: "Investment", keywords: ["dubai property investment", "real estate roi dubai"] }
            ],
            estimatedCpc: 1.25
          });
          setStatus('draft');
      }, 2000);
  };

  const handleFundCampaign = async () => {
      setStatus('funding');
      // Simulate Payment
      setTimeout(() => {
          handleLaunch();
      }, 2000);
  }

  const handleLaunch = async () => {
      try {
          setIsLaunching(true);
          const payload = {
              name: `${pageTitle} Launch`,
              budget: budget[0],
              duration: duration[0],
              location,
              variation: adData?.variations?.[selectedVariation],
          };
          const response = await authorizedFetch('/api/ads/google/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
          });
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data?.error || 'Sync failed');
          }
          setStatus('active');
          toast({
              title: "Campaign Funded & Active!",
              description: `Campaign is now live in your ads dashboard.`,
          });
      } catch (error: any) {
          toast({
              title: 'Failed to launch',
              description: error?.message || 'Please sign in again.',
              variant: 'destructive',
          });
          setStatus('draft');
      } finally {
          setIsLaunching(false);
      }
  };

  const estimatedReach = Math.floor(budget[0] * 1200); 
  const estimatedClicks = Math.floor(estimatedReach * 0.035);

  useEffect(() => {
      setActiveTab(initialTab ?? 'setup');
  }, [initialTab]);

  useEffect(() => {
      if (!prefillPlan) {
          setPrefillApplied(false);
          setAppliedPlanId(null);
          return;
      }
      const planId = prefillPlan.id ?? null;
      if (planId && planId === appliedPlanId) return;
      
      if (prefillPlan.adCampaignConfig?.budget) {
          setBudget([prefillPlan.adCampaignConfig.budget]);
      }
      if (prefillPlan.locationCity) {
          setLocation(prefillPlan.locationCity);
      }
      const keywords = prefillPlan.adCampaignConfig?.keywords || [];
      if (keywords.length || prefillPlan.summary) {
          setAdData({
              variations: [
                  {
                      id: planId || 'prefill',
                      headlines: keywords.slice(0, 2).length ? keywords.slice(0, 2) : ['AI Generated Campaign'],
                      descriptions: [prefillPlan.summary || pageDescription],
                  },
              ],
              keywordGroups: keywords.length ? [{ category: 'AI Plan', keywords }] : [],
              estimatedCpc: 1.25,
          });
      }
      setPrefillApplied(true);
      setAppliedPlanId(planId);
  }, [prefillPlan, appliedPlanId, pageDescription]);

  if (status === 'funding' || isLaunching) {
      return (
          <div className="h-[400px] flex flex-col items-center justify-center bg-zinc-950 rounded-[3rem] border border-white/5 space-y-8">
               <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin relative z-10" />
               </div>
               <div className="text-center">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Processing Payment...</h3>
                    <p className="text-zinc-500 text-sm font-medium mt-2">Setting up your ad account...</p>
               </div>
          </div>
      )
  }

  if (status === 'active') {
      return (
          <div className="space-y-6">
              <div className="flex justify-between items-center bg-blue-600/10 p-6 rounded-[2rem] border border-blue-500/20">
                  <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                      </div>
                      <div>
                          <h3 className="font-bold text-white text-lg tracking-tight">Campaign Active: {pageTitle}</h3>
                          <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Managed Placement • High Health</p>
                      </div>
                  </div>
                  <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Live</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <MetricCard label="Impressions" value={performance.impressions.toLocaleString()} icon={Eye} />
                   <MetricCard label="Clicks" value={performance.clicks} icon={MousePointerClick} />
                   <MetricCard label="Leads" value={performance.leads} icon={CheckCircle2} highlight />
                   <MetricCard label="Spent" value={`$${performance.spend}`} icon={Target} />
              </div>

              <Card className="bg-zinc-900/50 border-white/5 rounded-[2.5rem]">
                  <CardHeader>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-500">Live Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[150px] flex items-end gap-1 pb-4 px-8">
                      {[40, 65, 80, 50, 90, 100, 85, 95, 120, 110].map((h, i) => (
                          <div key={i} className="flex-1 bg-blue-500/20 rounded-t-lg" style={{ height: `${h}%` }} />
                      ))}
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <Card className="w-full border-white/5 bg-zinc-950 rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/5">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-3xl font-bold tracking-tight text-white">Ad Setup Center</CardTitle>
                    <CardDescription className="text-zinc-500 text-lg">Managed Google Ads placement for {pageTitle}.</CardDescription>
                </div>
                {adData && <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Smart Strategy Active</Badge>}
            </div>
        </CardHeader>
        
        <CardContent className="p-10">
            {status === 'generating' ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] animate-pulse">Finding High-Intent Keywords...</p>
                </div>
            ) : !adData ? (
                 <div className="space-y-6">
                     <div className="grid gap-6 p-12 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-center">
                         <div className="mx-auto w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center border border-blue-500/20">
                             <Zap className="h-8 w-8 text-blue-500" />
                         </div>
                         <div className="space-y-2">
                             <h3 className="font-bold text-2xl text-white">Quick Launch</h3>
                             <p className="text-zinc-500 max-w-md mx-auto">We will draft a campaign for you. No Google Ads experience needed.</p>
                         </div>
                         
                         <div className="max-w-xs mx-auto space-y-4 text-left w-full">
                             <div className="space-y-2">
                                 <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Location</Label>
                                 <div className="flex gap-2 relative">
                                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-zinc-600" />
                                    <Input value={location} onChange={(e) => setLocation(e.target.value)} className="pl-12 h-12 bg-black border-white/10 rounded-xl" />
                                 </div>
                             </div>
                             <Button onClick={handleGenerate} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl">
                                 <Sparkles className="h-5 w-5 mr-2" /> Generate Draft
                             </Button>
                         </div>
                     </div>
                 </div>
            ) : (
                <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as AdsTab)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-10 bg-black/40 p-1.5 rounded-2xl h-14">
                        <TabsTrigger value="setup" className="rounded-xl data-[state=active]:bg-zinc-800 font-bold">1. Budget</TabsTrigger>
                        <TabsTrigger value="creative" className="rounded-xl data-[state=active]:bg-zinc-800 font-bold">2. Strategy</TabsTrigger>
                        <TabsTrigger value="keywords" className="rounded-xl data-[state=active]:bg-zinc-800 font-bold">3. Keywords</TabsTrigger>
                    </TabsList>

                    <TabsContent value="setup" className="space-y-8 animate-in fade-in duration-300">
                        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-10">
                             <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <Label className="text-lg font-bold text-white">Daily Budget</Label>
                                    <span className="font-black text-3xl text-blue-500">${budget[0]}</span>
                                </div>
                                <Slider value={budget} min={20} max={1000} step={10} onValueChange={setBudget} className="py-4" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-white/5 rounded-3xl text-center border border-white/5">
                                    <div className="text-3xl font-black text-white">{estimatedReach.toLocaleString()}</div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Daily Impressions</p>
                                </div>
                                <div className="p-6 bg-blue-600/10 rounded-3xl text-center border border-blue-500/20">
                                    <div className="text-3xl font-black text-blue-500">{estimatedClicks}</div>
                                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Est. Daily Clicks</p>
                                </div>
                            </div>
                            
                            <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold" onClick={() => setActiveTab("creative")}>
                                Review Strategy <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="creative" className="space-y-8">
                         <div className="p-8 bg-white text-black rounded-[2rem] shadow-2xl max-w-xl mx-auto font-sans relative">
                            <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-0 text-[8px] font-black uppercase">EntreSite Managed</Badge>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-black text-xs">Ad</span>
                                <span className="text-xs text-gray-400">entrestate.com/p/{pageTitle.toLowerCase().replace(/\s/g, '-')}</span>
                            </div>
                            <div className="text-xl text-[#1a0dab] font-medium mb-1">
                                {adData.variations[selectedVariation].headlines[0]} | {adData.variations[selectedVariation].headlines[1]}
                            </div>
                            <div className="text-sm text-[#4d5156]">
                                {adData.variations[selectedVariation].descriptions[0]}
                            </div>
                        </div>
                        <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold" onClick={() => setActiveTab("keywords")}>
                            Next: Targeted Keywords <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </TabsContent>

                    <TabsContent value="keywords" className="space-y-8">
                        <div className="flex flex-wrap gap-3">
                            {adData.keywordGroups[0].keywords.map((k, i) => (
                                <Badge key={i} className="bg-white/5 border-white/10 text-zinc-300 px-4 py-2 rounded-full text-xs font-medium">
                                    {k}
                                </Badge>
                            ))}
                        </div>
                        
                        <div className="p-10 bg-blue-600 rounded-[2.5rem] text-white">
                             <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Total Budget</p>
                                    <p className="text-5xl font-black">${(budget[0] * 30).toLocaleString()}</p>
                                    <p className="text-xs font-bold opacity-60 mt-1">First 30 days of placement</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Est. Qualified Leads</p>
                                    <p className="text-5xl font-black">~{Math.floor(estimatedClicks * 0.08 * 30)}</p>
                                </div>
                             </div>
                             <Button onClick={handleFundCampaign} className="w-full h-20 rounded-[1.5rem] bg-white text-blue-600 font-black text-2xl shadow-2xl hover:scale-[1.02] transition-transform">
                                <CreditCard className="mr-3 h-6 w-6" /> Confirm & Launch
                             </Button>
                             <div className="mt-6 flex items-center justify-center gap-6 opacity-60">
                                <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><Lock className="h-3 w-3" /> PCI Compliant</div>
                                <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest"><Target className="h-3 w-3" /> Campaign Sync</div>
                             </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </CardContent>
    </Card>
  );
}

function MetricCard({ label, value, icon: Icon, highlight }: any) {
    return (
        <div className={cn(
            "p-6 rounded-3xl border flex flex-col justify-between",
            highlight ? "bg-blue-600/10 border-blue-500/20" : "bg-zinc-900 border-white/5"
        )}>
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
                <Icon className={cn("h-4 w-4", highlight ? "text-blue-500" : "text-zinc-700")} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    )
}

function ChevronRight(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg> }
