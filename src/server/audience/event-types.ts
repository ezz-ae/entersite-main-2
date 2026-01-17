export type AudienceActor =
  | { type: 'anonymous'; fingerprint?: string }
  | { type: 'lead'; leadId: string; fingerprint?: string }
  | { type: 'user'; uid: string };

export type AudienceEventType =
  | 'landing.view'
  | 'landing.form_submit'
  | 'sender.email.sent'
  | 'sender.sms.sent'
  | 'sender.whatsapp.sent'
  | 'sender.reply'
  | 'agent.session.start'
  | 'agent.message'
  | 'agent.lead_created'
  | 'ads.click'
  | 'ads.conversion';

export type AudienceEvent = {
  id: string;
  tenantId: string;
  campaignId?: string;

  actor: AudienceActor;
  type: AudienceEventType;

  ts: number;
  weight: number;
  payload?: Record<string, unknown>;

  privacy: {
    pii: false;
    hashed?: string[];
  };
};
