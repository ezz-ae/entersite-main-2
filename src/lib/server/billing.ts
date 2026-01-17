import type { DocumentReference, DocumentSnapshot, Firestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export type PlanId = 'agent_pro' | 'agent_growth' | 'agency_os';
export type UsageMetric =
  | 'landing_pages'
  | 'leads'
  | 'campaigns'
  | 'ai_conversations'
  | 'seats'
  | 'email_sends'
  | 'sms_sends'
  | 'domains'
  | 'ai_agents';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled';
export type PlanFeature = 'google_ads' | 'meta_custom_audiences';

export type BillingAddOns = {
  ai_conversations?: number;
  leads?: number;
  domains?: number;
  sms_sends?: number;
  // One-time entitlement: Inventory export/download package.
  inventory_downloads?: number;
};

export type TrialState = {
  startedAt: string;
  endsAt: string;
  endedAt?: string | null;
  endedReason?: string | null;
  publishedLandingPage?: boolean;
  leadCaptured?: boolean;
  aiConversationCount?: number;
};

export type SubscriptionRecord = {
  plan: PlanId;
  status: SubscriptionStatus;
  creditBalance: number; // New field for prepaid credits in AED
  monthlySpendCap?: number | null; // Optional spend cap
  monthlySpendUsed?: number;
  pauseWhenCapReached?: boolean;
  isPausedDueToSpendCap?: boolean;
  vatNumber?: string | null;
  paymentModel?: 'prepaid' | 'postpaid';
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
  trial?: TrialState | null;
  addOns?: BillingAddOns | null;
};

export type BillingSku =
  | PlanId
  | 'addon_ai_conversations_1000'
  | 'addon_leads_500'
  | 'addon_domain_1'
  | 'addon_sms_bundle'
  | 'inventory_download_226'
  | 'top_up_50'
  | 'top_up_100'
  | 'top_up_250';

type MetricPeriod = 'monthly' | 'total';

// Cost per unit of each usage metric in AED.
// This is the foundation for the prepaid model.
export const USAGE_COSTS: Partial<Record<UsageMetric, number>> = {
  ai_conversations: 0.1, // 10 fils per conversation
  email_sends: 0.01,   // 1 fil per email
  sms_sends: 0.2,      // 20 fils per SMS
  leads: 0.05,         // 5 fils per lead stored
  domains: 39,         // 39 AED per domain (one-time, but enforced via usage)
  landing_pages: 5,    // 5 AED per page created
  ai_agents: 10,       // 10 AED per agent created
};

const TRIAL_DAYS = 7;
const TRIAL_CONVERSATION_LIMIT = 25;
const DEFAULT_PLAN: PlanId = 'agent_pro';

const PLAN_FEATURES: Record<PlanId, Record<PlanFeature, boolean>> = {
  agent_pro: {
    google_ads: false,
    meta_custom_audiences: false,
  },
  agent_growth: {
    google_ads: true,
    meta_custom_audiences: true,
  },
  agency_os: {
    google_ads: true,
    meta_custom_audiences: true,
  },
};

export const PLAN_NAMES: Record<PlanId, string> = {
  // V1: single shippable bundle (Builder + Inventory + Chat)
  agent_pro: 'Products Bundle',
  // Keep the other plan names for future (not exposed in V1 pricing page)
  agent_growth: 'Agent Growth',
  agency_os: 'Agency OS',
};

// Pricing is defined in AED internally then converted to USD at checkout.
// Target V1 price: $18/mo. (AED ~ 3.67 per USD)
export const PLAN_PRICES_AED: Record<PlanId, number> = {
  agent_pro: 66, // ~ $18
  agent_growth: 799,
  agency_os: 2499,
};

export const BILLING_SKUS: Record<
  BillingSku,
  {
    type: 'plan' | 'addon' | 'top_up';
    priceAed: number;
    label: string;
    plan?: PlanId;
    addOns?: BillingAddOns;
    creditAed?: number;
  }
> = {
  agent_pro: {
    type: 'plan',
    priceAed: PLAN_PRICES_AED.agent_pro,
    label: 'Products Bundle ($18/mo)',
    plan: 'agent_pro',
  },
  agent_growth: {
    type: 'plan',
    priceAed: PLAN_PRICES_AED.agent_growth,
    label: 'Agent Growth',
    plan: 'agent_growth',
  },
  agency_os: {
    type: 'plan',
    priceAed: PLAN_PRICES_AED.agency_os,
    label: 'Agency OS',
    plan: 'agency_os',
  },
  addon_ai_conversations_1000: {
    type: 'addon',
    priceAed: 99,
    label: '+1,000 Smart conversations',
    addOns: { ai_conversations: 1000 },
  },
  addon_leads_500: {
    type: 'addon',
    priceAed: 49,
    label: '+500 leads storage',
    addOns: { leads: 500 },
  },
  addon_domain_1: {
    type: 'addon',
    priceAed: 39,
    label: 'Extra domain',
    addOns: { domains: 1 },
  },
  addon_sms_bundle: {
    type: 'addon',
    priceAed: 99,
    label: 'SMS bundle',
    addOns: { sms_sends: 1000 },
  },
  inventory_download_226: {
    type: 'addon',
    // Target V1 one-time: $226
    priceAed: 829, // ~ $226
    label: 'Inventory download (one-time)',
    addOns: { inventory_downloads: 1 },
  },
  top_up_50: {
    type: 'top_up',
    priceAed: 50,
    label: '50 AED Credit',
    creditAed: 50,
  },
  top_up_100: {
    type: 'top_up',
    priceAed: 100,
    label: '100 AED Credit',
    creditAed: 100,
  },
  top_up_250: {
    type: 'top_up',
    priceAed: 250,
    label: '250 AED Credit',
    creditAed: 250,
  },
};


export const PLAN_LIMITS: Record<PlanId, Record<UsageMetric, number | null>> = {
  agent_pro: {
    ai_agents: 1,
    landing_pages: 3,
    leads: 300,
    campaigns: null,
    ai_conversations: 1000,
    seats: 1,
    email_sends: 1000,
    sms_sends: null,
    domains: 1,
  },
  agent_growth: {
    ai_agents: 3,
    landing_pages: 10,
    leads: 2000,
    campaigns: null,
    ai_conversations: 5000,
    seats: 3,
    email_sends: 5000,
    sms_sends: 1000,
    domains: 1,
  },
  agency_os: {
    ai_agents: 25,
    landing_pages: 100,
    leads: 25000,
    campaigns: null,
    ai_conversations: 50000,
    seats: 25,
    email_sends: 50000,
    sms_sends: 10000,
    domains: 10,
  },
};

const METRIC_PERIOD: Record<UsageMetric, MetricPeriod> = {
  landing_pages: 'total',
  leads: 'total',
  campaigns: 'monthly',
  ai_conversations: 'monthly',
  seats: 'total',
  email_sends: 'monthly',
  sms_sends: 'monthly',
  domains: 'total',
  ai_agents: 'total',
};

const PLAN_UPGRADE_MAP: Record<PlanId, PlanId | null> = {
  agent_pro: 'agent_growth',
  agent_growth: 'agency_os',
  agency_os: null,
};

export class InsufficientCreditError extends Error {
  cost: number;
  balance: number;
  constructor(cost: number, balance: number) {
    super(`Insufficient credit. Cost: ${cost}, Balance: ${balance}`);
    this.name = 'InsufficientCreditError';
    this.cost = cost;
    this.balance = balance;
  }
}

export class SpendCapExceededError extends Error {
  cap: number;
  constructor(cap: number) {
    super(`Monthly spend cap of ${cap} exceeded.`);
    this.name = 'SpendCapExceededError';
    this.cap = cap;
  }
}

export class FeatureAccessError extends Error {
  feature: PlanFeature;
  plan: PlanId;
  suggestedUpgrade: PlanId | null;
  constructor(feature: PlanFeature, plan: PlanId, suggestedUpgrade: PlanId | null) {
    super(`Feature ${feature} not available on plan ${plan}`);
    this.name = 'FeatureAccessError';
    this.feature = feature;
    this.plan = plan;
    this.suggestedUpgrade = suggestedUpgrade;
  }
}

export function getSuggestedUpgrade(plan: PlanId) {
  return PLAN_UPGRADE_MAP[plan] || null;
}

export function resolveBillingSku(value?: string | null): BillingSku | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[^a-z0-9_]+/g, '_');
  if (normalized in BILLING_SKUS) {
    return normalized as BillingSku;
  }
  if (normalized.includes('growth')) return 'agent_growth';
  if (normalized.includes('agency')) return 'agency_os';
  if (normalized.includes('pro')) return 'agent_pro';
  return null;
}

