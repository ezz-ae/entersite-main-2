'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Globe, Sparkles, Smartphone, Mail, Target, ArrowRight } from 'lucide-react';
import { InitialPromptSelector } from '@/components/onboarding/initial-prompt-selector';
import { useRouter } from 'next/navigation';

const INTENT_OPTIONS = [
  { id: 'website', label: 'Website', description: 'AI architect builds a full landing page from your prompt or brochure.', icon: Globe },
  { id: 'sms', label: 'SMS Campaign', description: 'Broadcast VIP updates through WhatsApp/SMS.', icon: Smartphone },
  { id: 'email', label: 'Email Campaign', description: 'Deploy high-performing investor sequences.', icon: Mail },
  { id: 'ads', label: 'Ads Launch', description: 'Sync Google & Meta campaigns in minutes.', icon: Target },
];

const AUDIENCE_OPTIONS = [
  { id: 'broker', label: 'Broker / Agent', description: 'Personal portfolio, listings, WhatsApp-first CTA.' },
  { id: 'developer', label: 'Developer / Project', description: 'Full launch stack, payment plans, investor kits.' },
  { id: 'individual', label: 'Investor / Advisory', description: 'Private investor hubs, ROI tools, lead capture.' },
];

const BLUEPRINT_PACKS: Record<string, Array<{ id: string; name: string; description: string; highlights: string[] }>> = {
  broker: [
    { id: 'portfolio', name: 'Agent Portfolio', description: 'Hero, proof, featured listings, WhatsApp CTA.', highlights: ['Personal brand', 'Testimonials', 'Lead form'] },
    { id: 'luxury', name: 'Luxury Agent Profile', description: 'Dark theme, gold accents, high-net-worth vibe.', highlights: ['Luxury UI', 'Video hero', 'Concierge CTA'] },
    { id: 'team', name: 'Team Microsite', description: 'Multi-agent roster with shared listings.', highlights: ['Team bios', 'Listings grid', 'Calendar'] },
  ],
  developer: [
    { id: 'launch', name: 'Project Launch', description: 'Countdown, payment plan, brochure download.', highlights: ['Timeline', 'Floor plans', 'Lead capture'] },
    { id: 'investor', name: 'Investor Narrative', description: 'ROI blocks, trust signals, partner logos.', highlights: ['ROI data', 'Press', 'CTA stack'] },
    { id: 'partner', name: 'Partner Kit', description: 'Reseller kit with assets + offer blocks.', highlights: ['Asset library', 'Offer comparison', 'CTA grid'] },
  ],
  individual: [
    { id: 'advisory', name: 'Advisory Hub', description: 'Personal brand, services, booking module.', highlights: ['Services', 'Bookings', 'Testimonials'] },
    { id: 'newsletter', name: 'Investor Newsletter', description: 'Lead magnet, insights, conversion CTA.', highlights: ['Email capture', 'Latest posts', 'CTA hero'] },
  ],
};

type Step = 'intent' | 'audience' | 'blueprint' | 'prompt' | 'comingSoon';

