import { adminAuth } from '@/lib/firebase/server';
import { headers } from 'next/headers';

export async function getAuth(req: Request) {
  const headersList = headers();
  const authorization = headersList.get('authorization');

  if (authorization) {
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return { user: decodedToken };
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return { user: null };
    }
  }

  return { user: null };
}
