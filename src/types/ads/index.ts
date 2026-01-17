
import { z } from 'zod';

export const GoogleAdsCampaignStatusSchema = z.enum(['draft', 'launching', 'live', 'paused', 'stopped']);
export type GoogleAdsCampaignStatus = z.infer<typeof GoogleAdsCampaignStatusSchema>;

export const OccalizerVerdictSchema = z.enum(['TOP', 'FAIR', 'RISKY']);
export type OccalizerVerdict = z.infer<typeof OccalizerVerdictSchema>;

export const CompetitionSchema = z.enum(['low', 'mid', 'high']);
export type Competition = z.infer<typeof CompetitionSchema>;

export const ScenarioStateSchema = z.enum(['EXCEEDING', 'ON_TRACK', 'UNDERPERFORMING', 'AT_RISK', 'STOP_LOSS']);
export type ScenarioState = z.infer<typeof ScenarioStateSchema>;

export const FairnessBandSchema = z.enum(['GREEN', 'YELLOW', 'RED']);
export type FairnessBand = z.infer<typeof FairnessBandSchema>;

export const RiskControlMetricSchema = z.enum(['visits', 'whatsappClicks', 'leads']);
export type RiskControlMetric = z.infer<typeof RiskControlMetricSchema>;

export const RiskControlResponseSchema = z.enum(['pause', 'lowerBudget', 'suggestLandingShift', 'suggestAutoRedesign']);
export type RiskControlResponse = z.infer<typeof RiskControlResponseSchema>;

export const LogTypeSchema = z.enum(['STATE', 'SYNC', 'RISK', 'LAUNCH', 'ERROR', 'NOTE']);
export type LogType = z.infer<typeof LogTypeSchema>;

export const GoogleAdsCampaignSchema = z.object({
  campaignId: z.string(),
  tenantId: z.string(),
  createdAt: z.any(),
  updatedAt: z.any(),
  status: GoogleAdsCampaignStatusSchema,
  landingPageUrl: z.string().url().optional(),
  planner: z.object({
    cityArea: z.string().optional(),
    unitType: z.string().optional(),
    dailyBudgetAED: z.number().optional(),
    timeline: z.object({
      startDate: z.any().optional(),
      endDate: z.any().optional(),
    }).optional(),
    contactRoute: z.string().optional(),
  }).optional(),
  occalizer: z.object({
    momentum: z.number().min(0).max(100),
    verdict: OccalizerVerdictSchema,
    projections: z.object({
      leadsMin: z.number(),
      leadsMax: z.number(),
      cplMinAED: z.number(),
      cplMaxAED: z.number(),
      competition: CompetitionSchema,
    }),
  }).optional(),
  intercept: z.object({
    enabled: z.boolean(),
    brands: z.array(z.string()),
  }).optional(),
  caps: z.object({
    dailyCapAED: z.number().optional(),
    totalCapAED: z.number().optional(),
  }).optional(),
  riskControl: z.object({
    enabled: z.boolean(),
    windowDays: z.number(),
    metric: RiskControlMetricSchema,
    minimum: z.number(),
    response: RiskControlResponseSchema,
  }).optional(),
  scenario: z.object({
    state: ScenarioStateSchema,
    updatedAt: z.any(),
    reason: z.string(),
  }).optional(),
  fairness: z.object({
    dflPercent: z.number(),
    band: FairnessBandSchema,
    valid: z.boolean(),
    lv: z.number(),
    tv: z.number(),
    spendAED: z.number(),
  }).optional(),
  google: z.object({
    mccAccountId: z.string().optional(),
    customerId: z.string().optional(),
    campaignResourceName: z.string().optional(),
    lastSyncAt: z.any().optional(),
  }).optional(),
  reporting: z.object({
    last30d: z.any().optional(),
    intentClusters: z.any().optional(),
  }).optional(),
});
export type GoogleAdsCampaign = z.infer<typeof GoogleAdsCampaignSchema>;

export const GoogleAdsLogSchema = z.object({
  logId: z.string(),
  campaignId: z.string(),
  ts: z.any(),
  type: LogTypeSchema,
  message: z.string(),
  data: z.any().optional(),
});
export type GoogleAdsLog = z.infer<typeof GoogleAdsLogSchema>;
