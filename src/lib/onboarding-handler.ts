'use client';

import { availableTemplates, roadshowTemplate, developerFocusTemplate, partnerLaunchTemplate, fullCompanyTemplate, adsQuickLaunchTemplate } from '@/lib/templates';
import { searchProjects } from '@/lib/project-service';
import { verifyAndFetchAssets } from '@/lib/media-scraper';
import type { SiteTemplate } from './types';

export async function handleOnboarding(data: any, setBrandColor: (color: string) => void): Promise<SiteTemplate> {
    if (data['brand-color']) {
        setBrandColor(data['brand-color']);
    }

    if (data.method === 'prompt' || data.method === 'agent') {
        const prompt = (data['user-prompt'] || "").toLowerCase();
        console.log("Analyzing prompt for Deep Build:", prompt);

        let targetProject: any = null;
        let targetDeveloper = null;

        const projectResults = await searchProjects(prompt);
        if (projectResults.length > 0) {
            targetProject = projectResults[0];
            targetDeveloper = targetProject.developer;
        } else {
            if (prompt.includes('emaar')) targetDeveloper = "Emaar Properties";
            if (prompt.includes('damac')) targetDeveloper = "Damac Properties";
            if (prompt.includes('nakheel')) targetDeveloper = "Nakheel";
            if (prompt.includes('sobha')) targetDeveloper = "Sobha Realty";
        }

        const assets = await verifyAndFetchAssets(targetProject?.name || targetDeveloper || prompt);
        const dynamicBlocks: any[] = [];
        let order = 0;

        const heroData = {
            headline: targetProject ? `Exclusive Offers at \${targetProject.name}` : (data.pageTitle || "Discover Luxury Living"),
            subtext: targetProject ? `Prices starting from \${targetProject.price.label}. Handover \${targetProject.deliveryYear || 'TBA'}.` : "Your trusted partner for premium real estate investments.",
            backgroundImage: assets.heroImages[0],
            ctaText: prompt.includes('whatsapp') ? "WhatsApp Us" : "Register Interest"
        };

        if (prompt.includes('launch') || (targetProject && targetProject.status === 'Pipeline')) {
            dynamicBlocks.push({ type: 'launch-hero', order: order++, data: heroData });
        } else {
            dynamicBlocks.push({ type: 'hero', order: order++, data: heroData });
        }

        if (targetProject) {
            dynamicBlocks.push({ 
                type: 'project-detail', 
                order: order++, 
                data: {
                    projectName: targetProject.name,
                    developer: targetProject.developer,
                    description: targetProject.description.full,
                    imageUrl: assets.galleryImages[0],
                    stats: [
                        { label: "Starting Price", value: targetProject.price.label },
                        { label: "Handover", value: (targetProject.deliveryYear || 'TBA').toString() },
                        { label: "Type", value: "Luxury Residences" }
                    ]
                } 
            });
            
            dynamicBlocks.push({ type: 'gallery', order: order++, data: { images: assets.galleryImages, headline: `Inside \${targetProject.name}` } });
            dynamicBlocks.push({ type: 'floor-plan', order: order++, data: {} });
            dynamicBlocks.push({ type: 'payment-plan', order: order++, data: {} });
        } else {
            const filter = targetDeveloper ? { developer: targetDeveloper } : {};
            dynamicBlocks.push({ 
                type: 'listing-grid', 
                order: order++, 
                data: { 
                    headline: targetDeveloper ? `Latest from \${targetDeveloper}` : "Featured Projects",
                    initialFilter: filter 
                } 
            });
            dynamicBlocks.push({ type: 'developers-list', order: order++, data: {} });
        }

        if (prompt.includes('invest') || prompt.includes('roi')) {
            dynamicBlocks.push({ type: 'roi-calculator', order: order++, data: {} });
        }
        
        dynamicBlocks.push({ type: 'map', order: order++, data: { headline: targetProject ? "Prime Location" : "Explore Our Projects" } });

        if (prompt.includes('whatsapp') || data.siteType === 'whatsapp_only') {
            dynamicBlocks.push({ type: 'cta-grid', order: order++, data: { headline: "Connect Instantly" } });
        } else {
            dynamicBlocks.push({ type: 'cta-form', order: order++, data: { headline: "Register Your Interest" } });
        }
        
        dynamicBlocks.push({ type: 'chat-widget', order: order++, data: { welcomeMessage: targetProject ? `Hi! Ask me anything about \${targetProject.name}.` : "Hi! How can I help you find a property?" } });

        const customTemplate: SiteTemplate = {
            id: `ai-gen-\${Date.now()}`,
            name: targetProject ? targetProject.name : 'Smart Custom Build',
            siteType: 'custom',
            pages: [{
                id: 'home',
                title: 'Home',
                blocks: dynamicBlocks.map((b, i) => ({
                    blockId: `ai-block-\${i}`,
                    type: b.type,
                    order: b.order,
                    data: b.data
                })),
                canonicalListings: [],
                brochureUrl: assets.brochureUrl || "",
                seo: { 
                    title: targetProject ? `\${targetProject.name} | Official Launch` : "Real Estate Portfolio", 
                    description: "Generated by EntreSite Smart", 
                    keywords: [] 
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]
        };
        return customTemplate;

    } else {
        let selectedTemplate = availableTemplates[0];
        if (data['site-type'] === 'roadshow') selectedTemplate = roadshowTemplate;
        else if (data['site-type'] === 'developer') selectedTemplate = developerFocusTemplate;
        else if (data['site-type'] === 'partner') selectedTemplate = partnerLaunchTemplate;
        else if (data['site-type'] === 'company') selectedTemplate = fullCompanyTemplate;
        else if (data['site-type'] === 'landing') selectedTemplate = adsQuickLaunchTemplate;
        
        return selectedTemplate;
    }
}
