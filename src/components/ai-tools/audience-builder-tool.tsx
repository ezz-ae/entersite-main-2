'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, MapPin, Target, Upload, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImportContactsDialog } from '@/components/messaging/import-contacts-dialog';
import { authorizedFetch } from '@/lib/auth-fetch';
import { cn } from '@/lib/utils';

export function AudienceBuilderTool() {
  const { toast } = useToast();
  const [listType, setListType] = useState<'imported' | 'pilot'>('imported');
  const [counts, setCounts] = useState({ imported: 0, pilot: 0 });
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [goal, setGoal] = useState('Lead Generation');
  const [region, setRegion] = useState('Dubai, UAE');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<any | null>(null);

  const loadSummary = async () => {
    try {
      const res = await authorizedFetch('/api/contacts/summary?channel=email');
      const data = await res.json();
      if (res.ok) {
        setCounts({ imported: data.importedCount || 0, pilot: data.pilotCount || 0 });
      }
    } catch (error) {
      console.error('Failed to load audience summary', error);
    }
  };

  const loadLastRequest = async () => {
    try {
      const res = await authorizedFetch('/api/audience/request', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setLastRequest(data.request || null);
      }
    } catch (error) {
      console.error('Failed to load audience request', error);
    }
  };

  useEffect(() => {
    loadSummary();
    loadLastRequest();
  }, []);

  const handleImportComplete = () => {
    loadSummary();
    setListType('imported');
  };

  const handleRequest = async () => {
    if (!region.trim()) {
      toast({ title: 'Add a target region', variant: 'destructive' });
      return;
    }
    if (listType === 'imported' && counts.imported === 0) {
      toast({ title: 'Upload a buyer list first', variant: 'destructive' });
      return;
    }

    const budgetValue = Number(budget);
    if (budget && (Number.isNaN(budgetValue) || budgetValue < 0)) {
      toast({ title: 'Add a valid budget', variant: 'destructive' });
      return;
    }

    setRequestLoading(true);
    try {
      const res = await authorizedFetch('/api/audience/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listType,
          goal,
          region,
          budget: budget ? budgetValue : undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Request failed');
      }
      toast({
        title: 'Activation started',
        description: 'We will activate your audience and keep you updated.',
      });
      setNotes('');
      setBudget('');
      setLastRequest(data.request || null);
    } catch (error: any) {
      toast({
        title: 'Request failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <ImportContactsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Buyer Audience</h2>
          <p className="text-zinc-500 text-lg font-light">Activate your buyer list or join the pilot audience.</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2 rounded-full">
          <Users className="h-3 w-3 mr-2" /> Audience Ready
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div>
              <CardTitle className="text-xl text-white">Your Buyer List</CardTitle>
              <CardDescription className="text-zinc-500">
                Upload a CSV with buyer emails so we can build your audience.
              </CardDescription>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant={listType === 'imported' ? 'default' : 'outline'}
                className="h-12 rounded-2xl font-bold"
                onClick={() => setListType('imported')}
              >
                Your list ({counts.imported})
              </Button>
              <Button
                variant={listType === 'pilot' ? 'default' : 'outline'}
                className="h-12 rounded-2xl font-bold"
                onClick={() => setListType('pilot')}
              >
                Pilot list ({counts.pilot})
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-full border-white/10 bg-white/5 text-white font-bold gap-2"
                onClick={() => setShowImportDialog(true)}
              >
                <Upload className="h-4 w-4" /> Upload Contact List
              </Button>
              <Badge className="bg-white/5 text-zinc-400 border-white/10 self-start sm:self-center">
                CSV with emails
              </Badge>
            </div>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem] p-8 space-y-6">
            <div>
              <CardTitle className="text-xl text-white">Activate Audience</CardTitle>
              <CardDescription className="text-zinc-500">
                We will prepare your ad audience and notify you when it is ready.
              </CardDescription>
            </div>
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
                    <option>Project Launch</option>
                    <option>Open House</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Region</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 pl-10 text-white"
                    placeholder="Dubai, UAE"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Monthly Budget (AED)</label>
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-12 bg-black/40 border-white/10 text-white"
                  placeholder="3000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] bg-black/40 border-white/10 text-white"
                  placeholder="Primary buyer type, neighborhoods, timeline..."
                />
              </div>
            </div>
            <Button
              className="h-12 rounded-full bg-white text-black font-bold"
              onClick={handleRequest}
              disabled={requestLoading}
            >
              {requestLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Activate Audience
            </Button>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-zinc-900/50 border-white/5 text-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle>Latest Activation</CardTitle>
              <CardDescription>We will update this status as soon as it is ready.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {lastRequest ? (
                <div className="space-y-3">
                  <Badge className="bg-white/10 text-white border-white/10 text-[10px] uppercase tracking-widest">
                    {lastRequest.status || 'Requested'}
                  </Badge>
                  <p className="text-sm text-zinc-400">Goal: {lastRequest.goal}</p>
                  <p className="text-sm text-zinc-400">Region: {lastRequest.region}</p>
                  {lastRequest.budget ? (
                    <p className="text-sm text-zinc-400">Budget: AED {lastRequest.budget}</p>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No activations yet.</p>
              )}
            </CardContent>
          </Card>

          <div className={cn("p-6 rounded-[2.5rem] border border-white/10 bg-black/40 text-zinc-400 text-sm")}>
            We prepare and verify audiences manually to keep quality high. Expect updates within 1 business day.
          </div>
        </div>
      </div>
    </div>
  );
}
