 'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TOPICS = [
  'Account Access',
  'Website Builder',
  'Leads & CRM',
  'Google Ads',
  'Chat Assistant',
  'Billing',
  'Other',
];

export default function SupportPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: 'Please fill in your name, email, and message.', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Request failed');
      }
      toast({ title: 'Message sent', description: 'We will respond shortly.' });
      setMessage('');
    } catch (error: any) {
      toast({
        title: 'Could not send',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white py-28">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        <div className="text-center space-y-6">
          <Badge className="bg-white/5 border-white/10 text-zinc-400">Support</Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            We are here <br />
            <span className="text-zinc-600">to help.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tell us what you need and we will get back to you with clear, simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-zinc-950 border-white/10 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Send a message</CardTitle>
              <CardDescription>We reply quickly during Dubai business hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-black/40 border-white/10 text-white"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Topic</label>
                <select
                  className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {TOPICS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[160px] bg-black/40 border-white/10 text-white"
                  placeholder="Tell us what you need help with..."
                />
              </div>
              <Button
                className="h-12 rounded-full bg-white text-black font-bold"
                onClick={handleSubmit}
                disabled={sending}
              >
                {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                Send message
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-zinc-900/60 border-white/10 rounded-[2.5rem]">
              <CardHeader>
                <CardTitle>Direct contact</CardTitle>
                <CardDescription>Prefer email? Reach us here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-400">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <a href="mailto:support@entrestate.com" className="text-white hover:underline">
                    support@entrestate.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                  <span>Fast replies within 1 business day</span>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-[2.5rem] border border-white/10 bg-black/40 p-6 text-sm text-zinc-400">
              Share your project name, preferred area, and budget to help us reply faster.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
