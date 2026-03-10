"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldOff,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WebhookConfig } from "@trooper/shared";
import { webhooks as webhooksApi } from "@/lib/api";

function timeAgo(dateStr?: string) {
  if (!dateStr) return "Never triggered";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Less than 1h ago";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function WebhookRow({ webhook }: { webhook: any }) {
  const repo = webhook.repository;

  return (
    <div className="flex items-center justify-between rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-1">
          {webhook.active ? (
            <CheckCircle2 className="h-4 w-4 text-[var(--color-accent-fg)]" />
          ) : (
            <XCircle className="h-4 w-4 text-[var(--color-fg-subtle)]" />
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-fg-default)]">
              {webhook.event}
            </span>
            <Badge variant={webhook.active ? "success" : "default"}>
              {webhook.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-xs font-mono text-[var(--color-fg-subtle)] truncate">
            {webhook.endpointPath}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-fg-subtle)]">
            {repo && (
              <span>
                {repo.fullName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(webhook.lastTriggeredAt)}
            </span>
            <span className="flex items-center gap-1">
              {webhook.secretConfigured ? (
                <>
                  <ShieldCheck className="h-3 w-3 text-[var(--color-accent-fg)]" />
                  <span className="text-[var(--color-accent-fg)]">HMAC verified</span>
                </>
              ) : (
                <>
                  <ShieldOff className="h-3 w-3 text-[var(--color-warning-fg)]" />
                  <span className="text-[var(--color-warning-fg)]">No secret</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      <button className="rounded-md p-1.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-inset)] transition-colors shrink-0">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function WebhooksPage() {
  const [whs, setWhs] = useState<any[]>([]);

  useEffect(() => {
    webhooksApi.list().then(setWhs).catch(console.error);
  }, []);

  // Group by repository
  const grouped = whs.reduce(
    (acc, wh) => {
      const key = wh.repository?.fullName ?? "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(wh);
      return acc;
    },
    {} as Record<string, any[]>
  );

  const activeCount = whs.filter((w) => w.active).length;
  const securedCount = whs.filter((w) => w.secretConfigured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-[var(--color-fg-default)]">
            Webhook Endpoints
          </h2>
          <p className="text-xs text-[var(--color-fg-muted)]">
            Inbound webhook endpoints that trigger Trooper agent runs
          </p>
        </div>
        <Button size="sm" variant="default" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Add Webhook
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-center">
          <p className="text-lg font-semibold text-[var(--color-fg-default)]">
            {whs.length}
          </p>
          <p className="text-[11px] text-[var(--color-fg-muted)]">Total</p>
        </div>
        <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-center">
          <p className="text-lg font-semibold text-[var(--color-accent-fg)]">
            {activeCount}
          </p>
          <p className="text-[11px] text-[var(--color-fg-muted)]">Active</p>
        </div>
        <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-center">
          <p className="text-lg font-semibold text-[var(--color-fg-default)]">
            {securedCount}
          </p>
          <p className="text-[11px] text-[var(--color-fg-muted)]">HMAC Secured</p>
        </div>
      </div>

      {(Object.entries(grouped) as [string, any[]][]).map(([repoName, webhooks]) => (
        <div key={repoName} className="space-y-3">
          <h3 className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            {repoName}
          </h3>
          <div className="space-y-2">
            {webhooks.map((wh) => (
              <WebhookRow key={wh.id} webhook={wh} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
