'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Target, MapPin, Wallet, CheckCircle2 } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';
import { useToast } from '@/hooks/use-toast';

type Campaign = {
  id: string;
  name?: string;
  status?: string;
  location?: string;
  dailyBudget?: number;
  createdAt?: string;
};

const DEFAULT_DURATION_DAYS = 30;

export function GoogleAdsDashboard() {
  const { toast } = useToast();
  const [goal, setGoal] = useState('Lead Generation');
  const [location, setLocation] = useState('Dubai, UAE');
  const [budget, setBudget] = useState('150');
  const [landingPage, setLandingPage] = useState('');
  const [notes, setNotes] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleRequest = async () => {
    const numericBudget = Number(budget);
    if (!location.trim() || Number.isNaN(numericBudget) || numericBudget <= 0) {
      toast({ title: 'Add a valid budget and location', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await authorizedFetch('/api/ads/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${goal} - ${location}`,
          budget: numericBudget,
          duration: DEFAULT_DURATION_DAYS,
          location,
          goal,
          landingPage: landingPage || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Request failed');
      }
      toast({
        title: 'Setup requested',
        description: 'We are preparing your campaign and will update the status shortly.',
      });
      setLandingPage('');
      setNotes('');
      await loadCampaigns();
    } catch (error: any) {
      toast({
        title: 'Request failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Google Ads</h1>
          <p className="text-zinc-500 text-lg font-light">
            No account needed. We can create and manage your client ads account for you.
          </p>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 uppercase tracking-widest text-[10px]">
          Managed Setup
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Quick Setup</CardTitle>
            <CardDescription>Tell us your goal and budget. We handle the rest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Goal</label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <select
                    className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    <option>Lead Generation</option>
                    <option>Website Visits</option>
                    <option>Brand Awareness</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Location</label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Daily Budget (AED)</label>
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
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Landing Page (Optional)</label>
                <Input
                  value={landingPage}
                  onChange={(e) => setLandingPage(e.target.value)}
                  className="h-12 bg-black/40 border-white/10 text-white"
                  placeholder="https://your-listing.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Notes (Optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] bg-black/40 border-white/10 text-white"
                placeholder="Any special requirements, neighborhoods, or buyer type."
              />
            </div>

            <Button
              className="h-12 rounded-full bg-white text-black font-bold px-8"
              onClick={handleRequest}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Request Setup
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>Track setup status in one place.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            ) : campaigns.length === 0 ? (
              <p className="text-sm text-zinc-500">No requests yet. Create your first setup request.</p>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{campaign.name || 'Campaign'}</p>
                    <Badge className="bg-white/10 text-white border-white/10 text-[10px] uppercase tracking-widest">
                      {campaign.status || 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500">{campaign.location || 'Location not shared'}</p>
                  {campaign.dailyBudget !== undefined && (
                    <p className="text-xs text-zinc-500">Daily budget: AED {campaign.dailyBudget}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
