'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  BillingSku,
  BillingSummary,
  cancelSubscription,
  fetchBillingSummary,
  startCheckout,
} from '@/lib/billing';

const PLAN_CARDS = [
  {
    id: 'agent_pro',
    name: 'Agent Pro',
    price: '299 AED / month',
    description: 'For solo brokers who want leads fast.',
    features: [
      '1 AI Instagram DM agent',
      '3 landing pages',
      'UAE projects access',
      'Meta audience templates',
      'Email: 1,000/month',
      'Leads up to 300',
      '1 custom domain',
      'AI conversations: 1,000/month',
      'Seats: 1',
    ],
  },
  {
    id: 'agent_growth',
    name: 'Agent Growth',
    price: '799 AED / month',
    description: 'For teams scaling lead volume.',
    features: [
      '3 AI agents',
      '10 landing pages',
      'Google Ads launcher',
      'Meta custom audiences + lookalikes',
      'Email: 5,000/month',
      'SMS credits included',
      'Leads up to 2,000',
      'Seats: 3',
      'AI conversations: 5,000/month',
    ],
  },
  {
    id: 'agency_os',
    name: 'Agency OS',
    price: 'From 2,499 AED / month',
    description: 'Custom setup for agencies.',
    features: ['Multi-tenant rollout', 'Custom SLAs', 'Dedicated onboarding'],
  },
];

const USAGE_ITEMS = [
  { key: 'ai_conversations', label: 'AI conversations', cadence: 'Monthly' },
  { key: 'leads', label: 'Leads stored', cadence: 'Total' },
  { key: 'landing_pages', label: 'Landing pages', cadence: 'Total' },
  { key: 'campaigns', label: 'Campaigns', cadence: 'Monthly' },
  { key: 'email_sends', label: 'Emails sent', cadence: 'Monthly' },
  { key: 'sms_sends', label: 'SMS sent', cadence: 'Monthly' },
  { key: 'domains', label: 'Custom domains', cadence: 'Total' },
];

const ADD_ONS: { sku: BillingSku; label: string; price: string; hint: string }[] = [
  { sku: 'addon_ai_conversations_1000', label: '+1,000 AI conversations', price: '99 AED', hint: 'Unlock more AI chats instantly.' },
  { sku: 'addon_leads_500', label: '+500 leads storage', price: '49 AED', hint: 'Keep more buyers and sellers in your inbox.' },
  { sku: 'addon_domain_1', label: 'Extra domain', price: '39 AED', hint: 'Connect another branded domain.' },
  { sku: 'addon_sms_bundle', label: 'SMS bundle', price: '99 AED', hint: 'Add more SMS credits.' },
];

const UPGRADE_MESSAGES: Record<string, string> = {
  leads: "You're getting leads. Upgrade to keep them flowing.",
  ai_conversations: 'Your AI agent is working. Increase conversations to keep it live.',
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

      {warningMetric && summary.suggestedUpgrade && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">Upgrade moment</CardTitle>
            <CardDescription>{UPGRADE_MESSAGES[warningMetric.key]}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {summary.suggestedUpgrade === 'agent_growth' ? 'Upgrade to Agent Growth' : 'Contact sales for Agency OS'}
            </span>
            {summary.suggestedUpgrade === 'agent_growth' ? (
              <Button onClick={() => handleCheckout('agent_growth')} disabled={actionSku === 'agent_growth'}>
                {actionSku === 'agent_growth' ? 'Starting…' : 'Upgrade now'}
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <a href="mailto:sales@entrestate.com">Contact sales</a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>Upgrade only when you’re ready.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {PLAN_CARDS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div key={plan.id} className={cn('rounded-2xl border p-5 space-y-4', isCurrent && 'border-blue-500/40')}>
                <div>
                  <p className="text-lg font-semibold">{plan.name}</p>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-xl font-bold">{plan.price}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                {plan.id === 'agency_os' ? (
                  <Button variant="outline" asChild>
                    <a href="mailto:sales@entrestate.com">Contact sales</a>
                  </Button>
                ) : (
                  <Button
                    disabled={isCurrent || actionSku === plan.id}
                    onClick={() => handleCheckout(plan.id as BillingSku)}
                  >
                    {isCurrent ? 'Current plan' : actionSku === plan.id ? 'Starting…' : 'Upgrade'}
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add-ons</CardTitle>
          <CardDescription>Add only what you need, anytime.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ADD_ONS.map((addon, index) => (
            <div key={addon.sku}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{addon.label}</p>
                  <p className="text-xs text-muted-foreground">{addon.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{addon.price}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionSku === addon.sku}
                    onClick={() => handleCheckout(addon.sku)}
                  >
                    {actionSku === addon.sku ? 'Starting…' : 'Add'}
                  </Button>
                </div>
              </div>
              {index < ADD_ONS.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
