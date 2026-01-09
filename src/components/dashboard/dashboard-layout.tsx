'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Globe, 
  Megaphone, 
  Users, 
  Bot, 
  ImageIcon, 
  CreditCard, 
  LogOut, 
  Palette
} from 'lucide-react';
import { EntreSiteLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const showSidebar = pathname !== '/dashboard';

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Sites', href: '/dashboard/sites', icon: Globe },
    { name: 'Web Address', href: '/dashboard/domain', icon: Globe },
    { name: 'Marketing', href: '/dashboard/marketing', icon: Megaphone },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'AI Studio', href: '/dashboard/ai-tools', icon: Bot },
    { name: 'Media', href: '/dashboard/assets', icon: ImageIcon },
    { name: 'Brand', href: '/dashboard/brand', icon: Palette },
    { name: 'Team', href: '/dashboard/team', icon: Users },
  ];
  
  const bottomNavigation = [
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-zinc-900 flex font-sans">
      {/* Sidebar */}
      {showSidebar && (
        <aside className="w-64 bg-zinc-900/50 border-r border-white/5 flex-col fixed inset-y-0 z-50 hidden md:flex">
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <EntreSiteLogo className="h-6 w-6 text-white" />
              <span className="font-bold text-lg text-white">EntreSite</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = (pathname === item.href) || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive 
                      ? "bg-white/10 text-white shadow" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/5 space-y-1">
              {bottomNavigation.map((item) => {
                   const isActive = pathname.startsWith(item.href);
                   return (
                     <Link
                       key={item.name}
                       href={item.href}
                       className={cn(
                         "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                         isActive 
                           ? "bg-white/10 text-white" 
                           : "text-zinc-400 hover:bg-white/5 hover:text-white"
                       )}
                     >
                       <item.icon className="h-4 w-4" />
                       {item.name}
                     </Link>
                   );
              })}
              
               <div className="!mt-4 bg-black/20 p-3 rounded-xl flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">John Doe</p>
                      <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4" />
                  </Button>
              </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={cn("flex-1 flex flex-col min-w-0", showSidebar && "md:ml-64")}>
          {/* Mobile Header */}
          {showSidebar && (
               <div className="h-20 flex items-center justify-between px-6 bg-zinc-900/50 border-b border-white/5 md:hidden">
                  <Link href="/dashboard" className="flex items-center gap-2">
                     <EntreSiteLogo className="h-6 w-6 text-white" />
                     <span className="font-bold text-lg text-white">EntreSite</span>
                  </Link>
                  {/* A hamburger menu button can be added here to toggle a mobile menu */}
               </div>
          )}
          <div className="p-6 lg:p-8 mx-auto w-full max-w-7xl">
              {children}
          </div>
      </main>
    </div>
  );
}
