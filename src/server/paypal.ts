const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_BASE_URL = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';

type TokenCache = {
  token: string;
  expiresAt: number;
};

let cachedToken: TokenCache | null = null;

export async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials are not configured.');
  }

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`PayPal OAuth failed: ${errorBody}`);
  }

  const data = await response.json();
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 300;

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(expiresIn - 60, 30) * 1000,
  };

  return cachedToken.token;
}

export async function paypalRequest(path: string, init: RequestInit = {}) {
  const token = await getPayPalAccessToken();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${PAYPAL_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  return response;
}
