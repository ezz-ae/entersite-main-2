import { ai } from '@/ai/genkit';
import { SuggestNextBlocksInputSchema, SuggestNextBlocksOutputSchema, type SuggestNextBlocksInput } from '@/types/block-suggestions';

export { type SuggestNextBlocksInput };

export const suggestNextBlocksFlow = ai.defineFlow(
    {
      name: 'suggestNextBlocksFlow',
      inputSchema: SuggestNextBlocksInputSchema,
      outputSchema: SuggestNextBlocksOutputSchema,
    },
    async (input) => {
      const prompt = `Given the following page blocks, suggest the next 3 blocks to add to the page. Respond in JSON format only.

Current blocks: ${JSON.stringify(input.currentBlocks)}
Site type: ${input.siteType}
Brand: ${input.brand}
Primary color: ${input.primaryColor}
`;

      const { output } = await ai.generate({
        prompt: prompt,
        output: {
          schema: SuggestNextBlocksOutputSchema,
        }
      });

      return output!;
    }
  );
