"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CircleDot,
  MessageSquare,
  GitBranch,
  ChevronRight,
  Search,
  Loader2,
  ArrowLeft,
  Rocket,
  Tag,
  Clock,
  User,
  CheckCircle2,
  ExternalLink,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { pipeline as pipelineApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────────────────

interface Repo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
}

interface IssueLabel {
  name: string;
  color: string;
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: IssueLabel[];
  user: { login: string; avatarUrl: string } | null;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  url: string;
}

interface IssueComment {
  id: number;
  body: string;
  user: { login: string; avatarUrl: string } | null;
  createdAt: string;
}

interface IssueDetail extends GitHubIssue {
  comments: IssueComment[];
}

type View = "list" | "detail";

// ─── Helpers ────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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

// ─── Main Page ──────────────────────────────────────────────

export default function IssuesPage() {
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [issueDetail, setIssueDetail] = useState<IssueDetail | null>(null);
  const [view, setView] = useState<View>("list");
  const [loading, setLoading] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<"open" | "closed" | "all">("open");

  // Load repos
  useEffect(() => {
    pipelineApi.repos().then((r) => {
      setRepos(r);
      if (r.length > 0 && !selectedRepo) {
        setSelectedRepo(r[0].fullName);
      }
    });
  }, []);

  // Load issues when repo changes
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const loadIssues = useCallback(async () => {
    if (!selectedRepo) return;
    setLoading(true);
    setPermissionError(null);
    try {
      const data = await pipelineApi.listIssues(selectedRepo);
      setIssues(data.items);
    } catch (err: any) {
      if (err?.status === 403) {
        setPermissionError('Your personal access token does not have the issues:read scope for this repository. Re-generate your token with the repo scope to view issues.');
      } else {
        console.error("Failed to load issues:", err);
      }
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRepo]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // Navigate to issue detail page
  const openIssue = useCallback(async (issue: GitHubIssue) => {
    router.push(`/repos/${selectedRepo}/issues/${issue.number}`);
  }, [selectedRepo, router]);

  // Trigger pipeline from issue
  const triggerFromIssue = useCallback(async () => {
    if (!issueDetail || !selectedRepo) return;
    setTriggering(true);
    try {
      const query = `GitHub Issue #${issueDetail.number}: ${issueDetail.title}\n\n${issueDetail.body}`;
      const result = await pipelineApi.trigger({
        repositoryFullName: selectedRepo,
        userQuery: query,
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to trigger pipeline:", err);
      setTriggering(false);
    }
  }, [issueDetail, selectedRepo, router]);

  // Filter issues
  const filtered = issues.filter((issue) => {
    if (stateFilter !== "all" && issue.state !== stateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        String(issue.number).includes(q) ||
        issue.labels.some((l) => l.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-fg-default)] flex items-center gap-2">
            <CircleDot className="h-5 w-5 text-[var(--color-accent-fg)]" />
            Issues
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Browse repository issues and trigger Trooper from any issue
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadIssues}
          disabled={loading}
          className="text-xs"
        >
          <RefreshCcw className={cn("h-3.5 w-3.5 mr-1.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Repo selector + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-[var(--color-fg-subtle)]" />
          <select
            value={selectedRepo}
            onChange={(e) => {
              setSelectedRepo(e.target.value);
              setView("list");
              setIssueDetail(null);
            }}
            className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 text-sm text-[var(--color-fg-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)]"
          >
            {repos.map((r) => (
              <option key={r.fullName} value={r.fullName}>
                {r.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* State filter */}
        <div className="flex rounded-md border border-[var(--color-border-default)] overflow-hidden">
          {(["open", "closed", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStateFilter(s)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                stateFilter === s
                  ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]"
                  : "bg-[var(--color-canvas-subtle)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
              )}
            >
              {s === "open" && <CircleDot className="h-3 w-3 inline mr-1" />}
              {s === "closed" && <CheckCircle2 className="h-3 w-3 inline mr-1" />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-fg-subtle)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter issues..."
            className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] py-1.5 pl-9 pr-3 text-sm text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)]"
          />
        </div>
      </div>

      {/* Permission error banner */}
      {permissionError && (
        <div className="flex items-start gap-3 rounded-md border border-[var(--color-attention-emphasis)] bg-[var(--color-attention-subtle)] px-4 py-3 text-sm text-[var(--color-attention-fg)]">
          <span className="mt-0.5 shrink-0">⚠️</span>
          <div>
            <p className="font-semibold mb-0.5">Insufficient token permissions</p>
            <p className="text-xs opacity-80">{permissionError}</p>
          </div>
        </div>
      )}

      {/* Content area */}
      {view === "list" ? (
        <IssueList
          issues={filtered}
          loading={loading}
          onSelect={openIssue}
          total={issues.length}
        />
      ) : (
        <IssueDetailView
          issue={issueDetail}
          loading={issueLoading}
          triggering={triggering}
          onBack={() => { setView("list"); setIssueDetail(null); }}
          onTrigger={triggerFromIssue}
          repoName={selectedRepo}
        />
      )}
    </div>
  );
}

// ─── Issue List Component ───────────────────────────────────

function IssueList({
  issues,
  loading,
  onSelect,
  total,
}: {
  issues: GitHubIssue[];
  loading: boolean;
  onSelect: (issue: GitHubIssue) => void;
  total: number;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-subtle)]" />
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">Loading issues...</p>
        </CardContent>
      </Card>
    );
  }

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CircleDot className="h-8 w-8 text-[var(--color-fg-subtle)] opacity-40" />
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">No issues found</p>
          <p className="text-xs text-[var(--color-fg-subtle)]">Try a different filter or repository</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-[var(--color-accent-fg)]" />
            {issues.length} issue{issues.length !== 1 ? "s" : ""}
          </CardTitle>
          <span className="text-[10px] text-[var(--color-fg-subtle)]">{total} total</span>
        </div>
      </CardHeader>
      <div className="divide-y divide-[var(--color-border-muted)]">
        {issues.map((issue) => (
          <button
            key={issue.number}
            onClick={() => onSelect(issue)}
            className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[var(--color-canvas-overlay)] transition-colors group"
          >
            <CircleDot
              className={cn(
                "h-4 w-4 mt-0.5 shrink-0",
                issue.state === "open"
                  ? "text-[var(--color-accent-fg)]"
                  : "text-[var(--color-done-fg)]"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)] transition-colors truncate">
                  {issue.title}
                </span>
                {issue.labels.map((label) => (
                  <span
                    key={label.name}
                    className="inline-flex items-center rounded-full border px-2 py-0 text-[10px] font-medium shrink-0"
                    style={labelStyle(label.color)}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-fg-subtle)]">
                <span className="font-mono">#{issue.number}</span>
                <span>opened {timeAgo(issue.createdAt)}</span>
                {issue.user && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {issue.user.login}
                  </span>
                )}
                {issue.commentsCount > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {issue.commentsCount}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-[var(--color-fg-subtle)] opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
          </button>
        ))}
      </div>
    </Card>
  );
}

// ─── Issue Detail Component ─────────────────────────────────

function IssueDetailView({
  issue,
  loading,
  triggering,
  onBack,
  onTrigger,
  repoName,
}: {
  issue: IssueDetail | null;
  loading: boolean;
  triggering: boolean;
  onBack: () => void;
  onTrigger: () => void;
  repoName: string;
}) {
  if (loading || !issue) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-subtle)]" />
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">Loading issue...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back button + issue header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 mt-0.5 shrink-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)]">
              {issue.title}
            </h2>
            <span className="text-lg text-[var(--color-fg-subtle)] font-light">#{issue.number}</span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-[var(--color-fg-subtle)] flex-wrap">
            <Badge variant={issue.state === "open" ? "success" : "done"}>
              <CircleDot className="h-3 w-3 mr-1" />
              {issue.state}
            </Badge>
            {issue.user && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {issue.user.login} opened {timeAgo(issue.createdAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {issue.commentsCount} comment{issue.commentsCount !== 1 ? "s" : ""}
            </span>
            {issue.labels.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {issue.labels.map((label) => (
                  <span
                    key={label.name}
                    className="inline-flex items-center rounded-full border px-2 py-0 text-[10px] font-medium"
                    style={labelStyle(label.color)}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <Card className="border-[var(--color-accent-emphasis)] border-opacity-40 bg-[var(--color-accent-subtle)]">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[var(--color-fg-default)]">
              <Rocket className="h-4 w-4 text-[var(--color-accent-fg)]" />
              <span>Run Trooper agent on this issue</span>
              <span className="text-xs text-[var(--color-fg-subtle)]">
                Target: <span className="font-mono">{repoName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[var(--color-accent-fg)] hover:underline"
              >
                View on GitHub <ExternalLink className="h-3 w-3" />
              </a>
              <Button
                onClick={onTrigger}
                disabled={triggering}
                size="sm"
                className="bg-[var(--color-accent-fg)] hover:bg-[var(--color-accent-emphasis)] text-white"
              >
                {triggering ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Rocket className="h-3.5 w-3.5 mr-1.5" />
                )}
                Run Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issue body */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4 text-[var(--color-fg-subtle)]" />
            {issue.user?.login ?? "unknown"}
            <span className="text-xs font-normal text-[var(--color-fg-subtle)]">
              commented {timeAgo(issue.createdAt)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm prose-invert max-w-none text-[var(--color-fg-default)]">
            {issue.body ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {issue.body}
              </pre>
            ) : (
              <p className="text-[var(--color-fg-subtle)] italic">No description provided.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      {issue.comments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--color-fg-default)] flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[var(--color-fg-subtle)]" />
            Comments ({issue.comments.length})
          </h3>
          {issue.comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[var(--color-fg-subtle)]" />
                  {comment.user?.login ?? "unknown"}
                  <span className="text-xs font-normal text-[var(--color-fg-subtle)]">
                    commented {timeAgo(comment.createdAt)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {comment.body}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
