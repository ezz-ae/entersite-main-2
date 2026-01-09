import { Resend } from 'resend';
import { CAP } from '@/lib/capabilities';

export const resend = CAP.resend ? new Resend(process.env.RESEND_API_KEY!) : null;

export function fromEmail() {
  return process.env.FROM_EMAIL!;
}
