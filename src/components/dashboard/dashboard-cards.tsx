'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Globe,
  MessageSquare,
  Target,
  Search,
  Zap,
  Library,
  BarChart3,
  User,
} from 'lucide-react';

const services = [
    { name: 'Google Ads', href: '/google-ads', icon: Search, description: 'Launch search campaigns with clear budgets.' },
    { name: 'Smart Sender', href: '/sender', icon: Zap, description: 'Multi-channel sequences and follow-up runs.' },
    { name: 'Site Builder', href: '/builder', icon: Globe, description: 'Launch surfaces for campaigns and chat.' },
    { name: 'Chat Agent', href: '/chat-agent', icon: MessageSquare, description: 'Agent setup, takeover rules, and events.' },
    { name: 'Market', href: '/market', icon: BarChart3, description: 'Signals, demand, and comparisons.' },
    { name: 'Inventory', href: '/inventory', icon: Library, description: 'Projects and market facts.' },
    { name: 'Lead Director', href: '/leads', icon: Target, description: 'Pipeline and lead flow.' },
    { name: 'Account', href: '/account', icon: User, description: 'Billing, integrations, and security.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    }
  })
};

export function DashboardCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {services.map((service, i) => (
        <Link href={service.href} key={service.name}>
          <motion.div 
            className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full hover:bg-zinc-800/80 transition-colors duration-300 aspect-square"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <div className="bg-zinc-800/50 p-4 rounded-full mb-4 border border-white/5">
              <service.icon className="h-8 w-8 text-zinc-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1">{service.name}</h3>
            <p className="text-sm text-zinc-500">{service.description}</p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
