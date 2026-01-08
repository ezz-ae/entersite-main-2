'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Send, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImportSmsContactsDialog } from './sms-import-contacts-dialog';
import { authorizedFetch } from '@/lib/auth-fetch';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export function SmsCampaignDashboard() {
  const { toast } = useToast();
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const [message, setMessage] = useState('');
  const [testNumber, setTestNumber] = useState('');
  const [listType, setListType] = useState<'imported' | 'pilot'>('imported');
  const [counts, setCounts] = useState({ imported: 0, pilot: 0 });
  const [loading, setLoading] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const refreshCounts = async () => {
    try {
      const res = await authorizedFetch('/api/contacts/summary?channel=sms');
      const data = await res.json();
      if (res.ok) {
        setCounts({
          imported: data.importedCount || 0,
          pilot: data.pilotCount || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load sms contact summary', error);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  const handleImportComplete = () => {
    refreshCounts();
    setListType('imported');
  };

  const handleSend = async (mode: 'test' | 'list') => {
    if (!message.trim()) {
      toast({ title: 'Write a short message first', variant: 'destructive' });
      return;
    }

    if (mode === 'test' && !testNumber && !user?.phoneNumber) {
      toast({ title: 'Add a test number', variant: 'destructive' });
      return;
    }

    if (mode === 'list' && listCount === 0) {
      toast({ title: 'No contacts in this list yet', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload =
        mode === 'test'
          ? {
              list: 'manual',
              recipients: [testNumber || user?.phoneNumber].filter(Boolean),
              message,
            }
          : {
              list: listType,
              message,
            };

      const res = await authorizedFetch('/api/sms/campaign', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send campaign');
      }

      toast({
        title: mode === 'test' ? 'Test SMS sent' : 'SMS sent',
        description: `Delivered ${data.sentCount} of ${data.requestedCount}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Send failed',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const listCount = listType === 'imported' ? counts.imported : counts.pilot;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <ImportSmsContactsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">SMS Campaigns</h1>
          <p className="text-zinc-500 text-lg font-light">Send quick updates to your buyer list.</p>
        </div>
        <Button
          variant="outline"
          className="border-white/10 rounded-full px-6 h-11 text-xs font-bold gap-2 uppercase tracking-widest text-zinc-400 hover:text-white"
          onClick={() => setShowImportDialog(true)}
        >
          <Upload className="h-4 w-4" /> Upload Contact List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-white/10 rounded-[2rem]">
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>Keep it short and clear for mobile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">SMS Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[160px] bg-black/40 border-white/10 text-white"
                  placeholder="Example: Hi {name}, new units are available at Creek Beach. Reply to book a call."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Test number</label>
                <Input
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  className="bg-black/40 border-white/10 text-white"
                  placeholder="+971 50 123 4567"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleSend('test')}
                  variant="outline"
                  className="h-12 rounded-full border-white/10 bg-white/5 text-white font-bold"
                  disabled={loading}
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> Send test to me
                </Button>
                <Button
                  onClick={() => handleSend('list')}
                  className="h-12 rounded-full bg-white text-black font-bold"
                  disabled={loading || listCount === 0}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send to list
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 border-white/10 rounded-[2rem]">
            <CardHeader>
              <CardTitle>Audience</CardTitle>
              <CardDescription>Choose who receives this SMS.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={listType === 'imported' ? 'default' : 'outline'}
                className="w-full h-12 rounded-2xl font-bold"
                onClick={() => setListType('imported')}
              >
                Your list ({counts.imported})
              </Button>
              <Button
                variant={listType === 'pilot' ? 'default' : 'outline'}
                className="w-full h-12 rounded-2xl font-bold"
                onClick={() => setListType('pilot')}
              >
                Pilot list ({counts.pilot})
              </Button>
              <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-sm text-zinc-500">
                Pilot list is managed by Entrestate. We only send when you request it.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-600/10 border-green-500/30 rounded-[2rem]">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-green-300 text-xs font-bold uppercase tracking-widest">
                <Send className="h-4 w-4" /> Delivery
              </div>
              <p className="text-sm text-zinc-200">We send to up to 50 contacts per campaign for safety.</p>
              <Badge className="bg-green-600/20 text-green-200 border-0">Can expand on request</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
