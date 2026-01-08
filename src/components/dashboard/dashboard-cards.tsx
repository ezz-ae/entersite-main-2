'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Globe, 
  Megaphone, 
  Users, 
  Bot, 
  ImageIcon, 
  Palette,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, description: 'View key metrics and updates.' },
    { name: 'My Sites', href: '/dashboard/sites', icon: Globe, description: 'Manage your public websites.' },
    { name: 'Domain', href: '/dashboard/domain', icon: Globe, description: 'Connect and manage your domains.' },
    { name: 'Marketing & Ads', href: '/dashboard/marketing', icon: Megaphone, description: 'Run campaigns and track performance.' },
    { name: 'CRM & Leads', href: '/dashboard/leads', icon: Users, description: 'Manage customer relationships.' },
    { name: 'AI Tools', href: '/dashboard/ai-tools', icon: Bot, description: 'Leverage AI for your business.' },
    { name: 'Assets', href: '/dashboard/assets', icon: ImageIcon, description: 'Manage your media and files.' },
    { name: 'Brand Kit', href: '/dashboard/brand', icon: Palette, description: 'Define your brand identity.' },
    { name: 'Team', href: '/dashboard/team', icon: Users, description: 'Manage your team members.' },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase, description: 'Manage job openings.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut'
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
