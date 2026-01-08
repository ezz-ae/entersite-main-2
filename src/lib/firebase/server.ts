import * as admin from 'firebase-admin';
import serviceAccount from '@/config/service-account.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
  } catch (e) {
    console.log('Firebase admin initialization error', e.stack);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
