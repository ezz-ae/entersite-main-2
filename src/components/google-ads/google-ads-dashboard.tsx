'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, MapPin, Wallet, CheckCircle2, Sparkles, BarChart3 } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Campaign = {
  id: string;
  name?: string;
  status?: string;
  location?: string;
  dailyBudget?: number;
  createdAt?: string;
  timeline?: string;
  startAt?: string;
  pausedAt?: string;
  resumedAt?: string;
};

type SiteSummary = {
  id: string;
  title?: string;
  published?: boolean;
  customDomain?: string | null;
  publishedUrl?: string | null;
  url?: string | null;
  refinerStatus?: string | null;
  lastRefinedAt?: string | null;
  lastPublishedAt?: string | null;
};

type BillingSummary = {
  subscription?: {
    monthlySpendCap?: number | null;
    monthlySpendUsed?: number;
    pauseWhenCapReached?: boolean;
    isPausedDueToSpendCap?: boolean;
    creditBalance?: number;
    paymentModel?: 'prepaid' | 'postpaid';
  };
};

type KeywordPlan = {
  term: string;
  competition?: string;
  volume?: number;
  cpc?: { low: number; high: number };
};

type Expectations = {
  dailyBudget: number;
  durationDays: number;
  totalSpend: number;
  cpcRange: { low: number; high: number };
  clicksRange: { low: number; high: number };
  leadsRange: { low: number; high: number };
  cplRange: { low: number; high: number };
};

type CampaignPlan = {
  keywords: KeywordPlan[];
  headlines: string[];
  descriptions: string[];
  expectations?: Expectations;
};

const DEFAULT_DURATION_DAYS = 30;
const ADMIN_ROLE_SET = new Set(['team_admin', 'agency_admin', 'super_admin']);

type GoogleAdsDashboardProps = { campaignId?: string };

function withCampaignAttribution(url: string, campaignId?: string) {
  if (!campaignId) return url;
  if (!url) return url;
  try {
    const u = new URL(url);
    // Standardize on campaignDocId (Campaign spine document id).
    if (!u.searchParams.get('campaignDocId')) {
      u.searchParams.set('campaignDocId', campaignId);
    }
    return u.toString();
  } catch {
    // If URL parsing fails (relative URL), fallback to simple append.
    const sep = url.includes('?') ? '&' : '?';
    return url.includes('campaignDocId=') ? url : `${url}${sep}campaignDocId=${encodeURIComponent(campaignId)}`;
  }
}

function resolveIsAdmin(claims: Record<string, any>) {
  const roles = Array.isArray(claims?.roles) ? claims.roles : [];
  const role = typeof claims?.role === 'string' ? [claims.role] : [];
  const normalized = [...roles, ...role].map((value) => String(value));
  return normalized.some((value) => ADMIN_ROLE_SET.has(value));
}

