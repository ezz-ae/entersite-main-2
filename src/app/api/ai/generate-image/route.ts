import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from 'ai';
import { getGoogleModel, IMAGE_MODEL } from '@/lib/ai/google';
import { requireRole, UnauthorizedError, ForbiddenError } from '@/server/auth';
import { ALL_ROLES } from '@/lib/server/roles';
import { enforceSameOrigin } from '@/lib/server/security';

export async function POST(req: NextRequest) {
    try {
        enforceSameOrigin(req);
        await requireRole(req, ALL_ROLES);
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
        }

        const { image } = await generateImage({
            model: getGoogleModel(IMAGE_MODEL),
            prompt: `High-end architectural photography, ${prompt}, luxury real estate, cinematic lighting`,
        });

        if (image.base64) {
            return NextResponse.json({ url: `data:image/png;base64,${image.base64}` });
        }

        // Some providers return hosted URLs in addition to base64 blobs.
        const remoteUrl = (image as { url?: string }).url;
        if (typeof remoteUrl === 'string' && remoteUrl.length > 0) {
            return NextResponse.json({ url: remoteUrl });
        }

        throw new Error('Image generation returned no result');
    } catch (error) {
        console.error("Imagen API Error:", error);
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (error instanceof ForbiddenError) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.json({ 
            url: "https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/U10759_EXT_ZED739.webp?alt=media&token=be7418eb-0f7f-4df3-8c89-8fa5b070a7aa" 
        }, { status: 200 });
    }
}
