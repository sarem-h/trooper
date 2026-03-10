import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAI } from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
  ChatCompletion,
  ChatCompletionCreateParamsNonStreaming,
} from 'openai/resources/chat/completions';
import type { EmbeddingCreateParams } from 'openai/resources/embeddings';
import {
  countMessageTokens,
  computeMaxOutputTokens,
  truncateToTokenBudget,
  fromApiUsage,
  addUsage,
  emptyUsage,
  type TokenUsage,
  MODEL_LIMITS,
} from './tokenizer';

// ─── Types ──────────────────────────────────────────────────

/**
 * Chat model tiers:
 *   thinker — GPT-4.1: planning, reasoning, repo exploration (quality)
 *   worker  — GPT-4.1-mini: parallel code generation (throughput)
 *
 * Embedding is handled separately via embed() — not a chat tier.
 */
export type ModelTier = 'thinker' | 'worker';

export interface LlmChatOptions {
  /** Which model tier: "thinker" (planning/reasoning) or "worker" (code gen) */
  model: ModelTier;
  deployment?: string;
  messages: ChatCompletionMessageParam[];
  tools?: ChatCompletionTool[];
  /** Structured output JSON schema (for response_format) */
  responseSchema?: { name: string; schema: Record<string, any> };
  temperature?: number;
  maxTokens?: number;
}

export interface LlmChatResult {
  message: ChatCompletion.Choice['message'];
  usage?: ChatCompletion['usage'];
  finishReason: string;
}

/** Maximum tokens for a single tool result before truncation */
const TOOL_RESULT_TOKEN_LIMIT = 30_000;

/** Retry configuration for transient LLM API errors */
const LLM_MAX_RETRIES = 3;
const LLM_BASE_DELAY_MS = 500;

function usesMaxCompletionTokens(deployment: string): boolean {
  const normalized = deployment.toLowerCase();
  return normalized.includes('gpt-5') || normalized.startsWith('o1') || normalized.startsWith('o3') || normalized.startsWith('o4');
}

function usesDefaultTemperatureOnly(deployment: string): boolean {
  const normalized = deployment.toLowerCase();
  return normalized.includes('gpt-5') || normalized.startsWith('o1') || normalized.startsWith('o3') || normalized.startsWith('o4');
}

/** HTTP status codes that are safe to retry */
function isTransientError(err: unknown): boolean {
  if (err instanceof TypeError) return true; // network error
  const status = (err as { status?: number })?.status;
  return status === 429 || status === 503 || status === 502;
}

/** Exponential backoff with jitter: base * 2^attempt + random(0..base) */
function retryDelay(attempt: number): number {
  return LLM_BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * LLM_BASE_DELAY_MS;
}

