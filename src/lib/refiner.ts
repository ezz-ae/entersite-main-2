import type { Block, SitePage, RefinerIssue, RefinerReport } from '@/lib/types';

const GENERIC_CTA_LABELS = new Set([
  'submit',
  'click here',
  'continue',
  'next',
  'ok',
  'send',
  'request info',
  'download',
  'learn more',
]);

const NEXT_STEP_KEYWORDS = ['call', 'book', 'schedule', 'visit', 'tour', 'viewing', 'consult'];
const PHONE_KEYWORDS = ['phone', 'call', 'contact', 'whatsapp', 'wa.me'];
const FORM_BLOCK_TYPES = new Set([
  'cta-form',
  'brochure-form',
  'hero-lead-form',
  'lead-interest-form',
  'booking-viewing',
  'newsletter',
  'offer',
  'contact-details',
]);
const CTA_FALLBACK_BLOCKS = new Set([
  'hero',
  'launch-hero',
  'coming-soon-hero',
  'banner-cta',
  'cta-grid',
  'sms-lead',
  'chat-agent',
  'contact-details',
]);

const COLOR_KEYS = {
  text: ['textColor', 'fontColor', 'color', 'foregroundColor', 'primaryCtaColor'],
  background: ['backgroundColor', 'bgColor', 'background', 'accentColor', 'cardBackground'],
};

type ColorRGB = { r: number; g: number; b: number };

function parseHexColor(value: string | undefined): ColorRGB | null {
  if (!value) return null;
  const trimmed = value.trim();
  const normalized = trimmed.replace(/^#/, '');
  if (normalized.length !== 3 && normalized.length !== 6) return null;
  const expanded = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  const num = parseInt(expanded, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

function relativeLuminance(color: ColorRGB) {
  const toLinear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);
}

function contrastRatio(foreground: ColorRGB, background: ColorRGB) {
  const lum1 = relativeLuminance(foreground);
  const lum2 = relativeLuminance(background);
  const light = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (light + 0.05) / (dark + 0.05);
}

function findColorValue(data: Record<string, any>, keys: string[]) {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'string') {
      const parsed = parseHexColor(value);
      if (parsed) return parsed;
    }
  }
  return null;
}

function collectTextAndBackground(block: Block) {
  if (!block.data || typeof block.data !== 'object') return null;
  const textColor = findColorValue(block.data, COLOR_KEYS.text);
  const backgroundColor = findColorValue(block.data, COLOR_KEYS.background);
  if (!textColor || !backgroundColor) return null;
  return { textColor, backgroundColor };
}

function gatherCtaLabels(blocks: Block[]) {
  const labels: string[] = [];
  blocks.forEach((block) => {
    if (!block.data || typeof block.data !== 'object') return;
    Object.entries(block.data).forEach(([key, value]) => {
      if (typeof value !== 'string') return;
      if (/((?:cta|button|label|link)(?:Text|Label|Title)?)/i.test(key)) {
        const trimmed = value.trim();
        if (trimmed) {
          labels.push(trimmed);
        }
      }
    });
  });
  return labels;
}

