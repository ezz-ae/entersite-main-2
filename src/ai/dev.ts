'use server';
import { config } from 'dotenv';
config();

// -----------------------------------------------------------------------------
// !! WARNING: HIGH COST POTENTIAL !!
// -----------------------------------------------------------------------------
// Activating AI flows by uncommenting them will result in live calls to the 
// Gemini API, which will incur costs on your Google Cloud account.
//
// PLEASE KEEP FLOWS COMMENTED OUT UNLESS YOU ARE ACTIVELY DEVELOPING AND 
// TESTING A SPECIFIC FEATURE.
// -----------------------------------------------------------------------------

// AI flows can be expensive. Comment out flows that are not actively being developed.
// import '@/ai/flows/suggest-next-blocks.ts';
// import '@/ai/flows/build-chat-assistant.ts';
// import '@/ai/flows/auto-generate-seo-metadata.ts';
// import '@/ai/flows/generate-marketing-copy.ts';
// import '@/ai/flows/generate-ads-from-page-content.ts';
