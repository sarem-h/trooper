import type {
  Connection,
  CreateConnectionDto,
  WorkItem,
  AgentRun,
  AgentStep,
  PullRequest,
  LinkedAccount,
  LinkedRepository,
  UpdateConnectionDto,
  WebhookConfig,
  MaskingRule,
  MaskingAuditEntry,
  SystemHealth,
  CopilotCardResponse,
  CopilotGroundingTrace,
  CopilotModelOption,
  CopilotQuery,
  SkillDraftRequest,
  SkillDraftResponse,
  SkillRunRequest,
  SkillRunResponse,
} from '@trooper/shared';

export type { CopilotCardResponse, CopilotGroundingTrace, CopilotModelOption, CopilotQuery };
export type { SkillDraftRequest, SkillDraftResponse, SkillRunRequest, SkillRunResponse };

export interface UnifiedTask {
  type: 'work-item' | 'run';
  id: string;
  title: string;
  status: string;
  source: string;
  repository: string | null;
  lastActivity: string;
  summary: string | null;
  branchName: string | null;
  latestSignal: string | null;
  latestSignalAt: string | null;
  workItemNumber: number | null;
  linkedRun: { id: string; status: string } | null;
  linkedPR: { number: number | null; status: string; url: string } | null;
}

export interface IndexingSyncJob {
  id: string;
  repository: string;
  branch: string;
  tenantId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  totalFiles: number;
  processedFiles: number;
  totalChunks: number;
  currentFile?: string;
  result?: { totalFiles: number; totalChunks: number };
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

function resolveApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.trim();
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3001/api`;
  }

  return 'http://localhost:3001/api';
}

const GET_RETRY_DELAYS_MS = [250, 750, 1500] as const;

class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? 'GET';
  const shouldRetry = method === 'GET';

  for (let attempt = 0; attempt <= GET_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const res = await fetch(`${resolveApiBase()}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', ...init?.headers },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new ApiError(res.status, `API ${res.status}: ${body}`);
      }
      return res.json() as Promise<T>;
    } catch (error) {
      const isLastAttempt = attempt === GET_RETRY_DELAYS_MS.length;
      const isNetworkError = error instanceof TypeError;

      if (!shouldRetry || !isNetworkError || isLastAttempt) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, GET_RETRY_DELAYS_MS[attempt]));
    }
  }

  throw new Error('Unreachable');
}

export { ApiError };

// ─── Dashboard ─────────────────────────────────────
export const dashboard = {
  getOverview: () => request<SystemHealth>('/dashboard'),
  tasks: (status?: string) =>
    request<UnifiedTask[]>(status ? `/dashboard/tasks?status=${encodeURIComponent(status)}` : '/dashboard/tasks'),
};

// ─── Connections ───────────────────────────────────
export const connections = {
  list: () => request<Connection[]>('/connections'),
  get: (id: string) => request<Connection>(`/connections/${id}`),
  create: (data: CreateConnectionDto) => request<Connection>('/connections', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateConnectionDto) => request<Connection>(`/connections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/connections/${id}`, { method: 'DELETE' }),
};

