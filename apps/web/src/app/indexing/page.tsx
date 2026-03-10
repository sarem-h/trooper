"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Database,
  RefreshCcw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  ChevronRight,
  ChevronDown,
  Code2,
  Hash,
  Layers,
  Zap,
  HardDrive,
  FolderTree,
  FileCode2,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndexStatus } from "@trooper/shared";
import { indexing as indexingApi, pipeline as pipelineApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type Tab = "overview" | "explorer" | "search";

interface RepoInfo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
  lastSyncAt: string | null;
  indexedFiles: number;
}

interface IndexedFile {
  filePath: string;
  language: string;
  chunkCount: number;
}

interface FileChunk {
  chunkIndex: number;
  symbolName: string;
  content: string;
  tokenCount: number;
}

interface SearchResult {
  filePath: string;
  chunkIndex: number;
  symbolName: string;
  language: string;
  content: string;
  score: number;
}

// ─── Helpers ────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function buildFolderTree(files: IndexedFile[]) {
  const tree: Record<string, IndexedFile[]> = {};
  for (const f of files) {
    const parts = f.filePath.split("/");
    const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "(root)";
    if (!tree[folder]) tree[folder] = [];
    tree[folder].push(f);
  }
  return Object.entries(tree).sort(([a], [b]) => a.localeCompare(b));
}

function langColor(lang: string): string {
  const map: Record<string, string> = {
    typescript: "text-blue-600 bg-blue-600/10 border-blue-600/20",
    javascript: "text-yellow-600 bg-yellow-600/10 border-yellow-600/20",
    python: "text-green-600 bg-green-600/10 border-green-600/20",
    json: "text-orange-600 bg-orange-600/10 border-orange-600/20",
    css: "text-pink-600 bg-pink-600/10 border-pink-600/20",
    html: "text-red-600 bg-red-600/10 border-red-600/20",
    markdown: "text-gray-500 bg-gray-500/10 border-gray-500/20",
    yaml: "text-purple-600 bg-purple-600/10 border-purple-600/20",
  };
  return map[lang.toLowerCase()] ?? "text-[var(--color-fg-muted)] bg-[var(--color-canvas-subtle)] border-[var(--color-border-default)]";
}

// ─── Status Config ──────────────────────────────────────────

const statusConfig: Record<IndexStatus, { badge: "success" | "info" | "danger"; label: string; icon: typeof CheckCircle2; color: string }> = {
  [IndexStatus.Idle]: { badge: "success", label: "Synced", icon: CheckCircle2, color: "text-[var(--color-success-fg)]" },
  [IndexStatus.Syncing]: { badge: "info", label: "Syncing…", icon: Loader2, color: "text-[var(--color-info-fg)]" },
  [IndexStatus.Error]: { badge: "danger", label: "Error", icon: AlertCircle, color: "text-[var(--color-danger-fg)]" },
};

const TABS: Array<{ key: Tab; label: string; icon: typeof Database }> = [
  { key: "overview", label: "Overview", icon: Layers },
  { key: "explorer", label: "Explorer", icon: FolderTree },
  { key: "search", label: "Semantic Search", icon: Sparkles },
];

// ─── Page ───────────────────────────────────────────────────

