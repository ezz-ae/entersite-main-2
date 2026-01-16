# Entrestate Deployment Runbook

This document is the single source of truth for repeatable, safe deployments to Vercel with Firebase (Auth + Firestore).

## Deployment Prompt (Copy/Paste)
Use this as a quick deployment prompt for operators:

```
Target: Vercel + Firebase
Environment: STAGING then PRODUCTION

1) Verify env: ENV_FILE=.env.<env> ts-node --esm scripts/deploy/verify_env.ts
2) Lint/build: npm run lint && npm run build
3) Deploy Firestore rules/indexes
4) Deploy to Vercel (staging -> prod)
5) Run smoke tests (scripts/deploy/smoke_test.sh)
6) Go/No-Go gate at end of DEPLOYMENT.md
```

## Environments
- **STAGING**: pre-release validation, safe for internal testing.
- **PRODUCTION**: customer-facing deployment.

## Tiered Environment Variables

### Tier A (Required)
These are required for the app to boot and the core public flows to work.

Client (public):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_ROOT_DOMAIN` (e.g., `entrestate.com`)

Server (admin):
- **Either** `FIREBASE_ADMIN_SDK_CONFIG` (full JSON string) **or**
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` (with `\n` line breaks)

Content Engine (used by chat and smart writing):
- **Either** `GEMINI_API_KEY` **or** `GOOGLE_GENERATIVE_AI_API_KEY`

Rate limiting (required in production):
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Security:
- `CRON_SECRET` (required if cron endpoints are used)

### Tier B (Optional / Feature-flagged)
These are optional and only needed if the related features are enabled.

Email (Resend):
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `NOTIFY_EMAIL_TO` (fallback alert recipient)

SMS (Twilio):
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `NOTIFY_SMS_TO`

CRM (HubSpot):
- `HUBSPOT_ACCESS_TOKEN`

Payments (PayPal):
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_API_BASE` (sandbox: `https://api-m.sandbox.paypal.com`)

Payments (Ziina):
- `ZIINA_API_KEY`
- `ZIINA_WEBHOOK_SECRET`
- `ZIINA_BASE_URL` (sandbox: `https://api.sandbox.ziina.com`)

Domains (Vercel):
- `VERCEL_API_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_TEAM_ID`

Notifications / Support:
- `ADS_NOTIFICATION_EMAIL`
- `DOMAIN_REQUEST_EMAIL`
- `SUPPORT_EMAIL`

Error tracking (Sentry):
- `SENTRY_DSN` (server)
- `NEXT_PUBLIC_SENTRY_DSN` (client)

Other:
- `NEXT_PUBLIC_SITE_DOMAIN` (defaults to `site.<root>`)
- `RATE_LIMIT_DISABLED` (must be `false` in production)

Verification (env):
- Run: `ENV_FILE=.env.local ts-node --esm scripts/deploy/verify_env.ts`
- Expected: `All required env vars are set.`

---

## Firebase Setup (Per Environment)

1) **Create Firebase Project**
- Console: `Firebase Console -> Add project`.
- Set region to **nam5** to match `firebase.json`.
- Verify: Firestore shows "(default)" database in region **nam5**.

2) **Enable Auth Providers**
- Console: `Build -> Authentication -> Sign-in method`.
- Enable **Email/Password** (required for login).
- Verify: Sign-in method shows "Enabled".

3) **Create Web App + Client Config**
- Console: `Project Settings -> General -> Your apps -> Add app (Web)`.
- Copy config into `NEXT_PUBLIC_FIREBASE_*` env vars.
- Verify: App loads login screen without Firebase config errors.

4) **Create Admin Credentials**
- Console: `Project Settings -> Service Accounts -> Generate new private key`.
- Set `FIREBASE_ADMIN_SDK_CONFIG` (JSON string) **or** split keys into `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
- Verify: `GET /api/health` with admin token returns `firebase: connected`.

5) **Deploy Firestore Rules + Indexes**
- Command:
  - `firebase use <projectId>`
  - `firebase deploy --only firestore:rules --project <projectId>`
  - `firebase deploy --only firestore:indexes --project <projectId>`
- Verify: Firebase console shows updated rules and indexes.

6) **Storage (if used)**
- Console: `Build -> Storage -> Get started`.
- Verify: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` matches project bucket.

---

## Vercel Setup

1) **Create Vercel Project**
- `Vercel Dashboard -> New Project -> Import repository`.
- Build/Install commands are already set in `vercel.json`.
- Verify: Vercel detects Next.js and uses `npm run build`.

2) **Set Environment Variables**
- `Vercel Dashboard -> Project -> Settings -> Environment Variables`.
- Add Tier A for both STAGING and PRODUCTION.
- Add Tier B only if corresponding features are enabled.
- Verify: `/api/health` (admin token) and `/api/health/monetization` return 200.

3) **Assign Domains**
- STAGING: use a subdomain (e.g., `staging.entrestate.com`).
- PROD: attach primary domain (`entrestate.com`).
- Verify: domain resolves to the correct deployment.

