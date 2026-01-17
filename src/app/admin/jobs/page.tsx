'use client';

import React, { useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import { subscribeToJobs, createJob, processJob, Job } from '@/lib/jobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Play, Terminal, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';

export default function JobsDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, authLoading] = useAuthState(getAuth());

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const tenantId = user.uid;
    const unsubscribe = subscribeToJobs(tenantId, (data) => {
        setJobs(data);
        setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleCreateTestJob = async () => {
    if (!user) return;
    const tenantId = user.uid;
    const newJob = await createJob(tenantId, 'site_generation', { prompt: 'Luxury Villa' });
    processJob(newJob.id as string);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-500 text-lg">Sign in to monitor background jobs.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">System Logs</h1>
            <p className="text-zinc-500 text-lg font-light">Monitor real-time background workload and system orchestration.</p>
          </div>
          <div className="flex gap-3">
            <Button 
                onClick={handleCreateTestJob}
                className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-xl shadow-blue-600/20"
            >
              <Play className="h-5 w-5 mr-2" />
              Trigger System Test
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard label="Active Jobs" value={jobs.filter(j => j.status === 'running').length.toString()} icon={RefreshCw} color="blue" />
            <StatsCard label="Queue Depth" value={jobs.filter(j => j.status === 'queued').length.toString()} icon={Terminal} color="zinc" />
            <StatsCard label="Completed" value={jobs.filter(j => j.status === 'done').length.toString()} icon={CheckCircle2} color="green" />
            <StatsCard label="System Faults" value={jobs.filter(j => j.status === 'error').length.toString()} icon={AlertCircle} color="red" />
        </div>

        <Card className="border-white/5 bg-zinc-900/50 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                        <Terminal className="h-5 w-5 text-blue-500" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Execution Pipeline</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-white/5">
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest px-8">Process ID</TableHead>
                            <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Orchestrator</TableHead>
                            <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                            <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Progress</TableHead>
                            <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest text-right px-8">Timestamp</TableHead>
                            <TableHead className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest text-right px-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center">
                                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : jobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-40 text-zinc-500 font-light text-lg">
                                    No active processes in pipeline.
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <Fragment key={job.id}>
                                <TableRow className="border-white/5 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-mono text-xs text-blue-500 px-8"># {job.id.slice(0, 12)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-white capitalize">{job.type.replace('_', ' ')}</span>
                                            <span className="text-[10px] text-zinc-600 font-mono italic">{job.plan.flowId}</span>
                                            {job.type === 'site_refiner' && (
                                                <>
                                                    <span className="text-[10px] text-zinc-500 mt-1">
                                                        Site: {job.plan?.params?.siteTitle || job.plan?.params?.siteId || 'Pending save'}
                                                    </span>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {job.plan?.steps?.map((step) => (
                                                            <Badge key={step} variant="secondary" className="bg-white/5 text-white text-[10px] border-white/10">
                                                                {REFINER_STEP_COPY[step] || step}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={job.status} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        job.status === 'done' ? "bg-green-500 w-full" : 
                                                        job.status === 'running' ? "bg-blue-500 w-1/2 animate-pulse" : 
                                                        "bg-zinc-700 w-0"
                                                    )}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-500">{job.steps?.length || 0}/{job.plan.steps.length}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-xs text-right px-8 font-mono">
                                        {job.createdAt ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true }) : 'Now'}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        {job.type === 'site_refiner' && job.plan?.params?.siteId ? (
                                            <Link href={`/builder?siteId=${job.plan.params.siteId}&variant=refined`}>
                                                <Button size="sm" variant="outline" className="rounded-full text-xs">
                                                    View Refined
                                                </Button>
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-zinc-600">—</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <JobStepsRow job={job} />
                                </Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}

const STEP_STATUS_COPY: Record<string, string> = {
    pending: 'Queued',
    running: 'Running',
    done: 'Complete',
    error: 'Error',
};

const STEP_STATUS_STYLES: Record<
    'pending' | 'running' | 'done' | 'error',
    { badge: string; container: string }
> = {
    pending: {
        badge: 'bg-zinc-900/70 text-zinc-400 border-zinc-700',
        container: 'border-zinc-800 bg-black/40',
    },
    running: {
        badge: 'bg-blue-500/15 text-blue-200 border-blue-400/30',
        container: 'border-blue-500/30 bg-blue-500/5',
    },
    done: {
        badge: 'bg-emerald-500/15 text-emerald-100 border-emerald-400/40',
        container: 'border-emerald-500/20 bg-emerald-500/5',
    },
    error: {
        badge: 'bg-red-500/15 text-red-100 border-red-400/30',
        container: 'border-red-500/30 bg-red-500/5',
    },
};

function JobStepsRow({ job }: { job: Job }) {
    const steps = job.steps || [];
    const totalPlanned = job.plan?.steps?.length || 0;
    const title = job.type === 'site_refiner' ? 'Refiner timeline' : 'Step timeline';

    return (
        <TableRow className="border-white/5 bg-black/40">
            <TableCell colSpan={6} className="px-8 py-5">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                        <span>{title}</span>
                        <span className="text-zinc-600 font-mono tracking-normal">
                            ({steps.length}/{totalPlanned} recorded)
                        </span>
                        {job.type === 'site_refiner' && job.plan?.params?.siteTitle && (
                            <span className="text-xs text-amber-300 font-semibold tracking-normal normal-case">
                                {job.plan.params.siteTitle}
                            </span>
                        )}
                    </div>
                    {steps.length === 0 ? (
                        <p className="text-sm text-zinc-500">
                            Awaiting worker telemetry. Steps will populate as soon as the job reports progress.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {steps.map((step, index) => {
                                const friendlyName = REFINER_STEP_COPY[step.name] || step.name;
                                const style = STEP_STATUS_STYLES[step.status as keyof typeof STEP_STATUS_STYLES] || STEP_STATUS_STYLES.pending;
                                const timeAgo = step.timestamp ? formatDistanceToNow(new Date(step.timestamp), { addSuffix: true }) : 'just now';
                                return (
                                    <div 
                                        key={`${job.id}-${step.name}-${index}`}
                                        className={cn("rounded-2xl border p-4 shadow-inner", style.container)}
                                    >
                                        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                                            <Badge className={cn("border text-[10px]", style.badge)}>
                                                {STEP_STATUS_COPY[step.status] || step.status}
                                            </Badge>
                                            <span className="text-zinc-500 font-mono lowercase">{timeAgo}</span>
                                        </div>
                                        <p className="text-sm text-white font-semibold mt-3">{friendlyName}</p>
                                        {step.result && (
                                            <p className="text-xs text-zinc-400 mt-1">{step.result}</p>
                                        )}
                                        {step.error && (
                                            <p className="text-xs text-red-400 mt-1">{step.error}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

function StatsCard({ label, value, icon: Icon, color }: any) {
    const colors: any = {
        blue: "text-blue-500 bg-blue-500/10",
        zinc: "text-zinc-500 bg-zinc-500/10",
        green: "text-green-500 bg-green-500/10",
        red: "text-red-500 bg-red-500/10"
    };

    return (
        <Card className="border-white/5 bg-zinc-900/30 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{label}</p>
                <div className={cn("p-2 rounded-lg", colors[color])}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        queued: "bg-zinc-900 text-zinc-500 border-zinc-800",
        running: "bg-blue-600/10 text-blue-500 border-blue-500/20 animate-pulse",
        done: "bg-green-600/10 text-green-500 border-green-500/20",
        error: "bg-red-600/10 text-red-500 border-red-500/20",
    };
    return (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", styles[status as keyof typeof styles])}>
            {status}
        </span>
    )
}

const REFINER_STEP_COPY: Record<string, string> = {
    analyzeStructure: 'Structure Scan',
    applyRefinements: 'Polish',
    finalReview: 'QA Review',
};
