"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Loader2,
  Github,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  Search,
} from "lucide-react";
import { pipeline, indexing } from "@/lib/api";

interface RepoInfo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
  lastSyncAt: string | null;
  indexedFiles: number;
}

export default function NewTaskPage() {
  const router = useRouter();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);

  const [repoName, setRepoName] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [triggering, setTriggering] = useState(false);
  const [indexingSyncing, setIndexingSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRepo = repos.find((r) => r.fullName === repoName);

  useEffect(() => {
    pipeline.repos()
      .then((data) => setRepos(data))
      .catch(console.error)
      .finally(() => setReposLoading(false));
  }, []);

  async function handleIndex() {
    if (!selectedRepo || indexingSyncing) return;
    setIndexingSyncing(true);
    setError(null);
    try {
      const job = await indexing.sync({
        repository: selectedRepo.fullName,
        branch: selectedRepo.defaultBranch,
      });

      while (true) {
        const next = await indexing.job(job.id);
        if (next.status === "completed") {
          break;
        }
        if (next.status === "failed") {
          throw new Error(next.error ?? "Indexing failed");
        }
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Refresh repo list to get updated index status
      const updated = await pipeline.repos();
      setRepos(updated);
    } catch (err: any) {
      setError(`Indexing failed: ${err.message}`);
    } finally {
      setIndexingSyncing(false);
    }
  }

  async function handleTrigger() {
    if (!repoName || !userQuery || triggering) return;
    setTriggering(true);
    setError(null);
    try {
      const result = await pipeline.trigger({
        repositoryFullName: repoName,
        userQuery: userQuery,
      });
      router.push(`/agent/${result.runId}`);
    } catch (err: any) {
      setError(err.message);
      setTriggering(false);
    }
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-fg-default)]">New Task</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mt-1">
          Select a repository and describe what you want Trooper to do. Trooper will analyze the codebase and propose a plan before making any changes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Task Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Repository selector */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-fg-default)] mb-2">
              Repository
            </label>
            <select
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              disabled={reposLoading}
              className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)]"
            >
              <option value="">
                {reposLoading ? "Loading repositories…" : "Select a repository"}
              </option>
              {repos.map((r) => (
                <option key={r.fullName} value={r.fullName}>
                  {r.fullName}{r.private ? " 🔒" : ""}{r.indexed ? " ✓ Indexed" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Index status card — shown when a repo is selected */}
          {selectedRepo && (
            <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
              selectedRepo.indexed
                ? "border-[var(--color-success-emphasis)] border-opacity-40 bg-[var(--color-success-subtle)]"
                : "border-[var(--color-warning-emphasis)] border-opacity-40 bg-[var(--color-warning-subtle)]"
            }`}>
              <div className="flex items-center gap-3">
                <Database className={`h-4 w-4 ${
                  selectedRepo.indexed ? "text-[var(--color-success-fg)]" : "text-[var(--color-warning-fg)]"
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-fg-default)]">
                      RAG Index
                    </span>
                    {selectedRepo.indexed ? (
                      <Badge variant="success">Indexed</Badge>
                    ) : selectedRepo.indexStatus === "syncing" ? (
                      <Badge variant="info">Syncing…</Badge>
                    ) : (
                      <Badge variant="warning">Not Indexed</Badge>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-fg-subtle)] mt-0.5">
                    {selectedRepo.indexed
                      ? `${selectedRepo.indexedFiles} files indexed${selectedRepo.lastSyncAt ? ` · Last sync ${timeAgo(selectedRepo.lastSyncAt)}` : ""}`
                      : "Index this repo for faster, more accurate plans. Trooper will auto-index if needed, but pre-indexing is recommended."}
                  </p>
                </div>
              </div>
              <Button
                variant={selectedRepo.indexed ? "outline" : "default"}
                size="sm"
                onClick={handleIndex}
                disabled={indexingSyncing}
                className="gap-1.5 shrink-0"
              >
                {indexingSyncing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Indexing…
                  </>
                ) : selectedRepo.indexed ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Re-sync
                  </>
                ) : (
                  <>
                    <Database className="h-3.5 w-3.5" />
                    Index Now
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Query input */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-fg-default)] mb-2">
              What should Trooper do?
            </label>
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g. 'Add error handling to the login endpoint' or 'Create a new README with setup instructions'"
              rows={5}
              className="w-full resize-none rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-[var(--color-danger-subtle)] text-[var(--color-danger-fg)] text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* Info text */}
            <p className="text-xs text-[var(--color-fg-subtle)]">
              {selectedRepo && !selectedRepo.indexed
                ? "Trooper will automatically index this repo before planning."
                : "Trooper will analyze the codebase and propose a plan for your approval."}
            </p>
            <Button
              onClick={handleTrigger}
              disabled={triggering || !repoName || !userQuery}
              className="gap-2"
            >
              {triggering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}