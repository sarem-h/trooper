import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../../llm/llm.service';
import type { TaskContext } from '@trooper/shared';

export interface DraftResult {
  /** Generated user query for the pipeline */
  query: string;
  /** One-line summary of the draft */
  summary: string;
  /** Suggested branch name */
  suggestedBranch?: string;
}

const DRAFT_SYSTEM_PROMPT = `You are a senior software engineer AI assistant that converts contextual information (GitHub issues, pull requests, security alerts) into precise, actionable coding task descriptions.

Given the context about a specific issue, PR, or security alert, generate:
1. A clear, detailed query that a coding agent can act on
2. A concise one-line summary
3. A suggested branch name

Your query should be specific enough for an autonomous coding agent to understand exactly what code changes are needed. Include relevant details from the context like file paths, error messages, affected components, and the desired outcome.

Respond in JSON format:
{
  "query": "string — detailed task description for the coding agent",
  "summary": "string — one-line summary",
  "suggestedBranch": "string — kebab-case branch name"
}`;

@Injectable()
export class TaskDrafterService {
  private readonly logger = new Logger(TaskDrafterService.name);

  constructor(private readonly llm: LlmService) {}

  async draft(context: TaskContext): Promise<DraftResult> {
    const userPrompt = this.buildPrompt(context);

    const result = await this.llm.chat({
      model: 'worker',
      messages: [
        { role: 'system', content: DRAFT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      responseSchema: {
        name: 'draft',
        schema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            summary: { type: 'string' },
            suggestedBranch: { type: 'string' },
          },
          required: ['query', 'summary'],
          additionalProperties: false,
        },
      },
      temperature: 0.2,
    });

    const text = result.message.content ?? '{}';
    try {
      const parsed = JSON.parse(text);
      this.logger.log(`Draft generated for ${context.type} context: "${parsed.summary}"`);
      return {
        query: parsed.query,
        summary: parsed.summary,
        suggestedBranch: parsed.suggestedBranch,
      };
    } catch {
      this.logger.error(`Failed to parse draft JSON: ${text}`);
      return {
        query: `Fix ${context.type}: ${context.title ?? 'Unknown'}`,
        summary: context.title ?? 'Auto-drafted task',
      };
    }
  }

  private buildPrompt(ctx: TaskContext): string {
    const parts: string[] = [
      `## Context Type: ${ctx.type.toUpperCase()}`,
      `## Repository: ${ctx.repositoryFullName}`,
    ];

    if (ctx.refNumber) parts.push(`## Reference: #${ctx.refNumber}`);
    if (ctx.title) parts.push(`## Title: ${ctx.title}`);
    if (ctx.body) parts.push(`## Description:\n${ctx.body}`);

    if (ctx.type === 'security') {
      if (ctx.alertType) parts.push(`## Alert Type: ${ctx.alertType}`);
      if (ctx.severity) parts.push(`## Severity: ${ctx.severity}`);
      if (ctx.affectedComponent) parts.push(`## Affected Component: ${ctx.affectedComponent}`);
    }

    return parts.join('\n\n');
  }
}
