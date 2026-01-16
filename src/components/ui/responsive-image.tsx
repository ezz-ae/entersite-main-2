'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface ResponsiveImageProps {
  src?: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

// Reliable Project Hero Images from Entrestate Storage
const FALLBACK_PROJECT_IMAGES = [
    "https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/U10759_EXT_ZED739.webp?alt=media&token=be7418eb-0f7f-4df3-8c89-8fa5b070a7aa",
    "https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/the-palace-downtown-dubai-view-from-the-poolside-900.jpg?alt=media&token=45ef0994-1111-4f85-a500-c470c85c3785",
    "https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/DAMAC_Islands-Gallery-00.jpg?alt=media&token=c51b483f-dd32-42ce-85e5-b06beb78c41f",
    "https://firebasestorage.googleapis.com/v0/b/studio-7730943652-a28e0.firebasestorage.app/o/palm_jebel_ali_cover.webp?alt=media&token=c20196a1-a0b2-4dce-af15-f7d31735fba0"
];

export function ResponsiveImage({
  src,
  alt,
  aspectRatio = "16/9",
  className,
  priority = false,
  fill = false,
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no src is provided, or it looks like a placeholder/broken link
    // pick a deterministic fallback from our high-quality project storage
    if (!src || src.includes('placeholder') || src.includes('example.com')) {
        const index = Math.abs(alt.length) % FALLBACK_PROJECT_IMAGES.length;
        setImgSrc(FALLBACK_PROJECT_IMAGES[index]);
    } else {
        setImgSrc(src);
    }
  }, [src, alt]);

  if (!imgSrc) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-zinc-900",
        !fill && aspectRatio === "16/9" && "aspect-video",
        !fill && aspectRatio === "1/1" && "aspect-square",
        !fill && aspectRatio === "4/5" && "aspect-[4/5]",
        fill && "absolute inset-0",
        className
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800/50 animate-pulse">
          <Building2 className="h-10 w-10 text-zinc-700 opacity-20" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill={true} // Always use fill for responsiveness within our relative container
        priority={priority}
        className={cn(
            "object-cover transition-all duration-1000",
            isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
            // If the assigned image itself breaks, try the first safe one
            setImgSrc(FALLBACK_PROJECT_IMAGES[0]);
        }}
      />
    </div>
  );
}
