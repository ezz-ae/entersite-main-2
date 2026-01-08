'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';
import { ResponsiveImage } from '@/components/ui/responsive-image';
import { getRandomImage } from '@/lib/images';
import Image from 'next/image';

export function GoogleReviewsBlock({
  headline = "Trusted by 500+ Investors",
  rating = "4.9",
  reviewCount = "128",
}: { headline?: string, rating?: string, reviewCount?: string }) {
  
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border shadow-sm px-4 py-2 rounded-full mb-6">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width={20} height={20} />
                <span className="font-semibold text-sm">Google Reviews</span>
                <div className="w-px h-4 bg-gray-200 mx-1" />
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{rating}</span>
                <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{headline}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {[
                { name: "Sarah Johnson", date: "2 days ago", text: "The team helped me find the perfect off-plan investment in Downtown. The ROI calculator was spot on!", type: "Investment" },
                { name: "Mohammed Al-Fayed", date: "1 week ago", text: "Professional service and deep market knowledge. Highly recommend for international buyers.", type: "Buying" },
                { name: "David Chen", date: "3 weeks ago", text: "Seamless process from viewing to handover. They handled all the paperwork efficiently.", type: "Property Management" },
            ].map((review, i) => (
                <Card key={i} className="border-0 shadow-lg bg-card">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{review.name}</h4>
                                    <p className="text-xs text-muted-foreground">{review.date}</p>
                                </div>
                            </div>
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width={16} height={16} className="opacity-50" />
                        </div>
                        <div className="flex gap-0.5 mb-3">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{review.text}"</p>
                        <div className="text-xs font-medium px-2 py-1 bg-muted rounded-md w-fit text-muted-foreground">
                            Service: {review.type}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}
