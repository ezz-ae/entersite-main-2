# Entrestate Launch Audit

## 1) EXEC SUMMARY
Launch readiness score: 52/100

Top 10 launch blockers (P0)
1) Public lead capture fails because the client posts without auth but the API requires auth. Evidence: `src/lib/leads.ts#L23`, `src/app/api/leads/route.ts#L58`. Fix: allow unauth lead capture for public pages with siteId-based tenant resolution, add rate limit and spam protection.
2) Public inventory search fails because `/discover` calls an auth-guarded API. Evidence: `src/app/discover/page.tsx#L47`, `src/app/api/projects/search/route.ts#L33`. Fix: make search endpoint public (read-only) or move to server-rendered fetch with public access.
3) Public project detail pages fail for the same auth mismatch. Evidence: `src/app/discover/[projectId]/page.tsx#L48`, `src/app/api/projects/[projectId]/route.ts#L16`. Fix: allow public reads for project detail API or move to server route that reads inventory directly.
4) Marketing chat demo fails because the preview API requires auth. Evidence: `src/components/marketing/feature-showcase/chat-agent-showcase.tsx#L31`, `src/app/api/bot/preview/chat/route.ts#L28`. Fix: add a public preview route with strict rate limits and no tenant data writes.
5) Audience request GET crashes at runtime due to undefined `payload`. Evidence: `src/app/api/audience/request/route.ts#L21`. Fix: remove the `payload` check or load it from query params.
6) Usage counters are incremented before provider send; failed sends still consume quota. Evidence: `src/app/api/email/send/route.ts#L42`, `src/app/api/sms/send/route.ts#L42`, `src/app/api/email/campaign/route.ts#L62`, `src/app/api/sms/campaign/route.ts#L63`. Fix: increment usage only after provider success or add compensation logic.
7) Webhooks default plan to `agent_pro` when SKU/plan is missing, which can downgrade existing subscriptions. Evidence: `src/app/api/webhooks/paypal/route.ts#L115`, `src/app/api/webhooks/ziina/route.ts#L69`. Fix: only update plan when a valid plan SKU is present, otherwise leave plan unchanged.
8) Webhooks are not idempotent; repeat events can double-apply add-ons or reset periods. Evidence: no event-id guard before writes in `src/app/api/webhooks/paypal/route.ts#L121` and `src/app/api/webhooks/ziina/route.ts#L81`. Fix: check `event.id` against stored `lastEventId` before applying changes.
9) Service account JSON exists in repo root (risk of accidental leakage if committed or deployed). Evidence: `studio-400579658-555a8-firebase-adminsdk-fbsvc-b220dd9c63.json` present in workspace; ignore pattern in `.gitignore` at `/.gitignore#L29`. Fix: remove local secret from repo root and store only in secure secret manager.
10) Inventory pages depend on auth-protected endpoints, so the public site shows empty data and "Project not found". Evidence: `src/app/discover/page.tsx#L47`, `src/app/discover/[projectId]/page.tsx#L48`, `src/app/api/projects/search/route.ts#L33`, `src/app/api/projects/[projectId]/route.ts#L16`. Fix: same as #2 and #3.

