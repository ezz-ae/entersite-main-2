import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { SERVER_ENV } from '@/lib/server/env';
import { EXPECTED_FIREBASE_PROJECT_ID } from '@/lib/firebase/project';

function getServiceAccount(): ServiceAccount {
    const serviceAccountString = SERVER_ENV.FIREBASE_ADMIN_SDK_CONFIG;
    if (serviceAccountString) {
        try {
            return JSON.parse(serviceAccountString) as ServiceAccount;
        } catch (e) {
            console.error("Error parsing FIREBASE_ADMIN_SDK_CONFIG:", e);
            throw new Error('Could not parse the FIREBASE_ADMIN_SDK_CONFIG. Please ensure it is a valid JSON string.');
        }
    }

    const projectId = SERVER_ENV.FIREBASE_PROJECT_ID || SERVER_ENV.project_id;
    const clientEmail = SERVER_ENV.FIREBASE_CLIENT_EMAIL || SERVER_ENV.client_email;
    const privateKey = SERVER_ENV.FIREBASE_PRIVATE_KEY || SERVER_ENV.private_key;

    if (projectId && clientEmail && privateKey) {
        return {
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        } as ServiceAccount;
    }

    throw new Error('Firebase admin credentials missing. Set FIREBASE_ADMIN_SDK_CONFIG or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.');
}

function assertFirebaseProjectMatch(serviceAccount: ServiceAccount) {
  const adminProjectId =
    (serviceAccount as { projectId?: string; project_id?: string }).projectId ||
    (serviceAccount as { projectId?: string; project_id?: string }).project_id;
  const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Safety: prevent mixed Firebase projects across client/admin configs.
  if (!adminProjectId) {
    throw new Error('Missing Firebase admin projectId. Check admin credentials.');
  }
  if (!clientProjectId) {
    throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID. Client Firebase config must be explicit.');
  }
  if (adminProjectId !== EXPECTED_FIREBASE_PROJECT_ID) {
    throw new Error(
      `Firebase admin project mismatch. Expected ${EXPECTED_FIREBASE_PROJECT_ID}, got ${adminProjectId}.`
    );
  }
  if (clientProjectId !== EXPECTED_FIREBASE_PROJECT_ID) {
    throw new Error(
      `Firebase client project mismatch. Expected ${EXPECTED_FIREBASE_PROJECT_ID}, got ${clientProjectId}.`
    );
  }
  if (clientProjectId !== adminProjectId) {
    throw new Error(
      `Firebase client/admin project mismatch. Client=${clientProjectId}, Admin=${adminProjectId}.`
    );
  }
}

function initAdmin() {
  // Check if the default app is already initialized
  if (!getApps().length) {
    const serviceAccount = getServiceAccount();
    assertFirebaseProjectMatch(serviceAccount);
    initializeApp({
      credential: cert(serviceAccount)
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
