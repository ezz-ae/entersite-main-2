import { db } from '@/server/firebase-admin';

const MOCK_MODE = process.env.ADS_MOCK_MODE === 'true';

export interface AdsCampaign {
  campaignId: string;
  tenantId: string;
  status: 'draft' | 'launching' | 'live' | 'paused' | 'stopped';
  landingPageUrl: string;
  planner: {
    cityArea: string;
    unitType: string;
    dailyBudgetAED: number;
    contactRoute: 'Call' | 'WhatsApp' | 'Form';
    startDate?: string;
    endDate?: string;
  };
  occalizer: {
    momentum: number;
    verdict: 'TOP' | 'FAIR' | 'RISKY';
    projections: {
      leadsMin: number;
      leadsMax: number;
      cplMinAED: number;
      cplMaxAED: number;
      competition: 'low' | 'mid' | 'high';
    };
  };
  caps: {
    dailyCapAED: number;
    totalCapAED: number;
  };
  scenario: {
    state: 'EXCEEDING' | 'ON_TRACK' | 'UNDERPERFORMING' | 'AT_RISK' | 'STOP_LOSS';
    updatedAt: string;
    reason?: string;
  };
  fairness?: {
    dflPercent: number;
    band: 'GREEN' | 'YELLOW' | 'RED';
    valid: boolean;
    lv: number;
    tv: number;
    spendAED: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const googleAdsService = {
  async listCampaigns(tenantId: string): Promise<AdsCampaign[]> {
    if (MOCK_MODE) {
      return [
        this._generateMockCampaign(tenantId, 'camp_mock_1', 'draft', 'Dubai Marina', '1BR'),
        this._generateMockCampaign(tenantId, 'camp_mock_2', 'live', 'Downtown Dubai', '2BR'),
      ];
    }

    const snap = await db.collection(`tenants/${tenantId}/ads_google_campaigns`)
      .orderBy('updatedAt', 'desc')
      .get();
    
    return snap.docs.map(d => d.data() as AdsCampaign);
  },

  async getCampaign(tenantId: string, campaignId: string): Promise<AdsCampaign | null> {
    if (MOCK_MODE) {
      return this._generateMockCampaign(tenantId, campaignId, 'draft', 'Mock Area', 'Mock Unit');
    }

    const doc = await db.doc(`tenants/${tenantId}/ads_google_campaigns/${campaignId}`).get();
    if (!doc.exists) return null;
    return doc.data() as AdsCampaign;
  },

  calculateOccalizer(momentum: number, dailyBudgetAED: number) {
    let verdict: 'TOP' | 'FAIR' | 'RISKY' = 'FAIR';
    let cplRange = [90, 180];
    let competition: 'low' | 'mid' | 'high' = 'mid';

    if (momentum <= 33) {
      verdict = 'TOP';
      cplRange = [120, 220]; // Quality traffic costs more
      competition = 'low';
    } else if (momentum <= 66) {
      verdict = 'FAIR';
      cplRange = [90, 180];
      competition = 'mid';
    } else {
      verdict = 'RISKY';
      cplRange = [130, 260]; // Volatile
      competition = 'high';
    }

    // Leads = Budget / CPL
    const leadsMin = Math.floor(dailyBudgetAED / cplRange[1]);
    const leadsMax = Math.ceil(dailyBudgetAED / cplRange[0]);

    return {
      momentum,
      verdict,
      projections: {
        leadsMin: Math.max(0, leadsMin),
        leadsMax: Math.max(0, leadsMax),
        cplMinAED: cplRange[0],
        cplMaxAED: cplRange[1],
        competition
      }
    };
  },

  _generateMockCampaign(tenantId: string, id: string, status: any, area: string, unit: string): AdsCampaign {
    return {
      campaignId: id,
      tenantId,
      status,
      landingPageUrl: 'https://example.com/project-x',
      planner: {
        cityArea: area,
        unitType: unit,
        dailyBudgetAED: 500,
        contactRoute: 'WhatsApp',
        startDate: new Date().toISOString().split('T')[0]
      },
      occalizer: this.calculateOccalizer(45, 500),
      caps: { dailyCapAED: 550, totalCapAED: 5000 },
      fairness: { dflPercent: 80, band: 'YELLOW', valid: true, lv: 0.5, tv: 0.9, spendAED: 400 },
      scenario: { state: status === 'live' ? 'ON_TRACK' : 'ON_TRACK', updatedAt: new Date().toISOString() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};