import { z } from 'genkit';

export const GenerateSeoMetadataInputSchema = z.object({
  currentBlocks: z.array(z.any()),
  siteType: z.string(),
  brand: z.string(),
  primaryColor: z.string(),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

export const GenerateSeoMetadataOutputSchema = z.object({
  suggestions: z.array(z.object({
    name: z.string(),
    props: z.record(z.any()),
  })),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;