Top 10 scale blockers (P1)
1) Rate limiting is in-memory and per-instance, which is ineffective in serverless. Evidence: `src/lib/rate-limit.ts#L1`. Fix: move rate limiting to a shared store (Redis/Upstash) or Cloudflare rate limiting.
2) No error tracking (Sentry or equivalent) found. Evidence: no Sentry config or dependency; search returns none. UNVERIFIED: run `rg -n "sentry"`. Fix: add error tracking and sampling.
3) Logging is limited to email/SMS send; most endpoints use console only. Evidence: `src/lib/logger.ts#L1`, usage only in `src/app/api/email/send/route.ts#L28` and `src/app/api/sms/send/route.ts#L28`. Fix: add structured logging across critical APIs.
4) Inventory search loads up to 8000 records per request and relies on in-memory cache. Evidence: `src/app/api/projects/search/route.ts#L7`, `src/server/inventory.ts#L6`. Fix: pre-index search fields, paginate at DB, or cache in a shared store.
5) Google Ads "sync" is simulated and does not call Google Ads API. Evidence: comment and simulated ID in `src/app/api/ads/google/sync/route.ts#L31`. Fix: implement OAuth and real API calls.
6) Meta audience build only stores a request; no actual API integration or status. Evidence: `src/app/api/audience/build/route.ts#L22`. Fix: add OAuth/token storage and request execution, or surface as manual workflow in UI.
7) HubSpot/Twilio/Resend are global env tokens, no per-tenant connect/revoke or audit trail. Evidence: `src/lib/capabilities.ts#L1`, `src/lib/integrations/hubspot-leads.ts#L1`. Fix: implement connect/revoke and store per-tenant tokens in admin-only collection.
8) Billing cancel does not notify provider, so subscription may continue charging. Evidence: `src/app/api/billing/cancel/route.ts#L1`. Fix: call provider API or explicitly mark as manual cancel and block renewals.
9) Seats count assumes +1 for owner and may double-count, blocking invites early. Evidence: `src/app/api/billing/summary/route.ts#L15`, `src/app/api/team/invites/route.ts#L58`. Fix: compute seats from distinct members including owner.
10) Discover and project detail pages are client-only, reducing SEO indexability. Evidence: `src/app/discover/page.tsx#L1`, `src/app/discover/[projectId]/page.tsx#L1`. Fix: move to server components or add SSR data fetch.

Safe to launch now vs not
- Safe now: authenticated dashboard features that do not depend on public marketing flows (billing summary, internal campaigns UI, site listing) assuming correct envs. Evidence: routes are protected by `requireRole` in `src/app/api/*/route.ts`.
- Not safe now: public marketing site and inventory flows, chat preview, lead capture, and webhook correctness. Evidence: blockers listed above.

## 2) SECURITY AUDIT (P0)
Tenant isolation proof
- Firestore rules enforce tenant boundary by token-tenant matching. Evidence: `firestore.rules#L40` through `firestore.rules#L100`.
- API guards derive tenantId from token/claims or profile, not from client input. Evidence: `src/server/auth.ts#L70`, `src/server/auth.ts#L117`.

Cross-tenant attack attempts (static analysis; UNVERIFIED without emulator tests)
1) Read `/tenants/{otherTenant}/leads` via Firestore client. Expected: denied by `isTenantMember`. Evidence: `firestore.rules#L40`.
2) Update another tenant site via `/api/sites` with a foreign `siteId`. Expected: 403. Evidence: `src/app/api/sites/route.ts#L68`.
3) Publish another tenant site via `/api/publish/page` with foreign `siteId`. Expected: 403. Evidence: `src/app/api/publish/page/route.ts#L40`.
4) Update other tenant lead via `/api/leads/update` with foreign `leadId`. Expected: 404 (tenant-scoped lookup). Evidence: `src/app/api/leads/update/route.ts#L25`.
5) Write `/tenants/{otherTenant}/usage` directly. Expected: denied by rules. Evidence: `firestore.rules#L87`.

Auth & RBAC
- Guarded: all API routes under `src/app/api/**/route.ts` call `requireRole` except webhooks. Evidence: `src/server/auth.ts#L123`; route list from `rg --files -g 'route.ts'`.
- Unguarded (public by design): payment webhooks only, protected by signature verification. Evidence: `src/app/api/webhooks/paypal/route.ts#L100`, `src/app/api/webhooks/ziina/route.ts#L37`.

Secrets exposure
- Hardcoded Firebase client config is embedded in source. Evidence: `src/firebase/config.ts#L4`, `src/lib/firebase.ts#L4`, `src/config/firebase.public.json#L1`.
- Firebase Admin service account JSON exists in workspace. Evidence: `studio-400579658-555a8-firebase-adminsdk-fbsvc-b220dd9c63.json` present; ignored in `.gitignore` at `/.gitignore#L29`.

Rate limiting
- Present on: email send/campaign, SMS send/campaign, ads plan/sync, webhooks. Evidence: `src/app/api/email/send/route.ts#L36`, `src/app/api/sms/send/route.ts#L36`, `src/app/api/ads/google/plan/route.ts#L86`, `src/app/api/webhooks/paypal/route.ts#L74`.
- Missing on: lead capture, project search, chat preview, bot main chat. Evidence: no `enforceRateLimit` in `src/app/api/leads/route.ts`, `src/app/api/projects/search/route.ts`, `src/app/api/bot/preview/chat/route.ts`, `src/app/api/bot/main/chat/route.ts`.