function normalizePlanId(value?: string | null): PlanId | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/[^a-z0-9_]+/g, '');
  if (normalized.includes('agency')) return 'agency_os';
  if (normalized.includes('growth')) return 'agent_growth';
  if (normalized.includes('pro')) return 'agent_pro';
  return null;
}

function normalizeStatus(value?: string | null): SubscriptionStatus {
  if (!value) return 'trial';
  const normalized = value.toLowerCase();
  if (normalized.includes('past')) return 'past_due';
  if (normalized.includes('cancel')) return 'canceled';
  if (normalized.includes('trial')) return 'trial';
  return 'active';
}

function normalizeAddOns(value: any): BillingAddOns {
  if (!value || typeof value !== 'object') return {};
  return {
    ai_conversations: Number(value.ai_conversations || 0),
    leads: Number(value.leads || 0),
    domains: Number(value.domains || 0),
    sms_sends: Number(value.sms_sends || 0),
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function createTrialState(now = new Date()): TrialState {
  return {
    startedAt: now.toISOString(),
    endsAt: addDays(now, TRIAL_DAYS).toISOString(),
    endedAt: null,
    endedReason: null,
    publishedLandingPage: false,
    leadCaptured: false,
    aiConversationCount: 0,
  };
}

function normalizeTrial(value: any, now: Date, status: SubscriptionStatus): TrialState | null {
  if (!value) {
    return status === 'trial' ? createTrialState(now) : null;
  }
  const startedAt = value.startedAt ? String(value.startedAt) : now.toISOString();
  const endsAt = value.endsAt ? String(value.endsAt) : addDays(new Date(startedAt), TRIAL_DAYS).toISOString();
  return {
    startedAt,
    endsAt,
    endedAt: value.endedAt ? String(value.endedAt) : null,
    endedReason: value.endedReason ? String(value.endedReason) : null,
    publishedLandingPage: Boolean(value.publishedLandingPage),
    leadCaptured: Boolean(value.leadCaptured),
    aiConversationCount: Number(value.aiConversationCount || 0),
  };
}

function normalizeSubscription(
  data: Record<string, unknown> | undefined,
  now = new Date(),
): SubscriptionRecord {
  const rawPlan = typeof data?.plan === 'string' ? data.plan : null;
  const rawStatus = typeof data?.status === 'string' ? data.status : null;
  const plan = normalizePlanId(rawPlan) || DEFAULT_PLAN;
  const status = normalizeStatus(rawStatus);
  const trial = normalizeTrial(data?.trial, now, status);
  return {
    plan,
    status,
    creditBalance: Number(data?.creditBalance || 0),
    monthlySpendCap:
      data?.monthlySpendCap === null || data?.monthlySpendCap === undefined
        ? null
        : Number(data.monthlySpendCap),
    monthlySpendUsed: Number(data?.monthlySpendUsed || 0),
    pauseWhenCapReached: typeof data?.pauseWhenCapReached === 'boolean' ? data.pauseWhenCapReached : false,
    isPausedDueToSpendCap:
      typeof data?.isPausedDueToSpendCap === 'boolean' ? data.isPausedDueToSpendCap : false,
    vatNumber: typeof data?.vatNumber === 'string' ? data.vatNumber : null,
    paymentModel: data?.paymentModel === 'postpaid' ? 'postpaid' : 'prepaid',
    currentPeriodStart: data?.currentPeriodStart ? String(data.currentPeriodStart) : null,
    currentPeriodEnd: data?.currentPeriodEnd ? String(data.currentPeriodEnd) : null,
    cancelAtPeriodEnd:
      typeof data?.cancelAtPeriodEnd === 'boolean' ? data.cancelAtPeriodEnd : false,
    trial,
    addOns: normalizeAddOns(data?.addOns),
  };
}

export function getCurrentPeriodKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getEffectiveLimit(
  plan: PlanId,
  metric: UsageMetric,
  addOns?: BillingAddOns | null,
) {
  const base = PLAN_LIMITS[plan]?.[metric];
  if (base === null || base === undefined) {
    return base ?? null;
  }
  const addonValue = Number(addOns?.[metric as keyof BillingAddOns] || 0);
  return base + addonValue;
}

function isUsageAllowed(status: SubscriptionStatus) {
  return status === 'trial' || status === 'active';
}

function getUsageDocId(metric: UsageMetric, now = new Date()) {
  return METRIC_PERIOD[metric] === 'monthly' ? getCurrentPeriodKey(now) : 'total';
}

function getUsageMetrics() {
  return Object.keys(METRIC_PERIOD) as UsageMetric[];
}

function getTrialStateStatus(trial: TrialState | null, now: Date) {
  if (!trial) {
    return { isExpired: false, reason: null };
  }
  if (trial.endedAt) {
    return { isExpired: true, reason: trial.endedReason || 'ended' };
  }
  if (new Date(trial.endsAt).getTime() <= now.getTime()) {
    return { isExpired: true, reason: 'trial_time_elapsed' };
  }
  return { isExpired: false, reason: null };
}

export function planLimitErrorResponse(error: PlanLimitError) {
  return {
    error: 'limit_reached',
    limit_type: error.metric,
    current_usage: error.currentUsage,
    allowed_limit: error.limit,
    suggested_upgrade: error.suggestedUpgrade,
  };
}

export function featureAccessErrorResponse(error: FeatureAccessError) {
  return {
    error: 'feature_locked',
    feature: error.feature,
    plan: error.plan,
    suggested_upgrade: error.suggestedUpgrade,
  };
}

export async function logBillingEvent(
  db: Firestore,
  tenantId: string,
  event: Record<string, unknown>,
) {
  try {
    await db
      .collection('tenants')
      .doc(tenantId)
      .collection('billing_events')
      .add({
        ...event,
        createdAt: FieldValue.serverTimestamp(),
      });
    console.log(
      JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        route: 'billing_event',
        requestId: 'system',
        tenantId,
        outcome: 'success',
        message: 'billing.event',
        metadata: event,
      }),
    );
  } catch (error) {
    console.error('[billing] failed to log event', error);
    console.log(
      JSON.stringify({
        level: 'error',
        timestamp: new Date().toISOString(),
        route: 'billing_event',
        requestId: 'system',
        tenantId,
        outcome: 'failure',
        message: 'billing.event.error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    );
  }
}

export async function ensureSubscription(db: Firestore, tenantId: string): Promise<SubscriptionRecord> {
  const ref = db.collection('subscriptions').doc(tenantId);
  const snap = await ref.get();
  if (snap.exists) {
    return normalizeSubscription(snap.data(), new Date());
  }

  const now = new Date();
  const subscription: SubscriptionRecord = {
    plan: DEFAULT_PLAN,
    status: 'trial',
    trial: createTrialState(now),
    creditBalance: 0, // Initialize with zero credit
    monthlySpendCap: null,
    monthlySpendUsed: 0,
    pauseWhenCapReached: false,
    isPausedDueToSpendCap: false,
    vatNumber: null,
    paymentModel: 'prepaid',
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    addOns: {},
  };

  await ref.set(
    {
      ...subscription,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  await logBillingEvent(db, tenantId, {
    type: 'subscription_created',
    plan: subscription.plan,
    status: subscription.status,
  });

  return subscription;
}

export async function getSubscription(db: Firestore, tenantId: string): Promise<SubscriptionRecord> {
  const doc = await db.collection('subscriptions').doc(tenantId).get();
  if (!doc.exists) {
    // Return a default object for a non-existent subscription
    return {
      plan: DEFAULT_PLAN,
      status: 'trial',
      trial: createTrialState(new Date()),
      creditBalance: 0,
      monthlySpendCap: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      addOns: {},
    };
  }
  return normalizeSubscription(doc.data(), new Date());
}

type UsageUpdate = {
  metric: UsageMetric;
  increment: number;
};

export async function enforceUsageLimit(
  db: Firestore,
  tenantId: string,
  metric: UsageMetric,
  increment = 1,
) {
  return enforceUsageLimits(db, tenantId, [{ metric, increment }]);
}

export async function enforceUsageLimits(
  db: Firestore,
  tenantId: string,
  updates: UsageUpdate[],
) {
  const subscriptionRef = db.collection('subscriptions').doc(tenantId);
  const now = new Date();

  // 1. Calculate total cost of this usage request
  const totalCost = updates.reduce((sum, update) => {
    const costPerUnit = USAGE_COSTS[update.metric] || 0;
    return sum + (costPerUnit * update.increment);
  }, 0);

  try {
    await db.runTransaction(async (tx) => {
      const subscriptionSnap = await tx.get(subscriptionRef);
      const subscription = normalizeSubscription(subscriptionSnap.data(), now);

      // 2. Check for sufficient credit balance
      if (subscription.creditBalance < totalCost) {
        throw new InsufficientCreditError(totalCost, subscription.creditBalance);
      }

      const effectiveStatus = subscription.status;
      if (!isUsageAllowed(effectiveStatus)) {
        // Still useful to prevent usage on e.g. canceled accounts.
        throw new Error(`Usage not allowed for status: ${effectiveStatus}`);
      }
      
      if (subscription.isPausedDueToSpendCap) {
        throw new SpendCapExceededError(subscription.monthlySpendCap ?? 0);
      }

      const cap = subscription.monthlySpendCap;
      if (cap !== null && cap !== undefined) {
        const currentSpend = Number(subscription.monthlySpendUsed || 0);
        if (currentSpend + totalCost > cap) {
          if (subscription.pauseWhenCapReached) {
            tx.set(
              subscriptionRef,
              {
                isPausedDueToSpendCap: true,
                updatedAt: FieldValue.serverTimestamp(),
              },
              { merge: true },
            );
          }
          throw new SpendCapExceededError(cap);
        }
      }
      
      // 3. Decrement credit balance
      tx.set(subscriptionRef, {
        creditBalance: FieldValue.increment(-totalCost),
        monthlySpendUsed: FieldValue.increment(totalCost),
        isPausedDueToSpendCap: false,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      
      // 4. Increment usage counters (still useful for analytics and spend caps)
      updates.forEach((update) => {
        const docId = getUsageDocId(update.metric, now);
        const usageRef = db.collection('tenants').doc(tenantId).collection('usage').doc(docId);
        tx.set(
          usageRef,
          {
            period: docId,
            [update.metric]: FieldValue.increment(update.increment),
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
      });
    });

    await logBillingEvent(db, tenantId, {
      type: 'usage_billed',
      cost: totalCost,
      metrics: updates.map(u => u.metric).join(','),
    });

  } catch (error) {
    if (error instanceof InsufficientCreditError) {
      await logBillingEvent(db, tenantId, {
        type: 'insufficient_credit',
        cost: error.cost,
        balance: error.balance,
      });
    }
    if (error instanceof SpendCapExceededError) {
      await logBillingEvent(db, tenantId, {
        type: 'spend_cap_exceeded',
        cap: error.cap,
      });
    }
    throw error;
  }
}


export class PlanLimitError extends Error {
  metric: UsageMetric;
  limit: number | null;
  currentUsage: number;
  plan: PlanId;
  status: SubscriptionStatus;
  suggestedUpgrade: PlanId | null;
  constructor(options: {
    metric: UsageMetric;
    limit: number | null;
    currentUsage: number;
    plan: PlanId;
    status: SubscriptionStatus;
    suggestedUpgrade: PlanId | null;
  }) {
    super(`Plan limit reached for ${options.metric}`);
    this.name = 'PlanLimitError';
    this.metric = options.metric;
    this.limit = options.limit;
    this.currentUsage = options.currentUsage;
    this.plan = options.plan;
    this.status = options.status;
    this.suggestedUpgrade = options.suggestedUpgrade;
  }
}

export async function checkUsageLimit(
  db: Firestore,
  tenantId: string,
  metric: UsageMetric,
  increment = 1,
) {
  const now = new Date();
  const subscription = await ensureSubscription(db, tenantId);

  if (!isUsageAllowed(subscription.status)) {
    throw new Error(`Usage not allowed for status: ${subscription.status}`);
  }

  // For metrics billed by usage, check credit balance.
  if (metric in USAGE_COSTS) {
    const cost = (USAGE_COSTS[metric] || 0) * increment;
    if (subscription.creditBalance < cost) {
      throw new InsufficientCreditError(cost, subscription.creditBalance);
    }
    return { balance: subscription.creditBalance, cost };
  }

  // For metrics with hard limits (like seats), check plan limits.
  const limit = getEffectiveLimit(subscription.plan, metric, subscription.addOns);
  if (limit === null) {
    return { current: 0, limit }; // No limit
  }

  const docId = getUsageDocId(metric, now);
  const usageSnap = await db
    .collection('tenants')
    .doc(tenantId)
    .collection('usage')
    .doc(docId)
    .get();
  const current = Number(usageSnap.exists ? usageSnap.data()?.[metric] || 0 : 0);

  if (current >= limit) {
    throw new PlanLimitError({
      metric,
      limit,
      currentUsage: current,
      plan: subscription.plan,
      status: subscription.status,
      suggestedUpgrade: getSuggestedUpgrade(subscription.plan),
    });
  }

  return { current, limit };
}


export async function recordTrialEvent(
  db: Firestore,
  tenantId: string,
  event: 'landing_page_published' | 'lead_captured',
) {
  const now = new Date();
  const subscriptionRef = db.collection('subscriptions').doc(tenantId);
  const subscriptionSnap = await subscriptionRef.get();
  const subscription = subscriptionSnap.exists
    ? normalizeSubscription(subscriptionSnap.data(), now)
    : await ensureSubscription(db, tenantId);

  if (subscription.status !== 'trial' || !subscription.trial) {
    return;
  }

  let updatedTrial = { ...subscription.trial };
  if (event === 'landing_page_published') {
    updatedTrial.publishedLandingPage = true;
  }
  if (event === 'lead_captured') {
    updatedTrial.leadCaptured = true;
  }

  const milestoneReached =
    (updatedTrial.publishedLandingPage && updatedTrial.leadCaptured) ||
    (updatedTrial.aiConversationCount || 0) >= TRIAL_CONVERSATION_LIMIT;

  let status: SubscriptionStatus | undefined;
  if (milestoneReached) {
    const reachedConversationLimit =
      (updatedTrial.aiConversationCount || 0) >= TRIAL_CONVERSATION_LIMIT;
    updatedTrial = {
      ...updatedTrial,
      endedAt: updatedTrial.endedAt || now.toISOString(),
      endedReason:
        updatedTrial.endedReason ||
        (reachedConversationLimit ? 'trial_ai_conversation_limit' : 'trial_milestone_reached'),
    };
    status = 'past_due';
  }

  await subscriptionRef.set(
    {
      trial: updatedTrial,
      ...(status ? { status } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  if (status) {
    await logBillingEvent(db, tenantId, {
      type: 'trial_ended',
      reason: updatedTrial.endedReason || 'trial_milestone_reached',
    });
  }
}

export async function requirePlanFeature(
  db: Firestore,
  tenantId: string,
  feature: PlanFeature,
) {
  const subscription = await ensureSubscription(db, tenantId);
  if (!isUsageAllowed(subscription.status)) {
    throw new PlanLimitError({
      metric: 'campaigns',
      limit: 0,
      currentUsage: 0,
      plan: subscription.plan,
      status: subscription.status,
      suggestedUpgrade: getSuggestedUpgrade(subscription.plan),
    });
  }

  if (!PLAN_FEATURES[subscription.plan]?.[feature]) {
    throw new FeatureAccessError(feature, subscription.plan, getSuggestedUpgrade(subscription.plan));
  }

  return subscription;
}

export async function getUsageSnapshot(db: Firestore, tenantId: string) {
  const metrics = getUsageMetrics();
  const now = new Date();
  const docIds = new Set(metrics.map((metric) => getUsageDocId(metric, now)));
  const snapshots = await Promise.all(
    Array.from(docIds).map((docId) =>
      db.collection('tenants').doc(tenantId).collection('usage').doc(docId).get(),
    ),
  );
  const dataByDocId = new Map(
    snapshots.map((snap) => [snap.id, (snap.data() as Record<string, number>) || {}]),
  );

  const usage: Record<UsageMetric, number> = {} as Record<UsageMetric, number>;
  metrics.forEach((metric) => {
    const docId = getUsageDocId(metric, now);
    const data = dataByDocId.get(docId) || {};
    usage[metric] = Number(data[metric] || 0);
  });

  return usage;
}

export async function getBillingSummary(db: Firestore, tenantId: string) {
  const subscription = await ensureSubscription(db, tenantId);
  const usage = await getUsageSnapshot(db, tenantId);
  const limits: Record<UsageMetric, number | null> = {} as Record<UsageMetric, number | null>;
  const warnings: Record<UsageMetric, 'warning_70' | 'warning_90' | 'limit' | null> = {} as Record<
    UsageMetric,
    'warning_70' | 'warning_90' | 'limit' | null
  >;

  getUsageMetrics().forEach((metric) => {
    const limit = getEffectiveLimit(subscription.plan, metric, subscription.addOns);
    limits[metric] = limit ?? null;
    if (limit === null) {
      warnings[metric] = null;
      return;
    }
    if (limit === 0) {
      warnings[metric] = 'limit';
      return;
    }
    const ratio = usage[metric] / limit;
    if (ratio >= 1) {
      warnings[metric] = 'limit';
    } else if (ratio >= 0.9) {
      warnings[metric] = 'warning_90';
    } else if (ratio >= 0.7) {
      warnings[metric] = 'warning_70';
    } else {
      warnings[metric] = null;
    }
  });

  return {
    subscription,
    usage,
    limits,
    warnings,
    suggestedUpgrade: getSuggestedUpgrade(subscription.plan),
  };
}
