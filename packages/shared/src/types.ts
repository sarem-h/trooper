/* ───────────────────────────────────────
   Trooper Shared Types — DTOs
   ─────────────────────────────────────── */

import {
  WorkItemStatus,
  AgentRunStatus,
  PRStatus,
  AgentStepType,
  IndexStatus,
  GitProvider,
  ConnectionAuthMethod,
  AuthStatus,
  IdentityMode,
} from "./enums";

/** A work item ingested from Azure DevOps */
export interface WorkItem {
  id: string;
  azureId: number;
  title: string;
  description: string;
  userQuery?: string;
  type: "feature" | "bug" | "vulnerability";
  status: WorkItemStatus;
  assignedTo?: string;
  repositoryFullName?: string;
  targetBranch?: string;
  linkedRunId?: string;
  linkedPRId?: string;
  createdAt: string;
  updatedAt: string;
}

/** A single step in the agent reasoning trace */
export interface AgentStep {
  id: string;
  runId: string;
  type: AgentStepType;
  status?: string;
  label: string;
  detail?: string;
  order?: number;
  durationMs?: number;
  timestamp: string;
}

/** An agent run (one attempt at solving a work item) */
export interface AgentRun {
  id: string;
  workItemId?: string;
  repositoryFullName?: string;
  userQuery?: string;
  status: AgentRunStatus;
  steps: AgentStep[];
  branchName?: string;
  prId?: string;
  error?: string;
  planSummary?: string;
  planFiles?: any;
  startedAt: string;
  completedAt?: string;
}

