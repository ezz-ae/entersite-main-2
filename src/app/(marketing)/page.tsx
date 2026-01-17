import type { Metadata } from 'next';
import Link from 'next/link';
import { HOME_MODULES } from '@/data/navigation';

export const metadata: Metadata = {
  title: 'Entrestate | Modular Real Estate System',
  description:
    'One system with focused modules: Ads, Sender, Builder, Chat Agent, Market, Inventory, Leads, and more.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Entrestate | Modular Real Estate System',
    description:
      'One system with focused modules: Ads, Sender, Builder, Chat Agent, Market, Inventory, Leads, and more.',
    url: '/',
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Entrestate System</p>
          <h1 className="text-4xl font-semibold tracking-tight">One system. Focused modules.</h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Every module is open to explore. Actions route through login and return you to the exact flow.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/20"
          >
            Continue
          </Link>
          <Link
            href="/account"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 transition hover:border-white/20"
          >
            Control Room
          </Link>
          <Link
            href="/support"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 transition hover:border-white/20"
          >
            Support
          </Link>
          <Link
            href="/docs/library/SYSTEM_FEED_MAP"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-zinc-300 transition hover:border-white/20"
          >
            System Map
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="rounded-2xl border border-white/10 bg-black/20 p-5 transition-colors hover:border-white/20"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">{module.category}</span>
              <h2 className="text-lg font-semibold">{module.label}</h2>
              <p className="text-sm text-zinc-400 mt-2">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
