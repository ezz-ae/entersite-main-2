'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const REGION_DIAL_CODES: Record<string, string> = {
  AE: '+971',
  SA: '+966',
  US: '+1',
  GB: '+44',
  IN: '+91',
  RU: '+7',
  CN: '+86',
};

function getDefaultDialCode() {
  if (typeof navigator === 'undefined') return REGION_DIAL_CODES.AE;
  try {
    const locale = new Intl.Locale(navigator.language);
    const region = locale.region || 'AE';
    return REGION_DIAL_CODES[region] || REGION_DIAL_CODES.AE;
  } catch {
    return REGION_DIAL_CODES.AE;
  }
}

function normalizePhone(value: string, dialCode: string) {
  const cleaned = value.replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) return cleaned;
  return `${dialCode}${cleaned}`;
}

type PhoneOtpLoginProps = {
  redirectTo?: string;
};

export function PhoneOtpLogin({ redirectTo }: PhoneOtpLoginProps) {
  const router = useRouter();
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const [dialCode, setDialCode] = useState(REGION_DIAL_CODES.AE);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDialCode(getDefaultDialCode());
  }, []);

  const fullPhone = useMemo(() => normalizePhone(phone, dialCode), [phone, dialCode]);

  useEffect(() => {
    if (recaptchaRef.current) return;
    try {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      recaptchaRef.current.render().catch(() => undefined);
    } catch (err) {
      console.error('[login] recaptcha init failed', err);
    }

    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  const handleSendCode = async () => {
    setError(null);
    if (!fullPhone || fullPhone.length < 8) {
      setError('Enter a valid phone number with country code.');
      return;
    }
    if (!recaptchaRef.current) {
      setError('Security check not ready. Try again.');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
      setConfirmation(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to send code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    if (!confirmation) return;
    if (!code.trim()) {
      setError('Enter the OTP code.');
      return;
    }
    setLoading(true);
    try {
      await confirmation.confirm(code.trim());
      router.push(redirectTo || '/account');
    } catch (err: any) {
      setError(err?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 bg-zinc-900/60 border border-white/10 rounded-3xl p-8">
        <div className="space-y-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Login</p>
          <h1 className="text-2xl font-semibold">Phone verification</h1>
          <p className="text-sm text-zinc-400">
            Enter your phone number and we will send a one-time code.
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-widest text-zinc-500">Phone number</label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={`${dialCode} 50 123 4567`}
            className="bg-black border-white/10"
          />
          <p className="text-xs text-zinc-500">Country auto-detected: {dialCode}</p>
        </div>

        {confirmation && (
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest text-zinc-500">OTP code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="bg-black border-white/10"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="space-y-2">
          {!confirmation ? (
            <Button onClick={handleSendCode} className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send code'}
            </Button>
          ) : (
            <Button onClick={handleVerifyCode} className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & continue'}
            </Button>
          )}
          {confirmation && (
            <Button
              variant="ghost"
              className="w-full text-xs text-zinc-500 hover:text-white"
              onClick={() => {
                setConfirmation(null);
                setCode('');
              }}
            >
              Edit phone number
            </Button>
          )}
        </div>
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
