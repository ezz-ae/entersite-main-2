Build the “Entrestate Smart Launch Cockpit” (Google Ads Dashboard) as a production-ready Next.js App Router feature inside an existing codebase named Entrestate-OS.

GOAL
Ship a Google Ads dashboard that feels like “decision infrastructure” (money protection), not an ads manager. The UI must be minimal and action-oriented. The system runs Google Ads from a master MCC (managed execution model), but the user experience is: connect, choose landing page, set momentum with the Occalizer, set spend caps + stop-loss, approve launch, then monitor intent-based reporting + fairness validity.

NON-NEGOTIABLE PRODUCT RULES
- Do NOT use “DZL / Decision Zipper” or “AI” wording in the UI. Keep those internal names only in code comments.
- Users should not see CTR, Quality Score, or overly technical vanity metrics. Focus on intent clusters, lead outcomes, spend, fairness validity, and scenario state.
- V1 is Google-only. No Meta. No CRM deep features. No feature creep.
- Managed execution model: campaigns are executed through Entrestate master MCC, not the user’s own Ads account (still allow connecting their account for read-only import if already implemented, but primary flow is MCC).
- Everything binds to a unique `campaignId` (“Campaign Spine”) that stores the landing page URL, drafts, runtime, state machine, and audit logs.
- Occalizer is the primary control: a chromatic momentum slider that sets “Daily Momentum” / market pressure. It drives a system verdict: TOP / FAIR / RISKY with plain-language expected outcomes.
- Keyword Gravity: keywords are outputs. The UI never asks the user to type keywords.
- Stop-Loss / Risk Control: user defines failure condition and system response (pause, lower budget, auto-redesign suggestion). System enforces.
- Scenario Management: five states (Exceeding, On Track, Underperforming, At Risk, Stop-Loss). Must be displayed and logged.

TECH STACK
- Next.js (App Router), TypeScript, Tailwind, shadcn/ui, lucide-react.
- Firebase Auth + Firestore (multi-tenant). Use existing patterns in repo.
- Server routes under `src/app/api/...` with token verification (Authorization: Bearer).
- Use server actions only if already used in repo; otherwise stick to API routes.
- Charts: use Recharts (if already in repo) OR minimal SVG/DOM charts (no heavy chart library).
- Implement mock mode (`ADS_MOCK_MODE=true`) that generates deterministic fake data so the UI works without Google API credentials.

PAGES / ROUTES TO BUILD
1) Dashboard entry:
   - `src/app/(dashboard)/ads/google/page.tsx`
   - Shows Smart Launch Cockpit with:
     a) Campaign selector (existing campaigns) + “New Campaign”
     b) Current state tile: Scenario state + verdict (TOP/FAIR/RISKY) + fairness validity
     c) “Launch” section if draft not launched; “Monitor” section if live

2) Campaign details:
   - `src/app/(dashboard)/ads/google/[campaignId]/page.tsx`
   - Tabs:
     - Launch (draft builder)
     - Risk Control
     - Reports (intent-based)
     - Logs (audit timeline)

CORE UI COMPONENTS (SHADCN)
- Occalizer: a slider with color gradient background (blue/teal -> orange/red).
  - Label: “Daily Momentum”
  - Output: Verdict chips TOP / FAIR / RISKY
  - Live projections (ranges): expected daily leads, expected CPL range, competition pressure
  - DO NOT show raw bidding mechanics.
- Smart Ad Planner (5 questions only):
  1) Where (city/area)
  2) What (unit type / offer type)
  3) Budget per day (AED)
  4) Timeline (start date, duration OR end date)
  5) Contact route (Call / WhatsApp / Form)
- Landing page input:
  - URL field OR choose from Entrestate sites (if exists in repo: sites/pages_public)
  - Store landingPageUrl inside campaign spine
- “Competitor Intercept” option:
  - Toggle + text inputs for competitor brand keywords (default suggestions: Bayut, Property Finder) but label it as “Portal Intercept (Advanced)”
  - Include a warning tooltip about compliance and require explicit user confirmation checkbox.
- Launch approval:
  - “Approve & Launch” button (disabled until required fields pass validation + Refiner checks pass)
  - Spend caps:
     - dailyCapAED
     - totalCapAED
