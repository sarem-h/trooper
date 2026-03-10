import type { ModelTier } from './llm.service';

// GPT-4.1 and GPT-4.1-mini both use o200k_base encoding (GPT-4o family).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { encode: encodeTokens } = require('gpt-tokenizer/cjs/encoding/o200k_base') as {
  encode: (text: string) => number[];
};

// ─── Model Limits ───────────────────────────────────────────

function envInt(key: string, fallback: number): number {
  const val = process.env[key];
  return val ? parseInt(val, 10) : fallback;
}

export const MODEL_LIMITS: Record<ModelTier, { contextWindow: number; maxOutput: number }> = {
  thinker: {
    contextWindow: envInt('LLM_THINKER_CONTEXT_WINDOW', 1_048_576),
    maxOutput: envInt('LLM_THINKER_MAX_OUTPUT', 32_768),
  },
  worker: {
    contextWindow: envInt('LLM_WORKER_CONTEXT_WINDOW', 1_048_576),
    maxOutput: envInt('LLM_WORKER_MAX_OUTPUT', 16_384),
  },
};

// ─── Token Counting ─────────────────────────────────────────

export function countTokens(text: string): number {
  return encodeTokens(text).length;
}

/**
 * Count tokens in a chat message array using OpenAI's token counting rules.
 * Each message has ~4 overhead tokens, plus content/name/tool_call tokens.
 */
export function countMessageTokens(
  messages: Array<{ role: string; content?: string | null; tool_calls?: any[]; name?: string }>,
): number {
  let total = 0;
  for (const msg of messages) {
    total += 4; // <|im_start|>{role}\n … <|im_end|>\n
    if (msg.content) total += encodeTokens(msg.content).length;
    if (msg.name) {
      total += encodeTokens(msg.name).length;
      total -= 1; // role is omitted when name is present
    }
    if (msg.tool_calls) {
      for (const tc of msg.tool_calls) {
        if (tc.function) {
          total += encodeTokens(tc.function.name ?? '').length;
          total += encodeTokens(tc.function.arguments ?? '').length;
        }
        total += 4;
      }
    }
  }
  total += 2; // priming tokens
  return total;
}

// ─── Context Window Management ──────────────────────────────

/**
 * Compute a safe completion token budget given prompt size and model tier.
 * Ensures we never exceed the context window and caps at the model's max output.
 */
export function computeMaxOutputTokens(tier: ModelTier, promptTokens: number): number {
  const limits = MODEL_LIMITS[tier];
  const headroom = limits.contextWindow - promptTokens;
  // Leave a small buffer (256 tokens) to avoid edge-case overflows
  const available = Math.max(headroom - 256, 256);
  return Math.min(available, limits.maxOutput);
}

/**
 * Truncate a text to fit within a token budget, keeping the beginning and end
 * (most useful context) and replacing the middle with a truncation marker.
 */
export function truncateToTokenBudget(text: string, maxTokens: number): string {
  const tokens = encodeTokens(text);
  if (tokens.length <= maxTokens) return text;

  // Keep first 60% and last 40% of budget for best context retention
  const headBudget = Math.floor(maxTokens * 0.6);
  const tailBudget = maxTokens - headBudget - 5; // 5 tokens for marker

  // Split by lines for cleaner truncation
  const lines = text.split('\n');
  const headLines: string[] = [];
  const tailLines: string[] = [];
  let headCount = 0;
  let tailCount = 0;

  for (const line of lines) {
    const lineTokens = encodeTokens(line).length + 1; // +1 for newline
    if (headCount + lineTokens <= headBudget) {
      headLines.push(line);
      headCount += lineTokens;
    } else {
      break;
    }
  }

  for (let i = lines.length - 1; i >= 0; i--) {
    const lineTokens = encodeTokens(lines[i]).length + 1;
    if (tailCount + lineTokens <= tailBudget) {
      tailLines.unshift(lines[i]);
      tailCount += lineTokens;
    } else {
      break;
    }
  }

  const omitted = lines.length - headLines.length - tailLines.length;
  return [
    ...headLines,
    `\n... [${omitted} lines truncated, ${tokens.length - maxTokens} tokens over budget] ...\n`,
    ...tailLines,
  ].join('\n');
}

// ─── Usage Tracking ─────────────────────────────────────────

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export function emptyUsage(): TokenUsage {
  return { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
}

export function addUsage(a: TokenUsage, b: TokenUsage | undefined): TokenUsage {
  if (!b) return a;
  return {
    promptTokens: a.promptTokens + b.promptTokens,
    completionTokens: a.completionTokens + b.completionTokens,
    totalTokens: a.totalTokens + b.totalTokens,
  };
}

/** Convert an OpenAI usage object to our TokenUsage type */
export function fromApiUsage(usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }): TokenUsage {
  if (!usage) return emptyUsage();
  return {
    promptTokens: usage.prompt_tokens ?? 0,
    completionTokens: usage.completion_tokens ?? 0,
    totalTokens: usage.total_tokens ?? 0,
  };
}
