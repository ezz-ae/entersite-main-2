# V1 System — Campaign Execution Engine

This repository ships a **V1 Campaign Execution Engine** for real-estate brokers/agencies.

## V1 promise
A broker can:
1) Create a **Campaign**
2) Attach or build a **Landing Surface**
3) (Optional) Run **Google Ads** from the dashboard
4) Capture **Leads** into a pipe
5) Automatically run **Smart Sender** (Email → SMS → WhatsApp optional)
6) The platform generates **signals** (events → weights → segments) and **automatically suppresses automation noise** when a lead becomes **Hot**.

---

## 1) V1 scope (frozen)

### Included
- Campaign Spine (campaigns are first-class objects)
- Landing surfaces (builder sites) + external landing URL attachment
- Leads pipe with campaign attribution
- Smart Sender:
  - per-lead runs, queue, retry
  - cron processing on Vercel
  - suppression for hot leads
- Google Ads dashboard bound to campaign (plan draft + runtime binding)
- Audience Network (minimal but real):
  - event bus
  - landing view + form submit events
  - sender sent events
  - agent message events
  - hot/warm/cold segmentation
  - action hooks (hot lead detection + suppression logging)
- Execution visibility:
  - Sender Queue dashboard
  - Audience segments dashboard
  - Audience actions dashboard

### Explicitly excluded (by design)
- Full traditional CRM (pipelines, tasks, comments, team assignments)
- Advanced workflow builder
- Multi-user seat management
- Meta Ads UI
- Segment rule editor
- Heavy analytics charts

---

## 2) High-level architecture

### The spine
**Campaign** is the root object. Modules bind to it via `campaignId`.

### The flow
Landing → Lead → Sender Run → Events → Segments → Actions

### Why this is stable
- Every module emits events; analytics are derived, not hand-authored.
- Sender is deterministic (run id = campaign + lead), so it is restartable.
- Cron is used for background processing (no separate worker required).

---

## 3) Data model (V1)

### Core collections (Firestorm)
- `sites/{siteId}`
  - tenant-scoped via `tenantId`
  - publish fields: `published`, `publishedUrl`, `customDomain`

- `campaigns/{campaignId}`
  - `tenantId`, `ownerUid`, `status`, `objective`
  - `landing`:
    - `{ mode: 'external', url }` OR
    - `{ mode: 'surface', siteId, url }`
  - `bindings`:
    - `ads.*` (planDraft, runtime)
    - `sender.*` (enabled, sequenceDraft)
    - `agent.*` (v1 placeholders)

- `leads/{leadId}` or `tenants/{tenantId}/leads/{leadId}` (depends on existing repo layout)
  - includes `campaignId` when present
  - includes attribution (utm/campaignDocId/siteId)

### Execution state
- `tenants/{tenantId}/senderRuns/{runId}`
  - runId is deterministic: `campaignId__leadId`
  - `status`: queued | running | done | failed | suppressed
  - `stepIndex`, `nextAt`, `history`, `lastError`

### Intelligence state
- `events/{eventId}`
  - tenant-safe events (no PII)

- `tenants/{tenantId}/audience_segments/{segmentId}`
  - Cold/Warm/Hot tiers, counts only

- `tenants/{tenantId}/audience_actions/{actionId}`
  - action log

- `tenants/{tenantId}/audience_profiles/{entityId}`
  - derived profiles: totalWeight, tier, lastEventAt

---

## 4) V1 modules

### A) Campaigns
Purpose: hold the entire execution state for marketing.

Key UI routes:
- `/dashboard/campaigns`
- `/dashboard/campaigns/new`
- `/dashboard/campaigns/[id]`
- `/dashboard/campaigns/[id]/landing`

Key API routes:
- `GET/POST /api/campaigns`
- `GET /api/campaigns/[id]`
- `PATCH /api/campaigns/[id]/landing`
- `PATCH /api/campaigns/[id]/bindings`

Auth model:
- Uses existing `requireRole(req, ALL_ROLES)` pattern.

### B) Landing surfaces
Purpose: provide the URL that Ads + Sender + Agent operate on.

Rules:
- Campaign can attach:
  - an external URL, or
  - a published internal site (surface)

Event emission:
- landing view event (deduped)
- landing form submit event (via lead create)

### C) Google Ads (campaign bound)
Purpose: make Ads run inside campaign, not as a separate tool.

Behavior:
- Auto uses `campaign.landing.url`
- Stores plan draft under campaign bindings
- Stores runtime launch details under campaign bindings

UI:
- `/dashboard/campaigns/[id]/ads`

### D) Leads pipe
Purpose: ingest leads with attribution and allow campaign filtering.

Rules:
- lead record must store `campaignId` if available
- attribution is captured but not treated as PII

### E) Smart Sender (queue + cron)
Purpose: send multi-channel sequences automatically.

Behavior:
- Create/ensure run per lead
- Process due runs
- Retry failures
- Suppress after a lead becomes Hot

UI:
- `/dashboard/campaigns/[id]/messaging`
- `/dashboard/sender-queue`

Cron:
- `/api/cron/sender-process`

### F) Audience Network
Purpose: turn actions into signals into tiers.

Event bus (V1 types wired):
- `landing.view`
- `landing.form_submit`
- `sender.email.sent`, `sender.sms.sent`, `sender.whatsapp.sent`
- `agent.session.start`, `agent.message`

Segments:
- Cold, Warm, Hot

Action hooks:
- Hot lead triggers action log
- Sender suppression triggers action log

UI:
- `/dashboard/audience`
- `/dashboard/audience/actions`

---

## 5) V1 operational runbook

### Environment variables (minimum)
Email (Resend):
- `RESEND_API_KEY`
- sender from address (see `.env.example`)

SMS/WhatsApp (Twilio):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `TWILIO_WHATSAPP_FROM_NUMBER` (optional)

Firebase Admin:
- admin service account key fields (see `.env.example`)

### Deploy
- Deploy to Vercel
- Ensure Cron is enabled via `vercel.json`

### Smoke test checklist
1) Create campaign
2) Attach landing surface
3) Submit a lead (should create lead + event)
4) Enable Smart Sender + send test
5) Create runs for campaign leads
6) Verify sender queue is processing (cron)
7) Verify events exist and segments build

---

## 6) V1 definition of done

V1 is "shippable" when:
- A broker can create a campaign end-to-end without manual backend intervention
- A lead can be captured and automatically receive messaging
- The system can mark/tier the lead (Cold/Warm/Hot) from events
- Sender can suppress automation once the lead becomes Hot
- Dashboards show real execution state (queue, segments, actions)
