export type CampaignStatus =
  | 'draft'
  | 'ready'
  | 'running'
  | 'paused'
  | 'completed'
  | 'archived';

export type CampaignObjective = 'leads' | 'calls' | 'whatsapp' | 'traffic';

export type CampaignLanding =
  | { mode: 'external'; url: string }
  | { mode: 'surface'; siteId: string; url: string };

export type CampaignBindings = {
  inventoryScope?: {
    mode: 'all' | 'filter' | 'collection';
    filter?: Record<string, any>;
    collectionId?: string;
  };
  sender?: { enabled: boolean; sequenceId?: string };
  agent?: {
    enabled: boolean;
    agentId?: string;
    deployments?: Array<{
      type:
        | 'landing_embed'
        | 'website_widget'
        | 'public_link'
        | 'qr'
        | 'instagram_dm';
      status: 'draft' | 'active' | 'paused';
    }>;
  };
  audience?: { enabled: boolean; segmentIds?: string[] };
  ads?: {
    provider: 'google';
    mode?: 'ours' | 'customer';
    planId?: string;
    googleCampaignResourceName?: string;
  };
};

export type Campaign = {
  id: string;
  tenantId: string;

  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;

  landing?: CampaignLanding;
  bindings: CampaignBindings;

  createdAt: number;
  updatedAt: number;
};
