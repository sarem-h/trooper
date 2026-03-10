"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  GitPullRequest,
  ListTodo,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboard } from "@/lib/api";

/* ── Helper ── */

const statusConfig: Record<string, { icon: typeof CheckCircle2; badge: "success" | "info" | "danger" | "default"; label: string }> = {
  success: { icon: CheckCircle2, badge: "success", label: "Success" },
  running: { icon: Clock, badge: "info", label: "Running" },
  failed: { icon: XCircle, badge: "danger", label: "Failed" },
  queued: { icon: AlertCircle, badge: "default", label: "Queued" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDuration(start: string, end?: string) {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const sec = Math.floor((e - s) / 1000);
  const m = Math.floor(sec / 60);
  const remaining = sec % 60;
  return `${m}m ${remaining.toString().padStart(2, "0")}s`;
}

/* ── Page ── */

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    dashboard.getOverview().then(setData).catch(console.error);
  }, []);

  const kpis = data
    ? [
        { label: "Pending Work Items", value: data.kpis.pendingWorkItems, icon: ListTodo, color: "text-[var(--color-warning-fg)]" },
        { label: "Active Agent Runs", value: data.kpis.activeRuns, icon: Bot, color: "text-[var(--color-accent-fg)]" },
        { label: "Open PRs", value: data.kpis.openPRs, icon: GitPullRequest, color: "text-[var(--color-info-fg)]" },
        { label: "Secrets Masked", value: data.kpis.secretsMasked, icon: ShieldCheck, color: "text-[var(--color-done-fg)]" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          System overview and recent activity
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  {kpi.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-fg-default)]">
                  {kpi.value}
                </p>
              </div>
              <kpi.icon className={`h-8 w-8 ${kpi.color} opacity-80`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Agent Runs</CardTitle>
            <a
              href="/agent"
              className="flex items-center gap-1 text-xs text-[var(--color-accent-fg)] hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--color-border-muted)]">
          {(data?.recentRuns ?? []).map((run: any) => {
            const config = statusConfig[run.status as keyof typeof statusConfig] ?? statusConfig.queued;
            const StatusIcon = config.icon;
            return (
              <div
                key={run.id}
                className="flex items-center gap-4 px-4 py-3"
              >
                <StatusIcon
                  className={`h-4 w-4 shrink-0 ${
                    run.status === "success"
                      ? "text-[var(--color-accent-fg)]"
                      : run.status === "running"
                      ? "text-[var(--color-info-fg)]"
                      : "text-[var(--color-danger-fg)]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-fg-default)]">
                    {run.workItem?.title ?? "Unknown work item"}
                  </p>
                  <p className="text-xs text-[var(--color-fg-subtle)] font-mono">
                    {run.branchName}
                  </p>
                </div>
                <Badge variant={config.badge} className="shrink-0">
                  {config.label}
                </Badge>
                <span className="w-16 text-right text-xs text-[var(--color-fg-subtle)]">
                  {formatDuration(run.startedAt, run.completedAt)}
                </span>
                <span className="w-20 text-right text-xs text-[var(--color-fg-subtle)]">
                  {timeAgo(run.startedAt)}
                </span>
              </div>
            );
          })}
          {(!data || data.recentRuns.length === 0) && (
            <p className="px-4 py-8 text-sm text-center text-[var(--color-fg-muted)]">No recent runs</p>
          )}
        </div>
      </Card>
    </div>
  );
}
