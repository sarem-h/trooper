# Trooper — Architecture & Implementation Plan

> **Living document** — tracks the system design, implementation status, and roadmap for every layer of the Trooper AI coding agent.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Pipeline Architecture](#2-pipeline-architecture)
3. [Layer 1 — Ingestion & Routing](#3-layer-1--ingestion--routing)
4. [Layer 2 — Repository Context (MCP + RAG)](#4-layer-2--repository-context-mcp--rag)
5. [Layer 3 — Planning Agent (Thinker)](#5-layer-3--planning-agent-thinker)
6. [Layer 4 — Human-in-the-Loop Gate](#6-layer-4--human-in-the-loop-gate)
7. [Layer 5 — Execution Orchestrator (Workers)](#7-layer-5--execution-orchestrator-workers)
8. [Layer 6 — Review, Sandbox Verification & Self-Correction Loop](#8-layer-6--review-sandbox-verification--self-correction-loop)
9. [Layer 7 — Security & Masking](#9-layer-7--security--masking)
10. [Layer 8 — Git Operations & PR Submission](#10-layer-8--git-operations--pr-submission)
11. [Layer 9 — Observability & Tracing](#11-layer-9--observability--tracing)
12. [Cross-Cutting — Identity & Multi-Provider](#12-cross-cutting--identity--multi-provider)
13. [Cross-Cutting — Webhooks & Event-Driven Triggers](#13-cross-cutting--webhooks--event-driven-triggers)
14. [Frontend — Dashboard & UX](#14-frontend--dashboard--ux)
15. [Infrastructure & Deployment](#15-infrastructure--deployment)
16. [Universal SCM Abstraction](#16-universal-scm-abstraction)
17. [Context-Aware Drafting System](#17-context-aware-drafting-system)
18. [Security Audit Pipeline](#18-security-audit-pipeline)
19. [Status Matrix](#19-status-matrix)

---

## 1. System Overview

Trooper is an autonomous AI coding agent that:
1. Receives a task (work item, ad-hoc query, or webhook event)
2. Explores a repository to understand its codebase
3. Produces a structured plan for review
4. Generates code changes via parallel sub-agents
5. Validates, masks secrets, and opens a PR

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend API | NestJS (TypeScript), port 3001 |
| Frontend | Next.js 15 (App Router, Turbopack), port 5000 |
| Database | PostgreSQL on Azure Flexible Server, Prisma ORM |
| LLM Provider | Azure AI Foundry (OpenAI-compatible API) |
| Models | GPT-4.1 (thinker), GPT-4.1-mini (worker), text-embedding-3-large (embedder) |
| SCM | GitHub (primary), Azure Repos (scaffold) |
| Monorepo | pnpm workspaces + Turborepo |

### Package Structure

```
trooper/
├── apps/
│   ├── api/          # NestJS backend (the brain)
│   └── web/          # Next.js frontend (the dashboard)
├── packages/
│   ├── database/     # Prisma schema, client, migrations, seed
│   └── shared/       # Enums, types, Zod schemas
└── ARCHITECTURE.md   # ← you are here
```

---

## 2. Pipeline Architecture

The pipeline executes in **two phases** separated by a human approval gate.

```
┌─────────────────────────────── PHASE 1 ───────────────────────────────────┐
│                                                                           │
│  ┌─────────┐   ┌─────────┐   ┌────────────┐   ┌──────────┐              │
│  │ Receive  │──▶│  Fetch  │──▶│ Understand │──▶│   Plan   │──▶ PAUSE     │
│  │ (ingest) │   │ (tree)  │   │   (RAG)    │   │(thinker) │   (approval) │
│  └─────────┘   └─────────┘   └────────────┘   └──────────┘              │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────── PHASE 2 ───────────────────────────────────┐
│                                                                           │
│  ┌──────────┐   ┌──────────┐   ┌─────────┐   ┌───────────┐              │
│  │ CodeGen  │──▶│  Review  │──▶│  Mask   │──▶│ Submit PR │              │
│  │ (swarm)  │   │(validate)│   │(secrets)│   │  (git)    │              │
│  └──────────┘   └──────────┘   └─────────┘   └───────────┘              │
│       │              │                                                    │
│       │◀─── retry ───┘ (if issues found)                                 │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Stages (enum: `PipelineStage`)

| # | Stage | Model | Description |
|---|-------|-------|-------------|
| 1 | `receive` | — | Validate input, resolve repo, create AgentRun |
| 1.5 | `draft_approval` | worker | *(Optional)* LLM auto-drafts task query from context; pauses for user approval |
| 2 | `fetch` | — | Get repo tree + metadata from SCM provider |
| 3 | `understand` | embedder | RAG retrieval: embed query → find relevant files → inject context. **Auto-syncs** unindexed repos |
| 4 | `plan` | thinker (GPT-4.1) | Planner agent explores repo via MCP tools, produces structured plan |
| 5 | `code_gen` | worker (GPT-4.1-mini) | N parallel Coder agents, one per file task |
| 6 | `review` | worker | Agentic reviewer (6-point checklist); token-budget-gated self-correction loop |
| 7 | `mask` | — | Scan for secrets using DB-driven masking rules; write audit entries |
| 8 | `submit_pr` | — | Create branch, commit files, open PR, persist records |

---

## 3. Layer 1 — Ingestion & Routing

**Purpose:** Accept tasks from multiple sources and normalize them into a pipeline run.

### Trigger Sources

| Source | Endpoint | Status |
|--------|----------|--------|
| Manual (ad-hoc query) | `POST /api/pipeline/trigger` | ✅ Implemented |
| Work Item (from Azure DevOps) | `POST /api/pipeline/trigger` with `workItemId` | ✅ Implemented |
| Webhook (push/PR event) | `POST /api/webhooks/receive` | ❌ Not implemented |
| Scheduled (cron) | — | ❌ Not planned yet |

### Input Schema

```typescript
interface TriggerInput {
  workItemId?: string;           // Link to existing WorkItem
  repositoryFullName?: string;   // e.g. "sarem-h/cs465-lab0"
  userQuery?: string;            // Natural-language instruction
  targetBranch?: string;         // Branch to base off (default: repo default)
}
```

### Use Cases

- **UC-1.1:** User pastes a query in the dashboard → triggers pipeline with `userQuery` + `repositoryFullName`.
- **UC-1.2:** User creates a work item describing a feature → clicks "Run Agent" → triggers with `workItemId`.
- **UC-1.3:** A GitHub webhook fires on issue creation → auto-triggers pipeline (future).

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Manual trigger via API | ✅ Done | — |
| Work item trigger | ✅ Done | — |
| Input validation (Zod) | ❌ Missing | Add Zod schema validation on trigger input |
| Rate limiting | ❌ Missing | Add per-user rate limits to prevent abuse |
| Webhook auto-trigger | ❌ Missing | Build `POST /webhooks/receive` handler |
| Repo resolution from Connections | ❌ Missing | Currently uses env var; should resolve from `Connection` + `LinkedRepository` tables |

---

## 4. Layer 2 — Repository Context (MCP + RAG)

**Purpose:** Give the Planner agent deep understanding of the codebase *before* it starts planning.

### 4a. MCP Tool Layer (Real-time exploration)

The Planner uses **MCP tools** to autonomously explore the repo during planning.

| Tool | Description | Provider |
|------|-------------|----------|
| `read_file(path)` | Read a single file's content | GitHub ✅ / Azure Repos ❌ |
| `list_directory(path)` | List children of a directory | GitHub ✅ / Azure Repos ❌ |
| `search_code(pattern)` | Path-based file search (substring match) | GitHub ✅ / Azure Repos ❌ |
| `read_multiple_files(paths)` | Batch-read multiple files | GitHub ✅ / Azure Repos ❌ |

**Architecture:**
```
ScmToolProvider (interface)
  ├── GitHubToolProvider    ✅ (4 tools)
  └── AzureReposToolProvider ❌ (scaffold, returns [])

McpRegistry (Injectable)
  ├── registerProvider(provider)
  ├── getTools(context) → ToolDefinition[]
  ├── toOpenAITools(context) → OpenAI function specs
  └── executeTool(context, name, args) → string
```

**Current Gaps:**

| Item | Status | Action Needed |
|------|--------|---------------|
| GitHub provider | ✅ Done | — |
| Azure Repos provider | ❌ Scaffold only | Implement when Azure Repos is needed |
| `search_code` is path-only | ⚠️ Limited | Consider adding content-based grep via GitHub Search API |
| No `write_file` tool | ⚠️ Missing | Needed if we want agents to test changes in-loop |
| Token counting on tool results | ✅ Done | Pre-flight counting + smart max_tokens via `computeMaxOutputTokens()` |
| File truncation strategy | ✅ Done | Auto-truncate tool results > 30K tokens (60% head / 40% tail) |

### 4b. RAG Index Layer (Pre-computed semantic context)

**Purpose:** Before the Planner starts its tool loop, retrieve the most relevant files using vector similarity. This reduces tool calls and gives better starting context.

**Current State:** ✅ **Implemented** — Azure AI Search (basic tier) with hybrid retrieval (BM25 + HNSW vector + semantic reranker).

**Architecture:**

```
┌─────────────────────────────────────────────────────┐
│           RAG Pipeline (Azure AI Search)            │
│                                                     │
│  1. Sync repo tree via GitHub API                   │
│  2. For each file:                                  │
│     a. AST-aware chunking (function/class/block)    │
│     b. Embed chunks → text-embedding-3-large (3072) │
│     c. Upload to Azure AI Search index              │
│  3. On query (pipeline Context stage):              │
│     a. Hybrid search: BM25 + vector cosine + rerank │
│     b. Return top-K chunks with scores              │
│     c. Inject as ragContext into Planner prompt      │
└─────────────────────────────────────────────────────┘
```

**Infrastructure:**

- **Azure AI Search:** `trooper-search.search.windows.net` (basic tier, East US, rg: venk)
- **Index:** `code-chunks` — HNSW cosine, semantic config with cross-encoder reranker
- **SDK:** `@azure/search-documents`
- **No pgvector / no Prisma migration needed** — vectors stored entirely in Azure AI Search

**Key Files:**

| File | Purpose |
|------|---------|
| `apps/api/src/modules/indexing/chunker.ts` | AST-aware code chunking (TS/JS/Python/Go/Rust/C#/Java + sliding window fallback) |
| `apps/api/src/modules/indexing/rag.service.ts` | Full RAG service — index management, sync, hybrid query, browse/stats |
| `apps/api/src/modules/indexing/indexing.controller.ts` | REST endpoints: sync, stats, files, chunks, search |
| `apps/web/src/app/indexing/page.tsx` | Tabbed UI (Status / Files / Search) |

| Item | Status |
|------|--------|
| `LlmService.embed()` / `embedBatch()` | ✅ Done |
| `IndexState` Prisma model | ✅ Done |
| Azure AI Search resource + index | ✅ Done |
| AST-aware chunking strategy | ✅ Done |
| Indexing service (sync → chunk → embed → upload) | ✅ Done |
| Hybrid query retrieval (BM25 + vector + reranker) | ✅ Done |
| Pipeline Context stage (RAG → Planner) | ✅ Done |
| Frontend RAG Index page (Status/Files/Search tabs) | ✅ Done |
| Frontend "Re-sync Now" button | ✅ Done |
| Graceful degradation (skip RAG if not configured) | ✅ Done |

---

## 5. Layer 3 — Planning Agent (Thinker)

**Purpose:** Autonomously explore the repository and produce a structured, actionable plan.

**Model:** GPT-4.1 (`gpt-4.1-214778`)

### Planning Flow

```
1. Receive: user query + file tree + RAG-retrieved context
2. Tool loop (max 10 iterations):
   - LLM requests tool calls (read_file, list_directory, etc.)
   - Tools execute against SCM provider
   - Results appended to conversation
   - Repeat until LLM produces a text response
3. Structured output call:
   - Force JSON Schema response (Plan)
   - Parse and validate
```

### Plan Schema

```typescript
interface Plan {
  summary: string;      // 1-2 sentence overview
  reasoning: string;    // Why this plan is correct
  tasks: PlanTask[];    // One task per file
}

interface PlanTask {
  path: string;                  // Relative file path
  action: 'create' | 'modify';  // What to do
  description: string;           // Detailed instructions
}
```

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Planner system prompt | ✅ Done | — |
| Tool-calling loop (`chatWithTools`) | ✅ Done | — |
| Structured output (JSON Schema) | ✅ Done | — |
| RAG context injection before planning | ❌ Missing | Inject top-K relevant file chunks |
| Token budget management | ❌ Missing | Track tokens consumed by tool results, truncate large files |
| Planner can request `delete` action | ❌ Missing | Add `'delete'` to task actions |
| Plan dependency ordering | ⚠️ Manual | Planner prompt says "order logically" but no enforcement |
| Multi-step plans (plan A depends on plan B) | ❌ Not supported | Future: task dependencies DAG |

---

## 6. Layer 4 — Human-in-the-Loop Gate

**Purpose:** Pause the pipeline after planning so a human can review, approve, reject, or modify the plan before code is generated.

### Approval Flow

```
Plan generated → AgentRun status = "awaiting_approval" → PAUSE

User action:
  ├── Approve  → POST /pipeline/runs/:id/approve → Phase 2 executes
  ├── Reject   → POST /pipeline/runs/:id/reject  → Re-run Phase 1 with new query
  └── (Cancel) → No endpoint yet
```

### Frontend UX

The approval card shows:
- Plan summary
- Reasoning (from Planner)
- Task list with file paths, actions (create/modify badges), and descriptions
- Approve / Reject buttons
- Reject provides a textarea to refine the query

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Approve endpoint | ✅ Done | — |
| Reject with new query | ✅ Done | — |
| Cancel endpoint | ❌ Missing | Add `POST /pipeline/runs/:id/cancel` |
| Edit plan before approving | ❌ Missing | Allow user to add/remove/edit tasks inline |
| Approval timeout (auto-expire) | ❌ Missing | Optional: expire plans after N hours |
| Notification (email/Teams/Slack) | ❌ Missing | Notify user when plan is ready |

---

## 7. Layer 5 — Execution Orchestrator (Workers)

**Purpose:** Generate actual code changes using parallel sub-agents, one per file.

**Model:** GPT-4.1-mini (`gpt-4.1-mini`)

### Execution Pattern

```
Plan (N tasks)
  │
  ├── Task 1 ──▶ Coder Agent 1 ──▶ file content 1
  ├── Task 2 ──▶ Coder Agent 2 ──▶ file content 2
  ├── Task 3 ──▶ Coder Agent 3 ──▶ file content 3
  └── Task N ──▶ Coder Agent N ──▶ file content N
  │
  ▼ (all run in parallel via Promise.all)
  Collected changes[]
```

### Coder Prompt Structure

Each Coder receives:
1. Overall goal (user query)
2. Plan summary
3. Its specific task (file path, action, description)
4. For `modify` tasks: the current file content (fetched via MCP)
5. List of other tasks (so it knows what sister agents are doing)

### Output Format

- **Create tasks:** Full file content (complete output).
- **Modify tasks:** Search/replace blocks — each block identifies exact lines to find and their replacement. Falls back to full-file if no blocks detected.

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Parallel dispatch via `Promise.all` | ✅ Done | — |
| `modify` tasks: fetch existing content first | ✅ Done | — |
| Cross-task context (other files listed) | ✅ Done | — |
| Markdown fence stripping | ✅ Done | — |
| **Search/replace edit format** | ✅ Done | Modify tasks use SEARCH/REPLACE blocks; create tasks use full-file |
| Per-file token budget | ❌ Missing | Cap output tokens per coder |
| Coder retries on malformed output | ❌ Missing | If output looks wrong, retry once |
| `delete` action support | ❌ Missing | Handle file deletion in the pipeline |

### Target: Edit Format for Modify Tasks

Instead of outputting entire files, Coders should output **search-and-replace blocks**:

```
function oldFunction() {
  return "new and improved";
}
```

Benefits:
- Fewer tokens consumed (only changed regions)
- Less hallucination risk (unchanged code preserved exactly)
- Easier to review (diff-like output)
- Standard format used by SWE-agent and Aider

---

## 8. Layer 6 — Review, Sandbox Verification & Self-Correction Loop

**Purpose:** Validate generated code for correctness before submission using a **dual-verification system**: LLM review + sandbox code execution. The loop runs up to a configurable iteration limit (default: 5). When the limit is reached, the user can choose to **Continue** iterating or **Submit as-is** — mirroring GitHub Copilot agent mode's "continue iteration" pattern.

### Verification Flow

```
Generated changes[]
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│      Code → Verify → Fix Loop (max N iterations)        │
│                                                          │
│  for attempt = 1..maxIterations:                         │
│    │                                                     │
│    ├── 1. LLM Reviewer Agent (worker model)              │
│    │   └── 6-point verification checklist:                │
│    │       syntax, imports, types, cross-file coherence,  │
│    │       plan adherence, edge cases                     │
│    │                                                     │
│    ├── 2. Sandbox Verification (Azure Container Apps)     │
│    │   └── Clone repo → apply changes → auto-detect      │
│    │       project type → run build/lint/test →           │
│    │       parse real compiler errors                     │
│    │                                                     │
│    ├── Both pass → proceed to Mask/PR  ✅                 │
│    │                                                     │
│    └── Either fails →                                    │
│        → Combine LLM review issues + real sandbox errors │
│        → Targeted re-gen (only failed files)             │
│        → Feed actual compiler output to coders           │
│        → Loop ↑                                          │
│                                                          │
│  Iteration limit reached →                               │
│    → Pause with status "awaiting_continuation"           │
│    → User clicks "Continue" (more iterations) or         │
│      "Submit as-is" (proceed to Mask/PR)                 │
└──────────────────────────────────────────────────────────┘
```

### Sandbox: Azure Container Apps Dynamic Sessions

Trooper uses **Azure Container Apps Dynamic Sessions** for secure, isolated code execution:

| Property | Detail |
|----------|--------|
| Isolation | Hyper-V (VM-level, not just container) |
| Lifecycle | Ephemeral per-run, auto-cleaned |
| API | REST — `POST /code/execute`, `POST /files/upload` |
| Security | No persistent storage, network-isolated, time-limited |
| Detection | Auto-detects project type (TypeScript, JS, Python) |
| Fallback | Graceful degradation when not configured (review-only) |

**Environment variables:**
- `ACA_POOL_ENDPOINT` — Session pool URL
- `ACA_POOL_SECRET` — API key

**Verification commands (auto-detected):**
- TypeScript: `npm install && npx tsc --noEmit`
- JavaScript: `npm install && npx eslint .`
- Python: `pip install -r requirements.txt && python -m py_compile`

### Iteration Limit & Continue

| Setting | Default | Description |
|---------|---------|-------------|
| `maxIterations` | 5 | Max fix cycles per run |
| `AwaitingContinuation` | — | Status when limit reached |
| Continue | +5 more | Resumes the loop for more iterations |
| Submit as-is | — | Skips to mask → PR with current code |

**API Endpoints:**
- `POST /pipeline/runs/:id/continue` — Resume with more iterations
- `POST /pipeline/runs/:id/submit` — Submit current changes as-is

### Review Schema

```typescript
interface ReviewResult {
  approved: boolean;
  issues: string[];        // Description of each problem
  fixes: Array<{
    path: string;          // Which file has the issue
    description: string;   // What needs to change
  }>;
}
```

### Reviewer Verification Checklist

The reviewer acts as a virtual linter + type checker + correctness auditor:

1. **Syntax & Correctness** — Missing brackets, unclosed strings, invalid tokens
2. **Imports & References** — Missing/unused imports, unresolved modules
3. **Type Consistency** — Argument types match, return types consistent, valid property accesses
4. **Cross-File Coherence** — Exports match imports across changed files, API signatures consistent
5. **Plan Adherence** — Code implements what the plan described, no hallucinated features
6. **Edge Cases & Robustness** — Null checks, async/await, error handling on I/O

### Current State

| Item | Status | Notes |
|------|--------|-------|
| LLM Reviewer (6-point checklist) | ✅ | Enhanced prompt in `prompts.ts` |
| Sandbox verification (ACA Dynamic Sessions) | ✅ | `sandbox.service.ts` |
| Iteration-limited loop | ✅ | Replaced token-budget with `for` loop |
| Targeted per-file re-gen | ✅ | Only flagged files re-generated |
| Continue / Submit as-is | ✅ | API + UI with iteration counter |
| Real compiler error feedback | ✅ | Sandbox output parsed and fed to coders |

---

## 9. Layer 7 — Security & Masking

**Purpose:** Scan all generated code for secrets, credentials, and sensitive data before committing.

### Masking Architecture

```
Generated code
  │
  ▼
MaskingEngine
  ├── Load rules from MaskingRule table (DB-driven)
  ├── Apply built-in patterns (AWS keys, GitHub PATs, etc.)
  ├── Apply user-defined custom patterns
  ├── Replace matches with ***MASKED***
  ├── Write MaskingAuditEntry for each match
  └── Return masked code + audit summary
```

### Built-in Patterns

| Pattern | Regex | Description |
|---------|-------|-------------|
| AWS Access Key | `AKIA[0-9A-Z]{16}` | AWS IAM access key |
| GitHub PAT | `ghp_[a-zA-Z0-9]{36}` | GitHub personal access token |
| GitHub OAuth | `gho_[a-zA-Z0-9]{36}` | GitHub OAuth token |
| OpenAI Key | `sk-[a-zA-Z0-9]{48}` | OpenAI API key |
| Private Key | `-----BEGIN (RSA\|EC )?PRIVATE KEY-----` | PEM private keys |
| Azure Connection String | `AccountKey=[A-Za-z0-9+/=]{44,}` | Azure storage keys |
| Generic High Entropy | (TBD) | High-entropy strings near `password`, `secret`, `token` keywords |

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Hardcoded regex patterns in `maskSecrets()` | ✅ Removed | Replaced with DB-driven approach |
| MaskingRule CRUD API | ✅ Done | — |
| MaskingRule DB model | ✅ Done | — |
| Pipeline loads DB rules | ✅ Done | `maskSecrets()` loads enabled rules from `MaskingRule` table |
| MaskingAuditEntry written per match | ✅ Done | Audit entry created for each matched pattern per run |
| User-defined custom regex | ✅ Done | Custom rules with `regex` field applied alongside built-in rules |
| Block commit if critical secrets found | ❌ Missing | Option to fail instead of mask |
| Secret entropy detection | ❌ Missing | Heuristic for high-entropy strings |

---

## 10. Layer 8 — Git Operations & PR Submission

**Purpose:** Create a branch, commit generated files, and open a pull request.

### Git Flow

```
1. Create branch: trooper/<runId-suffix>
2. Commit all changed files with descriptive message
3. Open PR: base=targetBranch, head=trooper branch
4. Persist PR record in database
5. Update WorkItem status to "awaiting_review"
6. Update AgentRun with branch name, PR number
```

### Idempotency

Both `createBranch` and `createPullRequest` are idempotent:
- `createBranch`: checks if branch exists before creating
- `createPullRequest`: checks for existing open PR with same head/base before creating

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Branch creation (idempotent) | ✅ Done | — |
| File commits via GitHub Trees API | ✅ Done | — |
| PR creation (idempotent) | ✅ Done | — |
| PR record in DB | ✅ Done | — |
| WorkItem status update | ✅ Done | — |
| Branch naming convention | ✅ `trooper/<suffix>` | — |
| PR body with plan details | ✅ Done | — |
| File deletion support | ❌ Missing | Need to handle `delete` tasks in commit |
| Multi-commit (separate commit per file) | ❌ Not done | Consider for large changesets |
| Draft PR option | ❌ Missing | Open as draft PR first |
| Auto-assign reviewers | ❌ Missing | Use `LinkedRepository.defaultReviewer` |
| PR status webhook tracking | ❌ Missing | Track merged/closed status via webhooks |

---

## 11. Layer 9 — Observability & Tracing

**Purpose:** Full visibility into what the agent did, why it did it, and how long each step took.

### Step Tracing

Every pipeline stage writes `AgentStep` records:

```typescript
interface AgentStep {
  id: string;
  runId: string;
  type: AgentStepType;      // reasoning | tool_call | code_gen | masking | git_op | error
  status: string;           // running | completed | failed
  label: string;            // "[stage] Human-readable label"
  detail: string | null;    // Extended info (tool args, file paths, errors)
  order: number;
  durationMs: number | null;
  timestamp: Date;
}
```

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Step creation per stage | ✅ Done | — |
| Running → completed status transition | ✅ Done | — |
| Error step on failure | ✅ Done | — |
| `durationMs` tracking | ✅ Done | Auto-computed on step status transitions |
| Tool call logging (Planner exploration) | ⚠️ Partial | Logged to console, not to AgentStep |
| LLM token usage tracking | ✅ Done | `totalTokens`, `totalPromptTokens`, `totalCompletionTokens` persisted on AgentRun |
| Cost estimation | ❌ Missing | Calculate $ cost from token usage |
| Real-time step updates (SSE) | ✅ Done | `GET /pipeline/runs/:id/stream` via `@nestjs/event-emitter` + NestJS `@Sse()` |

### Token Counting & Context Window Management

**Status:** ✅ Implemented — `gpt-tokenizer` (o200k_base encoding, GPT-4.1 family).

**Key files:**
| File | Purpose |
|------|---------|
| `apps/api/src/modules/llm/tokenizer.ts` | Core utilities: counting, truncation, usage tracking |
| `apps/api/src/modules/llm/llm.service.ts` | Pre-flight counting, smart `max_tokens`, tool result truncation |
| `apps/api/src/modules/llm/execution-orchestrator.service.ts` | Usage accumulation across plan/code/review phases |
| `apps/api/src/modules/pipeline/pipeline.service.ts` | Persists token totals on `AgentRun` |

**Capabilities:**
- **Pre-flight token counting** — `countMessageTokens()` estimates prompt size before each LLM call
- **Smart max_tokens** — `computeMaxOutputTokens()` dynamically sets max output within context window (thinker: 1M ctx / 32K out, worker: 1M ctx / 16K out)
- **Tool result truncation** — Results exceeding 30K tokens are truncated (60% head / 40% tail) to prevent context overflow
- **Usage accumulation** — Token usage is tracked across all LLM calls in a run and summed into `totalPromptTokens`, `totalCompletionTokens`, `totalTokens`
- **Persistence** — Grand total stored on `AgentRun` in PostgreSQL, displayed in run detail UI

---

## 12. Cross-Cutting — Identity & Multi-Provider

**Purpose:** Support multiple Git providers (GitHub, Azure Repos) with flexible identity management.

### Data Model

```
Connection (1) ──▶ (*) LinkedAccount
Connection (1) ──▶ (*) LinkedRepository
LinkedRepository ──▶ LinkedAccount (optional: "assume" identity)
```

### Identity Modes

| Mode | Behavior |
|------|----------|
| `service_account` | Trooper commits as itself using its own PAT/App token |
| `assume_user` | Trooper commits as a linked user (e.g., the developer who owns the work item) |

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Connection CRUD | ✅ Done | — |
| LinkedAccount CRUD | ✅ Done | — |
| LinkedRepository CRUD | ✅ Done | — |
| Zod validation on Connection | ✅ Done | Fix `identityMode` field mismatch |
| **Pipeline uses env var, not Connections** | ❌ **Disconnected** | **P3: Resolve credentials from Connection/LinkedRepo at trigger time** |
| GitHub App auth flow | ❌ Not implemented | Future: OAuth callback |
| Azure Repos AAD/SP auth | ❌ Not implemented | Future with AzureReposToolProvider |
| Token refresh on expiry | ❌ Not implemented | Check `expiresAt`, refresh if `expiring` |

---

## 13. Cross-Cutting — Webhooks & Event-Driven Triggers

**Purpose:** React to external events (push, PR created, issue opened) to auto-trigger pipeline runs.

### Target Flow

```
GitHub/Azure Repos ──webhook──▶ POST /api/webhooks/receive
  │
  ▼
Parse event type + payload
  │
  ├── issue.opened → create WorkItem + trigger pipeline
  ├── push (to monitored branch) → re-index repo
  ├── pull_request.review_submitted → update PR status in DB
  └── (unknown) → log and ignore
```

### Current State & Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| WebhookConfig CRUD | ✅ Done | — |
| **Inbound webhook receiver** | ✅ **Done** | `POST /webhooks/receive` with HMAC-SHA256 verification |
| Event routing (type → action) | ✅ Done | `issues.opened` → auto-trigger pipeline |
| Webhook signature verification | ✅ Done | HMAC-SHA256 with `GITHUB_WEBHOOK_SECRET` env var, timing-safe compare |
| Re-index on push | ❌ Missing | Depends on RAG pipeline |

---

## 14. Frontend — Dashboard & UX

### Pages

| Page | Route | Backend API | Status |
|------|-------|-------------|--------|
| Dashboard | `/` | `GET /dashboard` | ✅ Working |
| Issues | `/issues` | `GET /pipeline/repos/:owner/:repo/issues` | ✅ Working (repo selector, labels, comments, trigger agent) |
| Agent Runs | `/agent` | `GET /agent/runs` | ✅ Working |
| Run Detail | `/agent/[runId]` | `GET /pipeline/runs/:id` + SSE `/stream` | ✅ Working (real-time SSE, pipeline progress, approval card) |
| Work Items | `/work-items` | `GET /work-items` | ✅ Working |
| Pull Requests | `/pull-requests` | `GET /pull-requests` | ✅ Working |
| RAG Index | `/indexing` | `GET/POST /indexing/*` | ✅ Working (Status/Files/Search tabs) |
| Connections | `/settings` | `GET /connections` | ✅ Working |
| Repositories | `/repos` | `GET /pipeline/repos` | ✅ Working (browse repos, search, index status) |
| Repo Context Hub | `/repos/[owner]/[repo]` | Multiple endpoints | ✅ Working (Issues/PRs/Security tabs, auto-draft, security audit) |

### Frontend Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| Real-time step updates (SSE) | ✅ Done | EventSource-based live streaming in run detail |
| Issues browser (trigger from issue) | ✅ Done | Repo selector, label badges, comments, "Run Agent" button |
| Repo Context Hub (Azure Portal-style) | ✅ Done | Tabbed blade UI — Issues, PRs, Security — with auto-draft |
| Repository listing page | ✅ Done | Browse repos, search, index status badges, nav to context hub |
| Draft Approval status in UI | ✅ Done | `AwaitingDraftApproval` in run list + run detail, DraftApproval pipeline stage |
| Security audit trigger in UI | ✅ Done | "Run Security Audit" button with severity filter, inline results |
| Inline plan editing before approval | ❌ Missing | Editable task list |
| Token/cost display per run | ❌ Missing | Show LLM usage metrics |
| Dark/light theme toggle | ✅ Done | — |
| RAG Index with real data | ✅ Done | Tabbed UI with sync, file browse, hybrid search |
| Diff viewer for generated code | ❌ Missing | Show before/after for modify tasks |

---

## 15. Infrastructure & Deployment

### Current Setup

| Resource | Service | Region |
|----------|---------|--------|
| PostgreSQL | Azure Flexible Server (`trooper-db-dev`) | — |
| AI Foundry | `ai-summarizer-venk` (AIServices) | — |
| GPT-4.1 | Deployment `gpt-4.1-214778` (GlobalStandard) | — |
| GPT-4.1-mini | Deployment `gpt-4.1-mini-637029` (GlobalStandard) | — |
| Embeddings | Deployment `text-embedding-3-large-355662` (GlobalStandard) | — |
| Azure AI Search | `trooper-search` (basic tier) | East US |
| API Server | Local dev (`npm run dev`, port 3001) | localhost |
| Frontend | Local dev (Turbopack, port 5000) | localhost |

### Deployment Gaps

| Item | Status | Action Needed |
|------|--------|---------------|
| `.env` credentials in repo | ✅ Gitignored | `.env` in `.gitignore` — safe from commits |
| `.gitignore` for `.env` | ✅ Verified | `.env`, `.env.local`, `.env.*.local` all gitignored |
| CORS configuration | ✅ Configurable | Uses `CORS_ORIGIN` env var (defaults to `http://localhost:5000`) |
| Database indexes | ✅ Added | Indexes on `AgentStep.runId`, `AgentRun.status`, `PullRequest.runId/status`, `MaskingAuditEntry.runId` |
| Container deployment (Docker) | ❌ Not set up | Dockerize API + frontend |
| Azure App Service / Container Apps | ❌ Not deployed | Deploy for production |
| CI/CD pipeline (GitHub Actions) | ⚠️ Exists but commented out | Activate and fix |
| Azure AI Search | ✅ Done | `trooper-search` basic tier, East US |

---

## 16. Universal SCM Abstraction

### Overview

The SCM abstraction layer decouples Trooper from GitHub-specific APIs, enabling future support for GitLab, Bitbucket, Azure DevOps, and other providers through a unified interface.

### Architecture

```
┌─────────────────────────────────────────────────┐
│                  ScmRegistry                     │
│       register() · get() · resolveForRepo()      │
├──────────┬──────────┬──────────┬────────────────┤
│  GitHub  │  GitLab  │ Bitbucket│  Azure DevOps  │
│    ✅    │  planned │  planned │    planned     │
└──────────┴──────────┴──────────┴────────────────┘
```

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| `ScmProvider` interface | `scm/scm.types.ts` | Universal contract: repos, issues, PRs, security, git ops, forks |
| `ScmCapabilities` | `scm/scm.types.ts` | Feature flags per provider (`issues`, `pullRequests`, `security`, `fork`) |
| `GitHubScmProvider` | `scm/github.scm-provider.ts` | Full Octokit-based GitHub implementation (~420 lines) |
| `ScmRegistry` | `scm/scm.registry.ts` | Provider registry/factory — register, lookup, resolve by repo URL |

### ScmProvider Interface

```typescript
interface ScmProvider {
  readonly type: string;
  readonly capabilities: ScmCapabilities;
  // Repository operations
  listRepos(): Promise<ScmRepo[]>;
  getRepoTree(repoFullName, ref?): Promise<ScmRepoFile[]>;
  getFileContent(repoFullName, path, ref?): Promise<ScmFileContent>;
  // Issues & PRs
  listIssues(repoFullName): Promise<ScmIssue[]>;
  getIssue(repoFullName, issueNumber): Promise<ScmIssueDetail>;
  listPullRequests(repoFullName): Promise<ScmPullRequest[]>;
  // Security
  listSecurityAlerts(repoFullName): Promise<ScmSecurityAlert[]>;
  // Git operations
  createBranch(repoFullName, branchName, fromRef?): Promise<void>;
  commitFiles(repoFullName, branch, message, files): Promise<string>;
  createPullRequest(repoFullName, title, body, head, base): Promise<ScmCreatedPR>;
  // Cross-repo (fork-and-PR)
  forkRepo(repoFullName): Promise<ScmForkResult>;
  createCrossRepoPR(upstream, fork, title, body, head, base): Promise<ScmCreatedPR>;
}
```

### Registration Flow

```
PipelineModule.onModuleInit()
  → scmRegistry.register('github', githubScmProvider)
  → default provider set to 'github'

PipelineService / PipelineController
  → scmRegistry.resolveForRepo(repoFullName)  // returns provider instance
  → provider.listIssues(...) / provider.commitFiles(...) etc.
```

### Provider Status

| Provider | Status | Capabilities |
|----------|--------|--------------|
| GitHub | ✅ Implemented | issues, PRs, security (Dependabot + CodeQL), fork, cross-repo PR |
| GitLab | ❌ Planned | — |
| Bitbucket | ❌ Planned | — |
| Azure DevOps | ❌ Planned | — |

---

## 17. Context-Aware Drafting System

### Overview

The drafting system enables auto-generation of task queries from contextual data (issues, PRs, security alerts) using LLM-powered analysis, with human approval before pipeline execution.

### Pipeline Flow

```
Context (Issue/PR/Security Alert)
  ↓
TaskDrafterService.draftFromContext()     ← LLM generates task query
  ↓
PipelineService.triggerFromContext()       ← Creates run with AwaitingDraftApproval
  ↓
User reviews draft in UI
  ↓
POST /runs/:runId/approve-draft           ← Optional query override
  ↓
PipelineService.approveDraft()            ← Transitions to Running → executePhase1
```

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| `TaskDrafterService` | `drafting/task-drafter.service.ts` | LLM-powered query generation from `TaskContext` |
| `SecurityAnalysisService` | `drafting/security-analysis.service.ts` | Security alert aggregation, severity summary, batch audit |
| `TaskContext` type | `packages/shared/src/types.ts` | Universal context object for all trigger sources |

### TaskContext Type

```typescript
interface TaskContext {
  type: 'issue' | 'pull_request' | 'security' | 'manual';
  repositoryFullName: string;
  refNumber?: number;
  title?: string;
  body?: string;
  alertType?: string;       // 'dependabot' | 'code_scanning' | 'secret_scanning'
  severity?: string;        // 'critical' | 'high' | 'medium' | 'low'
  affectedComponent?: string;
}
```

### New Pipeline Status & Stage

| Addition | Enum | Value | Purpose |
|----------|------|-------|---------|
| `AwaitingDraftApproval` | `AgentRunStatus` | `"awaiting_draft_approval"` | Run paused pending user review of auto-drafted query |
| `DraftApproval` | `PipelineStage` | `"draft_approval"` | Pipeline stage between Receive and Fetch |

### API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/pipeline/draft` | Auto-draft task from `TaskContext` |
| `POST` | `/pipeline/runs/:runId/approve-draft` | Approve draft (optional `overrideQuery`) |
| `GET` | `/pipeline/repos/:o/:r/pulls` | List pull requests for a repo |
| `GET` | `/pipeline/repos/:o/:r/security` | Get security summary (counts by severity) |
| `GET` | `/pipeline/providers` | List registered SCM providers + capabilities |

---

## 18. Security Audit Pipeline

### Overview

Batch security audit mode scans all security alerts for a repository, filters by severity, and auto-creates draft pipeline runs for each qualifying alert.

### Flow

```
POST /pipeline/repos/:owner/:repo/security/audit?minSeverity=high
  ↓
SecurityAnalysisService.batchDraftSecurityFixes()
  ↓ for each alert matching severity threshold:
  │  ├─ alertToTaskContext() → TaskContext
  │  └─ PipelineService.triggerFromContext() → AwaitingDraftApproval run
  ↓
Returns array of { alertId, alertTitle, runId, status }
```

### Severity Filtering

Alerts are filtered using a severity hierarchy: `critical > high > medium > low`. The `minSeverity` query parameter sets the minimum threshold — only alerts at or above this level are processed.

### Security Alert Types

| Source | Alert Type | Data |
|--------|-----------|------|
| Dependabot | `dependabot` | Vulnerable dependencies, CVEs, affected package/version |
| CodeQL | `code_scanning` | Static analysis findings, rule violations |
| Secret Scanning | `secret_scanning` | Exposed secrets (fetched via ScmProvider, not yet batch-audited) |

### SecuritySummary Response

```typescript
interface SecuritySummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  alerts: ScmSecurityAlert[];
}
```

### UI Integration

The Security tab in the Repo Context Hub displays:
- Summary cards with severity counts (color-coded)
- Full alert listing with "Draft Fix" buttons per alert
- "Run Security Audit" button for batch processing
- Inline audit results with links to each created run

---

## 19. Status Matrix

### Implementation Priority

| # | Item | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 1 | Wire Reviewer into pipeline after code_gen | **P0** | S | ✅ Done |
| 2 | Load masking rules from DB + write audit entries | **P0** | S | ✅ Done |
| 3 | Switch Coders to search/replace edit format (modify tasks) | **P1** | M | ✅ Done |
| 4 | Sandbox code execution (Azure Container Apps Dynamic Sessions) | **P1** | M | ✅ Done (Hyper-V isolated, auto-detect project type) |
| 5 | RAG pipeline: chunk → embed → store → query | **P2** | L | ✅ Done (Azure AI Search, hybrid retrieval) |
| 6 | Token counting + context window management | **P2** | S | ✅ Done (gpt-tokenizer o200k_base, smart context mgmt) |
| 7 | Step duration tracking (`durationMs`) | **P2** | S | ❌ Not populated |
| 8 | Token/cost tracking per run | **P2** | S | ✅ Done (persisted on AgentRun, displayed in UI) |
| 9 | RAG auto-indexing in pipeline | **P1** | S | ✅ Done (auto-sync on unindexed repos in Phase 1) |
| 10 | Enhanced reviewer prompt (6-point checklist) | **P1** | S | ✅ Done (syntax, imports, types, coherence, plan, edge cases) |
| 11 | New Task page with index status + inline indexing | **P1** | S | ✅ Done (badges, inline Index Now / Re-sync) |
| 12 | Iteration limit + Continue / Submit as-is UI | **P1** | M | ✅ Done (default 5 iters, pause + user decides) |
| 13 | Use Connections instead of env vars for auth | **P3** | M | ❌ Disconnected |
| 14 | Webhook receiver endpoint | **P3** | M | ❌ CRUD exists, no receiver |
| 15 | `delete` file action support | **P3** | S | ❌ Not handled |
| 16 | Draft PR support | **P3** | S | ❌ Not implemented |
| 17 | SSE/WebSocket for real-time step updates | **P1** | M | ✅ Done (SSE via `@nestjs/event-emitter`, EventSource on frontend) |
| 18 | Multi-tenant RAG (tenantId pre-filter) | **P1** | M | ✅ Done (shared pooled index, OData pre-filter) |
| 19 | Dedicated Silo Index (Enterprise tier) | **P3** | L | 🚧 Planned (per-tenant index, routing layer) |
| 20 | Step duration tracking (`durationMs`) | **P2** | S | ✅ Done (auto-computed on step transitions) |
| 21 | GitHub Issues browser + trigger from issue | **P1** | M | ✅ Done (Issues page, repo selector, comments, "Run Agent") |
| 22 | Webhook receiver (inbound `issues.opened`) | **P1** | M | ✅ Done (HMAC-SHA256 verified, auto-triggers pipeline) |
| 23 | Universal SCM abstraction (multi-provider) | **P1** | L | ✅ Done (ScmProvider interface, ScmRegistry, GitHub impl) |
| 24 | Context-aware auto-drafting (LLM-powered) | **P1** | M | ✅ Done (TaskDrafterService, AwaitingDraftApproval flow) |
| 25 | Repo Context Hub (Azure Portal-style) | **P1** | M | ✅ Done (Issues/PRs/Security tabs, auto-draft buttons) |
| 26 | Repository listing page | **P2** | S | ✅ Done (browse repos, search, index status) |
| 27 | Security audit pipeline mode | **P1** | M | ✅ Done (batch audit by severity, per-alert draft runs) |
| 28 | GitLab SCM provider | **P2** | L | ❌ Planned |
| 29 | Bitbucket SCM provider | **P3** | L | ❌ Planned |
| 30 | Azure DevOps SCM provider | **P3** | L | ❌ Planned |

### Legend

- **P0:** Broken or disconnected — fix now
- **P1:** Core quality improvement — do next
- **P2:** Feature completion — important for production
- **P3:** Nice-to-have — defer unless easy
- **S/M/L:** Small (< 1 hour) / Medium (1-4 hours) / Large (4+ hours)

---

*Last updated: July 2025*
