'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { apiFetch } from '@/lib/apiFetch';
import { Loader2 } from 'lucide-react';
import { RealTimeActivity } from './real-time-activity';
import { KeywordPerformance } from './keyword-performance';

export function PerformanceDashboard({ campaign }: { campaign: any }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/api/google-ads/stats?campaignId=${campaign.id}`);
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (campaign && campaign.id) {
      fetchStats();
    } else {
        setIsLoading(false);
    }
  }, [campaign]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!stats) {
    return <p className="text-center text-zinc-500">Could not load campaign performance data.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>{campaign.name || 'Campaign Performance'}</CardTitle>
          <CardDescription>High-level overview of your campaign metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-zinc-900 rounded-lg">
              <p className="text-sm text-zinc-500">Clicks</p>
              <p className="text-3xl font-bold">{stats.clicks}</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-lg">
              <p className="text-sm text-zinc-500">Impressions</p>
              <p className="text-3xl font-bold">{stats.impressions}</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-lg">
              <p className="text-sm text-zinc-500">CTR</p>
              <p className="text-3xl font-bold">{stats.ctr}%</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-lg">
              <p className="text-sm text-zinc-500">Conversions</p>
              <p className="text-3xl font-bold">{stats.conversions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <RealTimeActivity campaignId={campaign.id} />
        </div>
        <div className="lg:col-span-2">
            <KeywordPerformance keywords={campaign.keywords || []} />
        </div>
      </div>
    </div>
  );
}
