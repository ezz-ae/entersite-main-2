# Lead Director: CRM Pipe (Intent Capture Infrastructure)

Entrestate-OS is not a traditional CRM. It is an intent capture pipe that sits before a CRM.
Its job is to capture, structure, qualify, and timestamp intent at the moment it exists, then
feed execution engines and external CRMs.

## Purpose
- Capture intent early, before it cools.
- Normalize signals into a consistent model.
- Route intent to execution systems (Sender, Ads, Audience).
- Provide clean, exportable intent streams for external CRMs.

## Feeders (Inputs)
- Landing page forms
- Chat agent conversations
- CSV imports
- Webhooks
- External CRM imports

## Receivers (Outputs)
- Google Ads (conversion signals)
- Smart Sender (follow-up orchestration)
- Audience Network (signals + tiers)
- External CRMs (via intent streams)

## Lead Direction Management (LDM)
Leads are treated as a direction, not a pipeline stage.
The five canonical directions are:
- READY: Strong intent with clear action. Human contact now.
- WARMING: Real interest with uncertain timing. Guided nurturing.
- EXPLORING: Early curiosity and low urgency. Educational flow.
- NOISE: Weak or accidental intent. Archive and avoid sales time.
- RISK: High activity with low clarity. Throttle engagement.

Intent-first, identity optional: the system captures intent events first and binds identity
only when the user reveals it.

## Direction Fairness Level (DFL)
Fairness measures whether system behavior respects real intent.
Low fairness is treated as technical debt and throttles automation.

## Explicitly Excluded (V1)
- Traditional pipelines and deal stages
- Task and comment management
- Team assignments and seat management
- Advanced workflow builders

## Integration Role
Entrestate-OS is the pipe. External CRMs are the destination.
Expose intent via a GET intent stream for downstream systems.

### Intent Stream API (V1)
`GET /api/intent/stream?limit=100&cursor=...`
- Auth: tenant admin token
- Output: ordered by newest `createdAt`, with `nextCursor` for pagination
- Payload includes direction, fairness, hotScore, contact, attribution
