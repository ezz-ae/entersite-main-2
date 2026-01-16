import { createGoogleGenerativeAI } from '@ai-sdk/google';

const API_KEY =
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.Gemini_api_key;

const client = API_KEY ? createGoogleGenerativeAI({ apiKey: API_KEY }) : null;

export const FLASH_MODEL = 'gemini-2.5-flash';
export const PRO_MODEL = 'gemini-2.5-pro';
export const IMAGE_MODEL = 'imagen-3.0-create-001';

export function getGoogleModel(modelId: string) {
  if (!client) {
    throw new Error('Google Generative Smart API key is not configured.');
  }
  return client(modelId) as any;
}
