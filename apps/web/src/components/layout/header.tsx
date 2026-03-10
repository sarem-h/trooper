"use client";

import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-header-bg)] px-6">
      <div className="flex items-center gap-4">
        <div className="text-[13px] font-semibold text-[var(--color-fg-default)]">Overview</div>
        <div className="flex min-w-[24rem] items-center gap-2 rounded-sm border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-1.5 text-sm text-[var(--color-fg-muted)]">
          <Search className="h-3.5 w-3.5 text-[var(--color-fg-subtle)]" />
          <span>Search</span>
          <kbd className="ml-auto rounded-sm border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-fg-subtle)]">
            /
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-sm border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-fg-muted)]">
          3 providers connected
        </div>

        <button className="relative rounded-sm p-1.5 text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-canvas-inset)] hover:text-[var(--color-fg-default)]">
          <Bell className="h-4 w-4" />
          <Badge
            variant="danger"
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[9px]"
          >
            3
          </Badge>
        </button>

        <Avatar fallback="T" size="sm" />
      </div>
    </header>
  );
}
