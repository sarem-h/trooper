import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ScmRegistry } from './scm';
import { ExecutionOrchestratorService } from '../llm/execution-orchestrator.service';
import { DEFAULT_MAX_ITERATIONS } from '../llm/execution-orchestrator.service';
import { MaskingService } from '../masking/masking.service';
import { PipelineStepTracker } from './pipeline-step-tracker.service';
import type { Plan } from '../llm/schemas';
import { addUsage, type TokenUsage } from '../llm/tokenizer';
import {
  AgentRunStatus,
  AgentStepType,
  PipelineStage,
  PRStatus,
  WorkItemStatus,
} from '@trooper/shared';

@Injectable()
export class PipelineExecutionService {
  private readonly logger = new Logger(PipelineExecutionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scm: ScmRegistry,
    private readonly executionOrchestrator: ExecutionOrchestratorService,
    private readonly masking: MaskingService,
    private readonly steps: PipelineStepTracker,
  ) {}

  async execute(run: any) {
    const runId = run.id;
    const repoFullName = run.repositoryFullName!;
    const baseBranch = run.branchName!;
    const query = run.userQuery!;
    const planData = run.planFiles as any;
    const workItem = run.workItem;

    // Reconstruct the Plan from stored data
    const plan: Plan = {
      summary: planData.summary,
      reasoning: planData.reasoning ?? '',
      tasks: planData.tasks ?? [
        // Backward compat: if tasks aren't stored, reconstruct from old format
        ...(planData.filesToChange ?? []).map((p: string) => ({ path: p, action: 'modify' as const, description: 'Modify file' })),
        ...(planData.newFiles ?? []).map((p: string) => ({ path: p, action: 'create' as const, description: 'Create file' })),
      ],
    };

    const scmContext = { repoFullName, branch: baseBranch };

    // Get current step order
    const lastStep = await this.prisma.client.agentStep.findFirst({
      where: { runId },
      orderBy: { order: 'desc' },
    });
    let order = lastStep?.order ?? 4;

    // Stage 5: CodeGen — parallel execution agents with sandbox verification
    await this.steps.addStep(runId, PipelineStage.CodeGen, AgentStepType.CodeGen, 'AI generating code (parallel orchestrator)', `Dispatching ${plan.tasks.length} parallel coder agent(s)`, ++order, 'running');

    const codeResult = await this.executionOrchestrator.codeWithRetry(
      query,
      plan,
      scmContext,
      undefined, // use default max iterations (5)
      (attempt, reviewResult, sandboxResult) => {
        const sandboxInfo = sandboxResult
          ? `\nSandbox: ${sandboxResult.passed ? 'passed' : `failed (${sandboxResult.errors.length} errors)`}`
          : '';
        this.steps.addStep(
          runId,
          PipelineStage.Review,
          AgentStepType.Reasoning,
          `Iteration ${attempt} — fixing issues`,
          `Review issues: ${reviewResult.issues.join('; ')}\nFiles to fix: ${reviewResult.fixes.map((f) => f.path).join(', ')}${sandboxInfo}`,
          ++order,
          'running',
        );
      },
    );

    const { changes, review, usage: codeUsage, iterationLimitReached, iteration } = codeResult;

    await this.steps.updateStepStatus(
      runId,
      PipelineStage.CodeGen,
      'completed',
      `Generated changes for ${changes.length} file(s) in ${iteration ?? 1} iteration(s):\n${changes.map((c) => `  ${c.path}`).join('\n')}` +
      (iterationLimitReached ? '\n⚠️ Iteration limit reached — awaiting user decision' : ''),
    );

    // Combine Phase 1 usage (stored on run) with Phase 2 usage
    const phase1Usage: TokenUsage = {
      promptTokens: run.totalPromptTokens ?? 0,
      completionTokens: run.totalCompletionTokens ?? 0,
      totalTokens: run.totalTokens ?? 0,
    };
    const grandTotal = addUsage(phase1Usage, codeUsage);

    // ── If iteration limit reached, pause for user "Continue" ──
    if (iterationLimitReached) {
      await this.prisma.client.agentRun.update({
        where: { id: runId },
        data: {
          status: AgentRunStatus.AwaitingContinuation,
          currentIteration: iteration,
          maxIterations: DEFAULT_MAX_ITERATIONS,
          lastChanges: changes as any,
          totalPromptTokens: grandTotal.promptTokens,
          totalCompletionTokens: grandTotal.completionTokens,
          totalTokens: grandTotal.totalTokens,
        },
      });

      await this.steps.addStep(
        runId,
        PipelineStage.Review,
        AgentStepType.Reasoning,
        `Paused after ${iteration} iterations — awaiting continuation`,
        `The code-verify loop reached the iteration limit (${DEFAULT_MAX_ITERATIONS}). ` +
        `Review: ${review?.approved ? 'approved' : 'has issues'}. ` +
        `Click "Continue" to run more iterations or "Submit as-is" to proceed.`,
        ++order,
      );

      return; // Don't proceed to mask/PR — user must decide
    }

    // Stage 6: Review — record final review verdict
    const reviewApproved = review?.approved ?? true;
    const reviewDetail = review
      ? reviewApproved
        ? 'All changes approved by Reviewer agent'
        : `Proceeding with warnings: ${review.issues.join('; ')}`
      : 'Review skipped';
    await this.steps.addStep(runId, PipelineStage.Review, AgentStepType.Reasoning, reviewApproved ? 'Review passed' : 'Review passed with warnings', reviewDetail, ++order);

    // Stage 7: Mask — secret-masking pass
    await this.steps.addStep(runId, PipelineStage.Mask, AgentStepType.Masking, 'Scanning for secrets', null, ++order, 'running');
    const maskedCount = await this.maskSecrets(runId, changes);
    await this.steps.updateStepStatus(runId, PipelineStage.Mask, 'completed', maskedCount > 0 ? `Masked ${maskedCount} secret(s)` : 'No secrets detected');

    // Stage 8: Submit PR
    await this.steps.addStep(runId, PipelineStage.SubmitPR, AgentStepType.GitOp, 'Creating branch & opening PR', null, ++order, 'running');

    const provider = this.scm.resolveForRepo(repoFullName);
    const branchName = `trooper/${runId.slice(-6)}`;
    await provider.createBranch(repoFullName, branchName, baseBranch);
    const title = workItem?.title ?? 'Ad-hoc Task';
    const commitMsg = `trooper: ${title}\n\n${query}`;
    await provider.commitFiles(repoFullName, branchName, commitMsg, changes);

    const prBody = this.buildPRBody(title, query, plan, changes);
    const pr = await provider.createPullRequest(
      repoFullName,
      branchName,
      baseBranch,
      `[Trooper] ${title}`,
      prBody,
    );

    // Persist the PR record
    await this.prisma.client.pullRequest.create({
      data: {
        prNumber: pr.number,
        title: pr.title,
        sourceBranch: branchName,
        targetBranch: baseBranch,
        status: PRStatus.Open,
        workItemId: workItem?.id,
        runId,
        url: pr.url,
        repositoryFullName: repoFullName,
      },
    });

    // Update run as success
    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: {
        status: AgentRunStatus.Success,
        branchName,
        prId: String(pr.number),
        completedAt: new Date(),
        totalPromptTokens: grandTotal.promptTokens,
        totalCompletionTokens: grandTotal.completionTokens,
        totalTokens: grandTotal.totalTokens,
      },
    });

    if (workItem) {
      await this.prisma.client.workItem.update({
        where: { id: workItem.id },
        data: { status: WorkItemStatus.AwaitingReview, linkedPRId: String(pr.number) },
      });
    }

    await this.steps.updateStepStatus(runId, PipelineStage.SubmitPR, 'completed', `PR #${pr.number} opened: ${pr.url}`);
  }

  // ─── Helpers ──────────────────────────────────────────────

  private async maskSecrets(
    runId: string,
    changes: Array<{ path: string; content: string }>,
  ): Promise<number> {
    const rules = await this.masking.findAllRules();
    const enabledRules = rules.filter((r) => r.enabled);

    let totalCount = 0;

    for (const rule of enabledRules) {
      const regexSource = rule.regex ?? rule.pattern;
      let re: RegExp;
      try {
        re = new RegExp(regexSource, 'g');
      } catch {
        this.logger.warn(`Invalid regex for masking rule "${rule.pattern}", skipping`);
        continue;
      }

      let matchCount = 0;
      const filesAffected: string[] = [];

      for (const change of changes) {
        re.lastIndex = 0;
        const matches = change.content.match(re);
        if (matches) {
          matchCount += matches.length;
          filesAffected.push(change.path);
          re.lastIndex = 0;
          change.content = change.content.replace(re, '***MASKED***');
        }
      }

      if (matchCount > 0) {
        totalCount += matchCount;
        await this.masking.createAuditEntry({
          runId,
          pattern: rule.pattern,
          matchCount,
          filesAffected,
        });
      }
    }

    return totalCount;
  }

  private buildPRBody(
    title: string,
    query: string,
    plan: Plan,
    changes: Array<{ path: string; content: string }>,
  ): string {
    return [
      `## 🤖 Trooper Agent PR`,
      ``,
      `**Task:** ${title}`,
      `**Query:** ${query}`,
      ``,
      `### Plan`,
      plan.summary,
      ``,
      `### Reasoning`,
      plan.reasoning,
      ``,
      `### Changed Files`,
      ...plan.tasks.map((t) => `- \`${t.path}\` (${t.action}): ${t.description}`),
      ``,
      `---`,
      `*This PR was generated by Trooper — an AI coding agent.*`,
    ].join('\n');
  }
}
