export type LeadDirection = 'READY' | 'WARMING' | 'EXPLORING' | 'NOISE' | 'RISK';

export const LEAD_DIRECTIONS: LeadDirection[] = [
  'READY',
  'WARMING',
  'EXPLORING',
  'NOISE',
  'RISK',
];

export const DEFAULT_LEAD_DIRECTION: LeadDirection = 'EXPLORING';

export const LEAD_DIRECTION_DEFINITIONS: Record<LeadDirection, { intent: string; action: string }> = {
  READY: {
    intent: 'Strong intent with clear action and minimal ambiguity.',
    action: 'Contact immediately with a human response.',
  },
  WARMING: {
    intent: 'Real interest with uncertain timing.',
    action: 'Guide and nurture without a hard push.',
  },
  EXPLORING: {
    intent: 'Early-stage curiosity and low urgency.',
    action: 'Place in an educational flow.',
  },
  NOISE: {
    intent: 'Weak or accidental intent.',
    action: 'Archive and avoid consuming sales time.',
  },
  RISK: {
    intent: 'High activity with low clarity and repeated price-only signals.',
    action: 'Throttle engagement to protect human time and system metrics.',
  },
};
