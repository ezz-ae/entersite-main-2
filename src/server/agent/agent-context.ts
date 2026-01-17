import type { AgentEvent, AgentProfile, WorkingHours } from '@/lib/agent-profile';
import { buildAutoGreeting } from '@/lib/agent-profile';

const DAY_ORDER: Array<{ key: keyof WorkingHours; label: string }> = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const PRIMARY_GOAL_LABELS: Record<AgentProfile['successGoal']['primary'], string> = {
  deliver_info: 'Deliver full info',
  collect_whatsapp: 'Collect WhatsApp',
  collect_phone: 'Collect phone number',
  collect_requirements: 'Collect full requirements',
};

const SECONDARY_GOAL_LABELS: Record<keyof AgentProfile['successGoal']['secondary'], string> = {
  preferredArea: 'Preferred area',
  budget: 'Budget',
  unitType: 'Unit type',
  timeline: 'Timeline',
  buyerType: 'Buyer type',
};

const TAKEOVER_TRIGGER_LABELS: Record<keyof AgentProfile['takeover']['triggers'], string> = {
  pricingNegotiation: 'Pricing negotiation',
  availabilityConfirmation: 'Availability confirmation',
  viewingRequest: 'Viewing request',
  documents: 'Serious budget/documents',
  angry: 'User is angry/confused',
  highIntent: 'High intent signals',
};

const PERMISSION_LABELS: Record<keyof AgentProfile['integrations']['permissions'], string> = {
  createLead: 'Create lead',
  tagLead: 'Tag lead',
  addNotes: 'Add notes',
  triggerFollowUp: 'Trigger follow-up',
  sendBrochure: 'Send brochure link',
  requestViewingTime: 'Request viewing time',
  createSupportTicket: 'Create support ticket',
};

function formatWorkingDays(hours: WorkingHours) {
  const active = DAY_ORDER.filter((day) => hours[day.key]).map((day) => day.label);
  return active.length ? active.join(', ') : 'Not set';
}

function isEventActive(event: AgentEvent, now = Date.now()) {
  const start = event.startAt ? Date.parse(event.startAt) : NaN;
  const end = event.endAt ? Date.parse(event.endAt) : NaN;
  if (!Number.isNaN(start) && now < start) return false;
  if (!Number.isNaN(end) && now > end) return false;
  return true;
}

export function getActiveAgentEvents(events: AgentEvent[]) {
  const now = Date.now();
  return events.filter((event) => isEventActive(event, now));
}

export function buildAgentContext(profile: AgentProfile, events: AgentEvent[]) {
  const identity = profile.identity;
  const greeting =
    identity.greeting && identity.greeting.trim()
      ? identity.greeting.trim()
      : buildAutoGreeting(identity.agentName, identity.companyName);

  const contact = profile.contact;
  const contactParts = [
    contact.phone ? `phone: ${contact.phone}` : null,
    contact.whatsapp ? `whatsapp: ${contact.whatsapp}` : null,
    contact.email ? `email: ${contact.email}` : null,
    contact.officeArea || contact.officeCity
      ? `office: ${[contact.officeArea, contact.officeCity].filter(Boolean).join(', ')}`
      : null,
    `working days: ${formatWorkingDays(contact.workingHours)}`,
    contact.afterHoursRule ? `after-hours: ${contact.afterHoursRule}` : null,
  ].filter(Boolean);

  const goals = [
    `primary goal: ${PRIMARY_GOAL_LABELS[profile.successGoal.primary]}`,
    `secondary: ${
      Object.entries(profile.successGoal.secondary)
        .filter(([, value]) => value)
        .map(([key]) => SECONDARY_GOAL_LABELS[key as keyof AgentProfile['successGoal']['secondary']])
        .join(', ') || 'none'
    }`,
  ];

  const eventsBlock = events.length
    ? events
        .map((event) => {
          const timing = event.endAt ? `${event.startAt} - ${event.endAt}` : event.startAt;
          const attachments = event.attachments?.length
            ? `attachments: ${event.attachments
                .map((attachment) => `${attachment.label} (${attachment.url})`)
                .join(', ')}`
            : null;
          const details = [
            event.name,
            event.type,
            timing,
            event.location ? `location: ${event.location}` : null,
            event.audience ? `audience: ${event.audience}` : null,
            event.message ? `note: ${event.message}` : null,
            event.ctaUrl ? `cta: ${event.ctaUrl}` : null,
            attachments,
            event.urgencyTone ? `urgency: ${event.urgencyTone}` : null,
          ]
            .filter(Boolean)
            .join(' | ');
          return `- ${details}`;
        })
        .join('\n')
    : 'none';

  const timelyNotes =
    profile.timelyNotes?.text && profile.timelyNotes.text.trim()
      ? profile.timelyNotes.text.trim()
      : null;

  return [
    `Agent name: ${identity.agentName}`,
    identity.companyName ? `Company: ${identity.companyName}` : null,
    identity.role ? `Role/team: ${identity.role}` : null,
    `Greeting: ${greeting}`,
    contactParts.length ? `Contact: ${contactParts.join(' | ')}` : 'Contact: missing',
    profile.companyInfo ? `Company info: ${profile.companyInfo}` : 'Company info: missing',
    `Response style: ${profile.responseStyle.replyLength}, ${profile.responseStyle.depthLevel}`,
    `Selling power: ${profile.sellingPower}`,
    `Human takeover: ${profile.humanTakeover ? 'on' : 'off'}`,
    `Takeover triggers: ${Object.entries(profile.takeover.triggers)
      .filter(([, value]) => value)
      .map(([key]) => TAKEOVER_TRIGGER_LABELS[key as keyof AgentProfile['takeover']['triggers']])
      .join(', ') || 'none'}`,
    `Takeover method: ${profile.takeover.method}`,
    `Integrations policy: ${profile.integrations.dataUsage}`,
    `Action permissions: ${Object.entries(profile.integrations.permissions)
      .filter(([, value]) => value)
      .map(([key]) => PERMISSION_LABELS[key as keyof AgentProfile['integrations']['permissions']])
      .join(', ') || 'none'}`,
    `Goals: ${goals.join(' | ')}`,
    timelyNotes ? `Today notes: ${timelyNotes}` : null,
    `Active events:\n${eventsBlock}`,
  ]
    .filter(Boolean)
    .join('\n');
}
