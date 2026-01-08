import { NextResponse } from 'next/server';
import { getAdminDb } from '@/server/firebase-admin';

export async function GET() {
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebase: 'disconnected',
    env_check: {
      firebase_project: !!process.env.FIREBASE_PROJECT_ID,
      firebase_email: !!process.env.FIREBASE_CLIENT_EMAIL,
      firebase_key: !!process.env.FIREBASE_PRIVATE_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
    }
  };

  try {
    const db = getAdminDb();
    await db.collection('health').limit(1).get();
    status.firebase = 'connected';
  } catch (error) {
    status.firebase = 'error';
    console.error('Health check database error:', error);
  }

  return NextResponse.json(status);
}
