'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Users, 
  MessageCircle, 
  Phone, 
  Mail, 
  ArrowUpRight, 
  MoreHorizontal, 
  Filter,
  Download,
  Plus,
  Zap,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { authorizedFetch } from '@/lib/auth-fetch';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';

interface LeadRecord {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  priority?: 'Hot' | 'Warm' | 'Cold';
  source?: string;
  project?: string;
  createdAt?: string;
  message?: string;
}

interface Note {
    id: string;
    content: string;
    createdAt: string;
}

export default function LeadCrmPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, authLoading] = useAuthState(getAuth());
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadRecord['status']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | LeadRecord['priority']>('all');
  const [isAddLeadOpen, setAddLeadOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [crmWebhookUrl, setCrmWebhookUrl] = useState('');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      setLoading(true);
      const params = new URLSearchParams({
        tenantId: user.uid,
        limit: '20',
      });
      const res = await authorizedFetch(`/api/leads/list?${params.toString()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data || []);
      } else {
        setLeads([]);
        setError(res.status === 403 ? 'You are not authorized to view this data.' : 'Failed to load leads.');
      }
    } catch (fetchError) {
      console.error('Failed to load leads', fetchError);
      setLeads([]);
      setError('An unexpected error occurred while fetching leads.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    try {
      setSettingsLoading(true);
      const res = await authorizedFetch('/api/leads/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setNotificationEmail(data.settings?.notificationEmail || '');
        setCrmWebhookUrl(data.settings?.crmWebhookUrl || '');
      }
    } catch (fetchError) {
      console.error('Failed to load lead settings', fetchError);
    } finally {
      setSettingsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    if (!user) {
      setLeads([]);
      setLoading(false);
      setError('Please sign in to access your lead intelligence dashboard.');
      return;
    }
    loadLeads();
    loadSettings();
  }, [authLoading, loadLeads, loadSettings, user]);

  const filteredLeads = leads.filter(lead => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm ? 
        (lead.name?.toLowerCase().includes(searchTermLower) ||
         lead.email?.toLowerCase().includes(searchTermLower) ||
         lead.phone?.toLowerCase().includes(searchTermLower))
        : true;

    const matchesStatus = statusFilter !== 'all' ? lead.status === statusFilter : true;
    const matchesPriority = priorityFilter !== 'all' ? lead.priority === priorityFilter : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const now = Date.now();
  const newIn24h = leads.filter((lead) => {
    if (!lead.createdAt) return false;
    const timestamp = Date.parse(lead.createdAt);
    return !Number.isNaN(timestamp) && now - timestamp <= 24 * 60 * 60 * 1000;
  }).length;
  const hotLeads = leads.filter((lead) => (lead.priority || '').toLowerCase() === 'hot').length;
  const qualifiedLeads = leads.filter((lead) => (lead.status || '').toLowerCase() === 'qualified').length;
  const isAuthenticated = Boolean(user);

  const handleLeadAdded = () => {
    loadLeads();
    setAddLeadOpen(false);
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      setSettingsSaving(true);
      setSettingsMessage(null);
      const res = await authorizedFetch('/api/leads/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationEmail: notificationEmail || null,
          crmWebhookUrl: crmWebhookUrl || null,
        }),
      });
      if (res.ok) {
        setSettingsMessage('Saved!');
      } else {
        setSettingsMessage('Could not save settings.');
      }
    } catch (error) {
      console.error('Failed to save lead settings', error);
      setSettingsMessage('Could not save settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleExport = () => {
    if (!leads.length) return;
    const headers = ['Name', 'Email', 'Phone', 'Project', 'Source', 'Status', 'Priority', 'Created At'];
    const rows = leads.map((lead) => ([
      lead.name || '',
      lead.email || '',
      lead.phone || '',
      lead.project || '',
      lead.source || '',
      lead.status || '',
      lead.priority || '',
      lead.createdAt || '',
    ]));
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `entrestate-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleJumpToSettings = () => {
    const el = document.getElementById('lead-settings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Leads</h1>
          <p className="text-zinc-500 text-xl font-light">Track, qualify, and follow up with every inquiry in one place.</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              className="flex-1 lg:flex-none h-12 rounded-full border-white/10 bg-white/5 text-zinc-400 font-bold gap-2"
              onClick={handleExport}
              disabled={!leads.length}
            >
                <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button className="flex-1 lg:flex-none h-12 rounded-full bg-blue-600 hover:bg-blue-700 font-bold gap-2" onClick={() => setAddLeadOpen(true)}>
                <Plus className="h-4 w-4" /> Add Lead
            </Button>
        </div>
      </div>

      {isAuthenticated ? (
        <>
        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard label="Total Leads" value={leads.length.toString()} trend={leads.length ? `+${newIn24h} today` : undefined} icon={Users} />
            <MetricCard label="Hot Leads" value={hotLeads.toString()} icon={Zap} />
            <MetricCard label="Qualified" value={qualifiedLeads.toString()} icon={Target} />
            <MetricCard label="Active Channels" value="4" icon={MessageCircle} active />
        </div>

        {/* Main CRM View */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Leads Table */}
          <Card className="lg:col-span-2 bg-zinc-950 border-white/5 rounded-[2.5rem] overflow-hidden">
             <CardHeader className="p-10 border-b border-white/5 bg-zinc-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className='flex-1'>
                    <CardTitle className="text-xl">Lead Inbox</CardTitle>
                    <CardDescription>Real-time feed of all incoming investor inquiries.</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Input 
                        placeholder='Search leads...'
                        className='bg-zinc-900 border-white/5 h-10 rounded-xl w-48'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 rounded-xl gap-2 border-white/10 bg-white/5">
                                <Filter className="h-4 w-4" /> 
                                <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white">
                            <DropdownMenuItem onClick={() => setStatusFilter('all')}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('New')}>New</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Contacted')}>Contacted</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Qualified')}>Qualified</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter('Lost')}>Lost</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 rounded-xl gap-2 border-white/10 bg-white/5">
                                <Filter className="h-4 w-4" /> 
                                <span>Priority: {priorityFilter === 'all' ? 'All' : priorityFilter}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-white">
                            <DropdownMenuItem onClick={() => setPriorityFilter('all')}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriorityFilter('Hot')}>Hot</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriorityFilter('Warm')}>Warm</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setPriorityFilter('Cold')}>Cold</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-10 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-400 text-sm">
                            {error}
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-10 text-center text-zinc-500 text-sm">
                            Your lead inbox is currently empty. As new leads come in, they will appear here.
                        </div>
                    ) : (
                    filteredLeads.map(lead => (
                        <div key={lead.id} className="p-8 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer" onClick={() => setSelectedLead(lead)}>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-500 font-bold text-xl">
                                    {lead.name?.charAt(0) || '?'}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-white text-lg leading-none">{lead.name || 'Unnamed Lead'}</h4>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                        <span className="text-blue-500">{lead.source || 'Website'}</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span>{lead.project || 'General Inquiry'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="text-right hidden sm:block">
                                    <Badge className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-0",
                                        (lead.priority || '').toLowerCase() === 'hot' ? "bg-orange-500 text-white" :
                                        (lead.priority || '').toLowerCase() === 'warm' ? "bg-yellow-500 text-white" :
                                        "bg-zinc-800 text-zinc-400"
                                    )}>
                                        {(lead.priority || 'Cold').toUpperCase()}
                                    </Badge>
                                    <p className="text-[10px] text-zinc-600 font-bold mt-2 flex items-center justify-end gap-1.5 uppercase">
                                        <Clock className="h-3 w-3" /> {lead.createdAt ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true }) : 'Just now'}
                                    </p>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border border-white/5 bg-white/5 opacity-0 group-hover:opacity-100 transition-all text-zinc-400 hover:text-white hover:bg-blue-600 hover:border-blue-600">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Qualified</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Lost</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )))}
                </div>
                <div className="p-6 text-center border-t border-white/5 bg-zinc-900/20">
                    <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-all">View All Leads</button>
                </div>
             </CardContent>
          </Card>

          {/* CRM Connection Panel */}
          <div className="space-y-6">
             <Card className="bg-blue-600 border-none text-white rounded-[2.5rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Zap className="h-40 w-40" />
                </div>
                <CardHeader className="relative z-10 p-10 pb-6">
                    <CardTitle className="text-2xl font-black leading-tight uppercase">Instant Lead <br/>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 p-10 pt-0 space-y-8">
                    <p className="text-blue-100 font-medium">Never miss an opportunity. Get new leads delivered directly to your phone via WhatsApp or SMS in real-time.</p>
                    <Button
                        className="w-full h-14 rounded-2xl bg-white text-blue-600 font-black text-lg hover:bg-zinc-100 shadow-xl"
                        onClick={handleJumpToSettings}
                    >
                        Add Notification Email
                    </Button>
                </CardContent>
             </Card>

             <Card id="lead-settings" className="bg-zinc-950 border-white/5 rounded-[2.5rem] p-10 space-y-8">
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lead Notifications</h4>
                    <p className="text-sm text-zinc-400">Every new lead is sent to this email.</p>
                    <Input
                        placeholder="you@brokerage.com"
                        className="bg-black/40 border-white/10 h-12 rounded-xl"
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                        disabled={settingsLoading}
                    />
                </div>
                <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">CRM Connection Link (Optional)</h4>
                    <p className="text-sm text-zinc-400">Paste your CRM connection link to auto-send new leads.</p>
                    <Input
                        placeholder="https://connect.your-crm.com/lead"
                        className="bg-black/40 border-white/10 h-12 rounded-xl"
                        value={crmWebhookUrl}
                        onChange={(e) => setCrmWebhookUrl(e.target.value)}
                        disabled={settingsLoading}
                    />
                </div>
                <Button
                    className="w-full h-12 rounded-xl bg-white text-black font-bold"
                    onClick={handleSaveSettings}
                    disabled={settingsSaving || settingsLoading}
                >
                    {settingsSaving ? 'Saving…' : 'Save Settings'}
                </Button>
                {settingsMessage && (
                    <p className="text-xs text-green-500 font-semibold">{settingsMessage}</p>
                )}
                <Separator className="bg-white/5" />
                <p className="text-xs text-zinc-500">
                    Want a direct HubSpot or Salesforce connector? Share your request and we will set it up.
                </p>
             </Card>
          </div>

        </div>
        </>
      ) : (
        <AuthRequiredNotice isLoading={authLoading} message={error} />
      )}
      
      <AddLeadDialog open={isAddLeadOpen} onOpenChange={setAddLeadOpen} onLeadAdded={handleLeadAdded} />

      {selectedLead && (
        <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={loadLeads} />
      )}
    </div>
  );
}

