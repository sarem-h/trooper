"use client";

import { useState, useEffect } from "react";
import {
  Bot,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  ArrowRight,
  FileEdit,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AgentRunStatus } from "@trooper/shared";
import { agentRuns as agentRunsApi } from "@/lib/api";

const statusConfig: Record<
  AgentRunStatus,
  { icon: typeof CheckCircle2; badge: "success" | "info" | "danger" | "default" | "warning"; label: string }
> = {
  [AgentRunStatus.Success]: { icon: CheckCircle2, badge: "success", label: "Success" },
  [AgentRunStatus.Running]: { icon: Play, badge: "info", label: "Running" },
  [AgentRunStatus.Failed]: { icon: XCircle, badge: "danger", label: "Failed" },
  [AgentRunStatus.Queued]: { icon: Clock, badge: "default", label: "Queued" },
  [AgentRunStatus.Cancelled]: { icon: AlertCircle, badge: "warning", label: "Cancelled" },
  [AgentRunStatus.AwaitingApproval]: { icon: Clock, badge: "warning", label: "Awaiting Approval" },
  [AgentRunStatus.AwaitingDraftApproval]: { icon: FileEdit, badge: "info", label: "Draft Ready" },
  [AgentRunStatus.AwaitingContinuation]: { icon: Clock, badge: "info", label: "Awaiting Continuation" },
};

function getWorkItemTitle(run: any) {
  return run.workItem?.title ?? "Unknown work item";
}

function formatDuration(start: string, end?: string) {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  const sec = Math.floor((e - s) / 1000);
  const m = Math.floor(sec / 60);
  const remaining = sec % 60;
  return `${m}m ${remaining.toString().padStart(2, "0")}s`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function AgentRunsPage() {
  const [runs, setRuns] = useState<any[]>([]);

  useEffect(() => {
    agentRunsApi.list().then(setRuns).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
            Agent Runs
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)]">
            All autonomous code generation runs
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[var(--color-accent-fg)]" />
              Run History
            </CardTitle>
            <span className="text-xs text-[var(--color-fg-subtle)]">
              {runs.length} total runs
            </span>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--color-border-muted)]">
          {runs.map((run) => {
            const config = statusConfig[run.status as AgentRunStatus];
            const StatusIcon = config.icon;
            return (
              <div
                key={run.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--color-canvas-overlay)] transition-colors"
              >
                <StatusIcon
                  className={`h-4 w-4 shrink-0 ${
                    run.status === AgentRunStatus.Success
                      ? "text-[var(--color-accent-fg)]"
                      : run.status === AgentRunStatus.Running
                      ? "text-[var(--color-info-fg)]"
                      : run.status === AgentRunStatus.Failed
                      ? "text-[var(--color-danger-fg)]"
                      : "text-[var(--color-fg-subtle)]"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-fg-default)]">
                    {getWorkItemTitle(run)}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
                    <span className="font-mono">{run.branchName}</span>
                    <span>·</span>
                    <span>{run.id}</span>
                  </div>
                </div>
                <Badge variant={config.badge} className="shrink-0">
                  {config.label}
                </Badge>
                <span className="w-16 text-right text-xs text-[var(--color-fg-subtle)] tabular-nums">
                  {formatDuration(run.startedAt, run.completedAt)}
                </span>
                <span className="w-16 text-right text-xs text-[var(--color-fg-subtle)]">
                  {timeAgo(run.startedAt)}
                </span>
                <Link href={`/agent/${run.id}`}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
