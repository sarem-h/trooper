import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmService } from '../llm/llm.service';
import type { ModelTier } from '../llm/llm.service';
import { RagService, type RetrievedChunk } from '../indexing/rag.service';
import { ScmRegistry } from '../pipeline/scm';
import type { ScmIssueDetail, ScmPullRequest } from '../pipeline/scm';
import type {
  CopilotCardResponse,
  CopilotGroundingStageName,
  CopilotGroundingTrace,
  CopilotModelOption,
  CopilotQuery,
  SkillDraftRequest,
  SkillDraftResponse,
  SkillRunRequest,
  SkillRunResponse,
} from '@trooper/shared';
import {
  SUMMARIZE_SYSTEM_PROMPT,
  GROUND_SYSTEM_PROMPT,
  ASK_SYSTEM_PROMPT,
  DRAFT_SKILL_SYSTEM_PROMPT,
  RUN_SKILL_SYSTEM_PROMPT,
  COPILOT_CARD_RESPONSE_SCHEMA,
  ASK_RESPONSE_SCHEMA,
  SKILL_DRAFT_RESPONSE_SCHEMA,
  SKILL_RUN_RESPONSE_SCHEMA,
} from './copilot.prompts';

// ─── Context Budget Constants ─────────────────────────────
// Generous per-item limits leveraging modern LLM context windows (128K–1M tokens).
// Precedence: metadata > description > comments > reviews > diffs > RAG chunks.
const BODY_CHAR_LIMIT = 16_000;
const COMMENT_BODY_LIMIT = 6_000;
const REVIEW_BODY_LIMIT = 6_000;
const DIFF_PATCH_LIMIT = 5_000;
const RAG_CHUNK_LIMIT = 2_000;
const MAX_COMMENTS = 80;
const MAX_REVIEWS = 50;
const MAX_DIFF_FILES = 60;
const GROUNDING_STAGE_TOTAL = 6;

const GROUNDING_STAGE_DEFINITIONS: Array<{
  id: number;
  name: CopilotGroundingStageName;
  label: string;
}> = [
  { id: 1, name: 'thread-context', label: 'Fetch thread context' },
  { id: 2, name: 'rag-retrieval', label: 'Retrieve code context' },
  { id: 3, name: 'prompt-build', label: 'Build grounded prompt' },
  { id: 4, name: 'model-inference', label: 'Run grounded model' },
  { id: 5, name: 'response-parse', label: 'Parse structured response' },
  { id: 6, name: 'response-finalize', label: 'Finalize response' },
];

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '\n…[truncated]';
}

/** Thread context fetched from the SCM provider */
interface ThreadContext {
  issueDetail?: ScmIssueDetail;
  pullDetail?: ScmPullRequest;
}

const FALLBACK_RESPONSE: CopilotCardResponse = {
  headline: 'Copilot unavailable',
  status: 'open',
  confidence: 'low',
  summaryMarkdown:
    'Copilot could not generate a summary because the Azure OpenAI request was rejected.',
  suggestionsMarkdown:
    '- Verify `AZURE_OPENAI_API_KEY`\n- Verify `AZURE_OPENAI_ENDPOINT` points to the same Azure OpenAI resource\n- Restart the API after updating `.env`',
  riskMarkdown:
    'Summaries and follow-up answers will stay unavailable until the LLM configuration is fixed.',
  evidence: ['Azure OpenAI returned 401'],
  suggestedActions: [],
};

