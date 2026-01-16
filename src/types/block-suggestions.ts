import { z } from 'zod';

export const SuggestNextBlocksInputSchema = z.object({
  currentBlocks: z.array(z.string()).describe('The list of block IDs currently on the page.'),
  siteType: z.string().describe('The type of site being built (e.g., developer launch, roadshow).'),
  brand: z.string().describe('The brand of the site (e.g., LuxuryHomes).'),
  primaryColor: z.string().describe('The primary color of the brand in hex format (e.g., #002F4B).'),
});

export type SuggestNextBlocksInput = z.infer<typeof SuggestNextBlocksInputSchema>;

export const SuggestNextBlocksOutputSchema = z.array(
  z.object({
    blockId: z.string().describe('The ID of the suggested block.'),
    order: z.number().describe('The order in which the block should be placed on the page.'),
    defaultContent: z.string().describe('A JSON string representing the default content for the block, with placeholders for dynamic data.'),
    recommendedStyleOverrides: z.string().describe('A JSON string representing recommended style overrides (e.g., {"backgroundColor": "#000", "textColor": "#FFF"}).'),
    adsReady: z.boolean().describe('Whether the block is ready for ads.'),
    seoReady: z.boolean().describe('Whether the block is ready for SEO.'),
  })
);

export type SuggestNextBlocksOutput = z.infer<typeof SuggestNextBlocksOutputSchema>;
