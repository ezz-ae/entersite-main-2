ENTRESTATE OS — ROUTES MAP (V1)

NOTES
- Modules are grouped by surface.
- Tenant-gated routes require phone OTP auth + tenantId context.
- Dynamic module pages are handled by /{module}/[slug].
- Public reads are limited to pages_public and inventory_projects.

MARKET
- /market (public surface)
- /market/[slug] (public surface, module subpages)
- /market/city/[city] (public surface)
- /market/area/[area] (public surface)

MARKET LAB
- /market-lab (public surface)
- /market-lab/city/[city] (public surface)
- /market-lab/area/[area] (public surface)
- /market-lab/compare (public surface)

INVENTORY
- /inventory (public surface)
- /inventory/[slug] (public surface, module subpages)
- /inventory/city/[city] (public surface)
- /inventory/project/[id] (auth gate on action)
- /inventory/download (auth gate on action)
- /api/projects/search (public read)
- /api/projects/meta (public read)
- /api/projects/[projectId] (public read)

SITE BUILDER + PUBLISHER
- /builder (public surface)
- /builder/[slug] (public surface, module subpages)
- /builder/create (tenant-gated)
- /builder/library (tenant-gated)
- /builder/sites (tenant-gated)
- /builder/sites/[id] (tenant-gated)
- /api/sites (tenant-gated)
- /api/publish/page (tenant-gated)

CAMPAIGN SPINE + CONTROL
- /google-ads/campaigns (tenant-gated)
- /google-ads/start (tenant-gated)
- /google-ads/campaigns/[id] (tenant-gated)
- /google-ads/campaigns/[id]/landing (tenant-gated)
- /google-ads/campaigns/[id]/messaging (tenant-gated)
- /google-ads/campaigns/[id]/ads (tenant-gated)
- /api/campaigns (tenant-gated)
- /api/campaigns/[id] (tenant-gated)
- /api/campaigns/[id]/landing (tenant-gated)
- /api/campaigns/[id]/bindings (tenant-gated)

AI BLUEPRINT + GOOGLE ADS
- /google-ads (public surface)
- /google-ads/start (tenant-gated)
- /google-ads/campaigns (tenant-gated)
- /google-ads/campaigns/[id] (tenant-gated)
- /google-ads/reports (tenant-gated)
- /google-ads/[slug] (public surface, module subpages)
- /api/ads/google/plan (tenant-gated)
- /api/ads/google/sync (tenant-gated)
- /api/ads/google/launch (tenant-gated)
- /api/ads/google/campaigns (tenant-gated)
- /api/ads/google/campaigns/[id] (tenant-gated)
- /api/ads/google/campaigns/[id]/status (tenant-gated)

CRM LEADS
- /leads (tenant-gated)
- /leads/inbox (tenant-gated)
- /leads/signals (tenant-gated)
- /leads/segments (tenant-gated)
- /leads/import (tenant-gated)
- /leads/routing (tenant-gated)
- /leads/connect (tenant-gated)
- /leads/reports (tenant-gated)
- /leads/[leadId] (tenant-gated)
- /api/leads (tenant-gated)
- /api/leads/create (tenant-gated)
- /api/leads/update (tenant-gated)
- /api/leads/notes (tenant-gated)
- /api/leads/notes/list (tenant-gated)

SMART SENDER
- /sender (public surface)
- /sender/[slug] (public surface, module subpages)
- /sender/new (tenant-gated)
- /sender/queue (tenant-gated)
- /sender/reports (tenant-gated)
- /api/sender/process (cron only)
- /api/sender/retry (tenant-gated)
- /api/sender/runs (tenant-gated)
- /api/sender/sequences (admin)

CHAT AGENT + LEARNING
- /chat-agent (public surface)
- /chat-agent/[slug] (public surface, module subpages)
- /chat-agent/agents (tenant-gated)
- /chat-agent/agents/[id] (tenant-gated)
- /chat-agent/integrations (tenant-gated)
- /api/agent/profile (tenant-gated)
- /api/agent/train (tenant-gated)
- /api/bot/main/chat (tenant-gated)
- /api/bot/[botId]/chat (tenant-gated)
- /api/bot/preview/chat (public, rate-limited)

PUBLIC EVENT INGEST
- /api/public/events/landing-view (public, rate-limited)

AUDIENCE
- /market (tenant-gated on actions)
- /api/audience/build (cron or admin)
- /api/audience/segments/list (tenant-gated)
- /api/audience/actions/list (tenant-gated)
- /api/audience/global (admin)

RISK CONTROL
- /api/ads/google/risk/evaluate (tenant-gated)
- /api/audience/actions/run (tenant-gated)

ANALYTICS + QUALITY INDEX
- /analytics (tenant-gated)
- /analytics/campaigns (tenant-gated)
- /analytics/leads (tenant-gated)
- /analytics/senders (tenant-gated)
- /analytics/[slug] (tenant-gated)
- /quality-index (tenant-gated)
- /api/reports/summary (tenant-gated)

AGENCIES
- /agencies (public surface)
- /agencies/request (tenant-gated)
- /agencies/dashboard (tenant-gated)
- /agencies/[slug] (public surface, module subpages)

INTEGRATIONS
- /integrations (public surface)
- /integrations/api (tenant-gated)
- /integrations/crm (tenant-gated)
- /integrations/instagram (tenant-gated)
- /integrations/whatsapp (tenant-gated)
- /integrations/[slug] (public surface, module subpages)

KNOWLEDGE
- /knowledge (public surface)
- /knowledge/playbook (public surface)
- /knowledge/guides (public surface)
- /knowledge/articles/[slug] (public surface)
- /knowledge/[slug] (public surface, module subpages)

ACCOUNT
- /account (tenant-gated)
- /account/profile (tenant-gated)
- /account/billing (tenant-gated)
- /account/integrations (tenant-gated)
- /account/notifications (tenant-gated)
- /account/security (tenant-gated)
- /account/support (tenant-gated)
- /account/team (tenant-gated)

BILLING
- /api/billing/wallet (admin write, tenant read)

DOMAINS
- /account/integrations (tenant-gated)
- /api/domains/request (tenant-gated)

HANDOFF
- /api/handoff/tickets (tenant-gated)

HEALTH + OBSERVABILITY
- /api/health (public)
- /api/health/monetization (admin)
