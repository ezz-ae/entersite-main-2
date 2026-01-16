// Centralized registry of high-quality, stable Unsplash images for Real Estate
// These IDs are selected for their premium look and reliability.

export const SAFE_IMAGES = {
  hero: [
    "https://images.unsplash.com/photo-1600596542815-275084988866?auto=format&fit=crop&q=80&w=2000", // Modern Villa with Pool
    "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&q=80&w=2000", // Dubai Marina Skyline / High-rise
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000", // Luxury Interior Living Room
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2000", // Modern Mansion Exterior
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000", // Clean Modern Home
  ],
  interiors: [
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=1200", // Minimalist Living Room
    "https://images.unsplash.com/photo-1556912173-3db9963f6f27?auto=format&fit=crop&q=80&w=1200", // Modern Kitchen
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200", // Luxury Bedroom
    "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200", // Bathroom
  ],
  commercial: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", // Modern Office
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200", // Glass Skyscraper
  ],
  avatars: [
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400", // Professional Man
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", // Professional Woman
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400", // Professional Man 2
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400", // Professional Woman 2
  ],
  logos: {
    emaar: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Emaar_Properties_logo.svg/2560px-Emaar_Properties_logo.svg.png",
    damac: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Damac_Properties_Logo.jpg/1200px-Damac_Properties_Logo.jpg",
    nakheel: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Nakheel_Logo.svg/1200px-Nakheel_Logo.svg.png",
  },
  floorplans: [
    "https://images.adsttc.com/media/images/5e5e/34c7/6ee6/7e3b/0900/017c/large_jpg/02_Floor_Plan.jpg",
  ],
  maps: {
    google: "https://maps.googleapis.com/maps/api/staticmap?center=Dubai&zoom=11&size=600x400&maptype=roadmap&markers=color:red%7Clabel:D%7CDubai&style=feature:all|element:labels|visibility:off&style=feature:road|element:geometry|color:0x303030&style=feature:landscape|element:geometry|color:0x202020&style=feature:water|element:geometry|color:0x101010&key=YOUR_API_KEY",
  }
};

export const getRandomImage = (category: keyof typeof SAFE_IMAGES) => {
  const images = SAFE_IMAGES[category];
  // @ts-ignore
  return images[Math.floor(Math.random() * images.length)];
};
