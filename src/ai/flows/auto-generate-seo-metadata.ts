import { ai } from '@/ai/genkit';
import { GenerateSeoMetadataInputSchema, GenerateSeoMetadataOutputSchema } from '@/types/seo-metadata';

export const generateSeoMetadataFlow = ai.defineFlow(
    {
      name: 'generateSeoMetadataFlow',
      inputSchema: GenerateSeoMetadataInputSchema,
      outputSchema: GenerateSeoMetadataOutputSchema,
    },
    async (input) => {
      const prompt = `Given the following page blocks, suggest the next 3 blocks to add to the page. Respond in JSON format only.\n\nCurrent blocks: ${JSON.stringify(input.currentBlocks)}\nSite type: ${input.siteType}\nBrand: ${input.brand}\nPrimary color: ${input.primaryColor}\n`;

      const { output } = await ai.generate({
        prompt: prompt,
        output: {
          schema: GenerateSeoMetadataOutputSchema,
        }
      });

      return output!;
    }
  );
