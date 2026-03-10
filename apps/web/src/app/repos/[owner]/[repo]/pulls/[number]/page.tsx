"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Rocket,
  ExternalLink,
  MessageSquare,
  GitPullRequest,
  GitMerge,
  XCircle,
  Send,
  FileCode,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/ui/markdown";
import { DiffViewer } from "@/components/ui/diff-viewer";
import { pipeline as pipelineApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────

interface ScmUser {
  login: string;
  avatarUrl: string;
}

interface ScmComment {
  id: number;
  body: string;
  user: ScmUser | null;
  createdAt: string;
}

interface ScmReview {
  id: number;
  user: ScmUser | null;
  state: string;
  body: string;
  submittedAt: string;
}

interface DiffFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface PRDetail {
  number: number;
  title: string;
  body: string;
  state: string;
  sourceBranch: string;
  targetBranch: string;
  user: ScmUser | null;
  url: string;
  createdAt: string;
  updatedAt: string;
  merged?: boolean;
  mergeable?: boolean | null;
  isDraft?: boolean;
  additions?: number;
  deletions?: number;
  commitsCount?: number;
  reviewDecision?: string;
  changedFiles?: string[];
  diffFiles?: DiffFile[];
  reviews?: ScmReview[];
  comments?: ScmComment[];
}

type Tab = "conversation" | "files";

// ─── Helpers ────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function prStateVariant(pr: PRDetail): "success" | "danger" | "done" | "info" {
  if (pr.merged) return "done";
  if (pr.state === "closed") return "danger";
  if (pr.isDraft) return "default" as any;
  return "success";
}

function prStateLabel(pr: PRDetail): string {
  if (pr.merged) return "Merged";
  if (pr.state === "closed") return "Closed";
  if (pr.isDraft) return "Draft";
  return "Open";
}

function prStateIcon(pr: PRDetail) {
  if (pr.merged) return GitMerge;
  if (pr.state === "closed") return XCircle;
  return GitPullRequest;
}

const reviewStateLabels: Record<string, { label: string; variant: string }> = {
  APPROVED: { label: "Approved", variant: "success" },
  CHANGES_REQUESTED: { label: "Changes requested", variant: "danger" },
  COMMENTED: { label: "Commented", variant: "default" },
  DISMISSED: { label: "Dismissed", variant: "default" },
  PENDING: { label: "Pending", variant: "warning" },
};

// ─── Page ───────────────────────────────────────────

