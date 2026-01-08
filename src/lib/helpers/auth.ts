import { getAdminAuth } from '@/lib/firebase/server';

export async function getAuth(req: Request) {
  const authorization = req.headers.get('authorization');

  if (authorization) {
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = await getAdminAuth().verifyIdToken(token);
      return { user: decodedToken };
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return { user: null };
    }
  }

  return { user: null };
}
