
import type { SitePage } from '@/lib/types';
import { authorizedFetch } from '@/lib/auth-fetch';

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
 * @returns {Promise<VercelPublishResult>} A promise that resolves with the publishing result.
 * @throws Will throw an error if the publishing process fails.
 */
export const publishSite = async (page: SitePage): Promise<VercelPublishResult> => {
  if (!page.id) {
    throw new Error('Site must be saved before publishing.');
  }

  try {
    const response = await authorizedFetch('/api/publish/vercel', {
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

    return await response.json();

  } catch (error) {
    console.error("Publishing Error:", error);
    throw error;
  }
};
