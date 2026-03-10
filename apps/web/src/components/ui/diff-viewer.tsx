"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Plus, Minus, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiffFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface DiffViewerProps {
  files: DiffFile[];
}

// ─── Single File Diff ───────────────────────────────

function FileDiff({ file }: { file: DiffFile }) {
  const [collapsed, setCollapsed] = useState(false);

  const lines = file.patch?.split("\n") ?? [];

  const statusIcon =
    file.status === "added" ? (
      <Plus className="h-3 w-3 text-[var(--color-accent-fg)]" />
    ) : file.status === "removed" ? (
      <Minus className="h-3 w-3 text-[var(--color-danger-fg)]" />
    ) : (
      <FileEdit className="h-3 w-3 text-[var(--color-warning-fg)]" />
    );

  return (
    <div className="border border-[var(--color-border-default)] rounded-md overflow-hidden">
      {/* File header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full px-3 py-2 bg-[var(--color-canvas-subtle)] hover:bg-[var(--color-canvas-overlay)] transition-colors text-left"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3 text-[var(--color-fg-muted)] shrink-0" />
        ) : (
          <ChevronDown className="h-3 w-3 text-[var(--color-fg-muted)] shrink-0" />
        )}
        {statusIcon}
        <span className="text-xs font-mono text-[var(--color-fg-default)] truncate flex-1">
          {file.filename}
        </span>
        <div className="flex items-center gap-2 text-xs shrink-0">
          {file.additions > 0 && (
            <span className="text-[var(--color-accent-fg)]">
              +{file.additions}
            </span>
          )}
          {file.deletions > 0 && (
            <span className="text-[var(--color-danger-fg)]">
              -{file.deletions}
            </span>
          )}
        </div>
      </button>

      {/* Diff content */}
      {!collapsed && file.patch && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <tbody>
              {lines.map((line, i) => {
                const isAddition = line.startsWith("+") && !line.startsWith("+++");
                const isDeletion = line.startsWith("-") && !line.startsWith("---");
                const isHunkHeader = line.startsWith("@@");

                return (
                  <tr
                    key={i}
                    className={cn(
                      isAddition && "bg-[rgba(16,124,16,0.08)]",
                      isDeletion && "bg-[rgba(209,52,56,0.08)]",
                      isHunkHeader && "bg-[rgba(0,120,212,0.06)]"
                    )}
                  >
                    <td className="w-[1px] whitespace-nowrap px-2 py-0 text-[var(--color-fg-subtle)] select-none text-right border-r border-[var(--color-border-muted)]">
                      {!isHunkHeader ? i + 1 : ""}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-0 whitespace-pre",
                        isAddition && "text-[var(--color-accent-fg)]",
                        isDeletion && "text-[var(--color-danger-fg)]",
                        isHunkHeader && "text-[var(--color-info-fg)] font-medium",
                        !isAddition &&
                          !isDeletion &&
                          !isHunkHeader &&
                          "text-[var(--color-fg-default)]"
                      )}
                    >
                      {line}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!collapsed && !file.patch && (
        <div className="px-3 py-4 text-xs text-[var(--color-fg-muted)] text-center">
          Binary file or no diff available
        </div>
      )}
    </div>
  );
}

// ─── Main DiffViewer ────────────────────────────────

export function DiffViewer({ files }: DiffViewerProps) {
  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = files.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex items-center gap-3 text-xs text-[var(--color-fg-muted)]">
        <span className="flex items-center gap-1">
          <File className="h-3 w-3" />
          {files.length} file{files.length !== 1 && "s"} changed
        </span>
        <span className="text-[var(--color-accent-fg)]">
          +{totalAdditions}
        </span>
        <span className="text-[var(--color-danger-fg)]">
          -{totalDeletions}
        </span>
        {/* Change bar visualization */}
        <div className="flex h-2 w-40 rounded-full overflow-hidden bg-[var(--color-canvas-subtle)]">
          {totalAdditions + totalDeletions > 0 && (
            <>
              <div
                className="bg-[var(--color-accent-fg)]"
                style={{
                  width: `${(totalAdditions / (totalAdditions + totalDeletions)) * 100}%`,
                }}
              />
              <div
                className="bg-[var(--color-danger-fg)]"
                style={{
                  width: `${(totalDeletions / (totalAdditions + totalDeletions)) * 100}%`,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* File diffs */}
      {files.map((file) => (
        <FileDiff key={file.filename} file={file} />
      ))}
    </div>
  );
}
