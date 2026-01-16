// lib/env.ts
export function env(name: string, fallback?: string) {
  const v = process.env[name];
  if (v && v.trim() !== "") return v.trim();
  if (fallback !== undefined) return fallback;
  // don't throw in dev; warn and return empty string
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[env] Missing ${name} (dev mode)`);
    return "";
  }
  throw new Error(`Missing required env var: ${name}`);
}
