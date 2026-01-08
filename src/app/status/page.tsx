import { Badge } from '@/components/ui/badge';

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Status
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Status Overview</h1>
        <p className="text-zinc-500 text-lg">
          The core platform is online. Some tools are in pilot or still being prepared for launch.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Badge className="bg-white/5 border-white/10 text-zinc-300">Website Builder: In Progress</Badge>
          <Badge className="bg-white/5 border-white/10 text-zinc-300">Inventory: Setup Needed</Badge>
          <Badge className="bg-white/5 border-white/10 text-zinc-300">Ads: Available</Badge>
          <Badge className="bg-white/5 border-white/10 text-zinc-300">Messaging: Setup Needed</Badge>
        </div>
      </div>
    </main>
  );
}
