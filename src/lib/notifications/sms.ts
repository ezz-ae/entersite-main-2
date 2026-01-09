import { CAP } from '@/lib/capabilities';
import { twilioClient, twilioFrom } from '@/lib/twilio';

export async function sendLeadSMS(to: string, body: string) {
  if (!CAP.twilio || !twilioClient) {
    return { skipped: true };
  }
  return twilioClient.messages.create({ from: twilioFrom!, to, body });
}
