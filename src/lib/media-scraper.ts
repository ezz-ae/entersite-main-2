// This service acts as the "Asset Purification Agent"
// In production, this would be a cloud function running Python/Playwright

export interface ProjectAssets {
    heroImages: string[];
    galleryImages: string[];
    floorPlans: string[];
    brochureUrl?: string;
    videoUrl?: string;
    logoUrl?: string;
    developerName?: string; // Normalized developer name
}

const PORTAL_DOMAINS = ['bayut.com', 'propertyfinder.ae', 'dubizzle.com'];

// System assets representing "Official Developer Media"
const SYSTEM_ASSETS: Record<string, ProjectAssets> = {
    'emaar': {
        heroImages: ['https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/U10759_EXT_ZED739.webp?alt=media&token=be7418eb-0f7f-4df3-8c89-8fa5b070a7aa'], 
        galleryImages: [
            'https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/U10759_EXT_ZED739.webp?alt=media&token=be7418eb-0f7f-4df3-8c89-8fa5b070a7aa'
        ],
        floorPlans: ['https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/logo_white.png?alt=media&token=c606a461-1e96-4115-8930-b530053982e0'],
        logoUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/logo_white.png?alt=media&token=c606a461-1e96-4115-8930-b530053982e0',
        developerName: 'Emaar Properties'
    },
    'damac': {
        heroImages: ['https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/U10759_EXT_ZED739.webp?alt=media&token=be7418eb-0f7f-4df3-8c89-8fa5b070a7aa'],
        galleryImages: ['https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/U10759_EXT_ZED739.webp?alt=media&token=be7418eb-0f7f-4df3-8c89-8fa5b070a7aa'],
        floorPlans: [],
        logoUrl: 'https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/logo_white.png?alt=media&token=c606a461-1e96-4115-8930-b530053982e0',
        developerName: 'Damac Properties'
    }
};

export const verifyAndFetchAssets = async (projectName: string, currentImages: string[] = []): Promise<ProjectAssets> => {
    // 1. Check for Watermarks / Portal Links
    const hasWatermark = currentImages.some(url => PORTAL_DOMAINS.some(domain => url.includes(domain)));
    
    // 2. Extract Developer Name from Project Title if missing
    let developer = "emaar";
    const lowerName = projectName.toLowerCase();
    
    if (lowerName.includes('emaar')) developer = 'emaar';
    else if (lowerName.includes('damac')) developer = 'damac';
    else if (lowerName.includes('sobha')) developer = 'sobha';

    // 3. If watermarked or known developer, fetch system-verified assets
    if (hasWatermark || SYSTEM_ASSETS[developer]) {
        return SYSTEM_ASSETS[developer] || SYSTEM_ASSETS['emaar'];
    }

    // 4. If no issues, return existing
    if (currentImages.length > 0) {
        return {
            heroImages: [currentImages[0]],
            galleryImages: currentImages.slice(1),
            floorPlans: [],
            developerName: developer.toUpperCase()
        };
    }

    // Default system fallback
    return SYSTEM_ASSETS['emaar'];
};
