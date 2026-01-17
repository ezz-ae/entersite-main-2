
import { z } from 'zod';
import { OccalizerVerdictSchema, CompetitionSchema } from '@/types/ads';

export const OccalizerInputSchema = z.object({
  momentum: z.number().min(0).max(100),
  dailyBudgetAED: z.number().positive(),
});

export type OccalizerInput = z.infer<typeof OccalizerInputSchema>;

export interface OccalizerOutput {
  verdict: z.infer<typeof OccalizerVerdictSchema>;
  projections: {
    leadsMin: number;
    leadsMax: number;
    cplMinAED: number;
    cplMaxAED: number;
    competition: z.infer<typeof CompetitionSchema>;
  };
}

// Heuristics for V1
const VERDICTS = {
  TOP: {
    cplRange: [120, 220],
    competition: 'low-mid',
  },
  FAIR: {
    cplRange: [90, 180],
    competition: 'mid',
  },
  RISKY: {
    cplRange: [130, 260],
    competition: 'mid-high',
  },
};

export function calculateOccalizer(input: OccalizerInput): OccalizerOutput {
  const { momentum, dailyBudgetAED } = OccalizerInputSchema.parse(input);

  let verdict: OccalizerOutput['verdict'];
  let cplRange: number[];
  let competition: OccalizerOutput['projections']['competition'];

  if (momentum <= 33) {
    verdict = 'TOP';
    cplRange = VERDICTS.TOP.cplRange;
    competition = 'low';
  } else if (momentum <= 66) {
    verdict = 'FAIR';
    cplRange = VERDICTS.FAIR.cplRange;
    competition = 'mid';
  } else {
    verdict = 'RISKY';
    cplRange = VERDICTS.RISKY.cplRange;
    competition = 'high';
  }

  const [cplMin, cplMax] = cplRange;

  const leadsMin = Math.floor(dailyBudgetAED / cplMax);
  const leadsMax = Math.floor(dailyBudgetAED / cplMin);

  return {
    verdict,
    projections: {
      leadsMin,
      leadsMax,
      cplMinAED: cplMin,
      cplMaxAED: cplMax,
      competition,
    },
  };
}
