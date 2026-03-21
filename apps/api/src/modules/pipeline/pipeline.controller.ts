import { Controller, Post, Body, Get, Param, Query, HttpCode, Logger, Sse, MessageEvent, ForbiddenException, NotFoundException, HttpException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map, filter, finalize } from 'rxjs';
import { PipelineService, TriggerInput, PipelineResult } from './pipeline.service';
import { ScmRegistry } from './scm';
import { SecurityAnalysisService } from './drafting';
import { PrismaService } from '../../prisma/prisma.service';
import type { TaskContext } from '@trooper/shared';

function isIndexedStatus(status?: string | null): boolean {
  return status === 'idle';
}

@Controller('pipeline')
export class PipelineController {
  private readonly logger = new Logger(PipelineController.name);

  constructor(
    private readonly pipeline: PipelineService,
    private readonly scm: ScmRegistry,
    private readonly security: SecurityAnalysisService,
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  /**
   * GET /api/pipeline/repos
   * List or search repositories accessible across all registered providers,
   * enriched with RAG index status.
   */
  @Get('repos')
  async listRepos(@Query('q') query?: string, @Query('page') page?: string, @Query('provider') providerFilter?: string) {
    const providerTypes = this.scm.listProviderTypes();
    let repos: any[] = [];

    // Gather repos from all registered providers (or just the filtered one)
    const targetProviders = providerFilter
      ? providerTypes.filter((p) => p === providerFilter)
      : providerTypes;

    const results = await Promise.allSettled(
      targetProviders.map(async (providerType) => {
        const provider = this.scm.get(providerType);
        try {
          if (query && query.trim().length > 0) {
            return await provider.searchRepos(query.trim(), page ? parseInt(page, 10) : 1);
          }
          return await provider.listRepos();
        } catch (err: any) {
          this.logger.debug(`Failed to list repos from ${providerType}: ${err.message}`);
          return [];
        }
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        repos = repos.concat(result.value);
      }
    }

    const indexStates = await this.prisma.client.indexState.findMany();
    const indexMap = new Map(
      indexStates.map((s) => [`${s.repository}:${s.branch}`, s]),
    );

    return repos.map((r: any) => {
      const state = indexMap.get(`${r.fullName}:${r.defaultBranch}`);
      return {
        ...r,
        provider: r.provider ?? 'github',
        indexed: isIndexedStatus(state?.status),
        indexStatus: state?.status ?? null,
        lastSyncAt: state?.lastSyncAt ?? null,
        indexedFiles: state?.indexedFiles ?? 0,
      };
    });
  }

  /**
   * GET /api/pipeline/repos/:owner/:repo
   * Fetch a single repository with index state for its default branch.
   */
  @Get('repos/:owner/:repo')
  async getRepo(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('provider') providerHint?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    const provider = await this.scm.resolveForRepoAsync(fullName, providerHint);
    const result: any = await provider.getRepo(fullName);
    const state = await this.prisma.client.indexState.findFirst({
      where: {
        tenantId: 'default',
        repository: result.fullName,
        branch: result.defaultBranch,
      },
    });

    return {
      ...result,
      provider: result.provider ?? 'github',
      indexed: isIndexedStatus(state?.status),
      indexStatus: state?.status ?? null,
      lastSyncAt: state?.lastSyncAt ?? null,
      indexedFiles: state?.indexedFiles ?? 0,
    };
  }

  /**
   * POST /api/pipeline/trigger
   * Kick off the Trooper pipeline for a work item or ad-hoc query.
   */
  @Post('trigger')
  @HttpCode(202)
  async trigger(
    @Body() dto: TriggerInput,
  ): Promise<PipelineResult> {
    this.logger.log(`Pipeline trigger: workItem=${dto.workItemId ?? 'ad-hoc'}, repo=${dto.repositoryFullName ?? 'default'}`);
    return this.pipeline.trigger(dto);
  }

  // ─── Branch Listing ───────────────────────────────────

  /**
   * GET /api/pipeline/repos/:owner/:repo/branches
   * List branches for a repository.
   */
  @Get('repos/:owner/:repo/branches')
  async listBranches(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    return (await this.scm.resolveForRepoAsync(fullName, provider)).listBranches(fullName);
  }

  /**
   * POST /api/pipeline/runs/:runId/approve
   * Approve the plan and continue to Phase 2 (CodeGen -> PR).
   */
  @Post('runs/:runId/approve')
  @HttpCode(202)
  async approvePlan(@Param('runId') runId: string): Promise<PipelineResult> {
    this.logger.log(`Pipeline approve: runId=${runId}`);
    return this.pipeline.approvePlan(runId);
  }

  /**
   * POST /api/pipeline/runs/:runId/reject
   * Reject the plan, update the query, and re-run Phase 1.
   */
  @Post('runs/:runId/reject')
  @HttpCode(202)
  async rejectPlan(
    @Param('runId') runId: string,
    @Body() dto: { newQuery: string },
  ): Promise<PipelineResult> {
    this.logger.log(`Pipeline reject: runId=${runId}`);
    return this.pipeline.rejectPlan(runId, dto.newQuery);
  }

  /**
   * POST /api/pipeline/runs/:runId/retry
   * Retry a failed run.
   */
  @Post('runs/:runId/retry')
  @HttpCode(202)
  async retryRun(@Param('runId') runId: string): Promise<PipelineResult> {
    this.logger.log(`Pipeline retry: runId=${runId}`);
    return this.pipeline.retryRun(runId);
  }

  /**
   * POST /api/pipeline/runs/:runId/continue
   * Continue iterating on a run that paused at the iteration limit.
   * Optionally specify `additionalIterations` (defaults to 5 more).
   */
  @Post('runs/:runId/continue')
  @HttpCode(202)
  async continueRun(
    @Param('runId') runId: string,
    @Body() dto: { additionalIterations?: number },
  ): Promise<PipelineResult> {
    this.logger.log(`Pipeline continue: runId=${runId}, extra=${dto.additionalIterations ?? 'default'}`);
    return this.pipeline.continueRun(runId, dto.additionalIterations);
  }

  /**
   * POST /api/pipeline/runs/:runId/submit
   * Submit current changes as-is, skipping further iterations.
   */
  @Post('runs/:runId/submit')
  @HttpCode(202)
  async submitAsIs(@Param('runId') runId: string): Promise<PipelineResult> {
    this.logger.log(`Pipeline submit-as-is: runId=${runId}`);
    return this.pipeline.submitAsIs(runId);
  }

  /**
   * GET /api/pipeline/runs/:runId/steps
   * Stream-friendly endpoint: returns all steps for a run ordered by stage.
   */
  @Get('runs/:runId/steps')
  async getSteps(@Param('runId') runId: string) {
    return this.prisma.client.agentStep.findMany({
      where: { runId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * GET /api/pipeline/runs/:runId
   * Get full run with steps + work-item context.
   */
  @Get('runs/:runId')
  async getRun(@Param('runId') runId: string) {
    return this.prisma.client.agentRun.findUnique({
      where: { id: runId },
      include: {
        steps: { orderBy: { order: 'asc' } },
        workItem: true,
        pullRequests: true,
      },
    });
  }

  /**
   * GET /api/pipeline/runs/:runId/stream
   * SSE: stream step and run-status events in real time.
   */
  @Sse('runs/:runId/stream')
  streamRun(@Param('runId') runId: string): Observable<MessageEvent> {
    this.logger.log(`SSE stream opened for run ${runId}`);

    const stepEvents$ = fromEvent(this.events, 'pipeline.step').pipe(
      filter((payload: any) => payload.runId === runId),
      map((payload: any) => ({ data: { type: 'step', step: payload.step } }) as MessageEvent),
    );
    const runEvents$ = fromEvent(this.events, 'pipeline.run').pipe(
      filter((payload: any) => payload.runId === runId),
      map((payload: any) => ({ data: { type: 'run', status: payload.status } }) as MessageEvent),
    );

    // Merge both streams
    return new Observable<MessageEvent>((subscriber) => {
      const subs = [
        stepEvents$.subscribe(subscriber),
        runEvents$.subscribe(subscriber),
      ];
      return () => subs.forEach((s) => s.unsubscribe());
    }).pipe(
      finalize(() => this.logger.log(`SSE stream closed for run ${runId}`)),
    );
  }

  // ─── GitHub Issues ────────────────────────────────────────

  /**
   * GET /api/pipeline/repos/:owner/:repo/issues
   * List open issues for a repository.
   */
  @Get('repos/:owner/:repo/issues')
  async listIssues(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('state') state?: 'open' | 'closed' | 'all',
    @Query('per_page') perPage?: string,
    @Query('page') page?: string,
    @Query('q') search?: string,
    @Query('provider') provider?: string,
  ) {
    try {
      const fullName = `${owner}/${repo}`;
      return await (await this.scm.resolveForRepoAsync(fullName, provider)).listIssues(
        fullName,
        state,
        perPage ? parseInt(perPage, 10) : undefined,
        page ? parseInt(page, 10) : undefined,
        search,
      );
    } catch (err: any) {
      if (err?.status === 403) throw new ForbiddenException('Token lacks issues:read permission for this repository');
      if (err?.status === 404) throw new NotFoundException('Repository not found');
      throw err;
    }
  }

  /**
   * GET /api/pipeline/repos/:owner/:repo/issues/:issueNumber
   * Get a single issue with full body.
   */
  @Get('repos/:owner/:repo/issues/:issueNumber')
  async getIssue(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('issueNumber') issueNumber: string,
    @Query('provider') provider?: string,
  ) {
    try {
      const fullName = `${owner}/${repo}`;
      return await (await this.scm.resolveForRepoAsync(fullName, provider)).getIssue(fullName, parseInt(issueNumber, 10));
    } catch (err: any) {
      if (err?.status === 403) throw new ForbiddenException('Token lacks issues:read permission for this repository');
      if (err?.status === 404) throw new NotFoundException('Issue not found');
      throw err;
    }
  }

  /**
   * POST /api/pipeline/repos/:owner/:repo/issues/:issueNumber/comments
   * Post a comment on an issue.
   */
  @Post('repos/:owner/:repo/issues/:issueNumber/comments')
  async postIssueComment(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('issueNumber') issueNumber: string,
    @Body() dto: { body: string },
    @Query('provider') provider?: string,
  ) {
    try {
      const fullName = `${owner}/${repo}`;
      return await (await this.scm.resolveForRepoAsync(fullName, provider)).postIssueComment(fullName, parseInt(issueNumber, 10), dto.body);
    } catch (err: any) {
      if (err?.status === 403) throw new ForbiddenException('Token lacks issues:write permission for this repository');
      if (err?.status === 404) throw new NotFoundException('Issue not found');
      throw err;
    }
  }

  // ─── Pull Requests ────────────────────────────────────────

  /**
   * GET /api/pipeline/repos/:owner/:repo/pulls
   * List pull requests for a repository.
   */
  @Get('repos/:owner/:repo/pulls')
  async listPullRequests(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('state') state?: 'open' | 'closed' | 'all' | 'draft' | 'merged',
    @Query('per_page') perPage?: string,
    @Query('page') page?: string,
    @Query('sort') sort?: 'updated' | 'created',
    @Query('provider') provider?: string,
  ) {
    try {
      const fullName = `${owner}/${repo}`;
      return await (await this.scm.resolveForRepoAsync(fullName, provider)).listPullRequests(
        fullName,
        state,
        perPage ? parseInt(perPage, 10) : undefined,
        page ? parseInt(page, 10) : undefined,
        sort,
      );
    } catch (err: any) {
      if (err?.status === 403) throw new ForbiddenException('Token lacks pull_requests:read permission for this repository');
      if (err?.status === 404) throw new NotFoundException('Repository not found');
      throw err;
    }
  }

  /**
   * GET /api/pipeline/repos/:owner/:repo/pulls/:prNumber
   * Get a single PR with changed files.
   */
  @Get('repos/:owner/:repo/pulls/:prNumber')
  async getPullRequest(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('prNumber') prNumber: string,
    @Query('provider') provider?: string,
  ) {
    try {
      const fullName = `${owner}/${repo}`;
      return await (await this.scm.resolveForRepoAsync(fullName, provider)).getPullRequest(fullName, parseInt(prNumber, 10));
    } catch (err: any) {
      if (err?.status === 403) throw new ForbiddenException('Token lacks pull_requests:read permission for this repository');
      if (err?.status === 404) throw new NotFoundException('Pull request not found');
      throw err;
    }
  }

  /**
   * POST /api/pipeline/repos/:owner/:repo/pulls/:prNumber/comments
   * Post a comment on a pull request.
   */
  @Post('repos/:owner/:repo/pulls/:prNumber/comments')
  async postPRComment(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('prNumber') prNumber: string,
    @Body() dto: { body: string },
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    return (await this.scm.resolveForRepoAsync(fullName, provider)).postPRComment(fullName, parseInt(prNumber, 10), dto.body);
  }

  /**
   * POST /api/pipeline/repos/:owner/:repo/pulls/:prNumber/merge
   * Merge a pull request.
   */
  @Post('repos/:owner/:repo/pulls/:prNumber/merge')
  @HttpCode(200)
  async mergePullRequest(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('prNumber') prNumber: string,
    @Body() dto: { method?: 'merge' | 'squash' | 'rebase' },
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    await (await this.scm.resolveForRepoAsync(fullName, provider)).mergePullRequest(fullName, parseInt(prNumber, 10), dto.method);
    return { success: true };
  }

  /**
   * POST /api/pipeline/repos/:owner/:repo/pulls/:prNumber/close
   * Close a pull request without merging.
   */
  @Post('repos/:owner/:repo/pulls/:prNumber/close')
  @HttpCode(200)
  async closePullRequest(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('prNumber') prNumber: string,
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    await (await this.scm.resolveForRepoAsync(fullName, provider)).closePullRequest(fullName, parseInt(prNumber, 10));
    return { success: true };
  }

  // ─── Security ────────────────────────────────────────────

  /**
   * GET /api/pipeline/repos/:owner/:repo/security
   * Get security summary with all alerts for a repository.
   */
  @Get('repos/:owner/:repo/security')
  async getSecuritySummary(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
  ) {
    return this.security.getSecuritySummary(`${owner}/${repo}`);
  }

  /**
   * GET /api/pipeline/repos/:owner/:repo/security/:alertType/:alertId
   * Get a single security alert detail.
   */
  @Get('repos/:owner/:repo/security/:alertType/:alertId')
  async getSecurityAlert(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Param('alertType') alertType: string,
    @Param('alertId') alertId: string,
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    return (await this.scm.resolveForRepoAsync(fullName, provider)).getSecurityAlert(fullName, parseInt(alertId, 10), alertType);
  }

  // ─── Auto-Draft Flow ─────────────────────────────────────

  /**
   * POST /api/pipeline/draft
   * Auto-draft a task from context (issue, PR, security alert).
   * Returns a run in AwaitingDraftApproval status.
   */
  @Post('draft')
  @HttpCode(202)
  async triggerFromContext(@Body() ctx: TaskContext): Promise<PipelineResult> {
    this.logger.log(`Draft trigger: type=${ctx.type}, repo=${ctx.repositoryFullName}, ref=#${ctx.refNumber ?? 'n/a'}`);
    return this.pipeline.triggerFromContext(ctx);
  }

  /**
   * POST /api/pipeline/runs/:runId/approve-draft
   * Approve an auto-drafted task and begin pipeline execution.
   */
  @Post('runs/:runId/approve-draft')
  @HttpCode(202)
  async approveDraft(
    @Param('runId') runId: string,
    @Body() dto: { overrideQuery?: string },
  ): Promise<PipelineResult> {
    this.logger.log(`Draft approve: runId=${runId}`);
    return this.pipeline.approveDraft(runId, dto.overrideQuery);
  }

  // ─── Security Audit Mode ─────────────────────────────────

  /**
   * POST /api/pipeline/security-audit
   * Batch security audit: scans all alerts for a repo, filters by severity,
   * and auto-drafts remediation tasks for each matching alert.
   */
  @Post('security-audit')
  @HttpCode(202)
  async securityAudit(
    @Body() dto: { repoFullName: string; minSeverity?: string; alertTypes?: string[]; maxAlerts?: number },
  ) {
    this.logger.log(`Security audit: repo=${dto.repoFullName}, minSev=${dto.minSeverity ?? 'high'}`);

    const batch = await this.security.prepareBatchDraft({
      repoFullName: dto.repoFullName,
      minSeverity: (dto.minSeverity as any) ?? 'high',
      alertTypes: dto.alertTypes,
      maxAlerts: dto.maxAlerts,
    });

    // Auto-draft a task for each matching alert
    const results: Array<{ alertId?: number; runId: string; status: string }> = [];
    for (const ctx of batch.contexts) {
      const result = await this.pipeline.triggerFromContext(ctx);
      results.push({ alertId: ctx.refNumber, ...result });
    }

    return {
      totalAlerts: batch.totalAlerts,
      drafted: batch.drafted,
      runs: results,
    };
  }

  // ─── Enrichment ───────────────────────────────────────────

  /**
   * GET /api/pipeline/repos/:owner/:repo/activity
   * Separate open issue and open PR counts.
   */
  @Get('repos/:owner/:repo/activity')
  async getRepoActivity(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    return (await this.scm.resolveForRepoAsync(fullName, provider)).getRepoActivity(fullName);
  }

  /**
   * GET /api/pipeline/repos/:owner/:repo/languages
   * Language breakdown (bytes per language).
   */
  @Get('repos/:owner/:repo/languages')
  async getRepoLanguages(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('provider') provider?: string,
  ) {
    const fullName = `${owner}/${repo}`;
    return (await this.scm.resolveForRepoAsync(fullName, provider)).listLanguages(fullName);
  }

  // ─── SCM Provider Info ────────────────────────────────────

  /**
   * GET /api/pipeline/providers
   * List registered SCM providers and their capabilities.
   */
  @Get('providers')
  async listProviders() {
    return this.scm.listProviderTypes().map((type) => ({
      type,
      capabilities: this.scm.getCapabilities(type),
    }));
  }
}
