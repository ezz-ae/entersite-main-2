export type SmartSequenceDraft = {
  email?: { subject: string; body: string };
  sms?: { message: string };
  whatsapp?: { message: string };
};

export type SenderRunStatus = 'pending' | 'running' | 'done' | 'failed';

export type SenderRun = {
  id: string;
  tenantId: string;
  campaignId: string;
  leadId: string;

  status: SenderRunStatus;
  stepIndex: number; // 0=email, 1=sms, 2=whatsapp

  nextAt: number; // millis
  createdAt: number;
  updatedAt: number;

  lastError?: string;
  history?: Array<{
    at: number;
    channel: 'email' | 'sms' | 'whatsapp' | 'skip';
    ok: boolean;
    message?: string;
  }>;
};

export type SenderDelays = {
  emailToSmsMs: number;
  smsToWhatsappMs: number;
};

export const DEFAULT_SENDER_DELAYS: SenderDelays = {
  emailToSmsMs: 2 * 60 * 1000,
  smsToWhatsappMs: 2 * 60 * 1000,
};
