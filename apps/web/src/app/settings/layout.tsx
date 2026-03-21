"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plug, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { label: "Connections", href: "/settings", icon: Plug },
  { label: "Security", href: "/settings/masking", icon: Shield },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-0 items-start gap-6">
      {/* Sidebar — sticky, never stretches with content */}
      <aside className="sticky top-6 w-48 shrink-0 rounded-xl border border-[var(--color-border-default)] bg-white py-1.5 shadow-sm">
        <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-fg-subtle)]">
          Settings
        </p>
        <nav>
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
                  "flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "border-l-2 border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] font-medium text-[var(--color-accent-emphasis)]"
                    : "border-l-2 border-transparent text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
                )}
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--color-border-subtle)] px-3 py-2">
          <p className="text-[10px] leading-4 text-[var(--color-fg-subtle)]">
            Repository-level policy is configured per-repo from the Repositories explorer.
          </p>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

