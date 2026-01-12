# Release Checklist (Entrestate)

## Before Deploy
- [ ] `ENV_FILE=.env.staging ts-node --esm scripts/deploy/verify_env.ts`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Firebase rules + indexes deployed (`firebase deploy --only firestore:rules,indexes`)
- [ ] Webhooks configured (PayPal + Ziina) and test events verified
- [ ] Upstash rate limiting configured and enabled in staging
- [ ] Sentry DSN configured and test error appears in Sentry
- [ ] Smoke tests pass on staging (`scripts/deploy/smoke_test.sh`)
- [ ] No secrets committed (`git status` clean + .gitignore intact)

## Deploy
- [ ] Merge to `staging` or deploy via `vercel` (staging)
- [ ] Verify staging URL and health endpoints
- [ ] Promote to production (`vercel --prod` or merge to `main`)

## After Deploy
- [ ] Smoke tests pass on production (`scripts/deploy/smoke_test.sh`)
- [ ] `/api/health` and `/api/health/monetization` return 200 (admin token)
- [ ] Public flows confirmed: lead capture, discover search, project detail, chat preview
- [ ] Billing flow verified: trial → upgrade → unlock
- [ ] Usage counters accurate (failed sends do not increment)
- [ ] Error tracking receiving production events
- [ ] Rollback plan confirmed (previous deployment can be promoted)
