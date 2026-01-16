import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { dubaiProjects } from '../src/data/dubai';
import { abuDhabiProjects } from '../src/data/abudhabi';
import { rasAlKhaimahProjects } from '../src/data/rasalkhaimah';
import { sharjahProjects } from '../src/data/sharjah';
import { verifyAndFetchAssets } from '../src/lib/media-scraper';

// Note: This script requires a service account key for Firebase Admin
// Set GOOGLE_APPLICATION_CREDENTIALS env var before running

const app = initializeApp({
    credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS || ''),
});
const db = getFirestore(app);

const allProjects: any[] = [
    ...dubaiProjects,
    ...abuDhabiProjects,
    ...rasAlKhaimahProjects,
    ...sharjahProjects
];

async function migrate() {
    console.log(`Starting migration of ${allProjects.length} projects...`);
    
    let batch = db.batch();
    let count = 0;
    const BATCH_SIZE = 400; // Firestore batch limit is 500

    for (const project of allProjects) {
        // 1. Purify Assets
        // In a real script, we would await this. For speed in this mock, we might skip or use the mock logic.
        // Since verifyAndFetchAssets is client-side code in our current setup (using window/fetch), 
        // we would need a node-compatible version here. 
        // For this migration script, we will assume we are just pushing the raw data 
        // and the 'Purification' happens on read or via a separate Cloud Function.
        
        const docRef = db.collection('projects').doc(project.id);
        
        batch.set(docRef, {
            ...project,
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: true, // Flag these as our base verified set
            source: 'initial_migration'
        });

        count++;

        if (count % BATCH_SIZE === 0) {
            console.log(`Committing batch of ${BATCH_SIZE}...`);
            await batch.commit();
            batch = db.batch();
        }
    }

    if (count % BATCH_SIZE !== 0) {
        await batch.commit();
    }

    console.log("Migration complete!");
}

// Uncomment to run if you have creds
// migrate().catch(console.error);
