'use client';

import { getSdks } from '@/firebase/get-sdks';

// Initialize and get SDKs
const sdks = getSdks();
export const firebaseApp = sdks.firebaseApp;
export const auth = sdks.auth;
export const db = sdks.firestore;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  return sdks;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export { getSdks };
