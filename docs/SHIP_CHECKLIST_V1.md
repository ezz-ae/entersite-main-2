# V1 Ship Checklist

## Must work end-to-end (no exceptions)
1. Campaign create works
2. Landing is attached (external or builder publish) and stored on campaign
3. Lead form submission creates a lead with campaignId + attribution
4. Smart Sender is enabled on the campaign and has a valid sequence draft
5. Lead creation auto-enqueues a sender run
6. Cron processes sender runs and advances steps
7. Sender Queue page shows runs, failures are visible and retryable
8. Landing view events are written (deduped)
9. Segments build returns Hot/Warm/Cold counts
10. Hot lead suppression stops SMS/WhatsApp noise (email only or stop fully based on your preference)

## Before deploying
- Set required env vars (.env.example)
- Deploy to a fresh Vercel project
- Verify Firestore rules / service account for admin operations

## Demo script (sales)
- Create Campaign
- Attach Landing
- Enable Smart Sender
- Submit a lead
- Show sender run advancing
- Show hot/warm tier on audience dashboard
