'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating marketing copy, headlines, descriptions, and meta tags for real estate projects.
 *
 * generateMarketingCopy - An asynchronous function that takes project details as input and returns marketing copy suggestions.
 * GenerateMarketingCopyInput - The input type for the generateMarketingCopy function.
 * GenerateMarketingCopyOutput - The output type for the generateMarketingCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingCopyInputSchema = z.object({
  projectName: z.string().describe('The name of the real estate project.'),
  city: z.string().describe('The city where the project is located.'),
  features: z.string().describe('Key features of the project.'),
  developer: z.string().optional().describe('The name of the developer.'),
  price: z.number().optional().describe('The price of the project.'),
});

export type GenerateMarketingCopyInput = z.infer<typeof GenerateMarketingCopyInputSchema>;

const GenerateMarketingCopyOutputSchema = z.object({
  headlines: z.array(z.string()).describe('Three headline options for the project.'),
  descriptions: z.array(z.string()).describe('Three description options for the project.'),
  metaTags: z.string().describe('Meta tags for SEO optimization.'),
});

export type GenerateMarketingCopyOutput = z.infer<typeof GenerateMarketingCopyOutputSchema>;

export async function generateMarketingCopy(input: GenerateMarketingCopyInput): Promise<GenerateMarketingCopyOutput> {
  return generateMarketingCopyFlow(input);
}

const generateMarketingCopyPrompt = ai.definePrompt({
  name: 'generateMarketingCopyPrompt',
  input: {schema: GenerateMarketingCopyInputSchema},
  output: {schema: GenerateMarketingCopyOutputSchema},
  prompt: `Generate persuasive marketing copy for {{projectName}} in {{city}}. Include {{features}}. Developer: {{developer}}. Price: {{price}}. Create 3 headline options, 3 description options, and meta tags. Tone: professional yet high-conversion. Ensure placeholders align with tokens in blocks. Output strictly as JSON.`,
});

const generateMarketingCopyFlow = ai.defineFlow(
  {
    name: 'generateMarketingCopyFlow',
    inputSchema: GenerateMarketingCopyInputSchema,
    outputSchema: GenerateMarketingCopyOutputSchema,
  },
  async input => {
    const {output} = await generateMarketingCopyPrompt(input);
    return output!;
  }
);
