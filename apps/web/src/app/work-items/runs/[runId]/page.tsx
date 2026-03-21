"use client";

import {
  Brain,
  Wrench,
  Code2,
  ShieldAlert,
  GitBranch,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Play,
  Copy,
  Check,
  Search,
  Zap,
  RefreshCcw,
  SendHorizonal,
  FileEdit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  AgentRunStatus,
  AgentStepType,
  PipelineStage,
} from "@trooper/shared";
import type { AgentStep } from "@trooper/shared";
import { agentRuns as agentRunsApi, pipeline } from "@/lib/api";

/* ── Step icon / color mapping ── */

const stepMeta: Record<
  AgentStepType,
  { icon: typeof Brain; color: string; bg: string; label: string }
> = {
  [AgentStepType.Reasoning]: {
    icon: Brain,
    color: "text-[var(--color-info-fg)]",
    bg: "bg-[var(--color-info-subtle)]",
    label: "Reasoning",
  },
  [AgentStepType.ToolCall]: {
    icon: Wrench,
    color: "text-[var(--color-warning-fg)]",
    bg: "bg-[var(--color-warning-subtle)]",
    label: "Tool Call",
  },
  [AgentStepType.CodeGen]: {
    icon: Code2,
    color: "text-[var(--color-accent-fg)]",
    bg: "bg-[var(--color-accent-subtle)]",
    label: "Code Generation",
  },
  [AgentStepType.Masking]: {
    icon: ShieldAlert,
    color: "text-[var(--color-done-fg)]",
    bg: "bg-[var(--color-done-subtle)]",
    label: "Masking",
  },
  [AgentStepType.GitOp]: {
    icon: GitBranch,
    color: "text-[var(--color-accent-fg)]",
    bg: "bg-[var(--color-accent-subtle)]",
    label: "Git Operation",
  },
  [AgentStepType.Error]: {
    icon: AlertTriangle,
    color: "text-[var(--color-danger-fg)]",
    bg: "bg-[var(--color-danger-subtle)]",
    label: "Error",
  },
};

const runStatusConfig: Record<
  AgentRunStatus,
  { icon: typeof CheckCircle2; badge: "success" | "info" | "danger" | "default" | "warning"; label: string }
> = {
  [AgentRunStatus.Success]: { icon: CheckCircle2, badge: "success", label: "Success" },
  [AgentRunStatus.Running]: { icon: Play, badge: "info", label: "Running" },
  [AgentRunStatus.AwaitingApproval]: { icon: Clock, badge: "warning", label: "Awaiting Approval" },
  [AgentRunStatus.AwaitingDraftApproval]: { icon: FileEdit, badge: "info", label: "Draft Ready" },
  [AgentRunStatus.AwaitingContinuation]: { icon: RefreshCcw, badge: "warning", label: "Iteration Limit Reached" },
  [AgentRunStatus.Failed]: { icon: XCircle, badge: "danger", label: "Failed" },
  [AgentRunStatus.Queued]: { icon: Clock, badge: "default", label: "Queued" },
  [AgentRunStatus.Cancelled]: { icon: AlertTriangle, badge: "warning", label: "Cancelled" },
};

/* ── Pipeline Stage Progress ── */

const PIPELINE_STAGES = [
  { key: PipelineStage.Receive, label: "Receive", icon: Clock },
  { key: PipelineStage.Draft, label: "Draft", icon: FileEdit },
  { key: PipelineStage.Fetch, label: "Fetch", icon: Wrench },
  { key: PipelineStage.Context, label: "Context", icon: Search },
  { key: PipelineStage.Understand, label: "Understand", icon: Brain },
  { key: PipelineStage.Plan, label: "Plan", icon: Brain },
  { key: PipelineStage.CodeGen, label: "Code Gen", icon: Code2 },
  { key: PipelineStage.Review, label: "Review", icon: CheckCircle2 },
  { key: PipelineStage.Mask, label: "Mask", icon: ShieldAlert },
  { key: PipelineStage.SubmitPR, label: "Submit PR", icon: GitBranch },
];

