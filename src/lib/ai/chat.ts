import {
  FLASH_MODEL,
  FALLBACK_FLASH_MODEL,
  FALLBACK_PRO_MODEL,
} from '@/lib/ai/google';

const normalizeKey = (value?: string) => {
  if (!value) return undefined;
  return value.trim().replace(/^['"]|['"]$/g, '') || undefined;
};

const resolveGoogleApiKey = () =>
  normalizeKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY) ||
  normalizeKey(process.env.GEMINI_API_KEY) ||
  normalizeKey(process.env.Gemini_api_key);

const GOOGLE_API_KEY = resolveGoogleApiKey();
const OPENAI_API_KEY = normalizeKey(process.env.OPENAI_API_KEY);
const OPENAI_API_URL =
  normalizeKey(process.env.OPENAI_API_URL) || 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = normalizeKey(process.env.OPENAI_MODEL) || 'gpt-4o-mini';

type ChatParams = {
  system: string;
  prompt: string;
  googleModel?: string;
  temperature?: number;
};

function resolveProvider() {
  const provider = (process.env.LLM_PROVIDER || '').toLowerCase();
  if (provider === 'openai') return 'openai';
  if (provider === 'google') return 'google';
  if (OPENAI_API_KEY) return 'openai';
  if (GOOGLE_API_KEY) return 'google';
  return 'none';
}

async function generateOpenAIText(params: ChatParams) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured.');
  }
  const messages = [
    { role: 'system', content: params.system },
    { role: 'user', content: params.prompt },
  ];

  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: params.temperature ?? 0.4,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI request failed: ${body || res.status}`);
  }
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string') {
    throw new Error('OpenAI response missing text.');
  }
  return text.trim();
}

async function generateGoogleText(params: ChatParams) {
  const apiKey = resolveGoogleApiKey();
  if (!apiKey) {
    throw new Error('Google Generative AI API key is not configured.');
  }

  const modelId = params.googleModel || FLASH_MODEL;
  const combinedPrompt = `${params.system}\n\n${params.prompt}`.trim();

  const run = async (model: string) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: combinedPrompt }],
            },
          ],
          generationConfig: {
            temperature: params.temperature ?? 0.4,
          },
        }),
      },
    );
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Google request failed: ${body || response.status}`);
    }
    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part?.text)
        .filter(Boolean)
        .join('') || '';
    if (!text) {
      throw new Error('Google response missing text.');
    }
    return text.trim();
  };

  try {
    return await run(modelId);
  } catch (error) {
    const fallbackModel = modelId.includes('pro') ? FALLBACK_PRO_MODEL : FALLBACK_FLASH_MODEL;
    if (fallbackModel === modelId) {
      throw error;
    }
    return await run(fallbackModel);
  }
}

export async function generateChatText(params: ChatParams) {
  const provider = resolveProvider();
  if (provider === 'openai') {
    return generateOpenAIText(params);
  }
  if (provider === 'google') {
    return generateGoogleText(params);
  }
  throw new Error('No LLM provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY.');
}
