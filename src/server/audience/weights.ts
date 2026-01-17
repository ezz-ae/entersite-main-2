import type { AudienceEventType } from './event-types';

// Keep weights mechanical and stable. Tuning can happen later.
export function weightForEvent(type: AudienceEventType): number {
  switch (type) {
    case 'landing.view':
      return 1;
    case 'ads.click':
      return 3;
    case 'agent.session.start':
      return 5;
    case 'agent.message':
      return 2;

    case 'landing.form_submit':
      return 13;

    case 'sender.email.sent':
    case 'sender.sms.sent':
    case 'sender.whatsapp.sent':
      return 8;

    case 'sender.reply':
    case 'agent.lead_created':
      return 21;

    case 'ads.conversion':
      return 34;

    default:
      return 1;
  }
}