export function OnboardingFlow() {
  const [step, setStep] = useState<Step>('intent');
  const [intent, setIntent] = useState<string | null>(null);
  const [audience, setAudience] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const handleIntentSelect = (selected: string) => {
    setIntent(selected);
    if (selected === 'website') {
      setStep('audience');
    } else {
      setStep('comingSoon');
    }
  };

  const handleAudienceSelect = (selected: string) => {
    setAudience(selected);
    setStep('blueprint');
  };

  const handleBlueprintSelect = (pack: { id: string; name: string }) => {
    setBlueprint(pack);
    setStep('prompt');
  };

  const handlePrompt = (prompt: string) => {
    const params = new URLSearchParams();
    if (prompt) params.set('prompt', prompt);
    if (blueprint) params.set('blueprint', blueprint.id);
    if (audience) params.set('audience', audience);
    router.push(`/builder?${params.toString()}`);
  };

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Entrestate Launch Flow</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Architect your build in steps.</h1>
        <p className="text-zinc-500 max-w-3xl">Choose your intent, audience, and blueprint. We will load the right blocks and prompt into the builder.</p>
      </div>

      <div className="p-8 space-y-10">
        <StepIndicator step={step} />
        <AnimatePresence mode="wait">
          {step === 'intent' && (
            <motion.div key="intent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid md:grid-cols-2 gap-6">
              {INTENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleIntentSelect(option.id)}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 text-left hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <option.icon className="h-8 w-8 text-blue-500" />
                    <h3 className="text-2xl font-bold">{option.label}</h3>
                  </div>
                  <p className="text-zinc-400">{option.description}</p>
                </button>
              ))}
            </motion.div>
          )}

          {step === 'comingSoon' && (
            <motion.div key="comingSoon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
              <p className="text-xl text-zinc-400">This automation is almost ready. For now, start with the Website flow.</p>
              <Button onClick={() => setStep('intent')} variant="secondary">Back to intents</Button>
            </motion.div>
          )}

          {step === 'audience' && (
            <motion.div key="audience" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <h2 className="text-2xl font-semibold">Who are we building for?</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {AUDIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAudienceSelect(option.id)}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 text-left hover:border-blue-500/40 transition-all"
                  >
                    <p className="text-lg font-bold">{option.label}</p>
                    <p className="text-sm text-zinc-500 mt-2">{option.description}</p>
                  </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setStep('intent')} className="text-sm text-zinc-500">⬅ Back</Button>
            </motion.div>
          )}

          {step === 'blueprint' && audience && (
            <motion.div key="blueprint" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <h2 className="text-2xl font-semibold capitalize">Select a blueprint for {audience}</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {BLUEPRINT_PACKS[audience]?.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => handleBlueprintSelect({ id: pack.id, name: pack.name })}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 text-left hover:border-blue-500/40 transition-all"
                  >
                    <p className="text-lg font-bold">{pack.name}</p>
                    <p className="text-sm text-zinc-500 mt-2">{pack.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-zinc-400 uppercase tracking-widest">
                      {pack.highlights.map((item) => (
                        <span key={item} className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{item}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <Button variant="ghost" onClick={() => setStep('audience')}>⬅ Back</Button>
                <span>or</span>
                <Button variant="link" onClick={() => setStep('prompt')} className="text-blue-400">Skip to custom prompt</Button>
              </div>
            </motion.div>
          )}

          {step === 'prompt' && (
            <motion.div key="prompt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 rounded-[2rem] overflow-hidden">
              <InitialPromptSelector onPromptSelect={handlePrompt} />
              <div className="p-6 border-t border-white/10 flex items-center justify-between text-sm text-zinc-500">
                <div>
                  {blueprint ? (
                    <span>Blueprint <strong>{blueprint.name}</strong> selected.</span>
                  ) : (
                    <span>Custom prompt only. Blueprint will be suggested inside the builder.</span>
                  )}
                </div>
                <Button variant="ghost" onClick={() => setStep('blueprint')} className="text-xs">
                  <ArrowRight className="h-4 w-4 mr-1" /> Change Blueprint
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps: Array<{ id: Step; label: string }> = [
    { id: 'intent', label: 'Intent' },
    { id: 'audience', label: 'Audience' },
    { id: 'blueprint', label: 'Blueprint' },
    { id: 'prompt', label: 'Prompt' },
  ];
  const activeIndex = steps.findIndex((s) => s.id === step || (step === 'comingSoon' && s.id === 'intent'));

  return (
    <div className="flex items-center gap-3">
      {steps.map((s, index) => (
        <div key={s.id} className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${index <= activeIndex ? 'border-blue-500 text-blue-500' : 'border-white/10 text-white/30'}`}>
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-px ${index < activeIndex ? 'bg-blue-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
