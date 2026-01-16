# Changelog

## 2026-01-12
- P0 Public Launch Hardening: public lead capture, inventory, and chat preview are now safe and rate-limited.
- Webhooks made idempotent and no longer downgrade plans when SKU is missing.
- Usage counters now increment only on successful provider sends.
- Removed local Firebase Admin SDK JSON from repo workspace.

## 2025-01-11
- Added server-side monetization enforcement with trial state machine and usage limits.
- Introduced billing summary + cancellation endpoints and UI usage meters.
- Wired PayPal/Ziina SKUs, add-ons, and webhook updates with audit logging.
- Gated Google Ads and Meta custom audiences by plan.
- Added monetization health check endpoint.
