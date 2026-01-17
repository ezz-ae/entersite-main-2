'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BillingHistoryEvent,
  BillingSettingsUpdate,
  BillingSku,
  BillingSummary,
  cancelSubscription,
  fetchBillingHistory,
  fetchBillingSummary,
  startCheckout,
  updateBillingSettings,
} from '@/lib/billing';
import { Loader2 } from 'lucide-react';

const PLAN_CARDS = [
  {
    id: 'agent_pro',
    name: 'Agent Pro',
    price: '299 AED / month',
  },
  {
    id: 'agent_growth',
    name: 'Agent Growth',
    price: '799 AED / month',
  },
  {
    id: 'agency_os',
    name: 'Agency OS',
    price: 'From 2,499 AED / month',
  },
];

const USAGE_ITEMS = [
  { key: 'ai_conversations', label: 'Smart conversations', cadence: 'Monthly' },
  { key: 'leads', label: 'Leads stored', cadence: 'Total' },
  { key: 'landing_pages', label: 'Landing pages', cadence: 'Total' },
  { key: 'campaigns', label: 'Campaigns', cadence: 'Monthly' },
  { key: 'email_sends', label: 'Emails sent', cadence: 'Monthly' },
  { key: 'sms_sends', label: 'SMS sent', cadence: 'Monthly' },
  { key: 'domains', label: 'Custom domains', cadence: 'Total' },
];

const UPGRADE_MESSAGES: Record<string, string> = {
  leads: "You're getting leads. Upgrade to keep them flowing.",
  ai_conversations: 'Your Smart agent is working. Increase conversations to keep it live.',
  landing_pages: 'Your pages are converting. Unlock more launches.',
  campaigns: 'Campaigns are active. Upgrade to launch more.',
  email_sends: 'Email is working. Upgrade to keep it sending.',
  sms_sends: 'SMS engagement is strong. Add more credits to keep it live.',
  domains: 'Your domain limit is close. Add another domain to keep growing.',
};

function formatLimit(value: number | null) {
  if (value === null) return 'Unlimited';
  return value.toLocaleString();
}

function formatUsage(value: number) {
  return value.toLocaleString();
}

