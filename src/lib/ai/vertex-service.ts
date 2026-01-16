import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { getGoogleModel, FLASH_MODEL, PRO_MODEL } from '@/lib/ai/google';

export const generateSiteStructure = async (prompt: string) => {
    return generateObject({
        model: getGoogleModel(PRO_MODEL),
        schema: z.object({
            title: z.string(),
            description: z.string(),
            blocks: z.array(z.object({
                type: z.enum([
                    'hero', 'launch-hero', 'stats', 'listing-grid', 
                    'chat-agent', 'sms-lead', 'roi-calculator', 
                    'gallery', 'faq', 'contact-details'
                ]),
                data: z.record(z.any())
            })),
            seo: z.object({
                title: z.string(),
                description: z.string(),
                keywords: z.array(z.string())
            })
        }),
        system: `You are the Entrestate Smart Architect. Design high-converting real estate landing pages.
                 Always include a chat-agent and an sms-lead block.`,
        prompt: `Design a high-fidelity landing page for: "${prompt}"`,
    });
};

export const generateMarketingCopy = async (context: string) => {
    // USE FLASH for marketing copy - much faster and extremely cheap
    const { text } = await generateText({
        model: getGoogleModel(FLASH_MODEL),
        system: "You are a world-class real estate copywriter. Be concise.",
        prompt: `Write 3 ad headlines and 2 descriptions for: ${context}.`,
    });
    return text;
};
