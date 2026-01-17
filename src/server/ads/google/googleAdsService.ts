
import { getAdminDb } from '@/server/firebase-admin';
import { GoogleAdsCampaign } from '@/types/ads';
import { calculateOccalizer } from './occalizer';
import { evaluateScenario } from './scenarioEngine';
import { calculateFairness } from './fairness';
import { getIntentClusters, deriveIntentClusters, SearchTermRow } from './intentClusters';
import { updateCampaign as updateCampaignSpine, getCampaign as getCampaignSpine, listCampaigns as listCampaignsSpine } from './campaignSpine';
import { runRefiner, RefinerResult } from './refiner';
import { evaluateRiskRules, RiskEvaluation } from './riskEngine';

const ADS_MOCK_MODE = process.env.ADS_MOCK_MODE === 'true';

export interface GravityKeyword {
  text: string;
  tier: 'core' | 'expanded' | 'aggressive';
  volume: number; // 1-10 scale for visual weight
}

interface SyncInput {
  campaign: GoogleAdsCampaign;
}

interface SyncOutput {
  status: 'success' | 'error';
  message?: string;
}

export async function createCampaign(tenantId: string, landingPageUrl: string = ''): Promise<string> {
  if (ADS_MOCK_MODE) {
    return `camp_mock_${Date.now()}`;
  }

  const db = getAdminDb();
  const campaignRef = db.collection(`tenants/${tenantId}/ads_google_campaigns`).doc();
  const campaignId = campaignRef.id;

  const newCampaign = {
    campaignId,
    tenantId,
    status: 'draft',
    landingPageUrl,
    planner: {
      cityArea: '',
      unitType: '',
      dailyBudgetAED: 0,
      contactRoute: 'WhatsApp',
    },
    occalizer: {
      momentum: 33,
      verdict: 'TOP',
      projections: {
        leadsMin: 0,
        leadsMax: 0,
        cplMinAED: 120,
        cplMaxAED: 220,
        competition: 'low',
      },
    },
    caps: {
      // @ts-ignore
      dailyCapAED: 0,
      totalCapAED: 0,
    },
    scenario: {
      state: 'ON_TRACK',
      updatedAt: new Date().toISOString(),
    },
    gravityKeywords: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await campaignRef.set(newCampaign);
  return campaignId;
}

async function syncMockCampaign(campaign: GoogleAdsCampaign): Promise<void> {
  const { campaignId, tenantId, occalizer, planner, fairness, scenario } = campaign;

  // 1. Simulate spend and leads
  const dailyBudget = planner?.dailyBudgetAED ?? 0;
  const spend = dailyBudget * (Math.random() * 0.2 + 0.9); // 90-110% of budget
  const cpl = (occalizer?.projections.cplMinAED ?? 90) + Math.random() * ((occalizer?.projections.cplMaxAED ?? 180) - (occalizer?.projections.cplMinAED ?? 90));
  const leads = Math.floor(spend / cpl);

  // 2. Evaluate fairness
  const fairnessResult = calculateFairness({
    campaign,
    leads,
    spendAED: spend,
    windowDays: 1, // Daily sync
  });

  // 3. Evaluate scenario
  const scenarioResult = evaluateScenario({
    campaign,
    leads,
    spend,
    fairnessBand: fairnessResult.band,
  });
  
  // 4. Get intent clusters
  const intentClusters = await getIntentClusters();


  // 5. Update campaign
  await updateCampaignSpine(tenantId, campaignId, {
    fairness: {
      ...fairnessResult,
      spendAED: spend,
    },
    scenario: {
      ...scenarioResult,
      updatedAt: new Date(),
    },
    reporting: {
        ...(campaign.reporting ?? {}),
        last30d: { // This should be aggregated, but for mock mode we just overwrite
            spend: (campaign.reporting?.last30d?.spend ?? 0) + spend,
            leads: (campaign.reporting?.last30d?.leads ?? 0) + leads,
        },
        intentClusters,
    }
  });
}

async function syncRealCampaign(campaign: GoogleAdsCampaign): Promise<void> {
  // 1. Fetch Real Data (Stubbed for V1)
  // In production, this would use the Google Ads API Client
  const { performance, searchTerms } = await _fetchGoogleAdsData(campaign);

  // 2. Process Intent Clusters
  const intentClusters = deriveIntentClusters(searchTerms);

  // 3. Calculate Fairness
  const fairnessResult = calculateFairness({
    campaign,
    leads: performance.leads,
    spendAED: performance.spend,
    windowDays: 30,
  });

  // 4. Evaluate Scenario
  const scenarioResult = evaluateScenario({
    campaign,
    leads: performance.leads,
    spend: performance.spend,
    fairnessBand: fairnessResult.band,
  });

  // 5. Update Campaign Spine
  await updateCampaignSpine(campaign.tenantId, campaign.campaignId, {
    fairness: {
      ...fairnessResult,
      spendAED: performance.spend,
    },
    scenario: {
      ...scenarioResult,
      updatedAt: new Date().toISOString(),
    },
    reporting: {
      last30d: performance,
      intentClusters,
    },
    updatedAt: new Date().toISOString(),
  });
}

// Stub for Google Ads API interaction
async function _fetchGoogleAdsData(campaign: GoogleAdsCampaign): Promise<{
  performance: { spend: number; leads: number };
  searchTerms: SearchTermRow[];
}> {
  // TODO: Integrate Google Ads API Client here
  // const client = new GoogleAdsApi(...);
  // const metrics = await client.search(...);
  
  console.log(`[Real Sync] Fetching data for ${campaign.campaignId} (Stubbed)`);
  
  // Return dummy data for V1 stub to demonstrate clustering logic
  return {
    performance: { spend: 1500, leads: 25 },
    searchTerms: [
      { text: 'buy 1 bedroom apartment dubai marina', impressions: 1000, clicks: 50, conversions: 2, cost: 500 },
      { text: 'dubai marina payment plan', impressions: 800, clicks: 40, conversions: 1, cost: 400 },
      { text: 'emaar properties for sale', impressions: 600, clicks: 30, conversions: 0, cost: 300 },
      { text: 'investment apartments dubai roi', impressions: 400, clicks: 20, conversions: 1, cost: 200 },
      { text: 'cheap rent dubai marina', impressions: 200, clicks: 5, conversions: 0, cost: 10 },
      { text: 'luxury penthouse floor plan', impressions: 150, clicks: 15, conversions: 0, cost: 150 },
    ]
  };
}

export async function syncCampaign(input: SyncInput): Promise<SyncOutput> {
  try {
    if (ADS_MOCK_MODE) {
      await syncMockCampaign(input.campaign);
    } else {
      await syncRealCampaign(input.campaign);
    }
    return { status: 'success' };
  } catch (error) {
    console.error('Failed to sync campaign:', error);
    return { status: 'error', message: 'Failed to sync campaign' };
  }
}

export async function updateCampaign(tenantId: string, campaignId: string, data: Partial<GoogleAdsCampaign>): Promise<void> {
  if (ADS_MOCK_MODE) {
    console.log(`[MOCK] Updating campaign ${campaignId}`, data);
    return;
  }
  await updateCampaignSpine(tenantId, campaignId, data);
}

export async function getCampaign(tenantId: string, campaignId: string): Promise<GoogleAdsCampaign | null> {
  if (ADS_MOCK_MODE) {
    return {
      campaignId,
      tenantId,
      status: 'draft',
      landingPageUrl: 'https://example.com/project-x',
      planner: {
        cityArea: 'Dubai Marina',
        unitType: '1BR',
        dailyBudgetAED: 500,
        contactRoute: 'WhatsApp',
      },
      occalizer: {
        momentum: 45,
        verdict: 'FAIR',
        projections: { leadsMin: 5, leadsMax: 10, cplMinAED: 90, cplMaxAED: 180, competition: 'mid' }
      },
      caps: { dailyCapAED: 550, totalCapAED: 5000 },
      scenario: { state: 'ON_TRACK', reason: 'Stable delivery', updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      riskControl: { enabled: true, windowDays: 7, metric: 'leads', minimum: 1, response: 'pause' },
      fairness: { dflPercent: 80, band: 'YELLOW', valid: true, lv: 0.5, tv: 0.9, spendAED: 400 },
      intercept: { enabled: false, brands: [] },
      gravityKeywords: _generateMockKeywords('Dubai Marina', '1BR'),
      reporting: {
        last30d: { spend: 1250, leads: 18 },
        intentClusters: [
          { name: 'Payment Plan Queries', weight: 0.9 },
          { name: 'Ready-to-move', weight: 0.7 },
          { name: 'Investment ROI', weight: 0.6 },
          { name: 'Luxury Amenities', weight: 0.4 },
          { name: 'Developer Track Record', weight: 0.3 },
        ]
      }
    } as GoogleAdsCampaign;
  }

  return getCampaignSpine(tenantId, campaignId);
}

export async function refineCampaign(tenantId: string, campaignId: string): Promise<RefinerResult> {
  const campaign = await getCampaign(tenantId, campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  return runRefiner(campaign);
}

export async function launchCampaign(tenantId: string, campaignId: string): Promise<void> {
  const campaign = await getCampaign(tenantId, campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  // 1. Run Refiner checks
  const refinerResult = runRefiner(campaign);
  if (!refinerResult.passed) {
    throw new Error('Refiner checks failed. Please resolve critical issues.');
  }

  // 2. Update status to launching
  await updateCampaignSpine(tenantId, campaignId, { status: 'launching' });

  try {
    // 3. Sync with Google Ads (Mock or Real)
    const syncResult = await syncCampaign({ campaign });
    
    if (syncResult.status === 'error') {
      throw new Error(syncResult.message);
    }

    // 4. Update status to live
    await updateCampaignSpine(tenantId, campaignId, { status: 'live' });
  } catch (error) {
    // Revert to draft on failure
    console.error('Launch sync failed, reverting to draft:', error);
    await updateCampaignSpine(tenantId, campaignId, { status: 'draft' });
    throw error;
  }
}

export interface AdsPlan {
  adGroups: string[];
  copyPack: {
    headlines: string[];
    descriptions: string[];
  };
  trackingPlan: string[];
  keywordGravity: {
    cluster: string;
    volume: 'low' | 'mid' | 'high';
  }[];
}

export async function generatePlan(tenantId: string, campaignId: string): Promise<AdsPlan> {
  const campaign = await getCampaign(tenantId, campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  if (ADS_MOCK_MODE) {
    return _generateMockPlan(campaign);
  }

  // TODO: Implement real Google Ads Keyword Planner / GenAI plan generation
  return _generateMockPlan(campaign);
}

function _generateMockPlan(campaign: GoogleAdsCampaign): AdsPlan {
  const city = campaign.planner?.cityArea || 'Dubai';
  const unit = campaign.planner?.unitType || 'Properties';

  return {
    adGroups: [
      `${unit} in ${city} - Core`,
      `${city} Real Estate - Broad`,
      `Buy ${unit} - Intent`,
    ],
    copyPack: {
      headlines: [
        `Luxury ${unit} in ${city}`,
        `Own a Home in ${city}`,
        `Exclusive Payment Plans`,
        `Ready to Move ${unit}`,
        `Invest in ${city} Real Estate`,
      ],
      descriptions: [
        `Discover premium ${unit} in the heart of ${city}. High ROI potential.`,
        `Book your viewing today. Limited units available with flexible payment plans.`,
        `Experience luxury living in ${city}. Amenities include pool, gym, and parking.`,
        `Direct from developer. No commission. 5-year post-handover payment plan.`,
      ],
    },
    trackingPlan: [
      'Submit Lead Form',
      'Click WhatsApp Button',
      'Call Extension Click',
    ],
    keywordGravity: [
      { cluster: `${unit} for sale`, volume: 'high' },
      { cluster: `${city} property prices`, volume: 'mid' },
      { cluster: `buy ${unit} ${city}`, volume: 'high' },
      { cluster: `payment plan ${city}`, volume: 'mid' },
    ],
  };
}

export async function evaluateRisk(tenantId: string, campaignId: string): Promise<RiskEvaluation> {
  const campaign = await getCampaign(tenantId, campaignId);
  if (!campaign) {
    throw new Error('Campaign not found');
  }

  const result = evaluateRiskRules(campaign);

  if (result.triggered && result.action) {
    // Apply automated responses
    if (result.action === 'pause') {
      await updateCampaignSpine(tenantId, campaignId, { 
        status: 'paused',
        scenario: { 
          state: 'STOP_LOSS', 
          updatedAt: new Date().toISOString(),
          reason: result.reason || 'Risk rule triggered',
        }
      });
    } else if (result.action === 'lowerBudget') {
      const currentBudget = campaign.planner?.dailyBudgetAED || 0;
      const newBudget = Math.max(50, Math.floor(currentBudget * 0.8));
      await updateCampaignSpine(tenantId, campaignId, {
        planner: { ...campaign.planner!, dailyBudgetAED: newBudget },
        scenario: {
          state: 'AT_RISK',
          updatedAt: new Date().toISOString(),
          reason: result.reason || 'Risk rule triggered',
        }
      });
    }
  }

  return result;
}

export async function listCampaigns(tenantId: string): Promise<GoogleAdsCampaign[]> {
  if (ADS_MOCK_MODE) {
    return [
      {
        campaignId: 'camp_mock_1',
        tenantId,
        status: 'draft',
        landingPageUrl: 'https://example.com/project-x',
        planner: {
          cityArea: 'Dubai Marina',
          unitType: '1BR',
          dailyBudgetAED: 500,
          contactRoute: 'WhatsApp',
        },
        occalizer: {
          momentum: 45,
          verdict: 'FAIR',
          projections: { leadsMin: 5, leadsMax: 10, cplMinAED: 90, cplMaxAED: 180, competition: 'mid' }
        },
        caps: { dailyCapAED: 550, totalCapAED: 5000 },
        scenario: { state: 'ON_TRACK', updatedAt: new Date().toISOString() },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as GoogleAdsCampaign,
      {
        campaignId: 'camp_mock_2',
        tenantId,
        status: 'live',
        landingPageUrl: 'https://example.com/downtown',
        planner: { cityArea: 'Downtown', unitType: '2BR', dailyBudgetAED: 800, contactRoute: 'Call' },
        occalizer: { momentum: 80, verdict: 'RISKY', projections: { leadsMin: 10, leadsMax: 20, cplMinAED: 130, cplMaxAED: 260, competition: 'high' } },
        scenario: { state: 'AT_RISK', updatedAt: new Date().toISOString() },
      } as any
    ];
  }

  return listCampaignsSpine(tenantId);
}

function _generateMockKeywords(area: string, unit: string): GravityKeyword[] {
  return [
    { text: `${unit} in ${area}`, tier: 'core', volume: 8 },
    { text: `Buy ${unit} ${area}`, tier: 'core', volume: 7 },
    { text: `${area} properties`, tier: 'core', volume: 6 },
    { text: `Apartments for sale ${area}`, tier: 'expanded', volume: 9 },
    { text: `Real Estate ${area}`, tier: 'expanded', volume: 8 },
    { text: `Dubai Investment Properties`, tier: 'expanded', volume: 7 },
    { text: `Luxury Real Estate Dubai`, tier: 'aggressive', volume: 10 },
    { text: `Best ROI Projects UAE`, tier: 'aggressive', volume: 9 },
    { text: `Off-plan Dubai`, tier: 'aggressive', volume: 8 },
  ];
}
