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
  ServerCog,
  ShieldCheck,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        <div className="flex items-start justify-between border-b border-[var(--color-border-subtle)] px-6 py-5">
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
          <div className="grid gap-4 px-6 py-6 sm:grid-cols-2">
            {[GitProvider.GitHub, GitProvider.AzureRepos].map((provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => onDraftChange(buildDraft(provider))}
                className="rounded-2xl border border-[var(--color-border-default)] bg-white p-5 text-left shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent-fg)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center gap-3 text-[var(--color-fg-default)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
                    {providerIcon(provider)}
                  </span>
                  <div>
                    <p className="text-base font-semibold">{providerName(provider)}</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">
                      {provider === GitProvider.GitHub
                        ? "Name + PAT. Trooper will detect the account automatically."
                        : "Name + org URL + PAT for Azure DevOps organizations."}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 px-6 py-6">
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-default)] bg-white px-4 py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
                {providerIcon(draft.provider)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--color-fg-default)]">
                  {providerName(draft.provider)}
                </p>
                <p className="text-xs text-[var(--color-fg-muted)]">
                  {draft.provider === GitProvider.GitHub
                    ? "Enter a label and PAT. Trooper will fill in the account details for you."
                    : "Enter a label, Azure DevOps organization URL, and PAT."}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onDraftChange(null)}>
                Change
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-[var(--color-fg-default)]">
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
                <label className="space-y-2 text-sm text-[var(--color-fg-default)]">
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
                <div className="rounded-2xl border border-[var(--color-border-default)] bg-white px-4 py-3 text-sm text-[var(--color-fg-muted)]">
                  Trooper will read the GitHub account name and scopes from the
                  PAT automatically.
                </div>
              )}
            </div>

            <label className="space-y-2 text-sm text-[var(--color-fg-default)]">
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

            <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border-default)] bg-white px-4 py-3 text-sm text-[var(--color-fg-default)]">
              <input
                type="checkbox"
                checked={draft.isDefault}
                onChange={(event) =>
                  onDraftChange({ ...draft, isDefault: event.target.checked })
                }
                className="h-4 w-4 rounded border-[var(--color-border-default)]"
              />
              Use this as the default {providerName(draft.provider)} PAT
            </label>

            {error && (
              <div className="rounded-2xl border border-[var(--color-danger-fg)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger-emphasis)]">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
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

function ConnectionCard({
  connection,
  linkedRepos,
  onMakeDefault,
  onDelete,
  pendingActionId,
}: {
  connection: Connection;
  linkedRepos: LinkedRepository[];
  onMakeDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  pendingActionId: string | null;
}) {
  const status = statusConfig(connection.status);
  const StatusIcon = status.icon;
  const days = daysUntil(connection.expiresAt);
  const isBusy = pendingActionId === connection.id;

  return (
    <Card className="overflow-hidden rounded-2xl border-[var(--color-border-default)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(240,243,247,0.92))] shadow-[0_12px_36px_rgba(15,23,42,0.07)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-subtle)] text-[var(--color-accent-emphasis)]">
              {providerIcon(connection.provider)}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-[var(--color-fg-default)]">
                  {connection.name}
                </h3>
                {connection.isDefault && (
                  <Badge variant="info" className="gap-1">
                    <Star className="h-3 w-3" />
                    Default
                  </Badge>
                )}
                <Badge variant={status.variant} className="gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>

              <p className="text-sm text-[var(--color-fg-muted)]">
                {providerName(connection.provider)} &middot; {connection.providerAccountName}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-[var(--color-fg-subtle)]">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                  <KeyRound className="h-3.5 w-3.5" />
                  {connection.tokenPreview ?? "PAT stored"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                  <Link2 className="h-3.5 w-3.5" />
                  {connection.repositoryCount ?? linkedRepos.length} linked repos
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {connection.authMethod === ConnectionAuthMethod.PAT ? "PAT" : connection.authMethod}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {!connection.isDefault && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMakeDefault(connection.id)}
                disabled={isBusy}
              >
                {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
                Make default
              </Button>
            )}

            <a
              href={connection.providerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-2 rounded-md border border-[var(--color-border-default)] bg-white px-3 text-xs font-medium text-[var(--color-fg-default)] transition hover:bg-[var(--color-canvas-subtle)]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </a>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(connection.id)}
              disabled={isBusy}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>

        {connection.scopes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {connection.scopes.map((scope) => (
              <span
                key={scope}
                className="rounded-full border border-[var(--color-border-subtle)] bg-white px-2.5 py-1 text-[11px] font-mono text-[var(--color-fg-subtle)]"
              >
                {scope}
              </span>
            ))}
          </div>
        )}

        {linkedRepos.length > 0 && (
          <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white/80 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
              Linked repositories
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {linkedRepos.slice(0, 5).map((repo) => (
                <span
                  key={repo.id}
                  className="rounded-full bg-[var(--color-canvas-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)]"
                >
                  {repo.fullName}
                </span>
              ))}
              {linkedRepos.length > 5 && (
                <span className="rounded-full bg-[var(--color-canvas-subtle)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)]">
                  +{linkedRepos.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {days !== null && days <= 30 && (
          <div className="rounded-2xl border border-[var(--color-warning-fg)] bg-[var(--color-warning-subtle)] px-4 py-3 text-sm text-[var(--color-warning-emphasis)]">
            {days <= 0
              ? "This token is expired and should be rotated."
              : `This token expires in ${days} day${days === 1 ? "" : "s"}.`}
          </div>
        )}
      </CardContent>
    </Card>
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

  const stats = useMemo(() => {
    const defaults = connections.filter((connection) => connection.isDefault).length;
    const githubRepos = repositories.filter((repo) => repo.provider === GitProvider.GitHub).length;
    const azureRepos = repositories.filter((repo) => repo.provider === GitProvider.AzureRepos).length;

    return [
      { label: "Saved PATs", value: connections.length, icon: KeyRound },
      { label: "Default connections", value: defaults, icon: Star },
      { label: "GitHub repos linked", value: githubRepos, icon: Link2 },
      { label: "Azure repos linked", value: azureRepos, icon: ServerCog },
    ];
  }, [connections, repositories]);

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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="rounded-2xl border-[var(--color-border-default)] bg-[linear-gradient(135deg,_rgba(0,120,212,0.12),_rgba(255,255,255,0.92)_45%,_rgba(240,243,247,0.96))] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-emphasis)]">
                  Connection Control
                </p>
                <h2 className="text-2xl font-semibold text-[var(--color-fg-default)]">
                  PATs live here now
                </h2>
                <p className="text-sm leading-6 text-[var(--color-fg-muted)]">
                  Add multiple GitHub and Azure DevOps PATs, pick a default per
                  provider, and let linked repositories inherit the right
                  credentials.
                </p>
              </div>

              <Button className="gap-2" onClick={openComposer}>
                <Plus className="h-4 w-4" />
                Add connection
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--color-border-subtle)] bg-white/85 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-fg-muted)]">
                      {stat.label}
                    </span>
                    <stat.icon className="h-4 w-4 text-[var(--color-accent-emphasis)]" />
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-[var(--color-fg-default)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[var(--color-border-default)] bg-[linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(240,243,247,0.98))] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-3 text-[var(--color-fg-default)]">
              <ShieldCheck className="h-5 w-5 text-[var(--color-accent-emphasis)]" />
              <h3 className="text-base font-semibold">Useful rules</h3>
            </div>
            <div className="space-y-3 text-sm text-[var(--color-fg-muted)]">
              <p>GitHub only needs a name and PAT. Trooper inspects the PAT and fills in the account automatically.</p>
              <p>Azure DevOps PATs need an organization URL so linked repos know which org to use.</p>
              <p>Linked repositories use their assigned connection first. If they do not have one, Trooper falls back to the default PAT for that provider.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {composerError && !isComposerOpen && (
        <div className="rounded-2xl border border-[var(--color-danger-fg)] bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger-emphasis)]">
          {composerError}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="trooper-shimmer h-56 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedConnections.map(({ provider, items }) => (
            <section key={provider} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-fg-default)]">
                    {providerName(provider)}
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    {items.length > 0
                      ? `${items.length} saved connection${items.length === 1 ? "" : "s"}`
                      : `No ${providerName(provider)} PATs saved yet.`}
                  </p>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--color-border-default)] bg-white/70 px-5 py-6 text-sm text-[var(--color-fg-muted)]">
                  Add a {providerName(provider)} PAT so Trooper can work against external repositories on this provider.
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {items.map((connection) => (
                    <ConnectionCard
                      key={connection.id}
                      connection={connection}
                      linkedRepos={repositories.filter((repo) => repo.connectionId === connection.id)}
                      onMakeDefault={handleMakeDefault}
                      onDelete={handleDelete}
                      pendingActionId={pendingActionId}
                    />
                  ))}
                </div>
              )}
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
    </div>
  );
}
