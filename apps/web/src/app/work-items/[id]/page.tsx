"use client";

import {
  Bug,
  Shield,
  Lightbulb,
  ArrowLeft,
  GitPullRequest,
  Bot,
  ExternalLink,
  Play,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { WorkItemStatus } from "@trooper/shared";
import { workItems as workItemsApi, pipeline } from "@/lib/api";

const typeIcon: Record<string, typeof Bug> = {
  bug: Bug,
  vulnerability: Shield,
  feature: Lightbulb,
};

const typeLabel: Record<string, string> = {
  bug: "Bug",
  vulnerability: "Security Vulnerability",
  feature: "Feature Request",
};

const statusBadge: Record<WorkItemStatus, { variant: "success" | "info" | "danger" | "default" | "warning" | "done"; label: string }> = {
  [WorkItemStatus.Pending]: { variant: "default", label: "Pending" },
  [WorkItemStatus.InProgress]: { variant: "info", label: "In Progress" },
  [WorkItemStatus.AwaitingReview]: { variant: "warning", label: "Awaiting Review" },
  [WorkItemStatus.Rejected]: { variant: "danger", label: "Rejected" },
  [WorkItemStatus.Completed]: { variant: "done", label: "Completed" },
};

export default function WorkItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pipeline trigger state
  const [userQuery, setUserQuery] = useState("");
  const [repoName, setRepoName] = useState("");
  const [triggering, setTriggering] = useState(false);
  const [triggerError, setTriggerError] = useState<string | null>(null);
  const [repos, setRepos] = useState<Array<{ fullName: string; private: boolean; defaultBranch: string }>>([]);
  const [reposLoading, setReposLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    pipeline.repos()
      .then((data) => setRepos(data))
      .catch(console.error)
      .finally(() => setReposLoading(false));
  }, []);

  useEffect(() => {
    if (!id) return;
    workItemsApi.get(id).then((data) => {
      setItem(data);
      // Pre-fill query/repo from work item if available
      if (data.userQuery) setUserQuery(data.userQuery);
      if (data.repositoryFullName) setRepoName(data.repositoryFullName);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const linkedRun = item?.agentRuns?.[0];
  const linkedPR = item?.pullRequests?.[0];

  async function handleTrigger() {
    if (!id || triggering) return;
    setTriggering(true);
    setTriggerError(null);
    try {
      const result = await pipeline.trigger({
        workItemId: id,
        userQuery: userQuery || undefined,
        repositoryFullName: repoName || undefined,
      });
      // Navigate to the agent run detail page
      router.push(`/agent/${result.runId}`);
    } catch (err: any) {
      setTriggerError(err.message);
      setTriggering(false);
    }
  }

  if (!id || loading) return null;

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--color-fg-muted)]">
        <p>Work item not found: {id}</p>
        <Link href="/work-items" className="mt-2 text-sm text-[var(--color-accent-fg)] hover:underline">
          Back to work items
        </Link>
      </div>
    );
  }

  const Icon = typeIcon[item.type] ?? Lightbulb;
  const status = statusBadge[item.status as WorkItemStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/work-items">
          <Button variant="ghost" size="icon" className="mt-0.5 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-[var(--color-fg-muted)]" />
            <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
              {item.title}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
            <span>Azure #{item.azureId}</span>
            <span>·</span>
            <span>{typeLabel[item.type]}</span>
            <span>·</span>
            <span>Created {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {item.description}
            </p>
          </CardContent>
        </Card>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* ── Pipeline Trigger ── */}
          <Card className="border-[var(--color-accent-emphasis)] border-opacity-40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <Play className="h-3.5 w-3.5 text-[var(--color-accent-fg)]" />
                Run Trooper Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] mb-1">
                  Repository
                </label>
                <select
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  disabled={reposLoading}
                  className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-2.5 py-1.5 text-xs text-[var(--color-fg-default)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-fg)]"
                >
                  <option value="">
                    {reposLoading ? "Loading repositories…" : "Select a repository"}
                  </option>
                  {repos.map((r) => (
                    <option key={r.fullName} value={r.fullName}>
                      {r.fullName}{r.private ? " 🔒" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)] mb-1">
                  User Query
                </label>
                <textarea
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="What should Trooper do? (e.g. 'Add error handling to the login endpoint')"
                  rows={3}
                  className="w-full resize-none rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-2.5 py-1.5 text-xs text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-fg)]"
                />
              </div>
              {triggerError && (
                <p className="text-xs text-[var(--color-danger-fg)]">{triggerError}</p>
              )}
              <Button
                onClick={handleTrigger}
                disabled={triggering}
                className="w-full gap-2"
              >
                {triggering ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Run Pipeline
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Linked Agent Run */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <Bot className="h-3.5 w-3.5 text-[var(--color-accent-fg)]" />
                Linked Agent Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              {linkedRun ? (
                <Link
                  href={`/agent/${linkedRun.id}`}
                  className="flex items-center justify-between text-sm text-[var(--color-accent-fg)] hover:underline"
                >
                  <span className="font-mono">{linkedRun.id}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              ) : (
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  No agent run linked yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Linked PR */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs">
                <GitPullRequest className="h-3.5 w-3.5 text-[var(--color-info-fg)]" />
                Linked Pull Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              {linkedPR ? (
                <Link
                  href="/pull-requests"
                  className="flex items-center justify-between text-sm text-[var(--color-accent-fg)] hover:underline"
                >
                  <span>PR #{linkedPR.prNumber ?? linkedPR.azurePRId} — {linkedPR.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </Link>
              ) : (
                <p className="text-xs text-[var(--color-fg-subtle)]">
                  No PR created yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-fg-subtle)]">ID</span>
                <span className="font-mono text-[var(--color-fg-muted)]">{item.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-fg-subtle)]">Type</span>
                <span className="capitalize text-[var(--color-fg-muted)]">{item.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-fg-subtle)]">Updated</span>
                <span className="text-[var(--color-fg-muted)]">
                  {new Date(item.updatedAt).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
