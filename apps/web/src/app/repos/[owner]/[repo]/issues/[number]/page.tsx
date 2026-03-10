"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Rocket,
  ExternalLink,
  MessageSquare,
  CircleDot,
  Clock,
  Send,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/ui/markdown";
import { pipeline as pipelineApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────

interface ScmUser {
  login: string;
  avatarUrl: string;
}

interface ScmLabel {
  name: string;
  color: string;
}

interface ScmComment {
  id: number;
  body: string;
  user: ScmUser | null;
  createdAt: string;
}

interface IssueDetail {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: ScmLabel[];
  user: ScmUser | null;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  url: string;
  comments: ScmComment[];
}

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

// ─── Page ───────────────────────────────────────────

export default function IssueDetailPage() {
  const params = useParams<{ owner: string; repo: string; number: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoFullName = `${params.owner}/${params.repo}`;
  const issueNumber = parseInt(params.number, 10);
  const branch = searchParams.get("branch") ?? undefined;
  const repoHubQuery = searchParams.toString();
  const repoHubHref = repoHubQuery ? `/repos/${repoFullName}?${repoHubQuery}` : `/repos/${repoFullName}`;

  const [issue, setIssue] = useState<IssueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);

  // Comment state
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadIssue = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pipelineApi.getIssue(repoFullName, issueNumber);
      setIssue(data);
    } catch (err) {
      console.error("Failed to load issue:", err);
    } finally {
      setLoading(false);
    }
  }, [repoFullName, issueNumber]);

  useEffect(() => {
    loadIssue();
  }, [loadIssue]);

  async function handleDraft() {
    if (!issue) return;
    setDrafting(true);
    try {
      const result = await pipelineApi.draft({
        type: "issue",
        repositoryFullName: repoFullName,
        refNumber: issue.number,
        title: issue.title,
        body: issue.body,
        ...(branch ? { targetBranch: branch } : {}),
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to draft:", err);
      setDrafting(false);
    }
  }

  async function handleComment() {
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await pipelineApi.postIssueComment(
        repoFullName,
        issueNumber,
        commentBody.trim()
      );
      setIssue((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
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

  if (!issue) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <p className="text-sm text-[var(--color-fg-muted)] text-center py-8">
          Issue not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
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
          Issue #{issue.number}
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-fg-default)] mb-2">
          {issue.title}{" "}
          <span className="text-[var(--color-fg-muted)] font-normal">
            #{issue.number}
          </span>
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            variant={issue.state === "open" ? "success" : "done"}
            className="capitalize"
          >
            <CircleDot className="h-3 w-3 mr-1" />
            {issue.state}
          </Badge>
          {issue.user && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
              <Avatar
                src={issue.user.avatarUrl}
                alt={issue.user.login}
                size="sm"
              />
              <span className="font-medium text-[var(--color-fg-default)]">
                {issue.user.login}
              </span>
              opened {timeAgo(issue.createdAt)}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-[var(--color-fg-muted)]">
            <MessageSquare className="h-3 w-3" />
            {issue.comments.length} comment{issue.comments.length !== 1 && "s"}
          </span>
          {issue.labels.map((l) => (
            <span
              key={l.name}
              className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
              style={labelStyle(l.color)}
            >
              {l.name}
            </span>
          ))}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleDraft} disabled={drafting}>
          {drafting ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Rocket className="h-3 w-3 mr-1" />
          )}
          Draft Task
        </Button>
        <a
          href={issue.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on GitHub
          </Button>
        </a>
      </div>

      {/* Issue body */}
      {issue.body && (
        <Card>
          <CardContent className="py-4 px-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--color-border-muted)]">
              {issue.user && (
                <Avatar
                  src={issue.user.avatarUrl}
                  alt={issue.user.login}
                  size="sm"
                />
              )}
              <span className="text-xs font-medium text-[var(--color-fg-default)]">
                {issue.user?.login}
              </span>
              <span className="text-xs text-[var(--color-fg-muted)]">
                commented {timeAgo(issue.createdAt)}
              </span>
            </div>
            <MarkdownRenderer content={issue.body} />
          </CardContent>
        </Card>
      )}

      {/* Comments thread */}
      {issue.comments.length > 0 && (
        <div className="space-y-3">
          {issue.comments.map((comment) => (
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
        </div>
      )}

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
  );
}
