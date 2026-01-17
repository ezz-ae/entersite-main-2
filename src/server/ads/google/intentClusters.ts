
import { z } from 'zod';

export const IntentClusterSchema = z.object({
  name: z.string(),
  weight: z.number().min(0).max(1),
});

export type IntentCluster = z.infer<typeof IntentClusterSchema>;

export interface SearchTermRow {
  text: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export interface IntentClusterInput {
  landingPageUrl: string;
  unitType: string;
}

export async function getIntentClusters(
  // input: IntentClusterInput // Input not used in V1 mock
): Promise<IntentCluster[]> {
  // In mock mode, generate cluster weights from landingPageUrl + unitType.
  // In real mode: clusters derived from search terms report (TODO).
  return [
    { name: 'Payment Plan Queries', weight: Math.random() },
    { name: 'Developer Search', weight: Math.random() },
    { name: 'Area + Price', weight: Math.random() },
    { name: 'Ready-to-move', weight: Math.random() },
    { name: 'Off-plan', weight: Math.random() },
    { name: 'Studio/1BR', weight: Math.random() },
  ].map(c => ({...c, weight: parseFloat(c.weight.toFixed(2))})).sort((a,b) => b.weight - a.weight);
}

export function deriveIntentClusters(rows: SearchTermRow[]): IntentCluster[] {
  const clusters: Record<string, number> = {};
  let totalWeight = 0;

  for (const row of rows) {
    const text = row.text.toLowerCase();
    let clusterName = 'General Interest';
    
    // Deterministic Heuristic Classification
    if (text.includes('rent') || text.includes('lease')) {
      clusterName = 'Rental (Negative)';
    } else if (text.includes('developer') || text.includes('emaar') || text.includes('damac') || text.includes('sobha')) {
      clusterName = 'Developer Brand';
    } else if (text.includes('price') || text.includes('cost') || text.includes('payment') || text.includes('installment')) {
      clusterName = 'Price & Payment';
    } else if (text.includes('invest') || text.includes('roi') || text.includes('yield') || text.includes('capital')) {
      clusterName = 'Investment';
    } else if (text.includes('floor') || text.includes('plan') || text.includes('layout') || text.includes('size')) {
      clusterName = 'Floor Plans';
    } else if (text.includes('amenities') || text.includes('pool') || text.includes('gym') || text.includes('view')) {
      clusterName = 'Amenities';
    } else if (text.includes('location') || text.includes('map') || text.includes('where') || text.includes('near')) {
      clusterName = 'Location';
    } else if (text.includes('buy') || text.includes('sale') || text.includes('own') || text.includes('ready')) {
      clusterName = 'Purchase Intent';
    }

    // Weight formula: Clicks are high intent, Conversions are max intent
    const weight = row.impressions + (row.clicks * 10) + (row.conversions * 100);
    
    clusters[clusterName] = (clusters[clusterName] || 0) + weight;
    totalWeight += weight;
  }

  return Object.entries(clusters)
    .map(([name, score]) => ({
      name,
      weight: totalWeight > 0 ? parseFloat((score / totalWeight).toFixed(2)) : 0
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);
}
