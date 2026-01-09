import type { Metadata } from 'next';
import { loadInventoryProjectById } from '@/server/inventory';

type Params = {
  params: { projectId: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const projectId = params.projectId;
  const project = await loadInventoryProjectById(projectId);

  if (!project) {
    return {
      title: 'Project Details | Market Feed | Entrestate',
      description: 'Project details, pricing, and availability.',
      alternates: {
        canonical: `/discover/${encodeURIComponent(projectId)}`,
      },
      openGraph: {
        title: 'Project Details | Market Feed | Entrestate',
        description: 'Project details, pricing, and availability.',
        url: `/discover/${encodeURIComponent(projectId)}`,
      },
    };
  }

  const locationLabel = [project.location?.area, project.location?.city].filter(Boolean).join(', ');
  const description =
    project.description?.short ||
    `Project details, pricing, and availability in ${locationLabel || 'UAE'}.`;

  return {
    title: `${project.name} | Market Feed | Entrestate`,
    description,
    alternates: {
      canonical: `/discover/${encodeURIComponent(projectId)}`,
    },
    openGraph: {
      title: `${project.name} | Market Feed | Entrestate`,
      description,
      url: `/discover/${encodeURIComponent(projectId)}`,
      images: project.images?.length
        ? [
            {
              url: project.images[0],
              alt: project.name,
            },
          ]
        : undefined,
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