function getTrialDaysLeft(summary: BillingSummary | null) {
  const endsAt = summary?.subscription?.trial?.endsAt;
  if (!endsAt) return null;
  const diff = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function BillingManager() {
  const { toast } = useToast();
  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionSku, setActionSku] = useState<BillingSku | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [history, setHistory] = useState<BillingHistoryEvent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [vatValue, setVatValue] = useState('');
  const [monthlyCapValue, setMonthlyCapValue] = useState('');
  const [pauseCap, setPauseCap] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchBillingSummary();
      setSummary(data);
    } catch (error: any) {
      toast({
        title: 'Could not load billing',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (!summary) return;
    setVatValue(summary.subscription.vatNumber ?? '');
    setMonthlyCapValue(
      summary.subscription.monthlySpendCap !== null && summary.subscription.monthlySpendCap !== undefined
        ? String(summary.subscription.monthlySpendCap)
        : '',
    );
    setPauseCap(Boolean(summary.subscription.pauseWhenCapReached));
  }, [summary]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchBillingHistory();
        if (mounted) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error('Failed to load billing history', error);
      } finally {
        if (mounted) {
          setHistoryLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveSettings = async () => {
    if (!summary) return;
    setSavingSettings(true);
    try {
      const payload: BillingSettingsUpdate = {
        vatNumber: vatValue || null,
        monthlySpendCap: monthlyCapValue ? Number(monthlyCapValue) : null,
        pauseWhenCapReached: pauseCap,
      };
      await updateBillingSettings(payload);
      toast({
        title: 'Settings updated',
        description: 'Billing controls synced successfully.',
      });
      await loadSummary();
    } catch (error: any) {
      toast({
        title: 'Failed to save settings',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCheckout = async (sku: BillingSku) => {
    if (!summary?.providers?.paypal && !summary?.providers?.ziina) {
      toast({
        title: 'Payments not configured',
        description: 'Please contact support to upgrade.',
        variant: 'destructive',
      });
      return;
    }
    setActionSku(sku);
    try {
      const provider = summary?.providers?.ziina ? 'ziina' : 'paypal';
      const checkoutUrl = await startCheckout(sku, provider);
      window.location.href = checkoutUrl;
    } catch (error: any) {
      toast({
        title: 'Checkout failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionSku(null);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      await cancelSubscription();
      toast({
        title: 'Cancellation requested',
        description: 'Your plan will remain active until the end of the period.',
      });
      await loadSummary();
    } catch (error: any) {
      toast({
        title: 'Cancellation failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCanceling(false);
    }
  };

  const currentPlan = summary?.subscription?.plan || 'agent_pro';
  const status = summary?.subscription?.status || 'trial';
  const trialDaysLeft = getTrialDaysLeft(summary);
  const suggestedUpgrade =
    summary?.suggestedUpgrade || (currentPlan === 'agent_pro' ? 'agent_growth' : 'agency_os');
  const upgradePlan = PLAN_CARDS.find((plan) => plan.id === suggestedUpgrade) || PLAN_CARDS[1];

  const warningMetric = useMemo(() => {
    if (!summary) return null;
    return USAGE_ITEMS.find((item) => summary.warnings?.[item.key] && item.key in UPGRADE_MESSAGES);
  }, [summary]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Loading your subscription…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-1/3 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Unable to load billing details right now.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Current plan
            <Badge variant="outline">{PLAN_CARDS.find((plan) => plan.id === currentPlan)?.name || 'Agent Pro'}</Badge>
            <Badge
              variant="secondary"
              className={cn(
                status === 'active' && 'bg-emerald-500/10 text-emerald-400',
                status === 'trial' && 'bg-blue-500/10 text-blue-400',
                status === 'past_due' && 'bg-amber-500/10 text-amber-400',
                status === 'canceled' && 'bg-red-500/10 text-red-400',
              )}
            >
              {status === 'trial' ? 'Trial' : status.replace('_', ' ')}
            </Badge>
          </CardTitle>
          <CardDescription>
            {status === 'trial' && trialDaysLeft !== null
              ? `Trial ends in ${trialDaysLeft} days or on first success.`
              : status === 'past_due'
                ? 'Trial ended. Upgrade to keep sending and launching.'
                : 'Monthly, cancel any time.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Period</p>
              <p className="text-sm font-medium">
                {summary.subscription.currentPeriodEnd
                  ? `Renews ${new Date(summary.subscription.currentPeriodEnd).toLocaleDateString()}`
                  : 'Flexible monthly plan'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Seats</p>
              <p className="text-sm font-medium">
                {summary.seats ? `${summary.seats.used} / ${formatLimit(summary.seats.limit)}` : '1 / 1'}
              </p>
            </div>
            <div className="flex items-center justify-end">
              {status === 'active' && !summary.subscription.cancelAtPeriodEnd && (
                <Button variant="outline" disabled={canceling} onClick={handleCancel}>
                  {canceling ? 'Canceling…' : 'Cancel subscription'}
                </Button>
              )}
              {summary.subscription.cancelAtPeriodEnd && (
                <Badge variant="outline">Cancels at period end</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage snapshot</CardTitle>
          <CardDescription>We’ll warn you at 70% and 90% usage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {USAGE_ITEMS.map((item) => {
            const used = summary.usage[item.key] || 0;
            const limit = summary.limits[item.key] ?? null;
            const warning = summary.warnings[item.key];
            const percentage = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{item.cadence}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatUsage(used)} / {formatLimit(limit)}
                    </span>
                    {warning === 'warning_90' && <Badge variant="outline">90%</Badge>}
                    {warning === 'warning_70' && <Badge variant="outline">70%</Badge>}
                    {warning === 'limit' && <Badge variant="destructive">Limit</Badge>}
                  </div>
                </div>
                <Progress value={limit ? percentage : 0} className={cn(limit ? '' : 'opacity-40')} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-base">Upgrade when you are winning</CardTitle>
          <CardDescription>
            {warningMetric ? UPGRADE_MESSAGES[warningMetric.key] : 'Unlock more launches when you are ready.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{upgradePlan.name}</p>
            <p className="text-xs text-muted-foreground">{upgradePlan.price}</p>
          </div>
          {upgradePlan.id === 'agency_os' ? (
            <Button variant="outline" asChild>
              <a href="mailto:sales@entrestate.com">Contact sales</a>
            </Button>
          ) : (
            <Button
              onClick={() => handleCheckout(upgradePlan.id as BillingSku)}
              disabled={actionSku === upgradePlan.id}
            >
              {actionSku === upgradePlan.id ? 'Starting…' : 'Upgrade now'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border border-white/10 bg-zinc-950/40">
        <CardHeader>
          <CardTitle>Spend controls</CardTitle>
          <CardDescription>
            Set monthly spend limits, pause when the cap is reached, and add VAT details for invoicing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
                VAT number
              </Label>
              <Input
                value={vatValue}
                onChange={(event) => setVatValue(event.target.value)}
                placeholder="VAT ID"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
                Monthly spend cap (AED)
              </Label>
              <Input
                type="number"
                min={0}
                value={monthlyCapValue}
                onChange={(event) => setMonthlyCapValue(event.target.value)}
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={pauseCap} onCheckedChange={setPauseCap} />
            <div>
              <p className="text-sm font-semibold text-white">Pause when cap is reached</p>
              <p className="text-xs text-muted-foreground">
                Automatically halt purchases and publishes when the monthly limit is exceeded.
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Spent this month:{' '}
            <span className="font-semibold text-white">
              {(summary.subscription.monthlySpendUsed ?? 0).toFixed(2)} AED
            </span>
            {summary.subscription.monthlySpendCap
              ? ` of ${summary.subscription.monthlySpendCap.toLocaleString()} AED`
              : ' (no cap set)'}
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="h-11 rounded-full bg-white text-black font-bold"
          >
            {savingSettings ? 'Saving...' : 'Save billing controls'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-white/5">
        <CardHeader>
          <CardTitle>Invoice history</CardTitle>
          <CardDescription>Recent billing events and charges for your tenant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {historyLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading history…
            </div>
          ) : !history.length ? (
            <p className="text-sm text-muted-foreground">No billing history available yet.</p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((entry) => (
                <div key={entry.id} className="rounded-xl border border-white/5 bg-zinc-900/40 p-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-semibold text-white">{entry.type.replace(/_/g, ' ')}</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                  {entry.cost !== undefined && (
                    <p className="text-base text-white mt-1">
                      {entry.cost.toLocaleString()} AED
                    </p>
                  )}
                  {typeof entry.metadata?.message === 'string' && entry.metadata.message.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{entry.metadata.message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
