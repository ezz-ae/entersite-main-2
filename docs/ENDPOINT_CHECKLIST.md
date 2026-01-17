API ENDPOINT CHECKLIST (V1)

Use this for every new API route before merge.

Auth + Tenant Context
- [ ] `requireRole` is the first call in the handler.
- [ ] Use `ADMIN_ROLES` for admin actions; use `ALL_ROLES` for standard tenant reads/writes.
- [ ] Reject any request payload that includes `tenantId`.
- [ ] `tenantId` is derived only from the verified token.
- [ ] For writes: verify the target document belongs to `tenantId` before updates.

Request Validation
- [ ] Validate request body/query with `zod` (or equivalent).
- [ ] Return 400 for invalid payloads with `details`.
- [ ] Normalize values (trim strings, coerce numbers) before use.

Same-Origin + Rate Limits
- [ ] `enforceSameOrigin` on all mutating routes (POST/PATCH/PUT/DELETE).
- [ ] Rate limit any public endpoint or any endpoint that can be abused.

Data Safety
- [ ] Never write secrets/tokens/provider payloads to Firestore.
- [ ] Log only normalized payloads (no PII unless required).
- [ ] Avoid storing large arrays in single docs (use events collection instead).

Responses
- [ ] Return 401/403 for auth failures (Unauthorized/Forbidden).
- [ ] Return 404 for missing resources.
- [ ] Return 500 with a safe error message (no internal details).

Events + Audits (when applicable)
- [ ] Emit domain events (senderEvents, billing_events, audience_actions).
- [ ] Append-only collections stay append-only.
- [ ] Create action logs for suppression or auto-pauses.

Checklist for Public Endpoints
- [ ] No auth required, but strict rate limiting.
- [ ] No tenantId accepted in payload.
- [ ] Writes are allowed only when tenantId is derived from a published doc.

Reference
- RBAC rules: `docs/RBAC.md`
- System feed map: `docs/SYSTEM_FEED_MAP.md`
