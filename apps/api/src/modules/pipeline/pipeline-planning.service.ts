import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ScmRegistry } from './scm';
import { ExecutionOrchestratorService } from '../llm/execution-orchestrator.service';
import { RagService } from '../indexing/rag.service';
import { PipelineStepTracker } from './pipeline-step-tracker.service';
import { AgentRunStatus, AgentStepType, PipelineStage } from '@trooper/shared';

@Injectable()
export class PipelinePlanningService {
  private readonly logger = new Logger(PipelinePlanningService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scm: ScmRegistry,
    private readonly executionOrchestrator: ExecutionOrchestratorService,
    private readonly rag: RagService,
    private readonly steps: PipelineStepTracker,
  ) {}

  async execute(
    runId: string,
    repoFullName: string,
    workItem: any,
    query: string,
    targetBranch?: string,
  ) {
    let order = 0;

    // Stage 1: Receive — validate & log
    const title = workItem?.title ?? 'Ad-hoc Task';
    await this.steps.addStep(runId, PipelineStage.Receive, AgentStepType.Reasoning, 'Receiving work item', `Task: "${title}"\nQuery: "${query}"`, ++order);

    // Stage 2: Fetch — get repo tree
    await this.steps.addStep(runId, PipelineStage.Fetch, AgentStepType.ToolCall, 'Fetching repository tree', `Repo: ${repoFullName}`, ++order, 'running');

    const provider = this.scm.resolveForRepo(repoFullName);
    let baseBranch: string;
    try {
      baseBranch = targetBranch ?? await provider.getDefaultBranch(repoFullName);
    } catch (err: any) {
      const is404 = err.status === 404 || String(err.message).includes('Not Found');
      throw new Error(
        is404
          ? `Repository "${repoFullName}" not found on GitHub. Create the repo first, then re-run.`
          : err.message,
      );
    }

    const tree = await provider.getTree(repoFullName, baseBranch);
    const sourceFiles = tree.filter((f) => f.type === 'file');
    const treeMap = sourceFiles.map((f) => f.path).join('\n');

    await this.steps.updateStepStatus(runId, PipelineStage.Fetch, 'completed', `Repo: ${repoFullName}, branch: ${baseBranch} — found ${sourceFiles.length} files`);

    // Stage 2.5: Context — RAG retrieval (auto-index if needed)
    let ragContext = '';
    if (this.rag.isReady) {
      await this.steps.addStep(runId, PipelineStage.Context, AgentStepType.Reasoning, 'Retrieving relevant context via RAG', null, ++order, 'running');

      // TODO: Extract tenantId from authenticated user context when multi-tenant auth is implemented
      const tenantId = 'default';
      const indexState = await this.prisma.client.indexState.findUnique({
        where: { tenantId_repository_branch: { tenantId, repository: repoFullName, branch: baseBranch } },
      });

      if (!indexState || indexState.status !== 'idle') {
        this.logger.log(`Repository ${repoFullName}@${baseBranch} not indexed — auto-syncing before plan`);
        await this.steps.updateStepStatus(runId, PipelineStage.Context, 'running', 'Repository not indexed — auto-syncing RAG index…');
        try {
          const syncResult = await this.rag.syncRepository(repoFullName, baseBranch, undefined, tenantId);
          this.logger.log(`Auto-sync complete: ${syncResult.totalFiles} files, ${syncResult.totalChunks} chunks`);
        } catch (err: any) {
          this.logger.warn(`Auto-sync failed: ${err.message} — continuing without RAG`);
          await this.steps.updateStepStatus(runId, PipelineStage.Context, 'completed', `RAG auto-sync failed: ${err.message}. Planner will explore via tools.`);
        }
      }

      try {
        const chunks = await this.rag.queryRelevantChunks(repoFullName, baseBranch, query, undefined, tenantId);
        if (chunks.length > 0) {
          ragContext = chunks
            .map((c) => `── ${c.filePath} (${c.symbolName || 'chunk'}) [score: ${c.score.toFixed(3)}] ──\n${c.content}`)
            .join('\n\n');
          await this.steps.updateStepStatus(runId, PipelineStage.Context, 'completed', `Retrieved ${chunks.length} relevant code chunks`);
        } else {
          await this.steps.updateStepStatus(runId, PipelineStage.Context, 'completed', 'No relevant chunks found — Planner will explore via tools');
        }
      } catch (err: any) {
        this.logger.warn(`RAG retrieval failed: ${err.message}`);
        await this.steps.updateStepStatus(runId, PipelineStage.Context, 'completed', `RAG skipped: ${err.message}`);
      }
    }

    // Stage 3: Understand — LLM Planner explores the repo via MCP tools
    await this.steps.addStep(runId, PipelineStage.Understand, AgentStepType.Reasoning, 'AI exploring repository', null, ++order, 'running');

    const scmContext = { repoFullName, branch: baseBranch };

    // Stage 4: Plan — the Planner agent produces a structured plan
    const { plan, exploredFiles, usage: planUsage } = await this.executionOrchestrator.plan(query, treeMap, scmContext, ragContext || undefined);

    await this.steps.updateStepStatus(runId, PipelineStage.Understand, 'completed', `AI explored ${exploredFiles.length} files:\n${exploredFiles.map(f => `  ${f}`).join('\n')}`);

    await this.steps.addStep(runId, PipelineStage.Plan, AgentStepType.Reasoning, 'AI generated plan', `Plan: ${plan.summary}\n\nReasoning: ${plan.reasoning}\n\nFiles:\n${plan.tasks.map(t => `  [${t.action}] ${t.path}: ${t.description}`).join('\n')}\n\nPlanning tokens: ${planUsage.totalTokens.toLocaleString()}`, ++order);

    // Convert Plan to the format stored in the database
    const planData = {
      summary: plan.summary,
      reasoning: plan.reasoning,
      filesToChange: plan.tasks.filter(t => t.action === 'modify').map(t => t.path),
      newFiles: plan.tasks.filter(t => t.action === 'create').map(t => t.path),
      tasks: plan.tasks,
    };

    // Save plan + Phase 1 token usage to run and pause for approval
    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: {
        status: AgentRunStatus.AwaitingApproval,
        planSummary: plan.summary,
        planFiles: planData as any,
        branchName: baseBranch,
        totalPromptTokens: planUsage.promptTokens,
        totalCompletionTokens: planUsage.completionTokens,
        totalTokens: planUsage.totalTokens,
      },
    });
  }
}
