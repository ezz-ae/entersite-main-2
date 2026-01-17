# V1 Feature Completion Plan

This plan lists the concrete deliverables needed to finish the strategic feature set before the V1 Go/No-Go review.

## Entrestate Refiner
- Implement a server-side job that runs whenever a page is published and returns a refinement report.
- Validate the heuristics listed below and flag issues in the response so the frontend can surface actionable warnings:
  - Contrast checks to detect low-contrast text/background combinations.
  - Hero image quality and text overlay warnings (e.g., blurred images or unreadable overlays).
  - CTA presence and label quality (flag generic CTAs such as “Submit” or “Click Here”).
  - Phone/WhatsApp CTA presence.
  - Enforce required form fields (name + phone).
  - Verify that a single “next step” exists (call, visit, booking) before marking a page as “ready.”
- Store the refiner output and status back on the page document so UI can show “Refiner insights” with timestamps.

## Reporting Dashboard
- Add a “Reports” tab to the dashboard (likely under `/app/reports` or similar) that fetches performance aggregates per tenant.
- Present three data tiles with their required metrics:
-  1. *Leads*: new / contacted / revived (revived currently maps to the `Qualified` bucket so reopened prospects surface in the tile).
-  2. *Sender*: delivered / opened / replied (opened is derived from the email send signals we currently capture as the closest engagement proxy).
-  3. *Ads*: spend / leads / cost per lead.
- Build backend aggregators that pull from Firestore (tenants/{tenantId}/leads, sender runs, ad budgets) and return summarized totals for the current billing cycle.
- Gracefully degrade to zero/placeholder state when data is missing and include last-updated timestamps.

## Billing and Spend Controls
- Surface historical invoices via a `/api/billing/history` endpoint and a UI list of past charges (matching the invoice records already stored in Firestore).
- Add a VAT field on the billing profile so customers can record their tax ID.
- Introduce tenant-level spend caps with an optional “pause if cap reached” toggle; enforce the cap in `enforceUsageLimit` so that campaigns/publishes fail fast when the limit hits and automatically pause (or block) new spend if the toggle is enabled.
- Make the prepaid model the default for all new accounts, and document this in onboarding copy/settings.

## Language and Tone Sweep
- Replace superficial keywords across the UI: swap “AI/magic/generate/our” with “Smart builder,” “Instant creation,” “Refiner,” “Signals,” or “Market facts” in marketing, onboarding, and in-app copy.
- Replace technical words that should be abstracted for users (e.g., “deploy,” “pipeline,” “node”) with “publish,” “launch,” or “connect.”
- Validate the updated strings via `src/app/(...)` components or translation files.

## Integration Notes
- Tie the Refiner job into the publish flow (`/api/publish/page`, `/api/publish/vercel`), ensuring it fires after the site is marked published.
- Hook the reporting dashboard into the new backend summaries and cache the metrics for a few minutes to keep the UI responsive.
- Sync the billing spend cap toggle with existing billing controls so the UI shows when a pause has been triggered.
- Document all of the above in `docs/V1_FEATURES.md` so product, QA, and ops teams can cross-check completion before launch.
