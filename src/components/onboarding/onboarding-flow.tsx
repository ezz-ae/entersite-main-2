'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe, Smartphone, Mail, Target, ArrowRight } from 'lucide-react';

const START_OPTIONS = [
  {
    id: 'website',
    label: 'Website',
    description: 'Create a project page with your branding.',
    href: '/builder',
    icon: Globe,
  },
  {
    id: 'sms',
    label: 'SMS Campaign',
    description: 'Send SMS updates for new listings.',
    href: '/start/sms',
    icon: Smartphone,
  },
  {
    id: 'email',
    label: 'Email Campaign',
    description: 'Send a simple email follow-up.',
    href: '/start/email',
    icon: Mail,
  },
  {
    id: 'ads',
    label: 'Ads Launch',
    description: 'Launch Google Ads in a few clicks.',
    href: '/dashboard/google-ads',
    icon: Target,
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const intent = searchParams.get('intent');
    if (intent && START_OPTIONS.some((option) => option.id === intent)) {
      setSelected(intent);
    }
  }, [searchParams]);

  const selectedOption = useMemo(
    () => START_OPTIONS.find((option) => option.id === selected) ?? null,
    [selected]
  );

  const handleContinue = () => {
    if (!selectedOption) return;
    router.push(selectedOption.href);
  };

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Get Started</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Pick your next step.</h1>
        <p className="text-zinc-500 max-w-3xl">
          Choose one path and we will take you to the right screen.
        </p>
      </div>

      <div className="p-8 space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          {START_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={cn(
                'p-6 rounded-2xl border text-left transition-all',
                selected === option.id
                  ? 'border-blue-500/60 bg-blue-600/10'
                  : 'border-white/10 bg-white/5 hover:border-blue-500/30'
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <option.icon className="h-8 w-8 text-blue-500" />
                <h3 className="text-2xl font-bold">{option.label}</h3>
              </div>
              <p className="text-zinc-400">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-zinc-500">
            {selectedOption ? `Selected: ${selectedOption.label}` : 'Select a card to continue.'}
          </p>
          <Button
            onClick={handleContinue}
            disabled={!selectedOption}
            className="h-12 px-6 rounded-full bg-white text-black font-bold disabled:opacity-40"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
