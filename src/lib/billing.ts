import { authorizedFetch } from '@/lib/auth-fetch';

export type BillingPlanId = 'agent_pro' | 'agent_growth' | 'agency_os';
export type BillingSku =
  | BillingPlanId
  | 'addon_ai_conversations_1000'
  | 'addon_leads_500'
  | 'addon_domain_1'
  | 'addon_sms_bundle';

export type BillingSummary = {
  subscription: {
    plan: BillingPlanId;
    status: 'trial' | 'active' | 'past_due' | 'canceled';
    vatNumber?: string | null;
    monthlySpendCap?: number | null;
    monthlySpendUsed?: number;
    pauseWhenCapReached?: boolean;
    isPausedDueToSpendCap?: boolean;
    paymentModel?: 'prepaid' | 'postpaid';
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
    cancelAtPeriodEnd?: boolean | null;
    trial?: {
      startedAt: string;
      endsAt: string;
      endedAt?: string | null;
      endedReason?: string | null;
      publishedLandingPage?: boolean;
      leadCaptured?: boolean;
      aiConversationCount?: number;
    } | null;
    addOns?: Record<string, number> | null;
  };
  usage: Record<string, number>;
  limits: Record<string, number | null>;
  warnings: Record<string, 'warning_70' | 'warning_90' | 'limit' | null>;
  suggestedUpgrade: BillingPlanId | null;
  seats?: {
    used: number;
    limit: number | null;
  };
  providers?: {
    paypal: boolean;
    ziina: boolean;
  };
};

const PAYMENT_ENDPOINTS = {
  paypal: '/api/payments/paypal/create',
  ziina: '/api/payments/ziina/create',
};

function extractCheckoutUrl(payload: any) {
  if (!payload) return null;
  if (payload.redirect_url) return payload.redirect_url;
  if (payload.payment_url) return payload.payment_url;
  if (payload.data?.payment_url) return payload.data.payment_url;
  if (Array.isArray(payload.links)) {
    const link = payload.links.find((item: any) => item.rel === 'approve' || item.rel === 'payer-action');
    return link?.href || null;
  }
  return null;
}

export async function fetchBillingSummary() {
  const response = await authorizedFetch('/api/billing/summary');
  if (!response.ok) {
    throw new Error('Failed to load billing summary');
  }
  return (await response.json()) as BillingSummary;
}

export async function cancelSubscription() {
  const response = await authorizedFetch('/api/billing/cancel', { method: 'POST' });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Failed to cancel subscription');
  }
  return response.json();
}

export async function startCheckout(sku: BillingSku, provider: 'paypal' | 'ziina' = 'paypal') {
  const response = await authorizedFetch(PAYMENT_ENDPOINTS[provider], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Payment setup failed');
  }
  const checkoutUrl = extractCheckoutUrl(data);
  if (!checkoutUrl) {
    throw new Error('No checkout URL returned');
  }
  return checkoutUrl;
}

export type BillingHistoryEvent = {
  id: string;
  type: string;
  cost?: number;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export async function fetchBillingHistory() {
  const response = await authorizedFetch('/api/billing/history');
  if (!response.ok) {
    throw new Error('Failed to load billing history');
  }
  return (await response.json()) as { history: BillingHistoryEvent[] };
}

export type BillingSettingsUpdate = {
  vatNumber?: string | null;
  monthlySpendCap?: number | null;
  pauseWhenCapReached?: boolean;
  paymentModel?: 'prepaid' | 'postpaid';
};

export async function updateBillingSettings(body: BillingSettingsUpdate) {
  const response = await authorizedFetch('/api/billing/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || 'Failed to update billing settings');
  }
  return response.json();
}
