import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { SERVER_ENV } from '@/lib/server/env';
import fs from 'fs';
import path from 'path';

// This function is now the single source of truth for admin credentials.
// It ONLY looks for a service account JSON file in the project root.
// This bypasses all .env parsing issues that have caused the loop of errors.
function getServiceAccount(): ServiceAccount {
    // --- PRIMARY METHOD: Load service account from file (for Local Dev) ---
    // This matches the logic used by the ingestion script which we know works.
    try {
        const files = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.json'));
        for (const file of files) {
            try {
                const filePath = path.resolve(process.cwd(), file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const key = JSON.parse(content);
                if (key.type === 'service_account' && key.project_id && key.private_key) {
                    console.log(`[Firebase Admin] Loaded credentials from local file: ${file}`);
                    return {
                        projectId: key.project_id,
                        clientEmail: key.client_email,
                        privateKey: key.private_key
                    };
                }
            } catch (e) {
                // Ignore non-JSON or malformed files
            }
        }
    } catch (e) {
        // Ignore directory scan errors
    }

    // --- SECONDARY METHOD: Load from Environment Variables (Production/Vercel) ---
    const projectId = process.env.FIREBASE_PROJECT_ID || SERVER_ENV.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || SERVER_ENV.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY || SERVER_ENV.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
        console.log('[Firebase Admin] Loaded credentials from Environment Variables (Production).');
        const sanitizedKey = privateKey.replace(/\\n/g, '\n');
        return {
            projectId,
            clientEmail,
            privateKey: sanitizedKey,
        };
    }

    throw new Error('CRITICAL: Firebase Admin credentials not found. Checked for local JSON file and production environment variables.');
}

function initAdmin() {
  // Check if the default app is already initialized
  if (!getApps().length) {
    initializeApp({
      credential: cert(getServiceAccount())
    });
  }
}

export function getAdminDb() {
  initAdmin();
  return getFirestore();
}

export function getAdminAuth() {
  initAdmin();
  return getAuth();
}
