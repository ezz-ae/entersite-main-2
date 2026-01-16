import twilio from 'twilio';
import { CAP } from '@/lib/capabilities';

export const twilioClient = CAP.twilio
  ? twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)
  : null;

export const twilioFrom = process.env.TWILIO_FROM_NUMBER;
