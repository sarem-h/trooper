"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Key,
  FileWarning,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { masking as maskingApi } from "@/lib/api";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const patternIcon: Record<string, typeof Key> = {
  "API Key (Bearer / x-api-key)": Key,
  "Connection String (postgres://)": FileWarning,
  "JWT Secret (HMAC key)": EyeOff,
  "Email Address (PII)": Eye,
  "Private Key (RSA/ECDSA)": AlertTriangle,
};

export default function SecurityPage() {
  const [audit, setAudit] = useState<any[]>([]);

  useEffect(() => {
    maskingApi.audit().then(setAudit).catch(console.error);
  }, []);

  const totalMasked = audit.reduce((s, e) => s + e.matchCount, 0);
  const uniquePatterns = new Set(audit.map((e) => e.pattern)).size;
  const affectedFiles = new Set(audit.flatMap((e) => e.filesAffected)).size;

  const patternFrequency = audit.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.pattern] = (acc[entry.pattern] ?? 0) + entry.matchCount;
    return acc;
  }, {});
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
          Security & Masking
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Audit log of secrets and PII stripped before LLM inference
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-fg-muted)]">Total Secrets Masked</p>
              <p className="mt-1 text-2xl font-bold text-[var(--color-fg-default)]">{totalMasked}</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-[var(--color-done-fg)] opacity-80" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-fg-muted)]">Unique Patterns</p>
              <p className="mt-1 text-2xl font-bold text-[var(--color-fg-default)]">{uniquePatterns}</p>
            </div>
            <Eye className="h-8 w-8 text-[var(--color-warning-fg)] opacity-80" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--color-fg-muted)]">Files Affected</p>
              <p className="mt-1 text-2xl font-bold text-[var(--color-fg-default)]">{affectedFiles}</p>
            </div>
            <FileWarning className="h-8 w-8 text-[var(--color-danger-fg)] opacity-80" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Audit log */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--color-done-fg)]" />
              Masking Audit Log
            </CardTitle>
          </CardHeader>
          <div className="divide-y divide-[var(--color-border-muted)]">
            {audit.map((entry) => {
              const Icon = patternIcon[entry.pattern] ?? ShieldCheck;
              return (
                <div key={entry.id} className="px-4 py-3 hover:bg-[var(--color-canvas-overlay)] transition-colors">
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning-fg)]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--color-fg-default)]">
                          {entry.pattern}
                        </span>
                        <Badge variant="warning">{entry.matchCount} match{entry.matchCount !== 1 ? "es" : ""}</Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                        <span className="font-mono">{entry.runId}</span>
                        <span>·</span>
                        <Clock className="h-3 w-3" />
                        <span>{timeAgo(entry.timestamp)}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {entry.filesAffected.map((f: string) => (
                          <span
                            key={f}
                            className="rounded-md bg-[var(--color-canvas-inset)] border border-[var(--color-border-default)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-fg-subtle)]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Pattern summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xs">
              <EyeOff className="h-3.5 w-3.5 text-[var(--color-done-fg)]" />
              Pattern Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(patternFrequency)
              .sort(([, a], [, b]) => b - a)
              .map(([pattern, count]) => (
                <div key={pattern} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-fg-muted)] truncate mr-2">
                    {pattern}
                  </span>
                  <Badge variant="default" className="shrink-0">{count}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
