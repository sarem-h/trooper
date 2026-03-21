"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CircleDot,
  GitPullRequest,
  ShieldAlert,
  ArrowLeft,
  GitBranch,
  Eye,
  Loader2,
  Rocket,
  ExternalLink,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Sparkles,
  Database,
  Star,
  Terminal,
  ScanSearch,
  BrainCircuit,
  UserCheck,
  Bot,
  Webhook,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copilot, pipeline as pipelineApi, repositories as reposApi } from "@/lib/api";
import type { CopilotCardResponse, CopilotGroundingTrace, CopilotModelOption } from "@/lib/api";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/markdown";
import { useCopilotSummary } from "./use-copilot-summary";
import { IdentityMode } from "@trooper/shared";
import type { LinkedRepository } from "@trooper/shared";

const REPO_COPILOT_MODEL_STORAGE_KEY = "trooper.repo-copilot.model-id";
const REPO_COPILOT_STAGE_LIMIT_STORAGE_KEY = "trooper.repo-copilot.ground-stage-limit";
const REPO_COPILOT_SELECTION_STORAGE_PREFIX = "trooper.repo-copilot.selection";
const GROUNDING_STAGE_OPTIONS = [1, 2, 3, 4, 5, 6] as const;
const REPO_HUB_QUERY_KEYS = {
  branch: "b",
  tab: "t",
  issue: "i",
  pull: "p",
  issueState: "is",
  issueQuery: "iq",
  issuePage: "ip",
  prState: "ps",
  prSort: "so",
  prPage: "pp",
  securitySeverity: "ss",
  securityType: "st",
  securityFixOnly: "sf",
} as const;
const REPO_HUB_LEGACY_QUERY_KEYS = {
  branch: "branch",
  tab: "tab",
  issue: "issue",
  pull: "pull",
  issueState: "issueState",
  issueQuery: "issueQuery",
  issuePage: "issuePage",
  prState: "prState",
  prSort: "prSort",
  prPage: "prPage",
  securitySeverity: "securitySeverity",
  securityType: "securityType",
  securityFixOnly: "securityFixOnly",
} as const;

// ─── Types ──────────────────────────────────────────

interface ScmIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: { name: string; color: string }[];
  user: { login: string; avatarUrl: string } | null;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  url: string;
}

interface ScmPR {
  number: number;
  title: string;
  body: string;
  state: string;
  sourceBranch: string;
  targetBranch: string;
  user: { login: string; avatarUrl: string } | null;
  url: string;
  createdAt: string;
  updatedAt: string;
  changedFiles?: string[];
  merged?: boolean;
  isDraft?: boolean;
}

interface SecurityAlert {
  id: number;
  alertType: string;
  severity: string;
  state: string;
  title: string;
  description: string;
  affectedComponent: string;
  cveId?: string;
  tool?: string;
  url: string;
  createdAt: string;
  fixAvailable?: boolean;
  filePath?: string;
}

interface SecuritySummary {
  totalAlerts: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  alerts: SecurityAlert[];
}

interface RepoSummary {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
  indexedFiles: number;
  description?: string;
  language?: string;
  stars?: number;
  provider: string;
}

interface RepoActivity {
  openIssues: number;
  openPRs: number;
}

interface AvailabilityState {
  status: "ok" | "limited";
  reason?: string;
}

type Tab = "issues" | "pulls" | "security";

const LIST_PAGE_SIZE = 10;

type PersistedSelection<TItem> = {
  item: TItem;
  savedAt: number;
  version: 1;
};

// ─── Helpers ────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function decodeRepoSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function providerLabel(value?: string) {
  if (!value) return "Unknown";
  if (value === "azure_repos") return "Azure DevOps";
  if (value === "github") return "GitHub";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function labelStyle(color: string) {
  if (!color) return {};
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    color: `rgb(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)})`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
  };
}

function parsePositiveIntParam(value: string | null) {
  if (!value) return null;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function parseRepoTabParam(value: string | null): Tab | null {
  if (value === "issues" || value === "pulls" || value === "security") {
    return value;
  }

  return null;
}

function parseAllowedParam<TValue extends string>(value: string | null, allowedValues: readonly TValue[], fallback: TValue) {
  return value && allowedValues.includes(value as TValue) ? (value as TValue) : fallback;
}

function getRepoHubSearchParam(
  searchParams: Pick<URLSearchParams, "get">,
  key: keyof typeof REPO_HUB_QUERY_KEYS,
) {
  return searchParams.get(REPO_HUB_QUERY_KEYS[key]) ?? searchParams.get(REPO_HUB_LEGACY_QUERY_KEYS[key]);
}

function deleteRepoHubSearchParam(nextParams: URLSearchParams, key: keyof typeof REPO_HUB_QUERY_KEYS) {
  nextParams.delete(REPO_HUB_QUERY_KEYS[key]);
  nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS[key]);
}

function isSessionStorageAvailable() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function readPersistedSelection<TItem>(storageKey: string) {
  if (!isSessionStorageAvailable()) return null;

  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedSelection<TItem>;
    if (!parsed?.item) {
      window.sessionStorage.removeItem(storageKey);
      return null;
    }

    return parsed.item;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return null;
  }
}

function writePersistedSelection<TItem>(storageKey: string, item: TItem) {
  if (!isSessionStorageAvailable()) return;

  try {
    const payload: PersistedSelection<TItem> = {
      item,
      savedAt: Date.now(),
      version: 1,
    };

    window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Ignore storage write failures.
  }
}

const severityColors: Record<string, NonNullable<BadgeProps["variant"]>> = {
  critical: "danger",
  high: "danger",
  medium: "warning",
  low: "info",
  info: "default",
};

function AssistantSkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("trooper-shimmer rounded-md", className)} />;
}

function RepoAssistantLoadingState({ kind }: { kind: "issue" | "pull" }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] p-3">
        <AssistantSkeletonBlock className="h-3 w-24" />
        <AssistantSkeletonBlock className="h-5 w-4/5" />
        <AssistantSkeletonBlock className="h-4 w-full" />
        <AssistantSkeletonBlock className="h-4 w-3/4" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            Instant Summary
          </p>
          <span className="text-[11px] text-[var(--color-fg-muted)]">Loading lightweight analysis...</span>
        </div>
        <div className="space-y-2">
          <AssistantSkeletonBlock className="h-12 w-full rounded-lg border border-[var(--color-border-default)]" />
          <AssistantSkeletonBlock className="h-12 w-full rounded-lg border border-[var(--color-border-default)]" />
          <AssistantSkeletonBlock className="h-16 w-full rounded-lg border border-[var(--color-border-default)]" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            Engineering Suggestions
          </p>
          <span className="text-[11px] text-[var(--color-fg-muted)]">Grounding on repo context...</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <AssistantSkeletonBlock className="h-8 w-24 rounded-lg border border-[var(--color-border-default)]" />
          <AssistantSkeletonBlock className="h-8 w-20 rounded-lg border border-[var(--color-border-default)]" />
          <AssistantSkeletonBlock className="h-8 w-28 rounded-lg border border-[var(--color-border-default)]" />
        </div>
        <AssistantSkeletonBlock className="h-24 w-full rounded-lg border border-[var(--color-border-default)]" />
      </div>

      <div className="rounded-lg border border-dashed border-[var(--color-border-default)] bg-[var(--color-canvas-default)] px-3 py-2 text-[12px] text-[var(--color-fg-muted)]">
        {kind === "issue"
          ? "Trooper is building a quick issue brief before deeper engineering guidance arrives."
          : "Trooper is building a quick PR brief before deeper engineering guidance arrives."}
      </div>
    </div>
  );
}