function PipelineProgress({ steps }: { steps: AgentStep[] }) {
  // Derive stage statuses from step labels like "[receive] ..."
  function getStageStatus(stage: string): "completed" | "running" | "failed" | "pending" {
    const stageSteps = steps.filter((s) => s.label.startsWith(`[${stage}]`));
    if (stageSteps.length === 0) return "pending";
    const last = stageSteps[stageSteps.length - 1];
    if (last.status === "failed") return "failed";
    if (last.status === "running") return "running";
    return "completed";
  }

  return (
    <div className="flex items-center gap-1">
      {PIPELINE_STAGES.map((stage, i) => {
        const status = getStageStatus(stage.key);
        const Icon = stage.icon;
        return (
          <div key={stage.key} className="flex items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition-all",
                status === "completed" && "bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]",
                status === "running" && "bg-[var(--color-info-subtle)] text-[var(--color-info-fg)] ring-1 ring-[var(--color-info-fg)]",
                status === "failed" && "bg-[var(--color-danger-subtle)] text-[var(--color-danger-fg)]",
                status === "pending" && "bg-[var(--color-canvas-subtle)] text-[var(--color-fg-subtle)]",
              )}
            >
              {status === "completed" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : status === "running" ? (
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-info-fg)]" />
              ) : status === "failed" ? (
                <XCircle className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3 opacity-40" />
              )}
              {stage.label}
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                className={cn(
                  "h-px w-3",
                  status === "completed"
                    ? "bg-[var(--color-accent-fg)]"
                    : "bg-[var(--color-border-muted)]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Step Card Component ── */

function StepCard({ step, index }: { step: AgentStep; index: number }) {
  const meta = stepMeta[step.type];
  const Icon = meta.icon;
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const isDiff = step.detail?.startsWith("---");

  function handleCopy() {
    if (step.detail) {
      navigator.clipboard.writeText(step.detail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="relative flex gap-3">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
            meta.bg,
            "border-[var(--color-border-default)]"
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", meta.color)} />
        </div>
        <div className="flex-1 w-px bg-[var(--color-border-muted)]" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-2 text-left"
        >
          <span className="text-[10px] font-mono text-[var(--color-fg-subtle)] w-5">
            {(index + 1).toString().padStart(2, "0")}
          </span>
          <Badge variant="default" className="text-[10px] px-1.5 py-0">
            {meta.label}
          </Badge>
          <span className="text-sm font-medium text-[var(--color-fg-default)] truncate">
            {step.label}
          </span>
          {step.durationMs && (
            <span className="ml-auto text-[10px] text-[var(--color-fg-subtle)] tabular-nums shrink-0">
              {step.durationMs}ms
            </span>
          )}
        </button>

        {expanded && step.detail && (
          <div className="relative mt-2 rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] overflow-hidden">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 rounded-md p-1 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)] transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[var(--color-accent-fg)]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <pre
              className={cn(
                "p-3 pr-10 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap",
                isDiff ? "text-[var(--color-fg-muted)]" : "text-[var(--color-fg-muted)]"
              )}
            >
              {isDiff
                ? step.detail.split("\n").map((line, i) => (
                    <span
                      key={i}
                      className={cn(
                        "block",
                        line.startsWith("+") && !line.startsWith("+++")
                          ? "text-[var(--color-accent-fg)] bg-[var(--color-accent-subtle)]"
                          : line.startsWith("-") && !line.startsWith("---")
                          ? "text-[var(--color-danger-fg)] bg-[var(--color-danger-subtle)]"
                          : line.startsWith("@@")
                          ? "text-[var(--color-info-fg)]"
                          : ""
                      )}
                    >
                      {line}
                    </span>
                  ))
                : step.detail}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Real-time SSE hook ── */

function useStreamingSteps(runId: string, run: any) {
  const [visibleSteps, setVisibleSteps] = useState<AgentStep[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);

  // Load initial steps
  useEffect(() => {
    if (!runId || !run) return;
    agentRunsApi.steps(runId).then((steps) => {
      setVisibleSteps(steps);
    });
  }, [runId, run]);

  // SSE connection for live updates
  useEffect(() => {
    if (!runId || !run) return;
    const isLive = run.status === AgentRunStatus.Running;
    if (!isLive) {
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    const url = pipeline.streamUrl(runId);
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'step') {
          setVisibleSteps((prev) => {
            const idx = prev.findIndex((s) => s.id === payload.step.id);
            if (idx >= 0) {
              // Update existing step
              const updated = [...prev];
              updated[idx] = payload.step;
              return updated;
            }
            // New step — append
            return [...prev, payload.step];
          });
        } else if (payload.type === 'run') {
          setLiveStatus(payload.status);
          if (payload.status !== AgentRunStatus.Running) {
            setIsStreaming(false);
          }
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setIsStreaming(false);
      es.close();
    };

    return () => es.close();
  }, [runId, run?.status]);

  const isLive = run?.status === AgentRunStatus.Running || isStreaming;
  return { visibleSteps, isStreaming, isLive, liveStatus };
}

/* ── Page ── */

export default function AgentTracePage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const [runId, setRunId] = useState<string>("");
  const [run, setRun] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Approval state
  const [isRejecting, setIsRejecting] = useState(false);
  const [newQuery, setNewQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    params.then((p) => setRunId(p.runId));
  }, [params]);

  useEffect(() => {
    if (!runId) return;
    agentRunsApi.get(runId).then((data) => {
      setRun(data);
      if (data.userQuery) setNewQuery(data.userQuery);
    }).catch(console.error);
  }, [runId]);

  const { visibleSteps, isStreaming, isLive } = useStreamingSteps(runId, run);

  const workItem = run?.workItem;

  async function handleApprove() {
    setActionLoading(true);
    try {
      await pipeline.approvePlan(runId);
      const updated = await agentRunsApi.get(runId);
      setRun(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!isRejecting) {
      setIsRejecting(true);
      return;
    }
    setActionLoading(true);
    try {
      await pipeline.rejectPlan(runId, newQuery);
      const updated = await agentRunsApi.get(runId);
      setRun(updated);
      setIsRejecting(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRetry() {
    setActionLoading(true);
    try {
      await pipeline.retryRun(runId);
      const updated = await agentRunsApi.get(runId);
      setRun(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleContinue() {
    setActionLoading(true);
    try {
      await pipeline.continueRun(runId);
      const updated = await agentRunsApi.get(runId);
      setRun(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSubmitAsIs() {
    setActionLoading(true);
    try {
      await pipeline.submitAsIs(runId);
      const updated = await agentRunsApi.get(runId);
      setRun(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  // Auto-scroll to bottom when new steps appear
  useEffect(() => {
    if (scrollRef.current && isLive) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleSteps, isLive]);

  if (!runId) return null;

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-fg-muted)]">
        <p>Run not found: {runId}</p>
        <Link href="/work-items" className="mt-2 text-sm text-[var(--color-accent-fg)] hover:underline">
          Back to work items
        </Link>
      </div>
    );
  }

  const config = runStatusConfig[run.status as AgentRunStatus];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-4">
        <Link href="/work-items">
          <Button variant="ghost" size="icon" className="mt-0.5 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
              {workItem?.title ?? "Agent Run"}
            </h1>
            <Badge variant={config.badge}>{config.label}</Badge>
            {isStreaming && (
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-info-fg)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-info-fg)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-info-fg)]" />
                </span>
                Streaming
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
            <span className="font-mono">{run.id}</span>
            <span>·</span>
            <span className="font-mono">{run.branchName}</span>
            {workItem && (
              <>
                <span>·</span>
                <span>WI #{workItem.azureId}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Pipeline stage progress bar */}
      <PipelineProgress steps={visibleSteps} />

      {/* Awaiting Approval Card */}
      {run.status === AgentRunStatus.AwaitingApproval && (
        <Card className="border-[var(--color-warning-emphasis)] border-opacity-40 bg-[var(--color-warning-subtle)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-[var(--color-warning-fg)]">
              <AlertTriangle className="h-4 w-4" />
              Plan Awaiting Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-[var(--color-fg-default)]">
              <p className="font-medium mb-1">Proposed Plan:</p>
              <p className="text-[var(--color-fg-muted)]">{run.planSummary}</p>
            </div>

            {run.planFiles?.reasoning && (
              <div className="text-sm text-[var(--color-fg-default)]">
                <p className="font-medium mb-1">Reasoning:</p>
                <p className="text-[var(--color-fg-muted)]">{run.planFiles.reasoning}</p>
              </div>
            )}

            {run.planFiles?.tasks?.length > 0 && (
              <div className="text-sm text-[var(--color-fg-default)]">
                <p className="font-medium mb-1">Tasks:</p>
                <ul className="list-disc list-inside pl-4 text-[var(--color-fg-muted)] space-y-1">
                  {run.planFiles.tasks.map((t: { path: string; action: string; description: string }) => (
                    <li key={t.path}>
                      <code>{t.path}</code>{" "}
                      <Badge variant={t.action === "create" ? "success" : "info"} className="text-[10px] px-1 py-0 ml-1">{t.action}</Badge>
                      <span className="ml-2 text-xs">{t.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fallback for older runs without tasks */}
            {!run.planFiles?.tasks && run.planFiles?.filesToChange?.length > 0 && (
              <div className="text-sm text-[var(--color-fg-default)]">
                <p className="font-medium mb-1">Files to modify:</p>
                <ul className="list-disc list-inside pl-4 text-[var(--color-fg-muted)]">
                  {run.planFiles.filesToChange.map((f: string) => (
                    <li key={f}><code>{f}</code></li>
                  ))}
                </ul>
              </div>
            )}

            {!run.planFiles?.tasks && run.planFiles?.newFiles?.length > 0 && (
              <div className="text-sm text-[var(--color-fg-default)]">
                <p className="font-medium mb-1">Files to create:</p>
                <ul className="list-disc list-inside pl-4 text-[var(--color-fg-muted)]">
                  {run.planFiles.newFiles.map((f: string) => (
                    <li key={f}><code>{f}</code></li>
                  ))}
                </ul>
              </div>
            )}

            {isRejecting && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs font-medium text-[var(--color-fg-default)]">
                  Update your query to generate a new plan:
                </label>
                <textarea
                  value={newQuery}
                  onChange={(e) => setNewQuery(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] px-3 py-2 text-sm text-[var(--color-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)]"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleApprove}
                disabled={actionLoading || isRejecting}
                className="bg-[var(--color-success-fg)] hover:bg-[var(--color-success-emphasis)] text-white"
              >
                Approve & Execute
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading}
                variant={isRejecting ? "default" : "outline"}
              >
                {isRejecting ? "Submit New Query" : "Reject & Edit Query"}
              </Button>
              {isRejecting && (
                <Button
                  onClick={() => setIsRejecting(false)}
                  variant="ghost"
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed Card */}
      {run.status === AgentRunStatus.Failed && (
        <Card className="border-[var(--color-danger-emphasis)] border-opacity-40 bg-[var(--color-danger-subtle)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-[var(--color-danger-fg)]">
              <XCircle className="h-4 w-4" />
              Pipeline Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-[var(--color-fg-default)]">
              <p className="font-medium mb-1">Error Details:</p>
              <p className="text-[var(--color-danger-fg)] font-mono text-xs bg-[var(--color-canvas-inset)] p-2 rounded border border-[var(--color-border-default)]">
                {run.error || "Unknown error occurred during execution."}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleRetry}
                disabled={actionLoading}
                className="bg-[var(--color-danger-fg)] hover:bg-[var(--color-danger-emphasis)] text-white"
              >
                Retry Pipeline
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Awaiting Continuation Card — iteration limit reached */}
      {run.status === AgentRunStatus.AwaitingContinuation && (
        <Card className="border-[var(--color-accent-emphasis)] border-opacity-40 bg-[var(--color-accent-subtle)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-[var(--color-accent-fg)]">
              <RefreshCcw className="h-4 w-4" />
              Iteration Limit Reached
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-[var(--color-fg-default)]">
              <p className="text-[var(--color-fg-muted)]">
                The code-verify loop completed{" "}
                <span className="font-semibold text-[var(--color-fg-default)]">
                  {run.currentIteration ?? "?"}/{run.maxIterations ?? "?"}
                </span>{" "}
                iterations. You can continue iterating to improve the code, or submit the current changes as-is.
              </p>
            </div>

            {run.totalTokens != null && (
              <div className="flex items-center gap-4 text-xs text-[var(--color-fg-subtle)]">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {run.totalTokens >= 1000
                    ? `${(run.totalTokens / 1000).toFixed(1)}K`
                    : run.totalTokens.toLocaleString()}{" "}
                  tokens used
                </span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleContinue}
                disabled={actionLoading}
                className="bg-[var(--color-accent-fg)] hover:bg-[var(--color-accent-emphasis)] text-white"
              >
                <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                Continue Iterating
              </Button>
              <Button
                onClick={handleSubmitAsIs}
                disabled={actionLoading}
                variant="outline"
              >
                <SendHorizonal className="h-3.5 w-3.5 mr-1.5" />
                Submit As-Is
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Run metadata cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="py-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">Steps</p>
            <p className="mt-0.5 text-xl font-bold text-[var(--color-fg-default)]">
              {visibleSteps.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Duration
            </p>
            <p className="mt-0.5 text-xl font-bold text-[var(--color-fg-default)]">
              {visibleSteps.reduce((sum, s) => sum + (s.durationMs ?? 0), 0).toLocaleString()}ms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Code Diffs
            </p>
            <p className="mt-0.5 text-xl font-bold text-[var(--color-fg-default)]">
              {visibleSteps.filter((s) => s.type === AgentStepType.CodeGen).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Secrets Masked
            </p>
            <p className="mt-0.5 text-xl font-bold text-[var(--color-fg-default)]">
              {visibleSteps.filter((s) => s.type === AgentStepType.Masking).length}
            </p>
          </CardContent>
        </Card>
        {run.totalTokens != null && (
          <Card>
            <CardContent className="py-3">
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] flex items-center gap-1">
                <Zap className="h-3 w-3" /> Tokens
              </p>
              <p className="mt-0.5 text-xl font-bold text-[var(--color-fg-default)]">
                {run.totalTokens >= 1000
                  ? `${(run.totalTokens / 1000).toFixed(1)}K`
                  : run.totalTokens.toLocaleString()}
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--color-fg-subtle)] tabular-nums">
                {(run.totalPromptTokens ?? 0).toLocaleString()} in · {(run.totalCompletionTokens ?? 0).toLocaleString()} out
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Agent Reasoning Trace (timeline) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-[var(--color-info-fg)]" />
            Agent Reasoning Trace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={scrollRef} className="max-h-[600px] overflow-y-auto pr-2">
            {visibleSteps.length === 0 && !isStreaming ? (
              <p className="text-sm text-[var(--color-fg-muted)] py-8 text-center">
                No trace steps recorded for this run.
              </p>
            ) : (
              visibleSteps.map((step, i) => (
                <StepCard key={step.id} step={step} index={i} />
              ))
            )}

            {/* Streaming cursor */}
            {isStreaming && (
              <div className="flex items-center gap-3 pl-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-info-fg)]" />
                </div>
                <span className="text-xs text-[var(--color-fg-subtle)] animate-pulse">
                  Agent is thinking...
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
