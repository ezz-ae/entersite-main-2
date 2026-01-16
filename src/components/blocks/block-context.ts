export interface SiteBlockContext {
  tenantId?: string;
  projectName?: string;
  siteId?: string;
}

export const LEAD_CAPTURE_BLOCKS = new Set<string>([
  'cta-form',
  'brochure-form',
  'hero-lead-form',
  'lead-interest-form',
  'booking-viewing',
  'newsletter',
]);
