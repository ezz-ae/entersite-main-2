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
    const promptContext = `
      You are the EntreSite Ads Architect. Build Google Ads assets for ${req.siteUrl}.
      ${locationText}
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
