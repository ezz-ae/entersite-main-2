import { ModuleShell } from '@/components/module-shell';

const toTitleCase = (value: string) =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const formatSlugTitle = (slug: string[] | string) => {
  if (Array.isArray(slug)) {
    return slug.map(toTitleCase).join(' / ');
  }
  return toTitleCase(slug);
};

type ModulePlaceholderProps = {
  module: string;
  description: string;
  homeHref: string;
  title?: string;
};

export function ModulePlaceholder({
  module,
  description,
  homeHref,
  title,
}: ModulePlaceholderProps) {
  return (
    <ModuleShell
      title={title || module}
      description={description}
      actions={[{ label: `Back to ${module}`, href: homeHref, variant: 'outline' }]}
    />
  );
}