function RepoAssistantGroundingState({
  kind,
  branch,
  modelLabel,
}: {
  kind: "issue" | "pull";
  branch?: string;
  modelLabel?: string | null;
}) {
  const phases = useMemo(() => {
    const activeBranch = branch ?? "default branch";

    return [
      {
        label: "Scope target",
        detail: `${kind === "issue" ? "Issue" : "Pull request"} mapped to ${activeBranch}.`,
      },
      {
        label: "Retrieve code context",
        detail: "Pulling relevant files, symbols, and repository signals.",
      },
      {
        label: "Ground metadata",
        detail: "Cross-checking item metadata against repository context.",
      },
      {
        label: "Run deep model",
        detail: `Generating a refreshed brief with ${modelLabel ?? "the selected model"}.`,
      },
      {
        label: "Publish update",
        detail: "Preparing the grounded Repo Copilot result.",
      },
    ];
  }, [branch, kind, modelLabel]);

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
    const offsets = [0, 900, 2_000, 3_400, 5_000];
    const timers = offsets.map((delay, index) =>
      window.setTimeout(() => setStepIndex(index), delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [phases]);

  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,247,250,0.92))] p-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            <Terminal className="h-3.5 w-3.5" />
            Code Context Pass
          </div>
          <p className="text-[13px] font-medium text-[var(--color-fg-default)]">
            Rebuilding this {kind === "issue" ? "issue" : "pull request"} brief with repository context.
          </p>
        </div>
        <Badge variant="info" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Running
        </Badge>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {phases.map((phase, index) => {
          const status = index < stepIndex ? "done" : index === stepIndex ? "running" : "queued";

          return (
            <div
              key={phase.label}
              className={cn(
                "rounded-lg border px-3 py-2.5 transition-colors",
                status === "done"
                  ? "border-[var(--color-success-fg)]/25 bg-[var(--color-success-subtle)]"
                  : status === "running"
                    ? "border-[var(--color-accent-emphasis)]/35 bg-[var(--color-accent-subtle)]"
                    : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)]"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-medium text-[var(--color-fg-default)]">{phase.label}</span>
                {status === "done" ? (
                  <Check className="h-3.5 w-3.5 text-[var(--color-success-fg)]" />
                ) : status === "running" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-accent-fg)]" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-border-default)]" />
                )}
              </div>
              <p className="mt-1 text-[11px] leading-5 text-[var(--color-fg-muted)]">{phase.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[#0f1720] text-[#d5dde8] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#8fa1b7]">
          <ScanSearch className="h-3.5 w-3.5" />
          Live Trace
        </div>
        <div className="space-y-1 px-3 py-3 font-mono text-[11px] leading-5">
          {phases.slice(0, stepIndex + 1).map((phase, index) => (
            <div key={phase.label} className="flex gap-2 text-[#cbd5e1]">
              <span className="text-[#6ee7b7]">[{String(index + 1).padStart(2, "0")}]</span>
              <span>{phase.detail}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[#fbbf24]">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Waiting for grounded response payload...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepoAssistantTracePanel({ trace }: { trace: CopilotGroundingTrace }) {
  const [copied, setCopied] = useState(false);

  const handleCopyTrace = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy grounding trace:", error);
    }
  }, [trace]);

  return (
    <div className="space-y-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            Grounding Trace
          </p>
          <p className="text-[12px] text-[var(--color-fg-muted)]">
            {trace.mode === "verification"
              ? `Verification mode stopped at stage ${trace.completedStage}/${trace.totalStages}.`
              : `Full pipeline completed ${trace.completedStage}/${trace.totalStages} stages.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleCopyTrace()}
            className="inline-flex h-7 items-center rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 text-[11px] font-medium text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-border-emphasis)] hover:text-[var(--color-fg-default)]"
          >
            {copied ? "Copied trace" : "Copy trace JSON"}
          </button>
          <Badge variant={trace.stoppedEarly ? "info" : trace.ragDegraded ? "warning" : "done"}>
            {trace.stoppedEarly ? "Verification" : trace.ragDegraded ? "Degraded" : "Complete"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        {trace.stages.map((stage: CopilotGroundingTrace["stages"][number]) => {
          const tone =
            stage.status === "completed"
              ? "border-[var(--color-success-fg)]/20 bg-[var(--color-success-subtle)]"
              : stage.status === "failed"
                ? "border-[var(--color-danger-fg)]/20 bg-[var(--color-danger-subtle)]"
                : stage.status === "skipped"
                  ? "border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)]"
                  : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)]";

          return (
            <div key={stage.id} className={cn("rounded-lg border px-3 py-2", tone)}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[var(--color-fg-muted)]">Stage {stage.id}</span>
                  <span className="text-[12px] font-medium text-[var(--color-fg-default)]">{stage.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--color-fg-muted)]">
                  <Badge variant={stage.status === "completed" ? "done" : stage.status === "failed" ? "danger" : stage.status === "skipped" ? "default" : "info"}>
                    {stage.status}
                  </Badge>
                  {typeof stage.durationMs === "number" && <span>{stage.durationMs}ms</span>}
                </div>
              </div>
              {stage.detail && (
                <p className="mt-1 text-[12px] leading-5 text-[var(--color-fg-muted)]">{stage.detail}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RepoAssistantPanel({
  kind,
  summary,
  isLoading,
  isGrounding,
  error,
  analysisMode,
  item,
  activeBranch,
  modelOptions,
  selectedModelId,
  onModelChange,
  onGround,
  selectedGroundingStageLimit,
  onGroundingStageLimitChange,
  modelsLoading,
}: {
  kind: "issue" | "pull";
  summary: CopilotCardResponse | null;
  isLoading: boolean;
  isGrounding: boolean;
  error: string | null;
  analysisMode: "metadata" | "codebase";
  item: ScmIssue | ScmPR | null;
  activeBranch?: string;
  modelOptions: CopilotModelOption[];
  selectedModelId: string | null;
  onModelChange: (modelId: string) => void;
  onGround: (stageLimit?: number) => void;
  selectedGroundingStageLimit: number | null;
  onGroundingStageLimitChange: (stageLimit: number | null) => void;
  modelsLoading: boolean;
}) {
  const statusVariantMap: Record<string, NonNullable<BadgeProps["variant"]>> = {
    open: "danger",
    closed: "default",
    draft: "info",
    merged: "done",
  };

  const confidenceColors: Record<string, string> = {
    high: "bg-[var(--color-success-fg)]",
    medium: "bg-[var(--color-warning-fg)]",
    low: "bg-[var(--color-danger-fg)]",
  };

  const selectedModel = modelOptions.find((model) => model.id === selectedModelId) ?? null;
  const canGround = Boolean(item) && !modelsLoading && !isLoading && !isGrounding;
  const isVerificationMode = typeof selectedGroundingStageLimit === "number";
  const groundButtonLabel = isVerificationMode
    ? `Run through stage ${selectedGroundingStageLimit}`
    : analysisMode === "codebase"
      ? "Refresh grounded result"
      : "Ground with codebase";

  return (
    <div className="min-h-0 w-full xl:h-full">
      <Card className="w-full border-[var(--color-border-default)] shadow-[0_8px_24px_rgba(15,23,42,0.08)] xl:h-full">
        <CardContent className="flex gap-3 p-4 pb-3 xl:h-full xl:overflow-hidden xl:flex-col">
          <div className="space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                  {kind === "issue" ? "Issue Assistant" : "PR Assistant"}
                </p>
                <p className="text-[12px] text-[var(--color-fg-muted)]">
                  {kind === "issue" ? "Click an issue to inspect it here." : "Click a pull request to inspect it here."}
                </p>
              </div>
              {isLoading ? (
                <Badge variant="info">Analyzing</Badge>
              ) : summary ? (
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", confidenceColors[summary.confidence] ?? confidenceColors.low)} title={`Confidence: ${summary.confidence}`} />
                  <Badge variant={statusVariantMap[summary.status] ?? "default"}>{summary.status}</Badge>
                  <Badge variant={analysisMode === "codebase" ? "done" : "default"}>
                    {analysisMode === "codebase" ? "Code context" : "Instant brief"}
                  </Badge>
                </div>
              ) : null}
            </div>

            <div className="mt-1 flex items-center justify-between gap-3 py-1">
              <div className="flex min-w-0 items-center gap-2">
                <div className="relative min-w-[10.5rem]">
                  <select
                    id={`${kind}-copilot-model`}
                    value={selectedModelId ?? ""}
                    onChange={(event) => onModelChange(event.target.value)}
                    disabled={modelsLoading || modelOptions.length === 0}
                    className="h-8 w-full appearance-none rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] pl-2.5 pr-7 text-[11px] font-medium text-[var(--color-fg-muted)] outline-none transition-colors hover:border-[var(--color-border-emphasis)] hover:text-[var(--color-fg-default)] focus:border-[var(--color-accent-emphasis)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {modelOptions.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
                </div>

                <div className="relative min-w-[10rem]">
                  <select
                    id={`${kind}-grounding-stage-limit`}
                    value={selectedGroundingStageLimit ?? 0}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      onGroundingStageLimitChange(value === 0 ? null : value);
                    }}
                    className="h-8 w-full appearance-none rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] pl-2.5 pr-7 text-[11px] font-medium text-[var(--color-fg-muted)] outline-none transition-colors hover:border-[var(--color-border-emphasis)] hover:text-[var(--color-fg-default)] focus:border-[var(--color-accent-emphasis)]"
                  >
                    <option value={0}>Full pipeline</option>
                    {GROUNDING_STAGE_OPTIONS.map((stage) => (
                      <option key={stage} value={stage}>
                        Verify stage {stage}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => onGround(selectedGroundingStageLimit ?? undefined)}
                disabled={!canGround}
                aria-label={analysisMode === "codebase" ? "Refresh grounded analysis with repository code context" : "Ground this result with repository code context"}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-3 text-[11px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
                  analysisMode === "codebase"
                    ? "border-[var(--color-done-fg)]/20 bg-[var(--color-done-subtle)] text-[var(--color-done-fg)] hover:border-[var(--color-done-fg)]/30 hover:bg-[var(--color-done-subtle)]"
                    : "border-[var(--color-accent-emphasis)]/20 bg-[var(--color-canvas-default)] text-[var(--color-accent-fg)] hover:border-[var(--color-accent-emphasis)]/35 hover:bg-[var(--color-accent-subtle)]",
                )}
              >
                {isGrounding ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ScanSearch className="h-3 w-3" />
                )}
                {groundButtonLabel}
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 xl:overflow-y-auto xl:pr-1">
            {isGrounding && (
              <RepoAssistantGroundingState
                kind={kind}
                branch={kind === "pull" ? (item as ScmPR | null)?.sourceBranch : activeBranch}
                modelLabel={selectedModel?.label ?? null}
              />
            )}

            {error && (
              <div className="rounded-lg border border-[var(--color-danger-fg)]/25 bg-[var(--color-danger-subtle)] px-3 py-2 text-[12px] text-[var(--color-fg-default)]">
                {error}
              </div>
            )}

            {summary?.groundingTrace && !isGrounding && (
              <RepoAssistantTracePanel trace={summary.groundingTrace} />
            )}

            {isLoading && !summary && !isGrounding && <RepoAssistantLoadingState kind={kind} />}

            {!isLoading && !summary && !isGrounding && (
              <div className="rounded-lg border border-dashed border-[var(--color-border-default)] bg-[var(--color-canvas-default)] p-4 text-sm text-[var(--color-fg-muted)]">
                {kind === "issue"
                  ? "Click an issue card to keep a summary here while you paginate through the list."
                  : "Click a pull request card to keep a summary here while you paginate through the list."}
              </div>
            )}

            {summary && (
              <>
                {/* Headline */}
                <div className="space-y-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-5 text-[var(--color-fg-default)]">
                      {summary.headline}
                    </h3>
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-fg)]" />
                  </div>
                  <div className="text-[13px] leading-6 text-[var(--color-fg-default)] [&_p]:my-0 [&_ul]:my-1 [&_li]:my-0">
                    <MarkdownRenderer content={summary.summaryMarkdown} />
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                    Engineering Suggestions
                  </p>
                  <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] p-3 text-[12px] leading-6 text-[var(--color-fg-default)] [&_p]:my-0 [&_ul]:my-1 [&_li]:my-0.5">
                    <MarkdownRenderer content={summary.suggestionsMarkdown} />
                  </div>
                </div>

                {/* Risk (optional) */}
                {summary.riskMarkdown && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                      Risk & Concerns
                    </p>
                    <div className="rounded-lg border border-[var(--color-warning-emphasis)]/20 bg-[var(--color-warning-subtle)] p-3 text-[12px] leading-6 text-[var(--color-fg-default)] [&_p]:my-0 [&_ul]:my-1 [&_li]:my-0.5">
                      <MarkdownRenderer content={summary.riskMarkdown} />
                    </div>
                  </div>
                )}

                {/* Evidence */}
                {summary.evidence.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
                      Evidence
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {summary.evidence.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] px-2.5 py-1.5 text-[11px] text-[var(--color-fg-default)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Actions */}
                {summary.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {summary.suggestedActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        className={cn(
                          "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                          action.kind === "primary"
                            ? "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                            : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {!isLoading && summary && item && (
            <div className="shrink-0 flex items-center justify-between gap-2 border-t border-[var(--color-border-subtle)] pt-1 text-[10px] text-[var(--color-fg-muted)]">
              <div className="flex items-center gap-1">
                <span className="rounded-sm bg-[var(--color-canvas-subtle)] px-1 py-0.5 font-medium text-[var(--color-fg-default)]">
                  {summary.confidence} confidence
                </span>
                <span className="rounded-sm bg-[var(--color-canvas-subtle)] px-1 py-0.5">
                  {analysisMode === "codebase" ? "code context" : "metadata"}
                </span>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-accent-fg)] hover:text-[var(--color-accent-emphasis)]"
              >
                Open
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ListPagination({
  page,
  totalItems,
  itemLabel,
  onPageChange,
}: {
  page: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / LIST_PAGE_SIZE));
  const start = totalItems === 0 ? 0 : (page - 1) * LIST_PAGE_SIZE + 1;
  const end = Math.min(page * LIST_PAGE_SIZE, totalItems);

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5, "gap-end", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "gap-start", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "gap-start", page - 1, page, page + 1, "gap-end", totalPages];
  }, [page, totalPages]);

  if (totalItems <= LIST_PAGE_SIZE) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-1">
      <div className="text-[10px] text-[var(--color-fg-muted)]">
        <span className="font-medium text-[var(--color-fg-default)]">{start}-{end}</span> of {totalItems} {itemLabel}
      </div>

      <nav
        aria-label={`${itemLabel} pagination`}
        className="flex flex-wrap items-center justify-end gap-1"
      >
        <button
          type="button"
          className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-accent-fg)] disabled:pointer-events-none disabled:text-[var(--color-fg-muted)]/50"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-3 w-3" />
          Previous
        </button>

        {pageItems.map((item, index) => {
          if (typeof item !== "number") {
            return (
              <span
                key={`${item}-${index}`}
                className="inline-flex h-7 min-w-7 items-center justify-center px-1 text-[11px] text-[var(--color-fg-muted)]"
              >
                ...
              </span>
            );
          }

          const isActive = item === page;

          return (
            <button
              key={item}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                "inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2.5 text-[11px] font-medium transition-colors",
                isActive
                  ? "bg-[var(--color-accent-fg)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-accent-fg)]"
              )}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-accent-fg)] disabled:pointer-events-none disabled:text-[var(--color-fg-muted)]/50"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </button>
      </nav>
    </div>
  );
}

function BranchPicker({
  repoFullName,
  activeBranch,
  defaultBranch,
  provider,
  onSelect,
}: {
  repoFullName: string;
  activeBranch?: string;
  defaultBranch?: string;
  provider?: string;
  onSelect: (branch: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<string[] | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const loadBranches = useCallback(async () => {
    if (branches || loading) return;
    setLoading(true);
    try {
      const data = await pipelineApi.listBranches(repoFullName, provider);
      setBranches(data);
    } catch {
      setBranches(defaultBranch ? [defaultBranch] : []);
    } finally {
      setLoading(false);
    }
  }, [branches, defaultBranch, loading, provider, repoFullName]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return branches;
    return branches.filter((branch) => branch.toLowerCase().includes(normalized));
  }, [branches, query]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          if (!branches) void loadBranches();
        }}
        className="inline-flex h-10 min-w-[11rem] items-center justify-between gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] px-3 text-[13px] text-[var(--color-fg-default)] shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] transition-[border-color,background-color] hover:bg-[var(--color-canvas-subtle)]"
      >
        <span className="flex min-w-0 items-center gap-2">
          <GitBranch className="h-4 w-4 shrink-0 text-[var(--color-fg-muted)]" />
          <span className="min-w-0 truncate font-medium">{activeBranch ?? defaultBranch ?? "Loading branch..."}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[var(--color-fg-muted)] transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-[20rem] overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-overlay)] shadow-2xl">
          <div className="border-b border-[var(--color-border-default)] p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]">
              <GitBranch className="h-3.5 w-3.5" />
              Branch
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-fg-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter branches..."
                className="h-9 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] pl-9 pr-3 text-[12px] text-[var(--color-fg-default)] placeholder-[var(--color-fg-muted)] focus:outline-none focus:border-[var(--color-accent-emphasis)]"
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5">
            {loading && (
              <div className="flex items-center gap-2 px-3 py-2 text-[12px] text-[var(--color-fg-muted)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading branches...
              </div>
            )}

            {!loading && filteredBranches.length === 0 && (
              <div className="px-3 py-2 text-[12px] text-[var(--color-fg-muted)]">
                No branches match this filter.
              </div>
            )}

            {!loading && filteredBranches.map((branch) => {
              const isActive = branch === activeBranch;
              const isDefault = branch === defaultBranch;
              return (
                <button
                  key={branch}
                  type="button"
                  onClick={() => {
                    onSelect(branch);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[12px] transition-colors",
                    isActive
                      ? "bg-[var(--color-accent-subtle)] text-[var(--color-fg-default)]"
                      : "text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)]"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <GitBranch className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]" />
                    <span className="truncate font-medium">{branch}</span>
                    {isDefault && (
                      <span className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-1.5 py-0.5 text-[10px] text-[var(--color-fg-muted)]">
                        default
                      </span>
                    )}
                  </span>
                  {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-fg)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────

export default function RepoContextHub() {
  const params = useParams<{ owner: string; repo: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoFullName = `${decodeRepoSegment(params.owner)}/${decodeRepoSegment(params.repo)}`;
  const branchParam = getRepoHubSearchParam(searchParams, "branch") ?? undefined;
  const tabParam = parseRepoTabParam(getRepoHubSearchParam(searchParams, "tab"));
  const selectedIssueParam = parsePositiveIntParam(getRepoHubSearchParam(searchParams, "issue"));
  const selectedPullParam = parsePositiveIntParam(getRepoHubSearchParam(searchParams, "pull"));
  const issueStateParam = parseAllowedParam(getRepoHubSearchParam(searchParams, "issueState"), ["open", "closed", "all"] as const, "open");
  const issueSearchParam = getRepoHubSearchParam(searchParams, "issueQuery") ?? "";
  const issuePageParam = parsePositiveIntParam(getRepoHubSearchParam(searchParams, "issuePage")) ?? 1;
  const prStateParam = parseAllowedParam(getRepoHubSearchParam(searchParams, "prState"), ["open", "draft", "merged", "closed", "all"] as const, "open");
  const prSortParam = parseAllowedParam(getRepoHubSearchParam(searchParams, "prSort"), ["updated", "newest"] as const, "newest");
  const prPageParam = parsePositiveIntParam(getRepoHubSearchParam(searchParams, "prPage")) ?? 1;
  const securitySeverityParam = parseAllowedParam(getRepoHubSearchParam(searchParams, "securitySeverity"), ["all", "critical", "high", "medium", "low"] as const, "all");
  const securityTypeParam = parseAllowedParam(getRepoHubSearchParam(searchParams, "securityType"), ["all", "dependabot", "code_scanning", "secret_scanning"] as const, "all");
  const securityFixOnlyParam = getRepoHubSearchParam(searchParams, "securityFixOnly") === "1";
  const effectiveUrlTab: Tab = tabParam ?? "issues";

  const [tab, setTab] = useState<Tab>("issues");
  const pendingTabRef = useRef<Tab | null>(null);
  const [drafting, setDrafting] = useState<number | null>(null);
  const [auditing, setAuditing] = useState(false);
  const [repoMeta, setRepoMeta] = useState<RepoSummary | null>(null);
  const [activity, setActivity] = useState<RepoActivity | null>(null);
  const [linkedRepo, setLinkedRepo] = useState<LinkedRepository | null>(null);

  // Issues state (server-side pagination)
  const [issues, setIssues] = useState<ScmIssue[]>([]);
  const [issuesTotalCount, setIssuesTotalCount] = useState(0);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issuesLoaded, setIssuesLoaded] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ScmIssue | null>(null);
  const [issueAvailability, setIssueAvailability] = useState<AvailabilityState | null>(null);

  // PRs state (server-side pagination)
  const [pulls, setPulls] = useState<ScmPR[]>([]);
  const [pullsTotalCount, setPullsTotalCount] = useState(0);
  const [pullsLoading, setPullsLoading] = useState(false);
  const [pullsLoaded, setPullsLoaded] = useState(false);
  const [selectedPull, setSelectedPull] = useState<ScmPR | null>(null);
  const [copilotModels, setCopilotModels] = useState<CopilotModelOption[]>([]);
  const [copilotModelsLoading, setCopilotModelsLoading] = useState(true);
  const [selectedCopilotModelId, setSelectedCopilotModelId] = useState<string | null>(null);
  const [selectedGroundingStageLimit, setSelectedGroundingStageLimit] = useState<number | null>(1);

  // Security state
  const [security, setSecurity] = useState<SecuritySummary | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityLoaded, setSecurityLoaded] = useState(false);

  const [issueStateFilter, setIssueStateFilter] = useState<"open" | "closed" | "all">(issueStateParam);
  const [issueSearchInput, setIssueSearchInput] = useState(issueSearchParam);
  const [issueSearchDebounced, setIssueSearchDebounced] = useState(issueSearchParam);
  const [issuePage, setIssuePage] = useState(issuePageParam);

  const [prStateFilter, setPrStateFilter] = useState<"open" | "draft" | "merged" | "closed" | "all">(prStateParam);
  const [prSort, setPrSort] = useState<"updated" | "newest">(prSortParam);
  const [prPage, setPrPage] = useState(prPageParam);

  const [securitySeverityFilter, setSecuritySeverityFilter] = useState<"all" | "critical" | "high" | "medium" | "low">(securitySeverityParam);
  const [securityTypeFilter, setSecurityTypeFilter] = useState<"all" | "dependabot" | "code_scanning" | "secret_scanning">(securityTypeParam);
  const [securityFixOnly, setSecurityFixOnly] = useState(securityFixOnlyParam);

  const providerParam = searchParams?.get("provider") ?? undefined;

  const loadRepoMeta = useCallback(async () => {
    try {
      const data = await pipelineApi.getRepo(repoFullName, providerParam);
      setRepoMeta(data);
    } catch (err) {
      console.error("Failed to load repo metadata:", err);
    }
  }, [repoFullName, providerParam]);

  const loadRepoActivity = useCallback(async () => {
    try {
      const data = await pipelineApi.getRepoActivity(repoFullName, providerParam);
      setActivity(data);
    } catch (err) {
      console.error("Failed to load repo activity:", err);
    }
  }, [providerParam, repoFullName]);

  const loadLinkedRepo = useCallback(async () => {
    try {
      const all = await reposApi.list();
      const match = all.find((r) => r.fullName === repoFullName);
      setLinkedRepo(match ?? null);
    } catch {
      // Not linked — that's fine
    }
  }, [repoFullName]);

  useEffect(() => {
    loadRepoMeta();
    loadRepoActivity();
    loadLinkedRepo();
  }, [loadRepoActivity, loadRepoMeta, loadLinkedRepo]);

  const defaultBranch = repoMeta?.defaultBranch;
  const activeBranch = branchParam ?? defaultBranch;
  const branchQuery = activeBranch && defaultBranch && activeBranch !== defaultBranch
    ? `?branch=${encodeURIComponent(activeBranch)}`
    : "";
  const buildSelectionStorageKey = useCallback(
    (kind: "issue" | "pull", number: number) =>
      `${REPO_COPILOT_SELECTION_STORAGE_PREFIX}.${repoFullName}.${kind}.${number}.${activeBranch ?? "default"}`,
    [activeBranch, repoFullName],
  );

  // Copilot summaries
  const {
    summary: issueSummary,
    loading: issueSummaryLoading,
    grounding: issueGrounding,
    error: issueSummaryError,
    analysisMode: issueAnalysisMode,
    reanalyzeWithCodeContext: reanalyzeIssueWithCodeContext,
  } = useCopilotSummary("issue", selectedIssue, repoFullName, selectedCopilotModelId, activeBranch);
  const {
    summary: pullSummary,
    loading: pullSummaryLoading,
    grounding: pullGrounding,
    error: pullSummaryError,
    analysisMode: pullAnalysisMode,
    reanalyzeWithCodeContext: reanalyzePullWithCodeContext,
  } = useCopilotSummary("pull", selectedPull, repoFullName, selectedCopilotModelId, activeBranch);

  useEffect(() => {
    let cancelled = false;

    const loadCopilotModels = async () => {
      setCopilotModelsLoading(true);
      try {
        const models = await copilot.models();
        if (cancelled) return;

        setCopilotModels(models);

        const storedModelId = typeof window !== "undefined"
          ? localStorage.getItem(REPO_COPILOT_MODEL_STORAGE_KEY)
          : null;

        const storedModelIsValid = storedModelId
          ? models.some((model) => model.id === storedModelId)
          : false;

        const defaultModelId = models.find((model) => model.isDefault)?.id ?? models[0]?.id ?? null;
        const resolvedModelId = storedModelIsValid ? storedModelId : defaultModelId;

        setSelectedCopilotModelId(resolvedModelId);

        if (resolvedModelId && typeof window !== "undefined") {
          localStorage.setItem(REPO_COPILOT_MODEL_STORAGE_KEY, resolvedModelId);
        }
      } catch (err) {
        console.error("Failed to load Copilot models:", err);
      } finally {
        if (!cancelled) {
          setCopilotModelsLoading(false);
        }
      }
    };

    loadCopilotModels();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(REPO_COPILOT_STAGE_LIMIT_STORAGE_KEY);
    if (!raw) return;

    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 6) {
      setSelectedGroundingStageLimit(parsed);
      return;
    }

    if (parsed === 0) {
      setSelectedGroundingStageLimit(null);
    }
  }, []);

  useEffect(() => {
    if (pendingTabRef.current) {
      if (effectiveUrlTab === pendingTabRef.current) {
        pendingTabRef.current = null;
      } else {
        return;
      }
    }

    if (tab !== effectiveUrlTab) {
      setTab(effectiveUrlTab);
    }
  }, [effectiveUrlTab, tab]);

  useEffect(() => {
    if (issueStateFilter !== issueStateParam) {
      setIssueStateFilter(issueStateParam);
    }
  }, [issueStateFilter, issueStateParam]);

  useEffect(() => {
    if (issueSearchInput !== issueSearchParam) {
      setIssueSearchInput(issueSearchParam);
    }

    if (issueSearchDebounced !== issueSearchParam) {
      setIssueSearchDebounced(issueSearchParam);
    }
  }, [issueSearchDebounced, issueSearchInput, issueSearchParam]);

  useEffect(() => {
    if (issuePage !== issuePageParam) {
      setIssuePage(issuePageParam);
    }
  }, [issuePage, issuePageParam]);

  useEffect(() => {
    if (prStateFilter !== prStateParam) {
      setPrStateFilter(prStateParam);
    }
  }, [prStateFilter, prStateParam]);

  useEffect(() => {
    if (prSort !== prSortParam) {
      setPrSort(prSortParam);
    }
  }, [prSort, prSortParam]);

  useEffect(() => {
    if (prPage !== prPageParam) {
      setPrPage(prPageParam);
    }
  }, [prPage, prPageParam]);

  useEffect(() => {
    if (securitySeverityFilter !== securitySeverityParam) {
      setSecuritySeverityFilter(securitySeverityParam);
    }
  }, [securitySeverityFilter, securitySeverityParam]);

  useEffect(() => {
    if (securityTypeFilter !== securityTypeParam) {
      setSecurityTypeFilter(securityTypeParam);
    }
  }, [securityTypeFilter, securityTypeParam]);

  useEffect(() => {
    if (securityFixOnly !== securityFixOnlyParam) {
      setSecurityFixOnly(securityFixOnlyParam);
    }
  }, [securityFixOnly, securityFixOnlyParam]);

  const handleCopilotModelChange = useCallback((modelId: string) => {
    setSelectedCopilotModelId(modelId);
    localStorage.setItem(REPO_COPILOT_MODEL_STORAGE_KEY, modelId);
  }, []);

  const handleGroundingStageLimitChange = useCallback((stageLimit: number | null) => {
    setSelectedGroundingStageLimit(stageLimit);
    if (typeof window !== "undefined") {
      localStorage.setItem(REPO_COPILOT_STAGE_LIMIT_STORAGE_KEY, String(stageLimit ?? 0));
    }
  }, []);

  useEffect(() => {
    if (defaultBranch && branchParam === defaultBranch) {
      const nextParams = new URLSearchParams(searchParams.toString());
      deleteRepoHubSearchParam(nextParams, "branch");
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `/repos/${repoFullName}?${nextQuery}` : `/repos/${repoFullName}`);
    }
  }, [branchParam, defaultBranch, repoFullName, router, searchParams]);

  useEffect(() => {
    if (!selectedIssueParam || selectedIssue) return;

    const persistedSelection = readPersistedSelection<ScmIssue>(buildSelectionStorageKey("issue", selectedIssueParam));
    if (persistedSelection) {
      setSelectedIssue(persistedSelection);
    }
  }, [buildSelectionStorageKey, selectedIssue, selectedIssueParam]);

  useEffect(() => {
    if (!selectedPullParam || selectedPull) return;

    const persistedSelection = readPersistedSelection<ScmPR>(buildSelectionStorageKey("pull", selectedPullParam));
    if (persistedSelection) {
      setSelectedPull(persistedSelection);
    }
  }, [buildSelectionStorageKey, selectedPull, selectedPullParam]);

  const handleBranchSelect = useCallback((branch: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!defaultBranch) return;
    if (branch === defaultBranch) {
      deleteRepoHubSearchParam(nextParams, "branch");
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `/repos/${repoFullName}?${nextQuery}` : `/repos/${repoFullName}`);
      return;
    }
    nextParams.set(REPO_HUB_QUERY_KEYS.branch, branch);
    nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS.branch);
    router.replace(`/repos/${repoFullName}?${nextParams.toString()}`);
  }, [defaultBranch, repoFullName, router, searchParams]);

  const handleTabChange = useCallback((nextTab: Tab) => {
    pendingTabRef.current = nextTab;
    setTab(nextTab);
  }, []);

  // Debounce issue search
  useEffect(() => {
    const timer = setTimeout(() => setIssueSearchDebounced(issueSearchInput), 300);
    return () => clearTimeout(timer);
  }, [issueSearchInput]);

  const loadIssues = useCallback(async (page: number, state: string, search: string) => {
    setIssuesLoading(true);
    try {
      const data = await pipelineApi.listIssues(repoFullName, {
        state,
        page,
        perPage: LIST_PAGE_SIZE,
        q: search || undefined,
        provider: providerParam,
      });
      setIssues(data.items);
      setIssuesTotalCount(data.totalCount);
      setIssueAvailability(data.availability ?? { status: "ok" });
      setIssuesLoaded(true);
    } catch (err) {
      console.error("Failed to load issues:", err);
      setIssueAvailability(null);
    } finally {
      setIssuesLoading(false);
    }
  }, [providerParam, repoFullName]);

  const loadPulls = useCallback(async (page: number, state: string, sort: string) => {
    setPullsLoading(true);
    try {
      const data = await pipelineApi.listPulls(repoFullName, {
        state,
        page,
        perPage: LIST_PAGE_SIZE,
        sort: sort === "newest" ? "created" : "updated",
        provider: providerParam,
      });
      setPulls(data.items);
      setPullsTotalCount(data.totalCount);
      setPullsLoaded(true);
    } catch (err) {
      console.error("Failed to load pulls:", err);
    } finally {
      setPullsLoading(false);
    }
  }, [providerParam, repoFullName]);

  const loadSecurity = useCallback(async () => {
    setSecurityLoading(true);
    try {
      const data = await pipelineApi.getSecuritySummary(repoFullName, providerParam);
      setSecurity(data);
      setSecurityLoaded(true);
    } catch (err) {
      console.error("Failed to load security:", err);
    } finally {
      setSecurityLoading(false);
    }
  }, [providerParam, repoFullName]);

  // Load issues when tab is active or filters/page change
  useEffect(() => {
    if (tab === "issues") {
      loadIssues(issuePage, issueStateFilter, issueSearchDebounced);
    }
  }, [tab, issuePage, issueStateFilter, issueSearchDebounced, loadIssues]);

  // Load pulls when tab is active or filters/page change
  useEffect(() => {
    if (tab === "pulls") {
      loadPulls(prPage, prStateFilter, prSort);
    }
  }, [tab, prPage, prStateFilter, prSort, loadPulls]);

  // Load security only once when tab is first visited
  useEffect(() => {
    if (tab === "security" && !securityLoaded) loadSecurity();
  }, [tab, securityLoaded, loadSecurity]);

  useEffect(() => {
    setSelectedIssue(null);
  }, [issuePage, issueStateFilter, issueSearchDebounced, repoFullName]);

  useEffect(() => {
    setIssueAvailability(null);
  }, [issuePage, issueSearchDebounced, issueStateFilter, repoFullName]);

  useEffect(() => {
    setSelectedPull(null);
  }, [prPage, prStateFilter, prSort, repoFullName]);

  useEffect(() => {
    setSelectedIssue((current) => {
      if (issues.length === 0) return null;
      if (selectedIssueParam && current?.number === selectedIssueParam) {
        return current;
      }

      const requestedIssue = selectedIssueParam
        ? issues.find((issue) => issue.number === selectedIssueParam)
        : null;

      if (requestedIssue) {
        return requestedIssue;
      }

      return current && issues.some((issue) => issue.number === current.number) ? current : issues[0];
    });
  }, [issues, selectedIssueParam]);

  useEffect(() => {
    setSelectedPull((current) => {
      if (pulls.length === 0) return null;
      if (selectedPullParam && current?.number === selectedPullParam) {
        return current;
      }

      const requestedPull = selectedPullParam
        ? pulls.find((pr) => pr.number === selectedPullParam)
        : null;

      if (requestedPull) {
        return requestedPull;
      }

      return current && pulls.some((pr) => pr.number === current.number) ? current : pulls[0];
    });
  }, [pulls, selectedPullParam]);

  useEffect(() => {
    if (!selectedIssue) return;
    writePersistedSelection(buildSelectionStorageKey("issue", selectedIssue.number), selectedIssue);
  }, [buildSelectionStorageKey, selectedIssue]);

  useEffect(() => {
    if (!selectedPull) return;
    writePersistedSelection(buildSelectionStorageKey("pull", selectedPull.number), selectedPull);
  }, [buildSelectionStorageKey, selectedPull]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.keys(REPO_HUB_LEGACY_QUERY_KEYS).forEach((key) => {
      deleteRepoHubSearchParam(nextParams, key as keyof typeof REPO_HUB_QUERY_KEYS);
    });

    if (activeBranch && defaultBranch && activeBranch !== defaultBranch) {
      nextParams.set(REPO_HUB_QUERY_KEYS.branch, activeBranch);
    } else {
      deleteRepoHubSearchParam(nextParams, "branch");
    }

    if (tab === "issues") {
      deleteRepoHubSearchParam(nextParams, "tab");
      if (selectedIssue) {
        nextParams.set(REPO_HUB_QUERY_KEYS.issue, String(selectedIssue.number));
      } else {
        deleteRepoHubSearchParam(nextParams, "issue");
      }
      deleteRepoHubSearchParam(nextParams, "pull");
    } else if (tab === "pulls") {
      nextParams.set(REPO_HUB_QUERY_KEYS.tab, "pulls");
      if (selectedPull) {
        nextParams.set(REPO_HUB_QUERY_KEYS.pull, String(selectedPull.number));
      } else {
        deleteRepoHubSearchParam(nextParams, "pull");
      }
      deleteRepoHubSearchParam(nextParams, "issue");
    } else {
      nextParams.set(REPO_HUB_QUERY_KEYS.tab, "security");
      deleteRepoHubSearchParam(nextParams, "issue");
      deleteRepoHubSearchParam(nextParams, "pull");
    }

    if (issueStateFilter !== "open") {
      nextParams.set(REPO_HUB_QUERY_KEYS.issueState, issueStateFilter);
    } else {
      deleteRepoHubSearchParam(nextParams, "issueState");
    }

    if (issueSearchInput.trim()) {
      nextParams.set(REPO_HUB_QUERY_KEYS.issueQuery, issueSearchInput);
    } else {
      deleteRepoHubSearchParam(nextParams, "issueQuery");
    }

    if (issuePage > 1) {
      nextParams.set(REPO_HUB_QUERY_KEYS.issuePage, String(issuePage));
    } else {
      deleteRepoHubSearchParam(nextParams, "issuePage");
    }

    if (prStateFilter !== "open") {
      nextParams.set(REPO_HUB_QUERY_KEYS.prState, prStateFilter);
    } else {
      deleteRepoHubSearchParam(nextParams, "prState");
    }

    if (prSort !== "newest") {
      nextParams.set(REPO_HUB_QUERY_KEYS.prSort, prSort);
    } else {
      deleteRepoHubSearchParam(nextParams, "prSort");
    }

    if (prPage > 1) {
      nextParams.set(REPO_HUB_QUERY_KEYS.prPage, String(prPage));
    } else {
      deleteRepoHubSearchParam(nextParams, "prPage");
    }

    if (securitySeverityFilter !== "all") {
      nextParams.set(REPO_HUB_QUERY_KEYS.securitySeverity, securitySeverityFilter);
    } else {
      deleteRepoHubSearchParam(nextParams, "securitySeverity");
    }

    if (securityTypeFilter !== "all") {
      nextParams.set(REPO_HUB_QUERY_KEYS.securityType, securityTypeFilter);
    } else {
      deleteRepoHubSearchParam(nextParams, "securityType");
    }

    if (securityFixOnly) {
      nextParams.set(REPO_HUB_QUERY_KEYS.securityFixOnly, "1");
    } else {
      deleteRepoHubSearchParam(nextParams, "securityFixOnly");
    }

    const nextQuery = nextParams.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery === currentQuery) return;

    const href = nextQuery ? `/repos/${repoFullName}?${nextQuery}` : `/repos/${repoFullName}`;
    router.replace(href, { scroll: false });
  }, [
    activeBranch,
    defaultBranch,
    issuePage,
    issueSearchInput,
    issueStateFilter,
    prPage,
    prSort,
    prStateFilter,
    repoFullName,
    router,
    searchParams,
    securityFixOnly,
    securitySeverityFilter,
    securityTypeFilter,
    selectedIssue,
    selectedPull,
    tab,
  ]);

  const buildRepoDetailHref = useCallback(
    (kind: "issue" | "pull" | "security", identifier: number | string) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (activeBranch && defaultBranch && activeBranch !== defaultBranch) {
        nextParams.set(REPO_HUB_QUERY_KEYS.branch, activeBranch);
        nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS.branch);
      } else {
        deleteRepoHubSearchParam(nextParams, "branch");
      }

      if (kind === "issue") {
        nextParams.set(REPO_HUB_QUERY_KEYS.issue, String(identifier));
        nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS.issue);
      } else if (kind === "pull") {
        nextParams.set(REPO_HUB_QUERY_KEYS.tab, "pulls");
        nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS.tab);
        nextParams.set(REPO_HUB_QUERY_KEYS.pull, String(identifier));
        nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS.pull);
      } else {
        nextParams.set(REPO_HUB_QUERY_KEYS.tab, "security");
        nextParams.delete(REPO_HUB_LEGACY_QUERY_KEYS.tab);
      }

      const query = nextParams.toString();
      const basePath =
        kind === "issue"
          ? `/repos/${repoFullName}/issues/${identifier}`
          : kind === "pull"
            ? `/repos/${repoFullName}/pulls/${identifier}`
            : `/repos/${repoFullName}/security/${identifier}`;

      return query ? `${basePath}?${query}` : basePath;
    },
    [activeBranch, defaultBranch, repoFullName, searchParams],
  );

  const handleIssueStateFilterChange = useCallback((value: "open" | "closed" | "all") => {
    setIssueStateFilter(value);
    setIssuePage(1);
  }, []);

  const handleIssueSearchChange = useCallback((value: string) => {
    setIssueSearchInput(value);
    setIssuePage(1);
  }, []);

  const handlePrStateFilterChange = useCallback((value: "open" | "draft" | "merged" | "closed" | "all") => {
    setPrStateFilter(value);
    setPrPage(1);
  }, []);

  const handlePrSortChange = useCallback((value: "updated" | "newest") => {
    setPrSort(value);
    setPrPage(1);
  }, []);

  const handleSecuritySeverityFilterChange = useCallback((value: "all" | "critical" | "high" | "medium" | "low") => {
    setSecuritySeverityFilter(value);
  }, []);

  const handleSecurityTypeFilterChange = useCallback((value: "all" | "dependabot" | "code_scanning" | "secret_scanning") => {
    setSecurityTypeFilter(value);
  }, []);

  const handleSecurityFixOnlyToggle = useCallback(() => {
    setSecurityFixOnly((value) => !value);
  }, []);

  async function handleDraftFromIssue(issue: ScmIssue) {
    setDrafting(issue.number);
    try {
      const result = await pipelineApi.draft({
        type: "issue",
        repositoryFullName: repoFullName,
        refNumber: issue.number,
        title: issue.title,
        body: issue.body,
        ...(activeBranch ? { targetBranch: activeBranch } : {}),
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to draft from issue:", err);
      setDrafting(null);
    }
  }

  async function handleDraftFromPR(pr: ScmPR) {
    setDrafting(pr.number);
    try {
      const result = await pipelineApi.draft({
        type: "pull_request",
        repositoryFullName: repoFullName,
        refNumber: pr.number,
        title: pr.title,
        body: pr.body,
        ...(activeBranch ? { targetBranch: activeBranch } : {}),
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to draft from PR:", err);
      setDrafting(null);
    }
  }

  async function handleDraftFromAlert(alert: SecurityAlert) {
    setDrafting(alert.id);
    try {
      const result = await pipelineApi.draft({
        type: "security",
        repositoryFullName: repoFullName,
        refNumber: alert.id,
        title: alert.title,
        body: alert.description,
        alertType: alert.alertType,
        severity: alert.severity,
        affectedComponent: alert.affectedComponent,
        ...(activeBranch ? { targetBranch: activeBranch } : {}),
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to draft from alert:", err);
      setDrafting(null);
    }
  }

  async function handleSecurityAudit() {
    setAuditing(true);
    try {
      const result = await pipelineApi.securityAudit({
        repoFullName,
        minSeverity: "high",
        maxAlerts: 10,
      });
      if (result.runs.length > 0) {
        router.push("/agent");
      }
    } catch (err) {
      console.error("Security audit failed:", err);
    } finally {
      setAuditing(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof CircleDot; count?: number }[] = [
    { key: "issues", label: "Issues", icon: CircleDot, count: issueAvailability?.status === "limited" ? undefined : activity?.openIssues },
    { key: "pulls", label: "Pull Requests", icon: GitPullRequest, count: activity?.openPRs },
    { key: "security", label: "Security", icon: ShieldAlert, count: securityLoaded ? security?.totalAlerts : undefined },
  ];

  const filteredSecurityAlerts = useMemo(() => {
    const alerts = security?.alerts ?? [];
    return alerts.filter((alert) => {
      if (securitySeverityFilter !== "all" && alert.severity !== securitySeverityFilter) return false;
      if (securityTypeFilter !== "all" && alert.alertType !== securityTypeFilter) return false;
      if (securityFixOnly && !alert.fixAvailable) return false;
      return true;
    });
  }, [security?.alerts, securityFixOnly, securitySeverityFilter, securityTypeFilter]);

  const metadataItems = useMemo(() => {
    return [
      {
        key: "visibility",
        icon: Eye,
        label: repoMeta?.private ? "Private" : "Public",
      },
      {
        key: "provider",
        icon: Sparkles,
        label: providerLabel(repoMeta?.provider),
      },
      {
        key: "index",
        icon: Database,
        label: repoMeta?.indexed ? `${repoMeta.indexedFiles} indexed files` : "Not indexed",
        tone: repoMeta?.indexed ? "text-[var(--color-success-fg)]" : undefined,
      },
      {
        key: "default-branch",
        icon: GitBranch,
        label: `Default: ${defaultBranch ?? "..."}`,
      },
      {
        key: "target-branch",
        icon: GitBranch,
        label: `Draft target: ${activeBranch ?? "..."}`,
        tone: "text-[var(--color-accent-fg)]",
      },
      ...(repoMeta?.language ? [{ key: "language", icon: Sparkles, label: repoMeta.language }] : []),
      ...(repoMeta?.stars !== undefined ? [{ key: "stars", icon: Star, label: `${repoMeta.stars} stars` }] : []),
      // Repo-policy badges (from linked repository config)
      ...(linkedRepo ? [
        {
          key: "identity",
          icon: linkedRepo.identityMode === IdentityMode.AssumeUser ? UserCheck : Bot,
          label: linkedRepo.identityMode === IdentityMode.AssumeUser ? "Assume User" : "Service Account",
        },
        {
          key: "webhook",
          icon: Webhook,
          label: linkedRepo.webhookActive ? "Webhook Active" : "No Webhook",
          tone: linkedRepo.webhookActive ? "text-[var(--color-success-fg)]" : undefined,
        },
        ...(linkedRepo.defaultReviewer ? [{
          key: "reviewer",
          icon: UserCheck,
          label: `Reviewer: @${linkedRepo.defaultReviewer}`,
        }] : []),
      ] : []),
    ];
  }, [activeBranch, defaultBranch, linkedRepo, repoMeta]);

  return (
    <div data-flush-layout className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--color-canvas-default)] p-6">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/repos")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="space-y-3">
            <h1 className="text-xl font-semibold text-[var(--color-fg-default)]">{repoFullName}</h1>
            <p className="text-sm text-[var(--color-fg-muted)]">
              Repo-wide issues, pull requests, and security. Drafts target {activeBranch ?? "the selected branch"}.
            </p>
            <div className="flex flex-wrap gap-2">
              {metadataItems.map((item) => (
                <span
                  key={item.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-1.5 text-[12px] text-[var(--color-fg-default)]",
                    item.tone
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)]" />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
            {repoMeta?.description && (
              <p className="max-w-3xl text-sm text-[var(--color-fg-muted)]">
                {repoMeta.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-1 self-start md:self-auto">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]">
            Draft Target Branch
          </span>
          <BranchPicker
            repoFullName={repoFullName}
            activeBranch={activeBranch}
            defaultBranch={defaultBranch}
            provider={providerParam}
            onSelect={handleBranchSelect}
          />
          <span className="text-[11px] text-[var(--color-fg-muted)]">
            Used for agent drafts and generated fixes.
          </span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="shrink-0 flex gap-1 border-b border-[var(--color-border-default)]">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
              tab === t.key
                ? "border-[var(--color-accent-emphasis)] text-[var(--color-fg-default)]"
                : "border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1 text-xs bg-[var(--color-neutral-muted)] px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-hidden">
      {tab === "issues" && (
        <div className="grid h-full min-h-0 gap-6 overflow-hidden xl:grid-cols-[minmax(0,1fr)_26rem] 2xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div className="flex min-h-0 flex-col gap-2 min-w-0">
          <div className="shrink-0 flex flex-col gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {([
                  ["open", "Open"],
                  ["closed", "Closed"],
                  ["all", "All"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleIssueStateFilterChange(value)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                      issueStateFilter === value
                        ? "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                        : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[14rem] flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-fg-muted)]" />
                <input
                  type="text"
                  value={issueSearchInput}
                  onChange={(event) => handleIssueSearchChange(event.target.value)}
                  placeholder="Search issues..."
                  className="h-9 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] pl-9 pr-3 text-[12px] text-[var(--color-fg-default)] placeholder-[var(--color-fg-muted)] focus:outline-none focus:border-[var(--color-accent-emphasis)]"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 px-1 pb-1 text-[12px] text-[var(--color-fg-muted)]">
            <CircleDot className="h-3.5 w-3.5 text-[var(--color-danger-fg)]" />
            <span>
              {issueAvailability?.status === "limited"
                ? "Issue access limited"
                : `${issuesTotalCount} issue${issuesTotalCount === 1 ? "" : "s"}`}
            </span>
            {issuesLoading && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-gutter:stable] overscroll-contain">
            <div className="space-y-3 pb-2">
            {issueAvailability?.status === "limited" && (
              <div className="rounded-xl border border-[var(--color-warning-emphasis)]/40 bg-[var(--color-warning-subtle)] px-4 py-3 text-sm text-[var(--color-warning-fg)]">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-medium">Issue permissions are limited for this connection.</p>
                    <p className="mt-1 text-[13px] text-[var(--color-fg-muted)]">
                      {issueAvailability.reason ?? "This token can reach the repository, but it cannot read issue data for this provider."}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {issuesLoading && !issuesLoaded ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-muted)]" />
              </div>
            ) : issues.length === 0 && issuesLoaded ? (
              <div className="rounded-xl border border-[var(--color-border-default)] px-4 py-10 text-center text-sm text-[var(--color-fg-muted)]">
                {issueAvailability?.status === "limited"
                  ? "Issue data is unavailable for this PAT. Add the required scope, then refresh."
                  : "No issues match the current filters."}
              </div>
            ) : (
              issues.map((issue: ScmIssue) => (
                <div
                  key={issue.number}
                  className={cn(
                    "group relative flex items-stretch overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:border-[var(--color-danger-fg)]/30 hover:shadow-md",
                    selectedIssue?.number === issue.number && "border-[var(--color-accent-emphasis)] shadow-md"
                  )}
                >
                  {/* Left accent bar */}
                  <div className="w-[3px] shrink-0 bg-[var(--color-danger-fg)]/20 transition-colors group-hover:bg-[var(--color-danger-fg)]" />

                  <button
                    type="button"
                    onClick={() => setSelectedIssue(issue)}
                    className="flex flex-1 items-start gap-3 px-4 py-3.5 text-left"
                  >
                    <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-danger-fg)]" />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold leading-5 text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)]">
                          {issue.title}
                        </span>
                        {issue.labels.map((l) => (
                          <span
                            key={l.name}
                            className="text-[10px] px-1.5 py-0.5 rounded-full border"
                            style={labelStyle(l.color)}
                          >
                            {l.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-fg-muted)]">
                        <span className="font-mono font-medium text-[var(--color-danger-fg)]/60">#{issue.number}</span>
                        <span>opened {timeAgo(issue.createdAt)}</span>
                        {issue.user && <span>by {issue.user.login}</span>}
                        {issue.commentsCount > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {issue.commentsCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-1.5 px-3 py-3.5">
                    <button
                      type="button"
                      onClick={() => router.push(buildRepoDetailHref("issue", issue.number))}
                      className="rounded-lg p-1.5 text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
                      aria-label={`Open issue ${issue.number}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDraftFromIssue(issue)}
                      disabled={drafting === issue.number}
                      className="gap-1 border-[var(--color-danger-fg)]/25 text-[var(--color-danger-fg)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger-emphasis)]"
                    >
                      {drafting === issue.number ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Rocket className="h-3 w-3" />
                      )}
                      Draft
                    </Button>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>

          <div className="shrink-0 border-t border-[var(--color-border-subtle)] pt-2 pb-1">
            <ListPagination
              page={issuePage}
              totalItems={issuesTotalCount}
              itemLabel={issuesTotalCount === 1 ? "issue" : "issues"}
              onPageChange={setIssuePage}
            />
          </div>
          </div>

          <RepoAssistantPanel
            kind="issue"
            summary={issueSummary}
            isLoading={issueSummaryLoading || (issuesLoading && !selectedIssue)}
            isGrounding={issueGrounding}
            error={issueSummaryError}
            analysisMode={issueAnalysisMode}
            item={selectedIssue}
            activeBranch={activeBranch}
            modelOptions={copilotModels}
            selectedModelId={selectedCopilotModelId}
            onModelChange={handleCopilotModelChange}
            onGround={(stageLimit) => reanalyzeIssueWithCodeContext(
              issueAnalysisMode === "codebase" || typeof stageLimit === "number",
              { stageLimit, includeTrace: true },
            )}
            selectedGroundingStageLimit={selectedGroundingStageLimit}
            onGroundingStageLimitChange={handleGroundingStageLimitChange}
            modelsLoading={copilotModelsLoading}
          />
        </div>
      )}

      {tab === "pulls" && (
        <div className="grid h-full min-h-0 gap-6 overflow-hidden xl:grid-cols-[minmax(0,1fr)_26rem] 2xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div className="flex min-h-0 flex-col gap-2 min-w-0">
          <div className="shrink-0 flex flex-col gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {([
                ["open", "Open"],
                ["draft", "Draft"],
                ["merged", "Merged"],
                ["closed", "Closed"],
                ["all", "All"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePrStateFilterChange(value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                    prStateFilter === value
                      ? "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                      : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={prSort}
              onChange={(event) => handlePrSortChange(event.target.value as "updated" | "newest")}
              className="h-9 min-w-[11rem] rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] px-3 text-[12px] text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-emphasis)]"
            >
              <option value="updated">Sort: Recently updated</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>

          <div className="shrink-0 flex items-center gap-2 px-1 pb-1 text-[12px] text-[var(--color-fg-muted)]">
            <GitPullRequest className="h-3.5 w-3.5 text-[var(--color-success-fg)]" />
            <span>{pullsTotalCount} pull request{pullsTotalCount === 1 ? "" : "s"}</span>
            <span className="ml-auto text-[11px]">sorted by {prSort === "updated" ? "recent activity" : "newest"}</span>
            {pullsLoading && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-gutter:stable] overscroll-contain">
            <div className="space-y-3 pb-2">
            {pullsLoading && !pullsLoaded ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-muted)]" />
              </div>
            ) : pulls.length === 0 && pullsLoaded ? (
              <div className="rounded-xl border border-[var(--color-border-default)] px-4 py-10 text-center text-sm text-[var(--color-fg-muted)]">
                No pull requests match the current filters.
              </div>
            ) : (
              pulls.map((pr: ScmPR) => (
                <div
                  key={pr.number}
                  className={cn(
                    "group relative flex items-stretch overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:border-[var(--color-success-fg)]/30 hover:shadow-md",
                    selectedPull?.number === pr.number && "border-[var(--color-accent-emphasis)] shadow-md"
                  )}
                >
                  {/* Left accent bar */}
                  <div className={cn(
                    "w-[3px] shrink-0 transition-colors",
                    pr.state === "merged"
                      ? "bg-[var(--color-done-fg)]/20 group-hover:bg-[var(--color-done-fg)]"
                      : pr.state === "closed"
                      ? "bg-[var(--color-border-default)] group-hover:bg-[var(--color-fg-muted)]"
                      : "bg-[var(--color-success-fg)]/20 group-hover:bg-[var(--color-success-fg)]"
                  )} />

                  <button
                    type="button"
                    onClick={() => setSelectedPull(pr)}
                    className="flex flex-1 items-start gap-3 px-4 py-3.5 text-left"
                  >
                    <GitPullRequest className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      pr.state === "merged" ? "text-[var(--color-done-fg)]" : pr.state === "closed" ? "text-[var(--color-fg-muted)]" : "text-[var(--color-success-fg)]"
                    )} />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold leading-5 text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)]">
                          {pr.title}
                        </span>
                        <Badge variant={pr.state === "merged" ? "done" : pr.state === "closed" ? "default" : "info"}>
                          {pr.isDraft ? "draft" : pr.state}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-fg-muted)]">
                        <span className={cn(
                          "font-mono font-medium",
                          pr.state === "merged" ? "text-[var(--color-done-fg)]/60" : pr.state === "closed" ? "text-[var(--color-fg-muted)]" : "text-[var(--color-success-fg)]/60"
                        )}>#{pr.number}</span>
                        {pr.sourceBranch && pr.targetBranch && (
                          <span className="font-mono text-[10px]">{pr.sourceBranch} → {pr.targetBranch}</span>
                        )}
                        <span>updated {timeAgo(pr.updatedAt)}</span>
                        {pr.user && <span>by {pr.user.login}</span>}
                      </div>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-1.5 px-3 py-3.5">
                    <button
                      type="button"
                      onClick={() => router.push(buildRepoDetailHref("pull", pr.number))}
                      className="rounded-lg p-1.5 text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
                      aria-label={`Open pull request ${pr.number}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-1.5 text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDraftFromPR(pr)}
                      disabled={drafting === pr.number}
                      className={cn(
                        "gap-1 transition-colors",
                        pr.state === "merged"
                          ? "border-[var(--color-done-fg)]/25 text-[var(--color-done-fg)] hover:bg-[var(--color-done-subtle)] hover:text-[var(--color-done-emphasis)]"
                          : pr.state === "closed"
                          ? "border-[var(--color-border-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                          : "border-[var(--color-success-fg)]/25 text-[var(--color-success-fg)] hover:bg-[var(--color-success-subtle)] hover:text-[var(--color-success-emphasis)]"
                      )}
                    >
                      {drafting === pr.number ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Rocket className="h-3 w-3" />
                      )}
                      Draft
                    </Button>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>

          <div className="shrink-0 border-t border-[var(--color-border-subtle)] pt-2 pb-1">
            <ListPagination
              page={prPage}
              totalItems={pullsTotalCount}
              itemLabel={pullsTotalCount === 1 ? "pull request" : "pull requests"}
              onPageChange={setPrPage}
            />
          </div>
          </div>

          <RepoAssistantPanel
            kind="pull"
            summary={pullSummary}
            isLoading={pullSummaryLoading || (pullsLoading && !selectedPull)}
            isGrounding={pullGrounding}
            error={pullSummaryError}
            analysisMode={pullAnalysisMode}
            item={selectedPull}
            activeBranch={activeBranch}
            modelOptions={copilotModels}
            selectedModelId={selectedCopilotModelId}
            onModelChange={handleCopilotModelChange}
            onGround={(stageLimit) => reanalyzePullWithCodeContext(
              pullAnalysisMode === "codebase" || typeof stageLimit === "number",
              { stageLimit, includeTrace: true },
            )}
            selectedGroundingStageLimit={selectedGroundingStageLimit}
            onGroundingStageLimitChange={handleGroundingStageLimitChange}
            modelsLoading={copilotModelsLoading}
          />
        </div>
      )}

      {tab === "security" && security && (
        <div className="h-full min-h-0 overflow-y-auto pr-2 [scrollbar-gutter:stable] overscroll-contain">
        <div className="space-y-4 pb-2">
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {([
                  ["all", "All severities"],
                  ["critical", "Critical"],
                  ["high", "High"],
                  ["medium", "Medium"],
                  ["low", "Low"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSecuritySeverityFilterChange(value)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                      securitySeverityFilter === value
                        ? "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                        : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSecurityFixOnlyToggle()}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                    securityFixOnly
                      ? "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                      : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                  )}
                >
                  Fix available only
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSecurityAudit}
                  disabled={auditing}
                >
                  {auditing ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <ShieldAlert className="h-3 w-3 mr-1" />
                  )}
                  Run Audit
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {([
                ["all", "All types"],
                ["dependabot", "Dependabot"],
                ["code_scanning", "Code Scanning"],
                ["secret_scanning", "Secret Scanning"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSecurityTypeFilterChange(value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors",
                    securityTypeFilter === value
                      ? "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                      : "border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Critical", count: security.critical, color: "text-[var(--color-danger-fg)]" },
              { label: "High", count: security.high, color: "text-[var(--color-severe-fg)]" },
              { label: "Medium", count: security.medium, color: "text-[var(--color-warning-fg)]" },
              { label: "Low", count: security.low, color: "text-[var(--color-info-fg)]" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="py-3 px-4 text-center">
                  <p className={cn("text-2xl font-bold", s.color)}>{s.count}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert List */}
          <div className="space-y-2">
            {filteredSecurityAlerts.length === 0 && (
              <div className="flex flex-col items-center py-8 text-[var(--color-fg-muted)]">
                <ShieldCheck className="h-8 w-8 mb-2" />
                <p className="text-sm">No security alerts match the current filters.</p>
              </div>
            )}
            {filteredSecurityAlerts.map((alert) => (
              <Card
                key={`${alert.alertType}-${alert.id}`}
                className="transition-colors"
              >
                <CardContent className="flex items-start gap-4 py-3 px-4">
                  <button
                    type="button"
                    onClick={() => router.push(buildRepoDetailHref("security", `${alert.alertType}/${alert.id}`))}
                    className="flex flex-1 items-start gap-4 text-left rounded-lg px-1 py-1 transition-colors hover:bg-[var(--color-canvas-subtle)]"
                  >
                    <ShieldAlert className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      alert.severity === "critical" || alert.severity === "high"
                        ? "text-[var(--color-danger-fg)]"
                        : alert.severity === "medium"
                        ? "text-[var(--color-warning-fg)]"
                        : "text-[var(--color-info-fg)]"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-fg-default)] truncate">
                          {alert.title}
                        </span>
                        <Badge variant={severityColors[alert.severity] ?? "default"}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="default">{alert.alertType}</Badge>
                        {alert.fixAvailable && (
                          <Badge variant="success">fix available</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-fg-muted)] mt-0.5">
                        <span>{alert.affectedComponent}</span>
                        {alert.cveId && <span>{alert.cveId}</span>}
                        {alert.tool && <span>{alert.tool}</span>}
                        <span>{timeAgo(alert.createdAt)}</span>
                      </div>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-2 pl-2">
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDraftFromAlert(alert)}
                      disabled={drafting === alert.id}
                    >
                      {drafting === alert.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Rocket className="h-3 w-3 mr-1" />
                      )}
                      Fix This
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </div>
      )}
      </div>
    </div>
    </div>
  );
}