Webhooks
- PayPal signature verification present. Evidence: `src/app/api/webhooks/paypal/route.ts#L100`.
- Ziina signature verification present. Evidence: `src/app/api/webhooks/ziina/route.ts#L37`.

Security PASS/FAIL
- Tenant isolation: PASS (rules + server guards present). Evidence: `firestore.rules#L40`, `src/server/auth.ts#L117`.
- Auth/RBAC enforcement: PASS with exception (webhooks public but signed). Evidence: `src/app/api/webhooks/paypal/route.ts#L100`.
- Secrets exposure: FAIL (service account file present; hardcoded config). Evidence: `studio-400579658-555a8-firebase-adminsdk-fbsvc-b220dd9c63.json`, `src/firebase/config.ts#L4`.
- Rate limiting: FAIL (critical public endpoints missing). Evidence: `src/app/api/leads/route.ts#L58`, `src/app/api/bot/preview/chat/route.ts#L28`.
- Webhook verification: PASS (signatures validated). Evidence: `src/app/api/webhooks/paypal/route.ts#L100`, `src/app/api/webhooks/ziina/route.ts#L37`.

## 3) MONETIZATION AUDIT (P0)
Trial logic
- Trial duration and milestone conditions defined in billing core. Evidence: `src/lib/server/billing.ts#L54`, `src/lib/server/billing.ts#L604`.
- Landing page publish marks trial milestone. Evidence: `src/app/api/publish/page/route.ts#L71`.

Limits enforced server-side (evidence per limit type)
- Landing pages: `enforceUsageLimit` in `src/app/api/sites/route.ts#L95`, `src/app/api/generate/landing/route.ts#L45`.
- Leads: `enforceUsageLimit` in `src/app/api/leads/route.ts#L66`, `src/app/api/leads/create/route.ts#L26`.
- AI conversations: `enforceUsageLimit` in `src/app/api/chat/route.ts#L31`, `src/app/api/bot/preview/chat/route.ts#L31`, `src/app/api/bot/[botId]/chat/route.ts#L33`.
- Email monthly: `enforceUsageLimit` in `src/app/api/email/send/route.ts#L42`, `src/app/api/email/campaign/route.ts#L62`.
- SMS monthly: `enforceUsageLimit` in `src/app/api/sms/send/route.ts#L42`, `src/app/api/sms/campaign/route.ts#L63`.
- Seats: enforced in invite flow. Evidence: `src/app/api/team/invites/route.ts#L55`.
- Domains: `enforceUsageLimit` in `src/app/api/domains/route.ts#L75`.

Upgrade unlock behavior
- Subscription updates are applied by webhooks and used on next server action. Evidence: `src/app/api/webhooks/paypal/route.ts#L170`, `src/lib/server/billing.ts#L477`.
- UI refresh after upgrade is not automatic; client fetches summary on load. Evidence: `src/components/dashboard/billing/billing-manager.tsx#L46`. UNVERIFIED: real-time unlock requires webhook speed and client reload.

Webhook correctness
- Signature verification: PASS. Evidence: `src/app/api/webhooks/paypal/route.ts#L100`, `src/app/api/webhooks/ziina/route.ts#L37`.
- Idempotency: FAIL (no event-id guard). Evidence: writes occur without checking `event.id` at `src/app/api/webhooks/paypal/route.ts#L121` and `src/app/api/webhooks/ziina/route.ts#L81`.
- Subscription state machine: PARTIAL (status mapping exists, but plan defaults to `agent_pro`). Evidence: `src/app/api/webhooks/paypal/route.ts#L115`, `src/app/api/webhooks/ziina/route.ts#L69`.

Monetization PASS/FAIL
- Trial logic: PASS (defined and enforced). Evidence: `src/lib/server/billing.ts#L604`, `src/app/api/publish/page/route.ts#L71`.
- Server-side limits: PASS (enforced in routes listed above).
- Accurate usage accounting: FAIL (usage increments before send). Evidence: `src/app/api/email/send/route.ts#L42`, `src/app/api/sms/send/route.ts#L42`.
- Webhook correctness: FAIL (idempotency, plan fallback). Evidence: `src/app/api/webhooks/paypal/route.ts#L115`.

