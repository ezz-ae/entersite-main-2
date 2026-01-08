# Entrestate OS: Launch & Deployment Guide

## 1. Environment Synchronization
Copy `.env.example` to `.env.local` and populate all nodes.
- **AI Node:** Gemini API key is mandatory for site generation.
- **Delivery Nodes:** SendGrid and Twilio are required for messaging.
- **Payment Node:** PayPal and Ziina must be in 'live' mode for production revenue.

## 2. Infrastructure Deployment (Vercel)
The OS is optimized for Vercel Edge functions.
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy Production
vercel --prod
```

## 3. Data Migration & Ingestion
Synchronize the master project database before opening to agents.
```bash
# 1. Ingest Master Inventory (3,750+ Projects)
ts-node --esm scripts/ingest-entrestate.ts

# 2. Backfill Site Metadata (For existing users)
ts-node scripts/migrations/backfill-site-metadata.ts
```

## 4. Worker Deployment (AI Refiner)
The Refiner requires a background worker to process heavy design tasks.
Deploy the worker to **Cloud Run** or keep it running on an always-on instance:
```bash
GOOGLE_APPLICATION_CREDENTIALS=service-account.json \
TS_NODE_PROJECT=tsconfig.json \
npx ts-node scripts/workers/refiner-worker.ts
```

## 5. System Status Check
Visit `/init` (The Control Room) after deployment to verify:
- [ ] Firebase Connection: **Active**
- [ ] Master Node Sync: **Online**
- [ ] AI Latency: **< 1.5s**
- [ ] Payment Webhooks: **Healthy**

## 6. Post-Launch Operational Commands
- **Scale Ads:** `npm run ads:optimize` (Cron triggered)
- **Scrub Leads:** `npm run leads:verify` (Daily verification)
- **Check ROI Hub:** `npm run market:sync` (Weekly inventory update)
