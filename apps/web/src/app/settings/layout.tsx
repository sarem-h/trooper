"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plug,
  Users,
  GitFork,
  Webhook,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { label: "Connections", href: "/settings", icon: Plug },
  { label: "Linked Accounts", href: "/settings/accounts", icon: Users },
  { label: "Repositories", href: "/settings/repositories", icon: GitFork },
  { label: "Webhooks", href: "/settings/webhooks", icon: Webhook },
  { label: "Masking Rules", href: "/settings/masking", icon: Shield },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--color-border-default)] bg-[radial-gradient(circle_at_top_left,_rgba(0,120,212,0.12),_transparent_38%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(240,243,247,0.96))] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-emphasis)]">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--color-fg-default)]">
          Provider Access
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-fg-muted)]">
          Add PATs, pick a default connection, and link the external repositories
          Trooper is allowed to read and modify.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => {
              const isActive =
                tab.href === "/settings"
                  ? pathname === "/settings"
                  : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-[var(--color-sidebar-active)] text-[var(--color-fg-default)]"
                      : "text-[var(--color-fg-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-fg-default)]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg border",
                      isActive
                        ? "border-[var(--color-accent-muted)] bg-white text-[var(--color-accent-emphasis)]"
                        : "border-[var(--color-border-subtle)] bg-white/70 text-[var(--color-fg-subtle)]"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                  </span>
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
