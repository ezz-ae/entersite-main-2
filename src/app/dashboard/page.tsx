'use client';

import React, { useEffect, useState } from 'react';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Sparkles } from 'lucide-react';

type InventoryMeta = {
  total?: number;
  citiesCount?: number;
  areasCount?: number;
};

export default function DashboardPage() {
  const [meta, setMeta] = useState<InventoryMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch('/api/projects/meta', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setMeta({
          total: data.total,
          citiesCount: data.citiesCount,
          areasCount: data.areasCount,
        });
      } catch (error) {
        console.error('Failed to load inventory status', error);
      } finally {
        setLoading(false);
      }
    };
    loadMeta();
  }, []);

  const totalListings = meta?.total ?? 0;
  const cities = meta?.citiesCount ?? 0;
  const areas = meta?.areasCount ?? 0;
  const nextAction = loading
    ? {
        label: 'Preparing your next step…',
        description: 'Checking your inventory and launches.',
        href: '#',
        disabled: true,
      }
    : totalListings === 0
      ? {
          label: 'Connect listings',
          description: 'Add your inventory to unlock market insights and launches.',
          href: '/docs#inventory',
          disabled: false,
        }
      : {
          label: 'Start your first launch',
          description: 'Publish a listing page and capture your next lead.',
          href: '/start?intent=website',
          disabled: false,
        };

  return (
    <div className="space-y-12">
         <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-xl text-muted-foreground font-light">Choose what you want to work on today.</p>
        </div>

        <Card className="bg-white/5 border border-blue-500/20 rounded-3xl">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Next best action</p>
                <p className="text-lg font-semibold text-white">{nextAction.description}</p>
              </div>
            </div>
            {nextAction.disabled ? (
              <Button className="h-11 rounded-full bg-white text-black font-bold" disabled>
                {nextAction.label}
              </Button>
            ) : (
              <Button asChild className="h-11 rounded-full bg-white text-black font-bold">
                <a href={nextAction.href}>{nextAction.label}</a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border border-white/5 rounded-3xl">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Inventory Status</p>
                {loading ? (
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking listings...
                  </div>
                ) : totalListings > 0 ? (
                  <p className="text-lg font-semibold text-white">
                    {totalListings.toLocaleString()} listings ready{cities ? ` in ${cities} cities` : ''}.
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-white">Inventory not connected yet.</p>
                )}
                {totalListings > 0 && (cities || areas) ? (
                  <p className="text-sm text-zinc-500">
                    {cities ? `${cities} cities` : ''}{cities && areas ? ' • ' : ''}{areas ? `${areas} areas` : ''}
                  </p>
                ) : null}
              </div>
            </div>
            {totalListings === 0 && !loading ? (
              <Button asChild className="h-11 rounded-full bg-white text-black font-bold">
                <a href="/docs#inventory">Connect listings</a>
              </Button>
            ) : (
              <Button asChild variant="outline" className="h-11 rounded-full border-white/10 bg-white/5 text-white font-bold">
                <a href="/discover">View market feed</a>
              </Button>
            )}
          </CardContent>
        </Card>

        <DashboardCards />
    </div>
  );
}
