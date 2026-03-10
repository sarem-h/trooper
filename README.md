# Trooper

Trooper is an AI-assisted software delivery platform for engineering teams. It combines a multi-stage planning and execution pipeline, repository-aware retrieval, grounded Copilot-style analysis, and human-in-the-loop review so work can move from issue or work item to proposed code change with traceability.

## Links

- Repository: https://github.com/sarem-h/trooper
- Public deployment: not currently published from this repository snapshot
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
- RAG design: [RAG_ARCHITECTURE.md](./RAG_ARCHITECTURE.md)

## Executive Summary

Trooper is designed around a practical engineering constraint: AI coding systems are only useful when they are grounded in repository context, constrained by reviewable plans, and observable at each stage of execution. The project addresses that by splitting work into explicit phases:

1. Ingest a task from a user, work item, or repository context.
2. Retrieve repository evidence through SCM exploration and RAG.
3. Produce a structured plan for approval.
4. Generate and review code changes.
5. Mask secrets, create branches, and open pull requests.

The result is a system intended for software engineering and DevOps workflows where explainability, operational awareness, and safe automation matter more than raw code generation.

## What Trooper Currently Does

- Runs a staged agent pipeline with planning, code generation, review, masking, and PR submission.
- Uses Azure OpenAI for reasoning, worker inference, and embeddings.
- Uses Azure AI Search for repository chunk retrieval and semantic grounding.
- Supports grounded Copilot-style issue and pull request analysis with stage tracing.
- Indexes external repositories rather than assuming Trooper itself is the target repo.
- Tracks connections, linked repositories, work items, runs, pull requests, and index state in PostgreSQL via Prisma.
- Provides a Next.js operations dashboard for runs, indexing, repository exploration, and provider connection management.

## Key Product Capabilities

### 1. Human-Gated AI Delivery Pipeline

Trooper separates planning from execution. The system generates a plan first, pauses for review, and only then moves into code generation and submission. This keeps the workflow inspectable and suitable for real engineering work.

### 2. Repository-Grounded Retrieval

Trooper uses hybrid retrieval over indexed repository chunks so downstream summaries and plans are based on actual code, not only prompt heuristics. The current implementation includes incremental sync, chunk metadata, and retrieval health tracing.

### 3. SCM-Aware Workflow Design

The pipeline is structured around source control operations, not isolated chat interactions. It understands repositories, branches, issues, pull requests, work items, and linked provider credentials.

### 4. Operational Surface Area Beyond Code

The target direction is broader than code editing alone. Trooper is being shaped to help with SWE and DevOps tasks such as repository triage, change impact analysis, deployment-context retrieval, and security-oriented review flows.

## Architecture Overview

### Frontend

- Next.js App Router
- React 19
- Turbopack
- Operational dashboard, indexing UI, repository hub, settings and provider access management

### Backend

- NestJS API
- Modular services for pipeline orchestration, indexing, Copilot grounding, SCM access, connections, repositories, and work items
- REST API under `/api`

### Data and AI Services

- PostgreSQL on Azure Flexible Server
- Prisma ORM
- Azure OpenAI deployments for thinker, worker, and embedding models
- Azure AI Search for hybrid retrieval over repository chunks

## Pipeline Stages

The core pipeline is intentionally explicit and observable.

1. Receive: normalize task input and resolve repository context.
2. Fetch: pull repository structure and metadata from SCM.
3. Context: retrieve repository evidence through RAG.
4. Plan: generate a structured execution plan.
5. Code Generation: produce implementation changes.
6. Review: verify output and iterate when needed.
7. Mask: scan outputs for secrets and sensitive material.
8. Submit PR: create branch, commit, and open a pull request.

## Monorepo Structure

```text
trooper/
├── apps/
│   ├── api/                  # NestJS backend
│   └── web/                  # Next.js frontend
├── packages/
│   ├── database/             # Prisma schema, client, seed
│   └── shared/               # Shared types, enums, Zod schemas
├── ARCHITECTURE.md           # System design and implementation plan
├── RAG_ARCHITECTURE.md       # Retrieval architecture plan and rollout notes
└── turbo.json                # Workspace task orchestration
```

## Technology Stack

| Area | Technology |
| --- | --- |
| Monorepo | pnpm workspaces, Turborepo |
| Frontend | Next.js, React, TypeScript |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL, Prisma |
| LLM | Azure OpenAI |
| Retrieval | Azure AI Search |
| SCM | GitHub first, Azure DevOps model in progress |
| CI | GitHub Actions |

## Local Development

### Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL connection available through the configured Azure database
- Azure OpenAI credentials
- Azure AI Search credentials

### Install

```bash
pnpm install
```

### Run the Workspace

```bash
pnpm dev
```

Expected local endpoints:

- Web: `http://localhost:3000`
- API: `http://localhost:3001/api`

### Build

```bash
pnpm --filter @trooper/api build
pnpm --filter web build
```

## Configuration Notes

Trooper currently expects environment configuration for infrastructure services such as PostgreSQL, Azure OpenAI, and Azure AI Search. Provider access for GitHub has been moved out of `.env` and into the application settings flow, where multiple PAT-backed connections can be stored and a default connection can be selected per provider.

## CI

The repository includes a GitHub Actions workflow at [.github/workflows/ci.yml](./.github/workflows/ci.yml) that installs dependencies and builds the workspace on pushes to `main` and pull request updates.

## Current Status

This project is an active implementation rather than a finished commercial release. The current codebase already demonstrates:

- end-to-end pipeline orchestration
- repository indexing and retrieval
- grounded Copilot-stage verification
- provider connection management
- reviewer-facing operational UI

The main remaining gap for a public evaluator is deployment packaging. The architecture documents in this repository call that out explicitly: the system is currently validated in local and cloud-backed development infrastructure, but not yet published as a public production app from this repository.

## Why This Project Matters

Trooper is not a generic chatbot wrapper. It is an attempt to build a disciplined AI engineering system that treats repository context, execution safety, and delivery workflow as first-class concerns. That makes it a stronger representation of systems thinking, product judgment, and applied AI engineering than a narrow single-model demo.

## Additional Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [RAG_ARCHITECTURE.md](./RAG_ARCHITECTURE.md)