---

## Webhook Setup (Payments)

### PayPal
- Endpoint: `https://<domain>/api/webhooks/paypal`
- Add the webhook in PayPal developer dashboard.
- Set `PAYPAL_WEBHOOK_ID` from PayPal.
- Verify: send a test event -> endpoint responds `200` and logs show "subscription_updated".

### Ziina
- Endpoint: `https://<domain>/api/webhooks/ziina`
- Set `ZIINA_WEBHOOK_SECRET` from Ziina dashboard.
- Verify: send a test event -> endpoint responds `200` and logs show "subscription_updated".

---

## Cron / Scheduler

### Inventory Ingest
- Script: `npm run ingest` (runs `scripts/ingest-entrestate.ts`).
- Schedule: run daily or weekly from a trusted runner (CI or server) with Firebase admin credentials.
- Verify: Firestore `inventory_projects` count increases; `/api/projects/search` returns data.

### Usage Consistency Check
- If a usage consistency script exists (e.g., `scripts/usage-consistency-check.ts`), schedule it daily.
- Verify: job logs show "OK" or list of anomalies.

---

## Deployment Steps

### STAGING
1) Verify env:
- `ENV_FILE=.env.staging ts-node --esm scripts/deploy/verify_env.ts`
- Verify: exit code `0`.

2) Build locally (optional but recommended):
- `npm install`
- `npm run lint`
- `npm run build`
- Verify: build completes without errors.

3) Deploy:
- If using Vercel Git integration: merge to `staging` branch.
- If using CLI: `vercel --prebuilt` or `vercel`.
- Verify: staging URL loads and `/api/health` (admin token) returns 200.

### PRODUCTION
1) Re-run env verification:
- `ENV_FILE=.env.production ts-node --esm scripts/deploy/verify_env.ts`
- Verify: exit code `0`.

2) Promote:
- Merge `staging` -> `main` (Git integration) **or** run `vercel --prod`.
- Verify: production URL returns 200; public flows pass smoke tests.

---

## Smoke Tests

Run against staging then production:

```bash
BASE_URL=https://staging.entrestate.com \
ADMIN_TOKEN=<firebase_id_token_with_super_admin> \
PUBLIC_SITE_ID=<published_site_id_or_slug> \
PROJECT_ID=<inventory_project_id> \
CHAT_MESSAGE="Tell me about Dubai investment" \
bash scripts/deploy/smoke_test.sh
```

Expected:
- Health endpoints return 200 (admin token required). If `/api/health/env` or `/api/health/billing` are not implemented, the script will warn and continue.
- Public search returns 200.
- Project detail returns 200 when `PROJECT_ID` is set.
- Chat preview returns 200 and a reply.
- Lead capture returns 200 when `PUBLIC_SITE_ID` is set.
- Rate limit test triggers 429 on the configured public endpoint.

---

## Rollback Plan

1) **Vercel rollback**
- `Vercel Dashboard -> Deployments -> Select last known good -> Promote`.
- Verify: site resolves to previous build and smoke tests pass.

2) **Rules rollback**
- Re-deploy last known good `firestore.rules` from Git.
- Verify: Firestore rules version changes in console.

3) **Env rollback**
- Revert any env changes in Vercel.
- Verify: `/api/health` and `/api/health/monetization` return 200.

---

## Known Failure Modes + Diagnosis

- **Admin credentials missing**: `/api/health` returns `firebase: error`.
  - Fix: set `FIREBASE_ADMIN_SDK_CONFIG` or split admin keys.
- **Automation key missing**: chat preview returns 500 or fallback.
  - Fix: set `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`.
- **Rate limiting disabled**: public endpoints are unthrottled.
  - Fix: set `UPSTASH_REDIS_REST_URL/TOKEN` and ensure `RATE_LIMIT_DISABLED=false`.
- **Webhook signature failures**: PayPal/Ziina webhooks return 400.
  - Fix: confirm `PAYPAL_WEBHOOK_ID` / `ZIINA_WEBHOOK_SECRET` and correct endpoint URL.
- **Billing not updating**: `/api/health/monetization` shows provider disabled.
  - Fix: add provider env keys and confirm webhook delivery.
- **Sentry not receiving events**: no errors in Sentry.
  - Fix: set `SENTRY_DSN` and verify `sentry.*.config.ts` is deployed.

---

## Go/No-Go Gate

If any item fails -> **NO-GO**.

- [ ] `/api/health` and `/api/health/monetization` return 200 with admin token.
- [ ] `/api/health/env` and `/api/health/billing` return 200 if implemented.
- [ ] Webhooks verified (PayPal + Ziina) with real test events.
- [ ] Public flows verified: lead capture, discover search, project detail, chat preview.
- [ ] Rate limiting verified (429 after threshold on public endpoints).
- [ ] Billing verified: trial -> upgrade -> unlock.
- [ ] Usage counters accurate (failed sends do not consume quota).
- [ ] Error tracking receiving events.
- [ ] No secrets committed to the repo.
