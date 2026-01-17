# Launch Checklist (V1)

This is the checklist you run before you point `entrestate.com` at production.

## A) Build sanity
- `npm install`
- `npm run lint`
- `npm run smoke`
- `npm run build`

## B) Environment keys (Vercel)
Set these in Vercel (Production):
- Firebase client config (`NEXT_PUBLIC_*` vars)
- Firebase admin credentials (server‑only)
- PayPal (client id, secret, webhook id)
- Email/SMS provider keys (only if you enable Sender in V1)
- Cron secret (if you enable scheduled jobs)

## C) Firebase (production)
- Firestore enabled
- Deploy security rules + indexes
  - `firebase deploy --only firestore:rules`
  - `firebase deploy --only firestore:indexes`

## D) Payments
- PayPal subscription plan created for **$18 / month**
- PayPal one‑time product ready for **$226**
- Webhook points to your production URL
- Test both:
  - Subscription checkout
  - One‑time checkout

## E) Domains
- `entrestate.com` points to Vercel
- Optional marketing subdomains point to the same Vercel project

## F) Data
If you plan to refresh the inventory dataset:
- Run the ingestion script locally with a service account, or host it as a secured cron.

## G) Final manual QA (15 minutes)
- Sign up, subscribe, and see “active” state
- Create a landing page and publish it
- Submit a lead (form + WhatsApp)
- See the lead in dashboard
- Cancel subscription (ensure access remains until end of period)
