'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch } from '@/lib/apiFetch';
import { Loader2, MessageSquare, MousePointerClick, Eye } from 'lucide-react';

const ICONS: { [key: string]: React.ElementType } = {
  impression: Eye,
  click: MousePointerClick,
  conversion: MessageSquare,
};

export function RealTimeActivity({ campaignId }: { campaignId: string }) {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiFetch(`/api/google-ads/activity?campaignId=${campaignId}`);
        const data = await res.json();
        if (res.ok) {
          setActivities(data);
        }
      } catch (error) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    const interval = setInterval(fetchActivities, 5000); // Poll for new activities

    return () => clearInterval(interval);

  }, [campaignId]);

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => {
            const Icon = ICONS[activity.type] || Eye;
            return (
              <div key={activity.id} className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-zinc-500" />
                <p className="text-sm flex-grow">{activity.description}</p>
                <p className="text-xs text-zinc-500">{activity.time}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
