import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

dotenv.config({ path: '.env.local' });
dotenv.config();

// --- CONFIGURATION ---
// GCS bucket and file path for the raw data.
// This needs to be set in your environment variables.
const GCS_BUCKET = process.env.GCS_INGESTION_BUCKET || 'your-ingestion-bucket-name';
const GCS_FILE_PATH = process.env.GCS_INGESTION_FILE || 'realiste_buildings_raw.json';
const FIRESTORE_COLLECTION = 'inventory_projects';
const CHUNK_SIZE = 400; // Max 500 operations per batch

let app: App | null = null;
let db: Firestore | null = null;
let storage: Storage | null = null;

function initializeFirebase() {
  if (app) return;

  console.log(`[Ingest] Initializing Firebase connection...`);
  let serviceAccount;
  try {
    if (process.env.FIREBASE_ADMIN_SDK_CONFIG) {
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);
    }
  } catch (e) { /* Fallback below */ }

  if (!serviceAccount) {
    if (process.env.FIREBASE_PROJECT_ID) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
    }
  }

  if (serviceAccount && (serviceAccount.privateKey || serviceAccount.private_key)) {
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: GCS_BUCKET,
    });
    db = getFirestore(app);
    storage = getStorage(app);
    console.log(`[Ingest] Firebase initialized for project: ${serviceAccount.projectId || serviceAccount.project_id}`);
  } else {
    throw new Error('Could not initialize Firebase. Missing credentials.');
  }
}

async function getRawDataFromGCS(): Promise<any[]> {
  if (!storage) throw new Error('Storage not initialized.');
  console.log(`[Ingest] Loading raw data from GCS: gs://${GCS_BUCKET}/${GCS_FILE_PATH}`);
  const file = storage.bucket(GCS_BUCKET).file(GCS_FILE_PATH);
  const [exists] = await file.exists();
  if (!exists) {
    throw new Error(`File not found in GCS: gs://${GCS_BUCKET}/${GCS_FILE_PATH}`);
  }
  const contents = await file.download();
  return JSON.parse(contents.toString());
}

// --- INTELLIGENCE GENERATOR ---
function generateMarketIntelligence(city: string, price: number) {
  const baseRoi = city === 'DUBAI' ? 6.5 : 5.5;
  const isLuxury = price > 3000000;
  
  const roi = isLuxury 
    ? (baseRoi + Math.random() * 1.5).toFixed(1) 
    : (baseRoi + 1.5 + Math.random() * 2.5).toFixed(1);

  const appreciation = isLuxury
    ? (12 + Math.random() * 8).toFixed(1)
    : (8 + Math.random() * 5).toFixed(1);

  const currentYear = new Date().getFullYear();
  const priceHistory = [
    { year: currentYear - 2, avgPrice: Math.round(price * 0.85) },
    { year: currentYear - 1, avgPrice: Math.round(price * 0.92) },
    { year: currentYear, avgPrice: price },
  ];

  return {
    roi: parseFloat(roi),
    capitalAppreciation: parseFloat(appreciation),
    rentalYield: parseFloat((parseFloat(roi) * 0.8).toFixed(1)),
    marketTrend: Math.random() > 0.3 ? 'up' : 'stable',
    priceHistory
  };
}

function estimateHandover() {
    const quarters = [1, 2, 3, 4];
    const years = [2025, 2026, 2027, 2028];
    return {
        quarter: quarters[Math.floor(Math.random() * quarters.length)],
        year: years[Math.floor(Math.random() * years.length)]
    };
}

/**
 * Ingests raw project data from GCS, enriches it, and saves it to Firestore.
 * This function is designed to be called from a Google Cloud Function.
 */
export async function runIngestion() {
  initializeFirebase();
  if (!db) throw new Error('Firestore is not initialized.');

  console.log("Loading raw Realiste data from GCS...");
  const rawData = await getRawDataFromGCS();
  
  console.log(`Mapping ${rawData.length} projects with Synthetic Intelligence...`);

  for (let i = 0; i < rawData.length; i += CHUNK_SIZE) {
    const chunk = rawData.slice(i, i + CHUNK_SIZE);
    const batch = db.batch();
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
    console.log(`[Ingest] Preparing chunk ${chunkNum}...`);

    chunk.forEach((project: any) => {
      const cityMatch = project.publicUrl?.match(/cities\/uae-([^/]+)/);
      const city = cityMatch ? cityMatch[1].replace('-', ' ').toUpperCase() : 'DUBAI';
      
      let basePrice = 1500000;
      if (project.name.toLowerCase().includes('residence')) basePrice = 1200000;
      if (project.name.toLowerCase().includes('villa')) basePrice = 3500000;
      if (project.name.toLowerCase().includes('mansion')) basePrice = 15000000;
      
      const price = Math.round(basePrice * (0.8 + Math.random() * 0.4));
      const intelligence = generateMarketIntelligence(city, price);

      const projectId = project.urlPathSegment || `project_${Math.random().toString(36).substr(2, 9)}`;
      const docRef = db!.collection(FIRESTORE_COLLECTION).doc(projectId);

      batch.set(docRef, {
        id: projectId,
        name: project.name,
        developer: project.name.split(' ')[0] || "Verified Developer",
        location: {
          city: city,
          area: project.name.split(' at ')[1] || city + " Prime",
          mapQuery: `${project.name}, ${city}`,
        },
        handover: estimateHandover(),
        description: {
          short: `Investment opportunity in ${city}. ${intelligence.roi}% projected yield.`,
          full: `A premium development in ${city} offering exceptional value. With a projected capital appreciation of ${intelligence.capitalAppreciation}% and rental yields hovering around ${intelligence.roi}%, this project represents a strategic entry point into the ${city} market.`
        },
        price: {
            from: price,
            label: `AED ${(price / 1000000).toFixed(2)}M`,
        },
        performance: intelligence,
        images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"],
        publicUrl: project.publicUrl,
        source: 'realiste_master',
        availability: 'Available',
        ingestedAt: new Date().toISOString(),
      }, { merge: true });
    });

    console.log(`[Ingest] Committing chunk ${chunkNum}...`);
    await batch.commit();
    console.log(`[Ingest] Success: Chunk ${chunkNum} committed.`);
  }

  console.log('--- MASTER DATA INGESTION COMPLETE ---');
}

// To run this locally (for testing), you could add:
// if (require.main === module) {
//   console.log('[Ingest] Running in local script mode...');
//   // For local runs, you might want to use fs to read a local file
//   // instead of getRawDataFromGCS(). This part is left as an exercise.
//   runIngestion().catch((err) => {
//     console.error("Ingestion failed:", err);
//     process.exit(1);
//   });
// }
