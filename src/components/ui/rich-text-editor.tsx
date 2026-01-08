'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function RichTextEditor({ initialValue = "", onChange, className }: RichTextEditorProps) {
  // In a real app, this would use a library like Tiptap or Slate.
  // For this prototype, we'll build a visual facade that acts like a textarea.
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className={cn("border rounded-md shadow-sm overflow-hidden bg-background", className)}>
      <div className="flex items-center gap-1 p-1 border-b bg-muted/30">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Bold className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Italic className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Italic</TooltipContent>
            </Tooltip>
            
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <UnderlineIcon className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Underline</TooltipContent>
            </Tooltip>
             
             <div className="w-[1px] h-6 bg-border mx-1" />

             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <AlignRight className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
            </Tooltip>

            <div className="w-[1px] h-6 bg-border mx-1" />
            
             <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <List className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
             
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

        </TooltipProvider>
      </div>
      <textarea
        className="w-full min-h-[150px] p-3 text-sm resize-y focus:outline-none bg-transparent"
        value={value}
        onChange={handleChange}
        placeholder="Start typing..."
      />
    </div>
  );
}