function extractImageUrl(block: Block) {
  if (!block.data || typeof block.data !== 'object') return null;
  const candidates = [
    block.data.backgroundImage,
    block.data.imageUrl,
    block.data.image?.url,
    block.data.mediaUrl,
    block.data.image,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

function parseDimensionFromUrl(url: string, param: 'w' | 'h' | 'q') {
  try {
    const parsed = new URL(url);
    const value = parsed.searchParams.get(param);
    return value ? Number.parseInt(value, 10) || null : null;
  } catch {
    const regex = new RegExp(`${param}=([0-9]+)`, 'i');
    const match = regex.exec(url);
    if (match) {
      return Number.parseInt(match[1], 10) || null;
    }
  }
  return null;
}

function includesKeyword(text: string | undefined, keywords: string[]) {
  if (!text) return false;
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

export function ensureSitePage(value: Partial<SitePage> | null | undefined): SitePage {
  const now = new Date().toISOString();
  return {
    id: value?.id || 'refiner-site',
    title: value?.title || 'Untitled Page',
    blocks: value?.blocks || [],
    canonicalListings: value?.canonicalListings || [],
    brochureUrl: value?.brochureUrl || '',
    tenantId: value?.tenantId,
    refinerStatus: value?.refinerStatus,
    refinerBaseSnapshot: value?.refinerBaseSnapshot,
    refinerDraftSnapshot: value?.refinerDraftSnapshot,
    refinerDraftHtml: value?.refinerDraftHtml,
    refinerPreviewUrl: value?.refinerPreviewUrl,
    published: value?.published,
    publishedUrl: value?.publishedUrl,
    subdomain: value?.subdomain,
    customDomain: value?.customDomain,
    seo: value?.seo || { title: '', description: '', keywords: [] },
    createdAt: value?.createdAt || now,
    updatedAt: value?.updatedAt || now,
    lastPublishedAt: value?.lastPublishedAt,
  } as SitePage;
}

export function analyzeSiteRefiner(page: SitePage): RefinerReport {
  const issues: RefinerIssue[] = [];
  const blocks = page.blocks || [];
  const heroBlocks = blocks.filter((block) => /hero/i.test(block.type) || block.type === 'launch' || block.type === 'banner-cta');

  blocks.forEach((block) => {
    const colors = collectTextAndBackground(block);
    if (!colors) return;
    const ratio = contrastRatio(colors.textColor, colors.backgroundColor);
    if (ratio < 4.5) {
      issues.push({
        code: 'contrast',
        level: 'warning',
        message: 'Text contrast appears low in one of your sections.',
        detail: `Contrast ratio ${ratio.toFixed(2)} is below WCAG AA for block "${block.type}".`,
        section: block.type,
      });
    }
  });

  let heroIssueRecorded = false;
  heroBlocks.forEach((block) => {
    if (heroIssueRecorded) return;
    const imageUrl = extractImageUrl(block);
    if (!imageUrl) {
      heroIssueRecorded = true;
      issues.push({
        code: 'hero_image',
        level: 'warning',
        message: 'Hero section is missing a compelling background image.',
        detail: 'Add a high-resolution hero image so the headline has a strong backdrop.',
        section: block.type,
      });
      return;
    }
    const width = parseDimensionFromUrl(imageUrl, 'w');
    if (width && width < 1200) {
      heroIssueRecorded = true;
      issues.push({
        code: 'hero_image',
        level: 'warning',
        message: 'Hero image may be low-resolution.',
        detail: 'Upload a hero image with at least 1200px width for clear presentation.',
        section: block.type,
      });
    }
  });

  const ctaLabels = gatherCtaLabels(blocks);
  const hasCtaBlock = blocks.some((block) => CTA_FALLBACK_BLOCKS.has(block.type));
  if (!ctaLabels.length && !hasCtaBlock) {
    issues.push({
      code: 'cta_absence',
      level: 'warning',
      message: 'No clear CTA was found on the page.',
      detail: 'Add a hero CTA or CTA grid so visitors know the next step.',
    });
  } else if (ctaLabels.some((label) => GENERIC_CTA_LABELS.has(label.toLowerCase()))) {
    issues.push({
      code: 'cta_generic',
      level: 'info',
      message: 'Some CTA labels sound generic.',
      detail: 'Replace labels like "Submit" or "Click Here" with action-specific copy.',
    });
  }

  const blocksWithContacts = blocks.filter((block) => {
    const values = JSON.stringify(block.data || {}).toLowerCase();
    return PHONE_KEYWORDS.some((keyword) => values.includes(keyword));
  });
  if (!blocksWithContacts.length) {
    issues.push({
      code: 'phone_cta',
      level: 'warning',
      message: 'No phone or WhatsApp CTA was detected.',
      detail: 'Add a call or WhatsApp CTA so leads can reach you directly.',
    });
  }

  const formBlocks = blocks.filter((block) => FORM_BLOCK_TYPES.has(block.type));
  if (formBlocks.length) {
    const aggregated = formBlocks.map((block) => JSON.stringify(block.data || {}).toLowerCase()).join(' ');
    const hasNameField = /name/.test(aggregated);
    const hasPhoneField = /phone/.test(aggregated);
    if (!hasNameField || !hasPhoneField) {
      issues.push({
        code: 'form_fields',
        level: 'warning',
        message: 'Lead forms should capture a name and phone number.',
        detail: 'Ensure every landing form includes fields for the user name and a phone contact.',
      });
    }
  }

  const hasNextStep = ctaLabels.some((label) =>
    NEXT_STEP_KEYWORDS.some((keyword) => label.toLowerCase().includes(keyword)),
  );
  if (!hasNextStep && !blocks.some((block) => /viewing|booking|consult/i.test(block.type))) {
    issues.push({
      code: 'next_step',
      level: 'info',
      message: 'Explicit next step is missing.',
      detail: 'Clarify whether the visitor should call, book a viewing, or schedule a consultation.',
    });
  }

  const generatedAt = new Date().toISOString();
  const score = Math.max(0, 100 - issues.length * 12);
  const summary = issues.length
    ? `Refiner surfaced ${issues.length} insight${issues.length === 1 ? '' : 's'} that can improve conversions.`
    : 'Refiner did not find any major blockers—this page is conversion-ready.';

  return { issues, summary, generatedAt, score };
}
