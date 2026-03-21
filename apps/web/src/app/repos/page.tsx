"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FolderGit2,
  Lock,
  Globe,
  Search,
  Loader2,
  Database,
  GitBranch,
  Star,
  Circle,
  FolderOpen,
  Clock,
  Zap,
  CircleDot,
  GitPullRequest,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pipeline as pipelineApi } from "@/lib/api";
import { cn } from "@/lib/utils";

// ─── Types & Metadata ───────────────────────────────

interface RepoInfo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  indexed: boolean;
  indexStatus: string | null;
  lastSyncAt: string | null;
  indexedFiles: number;
  description?: string;
  language?: string;
  stars?: number;
  openIssuesCount?: number;
  ownerAvatarUrl?: string;
  provider: string;
}

interface DisplayRepo extends RepoInfo {
  source: "local" | "github";
}

const PROVIDER_META: Record<string, { label: string; color: string; background: string; icon: string }> = {
  github:      { label: 'GitHub', color: '#7c3aed', background: 'rgba(124, 58, 237, 0.1)', icon: '' },
  gitlab:      { label: 'GitLab', color: '#fc6d26', background: 'rgba(252, 109, 38, 0.1)', icon: '' },
  bitbucket:   { label: 'Bitbucket', color: '#0052cc', background: 'rgba(0, 82, 204, 0.1)', icon: '' },
  azure:       { label: 'Azure', color: '#0078d4', background: 'rgba(0, 120, 212, 0.1)', icon: '' },
  azure_repos: { label: 'Azure DevOps', color: '#0078d4', background: 'rgba(0, 120, 212, 0.1)', icon: '' },
};

function ProviderBadge({ provider }: { provider: string }) {
  const meta = PROVIDER_META[provider] ?? {
    label: provider,
    color: 'var(--color-fg-muted)',
    background: 'var(--color-canvas-subtle)',
    icon: '',
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium leading-none"
      style={{
        color: meta.color,
        background: meta.background,
      }}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      <span>{meta.label}</span>
    </span>
  );
}

function RepoSourceIcon({ provider, private: isPrivate }: { provider: string; private: boolean }) {
  const meta = PROVIDER_META[provider] ?? {
    label: provider,
    color: 'var(--color-fg-muted)',
    background: 'var(--color-canvas-subtle)',
    icon: '',
  };

  if (provider === "azure_repos" || provider === "azure") {
    return (
      <span
        className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border"
        style={{
          color: meta.color,
          borderColor: `${meta.color}35`,
          background: `${meta.color}10`,
        }}
        title={meta.label}
      >
        <span className="grid h-2.5 w-2.5 grid-cols-2 gap-[1px]">
          <span className="rounded-[1px] bg-current" />
          <span className="rounded-[1px] bg-current opacity-90" />
          <span className="rounded-[1px] bg-current opacity-90" />
          <span className="rounded-[1px] bg-current" />
        </span>
        {isPrivate && <Lock className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-canvas-default)] p-[1px] text-[var(--color-attention-fg)]" />}
      </span>
    );
  }

  return isPrivate
    ? <Lock className="h-4 w-4 shrink-0 text-[var(--color-attention-fg)]" />
    : <FolderGit2 className="h-4 w-4 shrink-0 text-[var(--color-accent-fg)]" />;
}

function SourceBadge({ source }: { source: "local" | "github" }) {
  return source === "local" ? (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide border border-[var(--color-success-fg)]/30 text-[var(--color-success-fg)] bg-[var(--color-success-subtle)]">
      Yours
    </span>
  ) : (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide border border-[var(--color-fg-subtle)]/30 text-[var(--color-fg-subtle)] bg-[var(--color-canvas-inset)]">
      GitHub
    </span>
  );
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5", Java: "#b07219",
  Go: "#00ADD8", Rust: "#dea584", "C#": "#178600", "C++": "#f34b7d", C: "#555555",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c", Vue: "#41b883", Svelte: "#ff3e00",
  Scala: "#c22d40",
};

// ─── Timing Logs ────────────────────────────────────

const LOG_PREFIX = '%c[GitExplorer]';
const LOG_STYLE = 'color:#0078d4;font-weight:bold';
const t0 = performance.now();
function logTiming(tag: string, ...args: unknown[]) {
  const elapsed = (performance.now() - t0).toFixed(0);
  console.log(`${LOG_PREFIX} %c+${elapsed}ms %c${tag}`, LOG_STYLE, 'color:#8b949e', 'color:inherit', ...args);
}
logTiming('module loaded');

