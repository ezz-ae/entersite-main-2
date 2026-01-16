'use client';

import React, { createContext, useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface SortableItemContextProps {
  attributes: any;
  listeners: any;
  setNodeRef: (node: HTMLElement | null) => void;
  isDragging: boolean;
}

const SortableItemContext = createContext<SortableItemContextProps>({
  attributes: {},
  listeners: {},
  setNodeRef: () => {},
  isDragging: false,
});

export function useSortableItem() {
  return useContext(SortableItemContext);
}

export function SortableItem({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const contextValue = useMemo(
    () => ({
      attributes,
      listeners: listeners || {},
      setNodeRef,
      isDragging,
    }),
    [attributes, listeners, setNodeRef, isDragging]
  );

  return (
    <SortableItemContext.Provider value={contextValue}>
      <div ref={setNodeRef} style={style} className={cn("relative touch-none", className)}>
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}
