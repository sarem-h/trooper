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
  User,
  XCircle,
} from "lucide-react";
import type { WorkItem } from "@trooper/shared";
import { AgentRunStatus, PRStatus, WorkItemStatus } from "@trooper/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type WorkItemSummaryData = WorkItem & {
  agentRuns?: Array<{
    id: string;
    status: string;
    repositoryFullName?: string;
    userQuery?: string;
    branchName?: string;
    error?: string;
    planSummary?: string;
    startedAt: string;
    completedAt?: string;
    totalTokens?: number;
    steps?: Array<{ id: string; label: string; timestamp: string }>;
  }>;
  pullRequests?: Array<{
    id: string;
    prNumber?: number;
    title: string;
    status: PRStatus;
    sourceBranch: string;
    targetBranch: string;
    url: string;
    createdAt: string;
  }>;
};

async function getWorkItem(id: string): Promise<WorkItemSummaryData | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const response = await fetch(`${apiBase}/work-items/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load work item ${id}`);
  }

  return response.json();
}

const itemStatusMeta: Record<
  string,
  {
    label: string;
    badge: "success" | "info" | "danger" | "default" | "warning" | "done";
    icon: typeof CheckCircle2;
    summary: string;
  }
> = {
  [WorkItemStatus.Pending]: {
    label: "Pending",
    badge: "default",
    icon: Clock3,
    summary: "The work item exists but execution has not started yet.",
  },
  [WorkItemStatus.InProgress]: {
    label: "In Progress",
    badge: "info",
    icon: RefreshCw,
    summary: "Trooper is actively working through this request.",
  },
  [WorkItemStatus.AwaitingReview]: {
    label: "Awaiting Review",
    badge: "warning",
    icon: AlertTriangle,
    summary: "The work item is waiting for human review or approval.",
  },
  [WorkItemStatus.Rejected]: {
    label: "Rejected",
    badge: "danger",
    icon: XCircle,
    summary: "The work item was rejected and needs follow-up before proceeding.",
  },
  [WorkItemStatus.Completed]: {
    label: "Completed",
    badge: "done",
    icon: CheckCircle2,
    summary: "The work item has been completed.",
  },
};

const runStatusMeta: Record<
  string,
  { label: string; badge: "success" | "info" | "danger" | "default" | "warning" | "done" }
