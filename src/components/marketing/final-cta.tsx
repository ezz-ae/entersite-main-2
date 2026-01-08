'use client';

import { motion } from 'framer-motion';
import { CTAButton } from '@/components/marketing/cta-button';

export function FinalCTA() {
  return (
    <section className="py-60 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,165,0,0.15),transparent_70%)]" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-8xl md:text-[12rem] font-black tracking-tighter mb-12 leading-none text-white">
              Your Vision, <br/>
            <span className="text-zinc-600">Realized.</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <CTAButton label="Start Building Now" buttonId="final-launch" context={{ page: 'landing', service: 'builder' }} />
             <CTAButton label="Request a Demo" buttonId="final-demo" variant="outline" context={{ page: 'landing', service: 'sales' }} />
          </div>
          <p className="mt-16 text-zinc-500 font-mono text-sm uppercase tracking-[0.5em]">THE FUTURE OF REAL ESTATE DEVELOPMENT</p>
        </motion.div>
      </div>
    </section>
  );
}
