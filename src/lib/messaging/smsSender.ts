import { authorizedFetch } from '@/lib/auth-fetch';

export interface SmsPayload {
  to: string;
  message: string;
  tenantId?: string;
  siteId?: string;
}

export async function sendSms(payload: SmsPayload) {
  const response = await authorizedFetch('/api/sms/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'SMS send failed');
  }

  return data;
}