// ─── Work Items ────────────────────────────────────
export const workItems = {
  list: () => request<WorkItem[]>('/work-items'),
  get: (id: string) => request<WorkItem>(`/work-items/${id}`),
  create: (data: Partial<WorkItem>) => request<WorkItem>('/work-items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<WorkItem>) => request<WorkItem>(`/work-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/work-items/${id}`, { method: 'DELETE' }),
};

// ─── Agent Runs ────────────────────────────────────
export const agentRuns = {
  list: () => request<AgentRun[]>('/agent/runs'),
  get: (id: string) => request<AgentRun>(`/agent/runs/${id}`),
  create: (data: Partial<AgentRun>) => request<AgentRun>('/agent/runs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<AgentRun>) => request<AgentRun>(`/agent/runs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  steps: (runId: string) => request<AgentStep[]>(`/agent/runs/${runId}/steps`),
  createStep: (runId: string, data: Partial<AgentStep>) => request<AgentStep>(`/agent/runs/${runId}/steps`, { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Pull Requests ─────────────────────────────────
export const pullRequests = {
  list: () => request<PullRequest[]>('/pull-requests'),
  get: (id: string) => request<PullRequest>(`/pull-requests/${id}`),
  create: (data: Partial<PullRequest>) => request<PullRequest>('/pull-requests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<PullRequest>) => request<PullRequest>(`/pull-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Accounts ──────────────────────────────────────
export const accounts = {
  list: () => request<LinkedAccount[]>('/accounts'),
  get: (id: string) => request<LinkedAccount>(`/accounts/${id}`),
  create: (data: Partial<LinkedAccount>) => request<LinkedAccount>('/accounts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<LinkedAccount>) => request<LinkedAccount>(`/accounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/accounts/${id}`, { method: 'DELETE' }),
};

// ─── Repositories ──────────────────────────────────
export const repositories = {
  list: () => request<LinkedRepository[]>('/repositories'),
  get: (id: string) => request<LinkedRepository>(`/repositories/${id}`),
  create: (data: Partial<LinkedRepository>) => request<LinkedRepository>('/repositories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<LinkedRepository>) => request<LinkedRepository>(`/repositories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/repositories/${id}`, { method: 'DELETE' }),
};

// ─── Webhooks ──────────────────────────────────────
export const webhooks = {
  list: () => request<WebhookConfig[]>('/webhooks'),
  get: (id: string) => request<WebhookConfig>(`/webhooks/${id}`),
  create: (data: Partial<WebhookConfig>) => request<WebhookConfig>('/webhooks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<WebhookConfig>) => request<WebhookConfig>(`/webhooks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => request<void>(`/webhooks/${id}`, { method: 'DELETE' }),
};

// ─── Masking ───────────────────────────────────────
export const masking = {
  rules: () => request<MaskingRule[]>('/masking/rules'),
  createRule: (data: Partial<MaskingRule>) => request<MaskingRule>('/masking/rules', { method: 'POST', body: JSON.stringify(data) }),
  updateRule: (id: string, data: Partial<MaskingRule>) => request<MaskingRule>(`/masking/rules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  removeRule: (id: string) => request<void>(`/masking/rules/${id}`, { method: 'DELETE' }),
  audit: () => request<MaskingAuditEntry[]>('/masking/audit'),
};

// ─── Indexing ──────────────────────────────────────
export const indexing = {
  list: () => request<any[]>('/indexing'),
  upsert: (data: any) => request<any>('/indexing', { method: 'POST', body: JSON.stringify(data) }),
  sync: (data: { repository: string; branch: string }) =>
    request<IndexingSyncJob>('/indexing/sync', { method: 'POST', body: JSON.stringify(data) }),
  job: (jobId: string) => request<IndexingSyncJob>(`/indexing/jobs/${jobId}`),
  stats: () => request<{ documentCount: number; storageSize: number } | null>('/indexing/stats'),
  status: (repository: string, branch: string) =>
    request<any | null>(`/indexing/status?repository=${encodeURIComponent(repository)}&branch=${encodeURIComponent(branch)}`),
  files: (repository: string, branch: string) =>
    request<Array<{ filePath: string; language: string; chunkCount: number }>>(`/indexing/files?repository=${encodeURIComponent(repository)}&branch=${encodeURIComponent(branch)}`),
  fileChunks: (repository: string, branch: string, filePath: string) =>
    request<Array<{ chunkIndex: number; symbolName: string; content: string; tokenCount: number }>>(
      `/indexing/files/chunks?repository=${encodeURIComponent(repository)}&branch=${encodeURIComponent(branch)}&filePath=${encodeURIComponent(filePath)}`,
    ),
  search: (data: { repository: string; branch: string; query: string; topK?: number }) =>
    request<Array<{ filePath: string; chunkIndex: number; symbolName: string; language: string; content: string; score: number }>>(
      '/indexing/search', { method: 'POST', body: JSON.stringify(data) },
    ),
};

// ─── Pipeline ──────────────────────────────────────
export const pipeline = {
  repos: (q?: string, page?: number, provider?: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (page) params.set('page', String(page));
    if (provider) params.set('provider', provider);
    const qs = params.toString();
    return request<Array<{ fullName: string; private: boolean; defaultBranch: string; indexed: boolean; indexStatus: string | null; lastSyncAt: string | null; indexedFiles: number; description?: string; language?: string; stars?: number; openIssuesCount?: number; ownerAvatarUrl?: string; provider: string }>>(`/pipeline/repos${qs ? `?${qs}` : ''}`);
  },

  getRepo: (repoFullName: string, provider?: string) => request<{ fullName: string; private: boolean; defaultBranch: string; indexed: boolean; indexStatus: string | null; lastSyncAt: string | null; indexedFiles: number; description?: string; language?: string; stars?: number; openIssuesCount?: number; ownerAvatarUrl?: string; provider: string }>(`/pipeline/repos/${repoFullName}${provider ? `?provider=${provider}` : ''}`),

  listBranches: (repoFullName: string, provider?: string) => request<string[]>(`/pipeline/repos/${repoFullName}/branches${provider ? `?provider=${provider}` : ''}`),
  trigger: (data: { workItemId?: string; repositoryFullName?: string; userQuery?: string; targetBranch?: string }) =>
    request<{ runId: string; status: string; prUrl?: string; error?: string }>('/pipeline/trigger', { method: 'POST', body: JSON.stringify(data) }),
  approvePlan: (runId: string) =>
    request<{ runId: string; status: string; error?: string }>(`/pipeline/runs/${runId}/approve`, { method: 'POST' }),
  rejectPlan: (runId: string, newQuery: string) =>
    request<{ runId: string; status: string; error?: string }>(`/pipeline/runs/${runId}/reject`, { method: 'POST', body: JSON.stringify({ newQuery }) }),
  retryRun: (runId: string) =>
    request<{ runId: string; status: string; error?: string }>(`/pipeline/runs/${runId}/retry`, { method: 'POST' }),
  continueRun: (runId: string, additionalIterations?: number) =>
    request<{ runId: string; status: string; error?: string }>(`/pipeline/runs/${runId}/continue`, {
      method: 'POST',
      body: JSON.stringify({ additionalIterations }),
    }),
  submitAsIs: (runId: string) =>
    request<{ runId: string; status: string; error?: string }>(`/pipeline/runs/${runId}/submit`, { method: 'POST' }),
  getRun: (runId: string) => request<any>(`/pipeline/runs/${runId}`),
  getSteps: (runId: string) => request<any[]>(`/pipeline/runs/${runId}/steps`),
  streamUrl: (runId: string) => `${resolveApiBase()}/pipeline/runs/${runId}/stream`,
  // Issues
  listIssues: (repoFullName: string, opts?: { state?: string; page?: number; perPage?: number; q?: string; provider?: string }) => {
    const params = new URLSearchParams();
    if (opts?.state) params.set('state', opts.state);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.perPage) params.set('per_page', String(opts.perPage));
    if (opts?.q) params.set('q', opts.q);
    if (opts?.provider) params.set('provider', opts.provider);
    const qs = params.toString();
    return request<{ items: any[]; totalCount: number; availability?: { status: 'ok' | 'limited'; reason?: string } }>(`/pipeline/repos/${repoFullName}/issues${qs ? `?${qs}` : ''}`);
  },
  getIssue: (repoFullName: string, issueNumber: number, provider?: string) => request<any>(`/pipeline/repos/${repoFullName}/issues/${issueNumber}${provider ? `?provider=${provider}` : ''}`),
  postIssueComment: (repoFullName: string, issueNumber: number, body: string, provider?: string) =>
    request<any>(`/pipeline/repos/${repoFullName}/issues/${issueNumber}/comments${provider ? `?provider=${provider}` : ''}`, { method: 'POST', body: JSON.stringify({ body }) }),
  // Pull Requests
  listPulls: (repoFullName: string, opts?: { state?: string; page?: number; perPage?: number; sort?: string; provider?: string }) => {
    const params = new URLSearchParams();
    if (opts?.state) params.set('state', opts.state);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.perPage) params.set('per_page', String(opts.perPage));
    if (opts?.sort) params.set('sort', opts.sort);
    if (opts?.provider) params.set('provider', opts.provider);
    const qs = params.toString();
    return request<{ items: any[]; totalCount: number }>(`/pipeline/repos/${repoFullName}/pulls${qs ? `?${qs}` : ''}`);
  },
  getPull: (repoFullName: string, prNumber: number, provider?: string) =>
    request<any>(`/pipeline/repos/${repoFullName}/pulls/${prNumber}${provider ? `?provider=${provider}` : ''}`),
  postPRComment: (repoFullName: string, prNumber: number, body: string, provider?: string) =>
    request<any>(`/pipeline/repos/${repoFullName}/pulls/${prNumber}/comments${provider ? `?provider=${provider}` : ''}`, { method: 'POST', body: JSON.stringify({ body }) }),
  mergePR: (repoFullName: string, prNumber: number, mergeMethod?: 'merge' | 'squash' | 'rebase', provider?: string) =>
    request<void>(`/pipeline/repos/${repoFullName}/pulls/${prNumber}/merge${provider ? `?provider=${provider}` : ''}`, { method: 'POST', body: JSON.stringify({ merge_method: mergeMethod }) }),
  closePR: (repoFullName: string, prNumber: number, provider?: string) =>
    request<void>(`/pipeline/repos/${repoFullName}/pulls/${prNumber}/close${provider ? `?provider=${provider}` : ''}`, { method: 'POST' }),
  // Enrichment
  getRepoActivity: (repoFullName: string, provider?: string) =>
    request<{ openIssues: number; openPRs: number }>(`/pipeline/repos/${repoFullName}/activity${provider ? `?provider=${provider}` : ''}`),
  getRepoLanguages: (repoFullName: string, provider?: string) =>
    request<Record<string, number>>(`/pipeline/repos/${repoFullName}/languages${provider ? `?provider=${provider}` : ''}`),
  // Security
  getSecuritySummary: (repoFullName: string, provider?: string) =>
    request<{ totalAlerts: number; critical: number; high: number; medium: number; low: number; alerts: any[] }>(
      `/pipeline/repos/${repoFullName}/security${provider ? `?provider=${provider}` : ''}`,
    ),
  getSecurityAlert: (repoFullName: string, alertType: string, alertId: number, provider?: string) =>
    request<any>(`/pipeline/repos/${repoFullName}/security/${alertType}/${alertId}${provider ? `?provider=${provider}` : ''}`),
  // Auto-Draft
  draft: (context: { type: string; repositoryFullName: string; refNumber?: number; title?: string; body?: string; alertType?: string; severity?: string; affectedComponent?: string; targetBranch?: string }) =>
    request<{ runId: string; status: string }>('/pipeline/draft', { method: 'POST', body: JSON.stringify(context) }),
  approveDraft: (runId: string, overrideQuery?: string) =>
    request<{ runId: string; status: string }>(`/pipeline/runs/${runId}/approve-draft`, {
      method: 'POST',
      body: JSON.stringify({ overrideQuery }),
    }),
  // Providers
  listProviders: () =>
    request<Array<{ type: string; capabilities: { issues: boolean; pullRequests: boolean; security: boolean; fork: boolean } }>>('/pipeline/providers'),
  // Security Audit
  securityAudit: (data: { repoFullName: string; minSeverity?: string; alertTypes?: string[]; maxAlerts?: number }) =>
    request<{ totalAlerts: number; drafted: number; runs: Array<{ alertId?: number; runId: string; status: string }> }>(
      '/pipeline/security-audit', { method: 'POST', body: JSON.stringify(data) },
    ),
};

// ─── Copilot ───────────────────────────────────────
export const copilot = {
  models: () => request<CopilotModelOption[]>('/copilot/models'),
  draftSkill: (data: SkillDraftRequest) =>
    request<SkillDraftResponse>('/copilot/draft-skill', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  runSkill: (data: SkillRunRequest) =>
    request<SkillRunResponse>('/copilot/run-skill', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  summarize: (query: CopilotQuery) =>
    request<CopilotCardResponse>('/copilot/summarize', {
      method: 'POST',
      body: JSON.stringify(query),
    }),
  ground: (query: CopilotQuery) =>
    request<CopilotCardResponse>('/copilot/ground', {
      method: 'POST',
      body: JSON.stringify(query),
    }),
  ask: (query: CopilotQuery & { question: string; priorSummary: string }) =>
    request<{ answerMarkdown: string }>('/copilot/ask', {
      method: 'POST',
      body: JSON.stringify(query),
    }),
};