function LeadDetailPanel({ lead, onClose, onUpdate }: { lead: LeadRecord, onClose: () => void, onUpdate: () => void }) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loadingNotes, setLoadingNotes] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const loadNotes = useCallback(async () => {
        try {
            setLoadingNotes(true);
            const res = await authorizedFetch(`/api/leads/notes/list?leadId=${lead.id}`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data.notes || []);
            } else {
                console.error("Failed to load notes");
            }
        } catch (error) {
            console.error('Failed to load notes', error);
        } finally {
            setLoadingNotes(false);
        }
    }, [lead.id]);

    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        try {
            const res = await authorizedFetch('/api/leads/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: lead.id, note: newNote }),
            });
            if (res.ok) {
                setNewNote('');
                loadNotes();
            } else {
                console.error("Failed to add note");
            }
        } catch (error) {
            console.error("Failed to add note", error);
        }
    };

    const handleStatusUpdate = async (status: LeadRecord['status']) => {
        setIsUpdating(true);
        try {
            const res = await authorizedFetch(`/api/leads/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId: lead.id, status }),
            });
            if (res.ok) {
                onUpdate(); 
                onClose();
            } else {
                console.error('Failed to update lead status');
            }
        } catch (error) {
            console.error('Failed to update lead status', error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white rounded-3xl">
                <DialogHeader className="p-8 border-b border-white/5">
                    <DialogTitle className="text-2xl font-black">{lead.name || 'Unnamed Lead'}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {lead.email} {lead.phone && `· ${lead.phone}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-6 px-8 max-h-[60vh] overflow-y-auto space-y-6">
                    {lead.message && (
                        <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
                             <p className="text-sm text-zinc-300 italic">{lead.message}</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Notes</h3>
                         {loadingNotes ? (
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        ) : (
                            notes.length > 0 ? (
                                <div className="space-y-3">
                                {notes.map(note => (
                                    <div key={note.id} className="p-4 bg-zinc-900 rounded-lg">
                                        <p className="text-sm text-zinc-300">{note.content}</p>
                                        <p className="text-xs text-zinc-500 mt-2">{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</p>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-500 italic">No notes yet.</p>
                            )
                        )}
                    </div>
                    <div className="space-y-2">
                        <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a new note..." className="bg-zinc-900 border-white/10" />
                        <Button onClick={handleAddNote} size="sm" className="font-semibold">Add Note</Button>
                    </div>
                </div>
                <DialogFooter className="p-8 border-t border-white/5 flex-col space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 self-start">Update Status</p>
                     <div className="grid grid-cols-2 gap-2 w-full">
                        <Button onClick={() => handleStatusUpdate('Contacted')} variant="outline">Contacted</Button>
                        <Button onClick={() => handleStatusUpdate('Qualified')} variant="outline">Qualified</Button>
                        <Button onClick={() => handleStatusUpdate('Lost')} variant="outline" className="text-red-500">Lost</Button>
                        <Button onClick={onClose} variant="secondary">Cancel</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function MetricCard({ label, value, trend, icon: Icon, active }: any) {
    return (
        <Card className="bg-zinc-900/50 border-white/5 rounded-[2rem]">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{label}</p>
                    <Icon className={cn("h-4 w-4", active ? "text-blue-500" : "text-zinc-700")} />
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white leading-none">{value}</span>
                    {trend && <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{trend}</span>}
                </div>
            </CardContent>
        </Card>
    )
}

function AuthRequiredNotice({ isLoading, message }: { isLoading: boolean; message: string | null }) {
    return (
        <Card className="bg-zinc-950 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center space-y-6">
            <CardHeader className="space-y-4">
                <CardTitle className="text-3xl font-black uppercase tracking-tight text-white">
                    {isLoading ? 'Verifying Access' : 'Access Restricted'}
                </CardTitle>
                <CardDescription className="text-zinc-500 text-base max-w-md mx-auto">
                    {isLoading ? 'Checking your credentials to unlock your lead manager.' : (message || 'Please sign in to access your leads dashboard.')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    <Button
                        className="h-12 px-10 rounded-full bg-blue-600 font-bold text-white hover:bg-blue-700"
                        onClick={() => window.location.assign('/login')}
                    >
                        Go to Sign In
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
