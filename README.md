# Entrestate OS

This workspace contains the Entrestate OS marketing site, dashboard, API routes, and Firebase-powered backend services. The UI is already implemented, so day-to-day work focuses on wiring those surfaces to live data and integrations (Entrestate inventory ingestion, SendGrid, SMS, Google Ads, PayPal, Vercel domains, etc.).

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create your environment file**

   Copy `.env.example` to `.env` (or `.env.local`) and provide the required credentials:

   ```bash
   cp .env.example .env
   ```

   The template includes every variable referenced in the codebase (Firebase, Content Engine, SendGrid, SMS, PayPal, Ziina, Vercel, Meta, cron secret, etc.). Never commit populated env files or provider keys.

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The Next.js app will boot on `http://localhost:3000` and talk to Firebase using the credentials you provided.

## Data Ingestion (Entrestate)

Run `scripts/ingest-entrestate.ts` with service-account credentials to keep the `inventory_projects` collection fresh:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./path/to/service-account.json npx ts-node scripts/ingest-entrestate.ts
```

The script loads the curated dataset in `src/data/entrestate-inventory.ts` and stores normalized documents in Firestore. Trigger it manually or via Cloud Scheduler hitting a dedicated cron endpoint. During development the `/api/projects` endpoints automatically fall back to this dataset if Firestore is empty, ensuring the UI always renders a complete catalogue.

## Launch Readiness Checks

- `npm run lint` &mdash; Next.js + ESLint (`next/core-web-vitals`) with custom React rules disabled only where marketing copy would otherwise fail the build.
- `npm run smoke` &mdash; Runs a lightweight TypeScript script to validate the Entrestate dataset (queries by city, keyword, and price range) plus pagination safety before you push fresh inventory or depend on fallback data in production.

## Secrets & Security Checklist

- Secrets must stay out of git. The repository ignores `.env*` and provider dumps such as `sendgrid.env` (rotated/removed).
- Firebase config is now read from environment variables—no more hardcoded keys in `src/firebase/config.ts`.
- The Facebook SDK bootstrap reads `NEXT_PUBLIC_FACEBOOK_APP_ID` before loading the script; omit this env var if you don’t want the SDK on a given deployment.
- Before launch, update `firestore.rules` to the tenant-aware ruleset and publish via the Firebase CLI.
- Dashboard-only API routes (e.g., `/api/leads/list`, `/api/sms/send`, `/api/email/send`, `/api/payments/*`, `/api/domains`) require a Firebase ID token via `Authorization: Bearer <idToken>`; fetch the token with `getIdToken()` on the client before calling these endpoints, and include the tenant ID when applicable.

## Next Steps

The immediate roadmap is captured in the planning notes (locking Firestore rules, wiring data ingestion, replacing client-side secret storage, making every dashboard module call a real backend). Use this README as a quick reference for environment setup while implementing those stages.