## 4) GOLDEN PATH AUDIT (P0)
End-to-end path (status based on static review; UNVERIFIED without live tests)
1) Onboard -> Profile saved
   - Endpoint: `POST /api/profile`. Evidence: `src/app/api/profile/route.ts#L38`.
   - Data: `tenants/{tenantId}/settings/profile`. Evidence: `src/app/api/profile/route.ts#L61`.
   - Risk: requires auth token; onboarding flow not verified. Test: call with auth and confirm Firestore doc created.
2) Create landing page
   - Endpoint: `POST /api/sites`. Evidence: `src/app/api/sites/route.ts#L60`.
   - Data: `sites/{siteId}` with `tenantId`. Evidence: `src/app/api/sites/route.ts#L98`.
   - Risk: none found; plan limit enforced. Test: create site then list via `GET /api/sites`.
3) Publish landing page
   - Endpoint: `POST /api/publish/page`. Evidence: `src/app/api/publish/page/route.ts#L24`.
   - Data: `sites/{siteId}.published` plus `publishedUrl`. Evidence: `src/app/api/publish/page/route.ts#L61`.
   - Risk: requires auth; ok. Test: publish and load `/p/{siteId}`.
4) Capture lead (public)
   - Endpoint: `POST /api/leads` called from public forms. Evidence: `src/lib/leads.ts#L23`.
   - Data: `tenants/{tenantId}/leads`. Evidence: `src/app/api/leads/route.ts#L88`.
   - Status: FAIL for public pages because API requires auth. Evidence: `src/app/api/leads/route.ts#L62`.
5) Lead appears in CRM
   - Endpoint: `GET /api/leads/list`. Evidence: `src/app/api/leads/list/route.ts#L12`.
   - Data: `tenants/{tenantId}/leads`. Evidence: `src/app/api/leads/list/route.ts#L22`.
   - Risk: depends on step 4. Test: list leads after capture.
6) Follow up via email/SMS
   - Endpoints: `POST /api/email/send`, `POST /api/sms/send`. Evidence: `src/app/api/email/send/route.ts#L27`, `src/app/api/sms/send/route.ts#L27`.
   - Data: no persistent send logs; usage stored in `tenants/{tenantId}/usage`. Evidence: `src/lib/server/billing.ts#L589`.
   - Risk: usage increments before provider success. Test: send with invalid provider, verify usage does not increase.
7) Usage counters increment
   - Mechanism: `enforceUsageLimits` transaction updates `tenants/{tenantId}/usage`. Evidence: `src/lib/server/billing.ts#L589`.
8) Limit hit -> graceful block
   - Mechanism: `PlanLimitError` -> 402 with structured payload. Evidence: `src/lib/server/billing.ts#L373`, `src/app/api/email/send/route.ts#L63`.
9) Upgrade unlock
   - Mechanism: webhook updates `subscriptions/{tenantId}`. Evidence: `src/app/api/webhooks/paypal/route.ts#L170`.
   - Risk: unlock timing depends on webhook delivery; no real-time push. UNVERIFIED: test with live webhook.

## 5) RELIABILITY / OBSERVABILITY (P1)
- Health endpoints exist but require super-admin auth. Evidence: `src/app/api/health/route.ts#L5`, `src/app/api/health/monetization/route.ts#L5`.
- No error tracking system found. Evidence: no Sentry config; UNVERIFIED without build scan.
- Logging structured only in email/SMS send. Evidence: `src/lib/logger.ts#L1`, usage in `src/app/api/email/send/route.ts#L28`.
- No retry queues for email/SMS/DM; sends are synchronous. Evidence: `src/app/api/email/send/route.ts#L47`, `src/app/api/sms/send/route.ts#L47`.

## 6) PERFORMANCE (P1)
- Marketing home and inventory search are dynamic and client-heavy. Evidence: `src/app/(marketing)/page.tsx#L6`, `src/app/discover/page.tsx#L1`.
- Inventory search loads large dataset each request and filters in memory. Evidence: `src/app/api/projects/search/route.ts#L35`, `src/server/inventory.ts#L6`.
- Caching is in-memory only. Evidence: `src/server/inventory.ts#L6`. UNVERIFIED: actual latency without load tests.

