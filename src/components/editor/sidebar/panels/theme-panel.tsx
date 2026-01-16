'use client';

import React from 'react';
import { useTheme as useNextTheme } from "next-themes";
import { useTheme } from '@/components/theme-provider';
import { Button } from "@/components/ui/button";
import { Palette, Sun, Moon } from 'lucide-react';

interface ThemePanelProps {
  onClose: () => void;
}

const colorPresets = [
  { name: 'Default', color: '#3b82f6' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Cyan', color: '#06b6d4' },
];

export function ThemePanel({ onClose }: ThemePanelProps) {
  const { theme, setTheme } = useNextTheme();
  const { brandColor, setBrandColor } = useTheme();

  return (
    <div className="w-full h-full flex flex-col">
        <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-lg text-white">Theme Settings</h3>
            <p className="text-xs text-zinc-400">Customize your site's appearance.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Color Mode */}
            <div>
                <h4 className="font-semibold text-sm mb-2 text-white">Color Mode</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => setTheme('dark')} 
                        className={`flex items-center gap-2 p-3 rounded-lg border \${theme === 'dark' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
                        <Moon className="h-4 w-4" /> <span className="text-sm">Dark</span>
                    </button>
                    <button 
                        onClick={() => setTheme('light')} 
                        className={`flex items-center gap-2 p-3 rounded-lg border \${theme === 'light' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 bg-zinc-800'}`}>
                        <Sun className="h-4 w-4" /> <span className="text-sm">Light</span>
                    </button>
                </div>
            </div>

            {/* Brand Color */}
            <div>
                <h4 className="font-semibold text-sm mb-2 text-white">Brand Color</h4>
                <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map(preset => (
                        <button 
                            key={preset.name}
                            onClick={() => setBrandColor(preset.color)}
                            className={`w-full aspect-square rounded-md border-2 \${brandColor === preset.color ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
