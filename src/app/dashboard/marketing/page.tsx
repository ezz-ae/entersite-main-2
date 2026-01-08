'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, PieChart, DollarSign, Plus, Loader2, TrendingUp } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useToast } from '@/hooks/use-toast';

// Enhanced Components
import { GoogleAdsManager } from '@/components/ads/google-ads-manager';
import { SeoManager } from '@/components/seo/seo-manager';
import { MetricCard } from '@/components/dashboard/metric-card';
import { EmailCampaignDashboard } from '@/components/messaging/email-dashboard';
import { SmsCampaignDashboard } from '@/components/messaging/sms-dashboard';
import { DEFAULT_MARKETING_METRICS } from '@/data/marketing-metrics';
import type { MarketingMetricsSnapshot } from '@/data/marketing-metrics';
import { fetchMarketingMetrics } from '@/lib/marketing';
import { fetchCampaigns } from '@/lib/ads';
import { fetchMarketingPlans, StoredMarketingPlan } from '@/lib/marketing-plans';
import { useRouter } from 'next/navigation';

const GOOGLE_ADS_DRAFT_KEY = 'entrestate-google-ads-draft';

export default function MarketingDashboardPage() {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const router = useRouter();

  const [metrics, setMetrics] = useState<MarketingMetricsSnapshot>(DEFAULT_MARKETING_METRICS);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState(DEFAULT_MARKETING_METRICS.campaigns);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [plans, setPlans] = useState<StoredMarketingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const snapshot = await fetchMarketingMetrics(user.uid);
      if (isMounted) {
        setMetrics(snapshot);
        setLoading(false);
      }
    };
    load().catch((error) => {
      console.error(error);
      toast({
        title: 'Failed to load marketing data',
        description: 'Showing cached defaults for now.',
        variant: 'destructive',
      });
      if (isMounted) {
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user, toast]);

  useEffect(() => {
    let isMounted = true;
    const loadCampaigns = async () => {
      if (!user) return;
      setCampaignsLoading(true);
      const data = await fetchCampaigns();
      if (isMounted) {
        setCampaigns(data);
        setCampaignsLoading(false);
      }
    };
    loadCampaigns().catch((error) => {
      console.error(error);
      if (isMounted) {
        setCampaignsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const loadPlans = async () => {
      if (!user) return;
      setPlansLoading(true);
      const data = await fetchMarketingPlans();
      if (isMounted) {
        setPlans(data);
        setPlansLoading(false);
      }
    };
    loadPlans().catch((error) => {
      console.error(error);
      if (isMounted) {
        setPlansLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user]);

  const summaryCards = useMemo(() => {
    const { totals, currencySymbol } = metrics;
    const formatCurrency = (value: number) =>
      `${currencySymbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    const formatTrend = (value: number) =>
      `${value >= 0 ? '+' : ''}${(value * 100).toFixed(0)}%`;

    return [
      {
        title: 'Total Ad Spend',
        value: formatCurrency(totals.adSpend),
        trend: formatTrend(totals.adSpendChange),
        icon: DollarSign,
        positive: totals.adSpendChange >= 0,
      },
      {
        title: 'Cost Per Lead (CPL)',
        value: `${currencySymbol}${totals.cpl.toFixed(2)}`,
        trend: formatTrend(totals.cplChange),
        icon: BarChart,
        positive: totals.cplChange <= 0,
      },
      {
        title: 'Total Conversions',
        value: totals.conversions.toLocaleString(),
        trend: formatTrend(totals.conversionsChange),
        icon: PieChart,
        positive: totals.conversionsChange >= 0,
      },
      {
        title: 'Marketing ROAS',
        value: `${(totals.roas || 0).toFixed(2)}x`,
        trend: `${currencySymbol}${(totals.revenue || 0).toLocaleString()} revenue`,
        icon: TrendingUp,
        positive: (totals.roas || 0) >= 1,
      },
    ];
  }, [metrics]);

  const campaignList = campaigns ?? [];
  const recommendation = metrics.recommendations?.[0];

  return (
      <div className="space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Marketing Center</h1>
                <p className="text-muted-foreground">Manage your paid campaigns, SEO, and lead generation channels.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline">Export Report</Button>
                <Button><Plus className="h-4 w-4 mr-2" />Create Campaign</Button>
            </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing live marketing performance...
          </div>
        )}

        {/* High Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card) => (
              <MetricCard
                key={card.title}
                title={card.title}
                value={card.value}
                trend={card.trend}
                icon={card.icon}
                positive={card.positive}
              />
            ))}
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
           <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
               <TabsTrigger value="campaigns">Google Ads</TabsTrigger>
               <TabsTrigger value="seo">SEO & Keywords</TabsTrigger>
               <TabsTrigger value="meta">Meta Ads</TabsTrigger>
               <TabsTrigger value="social">Social Media</TabsTrigger>
               <TabsTrigger value="email">Email</TabsTrigger>
               <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="plans">AI Plans</TabsTrigger>
           </TabsList>
            
            <TabsContent value="campaigns" className="mt-6 space-y-6">
                <div className="grid lg:grid-cols-3 gap-6 h-[800px]">
                     <Card className="lg:col-span-2 h-full overflow-hidden">
                        <CardContent className="p-6 h-full">
                            {/* We pass dummy data since this is a dashboard view */}
                            <GoogleAdsManager pageTitle="New Campaign" pageDescription="Describe your offer to generate ads..." />
                        </CardContent>
                    </Card>
                    
                    <div className="space-y-6">
                         <Card className="h-1/2">
                            <CardHeader>
                                <CardTitle>Active Campaigns</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {campaignList.map((c: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b last:border-0 pb-3 last:pb-0">
                                            <div>
                                                <p className="font-medium">{c.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                  {metrics.currencySymbol}
                                                  {c.dailyBudget}/day
                                                </p>
                                                {(c.conversions || c.roas) && (
                                                  <p className="text-[11px] text-muted-foreground mt-1">
                                                    {(c.conversions || 0).toLocaleString()} conversions
                                                    {typeof c.roas === 'number' ? ` • ${c.roas.toFixed(2)}x ROAS` : ''}
                                                  </p>
                                                )}
                                            </div>
                                            <Badge variant={c.status === 'Active' ? 'default' : 'secondary'} className="text-[10px]">{c.status}</Badge>
                                        </div>
                                    ))}
                                    {campaignsLoading && (
                                      <p className="text-xs text-muted-foreground">Syncing recent launches…</p>
                                    )}
                                    {!campaignsLoading && campaignList.length === 0 && (
                                      <p className="text-xs text-muted-foreground">No campaigns synced yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="h-[calc(50%-1.5rem)]">
                            <CardHeader>
                                <CardTitle>Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recommendation ? (
                                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-lg text-sm">
                                      <p className="font-medium text-yellow-800 dark:text-yellow-200">{recommendation.title}</p>
                                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">{recommendation.description}</p>
                                      {recommendation.actionLabel && (
                                        <Button size="sm" variant="outline" className="mt-2 h-7 text-xs bg-white dark:bg-black">
                                          {recommendation.actionLabel}
                                        </Button>
                                      )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-muted-foreground">No active recommendations.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="seo" className="mt-6">
                 <div className="grid lg:grid-cols-3 gap-6 h-[800px]">
                    <div className="lg:col-span-2 h-full">
                        <SeoManager />
                    </div>
                    <div>
                         <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Keyword Opportunities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <div className="space-y-4">
                                     {[
                                         { kw: "waterfront apartments dubai", vol: "High", comp: "Med" },
                                         { kw: "buy villa with crypto", vol: "Med", comp: "Low" },
                                         { kw: "golden visa property", vol: "High", comp: "High" },
                                     ].map((k, i) => (
                                         <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                             <div>
                                                 <p className="font-medium text-sm">{k.kw}</p>
                                                 <p className="text-xs text-muted-foreground">{k.vol} Vol • {k.comp} Comp</p>
                                             </div>
                                             <Button size="icon" variant="ghost" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
                                         </div>
                                     ))}
                                 </div>
                            </CardContent>
                        </Card>
                    </div>
                 </div>
            </TabsContent>

            <TabsContent value="meta">
                <Card>
                    <CardContent className="py-20 text-center">
                        <p className="text-muted-foreground">Meta Ads Manager Coming Soon...</p>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="social">
                <Card>
                    <CardContent className="py-20 text-center">
                        <p className="text-muted-foreground">Social Media Manager Coming Soon...</p>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="email" className="mt-6">
                <EmailCampaignDashboard />
            </TabsContent>

            <TabsContent value="sms" className="mt-6">
                <SmsCampaignDashboard />
            </TabsContent>

            <TabsContent value="plans" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Marketing Plans</CardTitle>
                        <CardDescription>Recent briefs generated by the Entrestate Marketing Architect.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {plansLoading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading marketing plans…
                            </div>
                        )}
                        {!plansLoading && plans.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No plans generated yet. Use the AI Marketing Architect to create your first brief.
                            </p>
                        )}
                        {!plansLoading && plans.map((plan) => (
                            <div key={plan.id} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{plan.audience || 'General Audience'}</span>
                                    <span>{new Date(plan.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-sm font-semibold">{plan.response?.text || 'Campaign Summary'}</p>
                                <div className="text-xs text-muted-foreground">
                                    Prompt: <span className="text-foreground">{plan.prompt}</span>
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        variant="outline"
                                        className="h-9 text-xs"
                                        onClick={() => {
                                            navigator.clipboard.writeText(plan.prompt || '');
                                            toast({ title: 'Prompt copied', description: 'Use this brief in the AI designer or Google Ads manager.' });
                                        }}
                                    >
                                        Copy Prompt
                                    </Button>
                                    <Button
                                        className="h-9 text-xs bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                sessionStorage.setItem(GOOGLE_ADS_DRAFT_KEY, JSON.stringify(plan));
                                            }
                                            router.push('/dashboard/google-ads?source=plan');
                                        }}
                                    >
                                        Launch Flow
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </div>
  );
}
