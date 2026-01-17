ENTRESTATE OS — MODULE COVERAGE (V1)

Legend
- Implemented: module has working routes + storage.
- Partial: some paths exist, but core flows or storage are missing.
- Planned: listed in system map only.

Module | Status | Evidence (routes/collections) | Gaps
---|---|---|---
Site Builder | Implemented | `/builder/*`, `sites`, `pages_private`, `/api/sites` | None
Publisher | Implemented | `/api/publish/page`, `pages_public` | Public publish pipeline only (no versioning)
Inventory | Implemented | `/inventory/*`, `inventory_projects`, `/api/projects/*` | None
Campaign Spine | Implemented | `/api/campaigns/*`, `campaigns` | Multi-tenant reconciliation still needed
AI Blueprint | Partial | `/api/ads/google/plan` | No cross-module blueprint store
Google Ads | Partial | `/api/ads/google/*`, `ads_google_campaigns` | Real API integration + runtime store split
CRM Leads | Implemented | `/api/leads/*`, `tenants/{tenantId}/leads` | None
Smart Sender | Partial | `/api/sender/*`, `senderRuns`, `senderEvents`, `/api/sender/sequences` | Sequence UI + run binding missing
Agent / Learning Settings | Partial | `/api/agent/profile`, `tenants/{tenantId}/agent_profile` | Full agent dashboard persistence incomplete
Audience | Partial | `audience_profiles`, `audience_segments`, `audience_actions`, `/api/audience/global` | Global aggregation job missing
Scenario / Risk Control | Partial | `/api/ads/google/risk/evaluate` | System-wide stop-loss + action jobs incomplete
Reporting | Partial | `/api/reports/summary` | `reporting_rollups` not stored
Billing | Partial | `/api/billing/*`, `billing_events`, `/api/billing/wallet` | Wallet funding + reconciliation missing
Jobs | Partial | `jobs` (client) | No server job worker or admin API
Domains | Implemented | `/api/domains/*`, `domains` | None
Health/Observability | Implemented | `/api/health`, `/api/health/monetization` | None
Handoff Tickets | Partial | `/api/handoff/tickets`, `handoffTickets` | Lifecycle workflow + UI missing
Audiences Global | Partial | `/api/audience/global`, `audiences_global` | Aggregation pipeline missing
Sender Sequences | Partial | `/api/sender/sequences`, `senderSequences` | Sequence editor UI missing
Wallets | Partial | `/api/billing/wallet`, `wallets` | Funding + limits reconciliation missing

Planned collections (not yet implemented)
- reporting_rollups
