
import { getAdminDb } from '../src/server/firebase-admin';
import { GoogleAdsCampaign } from '../src/types/ads';

const tenantId = 'YOUR_TENANT_ID'; // Use a consistent tenant ID for testing

async function seed() {
  const firestore = getAdminDb();
  const campaignRef = firestore.collection(`tenants/${tenantId}/ads_google_campaigns`).doc();
  const campaignId = campaignRef.id;

  const demoCampaign: GoogleAdsCampaign = {
    campaignId,
    tenantId,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'draft',
    landingPageUrl: 'https://example.com/landing-page',
    planner: {
      cityArea: 'Dubai Marina',
      unitType: '2-bedroom apartment',
      dailyBudgetAED: 500,
      timeline: {
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
      contactRoute: 'WhatsApp',
    },
    occalizer: {
      momentum: 50,
      verdict: 'FAIR',
      projections: {
        leadsMin: 2,
        leadsMax: 5,
        cplMinAED: 100,
        cplMaxAED: 250,
        competition: 'mid',
      },
    },
    intercept: {
      enabled: false,
      brands: [],
    },
    caps: {
      dailyCapAED: 600,
      totalCapAED: 18000,
    },
    riskControl: {
      enabled: true,
      windowDays: 7,
      metric: 'leads',
      minimum: 10,
      response: 'pause',
    },
    scenario: {
      state: 'ON_TRACK',
      updatedAt: new Date(),
      reason: 'Campaign recently started.',
    },
    fairness: {
      dflPercent: 90,
      band: 'GREEN',
      valid: true,
      lv: 1,
      tv: 0.9,
      spendAED: 0,
    },
    google: {},
    reporting: {},
  };

  await campaignRef.set(demoCampaign);
  console.log(`Successfully seeded campaign ${campaignId} for tenant ${tenantId}`);
}

seed().catch(console.error);
