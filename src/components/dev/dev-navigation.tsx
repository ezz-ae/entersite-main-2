'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Layout, 
  Puzzle, 
  FileText, 
  Book, 
  User, 
  Eye, 
  Code,
  TrendingUp
} from 'lucide-react';

export function DevNavigation() {
  const pathname = usePathname();
  
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] bg-black/90 backdrop-blur-md border border-white/10 text-white p-2 rounded-2xl shadow-2xl flex items-center gap-1 max-w-[90vw] overflow-x-auto">
      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-r border-white/10 mr-1">
          Dev Mode
      </div>
      
      <NavLink href="/" icon={Home} label="Home" active={pathname === '/'} />
      <NavLink href="/builder" icon={Layout} label="Builder" active={pathname === '/builder'} />
      <NavLink href="/instagram-assistant" icon={TrendingUp} label="Instagram Assistant" active={pathname === '/instagram-assistant'} />
      <NavLink href="/marketing-puzzle" icon={Puzzle} label="Puzzle" active={pathname === '/marketing-puzzle'} />
      <NavLink href="/blog" icon={FileText} label="Blog" active={pathname?.startsWith('/blog')} />
      <NavLink href="/docs" icon={Book} label="Docs" active={pathname?.startsWith('/docs')} />
      <NavLink href="/profile" icon={User} label="Profile" active={pathname === '/profile'} />
      <NavLink href="/p/demo" icon={Eye} label="Preview" active={pathname?.startsWith('/p/')} />
    </div>
  );
}

function NavLink({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
    return (
        <Link 
            href={href}
            className={cn(
                "p-2 rounded-xl flex items-center gap-2 transition-all hover:bg-white/10",
                active ? "bg-white text-black hover:bg-white" : "text-zinc-400 hover:text-white"
            )}
            title={label}
        >
            <Icon className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline-block">{label}</span>
        </Link>
    )
}
