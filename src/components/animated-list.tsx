'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListProps {
  items: React.ReactNode[];
}

export function AnimatedList({ items }: AnimatedListProps) {
  return (
    <div className="relative w-full">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={index} // Make sure keys are stable if items re-order, but for sequential flows, index is fine.
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }}
            exit={{ opacity: 0, y: -50, transition: { duration: 0.3 } }}
            className="w-full"
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedListItemProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export const AnimatedListItem = ({ children, onClick, className }: AnimatedListItemProps) => {
    return (
        <motion.button
            onClick={onClick}
            className={`w-full text-left p-4 my-2 border border-zinc-800 rounded-lg hover:bg-zinc-800/80 hover:border-blue-500 transition-all duration-200 ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {children}
        </motion.button>
    )
}