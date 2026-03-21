"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  ListTodo,
  GitPullRequest,
  ArrowRight,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileEdit,
  RefreshCw,
  Loader2,
  GitBranch,
  ScanText,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { dashboard } from "@/lib/api";
import type { UnifiedTask } from "@/lib/api";

/* ── Status mapping ── */

type BadgeVariant = "success" | "info" | "danger" | "default" | "warning" | "done";

const statusConfig: Record<string, { icon: typeof CheckCircle2; badge: BadgeVariant; label: string }> = {
  pending:                { icon: Clock,        badge: "default", label: "Pending" },
  queued:                 { icon: Clock,        badge: "default", label: "Queued" },
  running:                { icon: Play,         badge: "info",    label: "Running" },
  in_progress:            { icon: Play,         badge: "info",    label: "In Progress" },
  awaiting_approval:      { icon: AlertCircle,  badge: "warning", label: "Needs Approval" },
  awaiting_draft_approval:{ icon: FileEdit,     badge: "info",    label: "Draft Ready" },
  awaiting_review:        { icon: AlertCircle,  badge: "warning", label: "Awaiting Review" },
  awaiting_continuation:  { icon: RefreshCw,    badge: "warning", label: "Needs Continue" },
  success:                { icon: CheckCircle2, badge: "success", label: "Success" },
  completed:              { icon: CheckCircle2, badge: "done",    label: "Completed" },
  failed:                 { icon: XCircle,      badge: "danger",  label: "Failed" },
  rejected:               { icon: XCircle,      badge: "danger",  label: "Rejected" },
  cancelled:              { icon: AlertCircle,  badge: "default", label: "Cancelled" },
};

const fallbackStatus = { icon: Clock, badge: "default" as BadgeVariant, label: "Unknown" };

/* ── Filter tabs ── */

const FILTER_TABS = [
  { key: "all",           label: "All" },
  { key: "in-progress",   label: "In Progress" },
  { key: "needs-review",  label: "Needs Review" },
  { key: "completed",     label: "Completed" },
  { key: "failed",        label: "Failed" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

const FILTER_STATUSES: Record<FilterKey, string[] | null> = {
  "all":          null,
  "in-progress":  ["running", "in_progress", "queued", "pending"],
  "needs-review": ["awaiting_approval", "awaiting_draft_approval", "awaiting_review", "awaiting_continuation"],
  "completed":    ["success", "completed"],
  "failed":       ["failed", "rejected", "cancelled"],
};

/* ── Helpers ── */

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function truncateText(value: string | null | undefined, maxLength: number) {
  if (!value) return null;
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxLength) return singleLine;
  return `${singleLine.slice(0, maxLength - 1)}...`;
}

/* ── Page ── */

export default function WorkItemsPage() {
  const [tasks, setTasks] = useState<UnifiedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterKey>("all");

  useEffect(() => {
    dashboard.tasks().then(setTasks).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = FILTER_STATUSES[activeTab]
    ? tasks.filter((t) => FILTER_STATUSES[activeTab]!.includes(t.status))
    : tasks;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
            Work Items
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)]">
            All Trooper tasks and agent runs
          </p>
        </div>
        <Link href="/create">
          <button className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent-emphasis)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity">
            <Play className="h-3.5 w-3.5" />
            New Task
          </button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--color-border-default)]">
        {FILTER_TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? tasks.length
              : tasks.filter((t) => FILTER_STATUSES[tab.key]!.includes(t.status)).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative px-3 py-2 text-xs font-medium transition-colors",
                activeTab === tab.key
                  ? "text-[var(--color-fg-default)]"
                  : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className={cn(
                  "ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                  activeTab === tab.key
                    ? "bg-[var(--color-accent-emphasis)] text-white"
                    : "bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)]"
                )}>
                  {count}
                </span>
              )}
              {activeTab === tab.key && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--color-accent-emphasis)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <Card className="overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ListTodo className="h-4 w-4 text-[var(--color-fg-muted)]" />
              {FILTER_TABS.find((t) => t.key === activeTab)?.label ?? "All"}
            </CardTitle>
            <span className="text-xs text-[var(--color-fg-subtle)]">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--color-border-muted)]">
          {loading && (
            <div className="flex items-center justify-center gap-2 px-4 py-12 text-sm text-[var(--color-fg-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-[var(--color-fg-muted)]">
              No work items match this filter
            </p>
          )}

          {filtered.map((task) => {
            const cfg = statusConfig[task.status] ?? fallbackStatus;
            const StatusIcon = cfg.icon;
            const href =
              task.type === "work-item"
                ? `/work-items/summary/${task.id}`
                : `/work-items/runs/summary/${task.id}`;

            return (
              <Link
                key={`${task.type}-${task.id}`}
                href={href}
                className="group flex items-start gap-4 px-4 py-4 hover:bg-[var(--color-canvas-overlay)] transition-colors"
              >
                {/* Status icon */}
                <StatusIcon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0",
                    task.status === "success" || task.status === "completed"
                      ? "text-[var(--color-accent-fg)]"
                      : task.status === "running" || task.status === "in_progress"
                      ? "text-[var(--color-info-fg)]"
                      : task.status === "failed" || task.status === "rejected"
                      ? "text-[var(--color-danger-fg)]"
                      : task.status.startsWith("awaiting")
                      ? "text-[var(--color-warning-fg)]"
                      : "text-[var(--color-fg-subtle)]"
                  )}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)]">
                      {task.title}
                    </p>
                    {task.workItemNumber ? (
                      <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-canvas-subtle)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-fg-subtle)]">
                        WI #{task.workItemNumber}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                    <span className="inline-flex items-center gap-1">
                      {task.type === "work-item" ? (
                        <ListTodo className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                      {task.source === "azure-devops" ? "Work Item" : "Manual Run"}
                    </span>
                    {task.repository && (
                      <span className="inline-flex items-center gap-1 font-mono">
                        <ScanText className="h-3 w-3" />
                        {task.repository}
                      </span>
                    )}
                    {task.branchName && (
                      <span className="inline-flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {task.branchName}
                      </span>
                    )}
                    {task.linkedPR && (
                      <span className="inline-flex items-center gap-1">
                        <GitPullRequest className="h-3 w-3" />
                        #{task.linkedPR.number}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 space-y-1">
                    {truncateText(task.latestSignal, 120) ? (
                      <p className="text-sm text-[var(--color-fg-default)]">
                        {truncateText(task.latestSignal, 120)}
                      </p>
                    ) : truncateText(task.summary, 120) ? (
                      <p className="text-sm text-[var(--color-fg-default)]">
                        {truncateText(task.summary, 120)}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                      <span>Updated {timeAgo(task.lastActivity)}</span>
                      {task.latestSignalAt ? (
                        <>
                          <span>·</span>
                          <span>Signal {timeAgo(task.latestSignalAt)}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-start gap-3">
                  <Badge variant={cfg.badge} className="shrink-0">
                    {cfg.label}
                  </Badge>
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-fg-subtle)] group-hover:text-[var(--color-accent-fg)]" />
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
