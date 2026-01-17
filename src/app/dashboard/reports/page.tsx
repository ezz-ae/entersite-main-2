'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';

type ReportSummary = {
  leads: {
    new: number;
    contacted: number;
    revived: number;
  };
  sender: {
    delivered: number;
    opened: number;
    replied: number;
  };
  ads: {
    spend: number;
    leads: number;
    costPerLead: number;
    currency: string;
  };
};

const formatNumber = (value: number) => value.toLocaleString('en-US');

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm text-zinc-300 border-b border-white/5 py-3 last:border-b-0">
    <span className="text-zinc-400">{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

export default function DashboardReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadReport = async () => {
      try {
        const res = await authorizedFetch('/api/reports/summary', { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Failed to fetch report summary');
        }
        const data = await res.json();
        if (mounted) {
          setReport(data.data);
        }
      } catch (err) {
        console.error('Failed to load reports summary', err);
        if (mounted) {
          setError('Unable to load insights right now.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadReport();
    return () => {
      mounted = false;
    };
  }, []);

  const replyRate = report
    ? report.sender.delivered
      ? Math.round((report.sender.replied || 0) / report.sender.delivered * 100)
      : 0
    : 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight">Reports</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track the health of your tenant: leads, automated sender deliveries, and ad spend in one view.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-3xl border border-white/5 bg-zinc-950/60 p-10">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-sm text-rose-200">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Card className="bg-zinc-950/60 border border-white/5">
            <CardHeader>
              <CardTitle>Leads</CardTitle>
              <CardDescription>New • Contacted • Revived</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatRow label="New leads" value={formatNumber(report?.leads.new ?? 0)} />
              <StatRow label="Contacted" value={formatNumber(report?.leads.contacted ?? 0)} />
              <StatRow label="Revived" value={formatNumber(report?.leads.revived ?? 0)} />
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/60 border border-white/5">
            <CardHeader>
              <CardTitle>Sender</CardTitle>
              <CardDescription>Delivered • Opened • Replied</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatRow label="Delivered" value={formatNumber(report?.sender.delivered ?? 0)} />
              <StatRow label="Opened (email)" value={formatNumber(report?.sender.opened ?? 0)} />
              <StatRow label="Replied" value={formatNumber(report?.sender.replied ?? 0)} />
              <StatRow label="Reply rate" value={`${replyRate}%`} />
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/60 border border-white/5">
            <CardHeader>
              <CardTitle>Ads</CardTitle>
              <CardDescription>Spend • Leads • Cost per lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <StatRow
                label="Spend"
                value={`${report?.ads.currency ?? '$'}${formatNumber(report?.ads.spend ?? 0)}`}
              />
              <StatRow label="Leads" value={formatNumber(report?.ads.leads ?? 0)} />
              <StatRow
                label="Cost / lead"
                value={`${report?.ads.currency ?? '$'}${(report?.ads.costPerLead ?? 0).toFixed(2)}`}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
