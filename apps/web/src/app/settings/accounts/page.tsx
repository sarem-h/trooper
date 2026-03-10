"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserCheck,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import type { LinkedAccount } from "@trooper/shared";
import { AuthStatus, GitProvider, ConnectionAuthMethod } from "@trooper/shared";
import { accounts as accountsApi } from "@/lib/api";

function providerLabel(provider: GitProvider) {
  return provider === GitProvider.GitHub ? "GitHub" : "Azure DevOps";
}

function authMethodLabel(method: ConnectionAuthMethod) {
  const labels: Record<ConnectionAuthMethod, string> = {
    [ConnectionAuthMethod.GitHubApp]: "GitHub App",
    [ConnectionAuthMethod.OAuthApp]: "OAuth",
    [ConnectionAuthMethod.PAT]: "PAT",
    [ConnectionAuthMethod.ServicePrincipal]: "Service Principal",
  };
  return labels[method];
}

function statusConfig(status: AuthStatus) {
  const map: Record<AuthStatus, { label: string; variant: "success" | "warning" | "danger" | "default"; icon: typeof CheckCircle2 }> = {
    [AuthStatus.Active]: { label: "Active", variant: "success", icon: CheckCircle2 },
    [AuthStatus.Expiring]: { label: "Expiring", variant: "warning", icon: AlertTriangle },
    [AuthStatus.Expired]: { label: "Expired", variant: "danger", icon: XCircle },
    [AuthStatus.Revoked]: { label: "Revoked", variant: "danger", icon: XCircle },
    [AuthStatus.Error]: { label: "Error", variant: "danger", icon: XCircle },
  };
  return map[status];
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function daysUntil(dateStr?: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function AccountCard({ account }: { account: any }) {
  const status = statusConfig(account.status);
  const StatusIcon = status.icon;
  const connection = account.connection;
  const days = daysUntil(account.expiresAt);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar
              fallback={account.displayName.split(" ").map((n: string) => n[0]).join("")}
              src={account.avatarUrl}
              size="md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-[var(--color-fg-default)]">
                  {account.displayName}
                </h3>
                <Badge variant={status.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-xs text-[var(--color-fg-muted)]">
                @{account.providerUsername} &middot;{" "}
                {providerLabel(account.provider)} &middot;{" "}
                {authMethodLabel(account.authMethod)}
              </p>
              <p className="text-xs text-[var(--color-fg-subtle)]">
                {account.email}
              </p>

              <div className="flex items-center gap-3 pt-1 text-[11px] text-[var(--color-fg-subtle)]">
                {connection && (
                  <span>
                    via <span className="text-[var(--color-fg-muted)]">{connection.name}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Used {timeAgo(account.lastUsedAt)}
                </span>
                {days !== null && days <= 30 && (
                  <span className="text-[var(--color-warning-fg)]">
                    {days <= 0
                      ? "Token expired"
                      : `Expires in ${days}d`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)] transition-colors">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccountsPage() {
  const [accts, setAccts] = useState<any[]>([]);

  useEffect(() => {
    accountsApi.list().then(setAccts).catch(console.error);
  }, []);

  const grouped = accts.reduce(
    (acc, account) => {
      const key = providerLabel(account.provider);
      if (!acc[key]) acc[key] = [];
      acc[key].push(account);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-[var(--color-fg-default)]">
            Linked Accounts
          </h2>
          <p className="text-xs text-[var(--color-fg-muted)]">
            User identities Trooper can assume when creating branches and
            pull requests
          </p>
        </div>
        <Button size="sm" variant="default" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Link Account
        </Button>
      </div>

      {/* Info banner about assume */}
      <div className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-4 py-3">
        <div className="flex items-start gap-2">
          <UserCheck className="h-4 w-4 mt-0.5 text-[var(--color-accent-fg)]" />
          <div className="space-y-1">
            <p className="text-xs font-medium text-[var(--color-fg-default)]">
              Assume Identity
            </p>
            <p className="text-xs text-[var(--color-fg-muted)]">
              When a repository is configured with &ldquo;Assume User&rdquo; mode,
              Trooper will create branches and submit PRs using the linked
              account&apos;s credentials. This makes the work appear as if the
              developer authored it, preserving attribution and bypassing
              bot-account restrictions.
            </p>
          </div>
        </div>
      </div>

      {(Object.entries(grouped) as [string, any[]][]).map(([provider, accounts]) => (
        <div key={provider} className="space-y-3">
          <h3 className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            {provider}
          </h3>
          <div className="space-y-2">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
