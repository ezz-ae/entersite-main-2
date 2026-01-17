export type WorkingHours = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
};

export type AgentProfile = {
  status: 'live' | 'paused';
  humanTakeover: boolean;
  connectedChannels: {
    website: boolean;
    instagram: boolean;
    whatsapp: boolean;
  };
  identity: {
    agentName: string;
    companyName: string;
    role?: string;
    greeting?: string;
  };
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    officeArea?: string;
    officeCity?: string;
    workingHours: WorkingHours;
    afterHoursRule?: string;
  };
  companyInfo?: string;
  responseStyle: {
    replyLength: 'short' | 'balanced' | 'detailed';
    depthLevel: 'basic' | 'practical' | 'deep';
  };
  successGoal: {
    primary: 'deliver_info' | 'collect_whatsapp' | 'collect_phone' | 'collect_requirements';
    secondary: {
      preferredArea: boolean;
      budget: boolean;
      unitType: boolean;
      timeline: boolean;
      buyerType: boolean;
    };
  };
  sellingPower: number;
  takeover: {
    triggers: {
      pricingNegotiation: boolean;
      availabilityConfirmation: boolean;
      viewingRequest: boolean;
      documents: boolean;
      angry: boolean;
      highIntent: boolean;
    };
    method: 'instant' | 'warm' | 'permission';
    notifyChannels: {
      dashboard: boolean;
      whatsapp: boolean;
      email: boolean;
    };
  };
  integrations: {
    sources: Record<
      string,
      { enabled: boolean; status: 'connected' | 'not_connected'; lastSyncAt?: string | null }
    >;
    dataUsage: 'ask_first' | 'auto' | 'confirm_before_send';
    permissions: {
      createLead: boolean;
      tagLead: boolean;
      addNotes: boolean;
      triggerFollowUp: boolean;
      sendBrochure: boolean;
      requestViewingTime: boolean;
      createSupportTicket: boolean;
    };
  };
  timelyNotes: {
    text?: string;
    expiresAt?: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type AgentEvent = {
  id: string;
  name: string;
  type: 'project_launch' | 'open_house' | 'webinar' | 'limited_offer' | 'viewing_day';
  startAt: string;
  endAt?: string;
  location?: string;
  audience?: 'buyers' | 'investors' | 'agents' | 'all';
  message?: string;
  ctaUrl?: string;
  attachments?: Array<{ label: string; url: string }>;
  urgencyTone?: 'soft' | 'normal' | 'strong';
  createdAt?: string;
  updatedAt?: string;
};

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  mon: true,
  tue: true,
  wed: true,
  thu: true,
  fri: true,
  sat: false,
  sun: false,
};

export const defaultAgentProfile: AgentProfile = {
  status: 'live',
  humanTakeover: true,
  connectedChannels: {
    website: true,
    instagram: false,
    whatsapp: false,
  },
  identity: {
    agentName: 'Agent',
    companyName: '',
    role: '',
    greeting: '',
  },
  contact: {
    phone: '',
    whatsapp: '',
    email: '',
    officeArea: '',
    officeCity: '',
    workingHours: { ...DEFAULT_WORKING_HOURS },
    afterHoursRule: '',
  },
  companyInfo: '',
  responseStyle: {
    replyLength: 'balanced',
    depthLevel: 'practical',
  },
  successGoal: {
    primary: 'collect_whatsapp',
    secondary: {
      preferredArea: true,
      budget: true,
      unitType: true,
      timeline: true,
      buyerType: false,
    },
  },
  sellingPower: 2,
  takeover: {
    triggers: {
      pricingNegotiation: true,
      availabilityConfirmation: true,
      viewingRequest: true,
      documents: false,
      angry: true,
      highIntent: true,
    },
    method: 'warm',
    notifyChannels: {
      dashboard: true,
      whatsapp: false,
      email: true,
    },
  },
  integrations: {
    sources: {
      websiteForms: { enabled: true, status: 'connected', lastSyncAt: null },
      landingPages: { enabled: true, status: 'connected', lastSyncAt: null },
      crmImport: { enabled: false, status: 'not_connected', lastSyncAt: null },
      inventory: { enabled: true, status: 'connected', lastSyncAt: null },
      googleAds: { enabled: false, status: 'not_connected', lastSyncAt: null },
      smartSender: { enabled: false, status: 'not_connected', lastSyncAt: null },
      instagramDm: { enabled: false, status: 'not_connected', lastSyncAt: null },
      calendarBooking: { enabled: false, status: 'not_connected', lastSyncAt: null },
      externalCrm: { enabled: false, status: 'not_connected', lastSyncAt: null },
    },
    dataUsage: 'confirm_before_send',
    permissions: {
      createLead: true,
      tagLead: true,
      addNotes: true,
      triggerFollowUp: true,
      sendBrochure: true,
      requestViewingTime: true,
      createSupportTicket: false,
    },
  },
  timelyNotes: {
    text: '',
    expiresAt: null,
  },
};

