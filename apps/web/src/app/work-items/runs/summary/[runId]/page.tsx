import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  GitPullRequest,
  ListTodo,
  RefreshCw,
  ShieldAlert,
  TimerReset,
  Wrench,
  XCircle,
} from "lucide-react";
import type { AgentRun, AgentStep } from "@trooper/shared";
import { AgentRunStatus, AgentStepType, PRStatus } from "@trooper/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type RunSummaryData = AgentRun & {
  workItem?: { id: string; title: string; azureId: number };
  pullRequests?: Array<{
    id: string;
    prNumber?: number;
    title: string;
    status: PRStatus;
    sourceBranch: string;
    targetBranch: string;
    repositoryFullName?: string;
    url: string;
    createdAt: string;
  }>;
  totalPromptTokens?: number;
  totalCompletionTokens?: number;
  totalTokens?: number;
  currentIteration?: number;
  maxIterations?: number;
};

async function getRun(runId: string): Promise<RunSummaryData | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const response = await fetch(`${apiBase}/agent/runs/${runId}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load run ${runId}`);
  }

  return response.json();
}

const runStatusMeta: Record<
  string,
  {
    label: string;
    badge: "success" | "info" | "danger" | "default" | "warning" | "done";
    icon: typeof CheckCircle2;
    tone: string;
    summary: string;
  }
> = {
  [AgentRunStatus.Queued]: {
    label: "Queued",
    badge: "default",
    icon: Clock3,
    tone: "text-[var(--color-fg-subtle)]",
    summary: "Waiting for execution capacity.",
  },
  [AgentRunStatus.Running]: {
    label: "Running",
    badge: "info",
    icon: RefreshCw,
    tone: "text-[var(--color-info-fg)]",
    summary: "Trooper is actively executing this run.",
  },
  [AgentRunStatus.AwaitingDraftApproval]: {
    label: "Draft Ready",
    badge: "info",
    icon: FileText,
    tone: "text-[var(--color-info-fg)]",
    summary: "A draft is ready and needs approval before execution continues.",
  },
  [AgentRunStatus.AwaitingApproval]: {
    label: "Needs Approval",
    badge: "warning",
    icon: AlertTriangle,
    tone: "text-[var(--color-warning-fg)]",
    summary: "The proposed plan is waiting for a human decision.",
  },
  [AgentRunStatus.AwaitingContinuation]: {
    label: "Needs Continuation",
    badge: "warning",
    icon: TimerReset,
    tone: "text-[var(--color-warning-fg)]",
    summary: "The run hit its iteration boundary and needs operator input.",
  },
  [AgentRunStatus.Success]: {
    label: "Successful",
    badge: "success",
    icon: CheckCircle2,
    tone: "text-[var(--color-accent-fg)]",
    summary: "Execution completed successfully.",
  },
  [AgentRunStatus.Failed]: {
    label: "Failed",
    badge: "danger",
    icon: XCircle,
    tone: "text-[var(--color-danger-fg)]",
    summary: "Execution stopped because the run encountered an error.",
  },
  [AgentRunStatus.Cancelled]: {
    label: "Cancelled",
    badge: "default",
    icon: XCircle,
    tone: "text-[var(--color-fg-subtle)]",
    summary: "Execution was cancelled before completion.",
  },
};

const prStatusMeta: Record<
  string,
  { label: string; badge: "success" | "info" | "danger" | "default" | "warning" | "done" }
> = {
  [PRStatus.Open]: { label: "Open", badge: "info" },
  [PRStatus.Approved]: { label: "Approved", badge: "success" },
  [PRStatus.Rejected]: { label: "Rejected", badge: "danger" },
  [PRStatus.Merged]: { label: "Merged", badge: "done" },
  [PRStatus.Abandoned]: { label: "Abandoned", badge: "default" },
};

const stepTypeMeta: Record<
  string,
  { label: string; icon: typeof Bot; tone: string; surface: string }
