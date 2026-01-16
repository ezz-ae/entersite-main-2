import { resend, fromEmail } from '@/lib/resend';
import { CAP } from '@/lib/capabilities';

export async function sendLeadEmail(to: string | string[], subject: string, html: string) {
  if (!CAP.resend || !resend) {
    return { skipped: true };
  }
  return resend.emails.send({
    from: `Entrestate <${fromEmail()}>`,
    to,
    subject,
    html,
  });
}
