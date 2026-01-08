
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { nanoid } from 'nanoid';
import type { SitePage } from '@/lib/types';
import { PageRenderer } from '@/components/page-renderer';
import { renderToString } from 'react-dom/server';
import { promises as fs } from 'fs';
import path from 'path';

// This is a placeholder for a function that will handle the actual deployment to Vercel
async function deployToVercel(siteData: SitePage) {
    console.log(`Deploying site ${siteData.id} to Vercel`);

    // 1. Render the site to a static HTML string
    const html = renderToString(
        <PageRenderer 
            page={siteData} 
            tenantId={siteData.tenantId || 'public'} 
            projectName={siteData.title} 
        />
    );
    const fullHtml = `<!DOCTYPE html><html><head><title>${siteData.seo.title || siteData.title}</title><meta name="description" content="${siteData.seo.description}"></head><body>${html}</body></html>`;

    // 2. In a real implementation, you would use the Vercel API to create a deployment.
    // This would involve creating a temporary file with the HTML content, 
    // and then using a library or raw fetch calls to interact with the Vercel API.
    // For this example, we'll just simulate a successful deployment.
    await new Promise(resolve => setTimeout(resolve, 2000));

    const deploymentId = `dpl_${nanoid()}`;
    const publishedUrl = `https://${siteData.slug || siteData.id}-${nanoid(5)}.vercel.app`;

    return { deploymentId, publishedUrl };
}

export async function POST(request: Request) {
    try {
        const { siteId } = await request.json();
        if (!siteId) {
            return NextResponse.json({ message: 'Site ID is required' }, { status: 400 });
        }

        const siteRef = doc(db, 'sites', siteId);
        const siteSnap = await getDoc(siteRef);

        if (!siteSnap.exists()) {
            return NextResponse.json({ message: 'Site not found' }, { status: 404 });
        }

        const siteData = siteSnap.data() as SitePage;

        // Deploy the site to Vercel
        const { deploymentId, publishedUrl } = await deployToVercel(siteData);

        // Update the site document with the new deployment information
        await updateDoc(siteRef, {
            published: true,
            publishedUrl,
            lastPublishedAt: new Date().toISOString(),
        });

        return NextResponse.json({ 
            siteId, 
            publishedUrl, 
            deploymentId 
        });

    } catch (error) {
        console.error('Vercel publishing error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred during publishing.' }, { status: 500 });
    }
}