export default function PRDetailPage() {
  const params = useParams<{ owner: string; repo: string; number: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoFullName = `${params.owner}/${params.repo}`;
  const prNumber = parseInt(params.number, 10);
  const branch = searchParams.get("branch") ?? undefined;
  const repoHubQuery = searchParams.toString();
  const repoHubHref = repoHubQuery ? `/repos/${repoFullName}?${repoHubQuery}` : `/repos/${repoFullName}`;

  const [pr, setPr] = useState<PRDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("conversation");
  const [drafting, setDrafting] = useState(false);

  // Merge state
  const [merging, setMerging] = useState(false);
  const [mergeMethod, setMergeMethod] = useState<"merge" | "squash" | "rebase">("merge");
  const [mergeDropdown, setMergeDropdown] = useState(false);
  const [closing, setClosing] = useState(false);

  // Comment state
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadPR = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pipelineApi.getPull(repoFullName, prNumber);
      setPr(data);
    } catch (err) {
      console.error("Failed to load PR:", err);
    } finally {
      setLoading(false);
    }
  }, [repoFullName, prNumber]);

  useEffect(() => {
    loadPR();
  }, [loadPR]);

  async function handleDraft() {
    if (!pr) return;
    setDrafting(true);
    try {
      const result = await pipelineApi.draft({
        type: "pull_request",
        repositoryFullName: repoFullName,
        refNumber: pr.number,
        title: pr.title,
        body: pr.body,
        ...(branch ? { targetBranch: branch } : {}),
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to draft:", err);
      setDrafting(false);
    }
  }

  async function handleMerge() {
    setMerging(true);
    try {
      await pipelineApi.mergePR(repoFullName, prNumber, mergeMethod);
      await loadPR();
    } catch (err) {
      console.error("Failed to merge:", err);
    } finally {
      setMerging(false);
    }
  }

  async function handleClose() {
    setClosing(true);
    try {
      await pipelineApi.closePR(repoFullName, prNumber);
      await loadPR();
    } catch (err) {
      console.error("Failed to close:", err);
    } finally {
      setClosing(false);
    }
  }

  async function handleComment() {
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await pipelineApi.postPRComment(
        repoFullName,
        prNumber,
        commentBody.trim()
      );
      setPr((prev) =>
        prev
          ? { ...prev, comments: [...(prev.comments ?? []), newComment] }
          : prev
      );
      setCommentBody("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-muted)]" />
      </div>
    );
  }

  if (!pr) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <p className="text-sm text-[var(--color-fg-muted)] text-center py-8">
          Pull request not found.
        </p>
      </div>
    );
  }

  const StateIcon = prStateIcon(pr);
  const isOpen = pr.state === "open" && !pr.merged;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
        <button
          onClick={() => router.push("/repos")}
          className="hover:text-[var(--color-fg-default)] transition-colors"
        >
          Repositories
        </button>
        <span>/</span>
        <button
          onClick={() => router.push(repoHubHref)}
          className="hover:text-[var(--color-fg-default)] transition-colors"
        >
          {repoFullName}
        </button>
        <span>/</span>
        <span className="text-[var(--color-fg-default)]">
          PR #{pr.number}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-fg-default)] mb-2">
          {pr.title}{" "}
          <span className="text-[var(--color-fg-muted)] font-normal">
            #{pr.number}
          </span>
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={prStateVariant(pr)} className="capitalize">
            <StateIcon className="h-3 w-3 mr-1" />
            {prStateLabel(pr)}
          </Badge>
          {pr.user && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
              <Avatar
                src={pr.user.avatarUrl}
                alt={pr.user.login}
                size="sm"
              />
              <span className="font-medium text-[var(--color-fg-default)]">
                {pr.user.login}
              </span>
              wants to merge
            </span>
          )}
          <span className="text-xs text-[var(--color-fg-muted)] font-mono bg-[var(--color-canvas-subtle)] px-1.5 py-0.5 rounded">
            {pr.sourceBranch}
          </span>
          <span className="text-xs text-[var(--color-fg-muted)]">→</span>
          <span className="text-xs text-[var(--color-fg-muted)] font-mono bg-[var(--color-canvas-subtle)] px-1.5 py-0.5 rounded">
            {pr.targetBranch}
          </span>
          {pr.additions !== undefined && (
            <span className="text-xs text-[var(--color-accent-fg)]">
              +{pr.additions}
            </span>
          )}
          {pr.deletions !== undefined && (
            <span className="text-xs text-[var(--color-danger-fg)]">
              -{pr.deletions}
            </span>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button size="sm" onClick={handleDraft} disabled={drafting}>
          {drafting ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Rocket className="h-3 w-3 mr-1" />
          )}
          Draft Task
        </Button>

        {/* Merge dropdown */}
        {isOpen && (
          <div className="relative">
            <div className="flex">
              <Button
                size="sm"
                onClick={handleMerge}
                disabled={merging || pr.mergeable === false}
                className="rounded-r-none"
              >
                {merging ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <GitMerge className="h-3 w-3 mr-1" />
                )}
                {mergeMethod === "merge"
                  ? "Merge"
                  : mergeMethod === "squash"
                  ? "Squash & merge"
                  : "Rebase & merge"}
              </Button>
              <Button
                size="sm"
                onClick={() => setMergeDropdown(!mergeDropdown)}
                className="rounded-l-none border-l border-l-[var(--color-fg-on-emphasis)]/20 px-1.5"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            {mergeDropdown && (
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-overlay)] shadow-lg py-1">
                {(["merge", "squash", "rebase"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMergeMethod(m);
                      setMergeDropdown(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-[var(--color-canvas-subtle)] transition-colors",
                      mergeMethod === m
                        ? "text-[var(--color-accent-fg)] font-medium"
                        : "text-[var(--color-fg-default)]"
                    )}
                  >
                    {m === "merge" && "Create a merge commit"}
                    {m === "squash" && "Squash and merge"}
                    {m === "rebase" && "Rebase and merge"}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isOpen && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClose}
            disabled={closing}
          >
            {closing ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            Close
          </Button>
        )}

        {pr.mergeable === false && isOpen && (
          <span className="text-xs text-[var(--color-danger-fg)] flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Merge conflicts
          </span>
        )}

        <a href={pr.url} target="_blank" rel="noopener noreferrer" className="ml-auto">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on GitHub
          </Button>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border-default)]">
        <button
          onClick={() => setTab("conversation")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
            tab === "conversation"
              ? "border-[var(--color-accent-emphasis)] text-[var(--color-fg-default)]"
              : "border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Conversation
          {pr.comments && pr.comments.length > 0 && (
            <span className="text-xs bg-[var(--color-neutral-muted,var(--color-canvas-subtle))] px-1.5 py-0.5 rounded-full">
              {pr.comments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("files")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
            tab === "files"
              ? "border-[var(--color-accent-emphasis)] text-[var(--color-fg-default)]"
              : "border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]"
          )}
        >
          <FileCode className="h-4 w-4" />
          Files Changed
          {pr.diffFiles && (
            <span className="text-xs bg-[var(--color-neutral-muted,var(--color-canvas-subtle))] px-1.5 py-0.5 rounded-full">
              {pr.diffFiles.length}
            </span>
          )}
        </button>
      </div>

      {/* Conversation Tab */}
      {tab === "conversation" && (
        <div className="space-y-4">
          {/* PR body */}
          {pr.body && (
            <Card>
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--color-border-muted)]">
                  {pr.user && (
                    <Avatar
                      src={pr.user.avatarUrl}
                      alt={pr.user.login}
                      size="sm"
                    />
                  )}
                  <span className="text-xs font-medium text-[var(--color-fg-default)]">
                    {pr.user?.login}
                  </span>
                  <span className="text-xs text-[var(--color-fg-muted)]">
                    commented {timeAgo(pr.createdAt)}
                  </span>
                </div>
                <MarkdownRenderer content={pr.body} />
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {pr.reviews?.map((review) => {
            const reviewInfo = reviewStateLabels[review.state] ?? {
              label: review.state,
              variant: "default",
            };
            return (
              <Card key={review.id}>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--color-border-muted)]">
                    {review.user && (
                      <Avatar
                        src={review.user.avatarUrl}
                        alt={review.user.login}
                        size="sm"
                      />
                    )}
                    <span className="text-xs font-medium text-[var(--color-fg-default)]">
                      {review.user?.login}
                    </span>
                    <Badge
                      variant={reviewInfo.variant as any}
                      className="text-[10px]"
                    >
                      {reviewInfo.label}
                    </Badge>
                    <span className="text-xs text-[var(--color-fg-muted)]">
                      {timeAgo(review.submittedAt)}
                    </span>
                  </div>
                  {review.body && <MarkdownRenderer content={review.body} />}
                </CardContent>
              </Card>
            );
          })}

          {/* Comments */}
          {pr.comments?.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--color-border-muted)]">
                  {comment.user && (
                    <Avatar
                      src={comment.user.avatarUrl}
                      alt={comment.user.login}
                      size="sm"
                    />
                  )}
                  <span className="text-xs font-medium text-[var(--color-fg-default)]">
                    {comment.user?.login}
                  </span>
                  <span className="text-xs text-[var(--color-fg-muted)]">
                    commented {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <MarkdownRenderer content={comment.body} />
              </CardContent>
            </Card>
          ))}

          {/* Comment composer */}
          <Card>
            <CardContent className="py-4 px-5">
              <div className="text-xs font-medium text-[var(--color-fg-default)] mb-2">
                Add a comment
              </div>
              <textarea
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Leave a comment..."
                rows={4}
                className="w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] px-3 py-2 text-sm text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-emphasis)] resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentBody.trim() || submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Send className="h-3 w-3 mr-1" />
                  )}
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Files Changed Tab */}
      {tab === "files" && (
        <div>
          {pr.diffFiles && pr.diffFiles.length > 0 ? (
            <DiffViewer files={pr.diffFiles} />
          ) : (
            <p className="text-sm text-[var(--color-fg-muted)] py-8 text-center">
              No file changes available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
