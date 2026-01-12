
import { env } from '@/lib/env';

export const firebaseConfig = {
  apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY", "AIzaSyAUfgRu9b1oGt_4G0BmDSSvh8F_l3HkdDE"),
  authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "studio-400579658-555a8.firebaseapp.com"),
  projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "studio-400579658-555a8"),
  appId: env("NEXT_PUBLIC_FIREBASE_APP_ID", "1:1041936976898:web:221ec0c2844dbcd5576b1b"),
  storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "studio-400579658-555a8.firebasestorage.app"),
  messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "1041936976898"),
};