> = {
  [AgentStepType.Reasoning]: {
    label: "Reasoning",
    icon: Bot,
    tone: "text-[var(--color-info-fg)]",
    surface: "bg-[var(--color-info-subtle)]",
  },
  [AgentStepType.ToolCall]: {
    label: "Tool Call",
    icon: Wrench,
    tone: "text-[var(--color-warning-fg)]",
    surface: "bg-[var(--color-warning-subtle)]",
  },
  [AgentStepType.CodeGen]: {
    label: "Code Gen",
    icon: FileText,
    tone: "text-[var(--color-accent-fg)]",
    surface: "bg-[var(--color-accent-subtle)]",
  },
  [AgentStepType.Masking]: {
    label: "Masking",
    icon: ShieldAlert,
    tone: "text-[var(--color-done-fg)]",
    surface: "bg-[var(--color-done-subtle)]",
  },
  [AgentStepType.GitOp]: {
    label: "Git Operation",
    icon: GitBranch,
    tone: "text-[var(--color-accent-fg)]",
    surface: "bg-[var(--color-accent-subtle)]",
  },
  [AgentStepType.Error]: {
    label: "Error",
    icon: AlertTriangle,
    tone: "text-[var(--color-danger-fg)]",
    surface: "bg-[var(--color-danger-subtle)]",
  },
};

