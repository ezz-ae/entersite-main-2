'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';

export default function CampaignOverviewPage() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authorizedFetch(`/api/campaigns/${id}`);
        const data = await res.json();
        if (mounted) setCampaign(data?.campaign);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-sm opacity-70 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  if (!campaign) {
    return <div className="p-6">Campaign not found.</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{campaign.status}</Badge>
            <span className="text-sm opacity-70">{campaign.objective}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/google-ads/campaigns">
            <Button variant="outline">Back</Button>
          </Link>
          <Link href={`/google-ads/campaigns/${id}/landing`}>
            <Button>Landing</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Landing
          </CardTitle>
          <CardDescription>Campaign references a Builder surface or external URL.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          {campaign?.landing?.url ? (
            <a className="underline break-all" href={campaign.landing.url} target="_blank" rel="noreferrer">
              {campaign.landing.url}
            </a>
          ) : (
            <span className="opacity-70">Not set</span>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <a
          href={campaign?.landing?.url ? `/google-ads/campaigns/${campaign.id}/ads` : undefined}
          className={campaign?.landing?.url ? '' : 'pointer-events-none'}
        >
          <Card className={campaign?.landing?.url ? 'hover:bg-zinc-900/40 transition' : 'opacity-60'}>
            <CardHeader>
              <CardTitle className="text-base">Google Ads</CardTitle>
              <CardDescription>
                {campaign?.landing?.url ? 'Open Ads for this campaign' : 'Set landing first to enable Ads'}
              </CardDescription>
            </CardHeader>
          </Card>
        </a>
        <a
          href={campaign?.landing?.url ? `/google-ads/campaigns/${campaign.id}/messaging` : undefined}
          className={campaign?.landing?.url ? '' : 'pointer-events-none'}
        >
          <Card className={campaign?.landing?.url ? 'hover:bg-zinc-900/40 transition' : 'opacity-60'}>
            <CardHeader>
              <CardTitle className="text-base">Smart Sender</CardTitle>
              <CardDescription>
                {campaign?.landing?.url
                  ? 'Configure the multi-channel sequence for this campaign'
                  : 'Set landing first to enable Sender'}
              </CardDescription>
            </CardHeader>
          </Card>
        </a>
        <Card className="opacity-80">
          <CardHeader>
            <CardTitle className="text-base">Agent</CardTitle>
            <CardDescription>Next: agent deployments (landing embed, QR link, IG DM).</CardDescription>
          </CardHeader>
        </Card>
        <Card className="opacity-80">
          <CardHeader>
            <CardTitle className="text-base">Audience Network</CardTitle>
            <CardDescription>Next: weighted events → segments → actions factory.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
