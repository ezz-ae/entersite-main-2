# Google Ads — Features, Options, What’s Missing

## Current repo capabilities (V1 baseline)
- Campaign spine exists as a concept and routing pattern.
- Billing feature flags exist to gate Google Ads by plan.
- Dashboard patterns exist (hub screen + tabs) that can host Ads reporting.

## Ship‑V1 essentials (must exist)
A broker should be able to:
- Create a campaign fast (city/area, unit type, budget, duration).
- Choose a landing link (use existing website, or pick a page made in Builder).
- Pick a strategy preset instead of touching keywords.
- See expectation management: “with this budget we target X–Y leads/week” with clear assumptions.
- Pause/resume anytime.

## Smart Setup (fewer questions, launch fast)
Ask only:
- Where (city/area)
- What (buy/rent, unit type)
- Budget/day
- Timeline (start today / next week)
- Contact route (call / WhatsApp / form)

## Advanced options (hidden behind “Customize”) 
- Competitor intercept (portals keywords).
- Negative keywords presets.
- Schedule by day/time.
- Device targeting.
- Language targeting.
- Call‑only fallback.

## Reporting (advanced engine, simple dashboard)
What user sees in “Reports”:
- Spend, leads, cost/lead, conversion rate.
- Top areas and unit types.
- Top search themes (not raw keyword list).

What the engine should store for learning:
- Search theme → lead quality score.
- Landing page version → conversion delta.
- Budget changes → impact delay.

## Biggest gaps to close
- Real Google Ads execution layer (MCC + account management + conversion tracking strategy).
- Lead quality feedback loop (broker marks lead as good/bad; system learns).
- Guardrails: budget caps, fraud clicks handling, “pause if cost/lead spikes.”

## V2 expansions
- Multi-campaign per client (Agency mode).
- Auto‑rotation of ad copy based on performance.
- City/seasonality playbooks.
