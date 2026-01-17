
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

type LoginSignupFormProps = {
  mode?: 'login' | 'signup' | 'both';
  redirectTo?: string;
};

export function LoginSignupForm({ mode = 'both', redirectTo }: LoginSignupFormProps) {
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);
    if (ok && redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            {isLogin ? 'Sign in to continue' : 'Create a new account'}
          </h2>
          {mode === 'both' && (
            <p className="mt-2 text-center text-sm text-zinc-400">
              Or{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-blue-500 hover:text-blue-400">
                {isLogin ? 'create an account' : 'sign in to your account'}
              </button>
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Sign in' : 'Sign up')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
