
import { classic_firebase_hosting_deploy as deploy } from '../tools/firebase-hosting'; // This is a placeholder for the actual tool

/**
 * Deploys a site to Firebase Hosting.
 *
 * @param {string} publicDir - The directory to deploy.
 * @param {string} siteName - The name of the site to deploy to.
 * @returns {Promise<{ deploymentId: string; publishedUrl: string; }>} A promise that resolves with the deployment result.
 */
export const classic_firebase_hosting_deploy = async (publicDir: string, siteName: string) => {

    try {
        const result = await deploy({ path: publicDir, appType: 'client' });

        if (result.status === 'succeeded') {
            // The tool definition is not clear on what the output is, so I am assuming it has a url
            const publishedUrl = result.result.url || `https://${siteName}.web.app`;
            const deploymentId = result.result.deploymentId || 'unknown';
            return { deploymentId, publishedUrl };
        } else {
            throw new Error(result.error || 'Failed to deploy to Firebase Hosting.');
        }

    } catch (error) {
        console.error("Firebase deployment failed:", error);
        throw new Error('Failed to deploy to Firebase Hosting.');
    }
};
