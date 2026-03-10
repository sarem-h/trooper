/**
 * Universal SCM Provider Abstraction
 *
 * Defines a provider-agnostic interface for all Git platform operations.
 * Concrete implementations (GitHub, GitLab, Azure DevOps, Bitbucket) implement this
 * interface so the pipeline layer remains SCM-agnostic.
 */

// ─── Repository ──────────────────────────────────────────

export interface ScmRepo {
  fullName: string;
  private: boolean;
  defaultBranch: string;
  /** Whether the authenticated user has push access */
  pushAccess: boolean;
  /** If this repo is a fork, the upstream full name */
  parentFullName?: string;
  /** Short description of the repository */
  description?: string;
  /** Primary programming language */
  language?: string;
  /** Star count */
  stars?: number;
  /** Open issues and pull requests count */
  openIssuesCount?: number;
  /** Owner avatar URL */
  ownerAvatarUrl?: string;
  /** SCM provider type, e.g. 'github' | 'gitlab' | 'bitbucket' */
  provider: string;
}

export interface ScmRepoFile {
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
}

export interface ScmFileContent {
  path: string;
  content: string;
  sha: string;
  encoding: string;
}

// ─── Issues ──────────────────────────────────────────────

export interface ScmLabel {
  name: string;
  color: string;
}

export interface ScmUser {
  login: string;
  avatarUrl: string;
}

export interface ScmIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: ScmLabel[];
  user: ScmUser | null;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  url: string;
}

export interface ScmIssueComment {
  id: number;
  body: string;
  user: ScmUser | null;
  createdAt: string;
}

export interface ScmIssueDetail extends ScmIssue {
  comments: ScmIssueComment[];
}

// ─── Pull Requests ───────────────────────────────────────

export interface ScmPullRequest {
  number: number;
  title: string;
  body: string;
  state: string;
  sourceBranch: string;
  targetBranch: string;
  user: ScmUser | null;
  /** Review status summaries (provider-specific) */
  reviewDecision?: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  /** Files changed in the PR (populated on detail fetch only) */
  changedFiles?: string[];
  /** Whether the PR has been merged */
  merged?: boolean;
  /** Whether the PR can be merged (null = unknown) */
  mergeable?: boolean | null;
  /** Whether this is a draft PR */
  isDraft?: boolean;
  /** Number of additions across all files */
  additions?: number;
  /** Number of deletions across all files */
  deletions?: number;
  /** Number of commits in the PR */
  commitsCount?: number;
  /** Per-file diff patches (populated on detail fetch only) */
  diffFiles?: ScmDiffFile[];
  /** Reviews submitted on the PR (populated on detail fetch only) */
  reviews?: ScmPRReview[];
  /** Conversation comments on the PR (populated on detail fetch only) */
  comments?: ScmIssueComment[];
}

export interface ScmDiffFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export interface ScmPRReview {
  id: number;
  user: ScmUser | null;
  state: string;
  body: string;
  submittedAt: string;
}

// ─── Security ────────────────────────────────────────────

export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type SecurityAlertState = 'open' | 'dismissed' | 'fixed';

export interface ScmSecurityAlert {
  id: number;
  /** Alert type: dependabot, code_scanning, secret_scanning */
  alertType: 'dependabot' | 'code_scanning' | 'secret_scanning';
  severity: SecuritySeverity;
  state: SecurityAlertState;
  title: string;
  description: string;
  /** Package or file path affected */
  affectedComponent: string;
  /** CVE identifier (if applicable) */
  cveId?: string;
  /** CWE identifiers */
  cweIds?: string[];
  /** Tool that detected it (e.g., "CodeQL", "Dependabot") */
  tool?: string;
  url: string;
  createdAt: string;
  /** Fix available (for Dependabot) */
  fixAvailable?: boolean;
  /** File location for code scanning alerts */
  filePath?: string;
  startLine?: number;
  endLine?: number;
}

// ─── Git Operations ──────────────────────────────────────

export interface ScmCreatedPR {
  number: number;
  url: string;
  title: string;
}

