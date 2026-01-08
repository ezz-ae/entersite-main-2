'use client';

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We keep it simple: Standard Light/Dark modes.
// User can optionally set a "Brand Color" which overrides the primary color.

type ThemeContextType = {
  brandColor: string;
  setBrandColor: (color: string) => void;
};

const ThemeContext = React.createContext<ThemeContextType>({
  brandColor: '',
  setBrandColor: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);

// Helper to convert hex to HSL for Tailwind
function hexToHSL(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [brandColor, setBrandColorState] = React.useState('');

  const setBrandColor = (color: string) => {
    const hsl = hexToHSL(color);
    if (hsl) {
      const root = document.documentElement;
      root.style.setProperty('--primary', hsl);
      // We can also adjust primary-foreground if needed, but keeping it simple for now (usually white/black works)
      // For very light brand colors, user might need dark text.
      setBrandColorState(color);
    }
  };

  return (
    <ThemeContext.Provider value={{ brandColor, setBrandColor }}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}
