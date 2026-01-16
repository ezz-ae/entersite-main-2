import type { SitePage } from '@/lib/types';

const baseTimestamp = () => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const id = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const HERO_BLOCK = (title: string, subtitle: string) => ({
  blockId: id('hero'),
  type: 'hero',
  order: 0,
  data: {
    headline: title,
    subtext: subtitle,
    ctaText: 'Request Access',
  },
});

export const BLUEPRINT_TEMPLATES: Record<string, SitePage> = {
  portfolio: {
    id: '',
    title: 'Agent Portfolio',
    blocks: [
      HERO_BLOCK('Your Dubai Real Estate Partner', 'Showcase experience, listings, and proof'),
      {
        blockId: id('stats'),
        type: 'stats',
        order: 1,
        data: { headline: 'Trusted by investors globally.' },
      },
      {
        blockId: id('listing'),
        type: 'listing-grid',
        order: 2,
        data: { headline: 'Featured Listings', subtext: 'Curated opportunities.' },
      },
      {
        blockId: id('cta'),
        type: 'cta-form',
        order: 3,
        data: { headline: 'Book a Consultation' },
      },
    ],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Agent Portfolio', description: 'Personal agent site', keywords: [] },
    ...baseTimestamp(),
  },
  launch: {
    id: '',
    title: 'Launch Blueprint',
    blocks: [
      HERO_BLOCK('Project Launch', 'Countdown + offer summary'),
      {
        blockId: id('timeline'),
        type: 'launch',
        order: 1,
        data: { headline: 'Launch Timeline' },
      },
      {
        blockId: id('payment'),
        type: 'payment-plan',
        order: 2,
        data: { headline: 'Payment Plan' },
      },
      {
        blockId: id('floor'),
        type: 'floor-plan',
        order: 3,
        data: { headline: 'Floor Plans' },
      },
      {
        blockId: id('cta'),
        type: 'cta-form',
        order: 4,
        data: { headline: 'Download Brochure' },
      },
    ],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Project Launch', description: 'Launch funnel', keywords: [] },
    ...baseTimestamp(),
  },
  advisory: {
    id: '',
    title: 'Advisory Blueprint',
    blocks: [
      HERO_BLOCK('Private Advisory', 'Services, proof, booking CTA'),
      {
        blockId: id('services'),
        type: 'split-content',
        order: 1,
        data: { headline: 'Advisory Services' },
      },
      {
        blockId: id('proof'),
        type: 'testimonial',
        order: 2,
        data: { headline: 'Client Testimonials' },
      },
      {
        blockId: id('newsletter'),
        type: 'newsletter',
        order: 3,
        data: { headline: 'Join Investor Briefing' },
      },
    ],
    canonicalListings: [],
    brochureUrl: '',
    seo: { title: 'Advisory Site', description: 'Private advisory landing page', keywords: [] },
    ...baseTimestamp(),
  },
};

export function getBlueprintTemplate(id: string): SitePage | null {
  const template = BLUEPRINT_TEMPLATES[id];
  if (!template) return null;
  return {
    ...template,
    id: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: template.blocks.map((block, index) => ({
      ...block,
      blockId: `${block.type}-${Date.now()}-${index}`,
      order: index,
    })),
  };
}