/** A PR created by Trooper */
export interface PullRequest {
  id: string;
  azurePRId: number;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  status: PRStatus;
  reviewerAlias?: string;
  rejectionComment?: string;
  workItemId?: string;
  runId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

/** RAG index status */
export interface IndexState {
  status: IndexStatus;
  totalFiles: number;
  indexedFiles: number;
  lastSyncAt?: string;
  repository: string;
  branch: string;
}

/** Masking audit entry */
export interface MaskingAuditEntry {
  id: string;
  runId: string;
  pattern: string;
  matchCount: number;
  filesAffected: string[];
  timestamp: string;
}

/** System health overview for dashboard */
export interface SystemHealth {
  azureConnection: "connected" | "degraded" | "disconnected";
  ragIndex: IndexStatus;
  activeRuns: number;
  pendingWorkItems: number;
  openPRs: number;
  uptime: string;
}

/* ───────────────────────────────────────
   Multi-provider identity model
   ─────────────────────────────────────── */

/**
 * A provider-level integration.
 * e.g. "GitHub App installed on contoso org" or "Azure DevOps PAT for contoso org"
 */
export interface Connection {
  id: string;
  name: string;
  provider: GitProvider;
  authMethod: ConnectionAuthMethod;
  /** Org or account name on the provider (e.g., "contoso") */
  providerAccountName: string;
  /** Provider-side account/org URL */
  providerUrl: string;
  status: AuthStatus;
  /** Scopes/permissions granted */
  scopes: string[];
  hasToken: boolean;
  tokenPreview?: string;
  isDefault: boolean;
  repositoryCount?: number;
  linkedAccountCount?: number;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * A user's personal identity that Trooper can "assume" for Git operations.
 * This enables Trooper to submit PRs as the actual user.
 */
export interface LinkedAccount {
  id: string;
  /** Display name of the account owner */
  displayName: string;
  /** Username on the provider (e.g., GitHub handle or Azure alias) */
  providerUsername: string;
  /** Email associated with commits */
  email: string;
  provider: GitProvider;
  authMethod: ConnectionAuthMethod;
  status: AuthStatus;
  /** Avatar URL from the provider */
  avatarUrl?: string;
  /** Which connection (if any) this account is associated with */
  connectionId?: string;
  expiresAt?: string;
  lastUsedAt?: string;
  createdAt: string;
}

/**
 * A repository linked to Trooper.
 * Each repo belongs to a connection and can optionally have an assumed identity.
 */
export interface LinkedRepository {
  id: string;
  /** Friendly name (can differ from provider name) */
  name: string;
  /** Full qualified name on the provider (e.g., "contoso/backend-api") */
  fullName: string;
  provider: GitProvider;
  /** Which connection is used to access this repo */
  connectionId: string;
  /** Default branch to work against */
  defaultBranch: string;
  /** Identity mode for Git operations on this repo */
  identityMode: IdentityMode;
  /** If identityMode is AssumeUser, which linked account to use */
  assumeAccountId?: string;
  /** Is the RAG index enabled for this repo */
  indexEnabled: boolean;
  /** Default reviewer alias for PRs created on this repo */
  defaultReviewer?: string;
  /** Webhook connected */
  webhookActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Webhook endpoint configuration
 */
export interface WebhookConfig {
  id: string;
  repositoryId: string;
  event: string;
  /** Relative URL path */
  endpointPath: string;
  active: boolean;
  /** Secret for HMAC signature verification */
  secretConfigured: boolean;
  lastTriggeredAt?: string;
  createdAt: string;
}

/**
 * A masking rule configuration
 */
export interface MaskingRule {
  id: string;
  pattern: string;
  description: string;
  enabled: boolean;
  builtIn: boolean;
  /** Regex (for custom rules) */
  regex?: string;
  createdAt: string;
}

/* ───────────────────────────────────────
   Task context & auto-drafting
   ─────────────────────────────────────── */

/* ───────────────────────────────────────
   Copilot assistant types
   ─────────────────────────────────────── */

export interface CopilotSuggestedAction {
  id: string;
  label: string;
  kind: 'primary' | 'secondary';
}

export interface CopilotModelOption {
  id: string;
  label: string;
  description: string;
  tier: 'worker' | 'thinker';
  isDefault: boolean;
}

export interface CopilotCardResponse {
  headline: string;
  status: 'open' | 'closed' | 'draft' | 'merged';
  confidence: 'high' | 'medium' | 'low';
  summaryMarkdown: string;
  suggestionsMarkdown: string;
  riskMarkdown?: string;
  evidence: string[];
  suggestedActions: CopilotSuggestedAction[];
  groundingTrace?: CopilotGroundingTrace;
}

export type CopilotGroundingStageName =
  | 'thread-context'
  | 'rag-retrieval'
  | 'prompt-build'
  | 'model-inference'
  | 'response-parse'
  | 'response-finalize';

export type CopilotGroundingStageStatus = 'pending' | 'completed' | 'failed' | 'skipped';

export interface CopilotGroundingStageTrace {
  id: number;
  name: CopilotGroundingStageName;
  label: string;
  status: CopilotGroundingStageStatus;
  detail?: string;
  durationMs?: number;
}

export interface CopilotGroundingTrace {
  mode: 'full' | 'verification';
  stageLimit?: number;
  completedStage: number;
  totalStages: number;
  stoppedEarly: boolean;
  ragDegraded: boolean;
  stages: CopilotGroundingStageTrace[];
}

export interface CopilotQuery {
  type: 'issue' | 'pull';
  repositoryFullName: string;
  refNumber: number;
  title: string;
  body: string;
  modelId?: string;
  labels?: string[];
  state: string;
  branch?: string;
  changedFiles?: string[];
  groundingStageLimit?: number;
  includeGroundingTrace?: boolean;
}

export interface SkillDraftRequest {
  prompt: string;
  currentSpecFull?: string;
  currentSpecUi?: string;
  modelId?: string;
  draftMode?: 'new' | 'refine';
}

export interface SkillDraftResponse {
  specFull: string;
  specUi: string;
  changeSummary: string;
  modelId: string;
  modelLabel: string;
}

export interface SkillRunRequest {
  repositoryFullName: string;
  branch: string;
  skillName: string;
  prompt: string;
  skillSpecFull: string;
  modelId?: string;
}

export interface SkillRunResponse {
  headline: string;
  resultMarkdown: string;
  evidence: string[];
  repositoryFullName: string;
  branch: string;
  modelId: string;
  modelLabel: string;
  retrievedChunkCount: number;
  retrievedFiles: string[];
}

/* ───────────────────────────────────────
   Task context & auto-drafting
   ─────────────────────────────────────── */

/** Origin context types for auto-drafted tasks */
export type TaskContextType = 'manual' | 'issue' | 'pull_request' | 'security';

/** Describes the origin context that triggered the task */
export interface TaskContext {
  type: TaskContextType;
  /** The repo this context came from */
  repositoryFullName: string;
  /** Ref number (issue #, PR #, alert id) */
  refNumber?: number;
  /** Human-readable title from context */
  title?: string;
  /** Body / description from context */
  body?: string;
  /** Alert type for security contexts */
  alertType?: string;
  /** Severity for security contexts */
  severity?: string;
  /** Affected file/component for security contexts */
  affectedComponent?: string;
}
