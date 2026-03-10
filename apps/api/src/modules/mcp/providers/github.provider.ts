import { Logger } from '@nestjs/common';
import { GitHubService } from '../../pipeline/github.service';
import {
  ScmToolProvider,
  ScmContext,
  ToolDefinition,
} from '../mcp.types';

/**
 * GitHub MCP Tool Provider
 *
 * Exposes GitHub-specific SCM operations as MCP tools that agents can invoke.
 * All tools are scoped to a repo + branch passed via ScmContext.
 */
export class GitHubToolProvider implements ScmToolProvider {
  readonly providerName = 'github';
  private readonly logger = new Logger(GitHubToolProvider.name);

  constructor(private readonly github: GitHubService) {}

  getTools(ctx: ScmContext): ToolDefinition[] {
    return [
      // ── read_file ──────────────────────────────────
      {
        name: 'read_file',
        description:
          'Read the full contents of a file from the repository. Returns the file content as a string.',
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
            const file = await this.github.getFileContent(
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
          'List files and directories at a given path in the repository. Returns a newline-separated list of paths.',
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
          const tree = await this.github.getTree(ctx.repoFullName, ctx.branch);
          const prefix = dirPath ? `${dirPath}/` : '';
          const entries = tree
            .filter((f: { path: string; type: string }) => {
              if (!prefix) return !f.path.includes('/'); // root-level entries
              return f.path.startsWith(prefix) &&
                !f.path.slice(prefix.length).includes('/'); // direct children only
            })
            .map((f: { path: string; type: string }) => (f.type === 'dir' ? `${f.path}/` : f.path));
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
          const tree = await this.github.getTree(ctx.repoFullName, ctx.branch);
          const matches = tree
            .filter((f: { path: string; type: string }) => f.type === 'file' && f.path.toLowerCase().includes(pattern))
            .map((f: { path: string }) => f.path);
          return matches.length > 0
            ? matches.join('\n')
            : `No files matching "${pattern}"`;
        },
      },

      // ── read_multiple_files ────────────────────────
      {
        name: 'read_multiple_files',
        description:
          'Read the contents of multiple files at once. Returns each file\'s content separated by headers.',
        parameters: [
          {
            name: 'paths',
            type: 'array',
            description: 'Array of file paths to read, e.g. ["src/index.ts", "package.json"]',
            required: true,
            items: { type: 'string' },
          },
        ],
        execute: async (args: Record<string, any>) => {
          const paths = args.paths as string[];
          const results: string[] = [];
          const files = await this.github.getFilesContent(
            ctx.repoFullName,
            paths,
            ctx.branch,
          );
          for (const file of files) {
            results.push(`── ${file.path} ──\n${file.content}`);
          }
          return results.join('\n\n');
        },
      },
    ];
  }
}
