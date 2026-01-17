
import { z } from 'zod';
import { FairnessBandSchema, GoogleAdsCampaign } from '@/types/ads';

export const FairnessInputSchema = z.object({
  campaign: z.custom<GoogleAdsCampaign>(),
  leads: z.number().int().nonnegative(),
  spendAED: z.number().nonnegative(),
  windowDays: z.number().int().positive(),
});

export type FairnessInput = z.infer<typeof FairnessInputSchema>;

export interface FairnessOutput {
  dflPercent: number;
  band: z.infer<typeof FairnessBandSchema>;
  valid: boolean;
  lv: number;
  tv: number;
}

const K_SCALING_FACTOR = 100; // To express as a percentage

export function calculateFairness(input: FairnessInput): FairnessOutput {
  const { campaign, leads, spendAED, windowDays } = FairnessInputSchema.parse(input);

  // 1. Calculate LV (Lead Validity)
  const expectedMin = campaign.occalizer?.projections.leadsMin ?? 0;
  let lv: number;
  if (leads >= expectedMin) {
    lv = 1.0;
  } else if (leads > 0) {
    lv = 0.5;
  } else {
    lv = 0.1;
  }

  // 2. Calculate TV (Time Validity)
  let tv: number;
  switch (campaign.planner?.contactRoute) {
    case 'WhatsApp':
      tv = 0.9;
      break;
    case 'Form':
      tv = 0.8;
      break;
    case 'Call':
      tv = 0.85;
      break;
    default:
      tv = 0.7; // Default for unknown contact route
  }
  if (campaign.planner?.timeline?.endDate) {
    const duration = new Date(campaign.planner.timeline.endDate).getTime() - new Date(campaign.planner.timeline.startDate ?? new Date()).getTime();
    if (duration > 14 * 24 * 60 * 60 * 1000) { // 14 days
        tv *= 0.9; // Decay for longer campaigns
    }
  }


  // 3. Normalize Spend
  const dailyBudget = campaign.planner?.dailyBudgetAED ?? 0;
  const baselineSpend = dailyBudget * windowDays;
  const normalizedSpend = baselineSpend > 0 ? spendAED / baselineSpend : 0;

  // 4. Calculate DFL
  let dflPercent: number;
  if (normalizedSpend > 0) {
    dflPercent = (lv * tv / normalizedSpend) * K_SCALING_FACTOR;
  } else {
    dflPercent = lv * tv * K_SCALING_FACTOR;
  }
  
  dflPercent = Math.min(dflPercent, 100); // Cap at 100%

  // 5. Determine Band
  let band: FairnessOutput['band'];
  if (dflPercent >= 85) {
    band = 'GREEN';
  } else if (dflPercent >= 60) {
    band = 'YELLOW';
  } else {
    band = 'RED';
  }

  const valid = band !== 'RED';

  return { dflPercent, band, valid, lv, tv };
}
