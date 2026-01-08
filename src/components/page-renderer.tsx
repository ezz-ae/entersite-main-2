
'use client';

import React from 'react';
import type { SitePage, Block as BlockType } from '@/lib/types';
import { HeroBlock } from './blocks/hero-block';
import { ListingGridBlock } from './blocks/listing-grid-block';
import { CtaFormBlock } from './blocks/cta-form-block';
import { GalleryBlock } from './blocks/gallery-block';
import { FaqBlock } from './blocks/faq-block';
import { TestimonialBlock } from './blocks/testimonial-block';
import { RoadshowBlock } from './blocks/roadshow-block';
import { TeamBlock } from './blocks/team-block';
import { ProjectDetailBlock } from './blocks/project-detail-block';
import { BrochureFormBlock } from './blocks/forms/brochure-form-block';
import { OfferBlock } from './blocks/forms/offer-block';
import { HeroLeadFormBlock } from './blocks/forms/hero-lead-form-block';
import { LeadInterestFormBlock } from './blocks/forms/lead-interest-form-block';
import { FloorPlanBlock } from './blocks/floor-plan-block';
import { FeaturesBlock } from './blocks/features-block';
import { LaunchBlock } from './blocks/launch-block';
import { ListingGridMapBlock } from './blocks/listings/listing-grid-map-block';
import { ChatWidgetBlock } from './blocks/social/chat-widget-block';
import { BlogGridBlock } from './blocks/content/blog-grid-block';
import { MortgageCalculatorBlock } from './blocks/finance/mortgage-calculator-block';
import { PaymentPlanBlock } from './blocks/finance/payment-plan-block';
import { VideoBlock } from './blocks/content/video-block';
import { ContactDetailsBlock } from './blocks/info/contact-details-block';
import { PartnersBlock } from './blocks/content/partners-block';
import { StatsBlock } from './blocks/info/stats-block';
import { NewsletterBlock } from './blocks/forms/newsletter-block';
import { BookingViewingBlock } from './blocks/forms/booking-viewing-block';
import { SplitContentBlock } from './blocks/content/split-content-block';
import { FeaturedListingBlock } from './blocks/listings/featured-listing-block';
import { SearchWithFiltersBlock } from './blocks/search/search-with-filters-block';
import { CityGuideBlock } from './blocks/content/city-guide-block';
import { RoiCalculatorBlock } from './blocks/finance/roi-calculator-block';
import { DevelopersListBlock } from './blocks/content/developers-list-block';
import { LaunchHeroBlock } from './blocks/hero/launch-hero-block';
import { ComingSoonHeroBlock } from './blocks/hero/coming-soon-hero-block';
import { CtaGridBlock } from './blocks/cta/cta-grid-block';
import { BannerCtaBlock } from './blocks/cta/banner-cta-block';
import { MapBlock } from './blocks/map-block';
import { LEAD_CAPTURE_BLOCKS, SiteBlockContext } from './blocks/block-context';

const blockComponents: Record<string, React.ComponentType<any>> = {
  'hero': HeroBlock,
  'listing-grid': ListingGridBlock,
  'cta-form': CtaFormBlock,
  'map': MapBlock,
  'gallery': GalleryBlock,
  'testimonial': TestimonialBlock,
  'faq': FaqBlock,
  'roadshow': RoadshowBlock,
  'team': TeamBlock,
  'project-detail': ProjectDetailBlock,
  'brochure-form': BrochureFormBlock,
  'offer': OfferBlock,
  'hero-lead-form': HeroLeadFormBlock,
  'lead-interest-form': LeadInterestFormBlock,
  'floor-plan': FloorPlanBlock,
  'features': FeaturesBlock,
  'launch': LaunchBlock,
  'listing-grid-map': ListingGridMapBlock,
  'chat-widget': ChatWidgetBlock,
  'blog-grid': BlogGridBlock,
  'mortgage-calculator': MortgageCalculatorBlock,
  'payment-plan': PaymentPlanBlock,
  'video': VideoBlock,
  'contact-details': ContactDetailsBlock,
  'partners': PartnersBlock,
  'stats': StatsBlock,
  'newsletter': NewsletterBlock,
  'booking-viewing': BookingViewingBlock,
  'split-content': SplitContentBlock,
  'featured-listing': FeaturedListingBlock,
  'search-filters': SearchWithFiltersBlock,
  'city-guide': CityGuideBlock,
  'roi-calculator': RoiCalculatorBlock,
  'developers-list': DevelopersListBlock,
  'launch-hero': LaunchHeroBlock,
  'coming-soon-hero': ComingSoonHeroBlock,
  'cta-grid': CtaGridBlock,
  'banner-cta': BannerCtaBlock,
};

const renderBlock = (block: BlockType, context?: SiteBlockContext) => {
  const Component = blockComponents[block.type];
  if (!Component) {
    return null;
  }
  const leadProps = LEAD_CAPTURE_BLOCKS.has(block.type)
    ? {
        tenantId: context?.tenantId,
        projectName: context?.projectName,
        siteId: context?.siteId,
      }
    : {};
  return <Component {...block.data} {...leadProps} />;
};

interface PageRendererProps {
  page: SitePage;
  tenantId?: string;
  projectName?: string;
}

export function PageRenderer({ page, tenantId, projectName }: PageRendererProps) {
  const sortedBlocks = [...page.blocks].sort((a, b) => a.order - b.order);
  const context: SiteBlockContext = {
    tenantId: tenantId || page.tenantId || 'public',
    projectName: projectName || page.title || 'Entrestate Site',
    siteId: page.id,
  };

  return (
    <div className="min-h-screen bg-background relative">
      {sortedBlocks.map((block) => (
        <div key={block.blockId}>
          {renderBlock(block, context)}
        </div>
      ))}
    </div>
  );
}
