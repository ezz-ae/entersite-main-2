'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageBuilder } from '@/components/page-builder';
import { EditorHeader } from '@/components/editor/header/editor-header';
import { LeftSidebar } from '@/components/editor/sidebar/left-sidebar';
import { RightSidebar } from '@/components/editor/sidebar/right-sidebar';
import { BuilderLandingPage } from '@/components/builder-landing-page';
import { PublishSuccessDialog } from '@/components/publish-success-dialog';
import { SeoSettingsDialog } from '@/components/seo-settings-dialog';
import { PageRenderer } from '@/components/page-renderer';
import { SitePage, Block } from '@/lib/types';
import { Loader2, Sparkles, ArrowLeftRight } from 'lucide-react';
import { saveSite, getUserSites, updateSiteMetadata } from '@/lib/firestore-service';
import { useToast } from '@/hooks/use-toast';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '@/lib/utils';
import { getBlueprintTemplate } from '@/lib/onboarding-blueprints';
import { createJob, subscribeToJobs, Job } from '@/lib/jobs';
import { ToastAction } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const INITIAL_PAGE_STATE: SitePage = {
    id: '',
    title: 'Untitled Site',
    blocks: [],
    canonicalListings: [],
    brochureUrl: '',
    tenantId: 'public',
    seo: {
        title: '',
        description: '',
        keywords: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

function BuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialPrompt = searchParams.get('prompt');
    const templateId = searchParams.get('template');
    const blueprintId = searchParams.get('blueprint');
    const siteIdParam = searchParams.get('siteId');
    const variantParam = searchParams.get('variant');
    const { toast } = useToast();
    const [user] = useAuthState(getAuth());

    const [isStarted, setIsStarted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [page, setPage] = useState<SitePage>(INITIAL_PAGE_STATE);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
    const [isLoadingSite, setIsLoadingSite] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [activeRefinerJobId, setActiveRefinerJobId] = useState<string | null>(null);
    const [isApplyingRefinerDraft, setIsApplyingRefinerDraft] = useState(false);
    const [refinerDraft, setRefinerDraft] = useState<SitePage | null>(null);
    const [refinerDraftHtml, setRefinerDraftHtml] = useState<string | null>(null);
    const [refinerPreviewUrl, setRefinerPreviewUrl] = useState<string | null>(null);
    const refinerStatusRef = useRef<string | null>(null);
    const isRefinerReview = variantParam === 'refined';
    const previewModeEnabled = isRefinerReview || isPreviewMode;

    const loadSite = useCallback(async (id: string) => {
        if (!user) return;
        setIsLoadingSite(true);
        setIsStarted(true);
        try {
            const sites = await getUserSites(user.uid);
            const found = sites.find(s => s.id === id);
            if (found) {
                setPage(found as SitePage);
            } else {
                toast({
                    title: "Site not found",
                    description: "We couldn't find the requested project.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Load failed:", error);
        } finally {
            setIsLoadingSite(false);
        }
    }, [toast, user]);

    const handleStartWithAI = useCallback(async (prompt: string) => {
        setIsStarted(true);
        setIsGenerating(true);
        
        try {
            const response = await fetch('/api/ai/generate-site', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPage(prev => ({ 
                    ...prev, 
                    title: data.pageTitle || data.title || 'AI Generated Site',
                    blocks: data.blocks.map((b: any, i: number) => ({
                        ...b,
                        blockId: `\${b.type}-\${i}-\${Date.now()}`,
                        order: i
                    })),
                    seo: data.seo || prev.seo
                }));
            }
        } catch (error) {
            console.error("Failed to generate site:", error);
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const applyBlueprint = useCallback((id: string) => {
        const template = getBlueprintTemplate(id);
        if (template) {
            setIsStarted(true);
            setPage(template);
        }
    }, []);

    // Effect to handle loading an existing site
    useEffect(() => {
        if (siteIdParam && user) {
            loadSite(siteIdParam);
        } else if (initialPrompt) {
            handleStartWithAI(initialPrompt);
        } else if (blueprintId) {
            applyBlueprint(blueprintId);
        } else if (templateId) {
            setIsStarted(true);
        }
    }, [applyBlueprint, blueprintId, handleStartWithAI, initialPrompt, loadSite, siteIdParam, templateId, user]);

    useEffect(() => {
        if (user && (!page.tenantId || page.tenantId === 'public') && page.tenantId !== user.uid) {
            setPage((prev) => {
                if (prev.tenantId && prev.tenantId !== 'public') {
                    return prev;
                }
                return { ...prev, tenantId: user.uid };
            });
        }
    }, [page.tenantId, user]);

    useEffect(() => {
        if (isRefinerReview) {
            setIsPreviewMode(true);
        }
    }, [isRefinerReview]);

    useEffect(() => {
        setRefinerDraft(page.refinerDraftSnapshot || null);
        setRefinerDraftHtml(page.refinerDraftHtml || null);
        setRefinerPreviewUrl(page.refinerPreviewUrl || null);
    }, [page.refinerDraftSnapshot, page.refinerDraftHtml, page.refinerPreviewUrl]);

    const removeVariantFromUrl = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('variant');
        const query = params.toString();
        router.replace(query ? `/builder?${query}` : '/builder');
    }, [router, searchParams]);

    const persistRefinerMetadata = useCallback(async (status: SitePage['refinerStatus'], extra?: Partial<SitePage>) => {
        if (!page.id) return;
        try {
            await updateSiteMetadata(page.id, {
                refinerStatus: status,
                ...extra,
            });
        } catch (error) {
            console.error('Failed to persist refiner metadata', error);
        }
    }, [page.id]);

    const handleSave = async () => {
        if (!user) {
            toast({
                title: "Please Sign In",
                description: "Please sign in to save your progress.",
                variant: "destructive"
            });
            return;
        }
        
        try {
            const savedSiteId = await saveSite(user.uid, page);
            if (!page.id) {
                setPage(prev => ({ ...prev, id: savedSiteId }));
                router.replace(`/builder?siteId=\${savedSiteId}`);
            }
            toast({
                title: "Site saved",
                description: "Your progress has been saved successfully.",
            });
        } catch (error) {
            console.error("Save failed:", error);
            toast({
                title: "Save failed",
                description: "There was an error saving your site.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        if (!user) return;
        const unsubscribe = subscribeToJobs(user.uid, (jobList) => {
            const targetJob = jobList.find((job) => {
                if (job.type !== 'site_refiner') return false;
                if (activeRefinerJobId) {
                    return job.id === activeRefinerJobId;
                }
                if (page.lastRefinerJobId) {
                    return job.id === page.lastRefinerJobId;
                }
                return job.plan?.params?.siteId === page.id;
            });
            if (!targetJob) return;

            const artifacts = extractRefinerArtifacts(targetJob);
            setRefinerDraft(artifacts.snapshot);
            setRefinerDraftHtml(artifacts.html);
            setRefinerPreviewUrl(artifacts.previewUrl);
            const baseSnapshotFromJob = ensureSitePage(targetJob.plan?.params?.snapshot);

            if (refinerStatusRef.current === targetJob.status) return;
            refinerStatusRef.current = targetJob.status;

            const siteId = targetJob.plan?.params?.siteId || page.id;
            const siteTitle = targetJob.plan?.params?.siteTitle || page.title;

            if (targetJob.status === 'queued') {
                setIsRefining(true);
                setRefinerDraft(null);
                setRefinerDraftHtml(null);
                setRefinerPreviewUrl(null);
                setPage((prev) => ({
                    ...prev,
                    refinerStatus: 'queued',
                    lastRefinerJobId: targetJob.id,
                    refinerBaseSnapshot: baseSnapshotFromJob || prev.refinerBaseSnapshot,
                }));
                persistRefinerMetadata('queued', {
                    lastRefinerJobId: targetJob.id,
                    ...(baseSnapshotFromJob ? { refinerBaseSnapshot: baseSnapshotFromJob } : {}),
                });
            } else if (targetJob.status === 'running') {
                setIsRefining(true);
                setRefinerDraft(null);
                setRefinerDraftHtml(null);
                setRefinerPreviewUrl(null);
                setPage((prev) => ({
                    ...prev,
                    refinerStatus: 'running',
                    lastRefinerJobId: targetJob.id,
                    refinerBaseSnapshot: baseSnapshotFromJob || prev.refinerBaseSnapshot,
                }));
                persistRefinerMetadata('running', {
                    lastRefinerJobId: targetJob.id,
                    ...(baseSnapshotFromJob ? { refinerBaseSnapshot: baseSnapshotFromJob } : {}),
                });
                toast({
                    title: 'Refiner AI running',
                    description: 'Analyzing structure and applying finishing touches.',
                });
            } else if (targetJob.status === 'done') {
                setIsRefining(false);
                setActiveRefinerJobId(null);
                toast({
                    title: 'Refiner complete',
                    description: `Review the refined draft of ${siteTitle}.`,
                    action: siteId ? (
                        <ToastAction
                            altText="Open refined draft"
                            onClick={() => router.push(`/builder?siteId=${siteId}&variant=refined`)}
                        >
                            Open Draft
                        </ToastAction>
                    ) : undefined,
                });
                const completedAt = new Date().toISOString();
                setPage((prev) => ({
                    ...prev,
                    refinerStatus: 'review',
                    lastRefinedAt: completedAt,
                    lastRefinerJobId: targetJob.id,
                    refinerDraftSnapshot: artifacts.snapshot || prev.refinerDraftSnapshot,
                    refinerDraftHtml: artifacts.html ?? prev.refinerDraftHtml,
                    refinerPreviewUrl: artifacts.previewUrl ?? prev.refinerPreviewUrl,
                }));
                persistRefinerMetadata('review', {
                    lastRefinedAt: completedAt,
                    lastRefinerJobId: targetJob.id,
                    ...(artifacts.snapshot ? { refinerDraftSnapshot: artifacts.snapshot } : {}),
                    ...(artifacts.html ? { refinerDraftHtml: artifacts.html } : {}),
                    ...(artifacts.previewUrl ? { refinerPreviewUrl: artifacts.previewUrl } : {}),
                });
            } else if (targetJob.status === 'error') {
                setIsRefining(false);
                setRefinerDraft(null);
                setRefinerDraftHtml(null);
                setRefinerPreviewUrl(null);
                setPage((prev) => ({
                    ...prev,
                    refinerStatus: 'error',
                    lastRefinerJobId: targetJob.id,
                }));
                persistRefinerMetadata('error', {
                    lastRefinerJobId: targetJob.id,
                });
                toast({
                    title: 'Refiner failed',
                    description: 'Save your site and try again.',
                    variant: 'destructive',
                });
            }
        });
        return () => unsubscribe();
    }, [user, page.id, page.title, page.lastRefinerJobId, activeRefinerJobId, router, toast, persistRefinerMetadata]);

    const handleRefinerRun = async () => {
        if (!user) {
            toast({
                title: "Please Sign In",
                description: "Sign in to run Refiner AI.",
                variant: "destructive",
            });
            return;
        }
        if (!page.id) {
            toast({
                title: "Save required",
                description: "Save your site before running Refiner AI.",
                variant: "destructive",
            });
            return;
        }
        setIsRefining(true);
        const baseSnapshot = cloneSitePage(page);
        try {
            const jobRecord = await createJob(user.uid, 'site_refiner', {
                siteId: page.id,
                siteTitle: page.title,
                tenantId: page.tenantId || user.uid,
                snapshot: baseSnapshot,
            });
            if (jobRecord?.id) {
                setActiveRefinerJobId(jobRecord.id);
                refinerStatusRef.current = 'queued';
                setRefinerDraft(null);
                setRefinerDraftHtml(null);
                setRefinerPreviewUrl(null);
                setPage((prev) => ({
                    ...prev,
                    refinerStatus: 'queued',
                    lastRefinerJobId: jobRecord.id,
                    refinerBaseSnapshot: baseSnapshot,
                }));
                persistRefinerMetadata('queued', {
                    lastRefinerJobId: jobRecord.id,
                    refinerBaseSnapshot: baseSnapshot,
                });
            }
            toast({
                title: "Refiner queued",
                description: "Your design is running through Refiner AI. Check Jobs for status.",
            });
        } catch (error) {
            console.error('Failed to queue refiner job', error);
            toast({
                title: "Refiner failed",
                description: "Could not start Refiner AI. Try saving and retry.",
                variant: "destructive",
            });
            setIsRefining(false);
            setActiveRefinerJobId(null);
        }
    };

    const handleExitRefinerReview = useCallback(() => {
        removeVariantFromUrl();
        setIsPreviewMode(false);
    }, [removeVariantFromUrl]);

    const handleApplyRefinerDraft = useCallback(async () => {
        if (!user) {
            toast({
                title: 'Please Sign In',
                description: 'Sign in before applying the Refiner draft.',
                variant: 'destructive'
            });
            return;
        }
        if (!page.id) {
            toast({
                title: 'Save required',
                description: 'Save your site before applying Refiner changes.',
                variant: 'destructive'
            });
            return;
        }
        setIsApplyingRefinerDraft(true);
        const previousPageState = page;
        const updatedPage: SitePage = {
            ...page,
            refinerStatus: 'done',
            lastRefinedAt: new Date().toISOString(),
        };
        try {
            setPage(updatedPage);
            await saveSite(user.uid, updatedPage);
            setRefinerDraft(null);
            setRefinerDraftHtml(null);
            setRefinerPreviewUrl(null);
            toast({
                title: 'Refiner applied',
                description: 'Your site has been updated and marked as refined.'
            });
            removeVariantFromUrl();
            setIsPreviewMode(false);
        } catch (error) {
            console.error('Failed to apply refiner draft', error);
            setPage(previousPageState);
            toast({
                title: 'Apply failed',
                description: 'We could not save the Refiner draft. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsApplyingRefinerDraft(false);
        }
    }, [page, removeVariantFromUrl, toast, user]);

    const handlePreviewToggle = useCallback(() => {
        if (isRefinerReview) {
            handleExitRefinerReview();
            return;
        }
        setIsPreviewMode((prev) => !prev);
    }, [handleExitRefinerReview, isRefinerReview]);

    if (!isStarted) {
        return (
            <BuilderLandingPage 
                onStartWithAI={handleStartWithAI} 
                onChooseTemplate={() => setIsStarted(true)} 
            />
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-zinc-950 overflow-hidden text-white">
            <EditorHeader 
                page={page} 
                onSave={handleSave}
                onPublish={() => setIsPublishDialogOpen(true)}
                onPreview={handlePreviewToggle}
                isPreviewMode={previewModeEnabled}
                onRefine={handleRefinerRun}
                isRefining={isRefining}
            />
            
            <div className="flex-1 flex overflow-hidden">
                {!previewModeEnabled && (
                    <LeftSidebar 
                        page={page} 
                        onPageUpdate={setPage} 
                        onOpenSeo={() => setIsSeoDialogOpen(true)}
                        selectedBlockId={selectedBlock?.blockId}
                        onSelectBlock={setSelectedBlock}
                    />
                )}
                
                <main className={cn(
                    "flex-1 overflow-y-auto custom-scrollbar relative transition-all duration-500",
                    previewModeEnabled ? "bg-white p-0" : "bg-zinc-900/50 p-8"
                )}>
                    {(isGenerating || isLoadingSite) ? (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
                                <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-6 relative z-10" />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter text-white mb-2">
                                {isGenerating ? "Architecting your vision..." : "Accessing system archives..."}
                            </h2>
                        </div>
                    ) : null}
                    
                    {previewModeEnabled ? (
                        isRefinerReview ? (
                            <RefinerReviewSplit
                                page={page}
                                tenantId={page.tenantId || user?.uid || 'public'}
                                projectName={page.title}
                                onApply={handleApplyRefinerDraft}
                                onExit={handleExitRefinerReview}
                                isApplying={isApplyingRefinerDraft}
                                refinedPage={refinerDraft}
                                refinedHtml={refinerDraftHtml}
                                previewUrl={refinerPreviewUrl}
                                jobId={page.lastRefinerJobId}
                            />
                        ) : (
                            <div className="bg-white text-black min-h-full">
                                <PageRenderer 
                                  page={page} 
                                  tenantId={page.tenantId || user?.uid || 'public'} 
                                  projectName={page.title} 
                                />
                            </div>
                        )
                    ) : (
                        <div className="max-w-5xl mx-auto">
                            <PageBuilder 
                                page={page} 
                                onPageUpdate={setPage}
                                selectedBlockId={selectedBlock?.blockId}
                                onSelectBlock={setSelectedBlock}
                            />
                        </div>
                    )}
                </main>

                {!previewModeEnabled && (
                    <RightSidebar 
                        selectedBlock={selectedBlock} 
                        onUpdateBlock={(newData) => {
                            if (selectedBlock) {
                                const updatedBlocks = page.blocks.map(b => 
                                    b.blockId === selectedBlock.blockId ? { ...b, data: newData } : b
                                );
                                setPage({ ...page, blocks: updatedBlocks });
                            }
                        }}
                    />
                )}
            </div>

            <PublishSuccessDialog 
                open={isPublishDialogOpen} 
                onOpenChange={setIsPublishDialogOpen} 
                page={page}
            />

            <SeoSettingsDialog 
                open={isSeoDialogOpen}
                onOpenChange={setIsSeoDialogOpen}
                page={page}
                onSave={(seoData) => {
                    setPage({ ...page, seo: seoData });
                    toast({ title: "SEO Settings Saved" });
                }}
            />
        </div>
    );
}

interface RefinerReviewSplitProps {
    page: SitePage;
    tenantId: string;
    projectName: string;
    onApply: () => void;
    onExit: () => void;
    isApplying: boolean;
    refinedPage?: SitePage | null;
    refinedHtml?: string | null;
    previewUrl?: string | null;
    jobId?: string | null;
}

function RefinerReviewSplit({ page, tenantId, projectName, onApply, onExit, isApplying, refinedPage, refinedHtml, previewUrl, jobId }: RefinerReviewSplitProps) {
    const [viewMode, setViewMode] = React.useState<'compare' | 'original' | 'refined'>('compare');
    const hasStructuredDraft = Boolean(refinedPage);
    const hasHtmlDraft = Boolean(refinedHtml) && !hasStructuredDraft;
    const baseSnapshot = page.refinerBaseSnapshot || page;
    const refinedTenantId = refinedPage?.tenantId || tenantId;
    const refinedProjectName = refinedPage?.title || projectName;
    const compareLayout = viewMode === 'compare';

    return (
        <div className="min-h-full bg-white text-black">
            <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 via-orange-50 to-white px-6 py-5 flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Refiner Draft Ready</p>
                        <p className="text-sm text-amber-900/70">
                            Compare the original build for <span className="font-semibold text-amber-900">{projectName}</span> with the Refiner AI draft.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button variant="outline" className="rounded-full border-amber-200 text-amber-700 hover:bg-amber-50" onClick={onExit}>
                            Exit Review
                        </Button>
                        <Button 
                            onClick={onApply} 
                            disabled={isApplying} 
                            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 gap-2"
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Applying...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Apply Draft
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {['compare', 'original', 'refined'].map((mode) => (
                        <Button
                            key={mode}
                            variant={viewMode === mode ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                "rounded-full text-xs uppercase tracking-[0.3em]",
                                viewMode === mode
                                    ? 'bg-amber-600/90 hover:bg-amber-600/80'
                                    : 'border-amber-200 text-amber-800 hover:bg-amber-50'
                            )}
                            onClick={() => setViewMode(mode as typeof viewMode)}
                        >
                            {mode === 'compare' ? 'Split Compare' : mode === 'original' ? 'Original' : 'Refined'}
                        </Button>
                    ))}
                </div>
            </div>
            <div className={cn(
                "grid gap-6 p-6",
                compareLayout ? "lg:grid-cols-2" : "lg:grid-cols-1"
            )}>
                {viewMode !== 'refined' && (
                <div className="rounded-[32px] border border-zinc-200 overflow-hidden bg-white shadow-2xl shadow-zinc-200/60">
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-200 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                        <ArrowLeftRight className="h-4 w-4" />
                        Current Build
                    </div>
                    <div className="bg-white text-black">
                        <PageRenderer page={baseSnapshot} tenantId={baseSnapshot.tenantId || tenantId} projectName={baseSnapshot.title || projectName} />
                    </div>
                </div>
                )}

                {viewMode !== 'original' && (
                <div className={cn(
                    "rounded-[32px] overflow-hidden flex flex-col",
                    hasStructuredDraft || hasHtmlDraft 
                        ? "border border-blue-200 shadow-2xl shadow-blue-200/60 bg-white" 
                        : "border-2 border-dashed border-amber-200 bg-amber-50/80 text-center p-10 gap-4 shadow-[0_30px_80px_-40px_rgba(251,191,36,0.8)] items-center justify-center"
                )}>
                    {hasStructuredDraft || hasHtmlDraft ? (
                        <>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-white">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-600 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Refiner Draft
                                    </p>
                                    {jobId ? (
                                        <p className="text-[10px] font-mono text-blue-400">Job #{jobId.slice(0, 8)}</p>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-2">
                                    {previewUrl ? (
                                        <Button variant="outline" size="sm" className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50"
                                            onClick={() => window.open(previewUrl, '_blank')}
                                        >
                                            Live Preview
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                            <div className="bg-white text-black">
                                {hasStructuredDraft ? (
                                    <PageRenderer 
                                        page={refinedPage as SitePage} 
                                        tenantId={refinedTenantId} 
                                        projectName={refinedProjectName} 
                                    />
                                ) : (
                                    <div className="min-h-[400px] max-h-[1500px] overflow-auto custom-scrollbar px-8 py-6 text-left prose prose-slate">
                                        <div dangerouslySetInnerHTML={{ __html: refinedHtml || '' }} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-3 rounded-full bg-white/80 border border-amber-200 mx-auto mb-4">
                                <Sparkles className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.4em] text-amber-600 font-semibold">Draft Review</p>
                                <h3 className="text-2xl font-bold text-amber-900 mt-1">Your updates are almost ready</h3>
                            </div>
                            <p className="text-sm text-amber-900/80 max-w-md mx-auto">
                                We captured your layout and are preparing a cleaner version with clearer text and spacing.
                                The updated preview will appear here shortly.
                            </p>
                            <div className="text-left text-sm text-amber-900/80 space-y-2 mx-auto">
                                <p className="font-semibold text-amber-900 uppercase tracking-[0.3em] text-xs">What changes next</p>
                                <ul className="space-y-1">
                                    <li>• Harmonized typography scale for hero and CTA blocks.</li>
                                    <li>• Improved listing grid spacing on tablet/mobile.</li>
                                    <li>• Fresh CTA copy variations tailored for lead capture.</li>
                                </ul>
                            </div>
                            <p className="text-xs text-amber-800/70">
                                You can apply this draft now or return later from Jobs.
                            </p>
                        </>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}

const cloneSitePage = (value: SitePage): SitePage => JSON.parse(JSON.stringify(value));

interface RefinerArtifacts {
    snapshot: SitePage | null;
    html: string | null;
    previewUrl: string | null;
}

const ensureSitePage = (value: any): SitePage | null => {
    if (!value || typeof value !== 'object') return null;
    if (!Array.isArray((value as SitePage).blocks)) return null;
    return value as SitePage;
};

const extractRefinerArtifacts = (job?: Job | null): RefinerArtifacts => {
    if (!job || job.status !== 'done') {
        return { snapshot: null, html: null, previewUrl: null };
    }
    const root = (job.result || (job as any)?.output || {}) as Record<string, any>;
    const source = (root.artifacts || root) as Record<string, any>;
    const snapshotCandidate = source?.refinedSnapshot 
        || source?.refinedPage 
        || source?.draftSnapshot 
        || source?.proposal 
        || source?.snapshot 
        || source?.page;
    const htmlCandidate = source?.refinedHtml 
        || source?.html 
        || source?.rendered;
    const previewCandidate = source?.previewUrl 
        || source?.refinedPreviewUrl 
        || source?.draftUrl 
        || source?.url;
    return {
        snapshot: ensureSitePage(snapshotCandidate),
        html: typeof htmlCandidate === 'string' ? htmlCandidate : null,
        previewUrl: typeof previewCandidate === 'string' ? previewCandidate : null,
    };
};

export default function BuilderPage() {
    const searchParams = useSearchParams();
    const builderReady = searchParams.get('beta') === '1';

    if (!builderReady) {
        return (
            <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-24">
                <div className="max-w-2xl w-full text-center space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Website Builder</p>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">Early Access</h1>
                    <p className="text-zinc-400 text-lg">
                        The builder is in pilot mode. Request access and we will set it up for your team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild className="h-12 px-6 rounded-full bg-white text-black font-bold">
                            <a href="mailto:support@entrestate.com">Request Access</a>
                        </Button>
                        <Button asChild variant="outline" className="h-12 px-6 rounded-full border-white/10 bg-white/5">
                            <a href="/dashboard">Go to Dashboard</a>
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        }>
            <BuilderContent />
        </Suspense>
    );
}
