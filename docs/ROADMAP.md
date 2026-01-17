# Product Roadmap

This roadmap is designed to prevent scope creep while compounding intelligence.

## V1 (Now) — Campaign Execution Engine
**Goal:** broker gets a real conversation with a real buyer fast.

Shipped surfaces:
- Campaign spine
- Landing builder attach
- Lead pipe + attribution
- Smart Sender (Email + SMS, WhatsApp optional)
- Google Ads binding
- Event bus + Hot/Warm/Cold
- Sender queue + cron
- Audience actions (hot suppression)

Non-goals:
- Full CRM
- Teams
- Advanced workflows
- Meta Ads UI

---

## V1.1 — Control & Stability
- Campaign pause/resume + safeguards
- Sender cooldown tuning (anti-spam)
- Better failure diagnostics (run traces)
- Agent handoff button + notes

---

## V1.2 — Templates & Conversion
- Campaign templates
- Smart sender branching (reply-based)
- Lead intent velocity (recent signals count more)
- Conversion tracking hooks

---

## V2 — Audience Power (Moat)
- Segment export adapters (Meta/Google)
- Lookalike generation pipeline
- Cross-campaign memory (per tenant)
- Budget intelligence (cost per intent)

---

## V3 — Infrastructure / Licensing
- External API for events/segments/actions
- White-label deployments
- Partner ecosystem (portals, CRMs)
- Compliance + audit trail
