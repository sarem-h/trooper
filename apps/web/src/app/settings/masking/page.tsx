"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Shield,
  Lock,
  Code,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MaskingRule } from "@trooper/shared";
import { masking as maskingApi } from "@/lib/api";

function RuleRow({ rule }: { rule: MaskingRule }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5">
          {rule.builtIn ? (
            <Shield className="h-4 w-4 text-[var(--color-accent-fg)]" />
          ) : (
            <Code className="h-4 w-4 text-[var(--color-info-fg)]" />
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-fg-default)]">
              {rule.pattern}
            </span>
            <Badge variant={rule.enabled ? "success" : "default"}>
              {rule.enabled ? "Enabled" : "Disabled"}
            </Badge>
            <Badge variant={rule.builtIn ? "default" : "info"}>
              {rule.builtIn ? "Built-in" : "Custom"}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-fg-muted)]">
            {rule.description}
          </p>
          {rule.regex && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <Lock className="h-3 w-3 text-[var(--color-fg-subtle)]" />
              <code className="text-[10px] font-mono text-[var(--color-fg-subtle)] bg-[var(--color-canvas-inset)] rounded px-1.5 py-0.5 border border-[var(--color-border-default)]">
                {rule.regex}
              </code>
            </div>
          )}
        </div>
      </div>

      <button className="rounded-md p-1.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-inset)] transition-colors shrink-0">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function MaskingPage() {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    maskingApi.rules().then(setRules).catch(console.error);
  }, []);

  const builtIn = rules.filter((r) => r.builtIn);
  const custom = rules.filter((r) => !r.builtIn);
  const enabledCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-[var(--color-fg-default)]">
            Masking Rules
          </h2>
          <p className="text-xs text-[var(--color-fg-muted)]">
            Patterns that Trooper redacts before sending code to the LLM
          </p>
        </div>
        <Button size="sm" variant="default" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Add Custom Rule
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-center">
          <p className="text-lg font-semibold text-[var(--color-fg-default)]">
            {rules.length}
          </p>
          <p className="text-[11px] text-[var(--color-fg-muted)]">Total Rules</p>
        </div>
        <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-center">
          <p className="text-lg font-semibold text-[var(--color-accent-fg)]">
            {enabledCount}
          </p>
          <p className="text-[11px] text-[var(--color-fg-muted)]">Enabled</p>
        </div>
        <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-3 py-2 text-center">
          <p className="text-lg font-semibold text-[var(--color-info-fg)]">
            {custom.length}
          </p>
          <p className="text-[11px] text-[var(--color-fg-muted)]">Custom</p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-4 py-3">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 mt-0.5 text-[var(--color-accent-fg)]" />
          <p className="text-xs text-[var(--color-fg-muted)]">
            Masking rules run automatically during every agent run. Source code
            is scanned for matching patterns and sensitive values are replaced
            with <code className="text-[var(--color-fg-default)]">[REDACTED]</code>{" "}
            placeholders before being sent to the LLM. After code generation,
            original values are restored in the output.
          </p>
        </div>
      </div>

      {/* Built-in rules */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
          Built-in Rules
        </h3>
        <div className="space-y-2">
          {builtIn.map((rule) => (
            <RuleRow key={rule.id} rule={rule} />
          ))}
        </div>
      </div>

      {/* Custom rules */}
      {custom.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            Custom Rules
          </h3>
          <div className="space-y-2">
            {custom.map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
