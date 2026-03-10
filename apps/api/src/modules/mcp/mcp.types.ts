/**
 * MCP (Model Context Protocol) type definitions.
 *
 * Defines a standard interface for tools that LLMs can invoke.
 * Providers (GitHub, Azure Repos, etc.) implement these interfaces
 * so the LLM layer stays provider-agnostic.
 */

// ─── Tool Definition ────────────────────────────────────────

/** JSON-Schema-style parameter descriptor for a tool */
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  required?: boolean;
  items?: { type: string }; // for array types
}

/** A tool that can be registered and invoked by agents */
export interface ToolDefinition {
  /** Unique name: e.g. "read_file", "list_directory" */
  name: string;
  /** Short description shown to the LLM */
  description: string;
  /** Parameter schema */
  parameters: ToolParameter[];
  /** The function that executes the tool. Returns a string result. */
  execute: (args: Record<string, any>) => Promise<string>;
}

/** Format used when sending tool definitions to the OpenAI API */
export interface OpenAIToolSpec {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}

// ─── Provider Interface ─────────────────────────────────────

/** Every SCM provider (GitHub, Azure Repos, …) must implement this */
export interface ScmToolProvider {
  /** Human-readable name: "github", "azure_repos" */
  readonly providerName: string;

  /** Return the tools this provider exposes */
  getTools(context: ScmContext): ToolDefinition[];
}

/** Runtime context passed to tools so they know which repo/branch to operate on */
export interface ScmContext {
  repoFullName: string;
  branch: string;
}