- Refiner checks (pre-launch QA):
  - Contrast check (basic heuristic: compute luminance from CSS variables if available; or check for presence of dark/light text classes; if too hard, implement as “manual checklist” in V1 but keep structure for automation)
  - Hero image quality (if builder provides hero image URL, check width/height via HEAD or fetch metadata in mock mode)
  - CTA presence (detect “Book / WhatsApp / Call” block existence if using site blocks; otherwise mark unknown)
  - Contact interception present
  - Form fields minimal (name + phone; email optional)

DATA MODELS (FIRESTORE)
Create/extend collections (tenant-scoped):
- `tenants/{tenantId}/ads_google_campaigns/{campaignId}`
  Fields:
  - campaignId (string)
  - tenantId
  - createdAt, updatedAt
  - status: 'draft' | 'launching' | 'live' | 'paused' | 'stopped'
  - landingPageUrl
  - planner: { cityArea, unitType, dailyBudgetAED, timeline: {startDate, endDate}, contactRoute }
  - occalizer: { momentum: 0..100, verdict: 'TOP'|'FAIR'|'RISKY', projections: { leadsMin, leadsMax, cplMinAED, cplMaxAED, competition: 'low'|'mid'|'high' } }
  - intercept: { enabled: boolean, brands: string[] }
  - caps: { dailyCapAED, totalCapAED }
  - riskControl: {
      enabled: boolean,
      windowDays: number,
      metric: 'visits'|'whatsappClicks'|'leads',
      minimum: number,
      response: 'pause'|'lowerBudget'|'suggestLandingShift'|'suggestAutoRedesign'
    }
  - scenario: { state: 'EXCEEDING'|'ON_TRACK'|'UNDERPERFORMING'|'AT_RISK'|'STOP_LOSS', updatedAt, reason }
  - fairness: { dflPercent: number, band: 'GREEN'|'YELLOW'|'RED', valid: boolean, lv: number, tv: number, spendAED: number }
  - google: { mccAccountId, customerId, campaignResourceName?, lastSyncAt? }
  - reporting: { last30d?: {...}, intentClusters?: {...} } (optional cached aggregates)
- `tenants/{tenantId}/ads_google_logs/{logId}`
  Fields:
  - campaignId
  - ts
  - type: 'STATE'|'SYNC'|'RISK'|'LAUNCH'|'ERROR'|'NOTE'
  - message
  - data (json)

API ENDPOINTS
Under `src/app/api/ads/google/...` implement:
- POST `/api/ads/google/campaigns/create`
  Body: { tenantId, landingPageUrl? }
  Returns: { campaignId }
- GET `/api/ads/google/campaigns/list`
  Returns campaigns summary list
- GET `/api/ads/google/campaigns/[campaignId]`
- PATCH `/api/ads/google/campaigns/[campaignId]`
  Update planner, occalizer, intercept, caps, riskControl
- POST `/api/ads/google/plan`
  Input: { campaignId }
  Output: strategy draft:
    - recommended ad groups (names only)
    - copy pack (headlines/descriptions)
    - tracking plan (events)
    - keyword gravity preview (clusters, not raw keywords)
  In mock mode: generate deterministic content from landingPageUrl + planner.
- POST `/api/ads/google/refine`
  Input: { campaignId }
  Output: refiner results: pass/fail, issues list, suggestions list
- POST `/api/ads/google/launch`
  Input: { campaignId }
  Behavior:
    - validate required fields
    - run refine (must pass or require override with justification field)
    - create/queue sync job
    - set status=launching then live
  In mock mode: simulate success and create initial reporting seeds
- POST `/api/ads/google/sync`
  Input: { campaignId }
  Behavior:
    - if ADS_MOCK_MODE: update spend/leads projections + scenario + fairness based on deterministic rules
    - else: call Google Ads API via existing infrastructure or stub service class (do not implement full OAuth if not already in repo; create clear TODOs)
- POST `/api/ads/google/risk/evaluate`
  Input: { campaignId }
  Behavior:
    - evaluate riskControl rules vs metrics
    - apply response: pause/lowerBudget etc.
    - write log entries

AUTH / SECURITY
- Require Firebase ID token for all dashboard APIs.
- Resolve tenantId from token claims or request body (prefer claims).
- Enforce tenant isolation in Firestore access.
- Add server-side validation with zod.

