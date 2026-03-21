"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Loader2,
  Github,
  Database,
  RefreshCw,
} from "lucide-react";
import { pipeline, indexing } from "@/lib/api";

const ACTIVE_SKILL_EXECUTION_KEY = "trooper.skills.execution.v1";

interface RepoInfo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
  lastSyncAt: string | null;
  indexedFiles: number;
}

interface ActiveSkillExecution {
  id: string;
  name: string;
  prompt: string;
  specFull: string;
  specUi?: string;
}

function readActiveSkillExecutionFromStorage(): ActiveSkillExecution | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ACTIVE_SKILL_EXECUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveSkillExecution & { markdown?: string };
    return {
      ...parsed,
      specFull: parsed.specFull ?? parsed.markdown ?? "",
      specUi: parsed.specUi ?? parsed.markdown,
    };
  } catch {
    window.localStorage.removeItem(ACTIVE_SKILL_EXECUTION_KEY);
    return null;
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

import { Suspense } from "react";

function CreateTaskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);

  const [repoName, setRepoName] = useState("");
  const [userQuery, setUserQuery] = useState(() => {
    if (typeof window === "undefined") return "";

    return readActiveSkillExecutionFromStorage()?.prompt ?? "";
  });
  const [activeSkill, setActiveSkill] = useState<ActiveSkillExecution | null>(() => readActiveSkillExecutionFromStorage());
  const [triggering, setTriggering] = useState(false);
  const [indexingSyncing, setIndexingSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRepo = repos.find((repo) => repo.fullName === repoName);

  useEffect(() => {
    pipeline.repos()
      .then((data) => setRepos(data))
      .catch(console.error)
      .finally(() => setReposLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams.get("source") !== "skill") return;
    if (typeof window === "undefined") return;

    const parsed = readActiveSkillExecutionFromStorage();
    if (!parsed) {
      setActiveSkill(null);
      return;
    }

    setActiveSkill(parsed);
    setUserQuery(parsed.prompt ?? "");
  }, [searchParams]);

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

      const updated = await pipeline.repos();
      setRepos(updated);
    } catch (error: unknown) {
      setError(`Indexing failed: ${getErrorMessage(error, "Indexing failed")}`);
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
        userQuery,
      });
      router.push(`/work-items/runs/${result.runId}`);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to start task"));
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
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-fg-default)]">New Task</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Select a repository and describe what you want Trooper to do. Trooper will analyze the codebase and propose a plan before making any changes.
        </p>
      </div>

      {activeSkill ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border-default)] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,41,55,0.06)]">
          <div>
            <div className="text-sm font-semibold text-[var(--color-fg-default)]">Using saved skill</div>
            <div className="mt-1 text-xs text-[var(--color-fg-subtle)]">
              {activeSkill.name} is loaded into the task prompt. Pick the target repository below to run it.
            </div>
          </div>
          <Badge variant="done">Skill attached</Badge>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Task Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-fg-default)]">
              Repository
            </label>
            <select
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              disabled={reposLoading}
              className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-3 py-2 text-sm text-[var(--color-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)]"
            >
              <option value="">
                {reposLoading ? "Loading repositoriesâ€¦" : "Select a repository"}
              </option>
              {repos.map((repo) => (
                <option key={repo.fullName} value={repo.fullName}>
                  {repo.fullName}{repo.private ? " ðŸ”’" : ""}{repo.indexed ? " âœ“ Indexed" : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedRepo && (
            <div
              className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                selectedRepo.indexed
                  ? "border-[var(--color-success-emphasis)] border-opacity-40 bg-[var(--color-success-subtle)]"
                  : "border-[var(--color-warning-emphasis)] border-opacity-40 bg-[var(--color-warning-subtle)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Database
                  className={`h-4 w-4 ${
                    selectedRepo.indexed
                      ? "text-[var(--color-success-fg)]"
                      : "text-[var(--color-warning-fg)]"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-fg-default)]">
                      RAG Index
                    </span>
                    {selectedRepo.indexed ? (
                      <Badge variant="success">Indexed</Badge>
                    ) : selectedRepo.indexStatus === "syncing" ? (
                      <Badge variant="info">Syncingâ€¦</Badge>
                    ) : (
                      <Badge variant="warning">Not Indexed</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
                    {selectedRepo.indexed
                      ? `${selectedRepo.indexedFiles} files indexed${selectedRepo.lastSyncAt ? ` Â· Last sync ${timeAgo(selectedRepo.lastSyncAt)}` : ""}`
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
                    Indexingâ€¦
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

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-fg-default)]">
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
            <div className="rounded-md bg-[var(--color-danger-subtle)] p-3 text-sm text-[var(--color-danger-fg)]">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
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

export default function CreateTaskPage() {
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <CreateTaskPageContent />
    </Suspense>
  );
}
