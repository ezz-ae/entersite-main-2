'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoginDialog } from '@/components/auth/login-dialog';

interface LoginDialogContextType {
  isLoginDialogOpen: boolean;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
}

const LoginDialogContext = createContext<LoginDialogContextType | undefined>(undefined);

export const useLoginDialog = () => {
  const context = useContext(LoginDialogContext);
  if (!context) {
    throw new Error('useLoginDialog must be used within a LoginDialogProvider');
  }
  return context;
};

export const LoginDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const openLoginDialog = () => setIsLoginDialogOpen(true);
  const closeLoginDialog = () => setIsLoginDialogOpen(false);

  return (
    <LoginDialogContext.Provider value={{ isLoginDialogOpen, openLoginDialog, closeLoginDialog }}>
      {children}
      <LoginDialog isOpen={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </LoginDialogContext.Provider>
  );
};
