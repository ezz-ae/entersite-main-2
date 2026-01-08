
import type { SitePage, Block } from './types';

export interface SiteTemplate {
  id: string;
  name: string;
  siteType: 'roadshow' | 'developer-focus' | 'partner-launch' | 'full-company' | 'freelancer' | 'map-focused' | 'ads-launch' | 'ready-made' | 'agent-portfolio';
  pages: SitePage[];
  thumbnail?: string;
  description?: string;
}

const defaultBlocks: Record<string, Omit<Block, 'blockId' | 'order'>> = {
  hero: {
    type: 'hero',
    data: {
      headline: "Discover Unparalleled Luxury",
      subtext: "Explore our exclusive collection of premium properties.",
      ctaText: "Explore Properties",
      backgroundImage: 'https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&q=80&w=2000'
    },
  },
  'launch-hero': {
      type: 'launch-hero',
      data: {
          headline: "The Future of Living Arrives Soon",
          backgroundImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000'
      }
  },
  'coming-soon-hero': {
      type: 'coming-soon-hero',
      data: {
          headline: "Something Extraordinary is Coming",
          backgroundImage: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000'
      }
  },
  'hero-lead-form': {
    type: 'hero-lead-form',
    data: {
        headline: "Find Your Dream Home",
        backgroundImage: 'https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&q=80&w=2000'
    }
  },
  'search-filters': {
      type: 'search-filters',
      data: {
          headline: "Search Properties"
      }
  },
  'listing-grid': {
    type: 'listing-grid',
    data: {
      headline: "Featured Properties",
      subtext: "Handpicked listings that define luxury living.",
      projects: [], // Default projects, will be populated by createBlock
    },
  },
  'listing-grid-map': {
    type: 'listing-grid-map',
    data: {
        headline: "Explore Projects on Map",
        projects: [], // Default, will be populated
    }
  },
  'featured-listing': {
      type: 'featured-listing',
      data: {
          headline: "Property of the Month",
          listingTitle: "Luxury Penthouse with Sea Views",
          price: "AED 15,500,000",
          location: "Palm Jumeirah, Dubai",
          listingImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600'
      }
  },
  'cta-form': {
    type: 'cta-form',
    data: {
      headline: "Schedule a Private Viewing",
      subtext: "Our experts are ready to assist you.",
    },
  },
  'cta-grid': {
      type: 'cta-grid',
      data: {
          headline: "Take the Next Step"
      }
  },
  'banner-cta': {
      type: 'banner-cta',
      data: {
          headline: "Limited Availability"
      }
  },
  'newsletter': {
      type: 'newsletter',
      data: {
          headline: "Stay Ahead of the Market"
      }
  },
  map: {
    type: 'map',
    data: {
        headline: "Explore the Location"
    }
  },
  gallery: {
      type: 'gallery',
      data: {
          headline: 'Project Gallery',
          images: [
            'https://images.unsplash.com/photo-1582407947304-fd86f028f3a6?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000'
          ]
      }
  },
  testimonial: {
      type: 'testimonial',
      data: {
          headline: 'What Our Clients Say'
      }
  },
  faq: {
      type: 'faq',
      data: {
          headline: 'Frequently Asked Questions',
          subtext: "Find answers to common questions about our properties and services.",
          faqItems: [
              { question: "What types of properties do you offer?", answer: "We offer a wide range of properties including luxury villas, modern apartments, and exclusive townhouses in prime locations." },
          ]
      }
  },
  roadshow: {
      type: 'roadshow',
      data: {
          eventName: "Dubai Property Show 2025",
          city: "London",
          date: "October 15-17, 2025",
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-17e6fc48db44?auto=format&fit=crop&q=80&w=2000'
      }
  },
  team: {
      type: 'team',
      data: {
          headline: "Meet Our Experts"
      }
  },
  'project-detail': {
      type: 'project-detail',
      data: {
          projectName: "Elysian Residence",
          developer: "Mfour Development",
          description: "Elysian Residence redefines urban sophistication in Jumeirah Garden City.",
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'
      }
  },
  'brochure-form': {
      type: 'brochure-form',
      data: {
          brochureTitle: "Investor Guide"
      }
  },
  offer: {
      type: 'offer',
      data: {
          headline: "Exclusive Offer"
      }
  },
  'floor-plan': {
      type: 'floor-plan',
      data: {
          headline: "Floor Plans"
      }
  },
  features: {
      type: 'features',
      data: {
          headline: "Key Features"
      }
  },
  launch: {
      type: 'launch',
      data: {
          headline: "Grand Launch"
      }
  },
  'chat-widget': {
      type: 'chat-widget',
      data: {
          agentName: "Sarah - Support"
      }
  },
  'blog-grid': {
      type: 'blog-grid',
      data: {
          headline: "Market Insights"
      }
  },
  'mortgage-calculator': {
      type: 'mortgage-calculator',
      data: {
          headline: "Mortgage Calculator"
      }
  },
  'roi-calculator': {
      type: 'roi-calculator',
      data: {
          headline: "Calculate ROI"
      }
  },
  'payment-plan': {
      type: 'payment-plan',
      data: {
          headline: "Flexible Payment Plan"
      }
  },
  'video': {
      type: 'video',
      data: {
          headline: "Watch Video Tour",
          videoThumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000'
      }
  },
  'split-content': {
      type: 'split-content',
      data: {
          headline: "Experience Waterfront Living"
      }
  },
  'contact-details': {
      type: 'contact-details',
      data: {
          headline: "Contact Us"
      }
  },
  'partners': {
      type: 'partners',
      data: {
          headline: "Our Partners"
      }
  },
  'developers-list': {
      type: 'developers-list',
      data: {
          headline: "Top Developers"
      }
  },
  'stats': {
      type: 'stats',
      data: {
          headline: "Our Achievements"
      }
  },
  'city-guide': {
      type: 'city-guide',
      data: {
          headline: "Why Invest in Dubai?"
      }
  }
};

