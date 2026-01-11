import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.string().optional(),
  FIREBASE_ADMIN_SDK_CONFIG: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  project_id: z.string().optional(),
  client_email: z.string().optional(),
  private_key: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  Gemini_api_key: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  NOTIFY_EMAIL_TO: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  NOTIFY_SMS_TO: z.string().optional(),
  HUBSPOT_ACCESS_TOKEN: z.string().optional(),
  VERCEL_API_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  VERCEL_TEAM_ID: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  RATE_LIMIT_DISABLED: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function validateServerEnv(rawEnv: NodeJS.ProcessEnv) {
  const parsed = serverEnvSchema.safeParse(rawEnv);
  if (!parsed.success) {
    throw new Error(`Invalid server env: ${parsed.error.message}`);
  }

  const env = parsed.data;
  const isProduction = rawEnv.NODE_ENV === 'production';
  const hasAdminConfig = Boolean(env.FIREBASE_ADMIN_SDK_CONFIG);
  const hasLegacyAdmin = Boolean(
    (env.FIREBASE_PROJECT_ID || env.project_id) &&
      (env.FIREBASE_CLIENT_EMAIL || env.client_email) &&
      (env.FIREBASE_PRIVATE_KEY || env.private_key)
  );

  if (isProduction && !hasAdminConfig && !hasLegacyAdmin) {
    throw new Error(
      'Missing Firebase admin credentials. Set FIREBASE_ADMIN_SDK_CONFIG or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY.'
    );
  }

  return env;
}

export const SERVER_ENV = validateServerEnv(process.env);
