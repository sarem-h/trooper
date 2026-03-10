import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from './llm.service';
import { McpRegistry } from '../mcp/mcp.registry';
import { ScmContext } from '../mcp/mcp.types';
import {
  PLANNER_SYSTEM_PROMPT,
  PLANNER_OUTPUT_PROMPT,
  CODER_CREATE_SYSTEM_PROMPT,
  CODER_MODIFY_SYSTEM_PROMPT,
  REVIEWER_SYSTEM_PROMPT,
} from './prompts';
import { Plan, PlanTask, PLAN_JSON_SCHEMA, ReviewResult, REVIEW_JSON_SCHEMA } from './schemas';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { emptyUsage, addUsage, fromApiUsage, type TokenUsage } from './tokenizer';
import { SandboxService, type SandboxVerifyResult } from './sandbox.service';

/**
 * Default max iterations for the code → verify → fix loop.
 * When reached, the pipeline pauses for user to "Continue" or accept.
 * Inspired by GitHub Copilot agent mode's configurable iteration limit.
 */
export const DEFAULT_MAX_ITERATIONS = 5;

// ─── Execution Result Types ─────────────────────────────────

export interface ExecutionPlanResult {
  plan: Plan;
  /** Files the planner read for context (logged for transparency) */
  exploredFiles: string[];
  /** Accumulated token usage for the planning phase */
  usage: TokenUsage;
}

export interface ExecutionCodeResult {
  changes: Array<{ path: string; content: string }>;
  review?: ReviewResult;
  /** Accumulated token usage for the coding + review phase */
  usage: TokenUsage;
}

// ─── Execution Orchestrator ────────────────────────────────

/**
 * The Execution Orchestrator coordinates multi-agent LLM workflows.
 *
 * Phase 1 — Planning:
 *   Supervisor (Thinker model) uses MCP tools to explore the repo,
 *   then produces a structured Plan.
 *
 * Phase 2 — Coding:
 *   N parallel Coder sub-agents (Worker model) each generate code
 *   for one file from the plan. A Reviewer agent validates coherence.
 */
@Injectable()
export class ExecutionOrchestratorService {
  private readonly logger = new Logger(ExecutionOrchestratorService.name);

  constructor(
    private readonly llm: LlmService,
    private readonly mcp: McpRegistry,
    private readonly sandbox: SandboxService,
  ) {}

  // ─── Phase 1: Plan ──────────────────────────────────────

