"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Link2,
  LoaderCircle,
  Plus,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { connections as connectionsApi, repositories as repositoriesApi } from "@/lib/api";
import type { Connection, CreateConnectionDto, LinkedRepository } from "@trooper/shared";
import { AuthStatus, ConnectionAuthMethod, GitProvider } from "@trooper/shared";

type ProviderDraft = {
  provider: GitProvider;
  name: string;
  token: string;
  providerUrl: string;
  isDefault: boolean;
};

const INPUT_CLASS =
  "w-full rounded-xl border border-[var(--color-border-default)] bg-white px-3 py-2.5 text-sm text-[var(--color-fg-default)] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition focus:border-[var(--color-accent-fg)] focus:ring-2 focus:ring-[var(--color-accent-muted)]";

function providerName(provider: GitProvider) {
  return provider === GitProvider.GitHub ? "GitHub" : "Azure DevOps";
}

function providerIcon(provider: GitProvider) {
  if (provider === GitProvider.GitHub) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.333-1.723-1.333-1.723-1.089-.73.083-.716.083-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209A11.707 11.707 0 0 1 12 6.545c1.02.005 2.047.136 3.006.399 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5Z" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h11.377v11.372H0zm12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
    </svg>
  );
}

function statusConfig(status: AuthStatus) {
  const map: Record<AuthStatus, { label: string; variant: "success" | "warning" | "danger" | "default"; icon: typeof CheckCircle2 }> = {
    [AuthStatus.Active]: { label: "Ready", variant: "success", icon: CheckCircle2 },
    [AuthStatus.Expiring]: { label: "Expiring", variant: "warning", icon: AlertTriangle },
    [AuthStatus.Expired]: { label: "Expired", variant: "danger", icon: XCircle },
    [AuthStatus.Revoked]: { label: "Revoked", variant: "danger", icon: XCircle },
    [AuthStatus.Error]: { label: "Needs attention", variant: "danger", icon: XCircle },
  };

  return map[status];
}

function daysUntil(dateStr?: string) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatScopeLabel(provider: GitProvider, scope: string) {
  if (provider === GitProvider.GitHub) {
    const githubLabels: Record<string, string> = {
      repo: "Repos",
      workflow: "Actions",
      user: "User",
      gist: "Gists",
      notifications: "Notifications",
      'read:org': "Org Read",
      'write:repo_hook': "Webhooks",
      'admin:repo_hook': "Webhook Admin",
      'read:user': "Profile Read",
    };

    return githubLabels[scope] ?? scope.replace(/^read:/, "Read ").replace(/^write:/, "Write ").replace(/^admin:/, "Admin ");
  }

  const azureLabels: Record<string, string> = {
    'vso.project': "Projects",
    'vso.code': "Code",
    'vso.work': "Work Items",
    'vso.build': "Builds",
    'vso.release': "Releases",
  };

  return azureLabels[scope] ?? scope.replace(/^vso\./, "").replace(/(^|\.)\w/g, (part) => part.toUpperCase());
}

function scopeVariant(scope: string): "default" | "info" | "success" | "warning" {
  if (scope.includes("code") || scope.includes("repo") || scope.includes("workflow")) return "success";
  if (scope.includes("work") || scope.includes("project") || scope.includes("org")) return "info";
  if (scope.includes("build") || scope.includes("release") || scope.includes("hook")) return "warning";
  return "default";
}

function buildDraft(provider: GitProvider): ProviderDraft {
  return {
    provider,
    name: provider === GitProvider.GitHub ? "Primary GitHub PAT" : "Primary Azure DevOps PAT",
    token: "",
    providerUrl: provider === GitProvider.AzureRepos ? "https://dev.azure.com/your-org" : "",
    isDefault: true,
  };
}