// ─── Fork ────────────────────────────────────────────────

export interface ScmForkResult {
  fullName: string;
  defaultBranch: string;
  /** Whether the fork already existed */
  existed: boolean;
}

// ─── Pagination ──────────────────────────────────────────

export interface PaginatedList<T> {
  items: T[];
  totalCount: number;
}

// ─── Provider Interface ─────────────────────────────────

/**
 * Every SCM provider must implement this interface.
 *
 * All methods are optional via the `ScmCapabilities` check — the registry
 * will gracefully skip operations that a provider doesn't support.
 */
export interface ScmProvider {
  /** Unique identifier: "github", "gitlab", "azure_devops", "bitbucket" */
  readonly providerType: string;

  // ── Repository ──────────────────────────────────
  listRepos(): Promise<ScmRepo[]>;
  searchRepos(query: string, page?: number): Promise<ScmRepo[]>;
  getRepo(repoFullName: string): Promise<ScmRepo>;
  getDefaultBranch(repoFullName: string): Promise<string>;
  listBranches(repoFullName: string): Promise<string[]>;
  getTree(repoFullName: string, branch: string): Promise<ScmRepoFile[]>;
  getFileContent(repoFullName: string, filePath: string, ref: string): Promise<ScmFileContent>;
  getFilesContent(repoFullName: string, paths: string[], ref: string): Promise<ScmFileContent[]>;

  // ── Issues ──────────────────────────────────────
  listIssues(repoFullName: string, state?: 'open' | 'closed' | 'all', perPage?: number, page?: number, search?: string): Promise<PaginatedList<ScmIssue>>;
  getIssue(repoFullName: string, issueNumber: number): Promise<ScmIssueDetail>;

  // ── Pull Requests ───────────────────────────────
  listPullRequests(repoFullName: string, state?: 'open' | 'closed' | 'all' | 'draft' | 'merged', perPage?: number, page?: number, sort?: 'updated' | 'created'): Promise<PaginatedList<ScmPullRequest>>;
  getPullRequest(repoFullName: string, prNumber: number): Promise<ScmPullRequest>;

  // ── Security ────────────────────────────────────
  listSecurityAlerts(repoFullName: string): Promise<ScmSecurityAlert[]>;
  getSecurityAlert(repoFullName: string, alertId: number, alertType: string): Promise<ScmSecurityAlert>;

  // ── Git Operations ──────────────────────────────
  createBranch(repoFullName: string, branchName: string, baseBranch: string): Promise<void>;
  commitFiles(repoFullName: string, branchName: string, message: string, files: Array<{ path: string; content: string }>): Promise<string>;
  createPullRequest(repoFullName: string, head: string, base: string, title: string, body: string): Promise<ScmCreatedPR>;

  // ── Comments ───────────────────────────────────
  postIssueComment(repoFullName: string, issueNumber: number, body: string): Promise<ScmIssueComment>;
  postPRComment(repoFullName: string, prNumber: number, body: string): Promise<ScmIssueComment>;

  // ── PR Actions ─────────────────────────────────
  mergePullRequest(repoFullName: string, prNumber: number, mergeMethod?: 'merge' | 'squash' | 'rebase'): Promise<void>;
  closePullRequest(repoFullName: string, prNumber: number): Promise<void>;

  // ── Fork-and-PR (for external repos) ────────────
  checkPushAccess(repoFullName: string): Promise<boolean>;
  forkRepo(repoFullName: string): Promise<ScmForkResult>;
  createCrossRepoPR(upstreamFullName: string, forkFullName: string, head: string, base: string, title: string, body: string): Promise<ScmCreatedPR>;

  // ── Enrichment ─────────────────────────────────
  getRepoActivity(repoFullName: string): Promise<{ openIssues: number; openPRs: number }>;
  listLanguages(repoFullName: string): Promise<Record<string, number>>;
}

/**
 * Declare which optional capabilities a provider supports.
 * The registry checks this before invoking optional methods.
 */
export interface ScmCapabilities {
  issues: boolean;
  pullRequests: boolean;
  security: boolean;
  fork: boolean;
}