const createBlock = (type: keyof typeof defaultBlocks, order: number, context?: { overrides?: any, initialFilter?: Record<string, any> }): Block => {
    const blockData = JSON.parse(JSON.stringify(defaultBlocks[type]));

    if (context?.initialFilter && (type === 'listing-grid' || type === 'listing-grid-map')) {
        blockData.data.initialFilter = context.initialFilter;
    }

    if (context?.overrides) {
        Object.assign(blockData.data, context.overrides);
    }

    return {
        blockId: `${blockData.type}-${Date.now()}-${Math.random()}`,
        type: type,
        order: order,
        data: blockData.data,
    }
}

const createPage = (
    id: string,
    title: string,
    blocks: (keyof typeof defaultBlocks | { type: keyof typeof defaultBlocks, overrides?: any, initialFilter?: Record<string, any> })[],
    _context?: Record<string, any>
  ): SitePage => {
    return {
        id: `page-${id}`,
        title: title,
        blocks: blocks.map((blockDef, index) => {
            const type = typeof blockDef === 'string' ? blockDef : blockDef.type;
            const overrides = typeof blockDef === 'string' ? {} : blockDef.overrides;
            const initialFilter = typeof blockDef === 'string' ? undefined : blockDef.initialFilter;
            return createBlock(type, index + 1, { overrides, initialFilter });
        }),
        canonicalListings: [],
        brochureUrl: "",
        seo: {
            title: `${title} | EntreSite AI`,
            description: `This is the ${title} page.`,
            keywords: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}


// --- BASE TEMPLATES (Existing but now use specific project data helpers) ---

export const roadshowTemplate: SiteTemplate = {
  id: 'template-roadshow',
  name: 'Dubai Roadshow Page',
  siteType: 'roadshow',
  pages: [
    createPage('home', 'Event Details', [
        'roadshow', 
        'banner-cta', 
        'split-content',
        { type: 'listing-grid', initialFilter: { city: 'Dubai' } },
        'brochure-form', 
        'cta-form', 
        'faq', 
        'chat-widget'
    ], { city: 'Dubai' }),
  ],
};

export const developerFocusTemplate: SiteTemplate = {
    id: 'template-dev-focus',
    name: 'Abu Dhabi Developer',
    siteType: 'developer-focus',
    pages: [
      createPage('home', 'Home', [
          'hero',
          'stats',
          { type: 'listing-grid', initialFilter: { city: 'Abu Dhabi', developer: 'Bloom Holding' } },
          { type: 'project-detail', overrides: { projectName: 'Marbella Residences', developer: 'Bloom Holding' } },
          'features', 
          'payment-plan', 
          'team', 
          'newsletter', 
          'chat-widget'
      ], { city: 'Abu-dhabi' }),
      createPage('about', 'About Us', ['hero', 'split-content', 'team', 'video', 'partners']),
      createPage('contact', 'Contact', ['contact-details', 'cta-form']),
    ],
};

export const partnerLaunchTemplate: SiteTemplate = {
    id: 'template-partner-launch',
    name: 'RAK Partner Launch',
    siteType: 'partner-launch',
    pages: [
        createPage('home', 'Launch Home', [
            { type: 'launch-hero', overrides: { backgroundImage: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&q=80&w=2000' } },
            { type: 'featured-listing', overrides: { headline: 'Rosso Bay Residences', listingTitle: 'Rosso Bay Residences', location: 'Ras Al Khaimah', price: 'From AED 1.9M' } },
            { type: 'listing-grid', initialFilter: { city: 'Ras Al Khaimah' } }, 
            'offer', 'map', 'partners', 'cta-grid', 'chat-widget'
        ], { city: 'Ras-al-khaimah' }),
    ]
};

export const fullCompanyTemplate: SiteTemplate = {
    id: 'full-company',
    name: 'Full Real Estate Company',
    siteType: 'full-company',
    pages: [
        createPage('home', 'Home', [
            'hero-lead-form', 'search-filters', 'partners',
            { type: 'listing-grid-map', initialFilter: { city: 'Dubai' } },
            { type: 'featured-listing', overrides: { headline: 'SkyScape Avenue', listingTitle: 'SkyScape Avenue', location: 'Dubai', price: 'From AED 2.1M' } },
            'developers-list', 'city-guide', 'features', 'blog-grid', 'team', 'newsletter', 'chat-widget'
        ], { city: 'Dubai' }),
        createPage('about', 'About Us', ['hero', 'stats', 'team', 'contact-details']),
        createPage('projects', 'Projects', [{ type: 'listing-grid', initialFilter: { city: 'Dubai' } }, 'mortgage-calculator', 'roi-calculator']),
        createPage('contact', 'Contact Us', ['contact-details', 'cta-form']),
    ]
};

export const freelancerTemplate: SiteTemplate = {
    id: 'template-freelancer',
    name: 'Freelancer Agent',
    siteType: 'freelancer',
    pages: [
        createPage('home', 'Home', [
            'hero', 
            { type: 'listing-grid', initialFilter: { city: 'Dubai' } },
            'blog-grid', 'team', 'testimonial', 'cta-form', 'chat-widget'
        ], { city: 'Dubai' }),
    ]
};

export const mapFocusedTemplate: SiteTemplate = {
    id: 'template-map-focused',
    name: 'Map-First Search',
    siteType: 'map-focused',
    pages: [
        createPage('home', 'Map Search', [
            'search-filters',
            { type: 'listing-grid-map', initialFilter: { city: 'Dubai' } },
            { type: 'listing-grid', initialFilter: { city: 'Dubai' } },
            'chat-widget'
        ], { city: 'Dubai' }),
    ]
};

export const adsQuickLaunchTemplate: SiteTemplate = {
    id: 'template-ads-launch',
    name: 'Landing Page + Ads',
    siteType: 'ads-launch',
    pages: [
        createPage('home', 'Landing Page', [
            { type: 'coming-soon-hero', overrides: { backgroundImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000' } },
            { type: 'project-detail', overrides: { projectName: 'Orbis Tower D', developer: 'Prestige Developments' } },
            'video', 'floor-plan', 'payment-plan', 'offer', 'brochure-form', 'chat-widget'
        ], { city: 'Dubai' }),
    ]
};

// --- NEW AGENT PORTFOLIO TEMPLATES (Directly connected to projects) ---

export const luxuryAgentTemplate: SiteTemplate = {
  id: "luxury_agent_portfolio",
  name: "Luxury Agent Portfolio",
  siteType: "agent-portfolio",
  description: "A premium, black-and-gold showcase site for agents targeting high-net-worth buyers.",
  pages: [
    createPage("home", "Luxury Portfolio", [
      {
        type: "hero",
        overrides: {
          headline: "Representing Dubai's Finest Estates",
          subtext: "Discreet. Dedicated. Unparalleled Results.",
          backgroundImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2000",
        },
      },
      { type: "listing-grid", initialFilter: { city: "Dubai" }, overrides: { headline: "Signature Listings" } },
      { type: "testimonial", overrides: { headline: "Client Accolades" } },
      "team",
      "cta-form"
    ])
  ]
};

export const offPlanSpecialistTemplate: SiteTemplate = {
  id: "offplan_specialist_page",
  name: "Off-Plan Specialist Page",
  siteType: "agent-portfolio",
  description: "A dedicated funnel for agents selling new-launch off-plan projects.",
  pages: [
    createPage("home", "Off-Plan Specialist", [
      {
        type: "launch-hero",
        overrides: {
          headline: "Exclusive Access to Dubai's Future Landmarks",
          subtext: "Get priority allocation and developer offers before the public.",
        },
      },
      { type: "listing-grid", initialFilter: { city: "Dubai", developer: "Emaar" }, overrides: { headline: "Latest Emaar Launches" } },
      "payment-plan",
      "offer",
      "brochure-form"
    ])
  ]
};

export const internationalBuyerTemplate: SiteTemplate = {
  id: "international_buyer_landing",
  name: "International Buyer Landing Page",
  siteType: "agent-portfolio",
  description: "A trust-building page for overseas investors with FAQ, guides, and WhatsApp CTA.",
  pages: [
    createPage("home", "Invest in Dubai", [
      {
        type: "hero",
        overrides: {
          headline: "Invest in Dubai Real Estate From Anywhere",
          subtext: "Secure, high-yield property investments with expert guidance and seamless processing.",
        },
      },
      "city-guide",
      "stats",
      "faq",
      {
        type: "cta-form", overrides: {
          headline: "Request a Free Consultation",
          subtext: "Our investment advisors are ready to help you in your preferred time zone."
        }
      },
      "chat-widget",
    ])
  ]
};

export const whatsappLeadTemplate: SiteTemplate = {
  id: "whatsapp_only_lead_page",
  name: "WhatsApp-Only Lead Page",
  siteType: "agent-portfolio",
  description: "Ultra-lightweight page designed purely to convert into WhatsApp chats.",
  pages: [
    createPage("home", "Quick Inquiry", [
      {
        type: 'split-content', overrides: {
          headline: "Questions? Get Instant Answers on WhatsApp",
          subtext: "Click the button to start a chat with a property expert. No forms, no waiting.",
          ctaText: "Chat on WhatsApp",
        }
      },
      { type: 'featured-listing', overrides: { headline: '310 Riverside Crescent', listingTitle: '310 Riverside Crescent', location: 'Dubai', price: 'From AED 1.7M' } },
    ])
  ]
};


export const offPlanBrokerageWebsite: SiteTemplate = {
    id: 'offplan_brokerage_website',
    name: 'Off-Plan Brokerage Website',
    siteType: 'agent-portfolio',
    description: 'A comprehensive portal for new developments and investment opportunities.',
    pages: [
        createPage('home', 'Off-Plan Deals', [
            { type: 'hero-lead-form', overrides: { headline: "Dubai's Hottest Off-Plan Investments", subtext: "Exclusive access to pre-launch and new development inventory." } },
            { type: 'developers-list', overrides: { headline: "Leading Developers" } },
            { type: 'listing-grid', initialFilter: { city: 'Dubai' }, overrides: { headline: "Featured New Launches" } },
            { type: 'city-guide', overrides: { city: "Dubai", headline: "Why Invest in Dubai Off-Plan?" } },
            'roi-calculator',
            'newsletter',
            'chat-widget'
        ], { city: 'Dubai' })
    ]
};

export const damacIslandsLeadGen: SiteTemplate = {
    id: 'damac_islands_lead_gen',
    name: 'Damac Islands Lead Gen',
    siteType: 'ads-launch',
    description: "High-converting landing page for Damac's new island projects.",
    pages: [
        createPage('home', 'Damac Islands', [
            { type: 'launch-hero', overrides: { headline: "Discover Damac Islands", subtext: "Your private sanctuary awaits. Launching soon.", launchDate: "Dec 2025" } },
            { type: 'video', overrides: { headline: "The Damac Islands Experience" } },
            { type: 'project-detail', overrides: { projectName: "Selene Beach Residences", developer: "Damac Properties", description: "Ultra-luxury seafront residences on Damac Islands.", headline: "Azure 2 Residences" } },
            { type: 'floor-plan', overrides: { headline: "Island Home Layouts" } },
            { type: 'payment-plan', overrides: { headline: "Exclusive Payment Offer" } },
            { type: 'brochure-form', overrides: { brochureTitle: "Damac Islands Brochure" } },
            'cta-form',
            'chat-widget'
        ], { city: 'Umm-al-quwain' })
    ]
};

export const listingPortalMarketData: SiteTemplate = {
    id: 'listing_portal_market_data',
    name: 'Listing Portal',
    siteType: 'map-focused',
    description: 'A comprehensive property search engine with live market data.',
    pages: [
        createPage('home', 'Property Search', [
            'search-filters',
            { type: 'listing-grid-map', initialFilter: {} },
            { type: 'roi-calculator', overrides: { headline: "Estimate Your Investment Return" } },
            { type: 'blog-grid', overrides: { headline: "Market Trends & Analysis" } },
            'chat-widget'
        ], { city: 'Dubai' })
    ]
};

export const palmJebelAliLandingPage: SiteTemplate = {
    id: 'palm_jebel_ali_landing_page',
    name: 'Palm Jebel Ali',
    siteType: 'ads-launch',
    description: 'High-impact landing page for Nakheel\'s iconic Palm Jebel Ali project.',
    pages: [
        createPage('home', 'Palm Jebel Ali', [
            { type: 'hero', overrides: { headline: "Palm Jebel Ali: A New Global Landmark", subtext: "Experience unparalleled luxury and a redefined waterfront lifestyle.", backgroundImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000' } },
            { type: 'split-content', overrides: { headline: "The Vision of a New City", subtext: "Double the size of Palm Jumeirah, offering vast expanses of luxury living.", image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000' } },
            { type: 'gallery', overrides: { headline: "Masterplan & Lifestyle", images: ['https://images.unsplash.com/photo-1582407947304-fd86f028f3a6?auto=format&fit=crop&q=80&w=1000', 'https://images.unsplash.com/photo-1600596542815-275084988866?auto=format&fit=crop&q=80&w=1000'] } },
            { type: 'offer', overrides: { headline: "Exclusive Pre-Booking Access", subtext: "Secure your plot in this iconic development with priority registration." } },
            'cta-form',
            'chat-widget'
        ], { city: 'Dubai' })
    ]
};

export const dubaiPropertiesRoadshow: SiteTemplate = {
    id: 'dubai_properties_roadshow',
    name: 'Dubai Properties Roadshow',
    siteType: 'roadshow',
    description: 'Event registration page for international investor roadshows.',
    pages: [
        createPage('home', 'Global Investor Event', [
            { type: 'roadshow', overrides: { eventName: "Dubai Properties Global Roadshow", city: "London", date: "Dec 1-3, 2025", venue: "The Dorchester, London" } },
            { type: 'featured-listing', overrides: { headline: "Exclusive Investment Opportunity", listingTitle: "SkyScape Avenue", location: "Dubai", price: "From AED 2.1M" } },
            { type: 'city-guide', overrides: { headline: "Why Invest in Dubai?", city: "Dubai" } },
            'partners',
            'cta-form',
            'chat-widget'
        ], { city: 'Dubai' })
    ]
};


export const availableTemplates: SiteTemplate[] = [
    // New Agent Portfolio Templates
    luxuryAgentTemplate,
    offPlanSpecialistTemplate,
    internationalBuyerTemplate,
    whatsappLeadTemplate,

    // Requested Data-Rich Templates
    offPlanBrokerageWebsite,
    damacIslandsLeadGen,
    listingPortalMarketData,
    palmJebelAliLandingPage,
    dubaiPropertiesRoadshow,

    // Classic Templates
    roadshowTemplate,
    developerFocusTemplate,
    partnerLaunchTemplate,
    fullCompanyTemplate,
    freelancerTemplate,
    mapFocusedTemplate,
    adsQuickLaunchTemplate,
];
