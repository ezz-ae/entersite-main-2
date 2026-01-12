import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { env } from '@/lib/env';

const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY", "AIzaSyByDVWTUBxg6XAYaq0l1aIvDqsvc4CU8YI"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "studio-7730943652-a28e0.firebaseapp.com"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "studio-7730943652-a28e0"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "studio-7730943652-a28e0.firebasestorage.app"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "622785056226"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID", "1:622785056226:web:36f7c27873e950997a7dbb"),
  measurementId: env("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID", "G-EXKX1EJ1XE"),
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app as firebaseApp, auth as firebaseAuth };
