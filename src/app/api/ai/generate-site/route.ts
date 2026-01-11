import { NextRequest, NextResponse } from 'next/server';
import { generateSiteStructure } from '@/lib/ai/vertex-service';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';

export async function POST(req: NextRequest) {
    try {
        await requireRole(req, ALL_ROLES);
        const { prompt } = await req.json();
        
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const { object } = await generateSiteStructure(prompt);
        
        return NextResponse.json(object);
    } catch (error) {
        console.error("Vertex AI Error:", error);
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        // Fallback to a high-quality static structure if AI fails
        return NextResponse.json({
            title: "Luxury Real Estate",
            blocks: [
                { type: 'hero', data: { headline: "Exquisite Living Redefined", subtext: "Discover premium residences in the heart of Dubai." } },
                { type: 'stats', data: {} },
                { type: 'chat-agent', data: { agentName: "Executive Advisor" } },
                { type: 'listing-grid', data: { headline: "Current Collections" } },
                { type: 'sms-lead', data: {} }
            ]
        });
    }
}
