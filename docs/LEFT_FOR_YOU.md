# LEFT FOR YOU (V1 Launch Notes)

This is the "guide-not-ride" file.
It’s the list that keeps the product honest: what we launched, what we postponed, and what must not be forgotten.

---

## A) What was hardened in code (this pass)

### 1) Same-origin protection (authenticated + money endpoints)
We now enforce same-origin checks on endpoints that should never be callable from an external website tab.
This protects billing actions (PayPal/Ziina create/capture), domain connection, site creation, campaign creation, and profile updates.

Why it matters: it stops cross-site abuse without annoying real users, and it matches your “secure by design” mindset.

### 2) Rate-limit fallback now actually works
The project already had a rate-limit helper, but in production it used to disable itself if Upstash wasn’t configured.
That’s a security hole. It now falls back to an in-memory sliding window even in production.

Reality check: on serverless, in-memory rate limits are “best effort” (per instance). Still worth it. It blocks noisy bursts and cheap scraping.

### 3) New security helper module
Added `src/lib/server/security.ts` (same-origin helper + safe defaults).
If later you want “soft blocks” (misdirection responses instead of 429), this is the place to put that logic.

---

## B) Language cleanup rules (do this everywhere)
Your rule is correct: remove these words from the public product language:
- Avoid hype words: magic, generate, our

Replace with action-words:
- “Instant creation” (not generate)
- “Smart builder” / “Smart writer”
- “Refiner” (not an automated check label)
- “Signals” / “Trends” / “Market facts” (not insights label)

Also: avoid dev words for brokers:
- Avoid technical words in UI: deploy, pipeline, nodes

Use:
- publish, connect, launch, link, import, export, follow-up, results

---

## C) Entrestate Refiner (must exist in V1 UX even if minimal)
When a landing page is saved/published, the system should run a "finalization check" and surface fixes.

Minimum checks (V1):
- Contrast check (red on black / unreadable text)
- Hero image quality + “text overlay” warning
- CTA presence + CTA label quality (not “Submit”)
- Phone/WhatsApp CTA present
- Form fields: name + phone required (email optional)
- One clear next step (call / whatsapp / book viewing)

Where it appears:
- Builder publish screen
- Dashboard next to the site: “Improve performance +40% with Refiner”

---

## D) Public inventory → Market History (data is the wedge)
This is a V2-sized build, but V1 needs the foundation now:

V1 now (do):
- Start with “Choose city”
- Show 6–12 “Market facts” cards (static or computed)
- Have “Projects inventory” as a separate page (public, limited pagination)
- Keep the “Download” CTA as the natural sink

V2 later (big):
- pricing history, demand history, resale value, construction history, map, advanced filters, comparisons

---

## E) Bot/scraper strategy (never punish — redesign)
You said it: don’t block, misdirect.

V1 now (do):
- Allow 24 items.
- The 25th card is the “ALL market data” offer (shown only in the DOM list so scrapers capture it).

V2 later (better):
- soft-auth misdirection flows
- delayed pagination tokens
- honey routes for automated collectors

---

## F) Reporting, learning, optimization (missing right now)
Every product needs:
- Performance indicators
- Reporting
- Learning loop

V1 now (do):
- One “Reports” screen in dashboard with 3 tiles:
  1) Leads: new / contacted / revived
  2) Sender: delivered / opened / replied
  3) Ads: spend / leads / cost per lead

V2 later:
- cohort and time-to-close analytics
- creative/keyword learnings
- automated budget reallocation suggestions

---

## G) Billing & spend control (hard requirements)
V1 now (do):
- invoices list
- VAT field support (even if informational)
- spend caps + “pause if cap reached”
- prepaid as default

V2 later:
- postpaid upgrade when trust threshold is reached
- agency wallets / sub-accounts

---

## H) Agency mode (structural, not cosmetic)
V1: show “Request agency dashboard” only.
V2: the real build:
- multiple client workspaces
- multiple audiences
- assign agents to clients
- client-level billing

---

## I) What I need from you (inputs)
To finish this properly you will need:
- Root domain and marketing subdomains you want to use (example: `agent.entrestate.com`, `inventory.entrestate.com`, etc.)
- Which payment rail is “Live first” (PayPal only / Ziina only / both)
- If you want AED or USD as the default displayed currency on pricing

