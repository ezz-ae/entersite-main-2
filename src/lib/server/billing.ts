import type { Firestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export type PlanId = 'starter' | 'pro' | 'agency';
export type UsageMetric =
  | 'landing_pages'
  | 'leads'
  | 'campaigns'
  | 'ai_conversations'
  | 'seats'
  | 'email_sends'
  | 'sms_sends';

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

export const PLAN_LIMITS: Record<PlanId, Record<UsageMetric, number>> = {
  starter: {
    landing_pages: 3,
    leads: 500,
    campaigns: 3,
    ai_conversations: 500,
    seats: 1,
    email_sends: 500,
    sms_sends: 200,
  },
  pro: {
    landing_pages: 10,
    leads: 2000,
    campaigns: 10,
    ai_conversations: 5000,
    seats: 5,
    email_sends: 5000,
    sms_sends: 1500,
  },
  agency: {
    landing_pages: 50,
    leads: 10000,
    campaigns: 50,
    ai_conversations: 20000,
    seats: 20,
    email_sends: 20000,
    sms_sends: 5000,
  },
};

export class PlanLimitError extends Error {
  metric: UsageMetric;
  limit: number;
  constructor(metric: UsageMetric, limit: number) {
    super(`Plan limit reached for ${metric}`);
    this.name = 'PlanLimitError';
    this.metric = metric;
    this.limit = limit;
  }
}

export type SubscriptionRecord = {
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean | null;
};

export function getCurrentPeriodKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export async function getSubscription(db: Firestore, tenantId: string): Promise<SubscriptionRecord> {
  const doc = await db.collection('subscriptions').doc(tenantId).get();
  if (!doc.exists) {
    return { plan: 'starter', status: 'active' };
  }
  const data = doc.data() || {};
  const plan = (data.plan as PlanId) || 'starter';
  const status = (data.status as SubscriptionStatus) || 'active';
  return {
    plan,
    status,
    currentPeriodStart: (data.currentPeriodStart as string) || null,
    currentPeriodEnd: (data.currentPeriodEnd as string) || null,
    cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
  };
}

export async function enforceUsageLimit(
  db: Firestore,
  tenantId: string,
  metric: UsageMetric,
  increment = 1,
) {
  const subscription = await getSubscription(db, tenantId);
  if (subscription.status === 'canceled' || subscription.status === 'inactive') {
    throw new PlanLimitError(metric, 0);
  }

  const planLimits = PLAN_LIMITS[subscription.plan] || PLAN_LIMITS.starter;
  const limit = planLimits[metric];
  const periodKey = getCurrentPeriodKey();
  const usageRef = db.collection('tenants').doc(tenantId).collection('usage').doc(periodKey);

  await db.runTransaction(async (tx) => {
    const usageSnap = await tx.get(usageRef);
    const usageData = usageSnap.exists ? usageSnap.data() || {} : {};
    const current = Number(usageData[metric] || 0);
    if (current + increment > limit) {
      throw new PlanLimitError(metric, limit);
    }
    tx.set(
      usageRef,
      {
        period: periodKey,
        [metric]: FieldValue.increment(increment),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  });
}
