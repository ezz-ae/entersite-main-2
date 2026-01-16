import { ProjectData } from '@/lib/types';
import type { Metadata } from 'next';
import { HomeClient } from './home-client';
import { loadInventoryProjects } from '@/server/inventory';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entrestate | Real Estate Platform for Brokers',
  description:
    'Launch listing pages, capture leads, and run campaigns in one place. Built for UAE brokers and teams.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Entrestate | Real Estate Platform for Brokers',
    description:
      'Launch listing pages, capture leads, and run campaigns in one place. Built for UAE brokers and teams.',
    url: '/',
  },
};

async function fetchInitialProjects(): Promise<ProjectData[]> {
  try {
    return await loadInventoryProjects(12);
  } catch (error) {
    console.error('[HomePage] Failed to fetch inventory_projects', error);
    return [];
  }
}

export default async function Page() {
  const initialProjects = await fetchInitialProjects();
  return <HomeClient initialProjects={initialProjects} />;
}
