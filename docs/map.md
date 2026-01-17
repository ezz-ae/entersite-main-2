ENTRESTATE — FULL SITE MAP (V1)

Rule:
Any page can be opened.
Any action redirects to login (phone + OTP).
Email is requested only at first payment.

SYSTEM FEED MAP SUMMARY (V1)
- Campaign is the spine: ads, sender, agent, reporting all bind to campaignId.
- Public reads only from pages_public and inventory_projects; everything else is tenant-gated.
- Sender emits deterministic events used by reporting, billing, and audience learning.
- Audience pools are derived from leads + events; no manual edits.
- Full spec: docs/SYSTEM_FEED_MAP.md and docs/ROUTES.md.

0. ENTRY POINTS (no "home obsession")

Users don’t come to a homepage.
They come from ads, search, links, QR, WhatsApp, Instagram, content.
So every major product has its own landing.

1. AUTH FLOW (GLOBAL)

/login
  - Phone number
  - Country auto-detect
  - OTP
  - Return user to exact page/action

No passwords
No email
No registration talk

2. USER ACCOUNT (ONE CONTROL ROOM)

/account

Sections:
  - Profile (phone, name, company)
  - Billing & invoices
  - Usage
  - Integrations
  - Team (V2 light)
  - Notifications
  - Security & sessions
  - Support

Everything else lives in its own area.

3. SITE MEGA MENU (TOP LEVEL)

Google Ads
Smart Sender
Site Builder
Chat Agent
Market Lab
Market Inventory
Lead Director
Agencies
Integrations
Knowledge
Analytics
Markets
Quality Index

4. GOOGLE ADS

/google-ads
  - /google-ads/start
  - /google-ads/campaigns
  - /google-ads/campaigns/[id]
  - /google-ads/reports

Inside campaigns:
  - Strategy
  - Budget
  - Landing surface
  - Performance
  - Recommendations

Paid action → payment gate

5. SMART SENDER (Email · SMS · WhatsApp)

/sender
  - /sender/new
  - /sender/sequences
  - /sender/queue
  - /sender/reports

Logic:
  - One message → multiple channels
  - Sequence intelligence
  - Human takeover events

6. SITE BUILDER

/builder

This is not "pages".
This is surfaces.

Pages:
  - /builder
  - /builder/create
  - /builder/library
  - /builder/sites
  - /builder/sites/[id]

Inside a site:
  - Blocks
  - Content
  - Forms
  - Chat
  - SEO
  - Publish

Finalization run:
  - Performance issues list
  - UX warnings
  - Conversion blockers
  - "Increase performance by ~40%" badge

7. CHAT AGENT

/chat-agent
  - /chat-agent/create
  - /chat-agent/agents
  - /chat-agent/agents/[id]
  - /chat-agent/integrations

Agent setup (bar-based, not form hell):
  - Name
  - Company info
  - Knowledge depth
  - Response size
  - Selling power
  - Success goal
  - Human takeover rules
  - Contact details
  - Timely events
  - Promotion focus (optional)

Deploy to:
  - Website
  - Landing
  - Instagram DM
  - Direct link
  - QR code

8. MARKET LAB (INTELLIGENCE)

/market-lab
  - /market-lab/city/[city]
  - /market-lab/area/[area]
  - /market-lab/compare

Features:
  - Construction history
  - Demand history
  - Pricing movement
  - Buyer type signals
  - Delivery speed
  - Community growth

Always ends with:
"High demand detected → run a campaign"

9. MARKET INVENTORY

/inventory

Flow:
  - /inventory → choose city
  - City → 12 projects
  - Load more → 24
  - Next load → soft limit message

Pages:
  - /inventory
  - /inventory/city/[city]
  - /inventory/project/[id] (auth required)
  - /inventory/download

You market subscription, not download.

10. LEAD DIRECTOR (CRM PIPE)

/leads
  - /leads
  - /leads/inbox
  - /leads/signals
  - /leads/segments
  - /leads/[leadId]
  - /leads/import
  - /leads/routing
  - /leads/connect
  - /leads/reports

Definition:
Intent Capture Infrastructure (not a CRM). Captures, normalizes, and timestamps intent,
then feeds execution engines and external CRMs. No pipelines, tasks, assignments, or workflows.
Spec: docs/LEAD_PIPE.md

Feeds:
  - Sender
  - Ads
  - Chat agent
  - Audience network

11. AGENCIES (STRUCTURAL MODE)

/agencies
  - /agencies
  - /agencies/request
  - /agencies/dashboard

Agency dashboard includes:
  - Audiences
  - Assigned agents
  - Client campaigns
  - Sender pools
  - Reports

No cosmetics.
Different permissions, different data scope.

12. INTEGRATIONS

/integrations
  - /integrations
  - /integrations/crm
  - /integrations/whatsapp
  - /integrations/instagram
  - /integrations/api

13. KNOWLEDGE

/knowledge
  - /knowledge
  - /knowledge/playbook
  - /knowledge/articles/[slug]
  - /knowledge/guides

This is where trust is built.

14. ANALYTICS

/analytics
  - /analytics
  - /analytics/campaigns
  - /analytics/leads
  - /analytics/senders

15. MARKETS

/markets

Each city has:
  - History
  - Signals
  - Comparison
  - Entry points to campaigns

16. QUALITY INDEX

/quality-index

Shows:
  - Lead quality
  - Campaign health
  - Page readiness
  - Agent readiness

Not scores. Indicators.

17. BILLING (INSIDE ACCOUNT)

/account/billing
  - Plans
  - Usage
  - Invoices
  - VAT
  - Spend control
  - Prepaid → postpaid logic (later)

Email exists only here.

18. SUPPORT & STATUS
  - /support
  - /status
  - /changelog
  - /roadmap

FINAL RULES (IMPORTANT)
  - No page is "public vs private"
  - Pages are visible, actions are gated
  - Login always returns user back
  - Language = broker language
  - System explains what to do next, not how it works
  - Security by design, not by blocking

LEGACY ROUTE MAPPING (V1)
  - /dashboard -> /account
  - /dashboard/google-ads -> /google-ads
  - /dashboard/campaigns -> /google-ads/campaigns
  - /dashboard/campaigns/new -> /google-ads/start
  - /dashboard/campaigns/[id]/landing -> /google-ads/campaigns/[id]/landing
  - /dashboard/campaigns/[id]/ads -> /google-ads/campaigns/[id]/ads
  - /dashboard/campaigns/[id]/messaging -> /google-ads/campaigns/[id]/messaging
  - /dashboard/chat-agent -> /chat-agent
  - /dashboard/leads -> /leads
  - /dashboard/sites -> /builder/sites
  - /dashboard/assets -> /builder/library
  - /dashboard/brand -> /builder
  - /dashboard/billing -> /account/billing
  - /dashboard/team -> /account/team
  - /dashboard/usage -> /account/usage
  - /dashboard/domain -> /account/integrations
  - /dashboard/sender-queue -> /sender/queue
  - /dashboard/email-marketing -> /sender/sequences
  - /dashboard/sms-marketing -> /sender/sequences
  - /dashboard/marketing -> /google-ads
  - /dashboard/reports -> /analytics
  - /dashboard/audience -> /market
  - /dashboard/meta-audience -> /market
  - /dashboard/ai-tools -> /account
  - /dashboard/jobs -> /admin/jobs
  - /dashboard/flex -> /account/integrations
  - /discover -> /inventory
  - /discover/[projectId] -> /inventory/project/[id]
