/**
 * Azure Repos MCP Tool Provider (Scaffold)
 *
 * This is a placeholder for future Azure DevOps / Azure Repos integration.
 * It follows the same ScmToolProvider interface as the GitHub provider,
 * making it a drop-in replacement when Azure Repos support is needed.
 *
 * To implement:
 * 1. Inject an AzureReposService (similar to GitHubService)
 * 2. Implement the same tools: read_file, list_directory, search_code, etc.
 * 3. Register this provider in McpModule.
 */

import { ScmToolProvider, ScmContext, ToolDefinition } from '../mcp.types';

export class AzureReposToolProvider implements ScmToolProvider {
  readonly providerName = 'azure_repos';

  getTools(_ctx: ScmContext): ToolDefinition[] {
    // TODO: implement when Azure Repos support is added
    return [];
  }
}