> = {
  [AgentRunStatus.Queued]: { label: "Queued", badge: "default" },
  [AgentRunStatus.Running]: { label: "Running", badge: "info" },
  [AgentRunStatus.AwaitingDraftApproval]: { label: "Draft Ready", badge: "info" },
  [AgentRunStatus.AwaitingApproval]: { label: "Needs Approval", badge: "warning" },
  [AgentRunStatus.AwaitingContinuation]: { label: "Needs Continuation", badge: "warning" },
  [AgentRunStatus.Success]: { label: "Successful", badge: "success" },
  [AgentRunStatus.Failed]: { label: "Failed", badge: "danger" },
  [AgentRunStatus.Cancelled]: { label: "Cancelled", badge: "default" },
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

export default async function WorkItemSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getWorkItem(id);

  if (!item) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Card className="rounded-2xl bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle>Work Item Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--color-fg-muted)]">
            <p>The requested work item could not be loaded.</p>
            <p className="font-mono text-xs text-[var(--color-fg-subtle)]">{id}</p>
            <Link href="/work-items" className="inline-flex items-center gap-2 text-[var(--color-accent-fg)] hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Work Items
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const sortedRuns = [...(item.agentRuns ?? [])].sort(
    (left, right) => new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime(),
  );
  const sortedPRs = [...(item.pullRequests ?? [])].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const latestRun = sortedRuns[0];
  const latestPr = sortedPRs[0];
  const latestSignal = latestRun?.steps?.length ? [...latestRun.steps].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] : null;
  const status = itemStatusMeta[item.status] ?? {
    label: item.status,
    badge: "default" as const,
    icon: Clock3,
    summary: "Work item state available.",
  };
  const StatusIcon = status.icon;

  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,120,212,0.08),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(244,247,250,0.98))] px-6 py-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[24px] border border-[var(--color-border-default)] bg-white/90 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-emphasis)]">
                <span>Work Item Summary</span>
                <span className="text-[var(--color-fg-subtle)]">Operator Handoff</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-fg-default)]">
                  {item.title}
                </h1>
                <Badge variant={status.badge} className="gap-1.5 px-3 py-1 text-[11px]">
                  <StatusIcon className={cn("h-3.5 w-3.5", item.status === WorkItemStatus.InProgress && "animate-spin")} />
                  {status.label}
                </Badge>
              </div>

              <p className="max-w-4xl text-sm leading-6 text-[var(--color-fg-muted)]">
                {status.summary}
                {item.userQuery ? ` Working intent: ${item.userQuery}` : " No explicit execution query is attached yet."}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-[var(--color-fg-subtle)]">
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 font-mono">
                  Work Item #{item.azureId}
                </span>
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5">
                  Updated {timeAgo(item.updatedAt)}
                </span>
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5">
                  {sortedRuns.length} run{sortedRuns.length === 1 ? "" : "s"}
                </span>
                <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-1.5">
                  {sortedPRs.length} pull request{sortedPRs.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 xl:max-w-[420px] xl:justify-end">
              <Link
                href="/work-items"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-fg-default)] transition hover:bg-[var(--color-canvas-subtle)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Work Items
              </Link>
              {latestRun ? (
                <Link
                  href={`/work-items/runs/summary/${latestRun.id}`}
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-fg-default)] transition hover:bg-[var(--color-canvas-subtle)]"
                >
                  <Bot className="h-4 w-4" />
                  Latest Run Summary
                </Link>
              ) : null}
              <Link
                href={`/work-items/${item.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent-emphasis)] px-3 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-fg)]"
              >
                Full Work Item Detail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Repository</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{item.repositoryFullName ?? "Not set"}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Target branch: {item.targetBranch ?? latestRun?.branchName ?? "Not set"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Ownership</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{item.assignedTo ?? "Unassigned"}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Type: {item.type}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Latest Run</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{latestRun ? formatDuration(latestRun.startedAt, latestRun.completedAt) : "No run yet"}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">{latestRun ? `Started ${timeAgo(latestRun.startedAt)}` : "Execution has not started"}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Artifacts</p>
              <p className="mt-2 text-sm font-medium text-[var(--color-fg-default)]">{sortedPRs.length} pull request{sortedPRs.length === 1 ? "" : "s"}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">Latest signal: {latestSignal ? timeAgo(latestSignal.timestamp) : "No trace yet"}</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Work Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Description</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-fg-default)]">
                    {item.description || "No description provided."}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Execution Intent</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-fg-default)]">
                    {item.userQuery ?? latestRun?.userQuery ?? "No execution query has been captured yet."}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Created</p>
                    <p className="mt-2 text-sm text-[var(--color-fg-default)]">{formatDateTime(item.createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Last Updated</p>
                    <p className="mt-2 text-sm text-[var(--color-fg-default)]">{formatDateTime(item.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Run History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedRuns.length === 0 ? (
                  <p className="text-sm text-[var(--color-fg-muted)]">No runs have been created from this work item yet.</p>
                ) : (
                  sortedRuns.map((run) => {
                    const runStatus = runStatusMeta[run.status] ?? { label: run.status, badge: "default" as const };
                    const latestRunSignal = run.steps?.length
                      ? [...run.steps].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
                      : null;

                    return (
                      <div key={run.id} className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-4 py-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-[var(--color-fg-default)]">Run {run.id}</p>
                              <Badge variant={runStatus.badge}>{runStatus.label}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                              {run.branchName ? (
                                <span className="inline-flex items-center gap-1">
                                  <GitBranch className="h-3 w-3" />
                                  {run.branchName}
                                </span>
                              ) : null}
                              <span>Started {timeAgo(run.startedAt)}</span>
                              <span>·</span>
                              <span>{formatDuration(run.startedAt, run.completedAt)}</span>
                              {run.totalTokens ? (
                                <>
                                  <span>·</span>
                                  <span>{formatNumber(run.totalTokens)} tokens</span>
                                </>
                              ) : null}
                            </div>
                            <p className="text-sm text-[var(--color-fg-default)]">
                              {latestRunSignal?.label ?? run.planSummary ?? run.userQuery ?? "No run narrative available."}
                            </p>
                            {run.error ? (
                              <p className="text-sm text-[var(--color-danger-fg)]">{run.error}</p>
                            ) : null}
                          </div>
                          <Link href={`/work-items/runs/summary/${run.id}`} className="inline-flex items-center gap-2 text-sm text-[var(--color-accent-fg)] hover:underline">
                            Open run summary
                            <ArrowRight className="h-4 w-4" />
                          </Link>
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
                <CardTitle>Latest Execution Signal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--color-fg-muted)]">
                {latestRun ? (
                  <>
                    <p className="text-[var(--color-fg-default)]">{latestSignal?.label ?? latestRun.planSummary ?? latestRun.userQuery ?? "Latest run is available."}</p>
                    <p>{latestSignal ? `Recorded ${timeAgo(latestSignal.timestamp)} at ${formatDateTime(latestSignal.timestamp)}` : `Run started ${timeAgo(latestRun.startedAt)}`}</p>
                    <Link href={`/work-items/runs/summary/${latestRun.id}`} className="inline-flex items-center gap-2 text-[var(--color-accent-fg)] hover:underline">
                      Inspect latest run
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <p>No execution signal has been recorded yet.</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Pull Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedPRs.length === 0 ? (
                  <p className="text-sm text-[var(--color-fg-muted)]">No pull request has been attached to this work item yet.</p>
                ) : (
                  sortedPRs.map((pullRequest) => {
                    const prStatus = prStatusMeta[pullRequest.status] ?? { label: pullRequest.status, badge: "default" as const };
                    return (
                      <div key={pullRequest.id} className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-3 py-3">
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
                          <span className="inline-flex items-center gap-1">
                            <GitPullRequest className="h-3 w-3" />
                            {pullRequest.prNumber ? `PR #${pullRequest.prNumber}` : "Recorded PR"}
                          </span>
                          <span>·</span>
                          <span>{timeAgo(pullRequest.createdAt)}</span>
                        </div>
                        <a href={pullRequest.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-accent-fg)] hover:underline">
                          Open pull request
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle>Scope Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--color-fg-muted)]">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-[var(--color-accent-fg)]" />
                  <span className="text-[var(--color-fg-default)]">Type: {item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-[var(--color-accent-fg)]" />
                  <span className="text-[var(--color-fg-default)]">Branch target: {item.targetBranch ?? "Not set"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--color-accent-fg)]" />
                  <span className="text-[var(--color-fg-default)]">Assigned to: {item.assignedTo ?? "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--color-accent-fg)]" />
                  <span className="text-[var(--color-fg-default)]">Created: {formatDateTime(item.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}