function AddConnectionModal({
  draft,
  onDraftChange,
  onClose,
  onSubmit,
  error,
  isSaving,
}: {
  draft: ProviderDraft | null;
  onDraftChange: (next: ProviderDraft | null) => void;
  onClose: () => void;
  onSubmit: () => void;
  error: string | null;
  isSaving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.28)] px-4 py-8 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl rounded-3xl border border-[var(--color-border-default)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(240,243,247,0.98))] shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between border-b border-[var(--color-border-subtle)] px-8 py-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-emphasis)]">
              Add Connection
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-fg-default)]">
              Save a provider PAT
            </h2>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
              Trooper will use this connection for repository reads, indexing,
              and pull request operations.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--color-border-default)] bg-white p-2 text-[var(--color-fg-subtle)] transition hover:text-[var(--color-fg-default)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!draft ? (
          <div className="grid gap-5 px-8 py-8 sm:grid-cols-2">
            {[GitProvider.GitHub, GitProvider.AzureRepos].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => onDraftChange(buildDraft(provider))}
                className="rounded-2xl border border-[var(--color-border-default)] bg-white p-6 text-left shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent-fg)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.1)]"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
                  {providerIcon(provider)}
                </span>
                <p className="text-base font-semibold text-[var(--color-fg-default)]">{providerName(provider)}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {provider === GitProvider.GitHub
                    ? "Name + PAT. Trooper will detect the account automatically."
                    : "Name + org URL + PAT for Azure DevOps organizations."}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-8 py-8">
            {/* Provider summary */}
            <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle,_#f6f8fa)] px-5 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
                {providerIcon(draft.provider)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-fg-default)]">
                  {providerName(draft.provider)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-fg-muted)]">
                  {draft.provider === GitProvider.GitHub
                    ? "Enter a label and PAT. Trooper will fill in the account details for you."
                    : "Enter a label, Azure DevOps organization URL, and PAT."}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onDraftChange(null)}>
                Change
              </Button>
            </div>

            {/* Connection fields */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-[var(--color-fg-default)]">
                <span className="font-medium">Connection name</span>
                <input
                  className={INPUT_CLASS}
                  value={draft.name}
                  onChange={(event) =>
                    onDraftChange({ ...draft, name: event.target.value })
                  }
                  placeholder="Team GitHub PAT"
                />
              </label>

              {draft.provider === GitProvider.AzureRepos ? (
                <label className="flex flex-col gap-2 text-sm text-[var(--color-fg-default)]">
                  <span className="font-medium">Organization URL</span>
                  <input
                    className={INPUT_CLASS}
                    value={draft.providerUrl}
                    onChange={(event) =>
                      onDraftChange({ ...draft, providerUrl: event.target.value })
                    }
                    placeholder="https://dev.azure.com/your-org"
                  />
                </label>
              ) : (
                <div className="flex items-center rounded-2xl border border-[var(--color-border-default)] bg-white px-4 py-3.5 text-sm text-[var(--color-fg-muted)]">
                  Trooper will read the GitHub account name and scopes from the PAT automatically.
                </div>
              )}
            </div>

            {/* PAT field */}
            <div className="mt-6">
              <label className="flex flex-col gap-2 text-sm text-[var(--color-fg-default)]">
                <span className="font-medium">Personal access token</span>
                <input
                  type="password"
                  className={INPUT_CLASS}
                  value={draft.token}
                  onChange={(event) =>
                    onDraftChange({ ...draft, token: event.target.value })
                  }
                  placeholder={draft.provider === GitProvider.GitHub ? "github_pat_..." : "Azure DevOps PAT"}
                />
              </label>
            </div>

            {/* Default connection toggle */}
            <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl border border-[var(--color-border-default)] bg-white px-5 py-4 text-sm text-[var(--color-fg-default)]">
              <input
                type="checkbox"
                checked={draft.isDefault}
                onChange={(event) =>
                  onDraftChange({ ...draft, isDefault: event.target.checked })
                }
                className="h-4 w-4 accent-[var(--color-accent-fg)] rounded"
              />
              <span>Use this as the default {providerName(draft.provider)} PAT</span>
            </label>

            {error && (
              <div className="mt-6 rounded-2xl border border-[var(--color-danger-fg)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger-emphasis)]">
                {error}
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-[var(--color-border-subtle)] pt-6">
              <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={onSubmit} disabled={isSaving || !draft.name.trim() || !draft.token.trim() || (draft.provider === GitProvider.AzureRepos && !draft.providerUrl.trim())}>
                {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save connection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Single compact row for a connection
function ConnectionRow({
  connection,
  linkedRepos,
  onMakeDefault,
  onDelete,
  onRotateToken,
  pendingActionId,
}: {
  connection: Connection;
  linkedRepos: LinkedRepository[];
  onMakeDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRotateToken: (connection: Connection) => void;
  pendingActionId: string | null;
}) {
  const status = statusConfig(connection.status);
  const StatusIcon = status.icon;
  const days = daysUntil(connection.expiresAt);
  const isBusy = pendingActionId === connection.id;
  const repoCount = connection.repositoryCount ?? linkedRepos.length;
  const visibleScopes = (connection.scopes ?? []).slice(0, 3);
  const hiddenScopeCount = Math.max((connection.scopes?.length ?? 0) - visibleScopes.length, 0);

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3 last:border-0">
      {/* Provider icon */}
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
        {providerIcon(connection.provider)}
      </span>

      {/* Name + account */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--color-fg-default)]">{connection.name}</span>
          {connection.isDefault && (
            <Badge variant="info" className="gap-1 text-[10px]">
              <Star className="h-2.5 w-2.5" /> Default
            </Badge>
          )}
          <Badge variant={status.variant} className="gap-1 text-[10px]">
            <StatusIcon className="h-2.5 w-2.5" /> {status.label}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
          {connection.providerAccountName}
          {connection.tokenPreview && (
            <span className="ml-2 font-mono">{connection.tokenPreview}</span>
          )}
          {repoCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              {repoCount} {repoCount === 1 ? "repo" : "repos"}
            </span>
          )}
        </p>
        {connection.scopes && connection.scopes.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {visibleScopes.map((scope) => (
              <Badge
                key={scope}
                variant={scopeVariant(scope)}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                title={scope}
              >
                {formatScopeLabel(connection.provider, scope)}
              </Badge>
            ))}
            {hiddenScopeCount > 0 && (
              <span className="text-[10px] text-[var(--color-fg-muted)]">+{hiddenScopeCount} more</span>
            )}
          </div>
        )}
        {days !== null && days <= 30 && (
          <p className="mt-0.5 text-xs text-[var(--color-warning-fg)]">
            {days <= 0 ? "Token expired — rotate now" : `Expires in ${days}d`}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <Button size="sm" variant="ghost" onClick={() => onRotateToken(connection)} disabled={isBusy} title="Rotate token">
          <KeyRound className="h-3.5 w-3.5" />
          <span className="sr-only">Rotate token</span>
        </Button>
        {!connection.isDefault && (
          <Button size="sm" variant="ghost" onClick={() => onMakeDefault(connection.id)} disabled={isBusy}>
            {isBusy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5" />}
            <span className="sr-only">Make default</span>
          </Button>
        )}
        {connection.providerUrl && (
          <a
            href={connection.providerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-fg-muted)] transition hover:bg-[var(--color-canvas-subtle)] hover:text-[var(--color-fg-default)]"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <Button size="sm" variant="ghost" onClick={() => onDelete(connection.id)} disabled={isBusy}>
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [repositories, setRepositories] = useState<LinkedRepository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalDraft, setModalDraft] = useState<ProviderDraft | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [rotatingConnection, setRotatingConnection] = useState<Connection | null>(null);
  const [rotateToken, setRotateToken] = useState("");
  const [rotateError, setRotateError] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const refresh = async () => {
    const [connectionData, repositoryData] = await Promise.all([
      connectionsApi.list(),
      repositoriesApi.list(),
    ]);
    setConnections(connectionData);
    setRepositories(repositoryData);
  };

  useEffect(() => {
    setIsLoading(true);
    refresh()
      .catch((error) => {
        console.error(error);
        setComposerError(error instanceof Error ? error.message : "Failed to load settings.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const groupedConnections = useMemo(() => {
    return [GitProvider.GitHub, GitProvider.AzureRepos].map((provider) => ({
      provider,
      items: connections.filter((connection) => connection.provider === provider),
    }));
  }, [connections]);

  const openComposer = () => {
    setComposerError(null);
    setModalDraft(null);
    setIsComposerOpen(true);
  };

  const closeComposer = () => {
    setIsComposerOpen(false);
    setModalDraft(null);
    setComposerError(null);
  };

  const handleCreateConnection = async () => {
    if (!modalDraft) return;

    setIsSaving(true);
    setComposerError(null);

    const payload: CreateConnectionDto = {
      provider: modalDraft.provider,
      name: modalDraft.name.trim(),
      authMethod: ConnectionAuthMethod.PAT,
      token: modalDraft.token.trim(),
      isDefault: modalDraft.isDefault,
      ...(modalDraft.provider === GitProvider.AzureRepos
        ? { providerUrl: modalDraft.providerUrl.trim() }
        : {}),
    };

    try {
      await connectionsApi.create(payload);
      await refresh();
      closeComposer();
    } catch (error) {
      setComposerError(error instanceof Error ? error.message : "Failed to save connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMakeDefault = async (id: string) => {
    setPendingActionId(id);
    try {
      await connectionsApi.update(id, { isDefault: true });
      await refresh();
    } finally {
      setPendingActionId(null);
    }
  };

  const handleRotateToken = async () => {
    if (!rotatingConnection || !rotateToken.trim()) return;
    setIsRotating(true);
    setRotateError(null);
    try {
      await connectionsApi.update(rotatingConnection.id, { token: rotateToken.trim() });
      await refresh();
      setRotatingConnection(null);
      setRotateToken("");
    } catch (error) {
      setRotateError(error instanceof Error ? error.message : "Failed to update token.");
    } finally {
      setIsRotating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this connection? Trooper will stop using its PAT immediately.")) {
      return;
    }

    setPendingActionId(id);
    try {
      await connectionsApi.remove(id);
      await refresh();
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-fg-default)]">Connections</h2>
          <p className="mt-0.5 text-sm text-[var(--color-fg-subtle)]">
            Manage provider PATs used by Trooper
          </p>
        </div>
        <Button className="gap-2" onClick={openComposer}>
          <Plus className="h-4 w-4" />
          Add connection
        </Button>
      </div>

      {/* Error banner */}
      {composerError && !isComposerOpen && (
        <p className="rounded-lg border border-[var(--color-danger-fg)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger-emphasis)]">
          {composerError}
        </p>
      )}

      {/* Provider sections */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="trooper-shimmer h-12 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedConnections.map(({ provider, items }) => (
            <section key={provider} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--color-fg-subtle)]">
                  {providerIcon(provider)}
                </span>
                <h3 className="text-sm font-semibold text-[var(--color-fg-default)]">
                  {providerName(provider)}
                </h3>
                {items.length > 0 && (
                  <span className="rounded-full bg-[var(--color-canvas-subtle)] px-2 py-0.5 text-xs text-[var(--color-fg-muted)]">
                    {items.length}
                  </span>
                )}
              </div>
              <div className="overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-white">
                {items.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-[var(--color-fg-subtle)]">
                    No {providerName(provider)} PATs saved yet.
                  </p>
                ) : (
                  items.map((connection) => (
                    <ConnectionRow
                      key={connection.id}
                      connection={connection}
                      linkedRepos={repositories.filter((r) => r.connectionId === connection.id)}
                      onMakeDefault={handleMakeDefault}
                      onDelete={handleDelete}
                      onRotateToken={(c) => { setRotatingConnection(c); setRotateToken(""); setRotateError(null); }}
                      pendingActionId={pendingActionId}
                    />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {isComposerOpen && (
        <AddConnectionModal
          draft={modalDraft}
          onDraftChange={setModalDraft}
          onClose={closeComposer}
          onSubmit={handleCreateConnection}
          error={composerError}
          isSaving={isSaving}
        />
      )}

      {rotatingConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.28)] px-4 py-8 backdrop-blur-[2px]">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border-default)] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between border-b border-[var(--color-border-subtle)] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--color-fg-default)]">
                  Rotate Token
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-fg-muted)]">
                  Update the PAT for <span className="font-medium">{rotatingConnection.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRotatingConnection(null)}
                className="rounded-lg border border-[var(--color-border-default)] bg-white p-1.5 text-[var(--color-fg-subtle)] transition hover:text-[var(--color-fg-default)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
                  {providerIcon(rotatingConnection.provider)}
                </span>
                <span>{rotatingConnection.providerAccountName}</span>
                {rotatingConnection.tokenPreview && (
                  <span className="font-mono">Current: {rotatingConnection.tokenPreview}</span>
                )}
              </div>

              <label className="space-y-1.5 text-sm text-[var(--color-fg-default)]">
                <span className="font-medium">New personal access token</span>
                <input
                  type="password"
                  className={INPUT_CLASS}
                  value={rotateToken}
                  onChange={(e) => setRotateToken(e.target.value)}
                  placeholder={rotatingConnection.provider === GitProvider.GitHub ? "github_pat_..." : "Azure DevOps PAT"}
                  autoFocus
                />
              </label>

              {rotateError && (
                <div className="rounded-lg border border-[var(--color-danger-fg)] bg-[var(--color-danger-subtle)] px-3 py-2 text-sm text-[var(--color-danger-emphasis)]">
                  {rotateError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <Button variant="ghost" onClick={() => setRotatingConnection(null)} disabled={isRotating}>
                  Cancel
                </Button>
                <Button onClick={handleRotateToken} disabled={isRotating || !rotateToken.trim()}>
                  {isRotating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  Update token
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
