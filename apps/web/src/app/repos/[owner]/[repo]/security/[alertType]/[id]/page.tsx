"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Rocket,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Package,
  FileCode,
  Calendar,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown";
import { pipeline as pipelineApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────

interface SecurityAlert {
  id: number;
  alertType: "dependabot" | "code_scanning" | "secret_scanning";
  severity: string;
  state: string;
  title: string;
  description: string;
  affectedComponent: string;
  cveId?: string;
  cweIds?: string[];
  tool?: string;
  url: string;
  createdAt: string;
  fixAvailable?: boolean;
  filePath?: string;
  startLine?: number;
  endLine?: number;
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

const severityConfig: Record<string, { variant: string; color: string }> = {
  critical: { variant: "danger", color: "text-[var(--color-danger-fg)]" },
  high: { variant: "danger", color: "text-[var(--color-severe-fg)]" },
  medium: { variant: "warning", color: "text-[var(--color-warning-fg)]" },
  low: { variant: "info", color: "text-[var(--color-info-fg)]" },
  info: { variant: "default", color: "text-[var(--color-fg-muted)]" },
};

const alertTypeLabels: Record<string, string> = {
  dependabot: "Dependabot",
  code_scanning: "Code Scanning",
  secret_scanning: "Secret Scanning",
};

// ─── Page ───────────────────────────────────────────

export default function SecurityAlertDetailPage() {
  const params = useParams<{
    owner: string;
    repo: string;
    alertType: string;
    id: string;
  }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoFullName = `${params.owner}/${params.repo}`;
  const alertId = parseInt(params.id, 10);
  const branch = searchParams.get("branch") ?? undefined;
  const repoHubQuery = searchParams.toString();
  const repoHubHref = repoHubQuery ? `/repos/${repoFullName}?${repoHubQuery}` : `/repos/${repoFullName}`;

  const [alert, setAlert] = useState<SecurityAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);

  const loadAlert = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pipelineApi.getSecurityAlert(
        repoFullName,
        params.alertType,
        alertId
      );
      setAlert(data);
    } catch (err) {
      console.error("Failed to load security alert:", err);
    } finally {
      setLoading(false);
    }
  }, [repoFullName, params.alertType, alertId]);

  useEffect(() => {
    loadAlert();
  }, [loadAlert]);

  async function handleFix() {
    if (!alert) return;
    setDrafting(true);
    try {
      const result = await pipelineApi.draft({
        type: "security",
        repositoryFullName: repoFullName,
        refNumber: alert.id,
        title: alert.title,
        body: alert.description,
        alertType: alert.alertType,
        severity: alert.severity,
        affectedComponent: alert.affectedComponent,
        ...(branch ? { targetBranch: branch } : {}),
      });
      router.push(`/agent/${result.runId}`);
    } catch (err) {
      console.error("Failed to draft fix:", err);
      setDrafting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-muted)]" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <p className="text-sm text-[var(--color-fg-muted)] text-center py-8">
          Security alert not found.
        </p>
      </div>
    );
  }

  const sevConfig = severityConfig[alert.severity] ?? severityConfig.info;

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
          Security &middot; {alertTypeLabels[alert.alertType] ?? alert.alertType}
        </span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert
            className={cn("h-5 w-5", sevConfig.color)}
          />
          <h1 className="text-xl font-semibold text-[var(--color-fg-default)]">
            {alert.title}
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={sevConfig.variant as any} className="capitalize">
            {alert.severity}
          </Badge>
          <Badge
            variant={alert.state === "open" ? "danger" : "success"}
            className="capitalize"
          >
            {alert.state}
          </Badge>
          <Badge variant="default">
            {alertTypeLabels[alert.alertType] ?? alert.alertType}
          </Badge>
          {alert.fixAvailable && (
            <Badge variant="success">Fix available</Badge>
          )}
          <span className="text-xs text-[var(--color-fg-muted)] flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {timeAgo(alert.createdAt)}
          </span>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="destructive" onClick={handleFix} disabled={drafting}>
          {drafting ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Rocket className="h-3 w-3 mr-1" />
          )}
          Fix This
        </Button>
        <a href={alert.url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            View on GitHub
          </Button>
        </a>
      </div>

      {/* Details panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Meta info */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-fg-muted)]">Component</span>
              <span className="font-mono text-[var(--color-fg-default)] bg-[var(--color-canvas-subtle)] px-1.5 py-0.5 rounded">
                {alert.affectedComponent}
              </span>
            </div>

            {alert.cveId && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-fg-muted)]">CVE</span>
                <a
                  href={`https://www.cve.org/CVERecord?id=${encodeURIComponent(alert.cveId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent-fg)] hover:underline font-mono"
                >
                  {alert.cveId}
                </a>
              </div>
            )}

            {alert.cweIds && alert.cweIds.length > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-fg-muted)]">CWE</span>
                <div className="flex gap-1">
                  {alert.cweIds.map((cwe) => (
                    <Badge key={cwe} variant="default" className="text-[10px]">
                      {cwe}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {alert.tool && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-fg-muted)]">Tool</span>
                <span className="text-[var(--color-fg-default)]">{alert.tool}</span>
              </div>
            )}

            {alert.alertType === "code_scanning" && alert.filePath && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-fg-muted)]">Location</span>
                <span className="font-mono text-[var(--color-fg-default)]">
                  {alert.filePath}
                  {alert.startLine && `:${alert.startLine}`}
                  {alert.endLine && alert.endLine !== alert.startLine && `-${alert.endLine}`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Severity visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Severity Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div
              className={cn(
                "text-4xl font-bold capitalize mb-2",
                sevConfig.color
              )}
            >
              {alert.severity}
            </div>
            <p className="text-xs text-[var(--color-fg-muted)] text-center">
              {alert.severity === "critical" &&
                "Immediate action required. This vulnerability poses a severe risk."}
              {alert.severity === "high" &&
                "High priority. Should be addressed as soon as possible."}
              {alert.severity === "medium" &&
                "Moderate risk. Plan to address in the near term."}
              {alert.severity === "low" &&
                "Low risk. Consider addressing when convenient."}
              {alert.severity === "info" &&
                "Informational finding."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {alert.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer content={alert.description} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