// ─── Lazy-Loaded Enrichment Cells ───────────────────

// Parallel-lane enrichment queue: 3 concurrent requests, dedup via pending map
const MAX_CONCURRENCY = 3;
const pendingPromises = new Map<string, Promise<any>>();
let activeCount = 0;
let enrichSeq = 0;
const waitQueue: Array<() => void> = [];

function enqueue<T>(label: string, key: string, fn: () => Promise<T>): Promise<T> {
  if (pendingPromises.has(key)) {
    logTiming(`enqueue [${label}] — returning existing promise`);
    return pendingPromises.get(key) as Promise<T>;
  }

  const seq = ++enrichSeq;
  logTiming(`enqueue #${seq} [${label}] — queued (active=${activeCount}, waiting=${waitQueue.length})`);

  const acquire = (): Promise<void> => {
    if (activeCount < MAX_CONCURRENCY) {
      activeCount++;
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => waitQueue.push(resolve));
  };
  const release = () => {
    activeCount--;
    if (waitQueue.length > 0) {
      activeCount++;
      waitQueue.shift()!();
    }
  };

  const promise = acquire().then(() => {
    logTiming(`enqueue #${seq} [${label}] — request fired (active=${activeCount})`);
    const start = performance.now();
    return fn().then(
      (res) => { logTiming(`enqueue #${seq} [${label}] — response OK (${(performance.now() - start).toFixed(0)}ms)`); return res; },
      (err) => { logTiming(`enqueue #${seq} [${label}] — FAILED (${(performance.now() - start).toFixed(0)}ms)`, err); throw err; },
    );
  }).finally(() => {
    release();
    // Intentionally keep in pendingPromises for cache-like behavior, 
    // or we can remove it so failures can be retried. Let's remove it after completion so it depends on component caches.
    pendingPromises.delete(key);
  });

  pendingPromises.set(key, promise);
  return promise;
}

const activityCache = new Map<string, { openIssues: number; openPRs: number }>();

