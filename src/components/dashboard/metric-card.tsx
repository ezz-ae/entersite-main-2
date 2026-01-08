'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: string;
    trend: string;
    icon: React.ElementType;
    positive?: boolean;
}

export function MetricCard({ title, value, trend, icon: Icon, positive = true }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={cn(
                    "text-xs mt-1 flex items-center",
                    positive ? 'text-green-600' : 'text-red-600'
                )}>
                    {trend}
                    {positive ? <TrendingUp className="h-3 w-3 ml-1" /> : <TrendingDown className="h-3 w-3 ml-1" />}
                    <span className="text-muted-foreground ml-1 font-normal">from last month</span>
                </p>
            </CardContent>
        </Card>
    )
}
