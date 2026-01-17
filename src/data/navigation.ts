import type { ComponentType } from 'react';
import {
  BarChart3,
  Bot,
  Globe,
  Library,
  LifeBuoy,
  Link2,
  Search,
  Target,
  Users,
  Zap,
} from 'lucide-react';

export type NavCategory = 'Execution' | 'Intelligence' | 'Control';

export type NavItem = {
  label: string;
  href: string;
  description: string;
  category: NavCategory;
  icon: ComponentType<{ className?: string }>;
  mega: {
    home: { label: string; href: string; description: string };
    work: Array<{ label: string; href: string }>;
    docs: { label: string; href: string; description: string };
  };
  mobile: Array<{ label: string; href: string }>;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Market',
    href: '/market',
    description: 'Market history, demand signals, and pricing movement.',
    category: 'Intelligence',
    icon: BarChart3,
    mega: {
      home: {
        label: 'Market',
        href: '/market',
        description: 'Market history, demand signals, and pricing movement.',
      },
      work: [
        { label: 'Market History', href: '/market/history' },
        { label: 'Demand Signals', href: '/market/demand' },
        { label: 'Pricing Movement', href: '/market/pricing' },
        { label: 'Construction Timeline', href: '/market/construction' },
        { label: 'Area Comparison', href: '/market/compare' },
        { label: 'Market Facts', href: '/market/facts' },
        { label: 'City Map View', href: '/market/map' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/market',
        description: 'Market intelligence playbooks and workflows.',
      },
    },
    mobile: [
      { label: 'Market History', href: '/market/history' },
      { label: 'Demand Signals', href: '/market/demand' },
      { label: 'Pricing Movement', href: '/market/pricing' },
      { label: 'Area Comparison', href: '/market/compare' },
      { label: 'Docs', href: '/knowledge/market' },
    ],
  },
  {
    label: 'Market Inventory',
    href: '/inventory',
    description: 'Projects inventory with availability and resale signals.',
    category: 'Intelligence',
    icon: Library,
    mega: {
      home: {
        label: 'Market Inventory',
        href: '/inventory',
        description: 'Projects inventory with availability and resale signals.',
      },
      work: [
        { label: 'Projects Inventory', href: '/inventory/projects' },
        { label: 'Developers', href: '/inventory/developers' },
        { label: 'Communities', href: '/inventory/communities' },
        { label: 'Unit Types', href: '/inventory/unit-types' },
        { label: 'Availability Signals', href: '/inventory/availability' },
        { label: 'Resale Indicators', href: '/inventory/resale' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/inventory',
        description: 'Inventory setup and import guides.',
      },
    },
    mobile: [
      { label: 'Projects Inventory', href: '/inventory/projects' },
      { label: 'Developers', href: '/inventory/developers' },
      { label: 'Communities', href: '/inventory/communities' },
      { label: 'Availability Signals', href: '/inventory/availability' },
      { label: 'Docs', href: '/knowledge/inventory' },
    ],
  },
  {
    label: 'Google Ads',
    href: '/google-ads',
    description: 'Plan, launch, and optimize search campaigns.',
    category: 'Execution',
    icon: Search,
    mega: {
      home: {
        label: 'Google Ads',
        href: '/google-ads',
        description: 'Plan, launch, and optimize search campaigns.',
      },
      work: [
        { label: 'Campaign Planner', href: '/google-ads/start' },
        { label: 'Campaigns', href: '/google-ads/campaigns' },
        { label: 'Performance', href: '/google-ads/performance' },
        { label: 'Keywords & Intent', href: '/google-ads/keywords' },
        { label: 'Activity Feed', href: '/google-ads/activity' },
        { label: 'Reports', href: '/google-ads/reports' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/google-ads',
        description: 'Campaign setup and compliance notes.',
      },
    },
    mobile: [
      { label: 'Planner', href: '/google-ads/start' },
      { label: 'Campaigns', href: '/google-ads/campaigns' },
      { label: 'Performance', href: '/google-ads/performance' },
      { label: 'Reports', href: '/google-ads/reports' },
      { label: 'Docs', href: '/knowledge/google-ads' },
    ],
  },
  {
    label: 'Site Builder',
    href: '/builder',
    description: 'Create, refine, and publish landing surfaces.',
    category: 'Execution',
    icon: Globe,
    mega: {
      home: {
        label: 'Site Builder',
        href: '/builder',
        description: 'Create, refine, and publish landing surfaces.',
      },
      work: [
        { label: 'Create Page', href: '/builder/create' },
        { label: 'Templates', href: '/builder/templates' },
        { label: 'Blocks Library', href: '/builder/blocks' },
        { label: 'Brochure Page', href: '/builder/brochure' },
        { label: 'Refiner', href: '/builder/refiner' },
        { label: 'Publish', href: '/builder/publish' },
        { label: 'Sites', href: '/builder/sites' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/builder',
        description: 'Builder playbooks and launch guides.',
      },
    },
    mobile: [
      { label: 'Create Page', href: '/builder/create' },
      { label: 'Templates', href: '/builder/templates' },
      { label: 'Blocks Library', href: '/builder/blocks' },
      { label: 'Refiner', href: '/builder/refiner' },
      { label: 'Docs', href: '/knowledge/builder' },
    ],
  },
  {
    label: 'Chat Agent',
    href: '/chat-agent',
    description: 'Agent identity, knowledge, and takeover control.',
    category: 'Execution',
    icon: Bot,
    mega: {
      home: {
        label: 'Chat Agent',
        href: '/chat-agent',
        description: 'Agent identity, knowledge, and takeover control.',
      },
      work: [
        { label: 'Setup & Identity', href: '/chat-agent/setup' },
        { label: 'Knowledge & Rules', href: '/chat-agent/knowledge' },
        { label: 'Integrations', href: '/chat-agent/integrations' },
        { label: 'Human Takeover', href: '/chat-agent/takeover' },
        { label: 'Conversations', href: '/chat-agent/conversations' },
        { label: 'Performance', href: '/chat-agent/performance' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/chat-agent',
        description: 'Agent rollout and tuning guides.',
      },
    },
    mobile: [
      { label: 'Agent Home', href: '/chat-agent' },
      { label: 'Setup & Identity', href: '/chat-agent/setup' },
      { label: 'Knowledge & Rules', href: '/chat-agent/knowledge' },
      { label: 'Human Takeover', href: '/chat-agent/takeover' },
      { label: 'Docs', href: '/knowledge/chat-agent' },
    ],
  },
  {
    label: 'Smart Sender',
    href: '/sender',
    description: 'Email, SMS, and WhatsApp sequences with guardrails.',
    category: 'Execution',
    icon: Zap,
    mega: {
      home: {
        label: 'Smart Sender',
        href: '/sender',
        description: 'Email, SMS, and WhatsApp sequences with guardrails.',
      },
      work: [
        { label: 'Create Sequence', href: '/sender/new' },
        { label: 'Runs & Queue', href: '/sender/queue' },
        { label: 'Handoff Tickets', href: '/sender/handoff' },
        { label: 'Retry Leads', href: '/sender/retry' },
        { label: 'Templates', href: '/sender/templates' },
        { label: 'Suppression Rules', href: '/sender/rules' },
        { label: 'Reports', href: '/sender/reports' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/sender',
        description: 'Sequence strategy and compliance.',
      },
    },
    mobile: [
      { label: 'Sender Home', href: '/sender' },
      { label: 'Create Sequence', href: '/sender/new' },
      { label: 'Runs & Queue', href: '/sender/queue' },
      { label: 'Handoff tickets', href: '/sender/handoff' },
      { label: 'Suppression Rules', href: '/sender/rules' },
      { label: 'Docs', href: '/knowledge/sender' },
    ],
  },
  {
    label: 'Lead Director',
    href: '/leads',
    description: 'Lead inbox, routing, and follow-up signals.',
    category: 'Control',
    icon: Target,
    mega: {
      home: {
        label: 'Lead Director',
        href: '/leads',
        description: 'Lead inbox, routing, and follow-up signals.',
      },
      work: [
        { label: 'Lead Inbox', href: '/leads/inbox' },
        { label: 'Lead Signals', href: '/leads/signals' },
        { label: 'Segments', href: '/leads/segments' },
        { label: 'Import / Upload', href: '/leads/import' },
        { label: 'Routing / Assignment', href: '/leads/routing' },
        { label: 'Export / Connect CRM', href: '/leads/connect' },
        { label: 'Reports', href: '/leads/reports' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/leads',
        description: 'Lead handling and pipeline practices.',
      },
    },
    mobile: [
      { label: 'Lead Inbox', href: '/leads/inbox' },
      { label: 'Lead Signals', href: '/leads/signals' },
      { label: 'Segments', href: '/leads/segments' },
      { label: 'Import / Upload', href: '/leads/import' },
      { label: 'Docs', href: '/knowledge/leads' },
    ],
  },
  {
    label: 'Agencies',
    href: '/agencies',
    description: 'Multi-client oversight and shared execution.',
    category: 'Control',
    icon: Users,
    mega: {
      home: {
        label: 'Agencies',
        href: '/agencies',
        description: 'Multi-client oversight and shared execution.',
      },
      work: [
        { label: 'Clients', href: '/agencies/clients' },
        { label: 'Audiences', href: '/agencies/audiences' },
        { label: 'Agent Deployment', href: '/agencies/agents' },
        { label: 'Campaign Oversight', href: '/agencies/campaigns' },
        { label: 'Spend Separation', href: '/agencies/billing' },
        { label: 'Reports', href: '/agencies/reports' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/agencies',
        description: 'Agency workflows and permissions.',
      },
    },
    mobile: [
      { label: 'Agency Home', href: '/agencies' },
      { label: 'Clients', href: '/agencies/clients' },
      { label: 'Audiences', href: '/agencies/audiences' },
      { label: 'Reports', href: '/agencies/reports' },
      { label: 'Docs', href: '/knowledge/agencies' },
    ],
  },
  {
    label: 'Analytics',
    href: '/analytics',
    description: 'Performance indicators and quality index.',
    category: 'Intelligence',
    icon: BarChart3,
    mega: {
      home: {
        label: 'Analytics',
        href: '/analytics',
        description: 'Performance indicators and quality index.',
      },
      work: [
        { label: 'Overview', href: '/analytics/overview' },
        { label: 'Quality Index', href: '/analytics/quality' },
        { label: 'Cost vs Outcome', href: '/analytics/outcome' },
        { label: 'Market Comparison', href: '/analytics/market' },
        { label: 'Time & Cohorts', href: '/analytics/cohorts' },
        { label: 'Export', href: '/analytics/export' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/analytics',
        description: 'Metrics definitions and usage.',
      },
    },
    mobile: [
      { label: 'Overview', href: '/analytics/overview' },
      { label: 'Quality Index', href: '/analytics/quality' },
      { label: 'Cost vs Outcome', href: '/analytics/outcome' },
      { label: 'Time & Cohorts', href: '/analytics/cohorts' },
      { label: 'Docs', href: '/knowledge/analytics' },
    ],
  },
  {
    label: 'Integrations',
    href: '/integrations',
    description: 'Connect CRM, messaging, and automation rails.',
    category: 'Control',
    icon: Link2,
    mega: {
      home: {
        label: 'Integrations',
        href: '/integrations',
        description: 'Connect CRM, messaging, and automation rails.',
      },
      work: [
        { label: 'WhatsApp', href: '/integrations/whatsapp' },
        { label: 'Instagram', href: '/integrations/instagram' },
        { label: 'Email Providers', href: '/integrations/email' },
        { label: 'SMS Providers', href: '/integrations/sms' },
        { label: 'CRM Connect', href: '/integrations/crm' },
        { label: 'Webhooks', href: '/integrations/webhooks' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/integrations',
        description: 'Integration requirements and steps.',
      },
    },
    mobile: [
      { label: 'Integrations Home', href: '/integrations' },
      { label: 'WhatsApp', href: '/integrations/whatsapp' },
      { label: 'Instagram', href: '/integrations/instagram' },
      { label: 'CRM Connect', href: '/integrations/crm' },
      { label: 'Docs', href: '/knowledge/integrations' },
    ],
  },
  {
    label: 'Knowledge',
    href: '/knowledge',
    description: 'Broker playbooks, system guides, and updates.',
    category: 'Control',
    icon: LifeBuoy,
    mega: {
      home: {
        label: 'Knowledge',
        href: '/knowledge',
        description: 'Broker playbooks, system guides, and updates.',
      },
      work: [
        { label: 'Playbooks', href: '/knowledge/playbook' },
        { label: 'How Systems Work', href: '/knowledge/how-it-works' },
        { label: 'Market Education', href: '/knowledge/market-education' },
        { label: 'Broker Use Cases', href: '/knowledge/use-cases' },
        { label: 'Updates', href: '/knowledge/updates' },
      ],
      docs: {
        label: 'Docs',
        href: '/knowledge/how-it-works',
        description: 'System overview and onboarding.',
      },
    },
    mobile: [
      { label: 'Playbooks', href: '/knowledge/playbook' },
      { label: 'How Systems Work', href: '/knowledge/how-it-works' },
      { label: 'Market Education', href: '/knowledge/market-education' },
      { label: 'Broker Use Cases', href: '/knowledge/use-cases' },
      { label: 'Updates', href: '/knowledge/updates' },
    ],
  },
];

const HOME_EXTRAS = [
  {
    label: 'Market Lab',
    description: 'Signals, demand history, and comparison insights.',
    href: '/market-lab',
    category: 'Intelligence' as NavCategory,
  },
  {
    label: 'Markets',
    description: 'City-level entry points with history and signals.',
    href: '/markets',
    category: 'Intelligence' as NavCategory,
  },
  {
    label: 'Quality Index',
    description: 'Lead, campaign, page, and agent readiness indicators.',
    href: '/quality-index',
    category: 'Intelligence' as NavCategory,
  },
];

export const HOME_MODULES = [
  ...NAV_ITEMS.map((item) => ({
    label: item.label,
    href: item.href,
    description: item.description,
    category: item.category,
  })),
  ...HOME_EXTRAS,
];

export const FOOTER_PLATFORM_LINKS = NAV_ITEMS.filter((item) => item.href !== '/knowledge').map(
  ({ href, label }) => ({ href, label }),
);

export const FOOTER_KNOWLEDGE_LINKS =
  NAV_ITEMS.find((item) => item.href === '/knowledge')?.mega.work ?? [];
