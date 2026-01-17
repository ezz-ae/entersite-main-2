ENTRESTATE OS — SYSTEM FEED MAP (V1)

GOAL
Implementation-ready map of modules, feeds, storage, APIs, scoping, and events.

RULES
- CampaignId is the spine key for all outputs.
- tenantId exists on every private doc.
- Public reads only from pages_public and inventory_projects.
- senderEvents and billing_events are append-only.
- Handoff ticket creation suppresses automation.
- Audience local/global are derived from events + CRM changes (no manual edits).
- Never store secrets, tokens, raw provider payloads, or payment card data.

----------------------------------------------------------------------------
A) MODULE INVENTORY TABLE

Module | Purpose | Inputs (feeds) | Outputs (receives) | Firestore collections | API routes | Events emitted | Sync/Async | Scope
---|---|---|---|---|---|---|---|---
Site Builder | Build private surfaces from blocks | UI blocks, media, forms | pages_private, sites | sites, pages_private (or sites/{siteId}/pages) | /api/sites, /api/publish/page (draft) | site.saved, page.saved | Sync | Tenant
Publisher | Promote private pages to public | pages_private, publish settings | pages_public | pages_public | /api/publish/page | page.published, page.unpublished | Sync | Public reads
Inventory | Read-only market projects | inventory feed | inventory_projects | inventory_projects | /api/inventory/search | inventory.search | Sync | Public reads
Campaign Spine | Bind everything to campaignId | user inputs, site selection | campaigns | campaigns | /api/campaigns/create, /api/campaigns/[id] | campaign.created, campaign.updated | Sync | Tenant
AI Blueprint | Generate plan from Quick Details | quick details, site context, inventory | campaign plan draft | campaigns (plan), ads_campaigns (draft) | /api/ads/google/plan | blueprint.created | Sync | Tenant
Google Ads | Plan/sync/runtime status | campaign, plan, landing URL | ads drafts + runtime status | ads_campaigns, ads_runtime | /api/ads/google/plan, /api/ads/google/sync | ads.plan.created, ads.synced, ads.runtime.updated | Async (sync) | Tenant
CRM Leads | Capture + status + notes | forms, agent chat, imports | leads + notes | leads, leads_notes | /api/leads/create, /api/leads/update, /api/leads/notes | lead.created, lead.status.updated, lead.note.added | Sync | Tenant
Smart Sender | Deterministic follow-ups | leads, campaign, agent settings | sender runs + events | senderSequences, senderRuns, senderEvents | /api/sender/process (cron), /api/sender/retry, /api/sender/sequences | sender.step.sent, sender.step.skipped, sender.step.failed, sender.suppressed_hot | Async (cron) | Tenant
Agent / Learning Settings | Agent behavior + contact rules | agent setup bars | campaignAgentSettings | campaignAgentSettings | /api/agent/profile, /api/agent/train | agent.settings.updated | Sync | Tenant
Audience | Local + global intent pools | leads, sender, ads intent | audiences_local, audiences_global | audiences_local, audiences_global | /api/audience/build, /api/audience/segments/list, /api/audience/global | audience.segment.updated, audience.signal.ingested | Async | Local tenant + global public-derived
Scenario / Risk Control | Stop-loss + transitions | Ads/runtime, sender stats, fairness | Risk flags + actions | campaigns (risk), jobs | /api/risk/apply | risk.applied, automation.paused | Async | Tenant
Reporting | Tiles + fairness + intent clusters | senderEvents, ads_runtime, leads | rollups | reporting_rollups (derived) | /api/reports/summary | report.rollup.updated | Async (rollup job) | Tenant
Billing | Wallet funding + charges | senderEvents, ads runtime, handoffs | billing_events, wallets | billing_events, wallets | /api/billing/webhook/*, /api/billing/summary, /api/billing/wallet | billing.event.created, wallet.updated | Async | Tenant
Jobs | Async state machine | Background tasks | Job status | jobs | /api/cron/* | job.started, job.succeeded, job.failed | Async | Tenant
Domains | Custom domain requests | Domain request | Domain requests | domains | /api/domains/request | domain.requested, domain.verified | Async | Tenant
Health/Observability | Service health + error capture | app events | logs/metrics | health_checks (optional) | /api/health, /api/health/monetization | health.check | Sync | Public read (health) + internal

----------------------------------------------------------------------------
B) DATA FLOW GRAPH (TEXT)

QuickDetails -> AI.Blueprint -> Ads.Plan -> Ads.Sync -> Ads.Runtime -> Reporting
SiteBuilder.blocks -> pages_private -> Publisher -> pages_public -> Public.Views -> Leads.Create
Inventory.inventory_projects -> Landing.Content -> Leads.Create
Campaigns.spine -> Ads.Plan -> Ads.Runtime
Campaigns.spine -> Sender.Sequences -> Sender.Runs -> Sender.Events -> Reporting
Leads.Create -> Sender.Runs -> Sender.Decisions -> Audience.Local -> Reporting
Agent.Settings -> Agent.Chat -> Leads.Create -> Handoff.Tickets -> Sender.Suppression
Ads.Runtime -> Risk.Control -> Campaigns.status -> Sender.Pause
CRM.LeadStatus -> Audience.Local -> AI.Blueprint (feedback loop)
Sender.Events -> Billing.Events -> Wallets
Audience.Local -> Audience.Global (anonymized aggregation) -> AI.Blueprint (learning loop)
Reporting.Rollups -> Risk.Control (threshold checks)

----------------------------------------------------------------------------
C) FIRESTORE SOURCE-OF-TRUTH POLICY

Campaign: SoT campaigns; Derived ads_campaigns, ads_runtime, reporting_rollups; Publish path none; Retention: keep indefinitely.
Site: SoT sites; Derived pages_private; Publish path pages_public; Retention: keep indefinitely.
Page (private): SoT pages_private; Derived pages_public; Publish path pages_public; Retention: keep indefinitely for published, draft purge optional after 180 days.
Page (public): SoT pages_public; Derived none; Publish path public; Retention: keep indefinitely until unpublish.
Inventory project: SoT inventory_projects; Derived none; Publish path public; Retention: keep indefinitely (read-only).
Lead: SoT leads; Derived audiences_local, reporting_rollups; Publish path none; Retention: keep indefinitely.
Lead note: SoT leads_notes; Derived none; Retention: keep indefinitely.
Sender sequence: SoT senderSequences; Derived none; Retention: keep indefinitely (versioned).
Sender run: SoT senderRuns; Derived senderEvents; Retention: keep 24 months.
Sender event: SoT senderEvents (immutable); Derived reporting_rollups, billing_events; Retention: keep 24 months.
Handoff ticket: SoT handoffTickets; Derived none; Retention: keep 24 months.
Audience local: SoT audiences_local (derived from events); Derived none; Retention: keep 24 months.
Audience global: SoT audiences_global (derived, no PII); Retention: keep 24 months.
Billing event: SoT billing_events (immutable); Derived reporting_rollups; Retention: keep 7 years.
Wallet: SoT wallets; Derived none; Retention: keep indefinitely.
Ads draft: SoT ads_campaigns; Derived ads_runtime; Retention: keep 24 months.
Ads runtime: SoT ads_runtime (snapshot); Derived reporting_rollups; Retention: keep 90 days.
Job: SoT jobs; Derived none; Retention: keep 30 days after completion.
Domains: SoT domains; Derived none; Retention: keep indefinitely.
Health checks: SoT health_checks (optional); Retention: keep 30 days.

Never store (anywhere):
- Provider secrets, API keys, refresh tokens, OAuth client secrets.
- Raw provider webhook payloads (store normalized fields only).
- Payment card data, full bank details, or any PCI data.
- Full chat transcripts with PII if not required; store redacted summaries or references.
- WhatsApp/SMS raw delivery payloads beyond messageId + status.
- Admin service account JSON inside Firestore.

----------------------------------------------------------------------------
D) IMPLEMENTATION CHECKLIST

Schemas required
- campaigns with tenantId, campaignId, status, bindings, landing.
- sites, pages_private, pages_public with tenantId, siteId, publish metadata.
- inventory_projects read-only schema.
- leads, leads_notes with tenantId, campaignId, direction, hotScore.
- senderSequences, senderRuns, senderEvents (deterministic runId).
- campaignAgentSettings with agent bars.
- audiences_local, audiences_global (derived).
- billing_events, wallets.
- jobs, handoffTickets, domains, reporting_rollups.

Indexes required
- senderRuns: (tenantId, status, nextAt), (tenantId, campaignId, status, updatedAt), (tenantId, campaignId, updatedAt).
- senderEvents: (tenantId, createdAt), (tenantId, campaignId, createdAt), (tenantId, type, createdAt).
- senderSequences: (tenantId, campaignId, status, updatedAt).
- audiences_local: (tenantId, tags, lastSignalAt).
- billing_events: (tenantId, createdAt), (tenantId, eventType, createdAt), (tenantId, campaignId, createdAt).
- leads: (tenantId, campaignId, updatedAt), (tenantId, direction, updatedAt).

Minimal API endpoints required
- /api/campaigns/create, /api/campaigns/[id]
- /api/ads/google/plan, /api/ads/google/sync
- /api/publish/page
- /api/inventory/search
- /api/leads/create, /api/leads/update, /api/leads/notes
- /api/sender/process, /api/sender/retry
- /api/agent/profile, /api/agent/train
- /api/audience/build
- /api/risk/apply
- /api/billing/webhook/*, /api/billing/summary
- /api/health, /api/health/monetization

Cron workers required
- Sender processor: runs due senderRuns, emits senderEvents, updates billing_events.
- Audience builder: consumes leads + senderEvents, updates audiences_local/global.
- Reporting rollup: aggregates leads, senderEvents, ads_runtime.
- Risk control: reads rollups + runtime stats, writes campaign status.

Reporting rollups required
- Leads: new/contacted/revived by campaignId + tenantId.
- Sender: delivered/opened/replied + suppressed counts.
- Ads: spend/leads/CPL by campaignId.
- Fairness/Direction: READY/WARMING/EXPLORING/NOISE/RISK distribution.

Rules to enforce
- All private docs require tenantId.
- Public reads only for pages_public and inventory_projects.
- senderEvents and billing_events are append-only.
- Handoff ticket creation suppresses sender automation immediately.
- Audience collections are write-only by system jobs (no manual edits).

CODE PATH REFERENCES (CURRENT IMPLEMENTATION)
- campaigns: `src/server/campaigns/campaign-store.ts`, `src/server/campaigns/campaign-guards.ts`, `src/app/api/campaigns/route.ts`, `src/app/api/campaigns/[id]/route.ts`, `src/app/api/campaigns/[id]/landing/route.ts`, `src/app/api/campaigns/[id]/bindings/route.ts`.
- sites/pages_private: `src/app/api/sites/route.ts`, `src/app/api/sites/stats/route.ts`.
- pages_public: `src/app/api/publish/page/route.ts`.
- inventory_projects: `src/server/inventory.ts`, `src/app/api/projects/route.ts`, `src/app/api/projects/search/route.ts`, `src/app/api/projects/meta/route.ts`, `src/app/api/projects/[projectId]/route.ts`.
- ads_campaigns (current path: tenants/{tenantId}/ads_google_campaigns): `src/server/ads/google/campaignSpine.ts`, `src/server/ads/google/googleAdsService.ts`, `src/app/api/ads/google/plan/route.ts`, `src/app/api/ads/google/sync/route.ts`, `src/app/api/ads/google/launch/route.ts`, `src/app/api/ads/google/campaigns/[id]/route.ts`.
- ads_runtime: not stored separately; runtime snapshots live on ads_google_campaigns docs (planned split).
- leads: `src/app/api/leads/route.ts`, `src/app/api/leads/create/route.ts`, `src/app/api/leads/update/route.ts`, `src/app/api/leads/list/route.ts`.
- leads_notes: `src/app/api/leads/notes/route.ts`, `src/app/api/leads/notes/list/route.ts`.
- senderRuns/senderEvents: `src/server/sender/sender-store.ts`, `src/server/sender/sender-events.ts`, `src/server/sender/sender-processor.ts`, `src/app/api/sender/process/route.ts`, `src/app/api/sender/retry/route.ts`, `src/app/api/sender/runs/route.ts`, `src/app/api/cron/sender-process/route.ts`.
- senderSequences: `src/app/api/sender/sequences/route.ts`.
- campaignAgentSettings (current path: tenants/{tenantId}/agent_profile): `src/server/agent/agent-profile.ts`, `src/app/api/agent/profile/route.ts`.
- audience (current: audience_profiles, audience_segments, audience_actions): `src/server/audience/*`, `src/app/api/audience/build/route.ts`, `src/app/api/audience/segments/list/route.ts`, `src/app/api/audience/segments/build/route.ts`, `src/app/api/audience/actions/list/route.ts`, `src/app/api/audience/actions/run/route.ts`.
- audiences_global: `src/app/api/audience/global/route.ts`.
- billing_events: `src/app/api/billing/history/route.ts`.
- wallets: `src/app/api/billing/wallet/route.ts`.
- reporting_rollups: not stored; computed on read in `src/app/api/reports/summary/route.ts`.
- jobs: `src/lib/jobs.ts`, `src/app/admin/jobs/page.tsx`.
- domains: `src/app/api/domains/route.ts`, `src/app/api/domains/request/route.ts`, `src/components/dashboard/domain/domain-dashboard.tsx`.
- handoffTickets: `src/app/api/handoff/tickets/route.ts`.

References
- Firestore rules: `firestore.rules`.
- Firestore indexes: `firestore.indexes.json`.

Migration note
- Ads campaigns currently stored in `tenants/{tenantId}/ads_google_campaigns` (code paths above). Target collection in the system map is `ads_campaigns` with a separate `ads_runtime` snapshot. Plan a migration before V1 hardening.
