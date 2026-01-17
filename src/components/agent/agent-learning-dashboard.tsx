'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { authorizedFetch } from '@/lib/auth-fetch';
import { useToast } from '@/hooks/use-toast';
import {
  AgentEvent,
  AgentProfile,
  buildAutoGreeting,
  defaultAgentProfile,
  mergeAgentProfile,
} from '@/lib/agent-profile';
import { cn } from '@/lib/utils';

const DAYS: Array<{ key: keyof AgentProfile['contact']['workingHours']; label: string }> = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const EVENT_TYPES: Array<{ value: AgentEvent['type']; label: string }> = [
  { value: 'project_launch', label: 'Project launch' },
  { value: 'open_house', label: 'Open house' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'limited_offer', label: 'Limited offer' },
  { value: 'viewing_day', label: 'Viewing day' },
];

const EVENT_AUDIENCES: Array<{ value: NonNullable<AgentEvent['audience']>; label: string }> = [
  { value: 'buyers', label: 'Buyers' },
  { value: 'investors', label: 'Investors' },
  { value: 'agents', label: 'Agents' },
  { value: 'all', label: 'All' },
];

const URGENCY_TONES: Array<{ value: NonNullable<AgentEvent['urgencyTone']>; label: string }> = [
  { value: 'soft', label: 'Soft' },
  { value: 'normal', label: 'Normal' },
  { value: 'strong', label: 'Strong' },
];

const INTEGRATION_SOURCES = [
  { key: 'websiteForms', label: 'Website lead forms' },
  { key: 'landingPages', label: 'Landing pages (Entrestate)' },
  { key: 'crmImport', label: 'CRM import' },
  { key: 'inventory', label: 'Inventory (public/paid)' },
  { key: 'googleAds', label: 'Google Ads campaigns' },
  { key: 'smartSender', label: 'Smart Sender sequences' },
  { key: 'instagramDm', label: 'Instagram DM' },
  { key: 'calendarBooking', label: 'Calendar / booking' },
  { key: 'externalCrm', label: 'External CRM sync' },
];

const SUCCESS_GOALS: Array<{ value: AgentProfile['successGoal']['primary']; label: string }> = [
  { value: 'deliver_info', label: 'Deliver full info' },
  { value: 'collect_whatsapp', label: 'Collect WhatsApp' },
  { value: 'collect_phone', label: 'Collect phone number' },
  { value: 'collect_requirements', label: 'Collect full requirements' },
];

const TAKEOVER_METHODS: Array<{ value: AgentProfile['takeover']['method']; label: string }> = [
  { value: 'instant', label: 'Instant takeover' },
  { value: 'warm', label: 'Warm handoff' },
  { value: 'permission', label: 'Ask permission' },
];

const DATA_USAGE_OPTIONS: Array<{ value: AgentProfile['integrations']['dataUsage']; label: string }> = [
  { value: 'ask_first', label: 'Always ask me first' },
  { value: 'auto', label: 'Auto use connected data' },
  { value: 'confirm_before_send', label: 'Use data + confirm before sending' },
];

const newEventDraft = (): AgentEvent => ({
  id: `temp_${Date.now()}`,
  name: '',
  type: 'project_launch',
  startAt: '',
  endAt: '',
  location: '',
  audience: 'buyers',
  message: '',
  ctaUrl: '',
  attachments: [],
  urgencyTone: 'normal',
});

const toLocalDateTimeInput = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

const fromLocalDateTimeInput = (value: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
};

