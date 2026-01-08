
import { auth } from '@/lib/firebase/client';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authorizedFetch = async (url: string, options: RequestInit = {}) => {
  const user = auth.currentUser;
  if (!user) {
    throw new AuthError('User not logged in');
  }

  const token = await user.getIdToken();

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An error occurred during the request.');
  }

  return response.json();
};
