'use server';

/**
 * @fileOverview A flow to build a chat assistant for pages by generating vector embeddings from page and project data.
 *
 * - buildChatAssistantForPages - A function that handles the process of building the chat assistant.
 * - BuildChatAssistantForPagesInput - The input type for the buildChatAssistantForPages function.
 * - BuildChatAssistantForPagesOutput - The return type for the buildChatAssistantForPages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildChatAssistantForPagesInputSchema = z.object({
  pageJson: z.string().describe('The JSON representation of the page data.'),
  projectJson: z.string().describe('The JSON representation of the project data.'),
  brochureUrl: z.string().optional().describe('The URL of the project brochure.'),
});

export type BuildChatAssistantForPagesInput = z.infer<
  typeof BuildChatAssistantForPagesInputSchema
>;

const BuildChatAssistantForPagesOutputSchema = z.object({
  sessionId: z.string().describe('The ID of the chat session.'),
  embeddingVectors: z.array(z.number()).describe('The vector embeddings for the chat assistant.'),
  tokenLimitsConsidered: z
    .boolean()
    .describe('Indicates if token limits were considered during embedding generation.'),
});

export type BuildChatAssistantForPagesOutput = z.infer<
  typeof BuildChatAssistantForPagesOutputSchema
>;

export async function buildChatAssistantForPages(
  input: BuildChatAssistantForPagesInput
): Promise<BuildChatAssistantForPagesOutput> {
  return buildChatAssistantForPagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildChatAssistantForPagesPrompt',
  input: {schema: BuildChatAssistantForPagesInputSchema},
  output: {schema: BuildChatAssistantForPagesOutputSchema},
  prompt: `Ingest the following page JSON, project JSON, and brochure (if available) to generate vector embeddings for an AI chat assistant.

Page JSON: {{{pageJson}}}
Project JSON: {{{projectJson}}}
Brochure URL: {{{brochureUrl}}}

Consider token limits when generating embeddings. Output the sessionId, embedding vectors, and a boolean indicating if token limits were considered.\n\nEnsure the output is strictly JSON.`,
});

const buildChatAssistantForPagesFlow = ai.defineFlow(
  {
    name: 'buildChatAssistantForPagesFlow',
    inputSchema: BuildChatAssistantForPagesInputSchema,
    outputSchema: BuildChatAssistantForPagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
