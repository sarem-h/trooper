# Trooper — RAG Architecture & Integration Plan

> **Living document** — defines the target Retrieval-Augmented Generation architecture for Trooper, the Azure-first setup required to run it safely in production, and the phased integration plan across the current codebase.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Goals](#2-goals)
3. [Design Principles](#3-design-principles)
4. [Target Architecture](#4-target-architecture)
5. [Codebase Integration Map](#5-codebase-integration-map)
6. [Phase 0 — Azure Foundation](#6-phase-0--azure-foundation)
7. [Phase 1 — Indexing Pipeline](#7-phase-1--indexing-pipeline)
8. [Phase 2 — Retrieval Pipeline](#8-phase-2--retrieval-pipeline)
9. [Phase 3 — Copilot Integration](#9-phase-3--copilot-integration)
10. [Phase 4 — Pipeline Planner Integration](#10-phase-4--pipeline-planner-integration)
11. [Phase 5 — SWE and DevOps Intelligence](#11-phase-5--swe-and-devops-intelligence)
12. [Phase 6 — Observability, Security, and Operations](#12-phase-6--observability-security-and-operations)
13. [Phase 7 — Rollout and Verification](#13-phase-7--rollout-and-verification)
14. [Implementation Backlog](#14-implementation-backlog)
15. [Definition of Done](#15-definition-of-done)

---

## 1. Purpose

Trooper needs a production-grade RAG system that helps software engineers and DevOps users answer the questions that matter during delivery work:

1. What code is relevant to this task?
2. What changed recently and what is impacted?
3. Which tests, configs, workflows, and runbooks matter here?
4. Is the generated summary, plan, or code suggestion grounded in real repository evidence?

This document defines the industry-standard target architecture and how it should integrate into the current Trooper monorepo.

---

## 2. Goals

### Product Goals

1. Give Copilot and the planning pipeline trustworthy repository context.
2. Improve issue, PR, security, and work-item analysis with grounded evidence.
3. Support both code-centric and operations-centric queries.
4. Keep context fresh as repositories change.

### Engineering Goals

1. Use Azure-native managed services where they fit cleanly.
2. Support multi-tenant isolation.
3. Make retrieval observable and measurable.
4. Allow graceful degradation when retrieval is unavailable.
5. Minimize re-index cost through incremental sync.

---

## 3. Design Principles

### Industry-Standard Principles

1. **Hybrid retrieval first**
   Use lexical search, vector similarity, and semantic reranking together. Pure vector search is not sufficient for codebases.

2. **Repository-aware chunking**
   Code should be chunked around semantic boundaries such as classes, functions, methods, and preambles. Non-code assets should use structure-aware chunking where possible.

3. **Freshness over theoretical recall**
   A slightly smaller but fresh index is more useful than a stale comprehensive index.

4. **Explicit evidence injection**
   Retrieved artifacts should be labeled by file path, symbol, branch, and score before they are placed into prompts.

5. **Observable retrieval quality**
   Retrieval is only useful if we can measure coverage, relevance, latency, and failure rates.

6. **Secure by default**
   Secrets, internal tokens, and restricted content should never be indexed blindly.

---

## 4. Target Architecture

```
┌──────────────────────────────── Azure Subscription ────────────────────────────────┐
│                                                                                   │
│  Azure OpenAI                      Azure AI Search            Azure Monitor        │
│  ┌──────────────────────┐         ┌──────────────────────┐   ┌─────────────────┐ │
│  │ GPT models           │         │ code-chunks index    │   │ logs, traces,   │ │
│  │ text-embedding-3-*   │         │ doc-chunks index     │   │ metrics, alerts │ │
│  └──────────┬───────────┘         └──────────┬───────────┘   └────────┬────────┘ │
│             │                                │                         │          │
│             │ embed/query                    │ hybrid search           │          │
│             ▼                                ▼                         ▼          │
│      apps/api (NestJS) ───────────────► RAG service ─────────────► telemetry      │
│             │                                │                                    │
│             │                                │                                    │
│             │                        Prisma / PostgreSQL                          │
│             │                        IndexState, retrieval logs,                  │
│             │                        sync metadata, evaluations                   │
│             │                                                                     │
│             ├────────► Copilot summaries                                           │
│             ├────────► Pipeline planner context                                    │
│             └────────► Indexing APIs / status APIs                                 │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Retrieval Layers

1. **Metadata retrieval**
   Issue, PR, comments, reviews, alerts, work items.

2. **Repository retrieval**
   Code chunks, config files, docs, workflows, infrastructure assets.

3. **Graph retrieval**
   Symbol relationships, imports, dependents, tests, ownership, recent changes.

4. **Operational retrieval**
   CI/CD workflows, deployment manifests, Dockerfiles, runbooks, environment templates.

---

## 5. Codebase Integration Map

The target architecture should integrate with the current Trooper codebase as follows.

| Area | Current Location | Responsibility in Target Architecture |
|------|------------------|---------------------------------------|
| API bootstrap | `apps/api/src/main.ts` | Load config, initialize observability, expose RAG endpoints |
| Environment bootstrap | `apps/api/src/env.ts` | Load Azure and RAG settings from root `.env` |
| LLM provider | `apps/api/src/modules/llm/llm.service.ts` | Embeddings and model inference |
| Indexing module | `apps/api/src/modules/indexing/` | Chunking, sync, Azure Search upload, query, stats |
| Copilot module | `apps/api/src/modules/copilot/` | Ground issue/PR/security summaries with retrieved evidence |
| Pipeline module | `apps/api/src/modules/pipeline/` | Inject RAG context into planner workflows |
| Prisma service | `apps/api/src/prisma/` | Persist index state, sync metadata, future eval and retrieval logs |
| Shared schemas | `packages/shared/src/` | Trace schemas, retrieval DTOs, validation contracts |
| Indexing UI | `apps/web/src/app/indexing/` | Sync controls, file explorer, semantic search, health checks |
| Repo hub UI | `apps/web/src/app/repos/[owner]/[repo]/` | Display grounded traces, evidence panels, verification UX |

---

## 6. Phase 0 — Azure Foundation

This phase comes first. Trooper should not treat RAG as complete until the Azure platform layer is provisioned and validated in an industry-standard way.

### Status: ✅ COMPLETE (2026-03-10)

- Azure AI Search provisioned: `trooper-search` (basic tier, East US 2, `rg-trooper-dev`)
- Index `code-chunks` created with HNSW vector search + semantic reranker
- Azure OpenAI `text-embedding-3-large` embeddings validated (3072 dims)
- SDK connectivity confirmed from `apps/api`
- Semantic search enabled (free tier)
- `.env` updated with real credentials
- End-to-end sync + retrieval tested successfully (2 repos, 5 docs)

### Objective

Provision secure, production-ready Azure resources for embeddings, search, secrets, monitoring, and application identity.

### Required Azure Resources

| Resource | Purpose | Standard |
|----------|---------|----------|
| Azure OpenAI | Embeddings and LLM inference | Dedicated deployment per environment |
| Azure AI Search | Hybrid retrieval index storage | Separate search service per environment or strict index isolation |
| Azure Key Vault | Secrets and API keys | No long-term production secrets in `.env` |
| Azure Monitor + Application Insights | Traces, metrics, alerts | Required for production |
| Managed Identity | App-to-Azure auth | Preferred over raw API keys where supported |
| Storage Account | Optional staging, dead-letter payloads, evaluation artifacts | Recommended |

### Environment Strategy

1. Provision separate environments for `dev`, `staging`, and `prod`.
2. Use consistent naming, tags, and RBAC.
3. Keep indexes environment-scoped. Do not mix production and non-production documents.

### Security Standard

1. Store search keys and OpenAI credentials in Azure Key Vault.
2. Inject secrets into the API at deployment time.
3. Restrict network access where possible.
4. Log access and configuration changes.

### Recommended Azure Configuration

#### Azure OpenAI

1. Deploy a reasoning model for summary/planning.
2. Deploy `text-embedding-3-large` or a cost-tuned embedding alternative.
3. Define quotas per environment.

#### Azure AI Search

1. Use vector search with HNSW and cosine similarity.
2. Enable semantic ranking.
3. Keep a dedicated index per content domain if scale warrants it:
   - `code-chunks`
   - `doc-chunks`
   - `ops-chunks`
4. Use filters for `tenantId`, `repository`, `branch`, `contentType`, `language`, and classification.

### Minimum Configuration Contract

The API should support these settings, initially via `.env`, then via Key Vault-backed deployment configuration:

```bash
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_CHAT_DEPLOYMENT=
AZURE_OPENAI_EMBEDDER_DEPLOYMENT=

AZURE_SEARCH_ENDPOINT=
AZURE_SEARCH_API_KEY=
AZURE_SEARCH_INDEX_NAME=

AZURE_KEY_VAULT_NAME=
APPLICATIONINSIGHTS_CONNECTION_STRING=
```

### Deliverables

1. Azure resources exist for each environment.
2. Search index creation works from the API.
3. Embedding calls succeed from the API.
4. Secrets are no longer treated as local-only runtime configuration for production.
5. Telemetry is visible in Azure Monitor.

---

## 7. Phase 1 — Indexing Pipeline

### Status: 🟡 IN PROGRESS (2026-03-10)

- Background sync jobs implemented for `/api/indexing/sync`
- Polling endpoint implemented: `/api/indexing/jobs/:jobId`
- Incremental sync implemented with per-file SHA comparison
- Search index extended with `fileSha` and `contentType` metadata
- Repo classification added for code, docs, config, infra, and tests
- Verified unchanged repo re-sync skips embeddings and upload (`totalChunks: 0` on second sync)

### Objective

Turn repositories into searchable, fresh, structured retrieval assets.

### Scope

1. Repository file enumeration.
2. File filtering and classification.
3. Semantic chunking.
4. Embedding generation.
5. Bulk upload to Azure AI Search.
6. Sync state persistence.

### Content Types to Index

| Content Type | Examples | Priority |
|--------------|----------|----------|
| Source code | `.ts`, `.tsx`, `.js`, `.py`, `.go`, `.rs`, `.cs`, `.java` | High |
| Config | `package.json`, `tsconfig.json`, `eslint.config.*`, `.github/*` | High |
| Infra | `Dockerfile`, `docker-compose`, Terraform, Helm, Kubernetes YAML | High |
| Docs | `README.md`, `ARCHITECTURE.md`, ADRs, runbooks | High |
| Tests | unit, integration, e2e, contract tests | High |
| Generated artifacts | lockfiles, generated clients, minified bundles | Exclude or de-prioritize |

### Chunking Standard

1. Use AST-aware chunking for supported languages.
2. Preserve file preamble as a separate chunk.
3. Attach metadata to every chunk:
   - `tenantId`
   - `repository`
   - `branch`
   - `filePath`
   - `contentType`
   - `language`
   - `symbolName`
   - `chunkIndex`
   - `sha`
   - `updatedAt`
4. For unsupported files, use sliding-window chunking with overlap.

### Required Enhancements to Current Codebase

| Area | Current State | Required Change |
|------|---------------|-----------------|
| `chunker.ts` | Code-oriented chunking exists | Add content-type aware handling for docs, workflows, infra files |
| `rag.service.ts` | Full sync exists | Add incremental sync by file SHA |
| `IndexState` | Basic status exists | Track last commit SHA, sync duration, failure reason |
| GitHub ingestion | Reads tree and file content | Add webhook-friendly delta sync path |

### Industry Standard Sync Strategy

1. **Initial sync**
   Full repository indexing.
2. **Incremental sync**
   Re-index only changed files by comparing blob SHA or commit delta.
3. **Event-driven sync**
   Trigger on push, merge, or branch update.
4. **Scheduled drift repair**
   Periodic full validation sync for correctness.

### Deliverables

1. Full sync API works for repo and branch.
2. Incremental sync path exists.
3. Index includes code, docs, and ops assets.
4. Exclusion rules are explicit and test-covered.

---

## 8. Phase 2 — Retrieval Pipeline

### Status: 🟡 IN PROGRESS (2026-03-10)

- Hybrid retrieval is live against Azure AI Search
- Indexed status semantics corrected so `idle` is treated as healthy/synced
- Retrieval verified against `sarem-h/cs465-lab0`
- Remaining work is retrieval tuning, diagnostics, and richer filtering

### Objective

Return the most relevant evidence for a user query with predictable latency and measurable quality.

### Retrieval Flow

1. Normalize the incoming query.
2. Add context from task type:
   - issue
   - PR
   - security alert
   - work item
   - freeform engineering query
3. Build retrieval hints:
   - repo
   - branch
   - changed files
   - suspected symbols
   - content-type preferences
4. Execute hybrid retrieval.
5. Optionally rerank and deduplicate.
6. Build a compact evidence pack for prompt injection.

### Retrieval Strategy

| Step | Standard |
|------|----------|
| Lexical retrieval | BM25 over content and metadata |
| Vector retrieval | Embedding query against content vectors |
| Semantic rerank | Cross-encoder or Azure semantic ranker |
| Filter stage | Enforce tenant, repo, branch, and content scopes |
| Deduplication | Collapse near-identical chunks |
| Budgeting | Respect context budget by token or character limits |

### Required Enhancements to Current Codebase

| Area | Current State | Required Change |
|------|---------------|-----------------|
| `queryRelevantChunks` | Hybrid query exists | Add content-type filters and score diagnostics |
| Copilot prompt assembly | Injects chunks | Add retrieval rationale and chunk provenance |
| Retrieval tuning | Fixed top-K | Add dynamic top-K and result budgeting |
| Evaluation | Manual observation | Add offline and online retrieval evaluation |

### Retrieval Quality Metrics

1. Precision at K.
2. Mean reciprocal rank.
3. Query latency.
4. Zero-result rate.
5. Grounded-answer acceptance rate.
6. Fallback rate.

### Deliverables

1. Retrieval traces include scores, filters, and timing.
2. Top-K is configurable by use case.
3. Zero-result retrievals can be diagnosed quickly.
4. Retrieval quality is measured over a benchmark set.

---

## 9. Phase 3 — Copilot Integration

### Status: 🟡 IN PROGRESS (2026-03-10)

- Copilot Stage 2 verified end-to-end on `sarem-h/cs465-lab0` issue `#2`
- Verification result: `Retrieved 1 repository chunk`, `ragDegraded: false`
- Remaining work is richer evidence display, later-stage verification, and prompt/reranking improvements

### Objective

Make repository retrieval materially improve issue, PR, and security analysis in the Copilot flow.

### Integration Points

| Area | Current Path | Target Behavior |
|------|--------------|-----------------|
| Copilot grounding | `apps/api/src/modules/copilot/copilot.service.ts` | Retrieve repo evidence before prompt build |
| Shared schemas | `packages/shared/src/types.ts` and `schemas.ts` | Include retrieval traces and evidence metadata |
| Repo hub UI | `apps/web/src/app/repos/[owner]/[repo]/` | Show evidence, grounded status, stage-level diagnostics |

### Prompt Injection Standard

Retrieved evidence should be presented to the model in a structured format:

```text
Repository Evidence
- file: apps/api/src/modules/indexing/rag.service.ts
  symbol: queryRelevantChunks
  score: 0.92
  reason: matched hybrid retrieval against issue summary
  snippet: ...
```

### Answering Standard

Copilot responses should:

1. Distinguish between metadata evidence and repository evidence.
2. Cite file-level evidence internally in the trace.
3. Mark degraded mode when retrieval fails or yields zero useful context.
4. Avoid fabricating repository facts when no evidence was found.

### Required Enhancements

1. Add richer retrieval trace payloads.
2. Add explicit zero-result messaging in the UI.
3. Support targeted retrieval when issue or PR diff files are already known.
4. Add doc and config retrieval alongside code retrieval.

### Deliverables

1. Copilot Stage 2 consistently returns evidence when repositories are indexed.
2. Trace UI clearly shows why chunks were returned.
3. Response quality improves for code-grounded questions.

---

## 10. Phase 4 — Pipeline Planner Integration

### Objective

Use retrieval to improve the planner before code generation starts.

### Integration Points

| Area | Current Path | Target Behavior |
|------|--------------|-----------------|
| Planner context stage | `apps/api/src/modules/pipeline/` | Auto-sync if stale, retrieve relevant assets, inject into planner prompt |
| SCM provider layer | `apps/api/src/modules/pipeline/scm/` | Supply changed-file and branch metadata to retrieval |
| Planning prompts | planner services | Use retrieved code, docs, tests, and workflows as first-class context |

### Planner RAG Standard

1. Retrieve code patterns relevant to the task.
2. Retrieve tests and validation commands relevant to the task.
3. Retrieve deployment and workflow files when the task is operational.
4. Retrieve architecture docs when the query is broad or design-oriented.

### Required Enhancements

1. Add task-type aware retrieval profiles.
2. Add query decomposition for complex work items.
3. Add repository freshness checks before planning.
4. Add caching for repeated planner retrievals within the same run.

### Deliverables

1. Planner produces fewer generic plans.
2. Planner references actual repo conventions and tests.
3. Operational tasks include deployment and workflow context.

---

## 11. Phase 5 — SWE and DevOps Intelligence

Trooper should not stop at generic code retrieval. It should become useful for the actual work patterns of engineers.

### SWE-Focused Retrieval

| Need | Retrieval Target |
|------|------------------|
| Understand a feature area | implementation files, tests, docs, recent changes |
| Review a PR | diff files, touched modules, related tests, coding patterns |
| Debug a failure | error-handling code, recent commits, config, tests |
| Estimate impact | import graph, call sites, ownership, affected workflows |

### DevOps-Focused Retrieval

| Need | Retrieval Target |
|------|------------------|
| Diagnose deployment issues | Dockerfiles, manifests, workflows, env templates, runbooks |
| Understand CI failures | GitHub Actions, build scripts, package manager config, test commands |
| Assess operational risk | security alerts, infra config, dependency manifests |
| Prepare release context | release notes, workflow definitions, changed services |

### New Retrieval Assets Recommended

1. CI/CD workflows.
2. Deployment manifests.
3. Terraform and infrastructure code.
4. ADRs and architecture docs.
5. Test ownership and command mappings.
6. Git history summaries and recent diffs.

### Advanced Intelligence Roadmap

1. Symbol graph indexing.
2. Test-to-source linking.
3. Commit-aware retrieval.
4. Service dependency mapping.
5. Ownership and area inference.

---

## 12. Phase 6 — Observability, Security, and Operations

### Observability Standard

Every sync and retrieval event should emit:

1. Duration.
2. Chunk counts.
3. Embedded token or character volume.
4. Upload counts.
5. Retrieval scores.
6. Zero-result diagnostics.
7. Failure reason and degraded mode state.

### Security Standard

1. Exclude secrets and binary assets from indexing.
2. Support content classification metadata.
3. Respect tenant boundaries in every retrieval filter.
4. Use Key Vault and managed identity in production.
5. Log sync and search access at the platform layer.

### Operational Standard

1. Alert when sync failures exceed threshold.
2. Alert when zero-result rate spikes.
3. Alert when Azure Search latency degrades.
4. Support forced rebuild per repository and branch.
5. Support index versioning for schema migrations.

### Deliverables

1. Dashboards for sync health and retrieval health.
2. Error budgets for retrieval latency and availability.
3. Runbooks for index rebuild, failed syncs, and credential rotation.

---

## 13. Phase 7 — Rollout and Verification

### Rollout Sequence

1. Validate Azure foundation in `dev`.
2. Index one controlled repository end-to-end.
3. Verify retrieval in the indexing UI.
4. Enable Copilot grounding against indexed repos.
5. Enable planner auto-sync and retrieval.
6. Expand indexed content types.
7. Roll into `staging`, then `prod`.

### Verification Gates

| Gate | Requirement |
|------|-------------|
| Azure readiness | OpenAI and Search connectivity validated |
| Sync readiness | Full sync completes and documents exist in index |
| Retrieval readiness | Benchmark queries return relevant evidence |
| Copilot readiness | Stage 2 returns grounded repo chunks |
| Planner readiness | Plans cite actual repo patterns and tests |
| Operations readiness | Dashboards and alerts are live |

### Practical Verification Checklist

1. Sync repository and branch.
2. Confirm indexed document count is non-zero.
3. Run semantic search queries from the web UI.
4. Re-run Copilot grounding Stage 2.
5. Confirm traces include files, symbols, scores, and timing.
6. Test a push-triggered incremental sync.

---

## 14. Implementation Backlog

### Immediate

1. Move production secret handling toward Key Vault-backed deployment config.
2. Replace the remaining `GITHUB_DEFAULT_REPO` dependency with linked-repository-first UX everywhere.
3. Add explicit zero-result diagnostics to the indexing and Copilot flows.
4. Add repository and content-type filters to retrieval traces and UI diagnostics.

### Near-Term

1. Add commit-delta sync on top of the current file-SHA incremental sync.
2. Add retrieval metrics and evaluation storage.
3. Add dynamic retrieval profiles by task type.
4. Expand linked-repository and connection-aware provider resolution beyond GitHub-only defaults.

### Mid-Term

1. Add commit-aware retrieval.
2. Add symbol graph and dependency-aware retrieval.
3. Add caching for repeated retrievals.
4. Add index versioning and migration strategy.

---

## 15. Definition of Done

Trooper RAG should be considered production-ready only when all of the following are true:

1. Azure OpenAI, Azure AI Search, monitoring, and secrets handling are productionized.
2. Repositories can be fully and incrementally indexed.
3. Retrieval covers code, docs, tests, and operational assets.
4. Copilot and planner flows both consume grounded evidence.
5. Retrieval quality and failure modes are measurable.
6. The system degrades safely when retrieval is unavailable.
7. SWE and DevOps use cases both see concrete value in live workflows.

---

## Recommended Execution Order

If work starts now, execute in this order:

1. **Phase 0** — lock down Azure foundation first.
2. **Phase 1** — make indexing fresh and multi-content aware.
3. **Phase 2** — improve retrieval diagnostics and quality.
4. **Phase 3** — tighten Copilot grounding UX and evidence display.
5. **Phase 4** — make planner retrieval task-aware.
6. **Phase 5** — add SWE and DevOps-specific intelligence.
7. **Phase 6 and 7** — operationalize, measure, and roll out.

This sequence keeps the platform correct before layering application behavior on top of it.