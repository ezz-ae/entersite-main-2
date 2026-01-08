'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function LoginDialog({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { signUp, logIn } = useAuth();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLoginView) {
        await logIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLoginView ? 'Log In' : 'Sign Up'}</DialogTitle>
          <DialogDescription>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setIsLoginView(!isLoginView)} className="text-blue-500 hover:underline">
              {isLoginView ? 'Sign Up' : 'Log In'}
            </button>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuthAction} className="space-y-4">
          {!isLoginView && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full">{isLoginView ? 'Log In' : 'Sign Up'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
