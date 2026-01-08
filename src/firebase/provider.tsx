'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// The core Firebase services and user state
interface FirebaseServicesAndUser extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseServicesAndUser | undefined>(undefined);

/**
 * Provides core Firebase services (app, firestore, auth) and user authentication state to children.
 * Manages user session and automatically updates when auth state changes.
 */
export const FirebaseProvider = ({ 
  children, 
  firebaseApp, 
  firestore, 
  auth 
}: FirebaseProviderProps) => {
  const [userState, setUserState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true,
    userError: null,
  });

  // Memoize the core Firebase services to prevent unnecessary re-renders
  const services = useMemo(() => ({ 
    firebaseApp, 
    firestore, 
    auth, 
    areServicesAvailable: !!(firebaseApp && firestore && auth)
  }), [firebaseApp, firestore, auth]);

  useEffect(() => {
    if (services.areServicesAvailable && services.auth) {
      const unsubscribe = onAuthStateChanged(services.auth, (user) => {
        setUserState({
          user,
          isUserLoading: false,
          userError: null
        });
      }, (error) => {
        console.error("Authentication error:", error);
        setUserState({
          user: null,
          isUserLoading: false,
          userError: error
        });
      });
      
      return () => unsubscribe();
    } else {
      setUserState({ user: null, isUserLoading: false, userError: new Error("Firebase services not available.") });
    }
  }, [services.areServicesAvailable, services.auth]);

  const contextValue = useMemo(() => ({ ...services, ...userState }), [
    services,
    userState,
  ]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
    areServicesAvailable: context.areServicesAvailable
  };
};

// Custom hooks with specific dependencies to optimize re-renders
export const useFirebaseAuth = (deps: DependencyList = []) => {
  const { auth, user, isUserLoading, userError } = useFirebase();
  return useMemo(() => ({ auth, user, isUserLoading, userError }), [auth, user, isUserLoading, userError, ...deps]);
};

export const useFirebaseUser = (deps: DependencyList = []) => {
    const { user, isUserLoading, userError } = useFirebase();
    return useMemo(() => ({ user, isUserLoading, userError }), [user, isUserLoading, userError, ...deps]);
};

export const useFirestore = (deps: DependencyList = []) => {
  const { firestore } = useFirebase();
  return useMemo(() => firestore, [firestore, ...deps]);
};
