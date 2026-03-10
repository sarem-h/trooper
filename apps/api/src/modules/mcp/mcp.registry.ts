import { Injectable, Logger } from '@nestjs/common';
import {
  ToolDefinition,
  OpenAIToolSpec,
  ScmToolProvider,
  ScmContext,
} from './mcp.types';

/**
 * MCP Registry — the central tool registry for all SCM providers.
 *
 * Agents ask the registry for tools scoped to a specific repo/branch.
 * The registry delegates to the correct provider (GitHub, Azure Repos, etc.)
 * based on which providers have been registered.
 */
@Injectable()
export class McpRegistry {
  private readonly logger = new Logger(McpRegistry.name);
  private readonly providers: ScmToolProvider[] = [];

  /** Register a provider (called at module init) */
  registerProvider(provider: ScmToolProvider): void {
    this.logger.log(`MCP: registered provider "${provider.providerName}"`);
    this.providers.push(provider);
  }

  /** Get all available tools for a given repo context */
  getTools(context: ScmContext): ToolDefinition[] {
    return this.providers.flatMap((p) => p.getTools(context));
  }

  /** Convert tools to OpenAI function-calling spec */
  toOpenAITools(context: ScmContext): OpenAIToolSpec[] {
    return this.getTools(context).map((tool) => {
      const properties: Record<string, any> = {};
      const required: string[] = [];
      for (const param of tool.parameters) {
        properties[param.name] = {
          type: param.type,
          description: param.description,
          ...(param.items ? { items: param.items } : {}),
        };
        if (param.required !== false) {
          required.push(param.name);
        }
      }
      return {
        type: 'function' as const,
        function: {
          name: tool.name,
          description: tool.description,
          parameters: {
            type: 'object' as const,
            properties,
            required,
          },
        },
      };
    });
  }

  /** Execute a tool by name with the given arguments */
  async executeTool(
    context: ScmContext,
    toolName: string,
    args: Record<string, any>,
  ): Promise<string> {
    const tools = this.getTools(context);
    const tool = tools.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`MCP tool "${toolName}" not found`);
    }
    return tool.execute(args);
  }
}
