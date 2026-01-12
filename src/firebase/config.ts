
import { env } from '@/lib/env';
import { EXPECTED_FIREBASE_PROJECT_ID } from '@/lib/firebase/project';

const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!clientProjectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID. Firebase project must be explicit.');
}
if (clientProjectId !== EXPECTED_FIREBASE_PROJECT_ID) {
  throw new Error(
    `Firebase project mismatch. Expected ${EXPECTED_FIREBASE_PROJECT_ID}, got ${clientProjectId}.`
  );
}

export const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
};