function formatDateTime(value?: string) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(value?: string) {
  if (!value) return "Not available";
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDuration(startedAt?: string, completedAt?: string) {
  if (!startedAt) return "Not available";
  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  const totalSeconds = Math.max(Math.floor((end - start) / 1000), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatNumber(value?: number) {
  if (value === undefined || value === null) return "Not available";
  return value.toLocaleString();
}

function getLastStep(steps: AgentStep[]) {
  return steps.length > 0 ? steps[steps.length - 1] : null;
}

function getRunHeadline(run: RunSummaryData) {
  return run.workItem?.title ?? run.userQuery ?? "Manual Run";
}

export default async function RunSummaryPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const run = await getRun(runId);

  if (!run) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Card className="rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle>Run Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--color-fg-muted)]">
            <p>The requested run could not be loaded.</p>
            <p className="font-mono text-xs text-[var(--color-fg-subtle)]">{runId}</p>
            <Link href="/work-items" className="inline-flex items-center gap-2 text-[var(--color-accent-fg)] hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Work Items
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const status = runStatusMeta[run.status] ?? {
    label: run.status,
    badge: "default" as const,
    icon: Clock3,
    tone: "text-[var(--color-fg-subtle)]",
    summary: "Run state available.",
  };
  const StatusIcon = status.icon;
  const latestStep = getLastStep(run.steps ?? []);
  const recentSteps = [...(run.steps ?? [])].slice(-6).reverse();
  const sortedPRs = [...(run.pullRequests ?? [])].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const primaryPR = sortedPRs[0];
  const repository = run.repositoryFullName ?? primaryPR?.repositoryFullName ?? run.workItem?.title ?? "Not set";
  const stepCounts = (run.steps ?? []).reduce(
    (accumulator, step) => {
      accumulator[step.type] = (accumulator[step.type] ?? 0) + 1;
      return accumulator;
    },
    {} as Record<string, number>,
  );

  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,120,212,0.08),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(244,247,250,0.98))] px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[24px] border border-[var(--color-border-default)] bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-emphasis)]">
                <span>Run Summary</span>
                <span className="text-[var(--color-fg-subtle)]">Operational View</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-fg-default)]">
                  {getRunHeadline(run)}
                </h1>
                <Badge variant={status.badge} className="gap-1.5 px-3 py-1 text-[11px]">
                  <StatusIcon className={cn("h-3.5 w-3.5", run.status === AgentRunStatus.Running && "animate-spin")} />
                  {status.label}
                </Badge>
              </div>

              <p className="max-w-4xl text-sm leading-6 text-[var(--color-fg-muted)]">
                {status.summary}
                {run.userQuery ? ` Scope: ${run.userQuery}` : " No explicit query was captured for this run."}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-[var(--color-fg-subtle)]">
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 font-mono">
                  Run {run.id}
                </span>
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5">
                  Started {timeAgo(run.startedAt)}
                </span>
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5">
                  {(run.steps ?? []).length} trace step{(run.steps ?? []).length === 1 ? "" : "s"}
                </span>
                {run.totalTokens ? (
                  <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5">
                    {formatNumber(run.totalTokens)} tokens
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 xl:max-w-[360px] xl:justify-end">
              <Link
                href="/work-items"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-fg-default)] transition hover:bg-[var(--color-canvas-subtle)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Work Items
              </Link>
              {primaryPR ? (
                <a
                  href={primaryPR.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-fg-default)] transition hover:bg-[var(--color-canvas-subtle)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Latest PR
                </a>
              ) : null}
              {run.workItem ? (
                <Link
                  href={`/work-items/summary/${run.workItem.id}`}
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-fg-default)] transition hover:bg-[var(--color-canvas-subtle)]"
                >
                  <ListTodo className="h-4 w-4" />
                  Work Item Summary
                </Link>
              ) : null}
              <Link
                href={`/work-items/runs/${run.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent-emphasis)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-fg)]"
              >
                Full Run Detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Repository</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{repository}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Target branch: {run.branchName ?? "Not set"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Lifecycle</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{formatDuration(run.startedAt, run.completedAt)}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Completed: {run.completedAt ? formatDateTime(run.completedAt) : "Still running"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Artifacts</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{sortedPRs.length} pull request{sortedPRs.length === 1 ? "" : "s"}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">{run.workItem ? `Linked to work item #${run.workItem.azureId}` : "No linked work item"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Trace</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{formatNumber((run.steps ?? []).length)} steps</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Latest event: {latestStep ? timeAgo(latestStep.timestamp) : "No steps captured"}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Execution Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Started</p>
                  <p className="text-sm text-[var(--color-fg-default)]">{formatDateTime(run.startedAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Current Branch</p>
                  <p className="text-sm text-[var(--color-fg-default)]">{run.branchName ?? "Not set"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Elapsed</p>
                  <p className="text-sm text-[var(--color-fg-default)]">{formatDuration(run.startedAt, run.completedAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Prompt Tokens</p>
                  <p className="text-sm text-[var(--color-fg-default)]">{formatNumber(run.totalPromptTokens)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Completion Tokens</p>
                  <p className="text-sm text-[var(--color-fg-default)]">{formatNumber(run.totalCompletionTokens)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Iteration Budget</p>
                  <p className="text-sm text-[var(--color-fg-default)]">
                    {run.currentIteration && run.maxIterations
                      ? `${run.currentIteration}/${run.maxIterations}`
                      : "Not tracked"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Operator Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Request</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-fg-default)]">
                    {run.userQuery ?? "No explicit user query recorded for this run."}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Plan Summary</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-fg-default)]">
                    {run.planSummary ?? "No plan summary captured yet."}
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3",
                    run.error
                      ? "border-[var(--color-danger-emphasis)] bg-[var(--color-danger-subtle)]"
                      : "border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)]",
                  )}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Exception / Blocker</p>
                  <p className={cn("mt-2 whitespace-pre-wrap text-sm leading-6", run.error ? "text-[var(--color-danger-fg)]" : "text-[var(--color-fg-default)]")}>
                    {run.error ?? "No blocker is currently recorded."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Recent Trace Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentSteps.length === 0 ? (
                  <p className="text-sm text-[var(--color-fg-muted)]">No trace steps have been captured for this run.</p>
                ) : (
                  recentSteps.map((step) => {
                    const meta = stepTypeMeta[step.type] ?? {
                      label: step.type,
                      icon: Bot,
                      tone: "text-[var(--color-fg-subtle)]",
                      surface: "bg-[var(--color-canvas-subtle)]",
                    };
                    const StepIcon = meta.icon;

                    return (
                      <div
                        key={step.id}
                        className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full", meta.surface)}>
                                <StepIcon className={cn("h-3.5 w-3.5", meta.tone)} />
                              </span>
                              <Badge variant="default" className="px-2 py-0.5 text-[10px]">
                                {meta.label}
                              </Badge>
                              <span className="text-sm font-medium text-[var(--color-fg-default)]">{step.label}</span>
                            </div>
                            {step.detail ? (
                              <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[var(--color-fg-muted)]">
                                {step.detail}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right text-xs text-[var(--color-fg-subtle)]">
                            <p>{formatDateTime(step.timestamp)}</p>
                            <p className="mt-1">{step.durationMs ? `${step.durationMs} ms` : "Duration not recorded"}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Linked Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-fg-default)]">
                    <ListTodo className="h-4 w-4 text-[var(--color-accent-fg)]" />
                    Work Item
                  </div>
                  {run.workItem ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-[var(--color-fg-default)]">#{run.workItem.azureId} {run.workItem.title}</p>
                      <Link href={`/work-items/summary/${run.workItem.id}`} className="inline-flex items-center gap-2 text-sm text-[var(--color-accent-fg)] hover:underline">
                        Inspect work item
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--color-fg-muted)]">This run is not linked to a work item.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-fg-default)]">
                    <GitPullRequest className="h-4 w-4 text-[var(--color-accent-fg)]" />
                    Pull Requests
                  </div>
                  {sortedPRs.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {sortedPRs.map((pullRequest) => {
                        const prStatus = prStatusMeta[pullRequest.status] ?? { label: pullRequest.status, badge: "default" as const };

                        return (
                          <div key={pullRequest.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-white px-3 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-[var(--color-fg-default)]">{pullRequest.title}</p>
                                <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
                                  {pullRequest.sourceBranch} to {pullRequest.targetBranch}
                                </p>
                              </div>
                              <Badge variant={prStatus.badge}>{prStatus.label}</Badge>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                              <span>{pullRequest.prNumber ? `PR #${pullRequest.prNumber}` : "Pull request recorded"}</span>
                              <span>·</span>
                              <span>{timeAgo(pullRequest.createdAt)}</span>
                            </div>
                            <a
                              href={pullRequest.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-accent-fg)] hover:underline"
                            >
                              Open pull request
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[var(--color-fg-muted)]">No pull request has been attached to this run yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Trace Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(stepCounts).length === 0 ? (
                  <p className="text-sm text-[var(--color-fg-muted)]">No step categories recorded yet.</p>
                ) : (
                  Object.entries(stepCounts)
                    .sort((left, right) => right[1] - left[1])
                    .map(([type, count]) => {
                      const meta = stepTypeMeta[type] ?? {
                        label: type,
                        icon: Bot,
                        tone: "text-[var(--color-fg-subtle)]",
                        surface: "bg-[var(--color-canvas-subtle)]",
                      };
                      const StepIcon = meta.icon;
                      return (
                        <div key={type} className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-full", meta.surface)}>
                              <StepIcon className={cn("h-3.5 w-3.5", meta.tone)} />
                            </span>
                            <span className="text-sm text-[var(--color-fg-default)]">{meta.label}</span>
                          </div>
                          <span className="text-sm font-medium text-[var(--color-fg-default)]">{count}</span>
                        </div>
                      );
                    })
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Latest Signal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--color-fg-muted)]">
                {latestStep ? (
                  <>
                    <p className="text-[var(--color-fg-default)]">{latestStep.label}</p>
                    <p>Recorded {timeAgo(latestStep.timestamp)} at {formatDateTime(latestStep.timestamp)}</p>
                    <p>{latestStep.detail ?? "No additional detail was attached to the latest step."}</p>
                  </>
                ) : (
                  <p>No execution signal has been recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}