import { generateObject } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL } from '@/lib/ai/google';

/**
 * Simple Ads Management Service
 * Takes the "complexity" out of Google/Meta Ads for real estate agents.
 */

export interface AdCampaignRequest {
  siteUrl: string;
  budget: number;
  durationDays: number;
  goal: 'leads' | 'calls' | 'traffic';
  location?: string;
  audience?: string;
  intent?: string;
  unitType?: string;
  language?: string;
  timeline?: string;
  contactRoute?: string;
  strategyPreset?: string;
  advancedOptions?: {
    competitorIntercept?: boolean;
    negativeKeywordsPreset?: string;
    schedulePreset?: string;
    deviceTargeting?: string;
    languageTargeting?: string;
    callOnlyFallback?: boolean;
  };
}

const campaignSchema = z.object({
  keywords: z.array(z.object({
    term: z.string(),
    competition: z.enum(['low', 'medium', 'high']).default('medium'),
  })),
  headlines: z.array(z.string()).min(2).max(6),
  descriptions: z.array(z.string()).min(2).max(4),
});

export const generateCampaignStructure = async (req: AdCampaignRequest) => {
    const locationText = req.location ? `Target location: ${req.location}.` : '';
    const audienceText = req.audience ? `Target audience: ${req.audience}.` : '';
    const intentText = req.intent ? `Intent: ${req.intent}.` : '';
    const unitText = req.unitType ? `Unit type: ${req.unitType}.` : '';
    const languageText = req.language ? `Language: ${req.language}.` : '';
    const timelineText = req.timeline ? `Timeline: ${req.timeline}.` : '';
    const contactText = req.contactRoute ? `Primary contact route: ${req.contactRoute}.` : '';
    const presetText = req.strategyPreset ? `Strategy preset: ${req.strategyPreset}.` : '';
    const advancedParts: string[] = [];
    if (req.advancedOptions?.competitorIntercept) {
      advancedParts.push('Competitor intercept enabled.');
    }
    if (req.advancedOptions?.negativeKeywordsPreset) {
      advancedParts.push(`Negative keyword preset: ${req.advancedOptions.negativeKeywordsPreset}.`);
    }
    if (req.advancedOptions?.schedulePreset) {
      advancedParts.push(`Schedule: ${req.advancedOptions.schedulePreset}.`);
    }
    if (req.advancedOptions?.deviceTargeting) {
      advancedParts.push(`Device targeting: ${req.advancedOptions.deviceTargeting}.`);
    }
    if (req.advancedOptions?.languageTargeting) {
      advancedParts.push(`Language targeting: ${req.advancedOptions.languageTargeting}.`);
    }
    if (req.advancedOptions?.callOnlyFallback) {
      advancedParts.push('Call-only fallback enabled.');
    }
    const advancedText = advancedParts.length ? `Advanced options: ${advancedParts.join(' ')}` : '';

    const promptContext = `
      You are the EntreSite Ads Architect. Build Google Ads assets for ${req.siteUrl}.
      ${locationText}
      ${audienceText}
      ${intentText}
      ${unitText}
      ${languageText}
      ${timelineText}
      ${contactText}
      ${presetText}
      ${advancedText}
      Budget: ${req.budget} AED/day for ${req.durationDays} days. Goal: ${req.goal}.
      Output high-intent keywords, 3 responsive search headlines, and 2 concise descriptions.
    `;

    const { object } = await generateObject({
        model: getGoogleModel(FLASH_MODEL),
        schema: campaignSchema,
        prompt: promptContext,
        system: "Focus on Dubai / GCC real estate buyers. Avoid sensational claims.",
    });

    return object;
};
