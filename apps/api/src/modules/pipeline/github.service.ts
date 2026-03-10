import { Injectable, Logger } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { GitProvider } from '@trooper/shared';
import { ConnectionsService } from '../connections/connections.service';

export interface RepoFile {
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
}

export interface FileContent {
  path: string;
  content: string;
  sha: string;
  encoding: string;
}

export interface CreatedPR {
  number: number;
  url: string;
  title: string;
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private readonly clients = new Map<string, Octokit>();

  constructor(private readonly connections: ConnectionsService) {}

  private split(fullName: string): { owner: string; repo: string } {
    const [owner, repo] = fullName.split('/');
    return { owner, repo };
  }

  async getOctokit(repoFullName?: string): Promise<Octokit> {
    const connection = await this.connections.resolveConnection(
      GitProvider.GitHub,
      repoFullName,
    );

    if (!connection?.secretToken) {
      throw new Error(
        repoFullName
          ? `No GitHub PAT is available for ${repoFullName}. Add a GitHub connection in Settings and mark it default or link the repository to one.`
          : 'No default GitHub PAT is configured. Add a GitHub connection in Settings first.',
      );
    }

    const cacheKey = `${connection.id}:${connection.secretLastFour ?? 'token'}`;
    const existing = this.clients.get(cacheKey);
    if (existing) {
      return existing;
    }

    const client = new Octokit({ auth: connection.secretToken });
    this.clients.set(cacheKey, client);
    return client;
  }

  /** List repositories the authenticated user has access to */
  async listRepos(): Promise<Array<{ fullName: string; private: boolean; defaultBranch: string }>> {
    const octokit = await this.getOctokit();
    const repos: Array<{ fullName: string; private: boolean; defaultBranch: string }> = [];
    for await (const response of octokit.paginate.iterator(
      octokit.repos.listForAuthenticatedUser,
      { per_page: 100, sort: 'updated' },
    )) {
      for (const repo of response.data) {
        repos.push({
          fullName: repo.full_name,
          private: repo.private,
          defaultBranch: repo.default_branch,
        });
      }
    }
    return repos;
  }

  /** Get the default branch for a repo */
  async getDefaultBranch(repoFullName: string): Promise<string> {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.repos.get({ owner, repo });
    return data.default_branch;
  }

  /** List files in the repo tree (recursive, up to ~100k entries) */
  async getTree(repoFullName: string, branch: string): Promise<RepoFile[]> {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true',
    });
    return data.tree
      .filter((t) => t.type === 'blob' || t.type === 'tree')
      .map((t) => ({
        path: t.path!,
        type: t.type === 'blob' ? 'file' as const : 'dir' as const,
        size: t.size ?? 0,
        sha: t.sha!,
      }));
  }

  /** Read a single file's content (base64 decoded) */
  async getFileContent(
    repoFullName: string,
    filePath: string,
    ref: string,
  ): Promise<FileContent> {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref,
    });
    if (Array.isArray(data) || data.type !== 'file') {
      throw new Error(`${filePath} is not a file`);
    }
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { path: filePath, content, sha: data.sha, encoding: 'utf-8' };
  }

  /** Read multiple files in parallel */
  async getFilesContent(
    repoFullName: string,
    paths: string[],
    ref: string,
  ): Promise<FileContent[]> {
    return Promise.all(
      paths.map((p) => this.getFileContent(repoFullName, p, ref)),
    );
  }

  /** Create a new branch from a base ref */
  async createBranch(
    repoFullName: string,
    branchName: string,
    baseBranch: string,
  ): Promise<void> {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    
    // Check if branch already exists
    try {
      await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      });
      this.logger.log(`Branch ${branchName} already exists, skipping creation.`);
      return;
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }

    // Get the SHA of the base branch head
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: refData.object.sha,
    });
    this.logger.log(`Created branch ${branchName} from ${baseBranch}`);
  }

  /**
   * Commit a set of file changes to a branch.
   * Each change is { path, content } — creates or updates the file.
   */
  async commitFiles(
    repoFullName: string,
    branchName: string,
    message: string,
    files: Array<{ path: string; content: string }>,
  ): Promise<string> {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);

    // 1. Get latest commit SHA on the branch
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });
    const latestCommitSha = refData.object.sha;

    // 2. Get the tree SHA from that commit
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    // 3. Create blobs for each file
    const treeItems = await Promise.all(
      files.map(async (f) => {
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: f.content,
          encoding: 'utf-8',
        });
        return {
          path: f.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      }),
    );

    // 4. Create tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: treeItems,
    });

    // 5. Create commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // 6. Update branch ref
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: newCommit.sha,
    });

    this.logger.log(`Committed ${files.length} file(s) to ${branchName}`);
    return newCommit.sha;
  }

  /** Open a pull request */
  async createPullRequest(
    repoFullName: string,
    head: string,
    base: string,
    title: string,
    body: string,
  ): Promise<CreatedPR> {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    
    // Check if PR already exists
    const { data: existingPrs } = await octokit.pulls.list({
      owner,
      repo,
      head: `${owner}:${head}`,
      base,
      state: 'open',
    });

    if (existingPrs.length > 0) {
      const existing = existingPrs[0];
      this.logger.log(`PR already exists: #${existing.number}`);
      return { number: existing.number, url: existing.html_url, title: existing.title };
    }

    const { data } = await octokit.pulls.create({
      owner,
      repo,
      head,
      base,
      title,
      body,
    });
    this.logger.log(`Opened PR #${data.number}: ${data.html_url}`);
    return { number: data.number, url: data.html_url, title: data.title };
  }

  // ─── Issues ────────────────────────────────────────────────

  /** List open issues for a repository (excludes pull requests) */
  async listIssues(
    repoFullName: string,
    state: 'open' | 'closed' | 'all' = 'open',
    perPage = 30,
    page = 1,
  ) {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: perPage,
      page,
      sort: 'updated',
      direction: 'desc',
    });

    // GitHub API returns PRs in the issues list — filter them out
    return data
      .filter((issue) => !issue.pull_request)
      .map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body ?? '',
        state: issue.state,
        labels: issue.labels.map((l) =>
          typeof l === 'string' ? { name: l, color: '' } : { name: l.name ?? '', color: l.color ?? '' },
        ),
        user: issue.user ? { login: issue.user.login, avatarUrl: issue.user.avatar_url } : null,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        commentsCount: issue.comments,
        url: issue.html_url,
      }));
  }

  /** Get a single issue by number */
  async getIssue(repoFullName: string, issueNumber: number) {
    const octokit = await this.getOctokit(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data: issue } = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    // Also fetch comments
    const { data: comments } = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 50,
    });

    return {
      number: issue.number,
      title: issue.title,
      body: issue.body ?? '',
      state: issue.state,
      labels: issue.labels.map((l) =>
        typeof l === 'string' ? { name: l, color: '' } : { name: l.name ?? '', color: l.color ?? '' },
      ),
      user: issue.user ? { login: issue.user.login, avatarUrl: issue.user.avatar_url } : null,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      commentsCount: issue.comments,
      url: issue.html_url,
      comments: comments.map((c) => ({
        id: c.id,
        body: c.body ?? '',
        user: c.user ? { login: c.user.login, avatarUrl: c.user.avatar_url } : null,
        createdAt: c.created_at,
      })),
    };
  }
}