  /**
   * Run the Planner agent.
   * Uses the Thinker model with MCP tools to explore the repo,
   * then outputs a structured plan.
   */
  async plan(
    query: string,
    fileTree: string,
    context: ScmContext,
    ragContext?: string,
  ): Promise<ExecutionPlanResult> {
    const exploredFiles: string[] = [];

    // Step 1: Exploration phase — Thinker model uses tools
    const userParts = [
      `## User Request\n${query}`,
      `\n## Repository: ${context.repoFullName} (branch: ${context.branch})`,
      `\n## File Tree\n\`\`\`\n${fileTree}\n\`\`\``,
    ];

    if (ragContext) {
      userParts.push(
        `\n## Relevant Code Context (retrieved via RAG — most relevant files for this task)\n${ragContext}`,
        `\nThe above code context was retrieved by semantic search. Use it as a starting point — you may still explore additional files with tools if needed.`,
      );
    } else {
      userParts.push(
        `\nExplore the repository using the available tools to understand the codebase, then produce a plan.`,
      );
    }

    const explorationMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: PLANNER_SYSTEM_PROMPT },
      { role: 'user', content: userParts.join('\n') },
    ];

    const tools = this.mcp.toOpenAITools(context);

    // Run the tool-calling loop — the LLM will autonomously read files
    const explorationResult = await this.llm.chatWithTools(
      {
        model: 'thinker',
        messages: explorationMessages,
        tools,
        temperature: 0.2,
      },
      async (toolName, args) => {
        this.logger.debug(`Planner tool call: ${toolName}(${JSON.stringify(args)})`);
        if (toolName === 'read_file' && args.path) {
          exploredFiles.push(args.path);
        } else if (toolName === 'read_multiple_files' && args.paths) {
          exploredFiles.push(...(args.paths as string[]));
        }
        return this.mcp.executeTool(context, toolName, args);
      },
    );

    let usage = explorationResult.accumulatedUsage;

    // Step 2: Plan generation — force structured output
    const planMessages: ChatCompletionMessageParam[] = [
      ...explorationMessages,
      explorationResult.message as ChatCompletionMessageParam,
      {
        role: 'user',
        content: PLANNER_OUTPUT_PROMPT,
      },
    ];

    const planResult = await this.llm.chat({
      model: 'thinker',
      messages: planMessages,
      responseSchema: { name: 'plan', schema: PLAN_JSON_SCHEMA },
      temperature: 0.1,
    });

    usage = addUsage(usage, fromApiUsage(planResult.usage));

    const planText = planResult.message.content ?? '{}';
    let plan: Plan;
    try {
      plan = JSON.parse(planText);
    } catch {
      this.logger.error(`Failed to parse plan JSON: ${planText}`);
      plan = { summary: 'Failed to generate plan', reasoning: '', tasks: [] };
    }

    this.logger.log(
      `Planner produced ${plan.tasks.length} tasks, explored ${exploredFiles.length} files (usage: ${usage.totalTokens} tokens)`,
    );

    return { plan, exploredFiles, usage };
  }

  // ─── Phase 2: Code ──────────────────────────────────────

  /**
   * Run N parallel Coder sub-agents, one per task in the plan.
   * Each coder generates the full file content for its assigned task.
   */
  async code(
    query: string,
    plan: Plan,
    context: ScmContext,
  ): Promise<ExecutionCodeResult> {
    this.logger.log(`Execution Orchestrator coding: ${plan.tasks.length} parallel coder agents`);

    // Fetch existing file contents for "modify" tasks (in parallel)
    const existingContents = new Map<string, string>();
    const modifyTasks = plan.tasks.filter((t) => t.action === 'modify');
    if (modifyTasks.length > 0) {
      const contents = await Promise.all(
        modifyTasks.map(async (task) => {
          try {
            const content = await this.mcp.executeTool(context, 'read_file', {
              path: task.path,
            });
            return { path: task.path, content };
          } catch {
            return { path: task.path, content: '' };
          }
        }),
      );
      for (const { path, content } of contents) {
        existingContents.set(path, content);
      }
    }

    // Dispatch parallel coder agents
    const coderOptions = plan.tasks.map((task) =>
      this.buildCoderPrompt(query, plan, task, existingContents.get(task.path)),
    );

    const results = await this.llm.parallel(coderOptions);

    let usage = emptyUsage();
    const changes = results.map((result, i) => {
      usage = addUsage(usage, fromApiUsage(result.usage));
      const task = plan.tasks[i];
      const raw = this.cleanCoderOutput(result.message.content ?? '');
      const existing = existingContents.get(task.path);

      if (task.action === 'modify' && existing) {
        return {
          path: task.path,
          content: this.applySearchReplaceBlocks(existing, raw),
        };
      }

      return { path: task.path, content: raw };
    });

    this.logger.log(`Execution Orchestrator coding complete: ${changes.length} files generated`);

    return { changes, usage };
  }

  /**
   * Optional: Run a Reviewer agent to validate the generated code.
   */
  async review(
    query: string,
    plan: Plan,
    changes: Array<{ path: string; content: string }>,
  ): Promise<{ result: ReviewResult; usage: TokenUsage }> {
    const changesText = changes
      .map((c) => `── ${c.path} ──\n${c.content}`)
      .join('\n\n');

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: REVIEWER_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          `## Original Request\n${query}`,
          `\n## Plan\n${plan.summary}`,
          `\n## Generated Files\n${changesText}`,
        ].join('\n'),
      },
    ];

    const result = await this.llm.chat({
      model: 'worker',
      messages,
      responseSchema: { name: 'review', schema: REVIEW_JSON_SCHEMA },
      temperature: 0,
    });

    const reviewUsage = fromApiUsage(result.usage);

    try {
      return {
        result: JSON.parse(result.message.content ?? '{"approved":true,"issues":[],"fixes":[]}'),
        usage: reviewUsage,
      };
    } catch {
      return {
        result: { approved: true, issues: [], fixes: [] },
        usage: reviewUsage,
      };
    }
  }

  // ─── Combined: Agentic Code + Verify + Fix Loop ──────

  /**
   * Generate code, verify it in a sandbox, and iteratively fix issues
   * until all checks pass or the iteration limit is reached.
   *
   * This mirrors GitHub Copilot's agent mode:
   *   1. Generate code for all tasks
   *   2. LLM Reviewer validates coherence
   *   3. Sandbox runs actual build/lint/test commands
   *   4. If sandbox fails, feed real compiler errors back to coders
   *   5. Repeat up to `maxIterations` times
   *   6. When limit reached, return with `iterationLimitReached: true`
   *      so the pipeline can pause and let the user "Continue"
   *
   * @param query         The user's original request
   * @param plan          The structured plan from the Planner
   * @param context       SCM context (repo, branch, etc.)
   * @param maxIterations Max fix iterations (default: 5)
   * @param onRetry       Callback for each retry attempt
   */
  async codeWithRetry(
    query: string,
    plan: Plan,
    context: ScmContext,
    maxIterations = DEFAULT_MAX_ITERATIONS,
    onRetry?: (attempt: number, review: ReviewResult, sandboxResult?: SandboxVerifyResult) => void,
  ): Promise<ExecutionCodeResult & { iterationLimitReached?: boolean; iteration?: number }> {
    // First pass — generate all files
    let codeResult = await this.code(query, plan, context);
    let changes = codeResult.changes;
    let totalUsage = codeResult.usage;
    let lastReview: ReviewResult | undefined;

    for (let attempt = 1; attempt <= maxIterations; attempt++) {
      // ── Step 1: LLM Review ─────────────────────────────
      const { result: reviewResult, usage: reviewUsage } = await this.review(query, plan, changes);
      totalUsage = addUsage(totalUsage, reviewUsage);
      lastReview = reviewResult;

      // ── Step 2: Sandbox Verification ───────────────────
      // Run the actual code in a sandbox to get real compiler/linter errors
      const sessionId = `run-${context.repoFullName.replace('/', '-')}-${Date.now()}`;
      let sandboxResult: SandboxVerifyResult | undefined;

      if (this.sandbox.isConfigured) {
        try {
          sandboxResult = await this.sandbox.verify(
            sessionId,
            context.repoFullName,
            context.branch,
            changes,
          );
          this.logger.log(
            `Sandbox verify (attempt ${attempt}): passed=${sandboxResult.passed}, errors=${sandboxResult.errors.length}`,
          );
        } catch (err) {
          this.logger.warn(`Sandbox verification failed, falling back to review only: ${err}`);
        }
      }

      // ── Step 3: Decide ─────────────────────────────────
      const reviewPassed = reviewResult.approved;
      const sandboxPassed = sandboxResult ? sandboxResult.passed : true; // no sandbox = trust review

      if (reviewPassed && sandboxPassed) {
        this.logger.log(
          `Code approved on attempt ${attempt} (${totalUsage.totalTokens} tokens). ` +
          `Review: ✓, Sandbox: ${sandboxResult ? '✓' : 'N/A'}`,
        );
        return { changes, review: reviewResult, usage: totalUsage, iteration: attempt };
      }

      // Last iteration — don't fix, just return with limit flag
      if (attempt === maxIterations) {
        this.logger.warn(
          `Iteration limit reached (${maxIterations}). Review: ${reviewPassed ? '✓' : '✗'}, ` +
          `Sandbox: ${sandboxPassed ? '✓' : '✗'}`,
        );
        return {
          changes,
          review: reviewResult,
          usage: totalUsage,
          iterationLimitReached: true,
          iteration: attempt,
        };
      }

      // ── Step 4: Build Fix Feedback ─────────────────────
      // Combine LLM review issues + real sandbox errors for targeted fixes
      const feedbackParts: string[] = [];

      if (!reviewPassed) {
        feedbackParts.push(
          `## Code Review Issues\n${reviewResult.issues.join('\n')}`,
        );
      }

      if (sandboxResult && !sandboxPassed) {
        feedbackParts.push(
          `## Build/Lint Errors (from sandbox execution)\n` +
          `These are REAL compiler/linter errors — fix them:\n${sandboxResult.errors.join('\n')}`,
        );
        if (sandboxResult.output) {
          feedbackParts.push(
            `\n### Raw Output\n\`\`\`\n${sandboxResult.output.slice(0, 3000)}\n\`\`\``,
          );
        }
      }

      const feedbackText = feedbackParts.join('\n\n');

      this.logger.warn(
        `Attempt ${attempt}/${maxIterations} failed. ` +
        `Review: ${reviewPassed ? '✓' : '✗'}, Sandbox: ${sandboxPassed ? '✓' : '✗'}. Fixing...`,
      );
      onRetry?.(attempt, reviewResult, sandboxResult);

      // ── Step 5: Fix Targeted Files ─────────────────────
      // Determine which files need fixes
      const filesToFix = new Set<string>();

      // From review fixes
      for (const fix of reviewResult.fixes) {
        filesToFix.add(fix.path);
      }

      // From sandbox errors — parse file paths from error messages
      if (sandboxResult && !sandboxPassed) {
        for (const error of sandboxResult.errors) {
          // Match common error formats: "path/file.ts(line,col):" or "path/file.ts:line:col:"
          const pathMatch = error.match(/^([^\s(]+\.\w+)/);
          if (pathMatch) {
            const errorPath = pathMatch[1];
            const matchingChange = changes.find(
              (c) => c.path === errorPath || c.path.endsWith(errorPath),
            );
            if (matchingChange) filesToFix.add(matchingChange.path);
          }
        }
      }

      // If no specific files identified, retry all
      if (filesToFix.size === 0) {
        const regenResult = await this.code(query, plan, context);
        changes = regenResult.changes;
        totalUsage = addUsage(totalUsage, regenResult.usage);
        continue;
      }

      // Build targeted retry prompts — only for files with issues
      const retryPromises = plan.tasks
        .filter((task) => filesToFix.has(task.path))
        .map(async (task) => {
          const fix = reviewResult.fixes.find((f) => f.path === task.path);
          const prevContent = changes.find((c) => c.path === task.path)?.content ?? '';
          const isModify = task.action === 'modify';
          const systemPrompt = isModify ? CODER_MODIFY_SYSTEM_PROMPT : CODER_CREATE_SYSTEM_PROMPT;

          const retryResult = await this.llm.chat({
            model: 'worker',
            messages: [
              { role: 'system', content: systemPrompt },
              {
                role: 'user',
                content: [
                  `## Overall Goal\n${query}`,
                  `\n## Your Task\nFile: ${task.path}\nAction: ${task.action}\n\n${task.description}`,
                  `\n## Your Previous Output\n\`\`\`\n${prevContent}\n\`\`\``,
                  `\n## Fix These Issues\n${fix?.description ?? ''}\n\n${feedbackText}`,
                  isModify
                    ? `\nOutput ONLY corrected search/replace blocks for "${task.path}". No markdown fences, no explanations.`
                    : `\nOutput the corrected complete file content for "${task.path}". No markdown fences, no explanations.`,
                ].join('\n'),
              },
            ],
            temperature: 0.1,
          });

          totalUsage = addUsage(totalUsage, fromApiUsage(retryResult.usage));

          const raw = this.cleanCoderOutput(retryResult.message.content ?? '');
          return {
            path: task.path,
            content: isModify ? this.applySearchReplaceBlocks(prevContent, raw) : raw,
          };
        });

      const fixedFiles = await Promise.all(retryPromises);

      // Merge fixed files into the existing changeset
      for (const fixed of fixedFiles) {
        const idx = changes.findIndex((c) => c.path === fixed.path);
        if (idx >= 0) {
          changes[idx] = fixed;
        }
      }
    }

    // Shouldn't reach here, but safety fallback
    return {
      changes,
      review: lastReview,
      usage: totalUsage,
      iterationLimitReached: true,
      iteration: maxIterations,
    };
  }

  // ─── Helpers ────────────────────────────────────────────

  private buildCoderPrompt(
    query: string,
    plan: Plan,
    task: PlanTask,
    existingContent?: string,
  ) {
    const parts: string[] = [
      `## Overall Goal\n${query}`,
      `\n## Plan Summary\n${plan.summary}`,
      `\n## Your Task\nFile: ${task.path}\nAction: ${task.action}\n\n${task.description}`,
    ];

    if (task.action === 'modify' && existingContent) {
      parts.push(`\n## Current File Contents\n\`\`\`\n${existingContent}\n\`\`\``);
    }

    // For context, show what other files are being created/modified
    const otherTasks = plan.tasks.filter((t) => t.path !== task.path);
    if (otherTasks.length > 0) {
      parts.push(
        `\n## Other Files Being Changed (for reference)\n` +
          otherTasks.map((t) => `- ${t.path} (${t.action}): ${t.description}`).join('\n'),
      );
    }

    parts.push(
      task.action === 'modify'
        ? `\nOutput ONLY search/replace blocks for "${task.path}". No markdown fences, no explanations.`
        : `\nOutput ONLY the complete file content for "${task.path}". No markdown fences, no explanations.`,
    );

    const systemPrompt = task.action === 'modify'
      ? CODER_MODIFY_SYSTEM_PROMPT
      : CODER_CREATE_SYSTEM_PROMPT;

    return {
      model: 'worker' as const,
      messages: [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: parts.join('\n') },
      ],
      temperature: 0.1,
    };
  }

  /** Strip any accidental markdown fences from coder output */
  private cleanCoderOutput(content: string): string {
    let cleaned = content.trim();
    // Remove leading ```<lang> and trailing ```
    if (cleaned.startsWith('```')) {
      const firstNewline = cleaned.indexOf('\n');
      if (firstNewline !== -1) {
        cleaned = cleaned.slice(firstNewline + 1);
      }
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3).trimEnd();
    }
    return cleaned;
  }

  /**
   * Parse and apply search/replace blocks to an existing file.
   * Falls back to treating the output as full-file content if no blocks are found.
   */
  private applySearchReplaceBlocks(original: string, output: string): string {
    const blockRegex = /<<<<<<< SEARCH\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> REPLACE/g;
    const blocks: Array<{ search: string; replace: string }> = [];

    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(output)) !== null) {
      blocks.push({ search: match[1], replace: match[2] });
    }

    // Fallback: no search/replace blocks found — treat as full-file output
    if (blocks.length === 0) {
      this.logger.warn('No search/replace blocks found in coder output, using as full-file content');
      return output;
    }

    let result = original;
    for (const block of blocks) {
      const idx = result.indexOf(block.search);
      if (idx === -1) {
        this.logger.warn(
          `Search block not found in file, skipping (first 80 chars): ${block.search.slice(0, 80)}`,
        );
        continue;
      }
      result =
        result.slice(0, idx) +
        block.replace +
        result.slice(idx + block.search.length);
    }

    return result;
  }
}
