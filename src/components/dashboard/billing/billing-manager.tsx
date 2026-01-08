'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLANS = [
    {
        id: 'starter',
        name: 'Growth Plan',
        price: '299',
        desc: 'Perfect for solo agents and small teams.',
        features: [
            '10 Brochure Conversions /mo',
            'AI Sales Agent (Instagram & Web)',
            'Google Ads Dashboard',
            'Lead Sync to CRM'
        ],
        isPopular: true,
        accent: 'blue'
    },
    {
        id: 'enterprise',
        name: 'Brokerage OS',
        price: '999',
        desc: 'Full-scale intelligence for large brokerages.',
        features: [
            'Unlimited Brochure Conversions',
            'Multilingual AI Agents',
            'Advanced Audience Architect',
            'Custom Domain Hosting'
        ],
        accent: 'orange'
    }
];

export function BillingManager() {
  const initialOptions = {
    clientId: "test",
    currency: "USD",
    intent: "capture",
    components: "buttons",
    "enable-funding": "venmo,paylater",
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto py-20 px-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">
            <Lock className="h-3 w-3" /> Secure License Activation
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Choose your <br/><span className="text-zinc-600">Infrastructure.</span></h2>
        <p className="text-zinc-500 text-xl font-light max-w-2xl mx-auto">Scalable AI intelligence designed for the modern real estate empire.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {PLANS.map((plan) => (
          <div key={plan.id} className="group relative">
            <div className={cn(
                "absolute -inset-1 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-1000",
                plan.accent === 'blue' ? "bg-blue-600" : "bg-orange-600"
            )} />
            
            <Card className={cn(
                "relative h-full bg-zinc-950 border-white/5 backdrop-blur-3xl overflow-hidden rounded-[3rem] transition-all duration-700",
                plan.isPopular && "border-blue-500/20 ring-1 ring-blue-500/10 shadow-[0_0_50px_-20px_rgba(59,130,246,0.3)]"
            )}>
                {plan.isPopular && (
                    <div className="absolute top-0 right-0 px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-[2rem] shadow-xl">
                        Standard Choice
                    </div>
                )}
                
                <CardHeader className="p-12 pb-8">
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">{plan.name}</CardTitle>
                    <CardDescription className="text-zinc-500 text-lg mt-3 font-medium">{plan.desc}</CardDescription>
                    <div className="pt-10 flex items-baseline gap-2">
                        <span className="text-7xl font-black text-white tracking-tighter">${plan.price}</span>
                        <span className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">/ monthly</span>
                    </div>
                </CardHeader>

                <CardContent className="p-12 pt-0 space-y-12">
                    <div className="space-y-5">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Included Intelligence</p>
                        {plan.features.map(feature => (
                            <div key={feature} className="flex items-center gap-4 text-zinc-300 group/item">
                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover/item:border-blue-500/50 transition-colors">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                                </div>
                                <span className="text-sm font-semibold tracking-tight">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="p-1 rounded-[2.5rem] bg-white/5 border border-white/5 overflow-hidden">
                            <PayPalScriptProvider options={initialOptions}>
                                <PayPalButtons 
                                    style={{ 
                                        layout: "vertical", 
                                        shape: "pill", 
                                        color: "white", 
                                        label: "subscribe",
                                        height: 55
                                    }} 
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{ amount: { value: plan.price, currency_code: "USD" } }],
                                            intent: "CAPTURE"
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                        
                        <div className="flex items-center justify-center gap-8 py-2">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                                <ShieldCheck className="h-4 w-4 text-blue-500" /> AES-256 Encryption
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                                <Zap className="h-4 w-4 text-orange-500" /> Instant Setup
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
