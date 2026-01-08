export interface User {
  profile: {
    name: string;
    email: string;
    role: 'developer' | 'agent' | 'admin';
  };
  brandKit: {
    colors: {
      primary: string;
      secondary: string;
    };
    fonts: string;
    logoUrl: string;
  };
  subscriptions: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  name: string;
  developer: string;
  location: {
    city: string;
    area: string;
    mapQuery: string;
  };
  handover: {
      quarter: number;
      year: number;
  } | null;
  deliveryYear?: number;
  status?: string;
  description: {
    full: string;
    short: string;
  };
  features: string[];
  price: {
    from: number;
    label: string;
    sqftAvg?: number;
  };
  performance: {
    roi: number;             // Expected annual yield %
    capitalAppreciation: number; // Expected value growth %
    rentalYield: number;     // Annual rent %
    marketTrend: 'up' | 'stable' | 'down';
    priceHistory: { year: number, avgPrice: number }[];
  };
  availability: 'Available' | 'Sold Out' | 'Coming Soon';
  images: string[];
  bedrooms?: {
    min: number;
    max: number;
    label: string;
  };
  areaSqft?: {
    min: number;
    max: number;
    label: string;
  };
  tags?: string[];
  publicUrl?: string;
  unitsStockUpdatedAt?: string;
}


export interface Block {
  blockId: string;
  type: 'hero' | 'listing-grid' | 'cta-form' | string;
  data: Record<string, any>;
  order: number;
}

export interface SitePage {
  id: string;
  title: string;
  blocks: Block[];
  canonicalListings: string[];
  brochureUrl: string;
  ownerUid?: string;
  tenantId?: string;
  refinerStatus?: 'queued' | 'running' | 'review' | 'done' | 'error';
  lastRefinedAt?: string | Date;
  lastRefinerJobId?: string;
  refinerBaseSnapshot?: SitePage;
  refinerDraftSnapshot?: SitePage;
  refinerDraftHtml?: string;
  refinerPreviewUrl?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilter {
  city?: string;
  developer?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  availability?: 'Available' | 'Sold Out' | 'Coming Soon';
}

export interface SiteTemplate {
  id: string;
  name: string;
  siteType: 'roadshow' | 'developer-focus' | 'partner-launch' | 'full-company' | 'freelancer' | 'map-focused' | 'ads-launch' | 'ready-made' | 'agent-portfolio' | 'custom';
  pages: SitePage[];
  thumbnail?: string;
  description?: string;
}

export interface BlockConfig {
  type: string;
  name: string;
  description: string;
  icon: any;
  category: 'hero' | 'content' | 'listings' | 'forms' | 'data' | 'social' | 'ai' | 'finance' | 'info' | 'marketing' | 'search';
  defaultData: Record<string, any>;
}
