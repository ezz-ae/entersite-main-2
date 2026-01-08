import { NextRequest, NextResponse } from 'next/server';
import { FirebaseError } from 'firebase/app';
import { generateSiteStructure } from '@/lib/ai/vertex-service';
import { saveSite } from '@/lib/firestore-service';
import { getAuth } from 'firebase/auth';
import { SitePage, Block } from '@/lib/types';

// IMPORTANT: This function is using the client-side SDK. 
// This is not ideal for a production environment.
// We should migrate this to the Firebase Admin SDK as soon as possible.

export async function POST(req: NextRequest) {
    try {
        const { projectId, extractedText, language } = await req.json();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!projectId || !extractedText) {
            return NextResponse.json({ error: 'projectId and extractedText are required' }, { status: 400 });
        }

        const prompt = `Generate a landing page for a real estate project based on the following text. The language is ${language || 'en'}.\n\n${extractedText}`;

        const { object: siteData } = await generateSiteStructure(prompt);

        const newSite: SitePage = {
            id: '',
            title: siteData.title,
            blocks: siteData.blocks.map((block: Omit<Block, 'blockId' | 'order'>, index: number) => ({
                ...block,
                blockId: `block-${index}`,
                order: index,
            })),
            seo: siteData.seo,
            canonicalListings: [],
            brochureUrl: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const pageId = await saveSite(user.uid, newSite);

        return NextResponse.json({ pageId });
    } catch (error) {
        console.error("API Error:", error);

        if (error instanceof FirebaseError) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}
