'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, GripVertical, MoreHorizontal, Copy, EyeOff, Layout } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUploader } from "@/components/ui/image-uploader";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSortableItem } from './ui/sortable/sortable-item';

interface BlockCardProps {
  blockType: string;
  children: React.ReactNode;
  onDelete?: () => void;
  onUpdate?: (newData: any) => void;
  onDuplicate?: () => void;
  data?: any;
}

export function BlockCard({ blockType, children, onDelete, onUpdate, onDuplicate, data }: BlockCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data || {});

  const { attributes, listeners, isDragging } = useSortableItem();

  const handleSave = () => {
      onUpdate?.(editData);
      setIsEditing(false);
  };

  const renderEditFields = () => {
      return (
          <div className="space-y-6 py-4">
              <div className="space-y-2">
                  <Label htmlFor="headline" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline</Label>
                  <Input 
                    id="headline" 
                    value={editData.headline || ''} 
                    onChange={(e) => setEditData({...editData, headline: e.target.value})}
                    className="h-12 text-lg font-medium"
                  />
              </div>
               <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subtext</Label>
                   <RichTextEditor 
                        initialValue={editData.subtext} 
                        onChange={(val) => setEditData({...editData, subtext: val})}
                        className="min-h-[120px]"
                   />
              </div>
              
              {(editData.image || editData.backgroundImage) && (
                  <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visual</Label>
                      <ImageUploader 
                        initialImage={editData.image || editData.backgroundImage} 
                        onImageChange={(url) => setEditData({...editData, [editData.image ? 'image' : 'backgroundImage']: url})}
                      />
                  </div>
              )}
          </div>
      )
  }

  return (
    <motion.div
      layoutId={data?.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
          "relative group rounded-2xl transition-all duration-300 isolate",
          isDragging ? "shadow-2xl scale-[1.02] ring-2 ring-primary z-50 cursor-grabbing bg-background" : "hover:ring-1 hover:ring-primary/20 bg-card"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div className={cn(
          "absolute -top-3 right-4 z-20 flex items-center gap-1 p-1 pl-2 pr-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-black/5 transition-all duration-300 transform origin-right",
          isHovered || isDragging ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
      )}>
             <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mr-2">{blockType.replace(/-/g, ' ')}</span>
             
             <div className="h-4 w-px bg-border mx-1" />

             <button {...attributes} {...listeners} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-black/5 cursor-grab active:cursor-grabbing text-muted-foreground">
                <GripVertical className="h-3.5 w-3.5" />
             </button>
            
             <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-0 gap-0">
                    <DialogHeader className="p-6 pb-2 border-b bg-muted/20">
                        <DialogTitle className="text-xl font-semibold">Edit {blockType.replace(/-/g, ' ')}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="p-6">
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 p-1 bg-muted/50 rounded-xl mb-6">
                                <TabsTrigger value="content" className="rounded-lg">Content</TabsTrigger>
                                <TabsTrigger value="style" className="rounded-lg">Design</TabsTrigger>
                            </TabsList>
                            <TabsContent value="content" className="mt-0">
                                {renderEditFields()}
                            </TabsContent>
                            <TabsContent value="style" className="mt-0">
                                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm bg-muted/10 rounded-xl border border-dashed">
                                    Style options are managed in Brand settings.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="p-4 border-t bg-muted/20 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleSave} className="rounded-xl shadow-lg shadow-primary/20">Save Changes</Button>
                    </div>
                </DialogContent>
             </Dialog>

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-black/5">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl">
                    <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onDuplicate} className="rounded-lg gap-2 text-xs font-medium focus:bg-muted">
                        <Copy className="h-3.5 w-3.5" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium focus:bg-muted">
                        <Layout className="h-3.5 w-3.5" /> Save as Template
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium focus:bg-muted">
                        <EyeOff className="h-3.5 w-3.5" /> Hide Block
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem onClick={onDelete} className="rounded-lg gap-2 text-xs font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
      </div>

      <div className={cn(
          "rounded-xl overflow-hidden bg-background shadow-sm border border-transparent transition-all duration-300",
          isHovered ? "border-black/5 shadow-md" : ""
      )}>
           <div className={cn("transition-opacity duration-300", isDragging ? "opacity-30" : "opacity-100")}>
               {children}
           </div>
      </div>
    </motion.div>
  );
}