function ActivityCell({ repoFullName, provider }: { repoFullName: string, provider?: string }) {
  const [data, setData] = useState(activityCache.get(repoFullName) ?? null);
  const [loading, setLoading] = useState(!activityCache.has(repoFullName));

  useEffect(() => {
    if (activityCache.has(repoFullName)) {
      logTiming(`ActivityCell [${repoFullName}] — cache hit`);
      return;
    }
    const key = `activity:${repoFullName}`;
    logTiming(`ActivityCell [${repoFullName}] — mount, scheduling fetch`);
    let cancelled = false;
    const p = enqueue(key, key, () => pipelineApi.getRepoActivity(repoFullName, provider));
    p.then((d) => {
        activityCache.set(repoFullName, d);
        if (!cancelled) setData(d);
        logTiming(`ActivityCell [${repoFullName}] — rendered`, d);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [repoFullName]);

  if (loading) {
    return (
      <div className="flex max-w-full items-center gap-3 overflow-hidden">
        <div className="h-4 w-7 rounded overflow-hidden relative bg-[var(--color-canvas-inset)] border border-[var(--color-border-default)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent" />
        <div className="h-4 w-7 rounded overflow-hidden relative bg-[var(--color-canvas-inset)] border border-[var(--color-border-default)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent" />
      </div>
    );
  }

  if (!data) return <span className="text-[12px] text-[var(--color-fg-muted)]">—</span>;

  return (
      <div className="inline-flex max-w-full items-center overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] align-middle">
        <span className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-[var(--color-danger-fg)]" title={`${data.openIssues} open issues`}>
          <CircleDot className="h-[14px] w-[14px]" />
          <span className="tabular-nums font-medium">{data.openIssues}</span>
        </span>
        <span className="h-4 w-px bg-[var(--color-border-default)]" aria-hidden="true" />
        <span className="flex items-center gap-1.5 px-2 py-1 text-[12px] text-[var(--color-success-fg)]" title={`${data.openPRs} open pull requests`}>
          <GitPullRequest className="h-[14px] w-[14px]" />
          <span className="tabular-nums font-medium">{data.openPRs}</span>
        </span>
    </div>
  );
}

const languagesCache = new Map<string, Record<string, number>>();

function LanguagesCell({ repoFullName, primaryLanguage, provider }: { repoFullName: string, primaryLanguage?: string, provider?: string }) {
  const [langs, setLangs] = useState<Record<string, number> | null>(languagesCache.get(repoFullName) ?? null);

  useEffect(() => {
    if (languagesCache.has(repoFullName)) {
      setLangs(languagesCache.get(repoFullName)!);
      logTiming(`LanguagesCell [${repoFullName}] — cache hit`);
      return;
    }
    
    // Fallback block if un-cached
    logTiming(`LanguagesCell [${repoFullName}] — mount, scheduling fetch`);
    let cancelled = false;
    const key = `langs:${repoFullName}`;
    const p = enqueue(key, key, () => pipelineApi.getRepoLanguages(repoFullName, provider));
    p.then((d) => {
        languagesCache.set(repoFullName, d);
        if (!cancelled) setLangs(d);
        logTiming(`LanguagesCell [${repoFullName}] — rendered`, Object.keys(d));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [repoFullName]);

  // While loading, show modern gradient blocks if no primary language
  if (!langs && !primaryLanguage) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-3 rounded-full bg-[var(--color-canvas-inset)] border border-[var(--color-border-default)] overflow-hidden relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent" />
        <div className="h-3 w-12 rounded bg-[var(--color-canvas-inset)] border border-[var(--color-border-default)] overflow-hidden relative before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-black/5 before:to-transparent" />
      </div>
    );
  }

  // While loading, show the primary language from the repo list response
  const displayLangs = langs
    ? Object.keys(langs).slice(0, 3)
    : primaryLanguage ? [primaryLanguage] : [];
  const visibleLangs = displayLangs.slice(0, 2);
  const hiddenLangCount = Math.max(displayLangs.length - visibleLangs.length, 0);

  if (displayLangs.length === 0) {
    return <span className="text-[12px] text-[var(--color-fg-muted)]">—</span>;
  }

  return (
    <div className="inline-flex max-w-full min-w-0 items-center overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[12px] text-[var(--color-fg-default)] align-middle">
      {visibleLangs.map((lang, index) => (
        <span
          key={lang}
          className={cn(
            "flex min-w-0 items-center gap-1.5 px-2 py-1",
            index > 0 && "border-l border-[var(--color-border-default)]"
          )}
          title={lang}
        >
          <Circle className="h-2 w-2 shrink-0" fill={LANG_COLORS[lang] ?? "#7e8b9a"} stroke={LANG_COLORS[lang] ?? "#7e8b9a"} />
          <span className="max-w-[5.5rem] truncate">{lang}</span>
        </span>
      ))}
      {hiddenLangCount > 0 && (
        <span className="border-l border-[var(--color-border-default)] px-2 py-1 text-[11px] font-medium text-[var(--color-fg-muted)]" title={displayLangs.slice(visibleLangs.length).join(", ")}>
          +{hiddenLangCount}
        </span>
      )}
    </div>
  );
}

// ─── Recently Viewed (localStorage) ─────────────────

const RECENTLY_VIEWED_KEY = "trooper:recently-viewed-repos";
const MAX_RECENTLY_VIEWED = 5;

function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addRecentlyViewed(fullName: string): void {
  const list = getRecentlyViewed().filter((n) => n !== fullName);
  list.unshift(fullName);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list.slice(0, MAX_RECENTLY_VIEWED)));
}

// ─── Default Branch Badge ───────────────────────────

function DefaultBranchBadge({ branch }: { branch: string }) {
  return (
    <div className="inline-flex max-w-full items-center gap-1.5 overflow-hidden rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2 py-1 text-[11px] text-[var(--color-fg-muted)] align-middle">
      <GitBranch className="h-3 w-3 shrink-0" />
      <span className="truncate leading-none">{branch}</span>
    </div>
  );
}

// ─── Filter Icon Map ────────────────────────────────

const FILTER_META: Record<string, { label: string; Icon: typeof FolderGit2 }> = {
  all:     { label: "All Repositories", Icon: FolderGit2 },
  public:  { label: "Public", Icon: Globe },
  private: { label: "Private", Icon: Lock },
  indexed: { label: "Indexed", Icon: Zap },
};



// ─── Main Page: Git Explorer ────────────────────────

type ViewNodeId = "all" | "public" | "private" | "indexed" | `owner:${string}`;

export default function ReposPage() {
  const router = useRouter();

  // Data State
  const [myRepos, setMyRepos] = useState<RepoInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation State
  const [currentNode, setCurrentNode] = useState<ViewNodeId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Unified Search State
  const [githubResults, setGithubResults] = useState<RepoInfo[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [githubPage, setGithubPage] = useState(1);
  const [hasMoreGithub, setHasMoreGithub] = useState(false);

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  useEffect(() => { setRecentlyViewed(getRecentlyViewed()); }, []);

  // ─── Data Fetching ───────────────────────────────

  const fetchRepos = useCallback(() => {
    logTiming('fetchRepos — request initiated');
    const start = performance.now();
    setLoading(true);
    pipelineApi.repos()
      .then((data) => {
        logTiming(`fetchRepos — response arrived, ${data.length} repos (${(performance.now() - start).toFixed(0)}ms)`);
        setMyRepos(data);
      })
      .catch((err) => { logTiming('fetchRepos — FAILED', err); console.error(err); })
      .finally(() => { setLoading(false); logTiming('fetchRepos — loading complete'); });
  }, []);

  useEffect(() => { logTiming('ReposPage — initial mount'); fetchRepos(); }, [fetchRepos]);

  // Debounce search for GitHub API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedQuery("");
      setGithubResults([]);
      setGithubPage(1);
      setHasMoreGithub(false);
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setGithubPage(1);
      setGithubResults([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch GitHub results when debounced query or page changes
  useEffect(() => {
    if (!debouncedQuery) return;
    logTiming(`githubSearch — request initiated q="${debouncedQuery}" page=${githubPage}`);
    const start = performance.now();
    setGithubLoading(true);
    pipelineApi.repos(debouncedQuery, githubPage)
      .then((data) => {
        logTiming(`githubSearch — response arrived, ${data.length} results (${(performance.now() - start).toFixed(0)}ms)`);
        setGithubResults(prev => githubPage === 1 ? data : [...prev, ...data]);
        setHasMoreGithub(data.length === 10);
      })
      .catch((err) => { logTiming('githubSearch — FAILED', err); console.error(err); })
      .finally(() => { setGithubLoading(false); logTiming(`githubSearch — loading complete (${(performance.now() - start).toFixed(0)}ms)`); });
  }, [debouncedQuery, githubPage]);

  // ─── Derived Data ────────────────────────────────

  const owners = useMemo(() => {
    const set = new Set<string>();
    myRepos.forEach(r => set.add(r.fullName.split('/')[0]));
    return Array.from(set).sort();
  }, [myRepos]);

  const isSearchActive = searchQuery.trim().length > 0;

  const displayRepos: DisplayRepo[] = useMemo(() => {
    if (isSearchActive) {
      // Unified search: local filtered + GitHub results, deduplicated (local wins)
      const q = searchQuery.toLowerCase();
      const localMatches: DisplayRepo[] = myRepos
        .filter(r => r.fullName.toLowerCase().includes(q) || r.language?.toLowerCase().includes(q))
        .map(r => ({ ...r, source: "local" as const }));

      const localKeys = new Set(localMatches.map(r => r.fullName));
      const remoteMatches: DisplayRepo[] = githubResults
        .filter(r => !localKeys.has(r.fullName))
        .map(r => ({ ...r, source: "github" as const }));

      return [...localMatches, ...remoteMatches]; // ordering preserved; groups rendered separately below
    }

    let list = myRepos;
    if (currentNode === "public")  list = list.filter(r => !r.private);
    if (currentNode === "private") list = list.filter(r => r.private);
    if (currentNode === "indexed") list = list.filter(r => r.indexed);
    if (currentNode.startsWith("owner:")) {
      const target = currentNode.replace("owner:", "");
      list = list.filter(r => r.fullName.split('/')[0] === target);
    }

    return list.map(r => ({ ...r, source: "local" as const }));
  }, [currentNode, myRepos, githubResults, searchQuery, isSearchActive]);

  const handleNavigate = (repo: RepoInfo) => {
    addRecentlyViewed(repo.fullName);
    setRecentlyViewed(getRecentlyViewed());
    router.push(`/repos/${repo.fullName}?provider=${repo.provider}`);
  };

  // ─── Status Bar Label ────────────────────────────

  const statusLabel = useMemo(() => {
    if (currentNode.startsWith("owner:")) return currentNode.replace("owner:", "");
    return FILTER_META[currentNode]?.label ?? "All Repositories";
  }, [currentNode]);

  const StatusIcon = currentNode.startsWith("owner:")
    ? FolderOpen
    : (FILTER_META[currentNode]?.Icon ?? FolderGit2);

  // ─── Sidebar Nav Item ────────────────────────────

  const NavItem = ({ id, label, icon: Icon, count }: { id: ViewNodeId; label: string; icon: typeof FolderGit2; count?: number }) => {
    const active = currentNode === id;
    return (
      <div
        onClick={() => {
          setCurrentNode(id);
          setSearchQuery("");
        }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 cursor-default text-[13px] rounded-[3px] border border-transparent mx-1",
          active
            ? "bg-[var(--color-accent-subtle)] border-[var(--color-accent-emphasis)] text-[var(--color-accent-fg)]"
            : "text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)] hover:border-[var(--color-border-default)]"
        )}
      >
        <Icon className="h-4 w-4 text-[var(--color-fg-muted)] shrink-0" />
        <span className="truncate flex-1 leading-tight">{label}</span>
        {count !== undefined && (
          <span className="text-[11px] text-[var(--color-fg-muted)] tabular-nums">{count}</span>
        )}
      </div>
    );
  };

  // ─── Derived search groups ────────────────────────

  const localSearchMatches = useMemo(() =>
    isSearchActive ? displayRepos.filter(r => r.source === "local") : [],
  [displayRepos, isSearchActive]);

  const remoteSearchMatches = useMemo(() =>
    isSearchActive ? displayRepos.filter(r => r.source === "github") : [],
  [displayRepos, isSearchActive]);

  // ─── Table column count (dynamic for source column) ─

  const colCount = isSearchActive ? 6 : 6;

  return (
    <div data-flush-layout className="flex flex-col h-full border-t border-[var(--color-border-default)] overflow-hidden bg-[var(--color-canvas-default)] font-sans select-none">

      {/* ─── Toolbar ────────────────────────────────── */}
      <div className="border-b border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-4 pt-3 pb-3 shrink-0">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center h-10 px-3 bg-[var(--color-canvas-subtle)] border border-[var(--color-border-default)] rounded-lg text-[13px] text-[var(--color-fg-default)] shadow-sm gap-2 min-w-0 shrink-0">
            <StatusIcon className="h-3.5 w-3.5 text-[var(--color-fg-muted)] shrink-0" />
            <span className="truncate leading-tight">{statusLabel}</span>
            <span className="text-[var(--color-fg-muted)]">·</span>
            <span className="text-[var(--color-fg-muted)] tabular-nums whitespace-nowrap">{displayRepos.length} repos</span>
          </div>

          <div className="relative flex-1 min-w-0">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4.5 w-4.5 text-[var(--color-fg-muted)]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories, owners, and GitHub results..."
              className="h-10 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] pl-11 pr-28 text-[13px] text-[var(--color-fg-default)] placeholder-[var(--color-fg-muted)] shadow-sm transition-[border-color,box-shadow,background-color] focus:outline-none focus:border-[var(--color-accent-emphasis)] focus:ring-4 focus:ring-[color:rgba(0,120,212,0.12)]"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
              {searchQuery.trim().length > 0 && (
                <span className="hidden sm:inline-flex items-center rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-fg-muted)]">
                  {githubLoading ? "Searching GitHub..." : "Local + GitHub"}
                </span>
              )}
              {githubLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-[var(--color-fg-muted)]" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Left Sidebar + Main Content ──────────────── */}
      <div className="relative flex flex-1 min-h-0">

        <div className="pointer-events-none absolute left-0 right-0 top-[32px] z-20 border-b border-[var(--color-border-default)]" />

        {/* Sidebar Navigation */}
        <div className="w-56 flex-shrink-0 bg-[var(--color-canvas-default)] border-r border-[var(--color-border-default)] overflow-y-auto flex flex-col gap-2.5">

          <div className="flex h-[32px] items-center px-3 select-none shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative h-4.5 w-4.5 rounded-[5px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,250,0.98))] ring-1 ring-black/5">
                <div className="absolute left-[3px] top-[3px] h-1.5 w-1.5 rounded-[2px] bg-[var(--color-accent-emphasis)]" />
                <div className="absolute bottom-[3px] right-[3px] h-1.5 w-1.5 rounded-[2px] bg-[var(--color-success-emphasis)]" />
                <div className="absolute left-[5px] top-[8px] h-px w-2 rotate-[-38deg] bg-[var(--color-fg-muted)]" />
              </div>
              <div className="min-w-0 leading-none">
                <div className="truncate text-[11px] font-semibold text-[var(--color-fg-default)]">
                  Git Explorer
                </div>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 pb-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
                <Clock className="h-3 w-3" />
                Recently Viewed
              </div>
              {recentlyViewed.map((fullName) => {
                const name = fullName.split('/').pop() ?? fullName;
                return (
                  <div
                    key={fullName}
                    onClick={() => {
                      const repo = myRepos.find(r => r.fullName === fullName);
                      if (repo) handleNavigate(repo);
                      else router.push(`/repos/${fullName}`);
                    }}
                    className="flex items-center gap-2 px-3 py-1 mx-1 cursor-default text-[12px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] hover:bg-[var(--color-canvas-subtle)] rounded-[3px] truncate"
                  >
                    <FolderGit2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filters */}
          <div>
            <div className="flex items-center gap-1.5 px-3 pb-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
              Filters
            </div>
            <NavItem id="all" label="All Repositories" icon={FolderGit2} count={myRepos.length} />
            <NavItem id="public" label="Public" icon={Globe} count={myRepos.filter(r => !r.private).length} />
            <NavItem id="private" label="Private" icon={Lock} count={myRepos.filter(r => r.private).length} />
            <NavItem id="indexed" label="Indexed" icon={Zap} count={myRepos.filter(r => r.indexed).length} />
          </div>

          {/* Accounts */}
          {owners.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-3 pb-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--color-fg-muted)]">
                Accounts
              </div>
              {owners.map(owner => (
                <NavItem
                  key={owner}
                  id={`owner:${owner}`}
                  label={owner}
                  icon={FolderOpen}
                  count={myRepos.filter(r => r.fullName.split('/')[0] === owner).length}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area (Table View) */}
        <div className="flex-1 bg-[var(--color-canvas-default)] flex flex-col min-w-0 overflow-auto cursor-default relative">

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-[var(--color-canvas-default)]/50 z-20">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--color-fg-muted)]" />
            </div>
          )}

          {!loading && (
            <table className="w-full table-fixed text-[13px] text-left border-collapse whitespace-nowrap">
              <thead className="sticky top-0 bg-[var(--color-canvas-default)] z-10">
                <tr className="hover:bg-transparent h-[32px]">
                  <th className="px-3 font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] border-r border-[var(--color-border-default)] w-[30%] align-middle">Name</th>
                  <th className="px-3 font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] border-r border-[var(--color-border-default)] w-[15%] align-middle">Status / Visibility</th>
                  <th className="px-3 font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] border-r border-[var(--color-border-default)] w-[12%] align-middle">Language</th>
                  <th className="px-3 font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] border-r border-[var(--color-border-default)] w-[10%] align-middle">Default Branch</th>
                  <th className="px-3 font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] border-r border-[var(--color-border-default)] w-[12%] align-middle">Issues & PRs</th>
                  <th className="px-3 font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-canvas-subtle)] w-[13%] align-middle">Stars</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-canvas-default)] divide-y divide-transparent">

                {/* ── When search is active: render two labelled groups ── */}
                {isSearchActive ? (
                  <>
                    {/* ── Group 1: Your repos ── */}
                    {localSearchMatches.length > 0 && (
                      <>
                        <tr className="border-0">
                          <td colSpan={colCount} className="px-3 pt-3 pb-1">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-success-fg)]">
                              <FolderGit2 className="h-3 w-3" />
                              Your Repositories · {localSearchMatches.length}
                            </div>
                          </td>
                        </tr>
                        {localSearchMatches.map((repo) => {
                          const [owner, name] = repo.fullName.split('/');
                          return (
                            <tr
                              key={`local:${repo.fullName}`}
                              onDoubleClick={() => handleNavigate(repo)}
                              className="group border border-transparent hover:border-[var(--color-success-fg)]/30 transition-colors cursor-pointer"
                              style={{ background: 'rgba(14,122,13,0.04)' }}
                            >
                              <td className="py-[7px] px-3">
                                <div className="flex items-center gap-2">
                                  <RepoSourceIcon provider={repo.provider} private={repo.private} />
                                  <div className="flex flex-col min-w-0 leading-tight">
                                    <span className="font-medium text-[var(--color-fg-default)] group-hover:text-[var(--color-success-fg)] truncate" onClick={() => handleNavigate(repo)}>{name}</span>
                                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
                                      <span className="truncate">{owner}</span>
                                      <ProviderBadge provider={repo.provider} />
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-[7px] px-3 text-[12px]">
                                <div className="flex items-center gap-2">
                                  <Badge variant={repo.private ? "default" : "info"} className="text-[9px] px-1 py-0 h-4">{repo.private ? "Private" : "Public"}</Badge>
                                  {repo.indexed && <div className="flex items-center gap-1 text-[11px] text-[var(--color-success-fg)]" title={`${repo.indexedFiles} files indexed`}><Database className="h-3 w-3" /><span className="hidden xl:inline">Indexed</span></div>}
                                </div>
                              </td>
                              <td className="py-[7px] px-3 overflow-hidden"><LanguagesCell repoFullName={repo.fullName} primaryLanguage={repo.language} provider={repo.provider} /></td>
                              <td className="py-[7px] px-3 overflow-hidden"><DefaultBranchBadge branch={repo.defaultBranch} /></td>
                              <td className="py-[7px] px-3 overflow-hidden"><ActivityCell repoFullName={repo.fullName} provider={repo.provider} /></td>
                              <td className="py-[7px] px-3">
                                {repo.stars !== undefined && repo.stars > 0 ? (
                                  <span className="flex items-center gap-1 text-[12px]"><Star className="h-3 w-3 text-[var(--color-warning-fg)]" /><span className="tabular-nums text-[var(--color-fg-default)]">{repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}</span></span>
                                ) : <span className="text-[12px] text-[var(--color-fg-muted)]">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </>
                    )}

                    {/* ── Group 2: GitHub public results ── */}
                    {(remoteSearchMatches.length > 0 || githubLoading) && (
                      <>
                        <tr className="border-0">
                          <td colSpan={colCount} className="px-3 pt-3 pb-1">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent-fg)]">
                              <Globe className="h-3 w-3" />
                              From GitHub{remoteSearchMatches.length > 0 ? ` · ${remoteSearchMatches.length}` : ''}
                              {githubLoading && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
                            </div>
                          </td>
                        </tr>
                        {githubLoading && remoteSearchMatches.length === 0 && [1,2,3,4].map((i) => (
                          <tr key={`skel-${i}`} className="border border-transparent" style={{ background: 'rgba(0,120,212,0.03)' }}>
                            <td className="py-[7px] px-3"><div className="flex items-center gap-2"><div className="h-4 w-4 rounded bg-[var(--color-neutral-muted)] animate-pulse" /><div className="h-3 rounded bg-[var(--color-neutral-muted)] animate-pulse" style={{ width: `${100 + i * 30}px` }} /></div></td>
                            <td className="py-[7px] px-3"><div className="h-4 w-14 rounded bg-[var(--color-neutral-muted)] animate-pulse" /></td>
                            <td className="py-[7px] px-3"><div className="h-3 w-16 rounded bg-[var(--color-neutral-muted)] animate-pulse" /></td>
                            <td className="py-[7px] px-3"><div className="h-5 w-16 rounded bg-[var(--color-neutral-muted)] animate-pulse" /></td>
                            <td className="py-[7px] px-3"><div className="h-3 w-14 rounded bg-[var(--color-neutral-muted)] animate-pulse" /></td>
                            <td className="py-[7px] px-3"><div className="h-3 w-10 rounded bg-[var(--color-neutral-muted)] animate-pulse" /></td>
                          </tr>
                        ))}
                        {remoteSearchMatches.map((repo) => {
                          const [owner, name] = repo.fullName.split('/');
                          return (
                            <tr
                              key={`github:${repo.fullName}`}
                              onDoubleClick={() => handleNavigate(repo)}
                              className="group border border-transparent hover:border-[var(--color-accent-fg)]/30 transition-colors cursor-pointer"
                              style={{ background: 'rgba(0,120,212,0.03)' }}
                            >
                              <td className="py-[7px] px-3">
                                <div className="flex items-center gap-2">
                                  <RepoSourceIcon provider={repo.provider} private={repo.private} />
                                  <div className="flex flex-col min-w-0 leading-tight">
                                    <span className="font-medium text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)] truncate" onClick={() => handleNavigate(repo)}>{name}</span>
                                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
                                      <span className="truncate">{owner}</span>
                                      <ProviderBadge provider={repo.provider} />
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-[7px] px-3 text-[12px]">
                                <div className="flex items-center gap-2">
                                  <Badge variant={repo.private ? "default" : "info"} className="text-[9px] px-1 py-0 h-4">{repo.private ? "Private" : "Public"}</Badge>
                                </div>
                              </td>
                              <td className="py-[7px] px-3 overflow-hidden"><LanguagesCell repoFullName={repo.fullName} primaryLanguage={repo.language} provider={repo.provider} /></td>
                              <td className="py-[7px] px-3 overflow-hidden"><DefaultBranchBadge branch={repo.defaultBranch} /></td>
                              <td className="py-[7px] px-3 overflow-hidden"><ActivityCell repoFullName={repo.fullName} provider={repo.provider} /></td>
                              <td className="py-[7px] px-3">
                                {repo.stars !== undefined && repo.stars > 0 ? (
                                  <span className="flex items-center gap-1 text-[12px]"><Star className="h-3 w-3 text-[var(--color-warning-fg)]" /><span className="tabular-nums text-[var(--color-fg-default)]">{repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}</span></span>
                                ) : <span className="text-[12px] text-[var(--color-fg-muted)]">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                        {hasMoreGithub && (
                          <tr className="border-0">
                            <td colSpan={colCount} className="py-4 text-center">
                              <button
                                onClick={() => setGithubPage(p => p + 1)}
                                disabled={githubLoading}
                                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-canvas-subtle)] hover:bg-[var(--color-neutral-muted)] border border-[var(--color-border-default)] px-4 py-1.5 text-[12px] font-medium text-[var(--color-fg-default)] transition-colors disabled:opacity-50"
                              >
                                {githubLoading ? (
                                  <div className="h-3 w-3 rounded-full border-2 border-[var(--color-fg-muted)] border-t-[var(--color-fg-default)] animate-spin" />
                                ) : (
                                  <Clock className="h-3.5 w-3.5" />
                                )}
                                {githubLoading ? "Loading more..." : "Load more from GitHub"}
                              </button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}

                    {displayRepos.length === 0 && !githubLoading && (
                      <tr><td colSpan={colCount} className="py-8 text-center text-[12px] text-[var(--color-fg-muted)]">No matches found.</td></tr>
                    )}
                  </>
                ) : (
                  /* ── Normal (non-search) flat table ── */
                  <>
                    {displayRepos.map((repo) => {
                      const [owner, name] = repo.fullName.split('/');
                      return (
                        <tr
                          key={`${repo.source}:${repo.fullName}`}
                          onDoubleClick={() => handleNavigate(repo)}
                          className="group border border-transparent hover:border-[var(--color-border-default)] hover:bg-[var(--color-canvas-subtle)] transition-colors cursor-pointer"
                        >
                          <td className="py-[7px] px-3">
                            <div className="flex items-center gap-2">
                              <RepoSourceIcon provider={repo.provider} private={repo.private} />
                              <div className="flex flex-col min-w-0 leading-tight">
                                <span className="font-medium text-[var(--color-fg-default)] group-hover:text-[var(--color-accent-fg)] truncate" onClick={() => handleNavigate(repo)}>{name}</span>
                                {currentNode !== `owner:${owner}` ? (
                                  <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
                                    <span className="truncate">{owner}</span>
                                    <ProviderBadge provider={repo.provider} />
                                  </div>
                                ) : (
                                  <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[var(--color-fg-muted)]">
                                    <ProviderBadge provider={repo.provider} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-[7px] px-3 text-[12px] text-[var(--color-fg-muted)]">
                            <div className="flex items-center gap-2">
                              <Badge variant={repo.private ? "default" : "info"} className="text-[9px] px-1 py-0 h-4">{repo.private ? "Private" : "Public"}</Badge>
                                  {repo.indexed && <div className="flex items-center gap-1 text-[11px] text-[var(--color-success-fg)]" title={`${repo.indexedFiles} files indexed`}><Database className="h-3 w-3" /><span className="hidden xl:inline">Indexed</span></div>}
                            </div>
                          </td>
                          <td className="py-[7px] px-3 overflow-hidden"><LanguagesCell repoFullName={repo.fullName} primaryLanguage={repo.language} provider={repo.provider} /></td>
                          <td className="py-[7px] px-3 overflow-hidden"><DefaultBranchBadge branch={repo.defaultBranch} /></td>
                          <td className="py-[7px] px-3 overflow-hidden"><ActivityCell repoFullName={repo.fullName} provider={repo.provider} /></td>
                          <td className="py-[7px] px-3">
                            {repo.stars !== undefined && repo.stars > 0 ? (
                                  <span className="flex items-center gap-1 text-[12px] text-[var(--color-fg-muted)]"><Star className="h-3 w-3 text-[var(--color-warning-fg)]" /><span className="tabular-nums text-[var(--color-fg-default)]">{repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}</span></span>
                            ) : <span className="text-[12px] text-[var(--color-fg-muted)]">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                    {displayRepos.length === 0 && (
                      <tr><td colSpan={colCount} className="py-8 text-center text-[12px] text-[var(--color-fg-muted)]">No repositories in this filter.</td></tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}