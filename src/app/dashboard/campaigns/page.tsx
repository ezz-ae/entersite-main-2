'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';

type Campaign = {
  id: string;
  name: string;
  status: string;
  objective: string;
  updatedAt: number;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/campaigns');
        const data = await res.json();
        if (mounted) setCampaigns(data?.campaigns || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Campaigns</h1>
          <p className="text-sm opacity-70">Campaign is the execution spine. Everything binds here.</p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New campaign
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/dashboard/campaigns/${c.id}`} className="block">
              <Card className="hover:opacity-95">
                <CardHeader>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <CardDescription className="flex gap-2 items-center">
                    <Badge variant="secondary">{c.status}</Badge>
                    <span className="text-xs opacity-70">{c.objective}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs opacity-70">Updated: {new Date(c.updatedAt).toLocaleString()}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {campaigns.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">No campaigns yet</CardTitle>
                <CardDescription>Create your first campaign to bind landing + ads + sender + agent.</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
