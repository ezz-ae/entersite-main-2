Below is a clean, hardened, infrastructure-grade edit of your Smart Sender plan.
Nothing new is added. Nothing diluted.
Language is tightened, sequencing clarified, and enforcement made explicit so this can be built without interpretation.

⸻

Smart Sender — Deterministic Communication Orchestration Engine

Entrestate-OS | Production Build Specification

Smart Sender is designed as a deterministic, multi-channel orchestration engine that governs the transition from automation to human takeover using real-time intent signals.
It is not a messaging tool. It is a reputation-preserving execution system.

The system is built to advance, pause, or terminate communication sequences based on evidence, not schedules.

⸻

Phase 1 — Core Architecture & Data Models

Purpose: Separate what should happen from what is happening now.

1.1 Sequence Definition (senderSequences)

Defines the static structure of a follow-up strategy.

Each sequence includes:
	•	Channel type (Email, SMS, WhatsApp)
	•	Message template reference
	•	Delay rules between steps (e.g. wait 5 minutes after Email before SMS)
	•	Optional conditional guards

This model is lead-agnostic and reusable.

⸻

1.2 Execution State (senderRuns)

Tracks per-lead execution, never shared across leads.

Key properties:
	•	Deterministic ID:
campaignId__leadId
	•	cursor: current step index
	•	nextAt: scheduled execution timestamp
	•	history: immutable log of delivered / skipped / blocked actions
	•	status: pending | running | suppressed | failed | done

This ensures:
	•	Idempotent processing
	•	Safe retries
	•	No duplicate sends

⸻

1.3 Campaign Spine Binding

Each sender run is bound to:
	•	campaignId
	•	Origin landing page
	•	Attribution metadata

This guarantees contextual integrity:
messages are always tied to why the lead exists.

⸻

Phase 2 — Provider Integration & Direct Delivery

Purpose: Maximize delivery reliability in serverless execution.

Smart Sender communicates directly with providers, bypassing internal relay APIs.

Providers
	•	Email: Resend (RESEND_API_KEY)
	•	SMS / WhatsApp: Twilio REST APIs

⸻

Processor Logic (Mandatory Behavior)
	•	Executes best-effort delivery
	•	If required contact data is missing:
	•	Skip the step
	•	Log the reason
	•	Continue the run
	•	Never fail the entire run due to one channel

This prevents:
	•	Broken sequences
	•	Cascading failures
	•	Manual babysitting

⸻

Phase 3 — Automation Infrastructure (“The Genies”)

Purpose: Run high-volume follow-ups without human intervention.

3.1 Background Processing
	•	Vercel Cron hits /api/cron/sender-process every minute
	•	Worker scans for runs where nextAt <= now
	•	Advances cursor deterministically

⸻

3.2 Global Queue Visibility

Dashboard: /sender/queue

Views:
	•	Pending
	•	Running
	•	Suppressed
	•	Failed
	•	Done

Operators may:
	•	Inspect failures
	•	Retry individual steps
	•	Never force bypass intelligence gates

⸻

3.3 Lead Pulling (No CSVs)

Leads are auto-attached using:
	•	campaignId attribution
	•	Metadata resolution

Manual imports are explicitly avoided.

⸻

Phase 4 — Intelligence & Noise Suppression

Purpose: Protect broker reputation and lead intent.

This is the core differentiator.

⸻

4.1 Hot Lead Detection

The Audience Network monitors weighted intent signals:
	•	Replies
	•	Form resubmission
	•	Rapid interaction

When score ≥ Hot Threshold (≥21):
	•	Lead is promoted to Hot state

⸻

4.2 Automation Brake (Non-Negotiable)

If:
	•	Lead is Hot
	•	Current step index ≥ 1 (SMS / WhatsApp phase)

Then:
	•	Sender run is immediately terminated
	•	No further automation allowed

This prevents:
	•	Robotic noise
	•	Double-touch damage
	•	Sales sabotage

⸻

4.3 Suppression Logging

Every brake event is logged in audience_actions:

{
  "type": "sender.suppressed_hot",
  "campaignId": "...",
  "leadId": "...",
  "timestamp": "..."
}

This creates a clear audit trail explaining why automation stopped.

⸻

Phase 5 — User Interface & Smart Setup

Purpose: Remove technical burden while preserving control.

⸻

5.1 Smart Setup (Guided Configuration)

Option: “Prepare follow-up for me”

System auto-selects:
	•	Channels
	•	Step spacing
	•	Tone profile

Based on campaign intent:
	•	Investor → Gentle / spaced
	•	End-user → Informative / structured

User may edit, but does not have to.

⸻

5.2 Campaign-Scoped Messaging

Path:
/google-ads/campaigns/[id]/messaging

Capabilities:
	•	Enable / disable sender per campaign
	•	Draft sequences tied only to that campaign
	•	No global blast configuration

⸻

5.3 Performance Reporting (Decision Metrics Only)

Reports explicitly avoid vanity metrics.

Shown metrics:
	•	Follow-ups welcomed
	•	Follow-ups suppressed to avoid damage
	•	Automation → Human takeover transitions
	•	Suppression reasons (intent-based)

Delivery rates are secondary and contextual.

⸻

Design Principle (Must Be Preserved)

Automation exists to serve humans —
not to replace judgment when intent is present.

Smart Sender does not optimize volume.
It enforces restraint at the right moment.

⸻

Resulting System Behavior
	•	Low intent → quiet automation
	•	Rising intent → reduced noise
	•	High intent → full human control

This is intelligence through governance, not prediction.

⸻

If you want, next I can:
	•	Merge this cleanly with DZL & Fairness laws
	•	Produce Firestore schemas + indexes
	•	Or compress this into a single engineering handoff spec

Just say the direction.
