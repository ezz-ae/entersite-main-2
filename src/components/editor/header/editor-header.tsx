'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { Monitor, Smartphone, Tablet, Rocket, Eye, ChevronLeft, Save, Layout, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SitePage } from '@/lib/types';

interface EditorHeaderProps {
  page: SitePage;
  onSave?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onRefine?: () => void;
  isPreviewMode?: boolean;
  isRefining?: boolean;
}

export function EditorHeader({ 
  page,
  onSave,
  onPreview,
  onPublish,
  onRefine,
  isPreviewMode = false,
  isRefining = false,
}: EditorHeaderProps) {
  const [device, setDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <header className="h-16 flex-shrink-0 bg-black border-b border-white/10 flex items-center justify-between px-4 z-50">
      
      {/* Left Side: Exit & Title */}
      <div className="flex items-center gap-4">
          <Link href="/dashboard/sites">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-500 hover:text-white hover:bg-white/5">
                  <ChevronLeft className="h-5 w-5" />
              </Button>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Editing Site</span>
              <h2 className="text-sm font-bold text-white leading-none">{page.title}</h2>
          </div>
      </div>

      {/* Center: Device Controls */}
      <div className="hidden md:flex items-center gap-2 p-1 bg-zinc-900 border border-white/10 rounded-xl">
          <DeviceButton 
              label="Desktop" 
              icon={Monitor} 
              isActive={device === 'desktop'} 
              onClick={() => setDevice('desktop')} 
          />
          <DeviceButton 
              label="Tablet" 
              icon={Tablet} 
              isActive={device === 'tablet'} 
              onClick={() => setDevice('tablet')} 
          />
          <DeviceButton 
              label="Mobile" 
              icon={Smartphone} 
              isActive={device === 'mobile'} 
              onClick={() => setDevice('mobile')} 
          />
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-3">
          <Button 
            variant={isPreviewMode ? "secondary" : "ghost"} 
            size="sm" 
            className={cn(
                "hidden lg:flex gap-2 h-9 px-4 transition-all",
                isPreviewMode ? "bg-blue-600/10 text-blue-500 border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"
            )} 
            onClick={onPreview}
          >
              {isPreviewMode ? <Layout className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              {isPreviewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button variant="secondary" size="sm" className="hidden lg:flex gap-2 h-9 px-4 border border-white/5" onClick={onSave}>
              <Save className="h-4 w-4"/>
              Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex gap-2 h-9 px-4 text-amber-300 border border-amber-300/30 hover:bg-amber-400/10 rounded-full"
            onClick={onRefine}
            disabled={isRefining}
          >
            <Sparkles className="h-4 w-4" />
            {isRefining ? 'Refiner Running...' : 'Refiner AI'}
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 h-9 px-6 rounded-full shadow-lg shadow-blue-600/20"
            onClick={onPublish}
          >
              <Rocket className="h-4 w-4"/>
              Publish
          </Button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <UserNav />
      </div>
    </header>
  );
}

const DeviceButton = ({ label, icon: Icon, isActive, onClick }: any) => (
    <button 
        onClick={onClick} 
        aria-label={`Switch to \${label} view`}
        className={cn(
            "p-2 rounded-lg transition-all",
            isActive 
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        )}
    >
        <Icon className="h-4 w-4" />
    </button>
)
