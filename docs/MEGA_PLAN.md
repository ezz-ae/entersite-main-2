# Entrestate OS V1 Mega Plan

This plan sequences the cross-cutting work you described into actionable phases so we can track progress toward a secure, multi-tenant V1 launch.

## Phase 1 — Tenant-First Foundation
- **Audit tenant identifiers**: catalog every `ownerUid` dependency in Firestore queries, services, and indexes; migrate each to use `tenantId` from `requireRole`/`tenantFromToken`.
- **Harden API routes**: ensure all authenticated routes call `requireRole` (or `requireAuth`) before touching data, reject any client-supplied tenant IDs, and propagate the trusted `tenantId` downstream.
- **Restore Firestore rules**: remove ownerUid fallbacks so every tenant-scoped collection uses `isTenantMember`/`isTenantAdmin` with `tenantFromToken`. Drop the obsolete indexes that depend on `ownerUid`.
- **Verify tenant context helpers**: rely on `tenantFromToken()` in rules and the `tenantId` field stored in tokens; confirm `tenantFromToken()` is returned by every server `requireRole` call.

## Phase 2 — Security & Access Controls
- **RBAC enforcement**: consult `docs/RBAC.md` and make each admin route (`/billing/*`, `/domains/*`, `/team/invites`, `/payments/*`, `/ads/*`, `/audience/*`, etc.) validate `requireRole(req, ADMIN_ROLES)` first, then gate data writes to the authenticated tenant only.
- **Bot deterrence**: implement the “misdirect, don’t block” inventory response (24 normal records + CTA 25th), keep rate limiting (fallbacking to in-memory) active, and ensure `/api/projects` and public inventory endpoints respect tenant isolation.
- **Health & release gates**: confirm `/api/health` and `/api/health/monetization` are protected, webhooks (PayPal/Ziina) are tested, and that usage counters, rate limits, and error tracking are all wired to the trusted tenant context.

## Phase 3 — Signature Features & UX Finish
- **Entrestate Refiner**: build the refiner worker/job, wire it into `/api/publish/page` and `/api/publish/vercel` so it runs on publish, store reports with timestamps, and ensure the UI surfaces actionable insights per `docs/V1_FEATURES.md`.
- **Reporting dashboard**: create the `/analytics` page and backend aggregators (leads/sender/ads tiles) that pull tenant data from Firestore and gracefully degrade when metrics are missing.
- **Billing & spend controls**: surface historical invoices via `/api/billing/history`, add the VAT field to the billing profile, gate spend via `enforceUsageLimit`, and show “pause if cap reached” toggles while confirming prepaid is default.
- **Google Ads baseline & Refiner synergy**: ensure campaign-level ads setup, reporting tiles, and budget guardrails are in place; satisfy “Smart Setup” minimal inputs and plan for advanced options behind “Customize”.
- **Language & tone sweep**: update UI strings to replace AI/magic/generate/dev terms with Smart builder/Refiner/Signals/publish, and keep the copy consistent across builder, dashboard, and marketing surfaces.

## Phase 4 — Launch Readiness & Go/No-Go
- **Go/No-Go checklist**: align progress with `docs/GO_NO_GO_CHECKLIST.md`, `docs/SHIP_CHECKLIST_V1.md`, and `docs/LAUNCH_CHECKLIST.md` (health endpoints, webhooks, public flows, billing flow, usage counters, error tracking, secrets clean).
- **Operational readiness**: ensure env vars, rate limits, smoke tests, and cron jobs described in the runbook are satisfied before promoting to staging/prod.
- **Post-launch monitoring**: verify logging, alerting, and instrumentation (Sentry, usage counters) remain connected to the tenant-specific context.

Keep this doc updated as work progresses so we can point back to the plan during reviews. Let me know which phase you’d like me to start executing first.
