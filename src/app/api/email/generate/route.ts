import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

/**
 * AI Email Content Generator
 * COST OPTIMIZED: Switched to 1.5-FLASH
 */

const API_KEY =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.Gemini_api_key;
const google = createGoogleGenerativeAI({ apiKey: API_KEY });

// FLASH is 10x cheaper than Pro and ideal for writing emails
const MODEL_ID = 'gemini-1.5-flash';

export async function POST(req: NextRequest) {
    try {
        await requireRole(req, ALL_ROLES);
        const { topic, context } = await req.json();

        if (!topic) return NextResponse.json({ error: 'Topic required' }, { status: 400 });

        const { text } = await generateText({
            model: google(MODEL_ID) as any,
            system: "You are a real estate expert. Write a concise, professional email. Include 'Subject: ' on the first line.",
            prompt: `Email about: ${topic}. Context: ${context}.`,
        });

        const lines = text.split('\n');
        const subjectLine = lines.find(l => l.toLowerCase().includes('subject:')) || 'Subject: Entrestate OS Update';
        const body = text.replace(subjectLine, '').trim();

        return NextResponse.json({ 
            subject: subjectLine.replace(/subject:/i, '').trim(), 
            body: body 
        });
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json({ error: 'Generation failed', details: error.message }, { status: 500 });
    }
}
