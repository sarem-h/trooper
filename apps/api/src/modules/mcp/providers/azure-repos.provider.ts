/**
 * Azure Repos MCP Tool Provider
 *
 * Exposes Azure DevOps-specific SCM operations as MCP tools that agents can invoke.
 * All tools are scoped to a repo + branch passed via ScmContext.
 */

import { Logger } from '@nestjs/common';
import { AzureDevOpsService } from '../../pipeline/azure-devops.service';
import { ScmToolProvider, ScmContext, ToolDefinition } from '../mcp.types';

export class AzureReposToolProvider implements ScmToolProvider {
  readonly providerName = 'azure_repos';
  private readonly logger = new Logger(AzureReposToolProvider.name);

  constructor(private readonly azureDevOps: AzureDevOpsService) {}

  getTools(ctx: ScmContext): ToolDefinition[] {
    return [
      // ── read_file ──────────────────────────────────
      {
        name: 'read_file',
        description:
          'Read the full contents of a file from the Azure DevOps repository. Returns the file content as a string.',
        parameters: [
          {
            name: 'path',
            type: 'string',
            description: 'Relative file path in the repository, e.g. "src/index.ts"',
            required: true,
          },
        ],
        execute: async (args: Record<string, any>) => {
          const filePath = args.path as string;
          try {
            const file = await this.azureDevOps.getFileContent(
              ctx.repoFullName,
              filePath,
              ctx.branch,
            );
            return file.content;
          } catch (err: any) {
            return `Error reading "${filePath}": ${err.message}`;
          }
        },
      },

      // ── list_directory ─────────────────────────────
      {
        name: 'list_directory',
        description:
          'List files and directories at a given path in the Azure DevOps repository. Returns a newline-separated list of paths.',
        parameters: [
          {
            name: 'path',
            type: 'string',
            description:
              'Directory path to list. Use "" or "/" for root. e.g. "src/components"',
            required: true,
          },
        ],
        execute: async (args: Record<string, any>) => {
          const dirPath = (args.path as string).replace(/^\/+/, '');
          const tree = await this.azureDevOps.getTree(ctx.repoFullName, ctx.branch);
          const prefix = dirPath ? `${dirPath}/` : '';
          const entries = tree
            .filter((f) => {
              if (!prefix) return !f.path.includes('/');
              return f.path.startsWith(prefix) &&
                !f.path.slice(prefix.length).includes('/');
            })
            .map((f) => (f.type === 'dir' ? `${f.path}/` : f.path));
          return entries.length > 0
            ? entries.join('\n')
            : `No entries found at "${dirPath}"`;
        },
      },

      // ── search_code ────────────────────────────────
      {
        name: 'search_code',
        description:
          'Search for files whose path matches a pattern. Returns matching file paths, one per line.',
        parameters: [
          {
            name: 'pattern',
            type: 'string',
            description:
              'Substring or glob-like pattern to match against file paths, e.g. "controller", ".tsx", "test"',
            required: true,
          },
        ],
        execute: async (args: Record<string, any>) => {
          const pattern = (args.pattern as string).toLowerCase();
          const tree = await this.azureDevOps.getTree(ctx.repoFullName, ctx.branch);
          const matches = tree
            .filter((f) => f.type === 'file' && f.path.toLowerCase().includes(pattern))
            .map((f) => f.path);
          return matches.length > 0
            ? matches.join('\n')
            : `No files matching "${pattern}"`;
        },
      },
    ];
  }
}
