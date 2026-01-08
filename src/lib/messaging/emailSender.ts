import { authorizedFetch } from '@/lib/auth-fetch';

export interface EmailSendPayload {
  to: string;
  subject: string;
  body: string;
  tenantId?: string;
}

export async function sendEmail(payload: EmailSendPayload) {
  const response = await authorizedFetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Email send failed');
  }

  return data;
}
