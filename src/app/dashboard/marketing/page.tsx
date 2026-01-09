'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Megaphone, Search, Smartphone, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

const CHANNELS = [
  {
    title: 'Google Ads',
    description: 'Launch and track your ads.',
    href: '/dashboard/google-ads',
    icon: Search,
  },
  {
    title: 'Email Campaigns',
    description: 'Send project updates to your buyer list.',
    href: '/dashboard/email-marketing',
    icon: Mail,
  },
  {
    title: 'SMS Campaigns',
    description: 'Send quick updates and open house alerts.',
    href: '/dashboard/sms-marketing',
    icon: Smartphone,
  },
  {
    title: 'Buyer Audience',
    description: 'Use your buyer list for ads.',
    href: '/dashboard/meta-audience',
    icon: Users,
  },
];

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Marketing</h1>
          <p className="text-zinc-500">Pick a channel to get started.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Megaphone className="h-4 w-4" /> Quick start
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHANNELS.map((channel) => (
          <Link key={channel.href} href={channel.href}>
            <Card className="p-6 rounded-3xl bg-zinc-900/70 border border-white/5 hover:border-blue-500/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <channel.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{channel.title}</h3>
                  <p className="text-sm text-zinc-500">{channel.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-700 group-hover:text-blue-400 transition-colors" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
