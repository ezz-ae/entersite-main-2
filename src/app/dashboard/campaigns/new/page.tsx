'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [objective, setObjective] = useState<'leads' | 'calls' | 'whatsapp' | 'traffic'>('leads');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCreate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'New Campaign', objective }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create campaign');
      router.push(`/dashboard/campaigns/${data.campaign.id}/landing`);
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Create campaign</CardTitle>
          <CardDescription>Step 1 will be landing: external URL or a published Builder surface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Marina Launch" />
          </div>

          <div className="space-y-2">
            <Label>Objective</Label>
            <select
              className="w-full border rounded-md h-10 px-3 bg-background"
              value={objective}
              onChange={(e) => setObjective(e.target.value as any)}
            >
              <option value="leads">Leads</option>
              <option value="calls">Calls</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="traffic">Traffic</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <Button disabled={loading} onClick={onCreate} className="w-full">
            {loading ? 'Creating…' : 'Continue to landing'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
