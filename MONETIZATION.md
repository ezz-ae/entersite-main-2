# Monetization

## Pricing (Fixed)
- Agent Pro — 299 AED / month
  - 1 AI Instagram DM Agent
  - 3 landing pages
  - UAE projects access
  - Meta audience templates
  - Email: 1,000/month
  - SMS: pay-as-you-go
  - Leads: up to 300
  - 1 custom domain
  - AI conversations: 1,000/month
  - Seats: 1
- Agent Growth — 799 AED / month
  - 3 AI agents
  - 10 landing pages
  - Google Ads launcher
  - Meta custom audiences + lookalikes
  - Email: 5,000/month
  - SMS credits included
  - Leads: up to 2,000
  - Seats: 3
  - AI conversations: 5,000/month
- Agency OS — from 2,499 AED / month (manual sale)

## Trial Logic
- New tenants start on a 7‑day free trial.
- Trial ends immediately when:
  - First landing page is published AND first real lead is captured, or
  - AI agent reaches 25 conversations.
- Trial does not block setup; it only gates new actions after it ends.

Trial data is stored under `subscriptions/{tenantId}.trial`.

## Enforcement (Server‑Side Only)
Every action checks plan + usage before executing:
- Create landing page (`/api/sites` and `/api/generate/landing`)
- Publish landing page (`/api/publish/page`, `/api/publish/vercel`)
- Add lead (`/api/leads`, `/api/leads/create`)
- Start campaign (`/api/email/campaign`, `/api/sms/campaign`, `/api/ads/google/sync`)
- Send email or SMS (`/api/email/send`, `/api/sms/send`)
- Process AI conversation (`/api/chat`, `/api/bot/*/chat`)
- Create AI agent (`/api/agent/train`)
- Connect domain (`/api/domains`, `/api/domains/request`)
- Invite seat (`/api/team/invites`)

If a limit is reached, the API returns:
```
{
  "error": "limit_reached",
  "limit_type": "leads",
  "current_usage": 298,
  "allowed_limit": 300,
  "suggested_upgrade": "agent_growth"
}
```

Feature gating:
- Google Ads launcher requires Agent Growth+.
- Meta custom audiences (imported lists) require Agent Growth+.

## Usage Counters
Monthly counters:
- `ai_conversations`
- `email_sends`
- `sms_sends`
- `campaigns`

Total counters:
- `landing_pages`
- `leads`
- `domains`
- `ai_agents`
- `seats` (enforced from members + pending invites)

Usage stored at: `tenants/{tenantId}/usage/{period}` where `{period}` is `YYYY-MM` or `total`.

## Add‑Ons
Add-ons increase limits immediately:
- +1,000 AI conversations — 99 AED (`addon_ai_conversations_1000`)
- +500 leads storage — 49 AED (`addon_leads_500`)
- Extra domain — 39 AED (`addon_domain_1`)
- SMS bundle — 99 AED (`addon_sms_bundle`)

Add-ons are stored as increments in `subscriptions/{tenantId}.addOns`.

## Subscription Lifecycle
States:
- `trial`
- `active`
- `past_due`
- `canceled`

Payment success sets:
- `status = active`
- `currentPeriodStart` / `currentPeriodEnd`
- `trial.endedAt`

Cancellation sets:
- `cancelAtPeriodEnd = true` (access remains until period end)

## Webhooks
PayPal and Ziina webhooks update:
- `subscriptions/{tenantId}` status/plan
- billing add-ons
- audit logs

## Billing Audit Logs
Stored under: `tenants/{tenantId}/billing_events`
Includes subscription updates, add-ons, and limit blocks.

## UI
Billing UI lives at:
- `/dashboard/billing`

Shows:
- Current plan + status
- Usage meters + 70% / 90% warnings
- Upgrade buttons
- Cancel subscription
- Add-ons

## Environment Variables
Required for payments:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID`
- `ZIINA_API_KEY`
- `ZIINA_WEBHOOK_SECRET`

Optional:
- `PAYPAL_API_BASE`
- `ZIINA_BASE_URL`

## Notes
- Core product flows are unchanged.
- Limits are enforced server-side only; UI simply reflects usage state.
