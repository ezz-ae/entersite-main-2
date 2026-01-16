'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function DomainSearchBlock() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults([
        { name: `${domain}.com`, available: false },
        { name: `${domain}.ai`, available: true },
        { name: `${domain}.co`, available: true },
        { name: `get${domain}.com`, available: true },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-24 bg-muted/10">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            Your Online Identity
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Find the perfect web address for your brand.</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            A great web address builds trust and credibility. Search for yours now.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <Input 
            placeholder="e.g., 'dubairealestate' or 'emaar-launch'"
            className="h-14 text-lg rounded-full px-6 bg-background"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button type="submit" size="lg" className="h-14 px-8 rounded-full text-base" disabled={loading}>
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </form>

        {loading && (
            <div className="mt-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {results.length > 0 && (
          <div className="mt-12 space-y-4 text-left">
            {results.map((res, i) => (
              <motion.div
                key={res.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-card border rounded-xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {res.available ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <span className="font-mono text-lg">{res.name}</span>
                </div>
                {res.available ? (
                  <Button className="rounded-full bg-green-600 hover:bg-green-700 h-9">Claim</Button>
                ) : (
                  <Button variant="outline" className="rounded-full h-9" disabled>Taken</Button>
                )}
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
