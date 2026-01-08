'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Users, 
  MessageSquare,
  Search,
  Smartphone,
  Mail,
  Palette
} from 'lucide-react';

const services = [
    { name: 'Website Builder', href: '/dashboard/sites', icon: Globe, description: 'Create and publish project pages.' },
    { name: 'Chat Assistant', href: '/dashboard/chat-agent', icon: MessageSquare, description: 'Answer buyer questions automatically.' },
    { name: 'Google Ads', href: '/dashboard/google-ads', icon: Search, description: 'Launch and monitor search campaigns.' },
    { name: 'Buyer Audience', href: '/dashboard/meta-audience', icon: Users, description: 'Activate your buyer list.' },
    { name: 'SMS Campaigns', href: '/dashboard/sms-marketing', icon: Smartphone, description: 'Send quick updates to buyers.' },
    { name: 'Email Campaigns', href: '/dashboard/email-marketing', icon: Mail, description: 'Send project announcements fast.' },
    { name: 'Leads', href: '/dashboard/leads', icon: Users, description: 'Track and follow up with leads.' },
    { name: 'Brand Kit', href: '/dashboard/brand', icon: Palette, description: 'Keep logos and colors consistent.' },
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
