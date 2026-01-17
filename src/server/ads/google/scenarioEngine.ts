
import { z } from 'zod';
import { ScenarioStateSchema, GoogleAdsCampaign } from '@/types/ads';

export const ScenarioInputSchema = z.object({
  campaign: z.custom<GoogleAdsCampaign>(),
  leads: z.number().int().nonnegative(),
  spend: z.number().nonnegative(),
  fairnessBand: z.enum(['GREEN', 'YELLOW', 'RED']),
});

export type ScenarioInput = z.infer<typeof ScenarioInputSchema>;

export interface ScenarioOutput {
  state: z.infer<typeof ScenarioStateSchema>;
  reason: string;
}

export function evaluateScenario(input: ScenarioInput): ScenarioOutput {
  const { campaign, leads, spend, fairnessBand } = ScenarioInputSchema.parse(input);

  const expectedMin = campaign.occalizer?.projections.leadsMin ?? 0;
  const expectedMax = campaign.occalizer?.projections.leadsMax ?? 0;

  // Stop-Loss conditions
  if (campaign.riskControl?.enabled) {
    if (
      (campaign.riskControl.metric === 'leads' && leads < campaign.riskControl.minimum) ||
      // TODO: Implement other risk control metrics (visits, whatsappClicks)
      (fairnessBand === 'RED' && campaign.scenario?.state === 'UNDERPERFORMING')
    ) {
      return {
        state: 'STOP_LOSS',
        reason: 'Risk control triggered.',
      };
    }
  }

  // At Risk conditions
  if ((spend > 0 && leads === 0) || (fairnessBand === 'RED' && campaign.scenario?.state === 'AT_RISK')) {
    return {
      state: 'AT_RISK',
      reason: 'Spend with no leads or prolonged poor fairness.',
    };
  }
  
  // Underperforming
  if (leads < 0.7 * expectedMin) {
    return {
      state: 'UNDERPERFORMING',
      reason: `Leads are significantly below the expected minimum.`,
    };
  }

  // Exceeding
  if (leads >= 1.3 * expectedMax) {
    return {
      state: 'EXCEEDING',
      reason: 'Performance is exceeding expectations.',
    };
  }

  // On Track
  return {
    state: 'ON_TRACK',
    reason: 'Campaign is performing within expected range.',
  };
}