export function AgentLearningDashboard() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<AgentProfile>(defaultAgentProfile);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [eventsSaving, setEventsSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');

  const greetingPreview = useMemo(() => {
    const identity = profile.identity;
    if (identity.greeting && identity.greeting.trim()) return identity.greeting;
    return buildAutoGreeting(identity.agentName, identity.companyName);
  }, [profile.identity]);

  const loadProfile = async () => {
    try {
      const res = await authorizedFetch('/api/agent/profile', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setProfile(mergeAgentProfile(null, data.profile || {}));
      }
    } catch (error) {
      console.error('Failed to load agent profile', error);
      toast({ title: 'Failed to load agent profile', variant: 'destructive' });
    }
  };

  const loadEvents = async () => {
    try {
      const res = await authorizedFetch('/api/agent/events', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to load events', error);
      toast({ title: 'Failed to load events', variant: 'destructive' });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([loadProfile(), loadEvents()]);
      setLoading(false);
    };
    load();
  }, []);

  const saveProfile = async (nextProfile: AgentProfile) => {
    setSaving(true);
    try {
      const res = await authorizedFetch('/api/agent/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: nextProfile }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Save failed');
      }
      setProfile(mergeAgentProfile(null, data.profile || nextProfile));
      toast({ title: 'Agent profile saved' });
    } catch (error: any) {
      toast({ title: 'Save failed', description: error?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (patch: Partial<AgentProfile>) => {
    setProfile((prev) => mergeAgentProfile(prev, patch));
  };

  const updateEvent = (eventId: string, patch: Partial<AgentEvent>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, ...patch } : event)),
    );
  };

  const handleSaveEvent = async (event: AgentEvent) => {
    setEventsSaving(event.id);
    try {
      const isTemp = event.id.startsWith('temp_');
      const payload = {
        ...event,
        startAt: event.startAt,
        endAt: event.endAt || undefined,
      };
      if (isTemp) {
        const res = await authorizedFetch('/api/agent/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Create failed');
        setEvents((prev) =>
          prev.map((item) => (item.id === event.id ? { ...payload, id: data.event?.id || event.id } : item)),
        );
      } else {
        const res = await authorizedFetch(`/api/agent/events/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Update failed');
      }
      toast({ title: 'Event saved' });
    } catch (error: any) {
      toast({ title: 'Event save failed', description: error?.message, variant: 'destructive' });
    } finally {
      setEventsSaving(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const isTemp = eventId.startsWith('temp_');
    if (isTemp) {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      return;
    }
    setEventsSaving(eventId);
    try {
      const res = await authorizedFetch(`/api/agent/events/${eventId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Delete failed');
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast({ title: 'Event removed' });
    } catch (error: any) {
      toast({ title: 'Event delete failed', description: error?.message, variant: 'destructive' });
    } finally {
      setEventsSaving(null);
    }
  };

  const applyFixes = () => {
    const next = mergeAgentProfile(profile, {});
    if (next.sellingPower > 3) {
      next.sellingPower = 2;
    }
    if (!next.identity.greeting) {
      next.identity.greeting = buildAutoGreeting(next.identity.agentName, next.identity.companyName);
    }
    if (!Object.values(next.takeover.triggers).some(Boolean)) {
      next.takeover.triggers.viewingRequest = true;
      next.takeover.triggers.pricingNegotiation = true;
    }
    if (!Object.values(next.contact.workingHours).some(Boolean)) {
      next.contact.workingHours = { ...defaultAgentProfile.contact.workingHours };
    }
    if (!next.contact.whatsapp && next.contact.phone) {
      next.contact.whatsapp = next.contact.phone;
    }
    if (
      (next.successGoal.primary === 'deliver_info' ||
        next.successGoal.primary === 'collect_requirements') &&
      next.integrations.sources.inventory &&
      !next.integrations.sources.inventory.enabled
    ) {
      next.integrations.sources.inventory.enabled = true;
    }
    updateProfile(next);
    toast({ title: 'Refiner fixes applied' });
  };

  const refinerIssues = useMemo(() => {
    const issues: string[] = [];
    if (!profile.contact.phone && !profile.contact.whatsapp && !profile.contact.email) {
      issues.push('Missing contact details');
    }
    if (!profile.identity.greeting) {
      issues.push('Greeting is missing');
    }
    if (profile.sellingPower >= 4) {
      issues.push('Selling power is too strong');
    }
    if (!Object.values(profile.takeover.triggers).some(Boolean)) {
      issues.push('No takeover triggers enabled');
    }
    const expiredEvents = events.filter((event) => {
      if (!event.endAt) return false;
      return Date.parse(event.endAt) < Date.now();
    });
    if (expiredEvents.length) {
      issues.push('Event dates expired');
    }
    if (profile.successGoal.primary === 'collect_whatsapp' && !profile.contact.whatsapp && !profile.contact.phone) {
      issues.push('WhatsApp goal without contact number');
    }
    if (
      (profile.successGoal.primary === 'deliver_info' ||
        profile.successGoal.primary === 'collect_requirements') &&
      profile.integrations.sources.inventory &&
      !profile.integrations.sources.inventory.enabled
    ) {
      issues.push('Inventory source is disabled');
    }
    return issues;
  }, [profile, events]);

  const setSourceEnabled = (key: string, enabled: boolean) => {
    updateProfile({
      integrations: {
        ...profile.integrations,
        sources: {
          ...profile.integrations.sources,
          [key]: {
            ...profile.integrations.sources[key],
            enabled,
            status: enabled ? 'connected' : 'not_connected',
            lastSyncAt: enabled ? new Date().toISOString() : null,
          },
        },
      },
    });
  };

  const updateAttachment = (eventId: string, index: number, patch: Partial<{ label: string; url: string }>) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;
        const attachments = [...(event.attachments || [])];
        attachments[index] = { ...attachments[index], ...patch };
        return { ...event, attachments };
      }),
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-zinc-500">Loading agent workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
        <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Agent Status</p>
            <div className="flex items-center gap-3">
              <Switch
                checked={profile.status === 'live'}
                onCheckedChange={(checked) => updateProfile({ status: checked ? 'live' : 'paused' })}
              />
              <span className="text-sm font-semibold text-white">
                {profile.status === 'live' ? 'Live' : 'Paused'}
              </span>
              {profile.status === 'live' ? (
                <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase tracking-widest">
                  Active
                </Badge>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] uppercase tracking-widest">
                  Paused
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Human Takeover</p>
            <div className="flex items-center gap-3">
              <Switch
                checked={profile.humanTakeover}
                onCheckedChange={(checked) => updateProfile({ humanTakeover: checked })}
              />
              <span className="text-sm font-semibold text-white">{profile.humanTakeover ? 'On' : 'Off'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Connected Channels</p>
            <div className="flex flex-wrap gap-2">
              {(['website', 'instagram', 'whatsapp'] as const).map((channel) => (
                <Badge
                  key={channel}
                  className={cn(
                    'text-[10px] uppercase tracking-widest border',
                    profile.connectedChannels[channel]
                      ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      : 'bg-white/5 text-zinc-400 border-white/10',
                  )}
                  onClick={() =>
                    updateProfile({
                      connectedChannels: {
                        ...profile.connectedChannels,
                        [channel]: !profile.connectedChannels[channel],
                      },
                    })
                  }
                >
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'quick' | 'advanced')}>
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900 p-1 rounded-2xl">
          <TabsTrigger value="quick" className="rounded-xl">
            Quick Setup
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-xl">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6 mt-6">
          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Quick Setup</CardTitle>
              <CardDescription>Three minutes to get the agent ready.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Agent name</label>
                  <Input
                    value={profile.identity.agentName}
                    onChange={(e) => updateProfile({ identity: { ...profile.identity, agentName: e.target.value } })}
                    className="bg-black border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Company name</label>
                  <Input
                    value={profile.identity.companyName}
                    onChange={(e) => updateProfile({ identity: { ...profile.identity, companyName: e.target.value } })}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">WhatsApp number</label>
                  <Input
                    value={profile.contact.whatsapp || ''}
                    onChange={(e) => updateProfile({ contact: { ...profile.contact, whatsapp: e.target.value } })}
                    className="bg-black border-white/10"
                    placeholder="+971..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Email</label>
                  <Input
                    value={profile.contact.email || ''}
                    onChange={(e) => updateProfile({ contact: { ...profile.contact, email: e.target.value } })}
                    className="bg-black border-white/10"
                    placeholder="agent@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Primary goal</label>
                <select
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200"
                  value={profile.successGoal.primary}
                  onChange={(e) =>
                    updateProfile({
                      successGoal: { ...profile.successGoal, primary: e.target.value as AgentProfile['successGoal']['primary'] },
                    })
                  }
                >
                  {SUCCESS_GOALS.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Selling power</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[profile.sellingPower]}
                    onValueChange={(value) => updateProfile({ sellingPower: value[0] })}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <Badge className="bg-white/5 text-zinc-200 border-white/10 text-xs">{profile.sellingPower}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Takeover triggers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(profile.takeover.triggers).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            takeover: {
                              ...profile.takeover,
                              triggers: { ...profile.takeover.triggers, [key]: Boolean(checked) },
                            },
                          })
                        }
                      />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={() => saveProfile(profile)} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save quick setup'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Identity & Greeting</CardTitle>
              <CardDescription>Set how the agent introduces itself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Agent name</label>
                  <Input
                    value={profile.identity.agentName}
                    onChange={(e) => updateProfile({ identity: { ...profile.identity, agentName: e.target.value } })}
                    className="bg-black border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Company name</label>
                  <Input
                    value={profile.identity.companyName}
                    onChange={(e) => updateProfile({ identity: { ...profile.identity, companyName: e.target.value } })}
                    className="bg-black border-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Role / team name</label>
                <Input
                  value={profile.identity.role || ''}
                  onChange={(e) => updateProfile({ identity: { ...profile.identity, role: e.target.value } })}
                  className="bg-black border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Special greeting</label>
                <Input
                  value={profile.identity.greeting || ''}
                  onChange={(e) => updateProfile({ identity: { ...profile.identity, greeting: e.target.value } })}
                  className="bg-black border-white/10"
                  placeholder={greetingPreview}
                />
                <p className="text-xs text-zinc-500">Auto greeting preview: {greetingPreview}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Company Contact Details</CardTitle>
              <CardDescription>Make contact instant and reliable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Main phone</label>
                  <Input
                    value={profile.contact.phone || ''}
                    onChange={(e) => updateProfile({ contact: { ...profile.contact, phone: e.target.value } })}
                    className="bg-black border-white/10"
                    placeholder="+971..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">WhatsApp number</label>
                  <Input
                    value={profile.contact.whatsapp || ''}
                    onChange={(e) => updateProfile({ contact: { ...profile.contact, whatsapp: e.target.value } })}
                    className="bg-black border-white/10"
                    placeholder="+971..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-zinc-500">Email</label>
                  <Input
                    value={profile.contact.email || ''}
                    onChange={(e) => updateProfile({ contact: { ...profile.contact, email: e.target.value } })}
                    className="bg-black border-white/10"
                    placeholder="agent@company.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500">Office area</label>
                    <Input
                      value={profile.contact.officeArea || ''}
                      onChange={(e) => updateProfile({ contact: { ...profile.contact, officeArea: e.target.value } })}
                      className="bg-black border-white/10"
                      placeholder="Downtown"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-zinc-500">Office city</label>
                    <Input
                      value={profile.contact.officeCity || ''}
                      onChange={(e) => updateProfile({ contact: { ...profile.contact, officeCity: e.target.value } })}
                      className="bg-black border-white/10"
                      placeholder="Dubai"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Working hours</label>
                <div className="flex flex-wrap gap-3">
                  {DAYS.map((day) => (
                    <label key={day.key} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Checkbox
                        checked={profile.contact.workingHours[day.key]}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            contact: {
                              ...profile.contact,
                              workingHours: {
                                ...profile.contact.workingHours,
                                [day.key]: Boolean(checked),
                              },
                            },
                          })
                        }
                      />
                      {day.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">After-hours rule</label>
                <Textarea
                  value={profile.contact.afterHoursRule || ''}
                  onChange={(e) => updateProfile({ contact: { ...profile.contact, afterHoursRule: e.target.value } })}
                  className="bg-black border-white/10"
                  placeholder="After 9pm, collect WhatsApp and promise a callback in the morning."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
              <CardDescription>What the agent should know about the business.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={profile.companyInfo || ''}
                onChange={(e) => updateProfile({ companyInfo: e.target.value })}
                className="bg-black border-white/10"
                placeholder="Owned by / established since / branches / specialties / languages."
              />
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Response Style</CardTitle>
              <CardDescription>Keep answers clear without extra complexity.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Reply length</label>
                <select
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200"
                  value={profile.responseStyle.replyLength}
                  onChange={(e) =>
                    updateProfile({
                      responseStyle: {
                        ...profile.responseStyle,
                        replyLength: e.target.value as AgentProfile['responseStyle']['replyLength'],
                      },
                    })
                  }
                >
                  <option value="short">Short</option>
                  <option value="balanced">Balanced</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Depth level</label>
                <select
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200"
                  value={profile.responseStyle.depthLevel}
                  onChange={(e) =>
                    updateProfile({
                      responseStyle: {
                        ...profile.responseStyle,
                        depthLevel: e.target.value as AgentProfile['responseStyle']['depthLevel'],
                      },
                    })
                  }
                >
                  <option value="basic">Basic</option>
                  <option value="practical">Practical</option>
                  <option value="deep">Deep</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Success Goal</CardTitle>
              <CardDescription>What the agent should prioritize.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Primary goal</label>
                <select
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200"
                  value={profile.successGoal.primary}
                  onChange={(e) =>
                    updateProfile({
                      successGoal: { ...profile.successGoal, primary: e.target.value as AgentProfile['successGoal']['primary'] },
                    })
                  }
                >
                  {SUCCESS_GOALS.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Secondary targets</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(profile.successGoal.secondary).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            successGoal: {
                              ...profile.successGoal,
                              secondary: { ...profile.successGoal.secondary, [key]: Boolean(checked) },
                            },
                          })
                        }
                      />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Selling Power</CardTitle>
              <CardDescription>Adjust how assertive the agent is.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Slider
                  value={[profile.sellingPower]}
                  onValueChange={(value) => updateProfile({ sellingPower: value[0] })}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <Badge className="bg-white/5 text-zinc-200 border-white/10 text-xs">{profile.sellingPower}</Badge>
              </div>
              <p className="text-xs text-zinc-500">
                1 = Soft, 2 = Helpful, 3 = Guided, 4 = Strong, 5 = Closer.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Human Takeover</CardTitle>
              <CardDescription>When and how to hand off.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Triggers</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(profile.takeover.triggers).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            takeover: {
                              ...profile.takeover,
                              triggers: { ...profile.takeover.triggers, [key]: Boolean(checked) },
                            },
                          })
                        }
                      />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Takeover method</label>
                <select
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200"
                  value={profile.takeover.method}
                  onChange={(e) =>
                    updateProfile({ takeover: { ...profile.takeover, method: e.target.value as AgentProfile['takeover']['method'] } })
                  }
                >
                  {TAKEOVER_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Notify channels</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(profile.takeover.notifyChannels).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            takeover: {
                              ...profile.takeover,
                              notifyChannels: { ...profile.takeover.notifyChannels, [key]: Boolean(checked) },
                            },
                          })
                        }
                      />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => toast({ title: 'Takeover test sent' })}>
                  Test takeover now
                </Button>
                <Button variant="outline" onClick={() => toast({ title: 'Preview ready', description: 'We will hand off to a human now.' })}>
                  Preview takeover message
                </Button>
                <Button variant="outline" onClick={() => toast({ title: 'Notify channels enabled' })}>
                  Notify channels
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Integrations Logic</CardTitle>
              <CardDescription>Control what the agent can use in the background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {INTEGRATION_SOURCES.map((source) => {
                  const record = profile.integrations.sources[source.key];
                  return (
                    <div key={source.key} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border border-white/10 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{source.label}</p>
                        <p className="text-xs text-zinc-500">
                          Status: {record.status === 'connected' ? 'Connected' : 'Not connected'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Last sync: {record.lastSyncAt ? new Date(record.lastSyncAt).toLocaleString() : '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => toast({ title: 'Connection check queued' })}
                          className="h-9"
                        >
                          Fix connection
                        </Button>
                        <Switch checked={record.enabled} onCheckedChange={(checked) => setSourceEnabled(source.key, checked)} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Data usage rule</label>
                <select
                  className="w-full h-11 bg-black border border-white/10 rounded-xl px-4 text-sm text-zinc-200"
                  value={profile.integrations.dataUsage}
                  onChange={(e) =>
                    updateProfile({
                      integrations: { ...profile.integrations, dataUsage: e.target.value as AgentProfile['integrations']['dataUsage'] },
                    })
                  }
                >
                  {DATA_USAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Action permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(profile.integrations.permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) =>
                          updateProfile({
                            integrations: {
                              ...profile.integrations,
                              permissions: { ...profile.integrations.permissions, [key]: Boolean(checked) },
                            },
                          })
                        }
                      />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Timely Knowledge</CardTitle>
              <CardDescription>Events, schedules, and time-sensitive notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Events</p>
                  <Button variant="outline" onClick={() => setEvents((prev) => [newEventDraft(), ...prev])}>
                    Add event
                  </Button>
                </div>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="border border-white/10 rounded-2xl p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={event.name}
                          onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                          className="bg-black border-white/10"
                          placeholder="Event name"
                        />
                        <select
                          className="w-full h-10 bg-black border border-white/10 rounded-xl px-3 text-sm text-zinc-200"
                          value={event.type}
                          onChange={(e) => updateEvent(event.id, { type: e.target.value as AgentEvent['type'] })}
                        >
                          {EVENT_TYPES.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          type="datetime-local"
                          value={toLocalDateTimeInput(event.startAt)}
                          onChange={(e) => updateEvent(event.id, { startAt: fromLocalDateTimeInput(e.target.value) })}
                          className="bg-black border-white/10"
                        />
                        <Input
                          type="datetime-local"
                          value={toLocalDateTimeInput(event.endAt)}
                          onChange={(e) => updateEvent(event.id, { endAt: fromLocalDateTimeInput(e.target.value) })}
                          className="bg-black border-white/10"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={event.location || ''}
                          onChange={(e) => updateEvent(event.id, { location: e.target.value })}
                          className="bg-black border-white/10"
                          placeholder="Location (optional)"
                        />
                        <select
                          className="w-full h-10 bg-black border border-white/10 rounded-xl px-3 text-sm text-zinc-200"
                          value={event.audience || 'buyers'}
                          onChange={(e) => updateEvent(event.id, { audience: e.target.value as AgentEvent['audience'] })}
                        >
                          {EVENT_AUDIENCES.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Textarea
                        value={event.message || ''}
                        onChange={(e) => updateEvent(event.id, { message: e.target.value })}
                        className="bg-black border-white/10"
                        placeholder="Key message"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={event.ctaUrl || ''}
                          onChange={(e) => updateEvent(event.id, { ctaUrl: e.target.value })}
                          className="bg-black border-white/10"
                          placeholder="CTA link"
                        />
                        <select
                          className="w-full h-10 bg-black border border-white/10 rounded-xl px-3 text-sm text-zinc-200"
                          value={event.urgencyTone || 'normal'}
                          onChange={(e) => updateEvent(event.id, { urgencyTone: e.target.value as AgentEvent['urgencyTone'] })}
                        >
                          {URGENCY_TONES.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-widest text-zinc-500">Attachments</p>
                          <Button
                            variant="ghost"
                            className="text-xs"
                            onClick={() =>
                              updateEvent(event.id, {
                                attachments: [...(event.attachments || []), { label: '', url: '' }],
                              })
                            }
                          >
                            Add attachment
                          </Button>
                        </div>
                        {(event.attachments || []).map((attachment, index) => (
                          <div key={`${event.id}-att-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Input
                              value={attachment.label}
                              onChange={(e) => updateAttachment(event.id, index, { label: e.target.value })}
                              className="bg-black border-white/10"
                              placeholder="Attachment label"
                            />
                            <Input
                              value={attachment.url}
                              onChange={(e) => updateAttachment(event.id, index, { url: e.target.value })}
                              className="bg-black border-white/10"
                              placeholder="Attachment URL"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleSaveEvent(event)} disabled={eventsSaving === event.id}>
                          {eventsSaving === event.id ? 'Saving...' : 'Save event'}
                        </Button>
                        <Button variant="outline" onClick={() => handleDeleteEvent(event.id)} disabled={eventsSaving === event.id}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-sm text-zinc-500">No events yet. Add one to keep the agent timely.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Today notes</label>
                <Textarea
                  value={profile.timelyNotes.text || ''}
                  onChange={(e) => updateProfile({ timelyNotes: { ...profile.timelyNotes, text: e.target.value } })}
                  className="bg-black border-white/10"
                  placeholder="Owner traveling this week — response time 2–3 hours."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500">Notes expiry (optional)</label>
                <Input
                  type="datetime-local"
                  value={toLocalDateTimeInput(profile.timelyNotes.expiresAt || '')}
                  onChange={(e) =>
                    updateProfile({
                      timelyNotes: { ...profile.timelyNotes, expiresAt: fromLocalDateTimeInput(e.target.value) },
                    })
                  }
                  className="bg-black border-white/10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle>Refiner</CardTitle>
              <CardDescription>Increase performance with small fixes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {refinerIssues.length ? (
                <>
                  <ul className="space-y-2 text-sm text-zinc-300">
                    {refinerIssues.map((issue) => (
                      <li key={issue}>• {issue}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={applyFixes}>Fix for me</Button>
                    <Button variant="outline" onClick={() => toast({ title: 'Review saved for later' })}>
                      I’ll review myself
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-emerald-300">All checks look good.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => saveProfile(profile)} disabled={saving}>
              {saving ? 'Saving...' : 'Save advanced settings'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
