'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const availableBlocks = [
  // --- Hero & Layout ---
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'A large, attention-grabbing section with a headline and CTA.',
  },
  {
    type: 'launch-hero',
    name: 'Launch Hero',
    description: 'High-impact hero for new project launches with countdown.',
  },
  {
    type: 'coming-soon-hero',
    name: 'Coming Soon Hero',
    description: 'Minimalist teaser hero for unreleased projects.',
  },
  {
    type: 'split-content',
    name: 'Split Content',
    description: 'Image and text side-by-side layout.',
  },

  // --- Listings & Projects ---
  {
    type: 'listing-grid',
    name: 'Listing Grid',
    description: 'A grid to showcase multiple properties.',
  },
  {
    type: 'listing-grid-map',
    name: 'Listings + Map',
    description: 'Interactive map alongside a listing grid.',
  },
  {
    type: 'featured-listing',
    name: 'Featured Listing',
    description: 'Highlight a single property with large visuals.',
  },
  {
    type: 'project-detail',
    name: 'Project Detail',
    description: 'A comprehensive detail view for a single project.',
  },
  {
    type: 'trending-projects',
    name: 'Trending Projects',
    description: 'Carousel of popular properties.',
  },
  {
    type: 'floor-plan',
    name: 'Floor Plans',
    description: 'Display floor plans with tabbed navigation.',
  },
  {
    type: 'features',
    name: 'Project Features',
    description: 'Highlight key amenities and features.',
  },
  
  // --- Data & Maps ---
  {
    type: 'dubai-map',
    name: 'Dubai Map Areas',
    description: 'Interactive map highlighting key investment zones.',
  },
  {
    type: 'area-analysis',
    name: 'Area Analysis',
    description: 'Market data (ROI, Yield) for a specific location.',
  },
  {
    type: 'city-guide',
    name: 'City Guide',
    description: 'Information about a city like Dubai or Sharjah.',
  },
  
  // --- Forms & Leads ---
  {
    type: 'hero-lead-form',
    name: 'Hero + Lead Form',
    description: 'Hero section with an embedded lead capture form.',
  },
  {
    type: 'cta-form',
    name: 'Contact Form',
    description: 'Standard inquiry form.',
  },
  {
    type: 'lead-interest-form',
    name: 'Lead Interest Form',
    description: 'Multi-step qualification with OTP verification.',
  },
  {
    type: 'booking-viewing',
    name: 'Book Viewing',
    description: 'Calendar scheduler for property tours.',
  },
  {
    type: 'brochure-form',
    name: 'Brochure Download',
    description: 'Lead capture form to download a brochure.',
  },
  {
    type: 'offer',
    name: 'Special Offer',
    description: 'Promote a limited-time deal or payment plan.',
  },
  {
    type: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Simple form to subscribe to email updates.',
  },
  {
    type: 'cta-grid',
    name: 'Action Grid',
    description: 'Grid of actions like Book Viewing, Download Brochure.',
  },
  {
    type: 'banner-cta',
    name: 'Banner CTA',
    description: 'Full-width banner for urgent calls to action.',
  },

  // --- Social & Trust ---
  {
    type: 'instagram-feed',
    name: 'Instagram Feed',
    description: 'Grid of latest social media posts.',
  },
  {
    type: 'google-reviews',
    name: 'Google Reviews',
    description: 'Carousel of 5-star customer reviews.',
  },
  {
    type: 'testimonial',
    name: 'Testimonials',
    description: 'Showcase client reviews and feedback.',
  },
  {
    type: 'partners',
    name: 'Partners Logo Grid',
    description: 'Display logos of partners or developers.',
  },
  {
    type: 'developers-list',
    name: 'Top Developers',
    description: 'Grid of developer profiles and logos.',
  },
  {
    type: 'stats',
    name: 'Statistics',
    description: 'Showcase key numbers and achievements.',
  },
  
  // --- Media & Tools ---
  {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'A gallery to showcase project images.',
  },
  {
    type: 'video',
    name: 'Video Tour',
    description: 'Embed a video tour or promotional video.',
  },
  {
    type: 'chat-widget',
    name: 'Chat Widget',
    description: 'Floating chat button for WhatsApp or Smart Assistant.',
  },
  {
    type: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Interactive tool for estimating monthly payments.',
  },
  {
    type: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Tool to estimate return on investment.',
  },
  {
    type: 'payment-plan',
    name: 'Payment Plan',
    description: 'Visual breakdown of the payment milestones.',
  },
  
  // --- Other ---
  {
    type: 'launch',
    name: 'Launch Event',
    description: 'Teaser section for a new project launch.',
  },
  {
    type: 'roadshow',
    name: 'Roadshow Event',
    description: 'Promote an upcoming real estate event or exhibition.',
  },
  {
    type: 'team',
    name: 'Team / Agents',
    description: 'Showcase your team members or top agents.',
  },
  {
    type: 'blog-grid',
    name: 'Blog / Insights',
    description: 'Grid of latest news or blog posts.',
  },
  {
    type: 'faq',
    name: 'FAQ',
    description: 'An accordion-style FAQ section.',
  },
  {
    type: 'contact-details',
    name: 'Contact Details',
    description: 'Detailed contact info section with map.',
  },
  {
    type: 'search-filters',
    name: 'Advanced Search',
    description: 'Search bar with advanced filters for properties.',
  },
];

interface BlockGalleryProps {
  onSelectBlock: (blockType: string) => void;
}

export function BlockGallery({ onSelectBlock }: BlockGalleryProps) {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="grid grid-cols-2 gap-2">
        {availableBlocks.map((block) => (
          <div 
            key={block.type} 
            className="cursor-pointer hover:bg-accent p-3 rounded-lg border transition-all hover:border-primary/50 group"
            onClick={() => onSelectBlock(block.type)}
          >
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">{block.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{block.description}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
