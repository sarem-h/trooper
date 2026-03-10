/* ───────────────────────────────────────
   Trooper Shared Types — Enums
   ─────────────────────────────────────── */

/** Status of a work item ingested from Azure DevOps */
export enum WorkItemStatus {
  Pending = "pending",
  InProgress = "in_progress",
  AwaitingReview = "awaiting_review",
  Rejected = "rejected",
  Completed = "completed",
}

/** Status of an agent run */
export enum AgentRunStatus {
  Queued = "queued",
  Running = "running",
  /** Auto-drafted task awaiting user approval before execution */
  AwaitingDraftApproval = "awaiting_draft_approval",
  AwaitingApproval = "awaiting_approval",
  /** Iteration limit reached — waiting for user to click "Continue" */
  AwaitingContinuation = "awaiting_continuation",
  Success = "success",
  Failed = "failed",
  Cancelled = "cancelled",
}

/** Status of a PR created by Trooper */
export enum PRStatus {
  Open = "open",
  Approved = "approved",
  Rejected = "rejected",
  Merged = "merged",
  Abandoned = "abandoned",
}

/** Type of agent step in the reasoning trace */
export enum AgentStepType {
  Reasoning = "reasoning",
  ToolCall = "tool_call",
  CodeGen = "code_gen",
  Masking = "masking",
  GitOp = "git_op",
  Error = "error",
}

/** Index sync status for RAG pipeline */
export enum IndexStatus {
  Idle = "idle",
  Syncing = "syncing",
  Error = "error",
}

/** Pipeline stage identifiers */
export enum PipelineStage {
  /** Receiving and validating the work item */
  Receive = "receive",
  /** Auto-drafting task from context (issue, PR, security alert) */
  Draft = "draft",
  /** Fetching repo tree + key files from GitHub */
  Fetch = "fetch",
  /** RAG context retrieval: embed query → find relevant chunks */
  Context = "context",
  /** Analysing codebase to understand context */
  Understand = "understand",
  /** Planning what changes to make */
  Plan = "plan",
  /** Generating code changes */
  CodeGen = "code_gen",
  /** Reviewing generated code for correctness */
  Review = "review",
  /** Masking secrets / sensitive tokens */
  Mask = "mask",
  /** Creating branch, committing, opening PR */
  SubmitPR = "submit_pr",
}

/* ───────────────────────────────────────
   Multi-provider identity model
   ─────────────────────────────────────── */

/** Supported Git providers */
export enum GitProvider {
  GitHub = "github",
  AzureRepos = "azure_repos",
}

/** Auth method for a provider connection */
export enum ConnectionAuthMethod {
  /** GitHub App installation (recommended for orgs) */
  GitHubApp = "github_app",
  /** OAuth App — user-level access for GitHub */
  OAuthApp = "oauth_app",
  /** Personal Access Token (both providers) */
  PAT = "pat",
  /** Azure Managed Identity / Service Principal */
  ServicePrincipal = "service_principal",
}

/** Health status of a connection or linked account */
export enum AuthStatus {
  Active = "active",
  Expiring = "expiring",
  Expired = "expired",
  Revoked = "revoked",
  Error = "error",
}

/** The identity Trooper should use when performing Git operations */
export enum IdentityMode {
  /** Use Trooper's own service account / app identity */
  ServiceAccount = "service_account",
  /** Impersonate a linked user account ("assume" mode) */
  AssumeUser = "assume_user",
}
