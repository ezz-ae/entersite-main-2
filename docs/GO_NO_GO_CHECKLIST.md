# V1 Go/No-Go Validation Checklist

Use this checklist to verify the critical infrastructure, security, and user flows before declaring the V1 launch ready.

## Architecture & Security
- [ ] Multi-tenant architecture finalized: all API endpoints derive `tenantId` from `requireRole`, and legacy `ownerUid` logic is removed.
- [ ] RBAC enforcement complete: every admin route validates `ADMIN_ROLES` immediately and uses scoped role definitions (`agent`, `team_admin`, `agency_admin`).
- [ ] Feature set complete: Entrestate Refiner heuristics, Reporting dashboard tiles, Billing controls (invoices, VAT, spend caps, prepaid default), and product language updates are implemented and smoke-tested.

## Surface-level Health
- [ ] `/api/health` returns `200` when called with a `SUPER_ADMIN` token.
- [ ] `/api/health/monetization` returns `200` with the same admin credentials.
- [ ] Webhooks have been tested with simulated PayPal and Ziina events to ensure the handlers run end-to-end.

## Public & Billing Flows
- [ ] Public lead capture, discover search results, project detail views, and chat preview all function without tenant leakage.
- [ ] Rate limiting is enabled and verified on key public endpoints (e.g., `/api/leads`, `/api/projects`).
- [ ] Billing flow tested from trial through upgrade to account unlocking so usage limits lift appropriately.
- [ ] Spend caps honor the “pause if cap reached” toggle and prevent further spend when engaged.

## Observability & Safety
- [ ] Usage counters ignore failed sends (failed API calls do not increment usage metrics).
- [ ] Error tracking (Sentry) is receiving events from all relevant backend flows.
- [ ] Repository contains no committed secrets; run `git secrets`/`grep` to confirm.

## Documentation & Communication
- [ ] Share this checklist with the launch team so everyone signs off on the same set of validations.
- [ ] If any item is incomplete, log it in `PROJECT_FINALIZATION.md` so the status report stays accurate.
