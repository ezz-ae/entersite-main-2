
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import type { SitePage } from '@/lib/types';
import { nanoid } from 'nanoid';

/**
 * Represents the result of a site publishing operation using Vercel.
 */
export interface VercelPublishResult {
  siteId: string;
  publishedUrl: string;
  deploymentId: string;
}

/**
 * Publishes a site by invoking the dedicated Vercel deployment API endpoint.
 *
 * @param {SitePage} page - The site page object to be published.
 * @param {string} [ownerUid] - The UID of the site owner.
 * @returns {Promise<VercelPublishResult>} A promise that resolves with the publishing result.
 * @throws Will throw an error if the publishing process fails.
 */
export const publishSite = async (page: SitePage, ownerUid?: string): Promise<VercelPublishResult> => {
  if (!page.id) {
    throw new Error('Site must be saved before publishing.');
  }

  try {
    const response = await fetch('/api/publish/vercel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ siteId: page.id }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred during publishing.' }));
      throw new Error(errorBody.message || 'Failed to publish site.');
    }

    const result: VercelPublishResult = await response.json();
    
    const siteRef = doc(db, 'sites', result.siteId);
    await setDoc(siteRef, {
      published: true,
      publishedUrl: result.publishedUrl,
      lastPublishedAt: serverTimestamp(),
    }, { merge: true });

    return result;

  } catch (error) {
    console.error("Publishing Error:", error);
    throw error;
  }
};

/**
 * Retrieves the data for a published site.
 *
 * @param {string} siteId - The ID of the site to retrieve.
 * @returns {Promise<SitePage | null>} A promise that resolves with the site page data, or null if not found.
 */
export const getPublishedSite = async (siteId: string): Promise<SitePage | null> => {
  try {
    const docRef = doc(db, 'sites', siteId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().published) {
      return { id: docSnap.id, ...docSnap.data() } as SitePage;
    }
    return null;
  } catch (error) {
    console.error("Error fetching published site:", error);
    return null;
  }
};
