
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { nanoid } from 'nanoid';
import type { SitePage } from '@/lib/types';
import { PageRenderer } from '@/components/page-renderer';
import { renderToString } from 'react-dom/server';
import { classic_firebase_hosting_deploy } from '@/lib/firebase-functions'; // Assuming this function exists
import { promises as fs } from 'fs';
import path from 'path';

async function deployToFirebase(siteData: SitePage, subdomain: string) {
    console.log(`Deploying site ${siteData.id} to subdomain ${subdomain}`);

    // 1. Render the site to a static HTML string
    const html = renderToString(
        <PageRenderer 
            page={siteData} 
            tenantId={siteData.tenantId || 'public'} 
            projectName={siteData.title} 
        />
    );
    const fullHtml = `<!DOCTYPE html><html><head><title>${siteData.seo.title || siteData.title}</title><meta name="description" content="${siteData.seo.description}"></head><body>${html}</body></html>`;

    // 2. Write the HTML to a temporary file
    const tempDir = path.join(process.cwd(), '.temp');
    await fs.mkdir(tempDir, { recursive: true });
    const filePath = path.join(tempDir, 'index.html');
    await fs.writeFile(filePath, fullHtml);

    // 3. Deploy the temporary file to Firebase Hosting
    try {
        const result = await classic_firebase_hosting_deploy(
            tempDir, // path to the directory containing the index.html file
            'client' // appType is client as it is a static site
        );

        // 4. Clean up the temporary file
        await fs.unlink(filePath);

        // 5. Return the deploymentId and publishedUrl
        const deploymentId = nanoid(); // You might get a real ID from the deploy result
        const publishedUrl = `https://${subdomain}.entrestate.com`; // This should be the actual URL from firebase
        
        return { deploymentId, publishedUrl };

    } catch (error) {
        console.error("Firebase deployment failed:", error);
        // Clean up the temporary file in case of an error
        await fs.unlink(filePath).catch(console.error);
        throw new Error('Failed to deploy to Firebase Hosting.');
    }
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
        const subdomain = siteData.slug || siteData.title.toLowerCase().replace(/\s+/g, '-');

        // Deploy the site to Firebase Hosting
        const { deploymentId, publishedUrl } = await deployToFirebase(siteData, subdomain);

        // Update the site document with the new deployment information
        await updateDoc(siteRef, {
            published: true,
            publishedUrl,
            subdomain,
            lastPublishedAt: new Date().toISOString(),
        });

        return NextResponse.json({ 
            siteId, 
            publishedUrl, 
            subdomain, 
            deploymentId 
        });

    } catch (error) {
        console.error('Publishing error:', error);
        return NextResponse.json({ message: 'An unexpected error occurred during publishing.' }, { status: 500 });
    }
}
