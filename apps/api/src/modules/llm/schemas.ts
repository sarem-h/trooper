/**
 * Zod schemas for LLM structured outputs.
 * Used with Azure OpenAI's JSON Schema response_format.
 */

// ─── Plan Schema (output of PlannerAgent) ───────────────────

export interface PlanTask {
  path: string;
  action: 'create' | 'modify';
  description: string;
}

export interface Plan {
  summary: string;
  reasoning: string;
  tasks: PlanTask[];
}

/** JSON Schema for the planner structured output */
export const PLAN_JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    summary: { type: 'string' as const, description: 'A 1-2 sentence description of the overall plan' },
    reasoning: { type: 'string' as const, description: 'Detailed reasoning about the plan' },
    tasks: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          path: { type: 'string' as const, description: 'Relative file path' },
          action: { type: 'string' as const, enum: ['create', 'modify'] },
          description: { type: 'string' as const, description: 'What to do with this file' },
        },
        required: ['path', 'action', 'description'],
        additionalProperties: false,
      },
    },
  },
  required: ['summary', 'reasoning', 'tasks'],
  additionalProperties: false,
};

// ─── Review Schema (output of ReviewerAgent) ────────────────

export interface ReviewResult {
  approved: boolean;
  issues: string[];
  fixes: Array<{ path: string; description: string }>;
}

export const REVIEW_JSON_SCHEMA = {
  type: 'object' as const,
  properties: {
    approved: { type: 'boolean' as const },
    issues: { type: 'array' as const, items: { type: 'string' as const } },
    fixes: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          path: { type: 'string' as const },
          description: { type: 'string' as const },
        },
        required: ['path', 'description'],
        additionalProperties: false,
      },
    },
  },
  required: ['approved', 'issues', 'fixes'],
  additionalProperties: false,
};
