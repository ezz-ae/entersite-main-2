'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function EntrestateLogo({ className, showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-6 h-6 text-white" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 3l1.912 5.886h6.188l-5.007 3.638 1.912 5.886-5.005-3.64-5.005 3.64 1.912-5.886-5.007-3.638h6.188z" />
          </svg>
      </div>
      {showText && (
        <span className="font-bold text-2xl tracking-tighter text-white">
          Entrestate
        </span>
      )}
    </div>
  );
}

export function EntreSiteLogo(props: any) {
    return <EntrestateLogo className={props.className} showText={false} />;
}
