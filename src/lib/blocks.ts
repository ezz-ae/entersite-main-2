'use client';

import { Heading1, Text, Image, CheckSquare, List, Map, BarChart, MessageCircle, Users, Sun, Star, Phone } from 'lucide-react';
import type { BlockConfig } from './types';

export const availableBlocks: BlockConfig[] = [
    {
        type: 'hero',
        name: 'Hero Section',
        description: 'Large header section with headline and CTA.',
        category: 'hero',
        icon: Sun,
        defaultData: {
            headline: 'Headline',
            subtext: 'Subtext',
            backgroundImage: '',
            ctaText: 'CTA',
        }
    },
    {
        type: 'launch-hero',
        name: 'Launch Hero',
        description: 'Hero section designed for new property launches.',
        category: 'hero',
        icon: Sun,
        defaultData: {
            headline: 'Headline',
            subtext: 'Subtext',
            backgroundImage: '',
            ctaText: 'CTA',
        }
    },
    {
        type: 'cta-form',
        name: 'Call to Action Form',
        description: 'Lead generation form with high-impact headline.',
        category: 'forms',
        icon: Phone,
        defaultData: {
            headline: 'Headline',
            subtext: 'Subtext',
        }
    },
    {
        type: 'project-detail',
        name: 'Project Details',
        description: 'Detailed showcase of a specific real estate project.',
        category: 'content',
        icon: Text,
        defaultData: {}
    },
    {
        type: 'gallery',
        name: 'Image Gallery',
        description: 'A responsive grid or slider of property images.',
        category: 'content',
        icon: Image,
        defaultData: {
            headline: 'Headline',
        }
    },
    {
        type: 'listing-grid',
        name: 'Listing Grid',
        description: 'Dynamic grid showing multiple property listings.',
        category: 'listings',
        icon: List,
        defaultData: {
             headline: 'Headline',
        }
    },
    {
        type: 'map',
        name: 'Map',
        description: 'Interactive map showing property locations.',
        category: 'content',
        icon: Map,
        defaultData: {
            headline: 'Headline',
        }
    },
    {
        type: 'roi-calculator',
        name: 'ROI Calculator',
        description: 'Investment tool for potential buyers.',
        category: 'finance',
        icon: BarChart,
        defaultData: {}
    },
    {
        type: 'chat-widget',
        name: 'Chat Widget',
        description: 'AI-powered chat assistant for visitors.',
        category: 'ai',
        icon: MessageCircle,
        defaultData: {
            welcomeMessage: 'How can I help you today?',
        }
    },
];

export const getBlockConfig = (type: string): BlockConfig | undefined => {
    return availableBlocks.find(block => block.type === type);
};
