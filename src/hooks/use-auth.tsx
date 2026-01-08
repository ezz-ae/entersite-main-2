'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase/client';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    await auth.signOut();
  };

  return { signIn, signUp, logOut, loading, error };
};
