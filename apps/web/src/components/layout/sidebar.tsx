"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  Database,
  BrainCircuit,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FolderGit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Bot;
  tone?: "accent";
};

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Create",
    items: [{ label: "New Task", href: "/create", icon: PlusCircle, tone: "accent" as const }],
  },
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Repositories", href: "/repos", icon: FolderGit2 },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Work Items", href: "/work-items", icon: ListTodo },
      { label: "Skills", href: "/skills", icon: BrainCircuit },
      { label: "RAG Index", href: "/indexing", icon: Database },
      { label: "Security", href: "/security", icon: ShieldCheck },
    ],
  },
];

const bottomNavItems = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActivePath = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-[var(--color-border-default)] bg-[var(--color-sidebar-bg)] transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-72"
      )}
    >
      {/* Product header */}
      <div className="border-b border-[var(--color-border-default)] px-4 py-4">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3") }>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[var(--color-accent-emphasis)] text-white">
            <Bot className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-[var(--color-fg-default)]">
                Trooper
              </div>
              <div className="truncate text-[11px] text-[var(--color-fg-muted)]">
                Engineering workspace
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const isActive = isActivePath(item.href);
                const isAccent = item.tone === "accent";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-sm border border-transparent px-3 py-2 text-[13px] font-medium transition-colors",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-[var(--color-sidebar-active)] text-[var(--color-fg-default)]"
                        : "text-[var(--color-fg-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-fg-default)]",
                      isAccent && !isActive && "text-[var(--color-accent-fg)] hover:text-[var(--color-accent-fg)]"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-1 left-0 w-[3px] rounded-r-full transition-opacity",
                        isActive ? "bg-[var(--color-sidebar-indicator)] opacity-100" : "opacity-0 group-hover:opacity-30 bg-[var(--color-sidebar-indicator)]"
                      )}
                    />
                    <item.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive && "text-[var(--color-sidebar-indicator)]",
                        isAccent && !isActive && "text-[var(--color-accent-fg)]"
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-[var(--color-border-default)] px-2 py-3 space-y-1 bg-[var(--color-sidebar-surface)]">
        {bottomNavItems.map((item) => {
          const isActive = isActivePath(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-sm border border-transparent px-3 py-2 text-[13px] font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-[var(--color-sidebar-active)] text-[var(--color-fg-default)]"
                  : "text-[var(--color-fg-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-fg-default)]"
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-1 left-0 w-[3px] rounded-r-full transition-opacity",
                  isActive ? "bg-[var(--color-sidebar-indicator)] opacity-100" : "opacity-0 group-hover:opacity-30 bg-[var(--color-sidebar-indicator)]"
                )}
              />
              <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-[var(--color-sidebar-indicator)]")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-3 rounded-sm border border-transparent px-3 py-2 text-[13px] font-medium text-[var(--color-fg-subtle)] transition-colors hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-fg-default)]",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
