import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskDrafterService } from './drafting';
import { PipelinePlanningService } from './pipeline-planning.service';
import { PipelineExecutionService } from './pipeline-execution.service';
import { PipelineStepTracker } from './pipeline-step-tracker.service';
import { DEFAULT_MAX_ITERATIONS } from '../llm/execution-orchestrator.service';
import {
  AgentRunStatus,
  WorkItemStatus,
  PipelineStage,
} from '@trooper/shared';
import type { TaskContext } from '@trooper/shared';

export interface TriggerInput {
  workItemId?: string;
  repositoryFullName?: string;
  userQuery?: string;
  targetBranch?: string;
  /** Context for auto-drafted tasks (issue, PR, security) */
  taskContext?: TaskContext;
}

export interface PipelineResult {
  runId: string;
  status: AgentRunStatus;
  prUrl?: string;
  error?: string;
}

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly drafter: TaskDrafterService,
    private readonly planning: PipelinePlanningService,
    private readonly execution: PipelineExecutionService,
    private readonly steps: PipelineStepTracker,
  ) {}

  // ─── Public entry point ────────────────────────────────────

  private async resolveRepositoryFullName(input: TriggerInput, workItem?: { repositoryFullName?: string | null } | null) {
    if (input.repositoryFullName?.trim()) {
      return input.repositoryFullName.trim();
    }

    if (workItem?.repositoryFullName?.trim()) {
      return workItem.repositoryFullName.trim();
    }

    const linkedRepo = await this.prisma.client.linkedRepository.findFirst({
      where: { indexEnabled: true },
      orderBy: { updatedAt: 'desc' },
    }) ?? await this.prisma.client.linkedRepository.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (linkedRepo?.fullName) {
      return linkedRepo.fullName;
    }

    throw new NotFoundException('No repository was provided and no linked repository is configured. Add a repository in Settings first.');
  }

  async trigger(input: TriggerInput): Promise<PipelineResult> {
    const { workItemId, userQuery, targetBranch } = input;

    let workItem = null;
    if (workItemId) {
      workItem = await this.prisma.client.workItem.findUnique({
        where: { id: workItemId },
      });
      if (!workItem) throw new NotFoundException(`WorkItem ${workItemId} not found`);

    }

    const repoFullName = await this.resolveRepositoryFullName(input, workItem);

    if (workItemId && userQuery) {
      await this.prisma.client.workItem.update({
        where: { id: workItemId },
        data: { userQuery, repositoryFullName: repoFullName },
      });
    }

    const finalQuery = userQuery ?? workItem?.userQuery ?? workItem?.description ?? 'No query provided';

    // Create the AgentRun
    const run = await this.prisma.client.agentRun.create({
      data: {
        workItemId,
        repositoryFullName: repoFullName,
        userQuery: finalQuery,
        status: AgentRunStatus.Running,
      },
    });

    if (workItemId) {
      // Mark work-item as in progress
      await this.prisma.client.workItem.update({
        where: { id: workItemId },
        data: { status: WorkItemStatus.InProgress, linkedRunId: run.id },
      });
    }

    try {
      await this.planning.execute(run.id, repoFullName, workItem, finalQuery, targetBranch);
      return { runId: run.id, status: AgentRunStatus.AwaitingApproval };
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${run.id}: ${err.message}`);
      await this.steps.failRun(run.id, err.message);
      return { runId: run.id, status: AgentRunStatus.Failed, error: err.message };
    }
  }

  /**
   * Auto-draft a task from context (issue, PR, security alert).
   * Uses the TaskDrafter LLM service to generate a query, then pauses
   * for user approval before executing the pipeline.
   */
  async triggerFromContext(context: TaskContext): Promise<PipelineResult> {
    const repoFullName = context.repositoryFullName;

    // Use LLM to draft a task query from the context
    const draft = await this.drafter.draft(context);

    // Create a run in AwaitingDraftApproval state
    const run = await this.prisma.client.agentRun.create({
      data: {
        repositoryFullName: repoFullName,
        userQuery: draft.query,
        status: AgentRunStatus.AwaitingDraftApproval,
        planSummary: draft.summary,
        branchName: draft.suggestedBranch,
      },
    });

    this.logger.log(`Auto-drafted task for run ${run.id}: "${draft.summary}"`);
    return { runId: run.id, status: AgentRunStatus.AwaitingDraftApproval };
  }

  /**
   * Approve an auto-drafted task and begin pipeline execution.
   * Optionally override the generated query before starting.
   */
  async approveDraft(runId: string, overrideQuery?: string): Promise<PipelineResult> {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: { workItem: true },
    });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    if (run.status !== AgentRunStatus.AwaitingDraftApproval) {
      throw new Error(`Run ${runId} is not awaiting draft approval`);
    }

    const finalQuery = overrideQuery ?? run.userQuery!;
    const repoFullName = run.repositoryFullName!;

    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: { status: AgentRunStatus.Running, userQuery: finalQuery },
    });

    try {
      await this.planning.execute(runId, repoFullName, run.workItem, finalQuery);
      return { runId, status: AgentRunStatus.AwaitingApproval };
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${runId}: ${err.message}`);
      await this.steps.failRun(runId, err.message);
      return { runId, status: AgentRunStatus.Failed, error: err.message };
    }
  }

  async approvePlan(runId: string): Promise<PipelineResult> {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: { workItem: true },
    });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    if (run.status !== AgentRunStatus.AwaitingApproval) {
      throw new Error(`Run ${runId} is not awaiting approval`);
    }

    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: { status: AgentRunStatus.Running },
    });

    try {
      await this.execution.execute(run);
      return { runId: run.id, status: AgentRunStatus.Success };
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${run.id}: ${err.message}`);
      await this.steps.failRun(run.id, err.message);
      return { runId: run.id, status: AgentRunStatus.Failed, error: err.message };
    }
  }

  async rejectPlan(runId: string, newQuery: string): Promise<PipelineResult> {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: { workItem: true },
    });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);

    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: { status: AgentRunStatus.Running, userQuery: newQuery },
    });

    try {
      await this.planning.execute(run.id, run.repositoryFullName!, run.workItem, newQuery);
      return { runId: run.id, status: AgentRunStatus.AwaitingApproval };
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${run.id}: ${err.message}`);
      await this.steps.failRun(run.id, err.message);
      return { runId: run.id, status: AgentRunStatus.Failed, error: err.message };
    }
  }

  async retryRun(runId: string): Promise<PipelineResult> {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: { workItem: true },
    });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    if (run.status !== AgentRunStatus.Failed) {
      throw new Error(`Run ${runId} is not failed, cannot retry`);
    }

    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: { status: AgentRunStatus.Running, error: null },
    });

    try {
      if (run.planSummary && run.planFiles) {
        // Failed in Phase 2, clean up Phase 2 steps and retry
        // We identify stage by the label prefix e.g. "[code_gen]"
        await this.prisma.client.agentStep.deleteMany({
          where: {
            runId,
            OR: [
              { label: { startsWith: `[${PipelineStage.CodeGen}]` } },
              { label: { startsWith: `[${PipelineStage.Mask}]` } },
              { label: { startsWith: `[${PipelineStage.SubmitPR}]` } },
            ],
          },
        });
        await this.execution.execute(run);
        return { runId: run.id, status: AgentRunStatus.Success };
      } else {
        // Failed in Phase 1, clean up all steps and retry
        await this.prisma.client.agentStep.deleteMany({ where: { runId } });
        await this.planning.execute(run.id, run.repositoryFullName!, run.workItem, run.userQuery!, run.branchName ?? undefined);
        return { runId: run.id, status: AgentRunStatus.AwaitingApproval };
      }
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${run.id}: ${err.message}`);
      await this.steps.failRun(run.id, err.message);
      return { runId: run.id, status: AgentRunStatus.Failed, error: err.message };
    }
  }

  /**
   * Continue a run that paused at the iteration limit.
   * Resumes Phase 2 from the stored changes, giving it another
   * `additionalIterations` worth of fix cycles.
   */
  async continueRun(
    runId: string,
    additionalIterations?: number,
  ): Promise<PipelineResult> {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: { workItem: true },
    });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    if (run.status !== AgentRunStatus.AwaitingContinuation) {
      throw new Error(`Run ${runId} is not awaiting continuation`);
    }

    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: {
        status: AgentRunStatus.Running,
        maxIterations: (run.maxIterations ?? DEFAULT_MAX_ITERATIONS) + (additionalIterations ?? DEFAULT_MAX_ITERATIONS),
      },
    });

    try {
      await this.execution.execute(run);
      return { runId: run.id, status: AgentRunStatus.Success };
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${run.id}: ${err.message}`);
      await this.steps.failRun(run.id, err.message);
      return { runId: run.id, status: AgentRunStatus.Failed, error: err.message };
    }
  }

  /**
   * Submit the current changes as-is, skipping further iterations.
   * Proceeds directly to mask → PR from the stored changes.
   */
  async submitAsIs(runId: string): Promise<PipelineResult> {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: { workItem: true },
    });
    if (!run) throw new NotFoundException(`Run ${runId} not found`);
    if (run.status !== AgentRunStatus.AwaitingContinuation) {
      throw new Error(`Run ${runId} is not awaiting continuation`);
    }

    // Mark as running and proceed with existing changes
    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: {
        status: AgentRunStatus.Running,
        // Set maxIterations to 0 so Phase 2 skips the loop
        maxIterations: 0,
      },
    });

    try {
      await this.execution.execute(run);
      return { runId: run.id, status: AgentRunStatus.Success };
    } catch (err: any) {
      this.logger.error(`Pipeline failed for run ${run.id}: ${err.message}`);
      await this.steps.failRun(run.id, err.message);
      return { runId: run.id, status: AgentRunStatus.Failed, error: err.message };
    }
  }
}
