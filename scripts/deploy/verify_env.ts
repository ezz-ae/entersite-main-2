import fs from 'fs';
import dotenv from 'dotenv';

const envFile = process.env.ENV_FILE || '.env.local';

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
}

const strict = process.argv.includes('--strict') || process.env.STRICT === '1';

const required: string[] = [];
const optional: string[] = [];

function requireKey(key: string) {
  if (!process.env[key]) {
    required.push(key);
  }
}

function optionalKey(key: string) {
  if (!process.env[key]) {
    optional.push(key);
  }
}

const firebaseClientKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_ROOT_DOMAIN',
];

firebaseClientKeys.forEach(requireKey);

const adminProjectId = process.env.FIREBASE_PROJECT_ID || process.env.project_id;
const adminClientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.client_email;
const adminPrivateKey = process.env.FIREBASE_PRIVATE_KEY || process.env.private_key;
const hasAdminConfig = Boolean(process.env.FIREBASE_ADMIN_SDK_CONFIG);
const hasAdminSplit = Boolean(adminProjectId && adminClientEmail && adminPrivateKey);

if (!hasAdminConfig && !hasAdminSplit) {
  required.push(
    'FIREBASE_ADMIN_SDK_CONFIG (or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY)'
  );
}

const aiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.Gemini_api_key;

if (!aiKey) {
  required.push('GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY');
}

const rateLimitDisabled = process.env.RATE_LIMIT_DISABLED === 'true';
if (!rateLimitDisabled) {
  requireKey('UPSTASH_REDIS_REST_URL');
  requireKey('UPSTASH_REDIS_REST_TOKEN');
} else {
  optional.push('UPSTASH_REDIS_REST_URL (rate limiting disabled)');
  optional.push('UPSTASH_REDIS_REST_TOKEN (rate limiting disabled)');
}

optionalKey('CRON_SECRET');

// Optional integrations
[
  'RESEND_API_KEY',
  'FROM_EMAIL',
  'NOTIFY_EMAIL_TO',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
  'NOTIFY_SMS_TO',
  'HUBSPOT_ACCESS_TOKEN',
  'PAYPAL_CLIENT_ID',
  'PAYPAL_CLIENT_SECRET',
  'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
  'PAYPAL_WEBHOOK_ID',
  'PAYPAL_API_BASE',
  'ZIINA_API_KEY',
  'ZIINA_WEBHOOK_SECRET',
  'ZIINA_BASE_URL',
  'VERCEL_API_TOKEN',
  'VERCEL_PROJECT_ID',
  'VERCEL_TEAM_ID',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_SITE_DOMAIN',
  'ADS_NOTIFICATION_EMAIL',
  'DOMAIN_REQUEST_EMAIL',
  'SUPPORT_EMAIL',
].forEach(optionalKey);

if (required.length) {
  console.error('Missing required env vars:');
  required.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

if (strict && optional.length) {
  console.error('Missing optional env vars in --strict mode:');
  optional.forEach((key) => console.error(`- ${key}`));
  process.exit(1);
}

if (optional.length) {
  console.warn('Optional env vars not set:');
  optional.forEach((key) => console.warn(`- ${key}`));
}

console.log('All required env vars are set.');
