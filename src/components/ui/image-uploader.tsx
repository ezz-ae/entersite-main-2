'use client';

import * as React from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange?: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUploader({ initialImage, onImageChange, className, label = "Upload Image" }: ImageUploaderProps) {
  const [image, setImage] = React.useState(initialImage);

  const handleUpload = () => {
    // In a real app, this would open a file picker and upload to storage.
    // For this prototype, we'll simulate an upload by setting a random Unsplash image.
    const randomId = Math.floor(Math.random() * 1000);
    const mockUrl = `https://picsum.photos/seed/${randomId}/800/600`;
    setImage(mockUrl);
    onImageChange?.(mockUrl);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(undefined);
    onImageChange?.("");
  };

  return (
    <div 
        className={cn(
            "relative border-2 border-dashed rounded-lg overflow-hidden transition-all group",
            !image ? "hover:bg-muted/50 cursor-pointer" : "border-solid",
            className
        )}
        onClick={!image ? handleUpload : undefined}
    >
      {image ? (
        <>
            <div className="relative w-full h-full min-h-[200px]">
                <Image src={image} alt="Uploaded" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                 <Button variant="secondary" size="sm" onClick={handleUpload}>Change</Button>
                 <Button variant="destructive" size="sm" onClick={handleRemove}>Remove</Button>
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground p-4">
            <div className="bg-muted p-3 rounded-full mb-3">
                 <Upload className="h-6 w-6" />
            </div>
          <p className="font-medium text-sm text-center">{label}</p>
          <p className="text-xs text-center mt-1">Click to browse</p>
        </div>
      )}
    </div>
  );
}
