'use client';

import { useSearchParams } from 'next/navigation';
import { PhoneOtpLogin } from '@/components/auth/phone-otp-login';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;
  return <PhoneOtpLogin redirectTo={returnTo} />;
}