interface CopilotModelConfig extends CopilotModelOption {
  deployment: string;
}

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  private readonly modelConfigs: CopilotModelConfig[];

  constructor(
    private readonly config: ConfigService,
    private readonly llm: LlmService,
    private readonly rag: RagService,
    private readonly scmRegistry: ScmRegistry,
  ) {
    this.modelConfigs = this.buildModelConfigs();
  }

  listModels(): CopilotModelOption[] {
    return this.modelConfigs.map((config) => {
      const { deployment, ...model } = config;
      void deployment;
      return model;
    });
  }

  async draftSkill(request: SkillDraftRequest): Promise<SkillDraftResponse> {
    const model = this.resolveModel(request.modelId);
    const userMessage = [
      `Draft mode: ${request.draftMode ?? 'new'}`,
      `Authoring prompt:\n${request.prompt.trim()}`,
      request.currentSpecFull?.trim()
        ? `Current full execution draft:\n${request.currentSpecFull.trim()}`
        : 'Current full execution draft: none yet.',
      request.currentSpecUi?.trim()
        ? `Current UI draft:\n${request.currentSpecUi.trim()}`
        : 'Current UI draft: none yet.',
    ].join('\n\n');

    const result = await this.llm.chat({
      model: model.tier,
      deployment: model.deployment,
      messages: [
        { role: 'system', content: DRAFT_SKILL_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      responseSchema: SKILL_DRAFT_RESPONSE_SCHEMA,
      temperature: 0.3,
      maxTokens: 4000,
    });

    const parsed = JSON.parse(result.message.content ?? '{}') as {
      specFull?: string;
      specUi?: string;
      changeSummary?: string;
    };

    return {
      specFull: parsed.specFull?.trim() || request.currentSpecFull || '',
      specUi: parsed.specUi?.trim() || request.currentSpecUi || parsed.specFull?.trim() || request.currentSpecFull || '',
      changeSummary: parsed.changeSummary?.trim() || 'Updated the skill draft.',
      modelId: model.id,
      modelLabel: model.label,
    };
  }

  async runSkill(request: SkillRunRequest): Promise<SkillRunResponse> {
    const model = this.resolveModel(
      request.modelId && request.modelId !== 'balanced'
        ? request.modelId
        : 'quality',
    );
    const retrievalQuery = this.buildSkillExecutionQuery(request);
    const chunks = await this.rag.queryRelevantChunks(
      request.repositoryFullName,
      request.branch,
      retrievalQuery,
      20,
    );

    if (chunks.length === 0) {
      throw new Error(
        `No indexed repository context was found for ${request.repositoryFullName}@${request.branch}.`,
      );
    }

    const chunkSection = chunks
      .map((chunk, index) =>
        [
          `### Chunk ${index + 1}`,
          `File: ${chunk.filePath}`,
          `Language: ${chunk.language}`,
          `Symbol: ${chunk.symbolName || 'n/a'}`,
          chunk.content,
        ].join('\n'),
      )
      .join('\n\n');

    const userMessage = [
      `Repository: ${request.repositoryFullName}`,
      `Branch: ${request.branch}`,
      `Skill: ${request.skillName}`,
      'Primary instruction: analyze the selected repository and produce the final engineering artifact, not a rewritten skill specification.',
      `Operator intent hint:\n${request.prompt.trim()}`,
      `Saved skill contract (source of execution guidance):\n${request.skillSpecFull.trim()}`,
      `Retrieved code context:\n${chunkSection}`,
    ].join('\n\n');

    const result = await this.llm.chat({
      model: model.tier,
      deployment: model.deployment,
      messages: [
        { role: 'system', content: RUN_SKILL_SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      responseSchema: SKILL_RUN_RESPONSE_SCHEMA,
      temperature: 0.2,
      maxTokens: 5000,
    });

    const parsed = JSON.parse(result.message.content ?? '{}') as {
      headline?: string;
      resultMarkdown?: string;
      evidence?: string[];
    };

    const retrievedFiles = Array.from(
      new Set(chunks.map((chunk) => chunk.filePath)),
    ).slice(0, 8);

    return {
      headline: parsed.headline?.trim() || `${request.skillName} result`,
      resultMarkdown:
        parsed.resultMarkdown?.trim() || 'No result was generated.',
      evidence: Array.isArray(parsed.evidence)
        ? parsed.evidence
            .filter((value) => typeof value === 'string' && value.trim())
            .slice(0, 8)
        : [],
      repositoryFullName: request.repositoryFullName,
      branch: request.branch,
      modelId: model.id,
      modelLabel: model.label,
      retrievedChunkCount: chunks.length,
      retrievedFiles,
    };
  }

  /**
   * Fast metadata + thread context summary using the worker model.
   * Fetches full issue/PR detail (comments, reviews, diffs) for rich analysis (~2-4s).
   */
  async summarize(query: CopilotQuery): Promise<CopilotCardResponse> {
    const model = this.resolveModel(query.modelId);
    const thread = await this.fetchThreadContext(query);
    const userMessage = this.buildUserMessage(query, thread);

    try {
      const result = await this.llm.chat({
        model: model.tier,
        deployment: model.deployment,
        messages: [
          { role: 'system', content: SUMMARIZE_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        responseSchema: COPILOT_CARD_RESPONSE_SCHEMA,
        temperature: 0.2,
      });

      return this.parseResponse(result.message.content);
    } catch (err: any) {
      this.logCopilotFailure('summarize', err);
      return this.buildFallbackResponse(query);
    }
  }

  /**
   * Deep analysis using RAG code context + thread context + thinker model.
   * Supports stage-by-stage verification so failures are attributable.
   */
  async ground(
    query: CopilotQuery,
    defaultBranch: string,
  ): Promise<CopilotCardResponse> {
    const searchQuery = `${query.title} ${query.body}`.slice(0, 500);
    const model = this.resolveModel(query.modelId);
    const stageLimit = this.normalizeGroundingStageLimit(
      query.groundingStageLimit,
    );
    const trace = this.createGroundingTrace(
      query.includeGroundingTrace === true || stageLimit !== undefined,
      stageLimit,
    );

    let chunks: RetrievedChunk[] = [];
    let thread: ThreadContext = {};
    let userMessage = '';
    let ragDegraded = false;

    try {
      const stage1Start = Date.now();
      thread = await this.fetchThreadContext(query);
      this.completeGroundingStage(
        trace,
        1,
        `Loaded ${
          query.type === 'issue'
            ? `${thread.issueDetail?.comments?.length ?? 0} issue comments`
            : `${thread.pullDetail?.comments?.length ?? 0} PR comments, ${thread.pullDetail?.reviews?.length ?? 0} reviews, ${thread.pullDetail?.diffFiles?.length ?? 0} diff files`
        }`,
        Date.now() - stage1Start,
      );
      if (stageLimit === 1) {
        return this.buildGroundingVerificationResponse(query, trace);
      }

      const stage2Start = Date.now();
      try {
        chunks = await this.rag.queryRelevantChunks(
          query.repositoryFullName,
          query.branch ?? defaultBranch,
          searchQuery,
          10,
        );
        this.completeGroundingStage(
          trace,
          2,
          `Retrieved ${chunks.length} repository chunk${chunks.length === 1 ? '' : 's'}`,
          Date.now() - stage2Start,
        );
      } catch (err) {
        ragDegraded = true;
        if (trace) {
          trace.ragDegraded = true;
        }
        this.failGroundingStage(
          trace,
          2,
          `RAG retrieval failed: ${this.stringifyError(err)}`,
          Date.now() - stage2Start,
        );
        this.logger.warn(
          `RAG retrieval failed, falling back to metadata-only: ${err}`,
        );
      }
      if (stageLimit === 2) {
        return this.buildGroundingVerificationResponse(query, trace);
      }

      const stage3Start = Date.now();
      userMessage = this.buildUserMessage(query, thread, chunks);
      this.completeGroundingStage(
        trace,
        3,
        `Built grounded prompt with ${chunks.length} code chunk${chunks.length === 1 ? '' : 's'}`,
        Date.now() - stage3Start,
      );
      if (stageLimit === 3) {
        return this.buildGroundingVerificationResponse(query, trace);
      }

      const stage4Start = Date.now();
      const result = await this.llm.chat({
        model: model.tier,
        deployment: model.deployment,
        messages: [
          { role: 'system', content: GROUND_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        responseSchema: COPILOT_CARD_RESPONSE_SCHEMA,
        temperature: 0.2,
      });
      this.completeGroundingStage(
        trace,
        4,
        `Model ${model.label} returned finish reason "${result.finishReason}"`,
        Date.now() - stage4Start,
      );
      if (stageLimit === 4) {
        return this.buildGroundingVerificationResponse(query, trace);
      }

      const stage5Start = Date.now();
      const parsed = this.parseResponseDetailed(result.message.content);
      if (parsed.ok) {
        this.completeGroundingStage(
          trace,
          5,
          'Structured JSON response parsed successfully',
          Date.now() - stage5Start,
        );
      } else {
        this.failGroundingStage(
          trace,
          5,
          'Model response did not parse as valid Copilot JSON',
          Date.now() - stage5Start,
        );
      }
      if (stageLimit === 5) {
        return this.buildGroundingVerificationResponse(query, trace);
      }

      const stage6Start = Date.now();
      const response = parsed.response;
      if (ragDegraded) {
        response.evidence = [
          'Code context retrieval failed — analysis is based on metadata only.',
          ...response.evidence,
        ];
      }
      if (trace) {
        this.completeGroundingStage(
          trace,
          6,
          ragDegraded
            ? 'Returned grounded response with RAG degradation noted'
            : 'Returned grounded response',
          Date.now() - stage6Start,
        );
        response.groundingTrace = trace;
      }
      return response;
    } catch (err: any) {
      this.failCurrentGroundingStage(trace, err);
      this.logCopilotFailure('ground', err);
      const fallback = this.buildFallbackResponse(query);
      if (trace) {
        fallback.groundingTrace = trace;
      }
      return fallback;
    }
  }

  /**
   * Single-turn follow-up Q&A based on prior summary context.
   * Enriched with full thread context for accurate answers.
   */
  async ask(
    query: CopilotQuery,
    question: string,
    priorSummary: string,
  ): Promise<{ answerMarkdown: string }> {
    const model = this.resolveModel(query.modelId);
    const thread = await this.fetchThreadContext(query);
    const userMessage = [
      this.buildUserMessage(query, thread),
      `\n## Prior Summary\n${priorSummary}`,
      `\n## Question\n${question}`,
    ].join('\n');

    try {
      const result = await this.llm.chat({
        model: model.tier,
        deployment: model.deployment,
        messages: [
          { role: 'system', content: ASK_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        responseSchema: ASK_RESPONSE_SCHEMA,
        temperature: 0.3,
      });

      const parsed = this.parseObject<{ answerMarkdown?: string }>(
        result.message.content,
      );
      return {
        answerMarkdown: parsed.answerMarkdown ?? 'No answer available.',
      };
    } catch (err: any) {
      this.logCopilotFailure('ask', err);
      if (this.isAuthError(err)) {
        return {
          answerMarkdown:
            'Copilot could not answer because the Azure OpenAI request was rejected. Check `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, then restart the API.',
        };
      }
      return {
        answerMarkdown: 'The assistant was unable to answer this question.',
      };
    }
  }

  // ─── Internal Helpers ───────────────────────────────────

  /**
   * Fetch full thread context (comments, reviews, diffs) from the SCM provider.
   * Degrades gracefully — returns empty context on failure.
   */
  private async fetchThreadContext(
    query: CopilotQuery,
  ): Promise<ThreadContext> {
    try {
      const scm = this.scmRegistry.resolveForRepo(query.repositoryFullName);
      if (query.type === 'issue') {
        const detail = await scm.getIssue(
          query.repositoryFullName,
          query.refNumber,
        );
        return { issueDetail: detail };
      } else {
        const detail = await scm.getPullRequest(
          query.repositoryFullName,
          query.refNumber,
        );
        return { pullDetail: detail };
      }
    } catch (err) {
      this.logger.warn(
        `Thread context fetch failed for ${query.type} #${query.refNumber}: ${err}`,
      );
      return {};
    }
  }

  /**
   * Build a highly structured user message from metadata, thread context, and optional RAG chunks.
   *
   * Layout precedence:
   *  1. Metadata (repo, title, state, labels, author, timestamps)
   *  2. Description (full body)
   *  3. Discussion thread (all comments, newest-to-oldest preserved)
   *  4. Code reviews (PRs only — approval states + reviewer feedback)
   *  5. File changes & diffs (PRs only — patches per file)
   *  6. RAG code context (grounded analysis only)
   */
  private buildUserMessage(
    query: CopilotQuery,
    thread?: ThreadContext,
    chunks?: RetrievedChunk[],
  ): string {
    const typeLabel = query.type === 'issue' ? 'Issue' : 'Pull Request';
    const parts: string[] = [];

    // ── Section 1: Header & Metadata ──
    parts.push(`## ${typeLabel} #${query.refNumber}`);
    parts.push(`**Repository:** ${query.repositoryFullName}`);
    parts.push(`**Title:** ${query.title}`);
    parts.push(`**State:** ${query.state}`);

    if (query.labels?.length) {
      parts.push(`**Labels:** ${query.labels.join(', ')}`);
    }

    if (query.type === 'issue' && thread?.issueDetail) {
      const d = thread.issueDetail;
      if (d.user) parts.push(`**Author:** @${d.user.login}`);
      parts.push(`**Created:** ${d.createdAt}`);
      parts.push(`**Updated:** ${d.updatedAt}`);
      parts.push(`**Comments:** ${d.commentsCount}`);
    } else if (query.type === 'pull' && thread?.pullDetail) {
      const d = thread.pullDetail;
      if (d.user) parts.push(`**Author:** @${d.user.login}`);
      if (d.sourceBranch && d.targetBranch) {
        parts.push(
          `**Source → Target:** ${d.sourceBranch} → ${d.targetBranch}`,
        );
      } else if (query.branch) {
        parts.push(`**Branch:** ${query.branch}`);
      }
      parts.push(`**Created:** ${d.createdAt}`);
      parts.push(`**Updated:** ${d.updatedAt}`);
      if (d.additions != null && d.deletions != null) {
        const fileCount = d.changedFiles?.length ?? d.diffFiles?.length ?? 0;
        parts.push(
          `**Changes:** +${d.additions} / -${d.deletions} across ${fileCount} file${fileCount === 1 ? '' : 's'}${d.commitsCount ? ` (${d.commitsCount} commit${d.commitsCount === 1 ? '' : 's'})` : ''}`,
        );
      }
      if (d.mergeable != null)
        parts.push(`**Mergeable:** ${d.mergeable ? 'yes' : 'no'}`);
      if (d.isDraft != null)
        parts.push(`**Draft:** ${d.isDraft ? 'yes' : 'no'}`);
      if (d.reviewDecision)
        parts.push(`**Review Decision:** ${d.reviewDecision}`);
    } else {
      // Fallback: use what's in the query
      if (query.branch) parts.push(`**Branch:** ${query.branch}`);
      if (query.changedFiles?.length) {
        parts.push(
          `**Changed Files:** ${query.changedFiles.slice(0, 20).join(', ')}`,
        );
      }
    }

    // ── Section 2: Description ──
    const body =
      query.type === 'issue' && thread?.issueDetail
        ? thread.issueDetail.body
        : query.type === 'pull' && thread?.pullDetail
          ? thread.pullDetail.body
          : query.body;

    if (body) {
      parts.push(`\n## Description\n${truncate(body, BODY_CHAR_LIMIT)}`);
    }

    // ── Section 3: Discussion Thread ──
    const comments =
      query.type === 'issue'
        ? thread?.issueDetail?.comments
        : thread?.pullDetail?.comments;

    if (comments?.length) {
      const shown = comments.slice(0, MAX_COMMENTS);
      const countNote =
        comments.length > shown.length
          ? `, showing newest ${shown.length}`
          : '';
      parts.push(
        `\n## Discussion Thread (${comments.length} comment${comments.length === 1 ? '' : 's'}${countNote})`,
      );
      for (const c of shown) {
        const author = c.user ? `@${c.user.login}` : 'Unknown';
        parts.push(`\n### ${author} — ${c.createdAt}`);
        parts.push(truncate(c.body, COMMENT_BODY_LIMIT));
      }
    }

    // ── Section 4: Code Reviews (PRs only) ──
    if (query.type === 'pull' && thread?.pullDetail?.reviews?.length) {
      const allReviews = thread.pullDetail.reviews;
      const reviews = allReviews.slice(0, MAX_REVIEWS);
      parts.push(
        `\n## Code Reviews (${allReviews.length} review${allReviews.length === 1 ? '' : 's'})`,
      );
      for (const r of reviews) {
        const author = r.user ? `@${r.user.login}` : 'Unknown';
        parts.push(
          `\n### ${author} — ${r.state}${r.submittedAt ? ` (${r.submittedAt})` : ''}`,
        );
        if (r.body) {
          parts.push(truncate(r.body, REVIEW_BODY_LIMIT));
        }
      }
    }

    // ── Section 5: File Changes & Diffs (PRs only) ──
    if (query.type === 'pull' && thread?.pullDetail?.diffFiles?.length) {
      const allDiffs = thread.pullDetail.diffFiles;
      const diffs = allDiffs.slice(0, MAX_DIFF_FILES);
      const overflowNote =
        allDiffs.length > diffs.length ? `, showing ${diffs.length}` : '';
      parts.push(
        `\n## File Changes (${allDiffs.length} file${allDiffs.length === 1 ? '' : 's'}${overflowNote})`,
      );
      for (const f of diffs) {
        parts.push(
          `\n### ${f.filename} (${f.status}, +${f.additions} / -${f.deletions})`,
        );
        if (f.patch) {
          parts.push('```diff');
          parts.push(truncate(f.patch, DIFF_PATCH_LIMIT));
          parts.push('```');
        }
      }
    }

    // ── Section 6: RAG Code Context (grounded only) ──
    if (chunks?.length) {
      parts.push('\n## Relevant Code Context (from repository)');
      for (const chunk of chunks) {
        parts.push(
          `\n### ${chunk.filePath} (${chunk.language}, relevance: ${chunk.score.toFixed(2)})`,
          '```' + chunk.language,
          truncate(chunk.content, RAG_CHUNK_LIMIT),
          '```',
        );
      }
    }

    return parts.join('\n');
  }

  private normalizeGroundingStageLimit(
    stageLimit?: number,
  ): number | undefined {
    if (!stageLimit) return undefined;
    return Math.max(1, Math.min(GROUNDING_STAGE_TOTAL, Math.floor(stageLimit)));
  }

  private createGroundingTrace(
    enabled: boolean,
    stageLimit?: number,
  ): CopilotGroundingTrace | undefined {
    if (!enabled) return undefined;

    return {
      mode: stageLimit ? 'verification' : 'full',
      stageLimit,
      completedStage: 0,
      totalStages: GROUNDING_STAGE_TOTAL,
      stoppedEarly: false,
      ragDegraded: false,
      stages: GROUNDING_STAGE_DEFINITIONS.map((stage) => ({
        ...stage,
        status: 'pending',
      })),
    };
  }

  private completeGroundingStage(
    trace: CopilotGroundingTrace | undefined,
    stageId: number,
    detail: string,
    durationMs: number,
  ): void {
    if (!trace) return;

    const stage = trace.stages.find((entry) => entry.id === stageId);
    if (!stage) return;

    stage.status = 'completed';
    stage.detail = detail;
    stage.durationMs = durationMs;
    trace.completedStage = Math.max(trace.completedStage, stageId);
  }

  private failGroundingStage(
    trace: CopilotGroundingTrace | undefined,
    stageId: number,
    detail: string,
    durationMs?: number,
  ): void {
    if (!trace) return;

    const stage = trace.stages.find((entry) => entry.id === stageId);
    if (!stage) return;

    stage.status = 'failed';
    stage.detail = detail;
    if (durationMs !== undefined) {
      stage.durationMs = durationMs;
    }
    trace.completedStage = Math.max(trace.completedStage, stageId - 1);
  }

  private failCurrentGroundingStage(
    trace: CopilotGroundingTrace | undefined,
    err: unknown,
  ): void {
    if (!trace) return;

    const currentStage = trace.stages.find(
      (stage) => stage.status === 'pending',
    );
    if (!currentStage) return;

    currentStage.status = 'failed';
    currentStage.detail = this.stringifyError(err);
  }

  private buildGroundingVerificationResponse(
    query: CopilotQuery,
    trace: CopilotGroundingTrace | undefined,
  ): CopilotCardResponse {
    if (trace) {
      trace.stoppedEarly = true;
      for (const stage of trace.stages) {
        if (stage.id > trace.completedStage && stage.status === 'pending') {
          stage.status = 'skipped';
          stage.detail =
            stage.id === trace.completedStage + 1
              ? 'Not executed yet — increase the stage limit to continue verification.'
              : 'Skipped because verification stopped earlier in the pipeline.';
        }
      }
    }

    const nextStage =
      trace && trace.completedStage < trace.totalStages
        ? GROUNDING_STAGE_DEFINITIONS.find(
            (stage) => stage.id === trace.completedStage + 1,
          )
        : undefined;

    return {
      headline: `Grounding pipeline verified through stage ${trace?.completedStage ?? 0}/${trace?.totalStages ?? GROUNDING_STAGE_TOTAL}`,
      status: this.mapStatus(query),
      confidence: 'medium',
      summaryMarkdown: nextStage
        ? `Verification mode stopped after **Stage ${trace?.completedStage}: ${trace?.stages[trace.completedStage - 1]?.label ?? 'Completed stage'}**. The next execution will continue with **Stage ${nextStage.id}: ${nextStage.label}** when you raise the stage cap.`
        : 'Verification mode completed all configured stages.',
      suggestionsMarkdown: nextStage
        ? `- Review the stage trace below for timings and details\n- Increase the stage cap to **${nextStage.id}** to verify the next integration point\n- Keep using the same issue or pull request while advancing stages so the signal stays stable`
        : '- Review the full trace below\n- The grounded pipeline completed end to end in verification mode',
      riskMarkdown:
        'This is a verification response, not a final grounded Copilot analysis. The model output may not have been executed yet.',
      evidence:
        trace?.stages
          .filter((stage) => stage.status === 'completed')
          .map(
            (stage) =>
              `Stage ${stage.id} (${stage.label}) completed${stage.durationMs !== undefined ? ` in ${stage.durationMs}ms` : ''}`,
          ) ?? [],
      suggestedActions: [],
      groundingTrace: trace,
    };
  }

  private parseResponseDetailed(content: string | null): {
    response: CopilotCardResponse;
    ok: boolean;
  } {
    const text = content ?? '{}';
    try {
      const parsed = this.parseObject<{
        headline?: string;
        status?: CopilotCardResponse['status'];
        confidence?: CopilotCardResponse['confidence'];
        summaryMarkdown?: string;
        suggestionsMarkdown?: string;
        riskMarkdown?: string;
        evidence?: string[];
        suggestedActions?: CopilotCardResponse['suggestedActions'];
      }>(text);
      return {
        ok: true,
        response: {
          headline: parsed.headline ?? 'Untitled',
          status: parsed.status ?? 'open',
          confidence: parsed.confidence ?? 'low',
          summaryMarkdown: parsed.summaryMarkdown ?? '',
          suggestionsMarkdown: parsed.suggestionsMarkdown ?? '',
          riskMarkdown: parsed.riskMarkdown || undefined,
          evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
          suggestedActions: Array.isArray(parsed.suggestedActions)
            ? parsed.suggestedActions
            : [],
        },
      };
    } catch {
      this.logger.error(
        `Failed to parse copilot response JSON: ${text.slice(0, 200)}`,
      );
      return { response: FALLBACK_RESPONSE, ok: false };
    }
  }

  private stringifyError(err: unknown): string {
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === 'string') return err;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }

  private parseResponse(content: string | null): CopilotCardResponse {
    return this.parseResponseDetailed(content).response;
  }

  private isAuthError(
    err: unknown,
  ): err is { status?: number; message?: string } {
    if (!err || typeof err !== 'object') return false;

    const candidate = err as { status?: number; message?: string };
    return (
      candidate.status === 401 || candidate.message?.includes('401') === true
    );
  }

  private logCopilotFailure(
    operation: 'summarize' | 'ground' | 'ask',
    err: unknown,
  ): void {
    if (this.isAuthError(err)) {
      this.logger.warn(
        `Copilot ${operation} failed: Azure OpenAI rejected the request. Check AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT.`,
      );
      return;
    }

    this.logger.error(
      `Copilot ${operation} failed: ${this.stringifyError(err)}`,
    );
  }

  private parseObject<T extends object>(content: string | null): T {
    const raw = content ?? '{}';
    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {} as T;
    }

    return parsed as T;
  }

  private buildFallbackResponse(query: CopilotQuery): CopilotCardResponse {
    return {
      ...FALLBACK_RESPONSE,
      status: this.mapStatus(query),
    };
  }

  private buildModelConfigs(): CopilotModelConfig[] {
    return [
      {
        id: 'balanced',
        label: 'gpt-4.1-mini',
        description: 'Recommended default for issue and PR summaries.',
        tier: 'worker',
        deployment:
          this.config.get<string>('AZURE_OPENAI_COPILOT_BALANCED_DEPLOYMENT') ??
          this.config.get<string>('AZURE_OPENAI_WORKER_DEPLOYMENT') ??
          'gpt-4.1-mini',
        isDefault: true,
      },
      {
        id: 'quality',
        label: 'gpt-4.1',
        description:
          'Higher quality summaries when accuracy matters more than latency.',
        tier: 'thinker',
        deployment:
          this.config.get<string>('AZURE_OPENAI_COPILOT_QUALITY_DEPLOYMENT') ??
          this.config.get<string>('AZURE_OPENAI_THINKER_DEPLOYMENT') ??
          'gpt-4.1',
        isDefault: false,
      },
      {
        id: 'reasoning',
        label: 'gpt-5.1-thinking',
        description:
          'Best for complex repository analysis and ambiguous changes.',
        tier: 'thinker',
        deployment:
          this.config.get<string>(
            'AZURE_OPENAI_COPILOT_REASONING_DEPLOYMENT',
          ) ?? 'gpt-5.1-thinking',
        isDefault: false,
      },
    ];
  }

  private buildSkillExecutionQuery(request: SkillRunRequest): string {
    return [
      request.skillName,
      request.prompt,
      request.skillSpecFull,
      'analyze the repository architecture using indexed code evidence',
      'system boundaries runtime layers services modules packages applications integrations persistence auth queues messaging api database deployment infrastructure docker ci cd prisma next nest turbo mermaid',
    ]
      .join('\n\n')
      .slice(0, 6000);
  }

  private resolveModel(modelId?: string): CopilotModelConfig {
    const fallback =
      this.modelConfigs.find((model) => model.isDefault) ??
      this.modelConfigs[0];
    if (!fallback) {
      return {
        id: 'balanced',
        label: 'Balanced',
        description: 'Recommended default for issue and PR summaries.',
        tier: 'worker' as ModelTier,
        deployment:
          this.config.get<string>('AZURE_OPENAI_WORKER_DEPLOYMENT') ??
          'gpt-4.1-mini',
        isDefault: true,
      };
    }

    if (!modelId) return fallback;

    const selected = this.modelConfigs.find((model) => model.id === modelId);
    if (!selected) {
      this.logger.warn(
        `Unknown Copilot model id "${modelId}". Falling back to ${fallback.id}.`,
      );
      return fallback;
    }

    return selected;
  }

  private mapStatus(query: CopilotQuery): CopilotCardResponse['status'] {
    const s = query.state?.toLowerCase();
    if (s === 'merged') return 'merged';
    if (s === 'closed') return 'closed';
    if (s === 'draft') return 'draft';
    return 'open';
  }
}