## 7) SEO / MARKETING SITE (P1)
- Robots and sitemap exist. Evidence: `src/app/robots.ts#L1`, `src/app/sitemap.ts#L1`.
- Metadata exists for key pages; dynamic project pages are client-only. Evidence: `src/app/discover/[projectId]/page.tsx#L1`.
- No schema markup found. Evidence: no `ld+json` in `src/app` or `src/components` (UNVERIFIED: `rg -n "ld\\+json"`).

## 8) INTEGRATIONS AUDIT (P1)
- Resend: gated by `CAP`, used for lead notifications and invites. Evidence: `src/lib/capabilities.ts#L1`, `src/app/api/leads/route.ts#L116`, `src/app/api/team/invites/route.ts#L97`. No connect/revoke or logging.
- Twilio: gated by `CAP`, used for lead alerts and SMS send. Evidence: `src/lib/capabilities.ts#L1`, `src/app/api/sms/send/route.ts#L31`. No connect/revoke or logging.
- HubSpot: global access token only; per-tenant connect/revoke not implemented. Evidence: `src/lib/hubspot.ts#L1`, `src/app/api/leads/route.ts#L157`.
- Vercel domains: uses token and project ID; no revoke/status polling. Evidence: `src/app/api/domains/route.ts#L1`.
- Google Ads: planning and sync are simulated, no OAuth. Evidence: `src/app/api/ads/google/sync/route.ts#L31`, `src/app/api/google-ads/campaigns/route.ts#L1`.
- Meta audiences: request stored only, no API integration. Evidence: `src/app/api/audience/build/route.ts#L22`.

## 9) ACTION PLAN
1) P0 (S) Allow public lead capture safely. Files: `src/app/api/leads/route.ts`, `src/lib/leads.ts`, add rate limit in `src/lib/rate-limit.ts`. Acceptance: submit lead from a public page and see `tenants/{tenantId}/leads` created without auth.
2) P0 (S) Make inventory search + project detail public read-only. Files: `src/app/api/projects/search/route.ts`, `src/app/api/projects/[projectId]/route.ts`. Acceptance: `/discover` loads data without auth, `/discover/{id}` loads details.
3) P0 (S) Enable public chat preview with strict rate limits. Files: `src/app/api/bot/preview/chat/route.ts`, `src/components/marketing/feature-showcase/chat-agent-showcase.tsx`. Acceptance: chat demo responds without auth; rate limit triggers at threshold.
4) P0 (S) Fix `audience/request` GET crash. Files: `src/app/api/audience/request/route.ts`. Acceptance: GET returns last request without error.
5) P0 (M) Fix webhook plan fallback and add idempotency guard. Files: `src/app/api/webhooks/paypal/route.ts`, `src/app/api/webhooks/ziina/route.ts`. Acceptance: repeated webhook event does not double-apply add-ons or reset plan.
6) P0 (M) Move usage increments after provider success (email/SMS/campaigns). Files: `src/app/api/email/send/route.ts`, `src/app/api/sms/send/route.ts`, `src/app/api/email/campaign/route.ts`, `src/app/api/sms/campaign/route.ts`. Acceptance: failed provider call does not increment usage.
7) P0 (S) Remove local admin SDK JSON from repo root. Files: `studio-400579658-555a8-firebase-adminsdk-fbsvc-b220dd9c63.json` (delete), confirm `.gitignore` remains. Acceptance: secret file removed and not tracked.
8) P1 (M) Replace in-memory rate limiting with shared store. Files: `src/lib/rate-limit.ts` and callers. Acceptance: rate limit survives across instances.
9) P1 (M) Add error tracking and structured logging to core endpoints. Files: `src/lib/logger.ts`, apply to `src/app/api/**/route.ts`. Acceptance: logs include tenantId and requestId; errors appear in tracker.
10) P1 (M) Implement provider-level cancel or clear UI warning. Files: `src/app/api/billing/cancel/route.ts`, billing UI. Acceptance: cancel request updates provider or clearly marks manual cancel.
