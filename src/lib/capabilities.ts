export const CAP = {
  resend: Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL),
  twilio: Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
  ),
  hubspot: Boolean(process.env.HUBSPOT_ACCESS_TOKEN),
  vercel: Boolean(process.env.VERCEL_API_TOKEN),
} as const;