export default function IndexingPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [indices, setIndices] = useState<any[]>([]);
  const [stats, setStats] = useState<{ documentCount: number; storageSize: number } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncingLabel, setSyncingLabel] = useState<string | null>(null);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");

  // Explorer tab
  const [files, setFiles] = useState<IndexedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [chunks, setChunks] = useState<FileChunk[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [fileFilter, setFileFilter] = useState("");

  // Search tab
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Derived
  const idx = indices.find((i: any) => i.repository === selectedRepo) ?? indices[0];
  const repo = selectedRepo || idx?.repository || repos[0]?.fullName || "";
  const branch = idx?.branch || repos.find((r) => r.fullName === repo)?.defaultBranch || "main";

  const loadData = useCallback(async () => {
    const [indexData, statsData, repoData] = await Promise.all([
      indexingApi.list().catch(() => []),
      indexingApi.stats().catch(() => null),
      pipelineApi.repos().catch(() => []),
    ]);
    setIndices(indexData);
    setStats(statsData);
    setRepos(repoData);
    if (!selectedRepo && repoData.length > 0) {
      setSelectedRepo(repoData[0].fullName);
    }
  }, [selectedRepo]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSync = async () => {
    if (!repo) return;
    setSyncing(true);
    setSyncingLabel('Queued…');
    try {
      const job = await indexingApi.sync({ repository: repo, branch });

      while (true) {
        const next = await indexingApi.job(job.id);
        if (next.status === 'queued') {
          setSyncingLabel('Queued…');
        } else if (next.status === 'running') {
          const progress = next.totalFiles > 0
            ? ` (${Math.min(next.processedFiles, next.totalFiles)}/${next.totalFiles})`
            : '';
          setSyncingLabel(next.currentFile ? `Syncing ${next.currentFile}${progress}` : `Syncing…${progress}`);
        } else if (next.status === 'completed') {
          break;
        } else {
          throw new Error(next.error ?? 'Indexing failed');
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      await loadData();
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncing(false);
      setSyncingLabel(null);
    }
  };

  // ─── Explorer ───────────────────────────────────────────

  const loadFiles = useCallback(async () => {
    if (!repo) return;
    setFilesLoading(true);
    try {
      const data = await indexingApi.files(repo, branch);
      setFiles(data);
      const folders = buildFolderTree(data);
      setExpandedFolders(new Set(folders.slice(0, 3).map(([f]) => f)));
    } catch { setFiles([]); }
    finally { setFilesLoading(false); }
  }, [repo, branch]);

  useEffect(() => { if (tab === "explorer") loadFiles(); }, [tab, loadFiles]);

  const loadChunks = async (filePath: string) => {
    setSelectedFile(filePath);
    try {
      const data = await indexingApi.fileChunks(repo, branch, filePath);
      setChunks(data);
    } catch { setChunks([]); }
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(folder) ? next.delete(folder) : next.add(folder);
      return next;
    });
  };

  // ─── Search ─────────────────────────────────────────────

  const handleSearch = async () => {
    if (!searchQuery.trim() || !repo) return;
    setSearching(true);
    try {
      const results = await indexingApi.search({ repository: repo, branch, query: searchQuery, topK: 20 });
      setSearchResults(results);
    } catch { setSearchResults([]); }
    finally { setSearching(false); }
  };

  // ─── Computed ───────────────────────────────────────────

  const config = idx
    ? (statusConfig[idx.status as IndexStatus] ?? statusConfig[IndexStatus.Idle])
    : statusConfig[IndexStatus.Idle];
  const StatusIcon = config.icon;
  const coverage = idx && idx.totalFiles > 0
    ? Math.round((idx.indexedFiles / idx.totalFiles) * 100)
    : 0;

  const filteredFiles = fileFilter
    ? files.filter((f) => f.filePath.toLowerCase().includes(fileFilter.toLowerCase()))
    : files;
  const folderTree = buildFolderTree(filteredFiles);

  return (
    <div className="space-y-6">
      {/* ─── Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-fg-default)] flex items-center gap-2">
            <Database className="h-5 w-5 text-[var(--color-accent-fg)]" />
            RAG Index
          </h1>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">
            Semantic code search — Azure AI Search with hybrid vector + BM25 + semantic reranker
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-inset)] px-2.5 py-1.5 text-xs text-[var(--color-fg-default)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-fg)]"
          >
            {repos.map((r) => (
              <option key={r.fullName} value={r.fullName}>{r.fullName}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSync} disabled={syncing}>
            <RefreshCcw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
            {syncing ? (syncingLabel ?? "Syncing…") : "Sync"}
          </Button>
        </div>
      </div>

      {/* ─── Tab Navigation ──────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-canvas-inset)] border border-[var(--color-border-default)]">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-[var(--color-canvas-default)] text-[var(--color-fg-default)] shadow-sm border border-[var(--color-border-default)]"
                  : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ─── OVERVIEW TAB ────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* Status hero */}
          <Card className="overflow-hidden">
            <div className={cn(
              "h-1",
              idx?.status === "syncing" ? "bg-[var(--color-info-fg)] animate-pulse" :
              idx?.status === "error" ? "bg-[var(--color-danger-fg)]" : "bg-[var(--color-success-fg)]",
            )} />
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    idx?.status === "syncing" ? "bg-[var(--color-info-fg)]/10" :
                    idx?.status === "error" ? "bg-[var(--color-danger-fg)]/10" : "bg-[var(--color-success-fg)]/10",
                  )}>
                    <StatusIcon className={cn("h-6 w-6", config.color, idx?.status === "syncing" && "animate-spin")} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-[var(--color-fg-default)]">{config.label}</h2>
                      <Badge variant={config.badge} className="text-xs">{config.label}</Badge>
                    </div>
                    <p className="text-sm text-[var(--color-fg-muted)] mt-0.5 flex items-center gap-1.5">
                      <GitBranch className="h-3 w-3" />
                      {repo ? `${repo} / ${branch}` : "No repository selected"}
                    </p>
                  </div>
                </div>
                {idx?.lastSyncAt && (
                  <div className="text-right">
                    <p className="text-xs text-[var(--color-fg-subtle)]">Last synced</p>
                    <p className="text-sm font-medium text-[var(--color-fg-default)]">{timeAgo(idx.lastSyncAt)}</p>
                    <p className="text-[10px] text-[var(--color-fg-subtle)] font-mono mt-0.5">{new Date(idx.lastSyncAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Coverage</p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-fg-default)]">{coverage}%</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-fg)]/10">
                    <Zap className="h-5 w-5 text-[var(--color-accent-fg)]" />
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[var(--color-border-muted)]">
                  <div className="h-full rounded-full bg-[var(--color-accent-fg)] transition-all duration-500" style={{ width: `${coverage}%` }} />
                </div>
                <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">{idx?.indexedFiles ?? 0} of {idx?.totalFiles ?? 0} files</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Chunks</p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-fg-default)]">{stats?.documentCount?.toLocaleString() ?? "0"}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-info-fg)]/10">
                    <Hash className="h-5 w-5 text-[var(--color-info-fg)]" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-[var(--color-fg-subtle)]">Code segments stored as vector embeddings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Storage</p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-fg-default)]">
                      {stats ? `${(stats.storageSize / 1024 / 1024).toFixed(1)}` : "0"}
                      <span className="text-base font-normal text-[var(--color-fg-muted)] ml-1">MB</span>
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-done-fg)]/10">
                    <HardDrive className="h-5 w-5 text-[var(--color-done-fg)]" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-[var(--color-fg-subtle)]">Azure AI Search index storage</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-fg-muted)] uppercase tracking-wider">Files</p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-fg-default)]">{idx?.indexedFiles?.toLocaleString() ?? "0"}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-success-fg)]/10">
                    <FileText className="h-5 w-5 text-[var(--color-success-fg)]" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-[var(--color-fg-subtle)]">Source files chunked and embedded</p>
              </CardContent>
            </Card>
          </div>

          {/* How it works + Repos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-[var(--color-accent-fg)]" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { step: "1", title: "Sync", desc: "Fetches repo tree via GitHub API, reads supported source files" },
                  { step: "2", title: "Chunk", desc: "AST-aware splitting into semantic units (functions, classes, blocks)" },
                  { step: "3", title: "Embed", desc: "Each chunk embedded with text-embedding-3-large (3072-dim vectors)" },
                  { step: "4", title: "Index", desc: "Stored in Azure AI Search with HNSW vector index + BM25 keyword index" },
                  { step: "5", title: "Query", desc: "Hybrid retrieval: vector similarity + keyword match + semantic reranker" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-fg)]/10 text-[10px] font-bold text-[var(--color-accent-fg)]">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-fg-default)]">{item.title}</p>
                      <p className="text-xs text-[var(--color-fg-muted)]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-[var(--color-accent-fg)]" />
                  Indexed Repositories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {repos.length === 0 ? (
                  <p className="text-xs text-[var(--color-fg-muted)]">No repositories available.</p>
                ) : repos.map((r) => {
                  const isSelected = r.fullName === repo;
                  return (
                    <button
                      key={r.fullName}
                      onClick={() => setSelectedRepo(r.fullName)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all",
                        isSelected
                          ? "bg-[var(--color-accent-fg)]/10 border border-[var(--color-accent-fg)]/20"
                          : "hover:bg-[var(--color-canvas-subtle)] border border-transparent",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <GitBranch className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-[var(--color-accent-fg)]" : "text-[var(--color-fg-muted)]")} />
                        <span className={cn("text-sm truncate", isSelected ? "font-medium text-[var(--color-fg-default)]" : "text-[var(--color-fg-muted)]")}>{r.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {r.indexed ? (
                          <Badge variant="success" className="text-[10px]">{r.indexedFiles} files</Badge>
                        ) : (
                          <Badge variant="warning" className="text-[10px]">Not indexed</Badge>
                        )}
                        {r.lastSyncAt && <span className="text-[10px] text-[var(--color-fg-subtle)]">{timeAgo(r.lastSyncAt)}</span>}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* No index CTA */}
          {!idx && repos.length > 0 && (
            <Card className="border-dashed">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-warning-subtle)]">
                  <AlertCircle className="h-6 w-6 text-[var(--color-warning-fg)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--color-fg-default)]">No index found for this repository</p>
                  <p className="text-xs text-[var(--color-fg-muted)] mt-1">
                    Click <strong>Sync</strong> to index <code className="text-[var(--color-accent-fg)] bg-[var(--color-canvas-subtle)] px-1 rounded">{repo}</code>.
                    The pipeline will auto-index when needed, but pre-indexing gives faster first runs.
                  </p>
                </div>
                <Button onClick={handleSync} disabled={syncing} className="gap-1.5 shrink-0">
                  {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                  {syncing ? "Syncing…" : "Index Now"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* ─── EXPLORER TAB ────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════ */}
      {tab === "explorer" && (
        <div className="space-y-4">
          {filesLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent-fg)]" />
              <p className="text-sm text-[var(--color-fg-muted)]">Loading indexed files…</p>
            </div>
          ) : files.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                <FolderTree className="h-10 w-10 text-[var(--color-fg-subtle)]" />
                <p className="text-sm text-[var(--color-fg-muted)]">No files indexed yet.</p>
                <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing} className="gap-1.5">
                  <RefreshCcw className="h-3.5 w-3.5" /> Sync now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Filter bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-fg-subtle)]" />
                  <input
                    type="text"
                    value={fileFilter}
                    onChange={(e) => setFileFilter(e.target.value)}
                    placeholder="Filter files…"
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-fg)]"
                  />
                </div>
                <span className="text-xs text-[var(--color-fg-muted)] shrink-0">
                  {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""} · {filteredFiles.reduce((s, f) => s + f.chunkCount, 0)} chunks
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Folder tree */}
                <Card className="lg:col-span-2">
                  <CardContent className="max-h-[600px] overflow-y-auto p-0">
                    {folderTree.map(([folder, folderFiles]) => {
                      const expanded = expandedFolders.has(folder);
                      return (
                        <div key={folder}>
                          <button
                            onClick={() => toggleFolder(folder)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] transition-colors"
                          >
                            {expanded ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
                            <FolderTree className="h-3 w-3 shrink-0 text-[var(--color-accent-fg)]" />
                            <span className="truncate">{folder}</span>
                            <span className="ml-auto text-[10px] text-[var(--color-fg-subtle)]">{folderFiles.length}</span>
                          </button>
                          {expanded && folderFiles.map((f) => {
                            const fileName = f.filePath.split("/").pop() ?? f.filePath;
                            return (
                              <button
                                key={f.filePath}
                                onClick={() => loadChunks(f.filePath)}
                                className={cn(
                                  "w-full flex items-center gap-2 pl-8 pr-3 py-1.5 text-xs transition-colors",
                                  selectedFile === f.filePath
                                    ? "bg-[var(--color-accent-fg)]/10 text-[var(--color-fg-default)]"
                                    : "text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)]",
                                )}
                              >
                                <FileCode2 className="h-3 w-3 shrink-0" />
                                <span className="truncate">{fileName}</span>
                                <span className={cn("ml-auto text-[10px] rounded px-1 py-0.5 border", langColor(f.language))}>{f.language}</span>
                                <span className="text-[10px] text-[var(--color-fg-subtle)]">{f.chunkCount}ch</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Chunk viewer */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-[var(--color-accent-fg)]" />
                      {selectedFile ? (
                        <span className="font-mono text-xs truncate">{selectedFile}</span>
                      ) : "Select a file to explore"}
                      {selectedFile && <Badge variant="default" className="ml-auto text-[10px]">{chunks.length} chunks</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[550px] overflow-y-auto space-y-3">
                    {!selectedFile ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--color-fg-subtle)]">
                        <FileCode2 className="h-10 w-10" />
                        <p className="text-sm">Click a file in the tree to view its chunks</p>
                      </div>
                    ) : chunks.length === 0 ? (
                      <div className="flex items-center gap-2 py-4 text-sm text-[var(--color-fg-muted)]">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading chunks…
                      </div>
                    ) : chunks.map((c) => (
                      <div key={c.chunkIndex} className="rounded-lg border border-[var(--color-border-default)] overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-canvas-inset)] border-b border-[var(--color-border-muted)]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[var(--color-fg-subtle)]">#{c.chunkIndex}</span>
                            {c.symbolName && <span className="text-xs font-mono font-medium text-[var(--color-accent-fg)]">{c.symbolName}</span>}
                          </div>
                          <span className="text-[10px] text-[var(--color-fg-subtle)]">{c.tokenCount} tokens</span>
                        </div>
                        <pre className="text-[11px] text-[var(--color-fg-muted)] leading-relaxed overflow-x-auto max-h-40 p-3 whitespace-pre-wrap font-mono">{c.content}</pre>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* ─── SEMANTIC SEARCH TAB ─────────────────────────── */}
      {/* ═══════════════════════════════════════════════════ */}
      {tab === "search" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-accent-fg)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Ask anything about the codebase… e.g. 'how does the pipeline handle retries?'"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[var(--color-border-default)] bg-[var(--color-canvas-default)] text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-fg)] focus:border-transparent"
                  />
                </div>
                <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()} className="gap-1.5 px-5">
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
              <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
                Hybrid retrieval: vector similarity (text-embedding-3-large) + BM25 keyword matching + semantic reranker
              </p>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--color-fg-default)]">{searchResults.length} results</p>
                <p className="text-xs text-[var(--color-fg-muted)]">Ranked by relevance</p>
              </div>
              {searchResults.map((r, i) => (
                <Card key={`${r.filePath}-${r.chunkIndex}`} className="overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-canvas-inset)] border-b border-[var(--color-border-muted)]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-fg)]/10 text-[10px] font-bold text-[var(--color-accent-fg)]">{i + 1}</span>
                      <FileCode2 className="h-3.5 w-3.5 text-[var(--color-fg-muted)] shrink-0" />
                      <span className="text-sm font-mono text-[var(--color-fg-default)] truncate">{r.filePath}</span>
                      {r.symbolName && <Badge variant="info" className="text-[10px] shrink-0">{r.symbolName}</Badge>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-[10px] rounded px-1.5 py-0.5 border", langColor(r.language))}>{r.language}</span>
                      <span className="text-[10px] font-mono text-[var(--color-accent-fg)] font-medium">{(r.score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <pre className="text-[11px] text-[var(--color-fg-muted)] leading-relaxed overflow-x-auto max-h-48 p-4 whitespace-pre-wrap font-mono">{r.content}</pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchResults.length === 0 && !searching && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <Sparkles className="h-10 w-10 text-[var(--color-fg-subtle)]" />
                <p className="text-sm text-[var(--color-fg-muted)]">
                  {searchQuery ? "No results found. Try a different query or sync the index first." : "Search your indexed codebase using natural language queries."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
