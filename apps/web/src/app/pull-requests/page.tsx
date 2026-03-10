"use client";

import { useState, useEffect } from "react";
import {
  GitPullRequest,
  GitMerge,
  XCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Ban,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PRStatus } from "@trooper/shared";
import { pullRequests as prApi } from "@/lib/api";

const prStatusConfig: Record<
  PRStatus,
  { icon: typeof GitPullRequest; badge: "success" | "info" | "danger" | "default" | "done" | "warning"; label: string; iconColor: string }
> = {
  [PRStatus.Open]: { icon: GitPullRequest, badge: "info", label: "Open", iconColor: "text-[var(--color-info-fg)]" },
  [PRStatus.Approved]: { icon: CheckCircle2, badge: "success", label: "Approved", iconColor: "text-[var(--color-accent-fg)]" },
  [PRStatus.Rejected]: { icon: XCircle, badge: "danger", label: "Changes Requested", iconColor: "text-[var(--color-danger-fg)]" },
  [PRStatus.Merged]: { icon: GitMerge, badge: "done", label: "Merged", iconColor: "text-[var(--color-done-fg)]" },
  [PRStatus.Abandoned]: { icon: Ban, badge: "default", label: "Abandoned", iconColor: "text-[var(--color-fg-subtle)]" },
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

export default function PullRequestsPage() {
  const [prs, setPrs] = useState<any[]>([]);

  useEffect(() => {
    prApi.list().then(setPrs).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
          Pull Requests
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          PRs created by Trooper for human review
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-[var(--color-info-fg)]">
          <GitPullRequest className="h-4 w-4" />
          {prs.filter((p) => p.status === PRStatus.Open).length} Open
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-done-fg)]">
          <GitMerge className="h-4 w-4" />
          {prs.filter((p) => p.status === PRStatus.Merged).length} Merged
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-danger-fg)]">
          <XCircle className="h-4 w-4" />
          {prs.filter((p) => p.status === PRStatus.Rejected).length} Rejected
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pull Requests</CardTitle>
        </CardHeader>
        <div className="divide-y divide-[var(--color-border-muted)]">
          {prs.map((pr) => {
            const config = prStatusConfig[pr.status as PRStatus];
            const StatusIcon = config.icon;
            return (
              <div key={pr.id} className="px-4 py-4 hover:bg-[var(--color-canvas-overlay)] transition-colors">
                <div className="flex items-start gap-3">
                  <StatusIcon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-fg-default)]">
                        {pr.title}
                      </span>
                      <Badge variant={config.badge} className="shrink-0">
                        {config.label}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
                      <span className="font-mono">#{pr.prNumber ?? pr.azurePRId}</span>
                      <span>·</span>
                      <span className="font-mono">{pr.sourceBranch}</span>
                      <span>→</span>
                      <span className="font-mono">{pr.targetBranch}</span>
                      <span>·</span>
                      <span>{timeAgo(pr.createdAt)}</span>
                    </div>

                    {/* Reviewer */}
                    {pr.reviewerAlias && (
                      <div className="mt-2 flex items-center gap-2">
                        <Avatar fallback={pr.reviewerAlias[0]?.toUpperCase()} size="sm" />
                        <span className="text-xs text-[var(--color-fg-muted)]">
                          Reviewer: @{pr.reviewerAlias}
                        </span>
                      </div>
                    )}

                    {/* Rejection comment */}
                    {pr.rejectionComment && (
                      <div className="mt-2 flex gap-2 rounded-md border border-[var(--color-danger-emphasis)] bg-[var(--color-danger-subtle)] px-3 py-2">
                        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-danger-fg)]" />
                        <p className="text-xs text-[var(--color-danger-fg)]">
                          {pr.rejectionComment}
                        </p>
                      </div>
                    )}
                  </div>

                  <a
                    href={pr.url}
                    className="shrink-0 rounded-md p-1.5 text-[var(--color-fg-subtle)] hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)] transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
