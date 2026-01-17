'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Globe,
  Target,
  MessageSquare,
  PlusCircle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/account', icon: User, label: 'Account' },
    { href: '/google-ads', icon: Search, label: 'Ads' },
    { href: '/builder', icon: PlusCircle, label: 'Build', primary: true },
    { href: '/leads', icon: Target, label: 'Leads' },
    { href: '/chat-agent', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] h-20 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        if (item.primary) {
          return (
            <Link key={item.href} href={item.href} className="relative -top-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(37,99,235,0.6)] rotate-12 active:scale-90 transition-all">
                    <item.icon className="w-8 h-8 text-white -rotate-12" />
                </div>
            </Link>
          )
        }

        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[64px]">
            <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive ? "bg-white/10 text-white" : "text-zinc-500"
            )}>
                <item.icon className="w-6 h-6" />
            </div>
            <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-all",
                isActive ? "text-white opacity-100" : "text-zinc-600 opacity-0"
            )}>
                {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
