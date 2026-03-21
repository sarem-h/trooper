"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BrainCircuit,
  ChevronDown,
  FileCode2,
  FolderGit2,
  GitBranch,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown";
import { markdownRenderTools } from "@/components/ui/render-tools";
import { copilot, indexing, pipeline, type SkillRunResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

const ACTIVE_SKILL_EXECUTION_KEY = "trooper.skills.execution.v1";

interface RepoInfo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
  lastSyncAt: string | null;
  indexedFiles: number;
  description?: string;
  language?: string;
  provider: string;
}

interface ActiveSkillExecution {
  id: string;
  name: string;
  prompt: string;
  specFull: string;
  specUi?: string;
  preferredModelId?: string;
  preferredModelLabel?: string;
}

interface IndexStatusResponse {
  repository: string;
  branch: string;
  status: string | null;
  totalFiles: number;
  indexedFiles: number;
  lastSyncAt: string | null;
  activeJob?: {
    id: string;
    status: string;
    totalFiles: number;
    processedFiles: number;
    currentFile?: string;
    error?: string;
  } | null;
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

function timeAgo(iso: string | null) {
  if (!iso) return "never";

  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RunSkillPage() {
  const router = useRouter();
  const [activeSkill, setActiveSkill] = useState<ActiveSkillExecution | null>(null);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [repoQuery, setRepoQuery] = useState("");
  const [selectedRepoName, setSelectedRepoName] = useState<string | null>(null);
  const [indexStatus, setIndexStatus] = useState<IndexStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [indexingSyncing, setIndexingSyncing] = useState(false);
  const [runningSkill, setRunningSkill] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<SkillRunResponse | null>(null);

  const selectedRepo = useMemo(
    () => repos.find((repo) => repo.fullName === selectedRepoName) ?? null,
    [repos, selectedRepoName]
  );

  const filteredRepos = useMemo(() => {
    const normalized = repoQuery.trim().toLowerCase();
    if (!normalized) return repos;

    return repos.filter((repo) => {
      return [repo.fullName, repo.description ?? "", repo.language ?? "", repo.provider]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [repoQuery, repos]);

  const loadRepos = useCallback(async () => {
    setReposLoading(true);

    try {
      const data = await pipeline.repos();
      setRepos(data);
      setSelectedRepoName((current) => current ?? data[0]?.fullName ?? null);
    } catch (error) {
      console.error("Failed to load repositories for skill execution:", error);
    } finally {
      setReposLoading(false);
    }
  }, []);

  const loadIndexStatus = useCallback(async (repo: RepoInfo | null) => {
    if (!repo) {
      setIndexStatus(null);
      return;
    }

    setStatusLoading(true);

    try {
      const status = await indexing.status(repo.fullName, repo.defaultBranch) as IndexStatusResponse | null;
      setIndexStatus(status);
    } catch (error) {
      console.error("Failed to load indexing status for skill execution:", error);
      setIndexStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    setActiveSkill(readActiveSkillExecutionFromStorage());
  }, []);

  useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  useEffect(() => {
    loadIndexStatus(selectedRepo);
  }, [loadIndexStatus, selectedRepo]);

  async function handleIndexRepo() {
    if (!selectedRepo || indexingSyncing) return;

    setIndexingSyncing(true);
    setRunError(null);

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

      await Promise.all([loadRepos(), loadIndexStatus(selectedRepo)]);
    } catch (error) {
      console.error("Failed to sync repository before running skill:", error);
      setRunError(error instanceof Error ? error.message : "Indexing failed");
    } finally {
      setIndexingSyncing(false);
    }
  }

  async function handleRunSkill() {
    if (!activeSkill || !selectedRepo || runningSkill) return;

    setRunningSkill(true);
    setRunError(null);

    try {
      const result = await copilot.runSkill({
        repositoryFullName: selectedRepo.fullName,
        branch: selectedRepo.defaultBranch,
        skillName: activeSkill.name,
        prompt: activeSkill.prompt,
        skillSpecFull: activeSkill.specFull,
        modelId: activeSkill.preferredModelId,
      });

      setRunResult(result);
    } catch (error) {
      console.error("Failed to run saved skill:", error);
      setRunError(error instanceof Error ? error.message : "Skill execution failed");
    } finally {
      setRunningSkill(false);
    }
  }

  const repoReady = Boolean(indexStatus && (indexStatus.status === "idle" || selectedRepo?.indexed));

  return (
    <div data-flush-layout className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[var(--color-border-default)] px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => router.push("/skills")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-fg-default)]">
            <BrainCircuit className="h-4 w-4 text-[var(--color-accent-fg)]" />
            Run Skill
          </div>
        </div>
        {activeSkill ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--color-fg-subtle)]">Active skill:</span>
            <span className="font-semibold text-[var(--color-fg-default)]">{activeSkill.name}</span>
          </div>
        ) : null}
      </header>

      {!activeSkill ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <BrainCircuit className="h-10 w-10 text-[var(--color-fg-subtle)]" />
          <div>
            <div className="text-base font-semibold text-[var(--color-fg-default)]">No skill selected</div>
            <div className="mt-1 text-sm text-[var(--color-fg-subtle)]">
              Pick a saved skill from the library first, then return here to bind it to a repository.
            </div>
          </div>
          <Button className="gap-2" onClick={() => router.push("/skills")}>Return to skills</Button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          {/* Left Sidebar: Repositories */}
          <div className="flex w-[320px] flex-col border-r border-[var(--color-border-default)] bg-[#f9fafb]">
            <div className="p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
                <input
                  value={repoQuery}
                  onChange={(event) => setRepoQuery(event.target.value)}
                  placeholder="Search repositories"
                  className="h-9 w-full rounded-md border border-[var(--color-border-default)] bg-white pl-9 pr-3 text-sm text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)] focus:border-[var(--color-accent-emphasis)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-emphasis)]"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
              {reposLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="trooper-shimmer h-16 w-full rounded-md" />
                ))
              ) : filteredRepos.length === 0 ? (
                <div className="px-3 py-5 text-center text-sm text-[var(--color-fg-muted)]">No repositories match this search.</div>
              ) : (
                filteredRepos.map((repo) => {
                  const isSelected = repo.fullName === selectedRepoName;
                  const isIndexed = repo.indexed || indexStatus?.repository === repo.fullName && indexStatus.status === "idle";

                  return (
                    <button
                      key={repo.fullName}
                      type="button"
                      onClick={() => setSelectedRepoName(repo.fullName)}
                      className={cn(
                        "w-full rounded-md px-3 py-2.5 text-left transition-colors",
                        isSelected
                          ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                          : "text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)]"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate text-sm font-medium">{repo.fullName}</div>
                        <div className={cn("h-2 w-2 rounded-full flex-shrink-0", isIndexed ? "bg-green-500" : "bg-yellow-500")} title={isIndexed ? "Indexed" : "Needs index"} />
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--color-fg-subtle)]">
                        <FolderGit2 className="h-3 w-3" />
                        <span>{repo.provider}</span>
                        <span>•</span>
                        <GitBranch className="h-3 w-3" />
                        <span>{repo.defaultBranch}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Area: Execution & Result */}
          <div className="flex min-h-0 flex-1 flex-col bg-white">
            <div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-[var(--color-border-subtle)] px-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[var(--color-fg-default)]">
                  {selectedRepo?.fullName ?? "No repository selected"}
                </span>
                {selectedRepo && (
                  <div className="flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> {selectedRepo.defaultBranch}
                    </span>
                    <span>•</span>
                    <span>{statusLoading ? "Checking index..." : repoReady ? "Index ready" : "Index required"}</span>
                    <span>•</span>
                    <span>{indexStatus?.indexedFiles ?? selectedRepo?.indexedFiles ?? 0} files</span>
                    <span>•</span>
                    <span>Sync: {timeAgo(indexStatus?.lastSyncAt ?? selectedRepo?.lastSyncAt ?? null)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={handleIndexRepo}
                  disabled={!selectedRepo || indexingSyncing}
                >
                  {indexingSyncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  {repoReady ? "Re-sync" : "Index repo"}
                </Button>
                <Button
                  size="sm"
                  className="h-8 gap-2"
                  onClick={handleRunSkill}
                  disabled={!selectedRepo || !repoReady || runningSkill || statusLoading}
                >
                  {runningSkill ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 text-white" />}
                  Execute skill
                </Button>
              </div>
            </div>

            {runError ? (
              <div className="m-6 rounded-md border border-[var(--color-danger-emphasis)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger-fg)]">
                {runError}
              </div>
            ) : null}

            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              {runningSkill ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent-emphasis)]" />
                    <div className="text-sm font-medium text-[var(--color-fg-default)]">Running skill against indexed code...</div>
                  </div>
                </div>
              ) : null}

              {runResult ? (
                <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
                  <div className="mx-auto grid w-full max-w-[1320px] gap-5 px-5 py-6 lg:px-6 xl:grid-cols-[minmax(0,1fr)_312px] xl:items-start">
                    <div className="space-y-4">
                      <section className="overflow-hidden rounded-[22px] border border-[rgba(22,30,23,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f8faf8_100%)] shadow-[0_12px_30px_rgba(18,34,24,0.05)]">
                        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="done">Skill Result</Badge>
                              <Badge variant="default">{runResult.modelLabel}</Badge>
                            </div>
                            <h1 className="mt-3 text-[1.65rem] font-semibold tracking-[-0.03em] text-[var(--color-fg-default)] lg:text-[1.8rem]">
                              {runResult.headline}
                            </h1>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[11px]">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 text-[var(--color-fg-subtle)]">
                              <GitBranch className="h-3.5 w-3.5" />
                              {runResult.branch}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 text-[var(--color-fg-subtle)]">
                              <FileCode2 className="h-3.5 w-3.5" />
                              {runResult.retrievedChunkCount} chunks
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="rounded-[22px] border border-[rgba(22,30,23,0.08)] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(18,34,24,0.04)]">
                      <MarkdownRenderer
                        content={runResult.resultMarkdown}
                        tools={markdownRenderTools}
                        className={cn(
                          "mx-auto max-w-[920px]",
                          "[&_h1]:mt-0 [&_h1]:mb-3 [&_h1]:border-b-0 [&_h1]:pb-0 [&_h1]:text-[1.55rem] [&_h1]:tracking-[-0.03em]",
                          "[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:border-b-0 [&_h2]:pb-0 [&_h2]:text-[1.1rem] [&_h2]:tracking-[-0.02em]",
                          "[&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-[0.96rem]",
                          "[&_p]:mb-2 [&_p]:text-[14px] [&_p]:leading-6 [&_ul]:mb-3 [&_ul]:space-y-1 [&_ol]:mb-3 [&_ol]:space-y-1 [&_li]:leading-6 [&_blockquote]:rounded-r-xl [&_blockquote]:bg-[var(--color-canvas-subtle)] [&_blockquote]:py-2 [&_blockquote]:pr-3 [&_pre]:my-3 [&_hr]:my-3"
                        )}
                      />
                      </section>
                    </div>

                    <aside className="xl:sticky xl:top-5">
                      <section className="overflow-hidden rounded-[22px] border border-[rgba(22,30,23,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#f9fbfa_100%)] shadow-[0_12px_30px_rgba(18,34,24,0.04)]">
                        <div className="border-b border-[rgba(22,30,23,0.08)] px-4 py-4">
                          <div className="text-sm font-semibold text-[var(--color-fg-default)]">Context</div>
                          <div className="mt-1 text-xs text-[var(--color-fg-subtle)]">Run metadata and supporting evidence</div>
                        </div>

                        <div className="space-y-3 px-4 py-4 text-sm">
                          <div className="rounded-xl border border-[var(--color-border-default)] bg-white px-3 py-3">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">Repository</div>
                            <div className="mt-2 break-all font-medium text-[var(--color-fg-default)]">{runResult.repositoryFullName}</div>
                          </div>

                          <details className="group rounded-xl border border-[var(--color-border-default)] bg-white px-3 py-3">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                              <div>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">Insights</div>
                                <div className="mt-1 text-sm text-[var(--color-fg-default)]">{runResult.evidence.length} returned</div>
                              </div>
                              <ChevronDown className="h-4 w-4 text-[var(--color-fg-subtle)] transition-transform group-open:rotate-180" />
                            </summary>
                            {runResult.evidence.length > 0 ? (
                              <div className="mt-3 space-y-2 border-t border-[var(--color-border-muted)] pt-3 text-[13px] leading-5 text-[var(--color-fg-default)]">
                                {runResult.evidence.map((item, index) => (
                                  <div key={`${item}-${index}`} className="rounded-lg bg-[var(--color-canvas-subtle)] px-2.5 py-2">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </details>

                          <details className="group rounded-xl border border-[var(--color-border-default)] bg-white px-3 py-3">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                              <div>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">Files</div>
                                <div className="mt-1 text-sm text-[var(--color-fg-default)]">{runResult.retrievedFiles.length} sources</div>
                              </div>
                              <ChevronDown className="h-4 w-4 text-[var(--color-fg-subtle)] transition-transform group-open:rotate-180" />
                            </summary>
                            {runResult.retrievedFiles.length > 0 ? (
                              <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--color-border-muted)] pt-3 text-[11px] text-[var(--color-fg-subtle)]">
                                {runResult.retrievedFiles.map((file) => (
                                  <span key={file} className="inline-flex items-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-1">
                                    {file}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </details>
                        </div>
                      </section>
                    </aside>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center text-[var(--color-fg-muted)]">
                  <Sparkles className="h-8 w-8 mb-4 opacity-50" />
                  <p className="text-sm">Select a repository and execute the skill to generate findings here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}