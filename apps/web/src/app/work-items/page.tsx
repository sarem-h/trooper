"use client";

import { useState, useEffect } from "react";
import {
  Bug,
  Shield,
  Lightbulb,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkItemStatus } from "@trooper/shared";
import { workItems as workItemsApi } from "@/lib/api";

const typeIcon: Record<string, typeof Bug> = {
  bug: Bug,
  vulnerability: Shield,
  feature: Lightbulb,
};

const typeColor: Record<string, string> = {
  bug: "text-[var(--color-danger-fg)]",
  vulnerability: "text-[var(--color-warning-fg)]",
  feature: "text-[var(--color-info-fg)]",
};

const statusBadge: Record<WorkItemStatus, { variant: "success" | "info" | "danger" | "default" | "warning" | "done"; label: string }> = {
  [WorkItemStatus.Pending]: { variant: "default", label: "Pending" },
  [WorkItemStatus.InProgress]: { variant: "info", label: "In Progress" },
  [WorkItemStatus.AwaitingReview]: { variant: "warning", label: "Awaiting Review" },
  [WorkItemStatus.Rejected]: { variant: "danger", label: "Rejected" },
  [WorkItemStatus.Completed]: { variant: "done", label: "Completed" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function WorkItemsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    workItemsApi.list().then(setItems).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-fg-default)]">
            Work Items
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Tasks ingested from Azure DevOps
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Work Items</CardTitle>
            <span className="text-xs text-[var(--color-fg-subtle)]">
              {items.length} items
            </span>
          </div>
        </CardHeader>
        <div className="divide-y divide-[var(--color-border-muted)]">
          {items.map((item) => {
            const Icon = typeIcon[item.type] ?? Lightbulb;
            const color = typeColor[item.type] ?? "text-[var(--color-fg-muted)]";
            const status = statusBadge[item.status as WorkItemStatus];
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--color-canvas-overlay)] transition-colors"
              >
                <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-fg-default)]">
                    {item.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                    <span>#{item.azureId}</span>
                    <span>·</span>
                    <span className="capitalize">{item.type}</span>
                    <span>·</span>
                    <span>{timeAgo(item.updatedAt)}</span>
                  </div>
                </div>
                <Badge variant={status.variant} className="shrink-0">
                  {status.label}
                </Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