export function buildAutoGreeting(agentName: string, companyName: string) {
  const name = agentName?.trim() || 'our team';
  const company = companyName?.trim();
  if (company) {
    return `Hi, I'm ${name} from ${company}. How can I help today?`;
  }
  return `Hi, I'm ${name}. How can I help today?`;
}

function normalizeWorkingHours(value?: Partial<WorkingHours>): WorkingHours {
  return {
    mon: value?.mon ?? DEFAULT_WORKING_HOURS.mon,
    tue: value?.tue ?? DEFAULT_WORKING_HOURS.tue,
    wed: value?.wed ?? DEFAULT_WORKING_HOURS.wed,
    thu: value?.thu ?? DEFAULT_WORKING_HOURS.thu,
    fri: value?.fri ?? DEFAULT_WORKING_HOURS.fri,
    sat: value?.sat ?? DEFAULT_WORKING_HOURS.sat,
    sun: value?.sun ?? DEFAULT_WORKING_HOURS.sun,
  };
}

export function mergeAgentProfile(
  existing?: Partial<AgentProfile> | null,
  patch?: Partial<AgentProfile> | null,
): AgentProfile {
  const base = existing || {};
  const incoming = patch || {};

  const identity = {
    ...defaultAgentProfile.identity,
    ...(base.identity || {}),
    ...(incoming.identity || {}),
  };
  const greeting =
    identity.greeting && identity.greeting.trim()
      ? identity.greeting
      : buildAutoGreeting(identity.agentName, identity.companyName);

  const contact = {
    ...defaultAgentProfile.contact,
    ...(base.contact || {}),
    ...(incoming.contact || {}),
  };

  const integrations = {
    ...defaultAgentProfile.integrations,
    ...(base.integrations || {}),
    ...(incoming.integrations || {}),
  };

  const sources = {
    ...defaultAgentProfile.integrations.sources,
    ...(base.integrations?.sources || {}),
    ...(incoming.integrations?.sources || {}),
  };

  return {
    ...defaultAgentProfile,
    ...base,
    ...incoming,
    identity: { ...identity, greeting },
    contact: {
      ...contact,
      workingHours: normalizeWorkingHours(contact.workingHours),
    },
    responseStyle: {
      ...defaultAgentProfile.responseStyle,
      ...(base.responseStyle || {}),
      ...(incoming.responseStyle || {}),
    },
    successGoal: {
      ...defaultAgentProfile.successGoal,
      ...(base.successGoal || {}),
      ...(incoming.successGoal || {}),
      secondary: {
        ...defaultAgentProfile.successGoal.secondary,
        ...(base.successGoal?.secondary || {}),
        ...(incoming.successGoal?.secondary || {}),
      },
    },
    takeover: {
      ...defaultAgentProfile.takeover,
      ...(base.takeover || {}),
      ...(incoming.takeover || {}),
      triggers: {
        ...defaultAgentProfile.takeover.triggers,
        ...(base.takeover?.triggers || {}),
        ...(incoming.takeover?.triggers || {}),
      },
      notifyChannels: {
        ...defaultAgentProfile.takeover.notifyChannels,
        ...(base.takeover?.notifyChannels || {}),
        ...(incoming.takeover?.notifyChannels || {}),
      },
    },
    integrations: {
      ...integrations,
      sources,
      permissions: {
        ...defaultAgentProfile.integrations.permissions,
        ...(base.integrations?.permissions || {}),
        ...(incoming.integrations?.permissions || {}),
      },
    },
    connectedChannels: {
      ...defaultAgentProfile.connectedChannels,
      ...(base.connectedChannels || {}),
      ...(incoming.connectedChannels || {}),
    },
  };
}
