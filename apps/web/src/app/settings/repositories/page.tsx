"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Database,
  Webhook,
  UserCheck,
  Bot,
  GitBranch,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LinkedRepository } from "@trooper/shared";
import { GitProvider, IdentityMode } from "@trooper/shared";
import { repositories as reposApi } from "@/lib/api";

function providerIcon(provider: GitProvider) {
  if (provider === GitProvider.GitHub) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.333-1.723-1.333-1.723-1.089-.73.083-.716.083-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209A11.707 11.707 0 0 1 12 6.545c1.02.005 2.047.136 3.006.399 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5Z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
    </svg>
  );
}

function RepoCard({ repo }: { repo: any }) {
  const connection = repo.connection;
  const assumeAccount = repo.assumeAccount;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-[var(--color-fg-muted)]">
              {providerIcon(repo.provider)}
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[var(--color-fg-default)]">
                    {repo.fullName}
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  via {connection?.name ?? "Unknown connection"}
                </p>
              </div>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="gap-1">
                  <GitBranch className="h-3 w-3" />
                  {repo.defaultBranch}
                </Badge>

                {repo.identityMode === IdentityMode.AssumeUser && assumeAccount ? (
                  <Badge variant="info" className="gap-1">
                    <UserCheck className="h-3 w-3" />
                    Assume @{assumeAccount.providerUsername}
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1">
                    <Bot className="h-3 w-3" />
                    Service Account
                  </Badge>
                )}

                {repo.indexEnabled ? (
                  <Badge variant="success" className="gap-1">
                    <Database className="h-3 w-3" />
                    RAG Indexed
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1">
                    <Database className="h-3 w-3" />
                    Not Indexed
                  </Badge>
                )}

                {repo.webhookActive ? (
                  <Badge variant="success" className="gap-1">
                    <Webhook className="h-3 w-3" />
                    Webhook
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1">
                    <Webhook className="h-3 w-3" />
                    No Webhook
                  </Badge>
                )}

                {repo.defaultReviewer && (
                  <span className="text-[11px] text-[var(--color-fg-subtle)]">
                    Reviewer: @{repo.defaultReviewer}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button className="rounded-md p-1.5 text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)] transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    reposApi.list().then(setRepos).catch(console.error);
  }, []);

  const azureRepos = repos.filter(
    (r) => r.provider === GitProvider.AzureRepos
  );
  const githubRepos = repos.filter(
    (r) => r.provider === GitProvider.GitHub
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-[var(--color-fg-default)]">
            Repositories
          </h2>
          <p className="text-xs text-[var(--color-fg-muted)]">
            Define which repositories Trooper can act on, which connection they inherit, and whether indexing, identity overrides, and webhook automation are enabled.
          </p>
        </div>
        <Button size="sm" variant="default" className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Link Repository
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[var(--color-fg-muted)]">
          {repos.length} linked repos
        </span>
        <span className="rounded-full border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[var(--color-fg-muted)]">
          {repos.filter((r) => r.indexEnabled).length} indexed
        </span>
        <span className="rounded-full border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[var(--color-fg-muted)]">
          {repos.filter((r) => r.identityMode === IdentityMode.AssumeUser).length} assume-user
        </span>
        <span className="rounded-full border border-[var(--color-border-subtle)] bg-white px-3 py-1.5 text-xs text-[var(--color-fg-muted)]">
          {repos.filter((r) => r.webhookActive).length} webhook-enabled
        </span>
      </div>

      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 py-3 text-xs leading-5 text-[var(--color-fg-muted)]">
        Repository policy is the right place for advanced behavior. If a repo needs assume-user authorship or inbound webhooks, configure that against the repository rather than as a separate global settings step.
      </div>

      {azureRepos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            Azure DevOps
          </h3>
          <div className="space-y-2">
            {azureRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}

      {githubRepos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">
            GitHub
          </h3>
          <div className="space-y-2">
            {githubRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}

      {repos.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--color-border-default)] bg-white px-4 py-5 text-sm text-[var(--color-fg-subtle)]">
          No repositories linked yet. Add a repository once you have a provider connection configured.
        </div>
      )}
    </div>
  );
}
