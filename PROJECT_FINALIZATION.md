# PROJECT_FINALIZATION

## Repo Inventory

### Stack + Routing
- Framework: Next.js 16.1.1 (App Router under `src/app`, middleware at `middleware.ts`).
- Runtime: React 18, Tailwind, Radix UI.
- Backend: Next.js route handlers under `src/app/api/*`.
- Data: Firebase (Firestore + Auth) via `firebase-admin` (`src/server/firebase-admin.ts`).
- AI: Google GenAI via `@ai-sdk/google` and Genkit.

### Key Folders
- `src/app`: App Router pages, layouts, API routes.
- `src/components`: UI and feature components.
- `src/server`: Server-only services (inventory, publish, marketing analytics).
- `src/lib`: Shared utilities, clients, messaging helpers.
- `src/data`: Inventory datasets and overrides.
- `scripts`: Ingestion, smoke scripts, migrations.
- `docs`: Backend docs/notes.
- `types`: Type definitions.
- `firebase.json`, `firestore.rules`, `firestore.indexes.json`.

### Key API Routes (grouped)
- Inventory: `/api/projects`, `/api/projects/search`, `/api/projects/meta`, `/api/projects/[projectId]`.
- Leads + CRM: `/api/leads`, `/api/leads/create`, `/api/leads/list`, `/api/leads/update`, `/api/leads/notes`, `/api/leads/notes/list`, `/api/leads/settings`.
- Messaging: `/api/email/send`, `/api/email/generate`, `/api/email/campaign`, `/api/sms/send`, `/api/sms/generate`, `/api/sms/campaign`, `/api/sms/import`.
- Ads: `/api/ads/google/plan`, `/api/ads/google/sync`, `/api/ads/google/campaigns`, `/api/google-ads/*`.
- Audience: `/api/audience/build`, `/api/audience/request`.
- Sites + Publish: `/api/sites`, `/api/sites/stats`, `/api/publish/page`, `/api/publish/vercel`.
- Domains: `/api/domains`, `/api/domains/request`.
- Bots: `/api/bot/main/chat`, `/api/bot/[botId]/chat`, `/api/bot/preview/chat`.
- Payments: `/api/payments/paypal/*`, `/api/payments/ziina/*`.
- Support + Profile: `/api/support`, `/api/profile`, `/api/team/invites`.
- Health: `/api/health`.

### Key Data Collections (inferred)
- `tenants/{tenantId}`
  - `leads/{leadId}` + `leads/{leadId}/notes/{noteId}`
  - `settings/profile`, `settings/leads`
  - `contacts`
  - `ads_campaigns`
  - `audience_requests`
  - `marketing_plans`
  - `teamInvites`
  - `domain_requests`
  - `events` (site stats)
- `sites` (top-level)
- `pages_public` (published pages)
- `inventory_projects` (public inventory)
- `bot_events`
- `content_posts`
- `health`

## Launch Status (Phase 0)

| Module | Status | Blockers | Fix |
| --- | --- | --- | --- |
| Auth + RBAC | Partial | No unified tenant guard; some routes unauth | Phase 1 guard + enforce on routes |
| Tenant isolation | Partial | TenantId accepted from client in places | Derive tenant from claims/profile |
| Firestore rules | Partial | Rules are owner-based, not tenant-based | Replace with tenant/role rules |
| Inventory | Partial | Public fallback only; Firestore quota errors | Fix inventory ingestion + admin creds |
| Leads | Partial | Mixed auth; missing plan limits | Enforce auth/tenant + limits |
| Email/SMS | Partial | Requires env + rate limit + logs | Gate + logging + rate limiting |
| Google Ads | Partial | Simulated only | Connect + logs + plan limits |
| Domains | Partial | Needs Vercel token + status | Add connect + revoke + logs |
| Publishing | Partial | Needs tenant isolation + SSR SEO | Enforce tenant + publish rules |
| AI Chat | Partial | Fallback responses, no grounding guard | Fix model key + guardrails |
| Payments | Partial | Webhook verification missing | Implement verified webhooks |
| Support | Partial | Depends on Resend | Gate + logs |

## P0 Launch Fixes Completed
- Public lead capture allows unauthenticated submissions for published sites only, with rate limit and honeypot checks.
- Public inventory search and project detail APIs are read-only and rate-limited.
- Marketing chat preview is public, stateless, and rate-limited.
- Audience request GET no longer crashes and returns safe empty state.
- Webhook processing is idempotent and will not overwrite plans without valid plan SKUs.
- Usage counters now increment only after provider success for email/SMS sends and campaigns.
- Local Firebase Admin SDK JSON removed; server uses env-based credentials only.

## Architecture Summary
TBD (Phase 2+)

## Env Vars (Required / Optional)
TBD (Phase 2+)

## Definition of Done
TBD (Phase 2+)

## Deployment Steps (Staging -> Production)
See `DEPLOYMENT.md`.

## QA Test Plan (Manual + Scripts)
See `DEPLOYMENT.md` and `RELEASE_CHECKLIST.md`.

## Security Model
TBD (Phase 1/2)

## Deployment Runbook
See `DEPLOYMENT.md` for the staging → production runbook, env tiers, and rollback steps.

## Go/No-Go Checklist
- [ ] `/api/health` and `/api/health/monetization` return 200 with admin token.
- [ ] Webhooks verified with test events (PayPal + Ziina).
- [ ] Public flows verified (lead capture, discover search, project detail, chat preview).
- [ ] Rate limiting verified on public endpoints.
- [ ] Billing flow verified (trial → upgrade → unlock).
- [ ] Usage counters accurate (failed sends do not increment).
- [ ] Error tracking receiving events.
- [ ] No secrets committed to the repo.
