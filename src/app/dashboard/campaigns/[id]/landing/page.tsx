'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, Plus } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';

type Site = {
  id: string;
  title?: string;
  type?: string;
  status?: string;
  published?: boolean;
  publishedUrl?: string;
  customDomain?: string;
  subdomain?: string;
};

export default function CampaignLandingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [externalUrl, setExternalUrl] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await authorizedFetch('/api/sites');
        const data = await res.json();
        const items = (data?.sites || []) as any[];
        if (mounted) setSites(items);
      } catch {
        if (mounted) setSites([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const publishedLandings = useMemo(() => {
    return sites
      .filter((s) => !!s.published && (!!s.publishedUrl || !!s.customDomain))
      // if you later add explicit type, filter here:
      // .filter((s) => s.type === 'landing')
      ;
  }, [sites]);

  async function saveExternal() {
    setLoading(true);
    setErr(null);
    try {
      const res = await authorizedFetch(`/api/campaigns/${id}/landing`, {
        method: 'PATCH',
        body: JSON.stringify({ mode: 'external', url: externalUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to save landing');
      router.push(`/google-ads/campaigns/${id}`);
    } catch (e: any) {
      setErr(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  async function saveSurface() {
    setLoading(true);
    setErr(null);
    try {
      const res = await authorizedFetch(`/api/campaigns/${id}/landing`, {
        method: 'PATCH',
        body: JSON.stringify({ mode: 'surface', siteId: selectedSiteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to attach surface');
      router.push(`/google-ads/campaigns/${id}`);
    } catch (e: any) {
      setErr(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Landing page</h1>
          <p className="text-sm opacity-70">Step 1: external URL or a published Builder surface.</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/google-ads/campaigns/${id}`}>
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {err && <div className="text-sm text-red-500">{err}</div>}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Use existing landing URL
            </CardTitle>
            <CardDescription>Attach your current landing page link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://…" />
            </div>
            <Button disabled={loading || !externalUrl} onClick={saveExternal} className="w-full">
              {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>) : 'Save URL'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Use Builder Surface</CardTitle>
            <CardDescription>Pick a published site from Builder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Published surfaces</Label>
              <select
                className="w-full border rounded-md h-10 px-3 bg-background"
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
              >
                <option value="">Select…</option>
                {publishedLandings.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title || s.id}
                  </option>
                ))}
              </select>
              <div className="text-xs opacity-70 flex items-center gap-2">
                <Badge variant="secondary">{publishedLandings.length}</Badge>
                <span>published available</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button disabled={loading || !selectedSiteId} onClick={saveSurface} className="flex-1">
                {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Attaching…</>) : 'Attach'}
              </Button>
              <Link href={`/builder?start=1&returnTo=/google-ads/campaigns/${id}/landing`}>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
