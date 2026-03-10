import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from monorepo root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean existing data (order matters for FK constraints) ──
  await prisma.maskingAuditEntry.deleteMany();
  await prisma.agentStep.deleteMany();
  await prisma.pullRequest.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.workItem.deleteMany();
  await prisma.indexState.deleteMany();
  await prisma.webhookConfig.deleteMany();
  await prisma.maskingRule.deleteMany();
  await prisma.linkedRepository.deleteMany();
  await prisma.linkedAccount.deleteMany();
  await prisma.connection.deleteMany();

  console.log('  🧹 Cleaned existing data');

  // ─── Connections ──────────────────────────
  const ghConn = await prisma.connection.create({
    data: {
      name: 'sarem GitHub',
      provider: 'github',
      authMethod: 'pat',
      providerAccountName: 'sarem',
      providerUrl: 'https://github.com/sarem',
      status: 'active',
      scopes: ['repo', 'read:org', 'workflow'],
    },
  });

  console.log('  ✅ Connections created');

  // ─── Linked Accounts ─────────────────────
  const account1 = await prisma.linkedAccount.create({
    data: {
      displayName: 'sarem',
      providerUsername: 'sarem',
      email: 'sarem@users.noreply.github.com',
      provider: 'github',
      authMethod: 'pat',
      status: 'active',
      avatarUrl: 'https://github.com/sarem.png',
      connectionId: ghConn.id,
    },
  });

  console.log('  ✅ Linked accounts created');

  // ─── Repositories ────────────────────────
  const repo1 = await prisma.linkedRepository.create({
    data: {
      name: 'trooper',
      fullName: 'sarem/trooper',
      provider: 'github',
      connectionId: ghConn.id,
      defaultBranch: 'main',
      identityMode: 'service_account',
      indexEnabled: true,
      webhookActive: true,
    },
  });

  console.log('  ✅ Repositories created');

  // ─── Webhooks ────────────────────────────
  await prisma.webhookConfig.createMany({
    data: [
      {
        repositoryId: repo1.id,
        event: 'pull_request.created',
        endpointPath: '/webhooks/github/pr',
        active: true,
        secretConfigured: true,
      },
      {
        repositoryId: repo1.id,
        event: 'push',
        endpointPath: '/webhooks/github/push',
        active: true,
        secretConfigured: true,
      },
    ],
  });

  console.log('  ✅ Webhooks created');

  // ─── Masking Rules ───────────────────────
  await prisma.maskingRule.createMany({
    data: [
      { pattern: 'API Key (Bearer / x-api-key)', description: 'Matches Authorization: Bearer and x-api-key headers', enabled: true, builtIn: true, regex: '(?:Bearer\\s+|x-api-key[:\\s]+)[A-Za-z0-9\\-._~+\\/]+=*' },
      { pattern: 'Connection String (postgres://)', description: 'PostgreSQL and generic DB connection strings', enabled: true, builtIn: true, regex: 'postgres(?:ql)?:\\/\\/[^\\s]+' },
      { pattern: 'JWT Secret (HMAC key)', description: 'HMAC signing secrets in env/config files', enabled: true, builtIn: true, regex: '(?:JWT_SECRET|HMAC_KEY|SECRET_KEY)[=:\\s]+["\']?[A-Za-z0-9+/=]{16,}' },
      { pattern: 'GitHub PAT (ghp_)', description: 'GitHub personal access tokens', enabled: true, builtIn: true, regex: 'ghp_[a-zA-Z0-9]{36}' },
      { pattern: 'Private Key (RSA/ECDSA)', description: 'PEM-encoded private keys', enabled: true, builtIn: true, regex: '-----BEGIN (?:RSA |EC )?PRIVATE KEY-----' },
      { pattern: 'Internal Subnet IPs', description: 'Custom rule for internal 10.x.x.x ranges', enabled: true, builtIn: false, regex: '10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
    ],
  });

  console.log('  ✅ Masking rules created');

  // ─── Work Items (pipeline-oriented) ──────
  const wi1 = await prisma.workItem.create({
    data: {
      azureId: 1001,
      title: 'Add README with project overview',
      description: 'The repository needs a comprehensive README.md explaining what Trooper is and how to get started.',
      userQuery: 'Create a README.md that explains Trooper is an AI coding agent. Include sections for setup, architecture, and usage.',
      type: 'feature',
      status: 'completed',
      assignedTo: 'sarem',
      repositoryFullName: 'sarem/trooper',
      targetBranch: 'main',
    },
  });

  const wi2 = await prisma.workItem.create({
    data: {
      azureId: 1002,
      title: 'Fix database connection retry logic',
      description: 'The database connection pool does not retry on transient failures from Azure PostgreSQL.',
      userQuery: 'Add retry logic with exponential backoff to the database connection pool in packages/database/index.ts',
      type: 'bug',
      status: 'in_progress',
      assignedTo: 'sarem',
      repositoryFullName: 'sarem/trooper',
      targetBranch: 'main',
    },
  });

  const wi3 = await prisma.workItem.create({
    data: {
      azureId: 1003,
      title: 'Add rate limiting to API endpoints',
      description: 'Protect the API from abuse by adding rate limiting middleware.',
      userQuery: 'Add rate limiting middleware to all NestJS API endpoints using @nestjs/throttler. Set default to 100 requests per minute.',
      type: 'feature',
      status: 'pending',
      repositoryFullName: 'sarem/trooper',
    },
  });

  const wi4 = await prisma.workItem.create({
    data: {
      azureId: 1004,
      title: 'Implement health check endpoint',
      description: 'Add /api/health endpoint that checks database connectivity and returns service status.',
      userQuery: 'Create a health check endpoint at /api/health that returns { status: "ok", db: "connected", uptime: ... }',
      type: 'feature',
      status: 'pending',
      repositoryFullName: 'sarem/trooper',
    },
  });

  console.log('  ✅ Work items created');

  // ─── Agent Runs (pipeline runs with step-by-step trace) ──
  // Run 1: Completed successfully — created README PR
  const run1 = await prisma.agentRun.create({
    data: {
      workItemId: wi1.id,
      repositoryFullName: 'sarem/trooper',
      status: 'success',
      branchName: 'trooper/' + wi1.id,
      prId: '1',
      completedAt: new Date(Date.now() - 3600000),
    },
  });

  // Run 2: Currently running — fixing DB retry logic
  const run2 = await prisma.agentRun.create({
    data: {
      workItemId: wi2.id,
      repositoryFullName: 'sarem/trooper',
      status: 'running',
      branchName: 'trooper/' + wi2.id,
    },
  });

  console.log('  ✅ Agent runs created');

  // ─── Agent Steps (pipeline stage records) ──
  // Run 1 steps — full completed pipeline
  await prisma.agentStep.createMany({
    data: [
      { runId: run1.id, type: 'reasoning', status: 'completed', label: '[receive] Receiving work item', detail: 'Work item: "Add README with project overview"\nQuery: "Create a README.md that explains Trooper is an AI coding agent..."', order: 1, durationMs: 50 },
      { runId: run1.id, type: 'tool_call', status: 'completed', label: '[fetch] Fetching repository tree', detail: 'Repo: sarem/trooper, branch: main\nFound 87 files in repo', order: 2, durationMs: 1200 },
      { runId: run1.id, type: 'reasoning', status: 'completed', label: '[understand] Analysing repository structure', detail: 'Read 12 key files for context\nDetected: NestJS + Next.js + Prisma monorepo', order: 3, durationMs: 2400 },
      { runId: run1.id, type: 'reasoning', status: 'completed', label: '[plan] Planning changes', detail: 'Plan: Create a new README.md based on user query\nFiles to modify: README.md', order: 4, durationMs: 800 },
      { runId: run1.id, type: 'code_gen', status: 'completed', label: '[code_gen] Generating code changes', detail: 'Generated changes for 1 file(s):\n  README.md', order: 5, durationMs: 3200 },
      { runId: run1.id, type: 'masking', status: 'completed', label: '[mask] Scanning for secrets', detail: 'No secrets detected', order: 6, durationMs: 80 },
      { runId: run1.id, type: 'git_op', status: 'completed', label: '[submit_pr] Creating branch & opening PR', detail: 'PR #1 opened: https://github.com/sarem/trooper/pull/1', order: 7, durationMs: 2100 },
    ],
  });

  // Run 2 steps — partially complete (currently on code_gen)
  await prisma.agentStep.createMany({
    data: [
      { runId: run2.id, type: 'reasoning', status: 'completed', label: '[receive] Receiving work item', detail: 'Work item: "Fix database connection retry logic"\nQuery: "Add retry logic with exponential backoff..."', order: 1, durationMs: 45 },
      { runId: run2.id, type: 'tool_call', status: 'completed', label: '[fetch] Fetching repository tree', detail: 'Repo: sarem/trooper, branch: main\nFound 87 files in repo', order: 2, durationMs: 1100 },
      { runId: run2.id, type: 'reasoning', status: 'completed', label: '[understand] Analysing repository structure', detail: 'Read packages/database/index.ts — found pg.Pool creation without retry', order: 3, durationMs: 1800 },
      { runId: run2.id, type: 'reasoning', status: 'completed', label: '[plan] Planning changes', detail: 'Plan: Modify file(s) mentioned in query: packages/database/index.ts\nAdd retry wrapper around connection pool', order: 4, durationMs: 600 },
      { runId: run2.id, type: 'code_gen', status: 'running', label: '[code_gen] Generating code changes', detail: null, order: 5 },
    ],
  });

  console.log('  ✅ Agent steps created');

  // ─── Pull Requests ───────────────────────
  await prisma.pullRequest.create({
    data: {
      prNumber: 1,
      title: '[Trooper] Add README with project overview',
      sourceBranch: 'trooper/' + wi1.id,
      targetBranch: 'main',
      status: 'open',
      workItemId: wi1.id,
      runId: run1.id,
      url: 'https://github.com/sarem/trooper/pull/1',
      repositoryFullName: 'sarem/trooper',
    },
  });

  console.log('  ✅ Pull requests created');

  // ─── Index State ─────────────────────────
  await prisma.indexState.create({
    data: {
      repository: 'sarem/trooper',
      branch: 'main',
      status: 'idle',
      totalFiles: 87,
      indexedFiles: 87,
      lastSyncAt: new Date(Date.now() - 7200000),
    },
  });

  console.log('  ✅ Index states created');

  // ─── Masking Audit ───────────────────────
  await prisma.maskingAuditEntry.createMany({
    data: [
      { runId: run1.id, pattern: 'Connection String (postgres://)', matchCount: 1, filesAffected: ['.env'] },
      { runId: run2.id, pattern: 'GitHub PAT (ghp_)', matchCount: 0, filesAffected: [] },
    ],
  });

  console.log('  ✅ Masking audit entries created');
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
