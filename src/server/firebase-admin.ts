import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

function getServiceAccount(): ServiceAccount {
    const serviceAccountString = process.env.FIREBASE_ADMIN_SDK_CONFIG;
    if (!serviceAccountString) {
        throw new Error('The FIREBASE_ADMIN_SDK_CONFIG environment variable is not set.');
    }
    try {
        return JSON.parse(serviceAccountString) as ServiceAccount;
    } catch (e) {
        console.error("Error parsing FIREBASE_ADMIN_SDK_CONFIG:", e);
        throw new Error('Could not parse the FIREBASE_ADMIN_SDK_CONFIG. Please ensure it is a valid JSON string.');
    }
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
