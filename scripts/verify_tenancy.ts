/*
  Smoke test for tenant isolation.

  Required env:
    - FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)
    - TENANCY_TEST_SITE_ID (a site doc owned by tenant A)
    - TENANCY_TEST_TOKEN_A (Firebase ID token for tenant A)
    - TENANCY_TEST_TOKEN_B (Firebase ID token for tenant B)

  Example:
    TENANCY_TEST_SITE_ID=abc123 \
    TENANCY_TEST_TOKEN_A=... \
    TENANCY_TEST_TOKEN_B=... \
    ts-node --esm scripts/verify_tenancy.ts
*/

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  process.env.project_id;

const siteId = process.env.TENANCY_TEST_SITE_ID;
const tokenA = process.env.TENANCY_TEST_TOKEN_A;
const tokenB = process.env.TENANCY_TEST_TOKEN_B;

if (!projectId || !siteId || !tokenA || !tokenB) {
  console.error('Missing required env vars.');
  console.error('Required: FIREBASE_PROJECT_ID, TENANCY_TEST_SITE_ID, TENANCY_TEST_TOKEN_A, TENANCY_TEST_TOKEN_B');
  process.exit(1);
}

const siteUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/sites/${encodeURIComponent(siteId)}`;

async function fetchSite(token: string) {
  const res = await fetch(siteUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { status: res.status, body: await res.text() };
}

(async () => {
  console.log('[tenancy] checking site access with tenant A token');
  const resA = await fetchSite(tokenA);
  console.log('[tenant A]', resA.status);
  if (resA.status !== 200) {
    console.error('Expected tenant A to access its site.');
    console.error(resA.body.slice(0, 500));
    process.exit(1);
  }

  console.log('[tenancy] checking cross-tenant access with tenant B token');
  const resB = await fetchSite(tokenB);
  console.log('[tenant B]', resB.status);
  if (resB.status === 200) {
    console.error('Cross-tenant access succeeded (should be blocked).');
    process.exit(1);
  }

  console.log('[tenancy] success: cross-tenant access blocked.');
})();
