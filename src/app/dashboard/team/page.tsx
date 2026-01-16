'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { authorizedFetch } from '@/lib/auth-fetch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type InviteRecord = {
  id: string;
  email: string;
  role: string;
  status?: string;
};

export default function TeamDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [invites, setInvites] = useState<InviteRecord[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [sendingInvite, setSendingInvite] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'You';
  const initials = useMemo(() => {
    const parts = displayName.split(' ').filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    return letters || displayName.slice(0, 2).toUpperCase();
  }, [displayName]);

  const loadInvites = async () => {
    if (!user) return;
    setLoadingInvites(true);
    try {
      const res = await authorizedFetch('/api/team/invites', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load invites');
      const data = await res.json();
      setInvites(data.invites || []);
    } catch (error) {
      console.error('Failed to load invites', error);
    } finally {
      setLoadingInvites(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoadingInvites(false);
      return;
    }
    loadInvites();
  }, [user]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({ title: 'Add an email address', variant: 'destructive' });
      return;
    }
    if (!user) {
      toast({ title: 'Sign in to invite teammates', variant: 'destructive' });
      return;
    }
    setSendingInvite(true);
    try {
      const res = await authorizedFetch('/api/team/invites', {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Invite failed');
      }
      toast({ title: 'Invite sent', description: `We emailed ${inviteEmail.trim()}.` });
      setInviteEmail('');
      await loadInvites();
    } catch (error: any) {
      toast({
        title: 'Could not send invite',
        description: error?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSendingInvite(false);
    }
  };

  return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team</h1>
                <p className="text-muted-foreground">Invite teammates and control access.</p>
            </div>
            <Button className="gap-2" onClick={handleInvite} disabled={sendingInvite}>
                {sendingInvite ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Send Invite
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People who can access your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                {user?.photoURL ? <AvatarImage src={user.photoURL} /> : null}
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{displayName}</p>
                                <p className="text-sm text-muted-foreground">{user?.email || 'Signed in'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="min-w-[80px] justify-center">Owner</Badge>
                            <Badge variant="secondary">Active</Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-zinc-900/40 border-white/5">
            <CardHeader>
                <CardTitle>Invite Teammate</CardTitle>
                <CardDescription>Send an invite to join your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</label>
                        <Input
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="h-11 bg-black/40 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Role</label>
                        <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                            <option value="Owner">Owner</option>
                        </select>
                    </div>
                </div>
                <Button className="gap-2" onClick={handleInvite} disabled={sendingInvite}>
                    {sendingInvite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Send Invite
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Invites Pending</CardTitle>
                <CardDescription>People you have invited but have not joined yet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loadingInvites ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading invites...
                    </div>
                ) : invites.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No invites yet.</p>
                ) : (
                    invites.map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                            <div>
                                <p className="font-medium">{invite.email}</p>
                                <p className="text-sm text-muted-foreground">{invite.role}</p>
                            </div>
                            <Badge variant="outline" className="uppercase text-[10px] tracking-widest">
                                {invite.status || 'Pending'}
                            </Badge>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    </div>
  );
}