export function GoogleAdsDashboard({ campaignId }: GoogleAdsDashboardProps) {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [goal, setGoal] = useState('Leads');
  const [audience, setAudience] = useState('Home Buyers');
  const [language, setLanguage] = useState('English');
  const [intent, setIntent] = useState('Buy');
  const [unitType, setUnitType] = useState('Apartment');
  const [timeline, setTimeline] = useState('Start today');
  const [contactRoute, setContactRoute] = useState('Form');
  const [strategyPreset, setStrategyPreset] = useState('High Intent Buyers');
  const [location, setLocation] = useState('Dubai, UAE');
  const [budget, setBudget] = useState('150');
  const [duration, setDuration] = useState(String(DEFAULT_DURATION_DAYS));
  const [landingPage, setLandingPage] = useState('');
  const [landingMode, setLandingMode] = useState<'builder' | 'external'>('builder');
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [sites, setSites] = useState<SiteSummary[]>([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [publishingSiteId, setPublishingSiteId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [competitorIntercept, setCompetitorIntercept] = useState(false);
  const [negativeKeywordsPreset, setNegativeKeywordsPreset] = useState('None');
  const [schedulePreset, setSchedulePreset] = useState('Always on');
  const [deviceTargeting, setDeviceTargeting] = useState('All devices');
  const [languageTargeting, setLanguageTargeting] = useState('Match campaign language');
  const [callOnlyFallback, setCallOnlyFallback] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [updatingCampaignId, setUpdatingCampaignId] = useState<string | null>(null);
  const [plan, setPlan] = useState<CampaignPlan | null>(null);
  const [prefillApplied, setPrefillApplied] = useState(false);
  const [prefillOrigin, setPrefillOrigin] = useState<string | null>(null);
  const [prefillLanding, setPrefillLanding] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const numericBudget = Number(budget);
  const numericDuration = Number(duration);
  const isAdminUser = isAdmin === true;

  const campaignName = useMemo(() => {
    return `${goal} - ${location}`.trim();
  }, [goal, location]);

  useEffect(() => {
    let active = true;
    const loadRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        if (active) setIsAdmin(false);
        return;
      }
      try {
        const tokenResult = await user.getIdTokenResult();
        if (active) setIsAdmin(resolveIsAdmin(tokenResult.claims));
      } catch (error) {
        console.warn('Failed to resolve role claims', error);
        if (active) setIsAdmin(false);
      }
    };
    loadRole();
    return () => {
      active = false;
    };
  }, []);

  const loadCampaigns = async () => {
    try {
      const res = await authorizedFetch('/api/ads/google/campaigns', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load campaigns', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (prefillApplied) return;
    const landing = searchParams?.get('landing');
    const siteId = searchParams?.get('siteId');
    const origin = searchParams?.get('origin');
    const title = searchParams?.get('title');
    const description = searchParams?.get('description');
    const notesParam = searchParams?.get('notes');
    const locationParam = searchParams?.get('location');
    const audienceParam = searchParams?.get('audience');
    const intentParam = searchParams?.get('intent');
    const unitTypeParam = searchParams?.get('unitType');
    const languageParam = searchParams?.get('language');
    const goalParam = searchParams?.get('goal');
    const timelineParam = searchParams?.get('timeline');
    const contactRouteParam = searchParams?.get('contactRoute');
    const strategyPresetParam = searchParams?.get('strategyPreset');
    const budgetParam = searchParams?.get('budget');
    const durationParam = searchParams?.get('duration');

    let didPrefill = false;

    if (siteId) {
      setLandingMode('builder');
      setSelectedSiteId(siteId);
      didPrefill = true;
    } else if (landing) {
      setLandingMode('external');
      setLandingPage(landing);
      didPrefill = true;
    }
    if (origin) {
      setPrefillOrigin(origin);
      didPrefill = true;
    }
    if (landing) {
      setPrefillLanding(landing);
    }

    if (locationParam) {
      setLocation(locationParam);
      didPrefill = true;
    }
    if (audienceParam) {
      setAudience(audienceParam);
      didPrefill = true;
    }
    if (intentParam) {
      setIntent(intentParam);
      didPrefill = true;
    }
    if (unitTypeParam) {
      setUnitType(unitTypeParam);
      didPrefill = true;
    }
    if (languageParam) {
      setLanguage(languageParam);
      didPrefill = true;
    }
    if (goalParam) {
      setGoal(goalParam);
      didPrefill = true;
    }
    if (timelineParam) {
      setTimeline(timelineParam);
      didPrefill = true;
    }
    if (contactRouteParam) {
      setContactRoute(contactRouteParam);
      didPrefill = true;
    }
    if (strategyPresetParam) {
      setStrategyPreset(strategyPresetParam);
      didPrefill = true;
    }
    if (budgetParam && !Number.isNaN(Number(budgetParam))) {
      setBudget(String(budgetParam));
      didPrefill = true;
    }
    if (durationParam && !Number.isNaN(Number(durationParam))) {
      setDuration(String(durationParam));
      didPrefill = true;
    }

    const noteParts: string[] = [];
    if (origin) noteParts.push(`Origin: ${origin}`);
    if (title) noteParts.push(`Page: ${title}`);
    if (description) noteParts.push(description);
    if (notesParam) noteParts.push(notesParam);
    if (noteParts.length) {
      setNotes(noteParts.join('\n'));
      didPrefill = true;
    }

    if (didPrefill) setPrefillApplied(true);
  }, [prefillApplied, searchParams]);

  const loadSites = async () => {
    setSitesLoading(true);
    try {
      const res = await authorizedFetch('/api/sites', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setSites(data.sites || []);
      }
    } catch (error) {
      console.error('Failed to load sites', error);
    } finally {
      setSitesLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const loadBillingSummary = async () => {
    if (isAdmin === false) {
      setBillingLoading(false);
      return;
    }
    setBillingLoading(true);
    try {
      const res = await authorizedFetch('/api/billing/summary', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setBillingSummary(data || null);
      }
    } catch (error) {
      console.error('Failed to load billing summary', error);
    } finally {
      setBillingLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin === false) {
      setBillingLoading(false);
      return;
    }
    if (isAdmin === true) {
      loadBillingSummary();
    }
  }, [isAdmin]);

  useEffect(() => {
    const loadFromCampaign = async () => {
      if (!campaignId) return;
      try {
        const res = await authorizedFetch(`/api/campaigns/${campaignId}`, { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data?.campaign) {
          const url = data.campaign?.landing?.url;
          if (typeof url === 'string' && url && !landingPage) {
            setLandingPage(withCampaignAttribution(url, campaignId));
            setLandingMode('external');
            setSelectedSiteId('');
          }
        }
      } catch (e) {
        console.error('Failed to load campaign context', e);
      }
    };
    loadFromCampaign();
    // we only want to auto-fill once when campaignId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === selectedSiteId),
    [sites, selectedSiteId],
  );

  useEffect(() => {
    if (landingMode !== 'builder') return;
    if (selectedSiteId) return;
    if (landingPage.trim()) return;
    const firstPublished = sites.find((site) => site.published && site.url);
    if (firstPublished) {
      setSelectedSiteId(firstPublished.id);
      setLandingPage(firstPublished.url || '');
    }
  }, [landingMode, landingPage, selectedSiteId, sites]);


  const patchCampaignAds = async (payload: any) => {
    if (!campaignId) return;
    try {
      await authorizedFetch(`/api/campaigns/${campaignId}/bindings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bindings: { ads: { provider: 'google', ...payload } } }),
      });
    } catch (e) {
      console.warn('Failed to persist campaign ads bindings', e);
    }
  };

  const validateInputs = () => {
    if (
      !location.trim() ||
      !audience.trim() ||
      !intent.trim() ||
      !unitType.trim() ||
      !language.trim() ||
      !timeline.trim() ||
      !contactRoute.trim() ||
      Number.isNaN(numericBudget) ||
      numericBudget <= 0
    ) {
      toast({ title: 'Complete the Quick Details', variant: 'destructive' });
      return false;
    }
    if (Number.isNaN(numericDuration) || numericDuration <= 0) {
      toast({ title: 'Add a valid duration', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const resolveLandingPage = () => {
    if (landingMode === 'builder') {
      return selectedSite?.url || '';
    }
    return landingPage;
  };

  const validateLaunch = () => {
    if (!validateInputs()) return false;
    const resolvedLanding = resolveLandingPage();
    const subscription = billingSummary?.subscription;
    if (subscription?.isPausedDueToSpendCap) {
      toast({ title: 'Spend cap reached', description: 'Update billing to resume launches.', variant: 'destructive' });
      return false;
    }
    if (subscription?.paymentModel === 'prepaid' && (subscription.creditBalance ?? 0) <= 0) {
      toast({ title: 'Add wallet funds before launch', variant: 'destructive' });
      return false;
    }
    if (landingMode === 'builder') {
      if (!selectedSiteId) {
        toast({ title: 'Select a builder site before launch', variant: 'destructive' });
        return false;
      }
      if (!resolvedLanding.trim()) {
        toast({ title: 'Publish the selected site before launch', variant: 'destructive' });
        return false;
      }
      if (selectedSite && !selectedSite.published) {
        toast({ title: 'Publish the selected site before launch', variant: 'destructive' });
        return false;
      }
    }
    if (!resolvedLanding.trim()) {
      toast({ title: 'Attach a landing page before launch', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSelectSite = (siteId: string) => {
    setSelectedSiteId(siteId);
    const site = sites.find((item) => item.id === siteId);
    setLandingPage(site?.url || '');
  };

  const handleToggleCampaignStatus = async (campaign: Campaign) => {
    if (isAdmin === false) {
      toast({
        title: 'Admin access required',
        description: 'Only team admins can pause or resume campaigns.',
        variant: 'destructive',
      });
      return;
    }
    const currentStatus = campaign.status || 'Active';
    const nextStatus = currentStatus.toLowerCase() === 'paused' ? 'Active' : 'Paused';
    setUpdatingCampaignId(campaign.id);
    try {
      const res = await authorizedFetch(`/api/ads/google/campaigns/${campaign.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Update failed');
      }
      setCampaigns((prev) =>
        prev.map((item) => (item.id === campaign.id ? { ...item, status: nextStatus } : item)),
      );
      toast({ title: `Campaign ${nextStatus.toLowerCase()}` });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingCampaignId(null);
    }
  };

  const handlePublishSite = async (siteId: string) => {
    setPublishingSiteId(siteId);
    try {
      const res = await authorizedFetch('/api/publish/page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || 'Publish failed');
      }
      toast({ title: 'Site published', description: 'Landing page is ready for launch.' });
      await loadSites();
      if (data?.publishedUrl) {
        setLandingPage(data.publishedUrl);
      }
    } catch (error: any) {
      toast({
        title: 'Publish failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPublishingSiteId(null);
    }
  };

  const handleGeneratePlan = async () => {
    if (!validateInputs()) return;

    setPlanLoading(true);
    try {
      const resolvedLandingPage = resolveLandingPage();
          const effectiveLandingPage = resolvedLandingPage
            ? withCampaignAttribution(resolvedLandingPage, campaignId)
            : undefined;
      const res = await authorizedFetch('/api/ads/google/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          location,
          audience,
          intent,
          unitType,
          language,
          timeline,
          contactRoute,
          strategyPreset,
          advancedOptions: {
            competitorIntercept,
            negativeKeywordsPreset,
            schedulePreset,
            deviceTargeting,
            languageTargeting,
            callOnlyFallback,
          },
          budget: numericBudget,
          duration: numericDuration,
          landingPage: effectiveLandingPage,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Plan generation failed');
      }
      setPlan({
        keywords: data.keywords || [],
        headlines: data.headlines || [],
        descriptions: data.descriptions || [],
        expectations: data.expectations,
      });
      await patchCampaignAds({
        mode: 'ours',
        planDraft: {
          goal,
          location,
          audience,
          intent,
          unitType,
          language,
          timeline,
          contactRoute,
          strategyPreset,
          advancedOptions: {
            competitorIntercept,
            negativeKeywordsPreset,
            schedulePreset,
            deviceTargeting,
            languageTargeting,
            callOnlyFallback,
          },
          budget: numericBudget,
          duration: numericDuration,
          landingPage: effectiveLandingPage || resolvedLandingPage,
          notes,
          plan: {
            keywords: data.keywords || [],
            headlines: data.headlines || [],
            descriptions: data.descriptions || [],
            expectations: data.expectations,
          },
        },
      });
      toast({ title: 'Smart plan ready', description: 'Review the keywords and ad copy below.' });
    } catch (error: any) {
      toast({
        title: 'Plan failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPlanLoading(false);
    }
  };

  const handleLaunch = async () => {
    if (isAdmin === false) {
      toast({
        title: 'Admin access required',
        description: 'Only team admins can activate campaigns.',
        variant: 'destructive',
      });
      return;
    }
    if (!validateLaunch()) return;
    if (!plan) {
      toast({ title: 'Create the Smart plan first', variant: 'destructive' });
      return;
    }

    setLaunching(true);
    try {
      const resolvedLandingPage = resolveLandingPage();
      const effectiveLandingPage = resolvedLandingPage
        ? withCampaignAttribution(resolvedLandingPage, campaignId)
        : undefined;
      const res = await authorizedFetch('/api/ads/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          budget: numericBudget,
          duration: numericDuration,
          location,
          goal,
          audience,
          intent,
          unitType,
          language,
          timeline,
          contactRoute,
          strategyPreset,
          advancedOptions: {
            competitorIntercept,
            negativeKeywordsPreset,
            schedulePreset,
            deviceTargeting,
            languageTargeting,
            callOnlyFallback,
          },
          landingPage: effectiveLandingPage,
          notes: notes || undefined,
          keywords: plan.keywords || [],
          headlines: plan.headlines || [],
          descriptions: plan.descriptions || [],
          expectations: plan.expectations || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Launch failed');
      }
      toast({
        title: 'Campaign launched',
        description: 'Your ads are being activated by our team.',
      });
      await patchCampaignAds({
        runtime: {
          campaignId: data?.campaignId,
          status: data?.status,
          launchedAt: new Date().toISOString(),
        },
      });
      if (!campaignId) setLandingPage('');
      if (!campaignId) setNotes('');
      await loadCampaigns();
    } catch (error: any) {
      toast({
        title: 'Launch failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLaunching(false);
    }
  };

  const subscription = billingSummary?.subscription;
  const monthlySpendCap = subscription?.monthlySpendCap ?? null;
  const monthlySpendUsed = subscription?.monthlySpendUsed ?? 0;
  const spendRatio = monthlySpendCap ? monthlySpendUsed / monthlySpendCap : null;
  const isNearCap = Boolean(monthlySpendCap && spendRatio !== null && spendRatio >= 0.9);
  const isPausedByCap = Boolean(subscription?.isPausedDueToSpendCap);
  const isOutOfFunds =
    subscription?.paymentModel === 'prepaid' && (subscription?.creditBalance ?? 0) <= 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Demand Capture System</h1>
          <p className="text-zinc-500 text-lg font-light">
            One flow: Surface → Ads → Leads → Sender → Signals.
          </p>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 uppercase tracking-widest text-[10px]">
          Managed Activation
        </Badge>
      </div>

      {prefillApplied && (
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 text-sm text-zinc-200">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-zinc-400">
            <span>Prefill Loaded</span>
            {prefillOrigin ? <span className="rounded-full bg-white/5 px-2 py-1">{prefillOrigin}</span> : null}
          </div>
          <div className="mt-3 text-zinc-300">
            We pulled context from your source surface. Review quick details and launch when ready.
          </div>
          {prefillLanding ? (
            <div className="mt-2 text-xs text-zinc-500 break-all">Landing: {prefillLanding}</div>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Campaign Activation</CardTitle>
            <CardDescription>Signal the market. We handle the strategy, setup, and launch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Outcome</label>
              <div className="flex flex-wrap gap-2">
                <OptionPill active={goal === 'Leads'} onClick={() => setGoal('Leads')}>
                  Leads
                </OptionPill>
                <OptionPill active={goal === 'Calls'} onClick={() => setGoal('Calls')}>
                  Calls
                </OptionPill>
                <OptionPill active={goal === 'WhatsApp'} onClick={() => setGoal('WhatsApp')}>
                  WhatsApp
                </OptionPill>
                <OptionPill active={goal === 'Website Visits'} onClick={() => setGoal('Website Visits')}>
                  Website Visits
                </OptionPill>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Market</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 pl-10 text-white"
                    placeholder="Dubai, UAE"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Intent</label>
                <div className="flex flex-wrap gap-2">
                  <OptionPill active={intent === 'Buy'} onClick={() => setIntent('Buy')}>
                    Buy
                  </OptionPill>
                  <OptionPill active={intent === 'Rent'} onClick={() => setIntent('Rent')}>
                    Rent
                  </OptionPill>
                  <OptionPill active={intent === 'Off-plan'} onClick={() => setIntent('Off-plan')}>
                    Off-plan
                  </OptionPill>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Unit type</label>
              <div className="flex flex-wrap gap-2">
                <OptionPill active={unitType === 'Apartment'} onClick={() => setUnitType('Apartment')}>
                  Apartment
                </OptionPill>
                <OptionPill active={unitType === 'Villa'} onClick={() => setUnitType('Villa')}>
                  Villa
                </OptionPill>
                <OptionPill active={unitType === 'Townhouse'} onClick={() => setUnitType('Townhouse')}>
                  Townhouse
                </OptionPill>
                <OptionPill active={unitType === 'Commercial'} onClick={() => setUnitType('Commercial')}>
                  Commercial
                </OptionPill>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Daily budget (AED)</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 pl-10 text-white"
                    placeholder="150"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Duration (days)</label>
                <Input
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-12 bg-black/40 border-white/10 text-white"
                  placeholder={String(DEFAULT_DURATION_DAYS)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Start</label>
                <div className="flex flex-wrap gap-2">
                  <OptionPill active={timeline === 'Start today'} onClick={() => setTimeline('Start today')}>
                    Start today
                  </OptionPill>
                  <OptionPill active={timeline === 'Start next week'} onClick={() => setTimeline('Start next week')}>
                    Next week
                  </OptionPill>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Primary contact</label>
              <div className="flex flex-wrap gap-2">
                <OptionPill active={contactRoute === 'Form'} onClick={() => setContactRoute('Form')}>
                  Form
                </OptionPill>
                <OptionPill active={contactRoute === 'Call'} onClick={() => setContactRoute('Call')}>
                  Call
                </OptionPill>
                <OptionPill active={contactRoute === 'WhatsApp'} onClick={() => setContactRoute('WhatsApp')}>
                  WhatsApp
                </OptionPill>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Landing surface</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLandingMode('builder')}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left transition",
                    landingMode === 'builder'
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-white/10 bg-black/40 hover:border-white/20"
                  )}
                >
                  <p className="text-sm font-semibold text-white">Builder site</p>
                  <p className="text-xs text-zinc-500">Use a published Entrestate page.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setLandingMode('external')}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left transition",
                    landingMode === 'external'
                      ? "border-blue-500/40 bg-blue-500/10"
                      : "border-white/10 bg-black/40 hover:border-white/20"
                  )}
                >
                  <p className="text-sm font-semibold text-white">External URL</p>
                  <p className="text-xs text-zinc-500">Send traffic to an existing site.</p>
                </button>
              </div>

              {landingMode === 'builder' ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Builder site</label>
                  <select
                    className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedSiteId}
                    onChange={(e) => handleSelectSite(e.target.value)}
                  >
                    <option value="">Select a site</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.title || 'Untitled Site'}
                        {site.published ? '' : ' (not published)'}
                      </option>
                    ))}
                  </select>
                  {sitesLoading ? (
                    <p className="text-xs text-zinc-500">Loading sites...</p>
                  ) : sites.length === 0 ? (
                    <p className="text-xs text-zinc-500">No builder sites yet.</p>
                  ) : selectedSite && !selectedSite.published ? (
                    <p className="text-xs text-amber-200">Publish this site before launch.</p>
                  ) : null}
                  {selectedSite ? (
                    <div className="flex flex-col gap-2 text-xs text-zinc-500">
                      <span>Landing URL: {selectedSite.url || 'Not published yet'}</span>
                      {selectedSite.refinerStatus ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span>Refiner</span>
                          <Badge className={getRefinerBadge(selectedSite.refinerStatus).className}>
                            {getRefinerBadge(selectedSite.refinerStatus).label}
                          </Badge>
                          {selectedSite.lastRefinedAt ? (
                            <span>Updated {formatDate(selectedSite.lastRefinedAt)}</span>
                          ) : null}
                        </div>
                      ) : (
                        <span>Refiner not run yet</span>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 rounded-full border-white/10 bg-white/5 text-white" asChild>
                          <Link href={`/builder?siteId=${selectedSite.id}`}>Open Builder</Link>
                        </Button>
                        {!selectedSite.published ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-full border-white/10 bg-white/5 text-white"
                            onClick={() => handlePublishSite(selectedSite.id)}
                            disabled={publishingSiteId === selectedSite.id}
                          >
                            {publishingSiteId === selectedSite.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Publish now'
                            )}
                          </Button>
                        ) : null}
                        {selectedSite.url ? (
                          <Button variant="outline" size="sm" className="h-8 rounded-full border-white/10 bg-white/5 text-white" asChild>
                            <a href={selectedSite.url} target="_blank" rel="noreferrer">Preview</a>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Landing page URL</label>
                  <Input
                    value={landingPage}
                    onChange={(e) => setLandingPage(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 text-white"
                    placeholder="https://your-listing.com"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Focus notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] bg-black/40 border-white/10 text-white"
                placeholder="Example: highlight off-plan launches, flexible payment plans, UK investors."
              />
            </div>

            <Accordion
              type="single"
              collapsible
              className="rounded-2xl border border-white/10 bg-black/40 px-4"
            >
              <AccordionItem value="advanced" className="border-none">
                <AccordionTrigger className="text-sm font-semibold text-white hover:no-underline">
                  Advanced tuning (optional)
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Audience</label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                        >
                          <option>Home Buyers</option>
                          <option>Investors</option>
                          <option>B2B</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Language</label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option>English</option>
                          <option>Arabic</option>
                          <option>English + Arabic</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                          Strategy preset
                        </label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={strategyPreset}
                          onChange={(e) => setStrategyPreset(e.target.value)}
                        >
                          <option>High Intent Buyers</option>
                          <option>Investor Focus</option>
                          <option>Off-plan Launch</option>
                          <option>Luxury Upgrade</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                          Negative keywords
                        </label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={negativeKeywordsPreset}
                          onChange={(e) => setNegativeKeywordsPreset(e.target.value)}
                        >
                          <option>None</option>
                          <option>Low intent filters</option>
                          <option>Rental-only filters</option>
                          <option>Price shoppers</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                          Schedule window
                        </label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={schedulePreset}
                          onChange={(e) => setSchedulePreset(e.target.value)}
                        >
                          <option>Always on</option>
                          <option>Business hours (9am-9pm)</option>
                          <option>Weekdays only</option>
                          <option>Weekend push</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                          Device targeting
                        </label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={deviceTargeting}
                          onChange={(e) => setDeviceTargeting(e.target.value)}
                        >
                          <option>All devices</option>
                          <option>Mobile priority</option>
                          <option>Desktop focus</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                          Language targeting
                        </label>
                        <select
                          className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={languageTargeting}
                          onChange={(e) => setLanguageTargeting(e.target.value)}
                        >
                          <option>Match campaign language</option>
                          <option>English only</option>
                          <option>Arabic only</option>
                          <option>English + Arabic</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Competitor intercept</p>
                          <p className="text-xs text-zinc-500">Target portal and brand searches.</p>
                        </div>
                        <Switch checked={competitorIntercept} onCheckedChange={setCompetitorIntercept} />
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Call-only fallback</p>
                          <p className="text-xs text-zinc-500">Enable call ads if CPA spikes.</p>
                        </div>
                        <Switch checked={callOnlyFallback} onCheckedChange={setCallOnlyFallback} />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-full border-white/10 bg-white/5 text-white font-bold gap-2"
                onClick={handleGeneratePlan}
                disabled={planLoading}
              >
                {planLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Build Plan
              </Button>
              <Button
                className="h-12 rounded-full bg-white text-black font-bold px-8"
                onClick={handleLaunch}
                disabled={launching || !plan || !isAdminUser}
              >
                {launching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Activate
              </Button>
            </div>

            {billingLoading ? (
              <p className="text-xs text-zinc-500">Checking spend guardrails...</p>
            ) : isPausedByCap ? (
              <p className="text-xs text-amber-200">
                Launches are paused due to the spend cap. Update billing to resume.
              </p>
            ) : isAdmin === false ? (
              <p className="text-xs text-zinc-500">Admin access required to activate campaigns.</p>
            ) : isOutOfFunds ? (
              <p className="text-xs text-amber-200">Wallet balance is empty. Add funds to launch.</p>
            ) : isNearCap ? (
              <p className="text-xs text-amber-200">
                Monthly spend is near the cap ({formatNumber(monthlySpendUsed)} /{' '}
                {formatNumber(monthlySpendCap || 0)} AED).
              </p>
            ) : null}

            {plan && (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-400">
                Smart plan ready: {plan.keywords.length} keywords, {plan.headlines.length} headlines,{' '}
                {plan.descriptions.length} descriptions.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Live Activations</CardTitle>
            <CardDescription>Current runs and status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : campaigns.length === 0 ? (
              <p className="text-sm text-zinc-500">No activations yet. Build your first plan.</p>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{campaign.name || 'Campaign'}</p>
                    <Badge
                      className={
                        campaign.status?.toLowerCase() === 'paused'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] uppercase tracking-widest'
                          : 'bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] uppercase tracking-widest'
                      }
                    >
                      {campaign.status || 'Active'}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500">{campaign.location || 'Location not shared'}</p>
                  {campaign.dailyBudget !== undefined && (
                    <p className="text-xs text-zinc-500">Daily budget: AED {campaign.dailyBudget}</p>
                  )}
                  {campaign.startAt && (
                    <p className="text-xs text-zinc-500">
                      Starts {formatDate(campaign.startAt)} • {campaign.timeline || 'Schedule pending'}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Status control</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full border-white/10 bg-white/5 text-white"
                      onClick={() => handleToggleCampaignStatus(campaign)}
                      disabled={updatingCampaignId === campaign.id || !isAdminUser}
                    >
                      {updatingCampaignId === campaign.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : !isAdminUser ? (
                        'Admin only'
                      ) : campaign.status?.toLowerCase() === 'paused' ? (
                        'Resume'
                      ) : (
                        'Pause'
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Budget Guardrails</CardTitle>
            <CardDescription>Wallet balance and spend caps.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {billingLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : isAdmin === false ? (
              <p className="text-sm text-zinc-500">Admin access required to view billing guardrails.</p>
            ) : !billingSummary?.subscription ? (
              <p className="text-sm text-zinc-500">Billing summary unavailable.</p>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Monthly spend</span>
                  <span className="text-white font-semibold">
                    AED {formatNumber(billingSummary.subscription.monthlySpendUsed ?? 0)}
                    {billingSummary.subscription.monthlySpendCap
                      ? ` / ${formatNumber(billingSummary.subscription.monthlySpendCap)}`
                      : ' / No cap'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Wallet balance</span>
                  <span className="text-white font-semibold">
                    AED {formatNumber(billingSummary.subscription.creditBalance ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <span>Cap control</span>
                  {billingSummary.subscription.isPausedDueToSpendCap ? (
                    <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] uppercase tracking-widest">
                      Paused
                    </Badge>
                  ) : billingSummary.subscription.pauseWhenCapReached ? (
                    <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase tracking-widest">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-white/5 text-zinc-300 border-white/10 text-[10px] uppercase tracking-widest">
                      Not set
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-white/10 bg-white/5 text-white"
                  asChild={isAdminUser}
                  disabled={!isAdminUser}
                >
                  {isAdminUser ? <Link href="/account/billing">Manage billing</Link> : 'Admin only'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {plan && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  Budget Expectations
                </CardTitle>
                <CardDescription>Forecast based on historical UAE campaign ranges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.expectations && (
                  <>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Total spend</span>
                      <span className="text-white font-semibold">AED {formatNumber(plan.expectations.totalSpend)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated clicks</span>
                      <span className="text-white font-semibold">
                        {formatRange(plan.expectations.clicksRange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated leads</span>
                      <span className="text-white font-semibold">
                        {formatRange(plan.expectations.leadsRange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated CPL</span>
                      <span className="text-white font-semibold">
                        AED {formatRange(plan.expectations.cplRange)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Estimated CPC</span>
                      <span className="text-white font-semibold">
                        AED {formatRange(plan.expectations.cpcRange)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle>Ad Copy Draft</CardTitle>
                <CardDescription>Ready-to-launch headlines and descriptions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Headlines</p>
                  <div className="mt-3 space-y-2">
                    {plan.headlines.map((headline, idx) => (
                      <div key={`${headline}-${idx}`} className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white">
                        {headline}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descriptions</p>
                  <div className="mt-3 space-y-2">
                    {plan.descriptions.map((description, idx) => (
                      <div key={`${description}-${idx}`} className="rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-zinc-300">
                        {description}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Keyword Plan</CardTitle>
              <CardDescription>High-intent searches prioritized for UAE buyers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.keywords.map((keyword, idx) => (
                <div
                  key={`${keyword.term}-${idx}`}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{keyword.term}</p>
                    <p className="text-xs text-zinc-500">
                      {keyword.volume ? `${formatCompact(keyword.volume)} searches` : 'Volume estimate pending'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <Badge className="bg-white/5 text-zinc-300 border-white/10 uppercase tracking-widest text-[10px]">
                      {keyword.competition || 'medium'}
                    </Badge>
                    {keyword.cpc && (
                      <span>
                        CPC AED {formatRange(keyword.cpc)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function formatCompact(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function OptionPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition",
        active
          ? "border-white bg-white text-black"
          : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-AE', { maximumFractionDigits: 0 }).format(value);
}

function formatRange(range: { low: number; high: number }) {
  return `${formatNumber(range.low)}-${formatNumber(range.high)}`;
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-AE', { month: 'short', day: 'numeric' });
}

function getRefinerBadge(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'review') {
    return {
      label: 'Review',
      className: 'bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] uppercase tracking-widest',
    };
  }
  if (normalized === 'done') {
    return {
      label: 'Polished',
      className: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase tracking-widest',
    };
  }
  if (normalized === 'running' || normalized === 'queued') {
    return {
      label: 'Running',
      className: 'bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[10px] uppercase tracking-widest',
    };
  }
  if (normalized === 'error') {
    return {
      label: 'Error',
      className: 'bg-red-500/10 text-red-300 border border-red-500/30 text-[10px] uppercase tracking-widest',
    };
  }
  return {
    label: status,
    className: 'bg-white/5 text-zinc-300 border-white/10 text-[10px] uppercase tracking-widest',
  };
}
