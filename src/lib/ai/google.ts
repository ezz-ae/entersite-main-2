import { createGoogleGenerativeAI } from '@ai-sdk/google';

const normalizeKey = (value?: string) => {
  if (!value) return undefined;
  return value.trim().replace(/^['"]|['"]$/g, '') || undefined;
};

const API_KEY =
  normalizeKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY) ||
  normalizeKey(process.env.GEMINI_API_KEY) ||
  normalizeKey(process.env.Gemini_api_key);

const client = API_KEY ? createGoogleGenerativeAI({ apiKey: API_KEY }) : null;

export const FLASH_MODEL = 'gemini-2.5-flash';
export const PRO_MODEL = 'gemini-2.5-pro';
export const IMAGE_MODEL = 'imagen-3.0-create-001';
export const FALLBACK_FLASH_MODEL = 'gemini-2.0-flash';
export const FALLBACK_PRO_MODEL = 'gemini-2.5-flash';

export function getGoogleModel(modelId: string) {
  if (!client) {
    throw new Error('Google Generative Smart API key is not configured.');
  }
  return client(modelId) as any;
}
