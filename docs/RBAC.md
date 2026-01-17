# RBAC Enforcement Guide

## Role capabilities

| Role | Key responsibilities |
| --- | --- |
| `agent` | Reads and writes tenant-scoped artifacts such as leads, marketing plans, and assistant-generated content; cannot change billing, invite teammates, or manage domains. |
| `team_admin` | Full tenant-level control: settings, analytics, billing, usage caps, invites, and integrations. |
| `agency_admin` | (V2 scope) Aggregates the permissions of `team_admin` across multiple tenants that the agency manages, plus any agency-level billing controls. |

`ADMIN_ROLES` (`team_admin`, `agency_admin`, `super_admin`) expresses the server-side gate used on every administrative API route. The helper `requireRole(req, ADMIN_ROLES)` immediately validates the incoming Firebase token, extracts the tenant context, and rejects requests whose claims do not include a permitted role before any database reads or writes.

`ALL_ROLES` (`agent`, `team_admin`, `agency_admin`, `super_admin`) expresses the gate used for standard tenant-scoped operations (campaigns, leads, publishing, and agent profile reads). The helper `requireRole(req, ALL_ROLES)` must be the first call for any authenticated route that reads or writes tenant data.

## Module RBAC map (V1)

| Module | Read/Use (ALL_ROLES) | Admin/Write (ADMIN_ROLES) | Public reads |
| --- | --- | --- | --- |
| Site Builder + Publisher | `/api/sites`, `/api/publish/page` | n/a | none |
| Campaigns | `/api/campaigns`, `/api/campaigns/[id]` | n/a | none |
| Google Ads (legacy APIs) | `/api/google-ads/*` | `/api/google-ads/*` | none |
| Google Ads (new APIs) | n/a | `/api/ads/google/*` | none |
| Leads | `/api/leads/*`, `/api/leads/notes/*` | n/a | none |
| Smart Sender | `/api/sender/*` (retry, runs) | n/a | none |
| Smart Sender Sequences | n/a | `/api/sender/sequences` | none |
| Agent Profile | GET `/api/agent/profile` | PATCH `/api/agent/profile`, `/api/agent/train` | none |
| Audience | `/api/audience/segments/list`, `/api/audience/actions/list` | `/api/audience/*` (build/run/request) | none |
| Audience Global | n/a | `/api/audience/global` | none |
| Billing | `/api/billing/summary`, `/api/billing/history` | `/api/billing/cancel` | provider webhooks only |
| Wallets | `/api/billing/wallet` (read) | `/api/billing/wallet` (write) | none |
| Domains | `/api/domains` (list) | `/api/domains/request` | none |
| Handoff Tickets | `/api/handoff/tickets` | n/a | none |
| Health | n/a | `/api/health/monetization` (super_admin) | `/api/health` |
| Inventory | n/a | n/a | `/api/projects/search`, `/api/projects/meta`, `/api/projects/[projectId]` |
| Public Events | n/a | n/a | `/api/public/events/landing-view` |
| Bot Preview | n/a | n/a | `/api/bot/preview/chat` |
| Bot Chat (tenant) | `/api/bot/main/chat`, `/api/bot/[botId]/chat` | n/a | none |

## Admin endpoints (require ADMIN_ROLES)

| Route | File / lines | Description |
| --- | --- | --- |
| GET/POST `/api/team/invites` | `src/app/api/team/invites/route.ts:24-85` | Lists pending invites and enforces seat limits before creating new invites. |
| POST `/api/domains/request` | `src/app/api/domains/request/route.ts:1-80` | Records paid domain purchase requests and validates the tenant owned site. |
| POST `/api/domains` | `src/app/api/domains/route.ts:1-102` | Creates Vercel domain bindings and ensures the site already belongs to the tenant before writing. |
| POST `/api/billing/cancel` | `src/app/api/billing/cancel/route.ts:1-80` | Cancels subscriptions; `requireRole` runs before talking to Stripe/Ziina. |
| POST `/api/payments/paypal/create` | `src/app/api/payments/paypal/create/route.ts:1-90` | Initiates PayPal payment flows scoped to the tenant. |
| POST `/api/payments/paypal/capture` | `src/app/api/payments/paypal/capture/route.ts:1-80` | Captures PayPal payments while verifying tenant context. |
| POST `/api/payments/ziina/create` | `src/app/api/payments/ziina/create/route.ts:1-90` | Creates Ziina invoices using the tenant ID from the token. |
| POST `/api/payments/ziina/success` | `src/app/api/payments/ziina/success/route.ts:1-80` | Handles Ziina webhooks for the tenant and verifies the role upfront. |
| POST `/api/google-ads/sync` | `src/app/api/ads/google/sync/route.ts:1-110` | Syncs Google Ads assets only after confirming the caller is an admin. |
| POST `/api/audience/*` | `src/app/api/audience/*` (segments/build, build, request, actions) | Builds and manages audience segments (actions run/list) with admin tokens. |
| POST `/api/agent/train` | `src/app/api/agent/train/route.ts:1-60` | Starts agent training jobs; only allowed for `ADMIN_ROLES`. |
| POST `/api/contacts/import` | `src/app/api/contacts/import/route.ts:1-120` | Imports contacts/CRMs after billing and rate-limit checks, guarded by admin roles. |
| POST `/api/email/*` | `src/app/api/email/*` (send, campaign, generate) | Sends tenant-level email campaigns only when `requireRole` approves the caller. |
| POST `/api/sms/*` | `src/app/api/sms/*` (send, campaign, import) | Sends SMS/WhatsApp campaigns and imports after the tenant-admin check. |
| GET `/api/health` & `/api/health/monetization` | `src/app/api/health*.ts` | Health endpoints require super-admin tokens and run before any health data is returned. |

This list is intentionally illustrative; the pattern extends to other admin-bound routes such as `/api/ads/google/campaigns`, `/api/whatsapp/send`, `/api/contacts/summary`, and billing slices (`/api/billing/summary`, `/api/billing/history`). Each one begins with `requireRole` and uses the `tenantId` extracted from the verified token to scope downstream writes.

## Known auth gaps (to close)

None for `/api/ads/google/*` as of the current implementation; all routes enforce `requireRole` and derive tenantId server-side.

## Enforcement checklist

1. `requireRole(req, ADMIN_ROLES)` is the first server-side call in every admin handler.
2. Handler logic sources `tenantId` from the returned `AuthContext` and rejects records whose stored `tenantId` does not match before any business logic proceeds.
3. Any reference to helper collections such as `/sites`, `/campaigns`, `/tenants/{tenantId}/settings` always uses the enforced `tenantId` rather than user-supplied identifiers.
4. `Firestore` security rules mirror this approach using `isTenantAdmin(tenantId)` so cross-layer enforcement remains consistent.

With this documented checklist and table, future feature work can append new admin routes by following the same `requireRole` pattern and extending the table above.
