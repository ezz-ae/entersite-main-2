import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function getServiceAccount(): ServiceAccount {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    if (serviceAccountString) {
        try {
            return JSON.parse(serviceAccountString) as ServiceAccount;
        } catch (e) {
            console.error("Error parsing FIREBASE_ADMIN_SDK_CONFIG:", e);
            throw new Error('Could not parse the FIREBASE_ADMIN_SDK_CONFIG. Please ensure it is a valid JSON string.');
        }
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.project_id;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.client_email;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.private_key;

    if (projectId && clientEmail && privateKey) {
        return {
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        } as ServiceAccount;
    }

    throw new Error('Firebase admin credentials missing. Set FIREBASE_ADMIN_SDK_CONFIG or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.');
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
