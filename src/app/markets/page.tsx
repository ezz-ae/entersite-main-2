import Link from 'next/link';

const markets = ['Dubai', 'London', 'Bali'];

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Markets</p>
          <h1 className="text-3xl font-semibold tracking-tight">Markets</h1>
          <p className="text-sm text-zinc-400">Select a market to view signals and entry points.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {markets.map((market) => (
            <Link
              key={market}
              href={`/markets/${market.toLowerCase()}`}
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm font-semibold text-white hover:border-white/20"
            >
              {market}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
