'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Ticket } from 'lucide-react';
import Link from 'next/link';

// The puzzle pieces (scrambled order initially)
const INITIAL_ITEMS = [
  { id: '1', content: '$', type: 'symbol' },
  { id: '2', content: '1', type: 'digit' },
  { id: '3', content: '0', type: 'digit' },
  { id: '4', content: '0', type: 'digit' },
];

export function CouponPuzzle() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [isSolved, setIsSolved] = useState(false);

  const checkSolution = (newOrder: typeof INITIAL_ITEMS) => {
    const sequence = newOrder.map(item => item.content).join('');
    // Valid patterns: $100 or 100$
    if (sequence === '$100' || sequence === '100$') {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
  };

  const handleReorder = (newOrder: typeof INITIAL_ITEMS) => {
    setItems(newOrder);
    checkSolution(newOrder);
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Unlock your potential.
            </h1>
            <p className="text-zinc-400 text-lg">
                Arrange the blocks to reveal your welcome gift.
            </p>
        </div>

        <div className="flex justify-center py-12">
            <Reorder.Group 
                axis="x" 
                values={items} 
                onReorder={handleReorder} 
                className="flex gap-4"
            >
                {items.map((item) => (
                    <Reorder.Item 
                        key={item.id} 
                        value={item}
                        className="cursor-grab active:cursor-grabbing"
                    >
                        <motion.div
                            layout
                            className={`w-24 h-32 md:w-32 md:h-40 rounded-2xl flex items-center justify-center text-6xl md:text-7xl font-bold shadow-2xl border border-white/10 ${
                                isSolved 
                                ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]' 
                                : 'bg-zinc-900 text-white hover:bg-zinc-800'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1.1 }}
                        >
                            {item.content}
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>

        <div className="h-24 flex items-center justify-center">
            {isSolved ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 text-green-400 font-medium bg-green-400/10 px-4 py-1.5 rounded-full mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span>Code Unlocked: WELCOME100</span>
                    </div>
                    <Link href="/builder">
                        <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] font-semibold w-full md:w-auto">
                            Activate $100 Credit Now
                        </Button>
                    </Link>
                </motion.div>
            ) : (
                <p className="text-sm text-zinc-600 animate-pulse uppercase tracking-widest">
                    Drag to arrange
                </p>
            )}
        </div>
      </div>
    </section>
  );
}