BUSINESS LOGIC (V1, DETERMINISTIC)
Occalizer -> Verdict mapping:
- momentum 0–33 => TOP
- 34–66 => FAIR
- 67–100 => RISKY
Projections depend on momentum + planner dailyBudgetAED:
- leads ~ (dailyBudgetAED / cpl) with cpl ranges:
  TOP: cpl 120–220 AED
  FAIR: cpl 90–180 AED
  RISKY: cpl 130–260 AED (volatile)
Competition pressure:
  TOP: low-mid; FAIR: mid; RISKY: mid-high
These are placeholders for V1 and should be clearly coded as “heuristics”.

Scenario state evaluation (based on last 7 days or mock metric window):
- Exceeding: leads >= 1.3x expectedMax
- On Track: leads within expected range
- Underperforming: leads < 0.7x expectedMin
- At Risk: spend high but leads near zero OR fairness band RED for 2 cycles
- Stop-Loss: risk control triggers OR fairness RED + underperforming persists
Recovery transitions:
- Underperforming: suggest lowering momentum OR suggest landing adjustments
- At Risk: auto lower budget cap (if allowed) and narrow momentum band
- Stop-Loss: pause campaign

Fairness (DFL) compute:
- LV: map direction proxy from outcomes (since full LDM is V2)
  - if leads >= expectedMin => LV = 1.0
  - if leads > 0 but < expectedMin => LV = 0.5
  - if leads == 0 => LV = 0.1
- TV: time validity decay from response speed is not available in V1; approximate:
  - if contactRoute=WhatsApp => TV=0.9
  - form => 0.8
  - call => 0.85
  - optionally reduce TV if timeline duration > 14 days (staleness)
- SpendAED = actual spend in window
- DFL% = (LV * TV / max(SpendAED, 1)) * K where K is a scaling constant to express 0–100.
  Use K=100*SpendAED_baseline where baseline is derived from dailyBudgetAED*windowDays to normalize:
  fairness = (LV*TV) / (SpendAED/(dailyBudgetAED*windowDays)) * 100
Bands:
  GREEN >= 85
  YELLOW 60–84
  RED < 60
valid = band != RED (or define: valid = band GREEN; YELLOW = “needs attention”)

REPORTING UI (INTENT-FIRST)
- Ads summary tiles:
  - Spend (last 7d / 30d)
  - Leads
  - CPL range
  - Fairness band + % + “valid/invalid”
  - Scenario state
- Intent Heatmap:
  - Show 6–10 “Intent Clusters” as cards or heat blocks:
    - “Payment Plan Queries”
    - “Developer Search”
    - “Area + Price”
    - “Ready-to-move”
    - “Off-plan”
    - “Studio/1BR”
  In mock mode: generate cluster weights from landingPageUrl + unitType.
  In real mode: clusters derived from search terms report (TODO).
- Logs timeline:
  - Launch events
  - Sync events
  - Scenario transitions
  - Risk-control triggers
  - Manual overrides

DX / IMPLEMENTATION REQUIREMENTS
- Add a service layer: `src/server/ads/google/*`
  - `googleAdsService.ts` (real + mock adapters)
  - `campaignSpine.ts` (Firestore CRUD + validation)
  - `occizer.ts` (Occalizer logic)
  - `scenarioEngine.ts` (state machine)
  - `fairness.ts` (DFL computation)
  - `intentClusters.ts` (cluster mapping)
- Use zod schemas for all request bodies.
- Provide clear TODO markers for real Google Ads API integration points.
- Ensure build passes: `npm run lint` and `npm run build` in mock mode.

UX QUALITY BAR
- Minimal, high-signal UI.
- Every screen answers: “What is happening? Is my money safe? What can I do now?”
- No clutter. No “AI insights” language.
- Add helpful microcopy only where needed (tooltips, warnings).

DELIVERABLES
- Working dashboard pages + API routes + Firestore models
- Mock mode with deterministic fake metrics
- Seed script or dev helper to create a demo campaign
- README section: “Google Ads Smart Launch Cockpit (V1) – How to run in mock mode”

START NOW. Make reasonable assumptions based on existing repo patterns. If something is missing, implement it in mock mode with TODO stubs for production credentials.