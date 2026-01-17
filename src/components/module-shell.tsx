import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ModuleAction = {
  label: string;
  href: string;
  variant?: 'default' | 'secondary' | 'outline';
};

type ModuleShellProps = {
  title: string;
  description: string;
  actions?: ModuleAction[];
  children?: ReactNode;
};

export function ModuleShell({ title, description, actions = [], children }: ModuleShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Module</p>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-zinc-400 max-w-2xl">{description}</p>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Button key={action.href} asChild variant={action.variant || 'default'}>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