// ─── Service ────────────────────────────────────────────────

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly client: AzureOpenAI;
  private readonly thinkerDeployment: string;
  private readonly workerDeployment: string;
  private readonly embedderDeployment: string;

  private normalizeEndpoint(rawEndpoint?: string): string {
    if (!rawEndpoint) return '';

    const trimmed = rawEndpoint.trim().replace(/\/+$/, '');

    try {
      const url = new URL(trimmed);
      if (url.hostname.endsWith('.cognitiveservices.azure.com')) {
        const resourceName = url.hostname.replace('.cognitiveservices.azure.com', '');
        const normalized = `https://${resourceName}.openai.azure.com`;

        this.logger.warn(
          `AZURE_OPENAI_ENDPOINT uses a cognitiveservices host; normalizing to ${normalized}`,
        );

        return normalized;
      }

      return `${url.protocol}//${url.host}`;
    } catch {
      this.logger.warn('AZURE_OPENAI_ENDPOINT is not a valid URL; using raw value');
      return trimmed;
    }
  }

  constructor(private readonly config: ConfigService) {
    const endpoint = this.normalizeEndpoint(
      this.config.get<string>('AZURE_OPENAI_ENDPOINT'),
    );
    const apiKey = this.config.get<string>('AZURE_OPENAI_API_KEY');
    const apiVersion =
      this.config.get<string>('AZURE_OPENAI_API_VERSION') ?? '2025-01-01-preview';

    if (!endpoint || !apiKey) {
      this.logger.warn(
        'AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY not set — LLM calls will fail',
      );
    }

    this.client = new AzureOpenAI({
      endpoint: endpoint ?? '',
      apiKey: apiKey ?? '',
      apiVersion,
    });

    // Model deployment names in Azure AI Foundry
    this.thinkerDeployment =
      this.config.get<string>('AZURE_OPENAI_THINKER_DEPLOYMENT') ?? 'gpt-4.1-214778';
    this.workerDeployment =
      this.config.get<string>('AZURE_OPENAI_WORKER_DEPLOYMENT') ?? 'gpt-4.1-mini-637029';
    this.embedderDeployment =
      this.config.get<string>('AZURE_OPENAI_EMBEDDER_DEPLOYMENT') ?? 'text-embedding-3-large-355662';

    this.logger.log(
      `LLM configured: thinker=${this.thinkerDeployment}, worker=${this.workerDeployment}, embedder=${this.embedderDeployment}`,
    );
  }

  /** Get the deployment name for a model tier */
  private getDeployment(tier: ModelTier): string {
    return tier === 'thinker' ? this.thinkerDeployment : this.workerDeployment;
  }

  /** Single chat completion call */
  async chat(options: LlmChatOptions): Promise<LlmChatResult> {
    const deployment = options.deployment ?? this.getDeployment(options.model);
    const requestedTemperature = options.temperature ?? (options.model === 'thinker' ? 0.2 : 0.1);

    // Pre-flight token count for a safe completion budget.
    const promptTokens = countMessageTokens(options.messages as any);
    const smartMaxTokens = options.maxTokens
      ?? computeMaxOutputTokens(options.model, promptTokens);

    const limits = MODEL_LIMITS[options.model];
    if (promptTokens > limits.contextWindow * 0.95) {
      this.logger.warn(
        `Prompt is ${promptTokens} tokens — ${((promptTokens / limits.contextWindow) * 100).toFixed(1)}% of ${options.model} context window`,
      );
    }

    const params: ChatCompletionCreateParamsNonStreaming = {
      model: deployment,
      messages: options.messages,
    };

    if (usesDefaultTemperatureOnly(deployment)) {
      if (requestedTemperature !== 1) {
        this.logger.debug(
          `LLM deployment ${deployment} only supports the default temperature; omitting requested temperature ${requestedTemperature}.`,
        );
      }
    } else {
      params.temperature = requestedTemperature;
    }

    if (usesMaxCompletionTokens(deployment)) {
      (params as ChatCompletionCreateParamsNonStreaming & { max_completion_tokens: number }).max_completion_tokens = smartMaxTokens;
    } else {
      (params as ChatCompletionCreateParamsNonStreaming & { max_tokens: number }).max_tokens = smartMaxTokens;
    }

    if (options.tools && options.tools.length > 0) {
      params.tools = options.tools;
      params.tool_choice = 'auto';
    }

    if (options.responseSchema) {
      (params as any).response_format = {
        type: 'json_schema',
        json_schema: {
          name: options.responseSchema.name,
          strict: true,
          schema: options.responseSchema.schema,
        },
      };
    }

    this.logger.debug(
      `LLM call: deployment=${deployment}, msgs=${options.messages.length}, promptTokens≈${promptTokens}, maxOutput=${smartMaxTokens}`,
    );

    for (let attempt = 0; attempt <= LLM_MAX_RETRIES; attempt++) {
      try {
        const completion = await this.client.chat.completions.create(params);

        const choice = completion.choices[0];
        return {
          message: choice.message,
          usage: completion.usage ?? undefined,
          finishReason: choice.finish_reason ?? 'stop',
        };
      } catch (err) {
        if (attempt < LLM_MAX_RETRIES && isTransientError(err)) {
          const delay = retryDelay(attempt);
          this.logger.warn(
            `LLM call failed (attempt ${attempt + 1}/${LLM_MAX_RETRIES + 1}), retrying in ${Math.round(delay)}ms: ${err}`,
          );
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }

    throw new Error('Unreachable');
  }

  /**
   * Run a tool-calling loop: send the conversation, if the LLM requests
   * tool calls, execute them via the provided handler, append the results,
   * and call the LLM again until it produces a final text response.
   *
   * Accumulates token usage across all iterations and returns the total.
   * Tool results exceeding TOOL_RESULT_TOKEN_LIMIT are auto-truncated.
   */
  async chatWithTools(
    options: LlmChatOptions,
    toolExecutor: (name: string, args: Record<string, any>) => Promise<string>,
    maxIterations = 10,
  ): Promise<LlmChatResult & { accumulatedUsage: TokenUsage }> {
    const messages = [...options.messages];
    let accumulated = emptyUsage();

    for (let i = 0; i < maxIterations; i++) {
      const result = await this.chat({ ...options, messages });
      accumulated = addUsage(accumulated, fromApiUsage(result.usage));

      if (result.finishReason !== 'tool_calls' || !result.message.tool_calls?.length) {
        return { ...result, accumulatedUsage: accumulated };
      }

      // Append the assistant message with tool_calls
      messages.push(result.message);

      // Execute each tool call in parallel
      const toolResults = await Promise.all(
        result.message.tool_calls
          .filter((tc): tc is Extract<typeof tc, { type: 'function' }> => tc.type === 'function')
          .map(async (tc) => {
            let args: Record<string, any> = {};
            try {
              args = JSON.parse(tc.function.arguments);
            } catch {
              // If args fail to parse, pass empty
            }
            let output = await toolExecutor(tc.function.name, args);

            // Truncate oversized tool results to prevent context overflow
            output = truncateToTokenBudget(output, TOOL_RESULT_TOKEN_LIMIT);

            return {
              role: 'tool' as const,
              tool_call_id: tc.id,
              content: output,
            };
          }),
      );

      messages.push(...toolResults);
    }

    this.logger.warn(`Tool loop exceeded ${maxIterations} iterations`);
    // Return the last response
    const finalResult = await this.chat({ ...options, messages });
    accumulated = addUsage(accumulated, fromApiUsage(finalResult.usage));
    return { ...finalResult, accumulatedUsage: accumulated };
  }

  /**
   * Fire N parallel LLM calls for multi-agent orchestration.
   * Each call is independent. Returns results in the same order.
   */
  async parallel(optionsList: LlmChatOptions[]): Promise<LlmChatResult[]> {
    this.logger.log(`LLM parallel: dispatching ${optionsList.length} calls`);
    return Promise.all(optionsList.map((opts) => this.chat(opts)));
  }

  /**
   * Generate a vector embedding for the given text using text-embedding-3-large.
   * Returns a float32 array. Use for semantic file search in the MCP layer.
   *
   * @param text  The text to embed (file path, snippet, or query)
   * @param dimensions  Optional truncation to a smaller dimension (default: full 3072)
   */
  async embed(text: string, dimensions?: number): Promise<number[]> {
    const params: EmbeddingCreateParams & { dimensions?: number } = {
      model: this.embedderDeployment,
      input: text,
      encoding_format: 'float',
      ...(dimensions ? { dimensions } : {}),
    };

    const response = await this.client.embeddings.create(params);
    return response.data[0].embedding;
  }

  /**
   * Embed multiple texts in a single API call (batch).
   * Returns embeddings in the same order as the input.
   */
  async embedBatch(texts: string[], dimensions?: number): Promise<number[][]> {
    if (texts.length === 0) return [];
    const params: EmbeddingCreateParams & { dimensions?: number } = {
      model: this.embedderDeployment,
      input: texts,
      encoding_format: 'float',
      ...(dimensions ? { dimensions } : {}),
    };

    const response = await this.client.embeddings.create(params);
    return response.data
      .sort((a, b) => a.index - b.index)
      .map((d) => d.embedding);
  }
}
