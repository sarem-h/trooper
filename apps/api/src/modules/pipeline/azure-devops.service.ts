import { Injectable, Logger } from '@nestjs/common';
import { GitProvider } from '@trooper/shared';
import { ConnectionsService } from '../connections/connections.service';

export interface AzureDevOpsRepoFile {
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
}

export interface AzureDevOpsFileContent {
  path: string;
  content: string;
  sha: string;
  encoding: string;
}

export interface AzureDevOpsCreatedPR {
  number: number;
  url: string;
  title: string;
}

interface AzureConnection {
  secretToken: string;
  providerUrl: string;
  providerAccountName: string;
}

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.mts': 'TypeScript',
  '.cts': 'TypeScript',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.mjs': 'JavaScript',
  '.cjs': 'JavaScript',
  '.py': 'Python',
  '.java': 'Java',
  '.go': 'Go',
  '.rs': 'Rust',
  '.cs': 'C#',
  '.cpp': 'C++',
  '.cc': 'C++',
  '.cxx': 'C++',
  '.c': 'C',
  '.h': 'C',
  '.hpp': 'C++',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.swift': 'Swift',
  '.kt': 'Kotlin',
  '.kts': 'Kotlin',
  '.dart': 'Dart',
  '.sh': 'Shell',
  '.bash': 'Shell',
  '.zsh': 'Shell',
  '.html': 'HTML',
  '.htm': 'HTML',
  '.css': 'CSS',
  '.scss': 'CSS',
  '.sass': 'CSS',
  '.less': 'CSS',
  '.vue': 'Vue',
  '.svelte': 'Svelte',
  '.scala': 'Scala',
  '.sql': 'SQL',
  '.md': 'Markdown',
  '.yml': 'YAML',
  '.yaml': 'YAML',
  '.json': 'JSON',
  '.xml': 'XML',
};

const LANGUAGE_BY_FILENAME: Record<string, string> = {
  'dockerfile': 'Dockerfile',
  'makefile': 'Makefile',
};

@Injectable()
export class AzureDevOpsService {
  private readonly logger = new Logger(AzureDevOpsService.name);
  private readonly languageCache = new Map<string, Record<string, number>>();

  constructor(private readonly connections: ConnectionsService) {}

  /** Resolve an Azure DevOps connection for a given repo (or default). */
  async resolveConnection(repoFullName?: string): Promise<AzureConnection> {
    const connection = await this.connections.resolveConnection(
      GitProvider.AzureRepos,
      repoFullName,
    );

    if (!connection?.secretToken) {
      throw new Error(
        repoFullName
          ? `No Azure DevOps PAT is available for ${repoFullName}. Add an Azure DevOps connection in Settings and mark it default or link the repository to one.`
          : 'No default Azure DevOps PAT is configured. Add an Azure DevOps connection in Settings first.',
      );
    }

    return {
      secretToken: connection.secretToken,
      providerUrl: connection.providerUrl,
      providerAccountName: connection.providerAccountName,
    };
  }

  /**
   * Make an authenticated request to Azure DevOps REST API.
   * All Azure DevOps REST APIs use Basic auth with empty username and PAT as password.
   */
  private async request<T>(
    baseUrl: string,
    path: string,
    token: string,
    options: { method?: string; body?: unknown; apiVersion?: string } = {},
  ): Promise<T> {
    const { method = 'GET', body, apiVersion = '7.1' } = options;
    const separator = path.includes('?') ? '&' : '?';
    const url = `${baseUrl}${path}${separator}api-version=${apiVersion}`;
    const encoded = Buffer.from(`:${token}`).toString('base64');

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      const err: any = new Error(`Azure DevOps API ${res.status}: ${text}`);
      err.status = res.status;
      throw err;
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return res.json() as Promise<T>;
    }
    return res.text() as unknown as T;
  }

  /**
   * Parse "project/repo" → { orgUrl, project, repo }
   * The org URL comes from the connection, not from the fullName.
   */
  private parseFullName(fullName: string, baseUrl: string) {
    const parts = fullName.split('/');
    if (parts.length >= 2) {
      return { orgUrl: `${baseUrl}`, project: parts[0], repo: parts[1] };
    }
    return { orgUrl: `${baseUrl}`, project: parts[0], repo: parts[0] };
  }

  private detectLanguage(filePath: string): string | undefined {
    const normalized = filePath.split('/').pop()?.toLowerCase() ?? filePath.toLowerCase();
    const exact = LANGUAGE_BY_FILENAME[normalized];
    if (exact) return exact;

    const dot = normalized.lastIndexOf('.');
    if (dot === -1) return undefined;

    return LANGUAGE_BY_EXTENSION[normalized.slice(dot)];
  }

  // ─── Connection Validation ─────────────────────────────

  /**
   * Validate a PAT against Azure DevOps by calling the connection data endpoint.
   * Returns the authenticated user's display name and email.
   */
  async validateToken(token: string, orgUrl: string): Promise<{
    displayName: string;
    emailAddress: string;
    publicAlias: string;
  }> {
    const res = await fetch('https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=7.1-preview.1', {
      headers: {
        Authorization: `Basic ${Buffer.from(`:${token}`).toString('base64')}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw Object.assign(new Error('Azure DevOps rejected this token. Check that the PAT value is correct and still active.'), { status: 401 });
      }
      if (res.status === 403) {
        throw Object.assign(new Error('Azure DevOps accepted the token but denied access. Check the token permissions.'), { status: 403 });
      }
      const text = await res.text();
      throw new Error(`Azure DevOps profile API ${res.status}: ${text}`);
    }

    const profile = await res.json();
    return {
      displayName: profile.displayName,
      emailAddress: profile.emailAddress,
      publicAlias: profile.publicAlias,
    };
  }

  /**
   * List scopes/permissions from the PAT by checking accessible organizations.
   */
  async listOrganizations(token: string): Promise<string[]> {
    try {
      // Get member ID first
      const profileRes = await fetch(
        'https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=7.1-preview.1',
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`:${token}`).toString('base64')}`,
            Accept: 'application/json',
          },
        },
      );
      if (!profileRes.ok) return [];
      const profile = await profileRes.json();
      const memberId = profile.publicAlias ?? profile.id;

      // List orgs
      const orgsRes = await fetch(
        `https://app.vssps.visualstudio.com/_apis/accounts?memberId=${memberId}&api-version=7.1-preview.1`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`:${token}`).toString('base64')}`,
            Accept: 'application/json',
          },
        },
      );
      if (!orgsRes.ok) return [];
      const data = await orgsRes.json();
      return (data.value ?? []).map((o: any) => o.accountName);
    } catch {
      return [];
    }
  }

  // ─── Repository Operations ─────────────────────────────

  async listRepos(repoFullName?: string): Promise<Array<{ fullName: string; private: boolean; defaultBranch: string; project: string }>> {
    const conn = await this.resolveConnection(repoFullName);
    const orgUrl = conn.providerUrl;
    const org = conn.providerAccountName;

    // List projects first
    const projectsData = await this.request<{ value: any[] }>(orgUrl, '/_apis/projects', conn.secretToken);
    const repos: Array<{ fullName: string; private: boolean; defaultBranch: string; project: string }> = [];

    for (const project of projectsData.value) {
      try {
        const reposData = await this.request<{ value: any[] }>(
          orgUrl,
          `/${encodeURIComponent(project.name)}/_apis/git/repositories`,
          conn.secretToken,
        );
        for (const r of reposData.value) {
          repos.push({
            fullName: `${project.name}/${r.name}`,
            private: true, // Azure DevOps repos are private by default
            defaultBranch: (r.defaultBranch ?? '').replace('refs/heads/', ''),
            project: project.name,
          });
        }
      } catch (err: any) {
        this.logger.debug(`Skipping project ${project.name}: ${err.message}`);
      }
    }

    return repos;
  }

  async getRepo(repoFullName: string): Promise<{ fullName: string; private: boolean; defaultBranch: string; project: string; id: string }> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    const data = await this.request<any>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}`,
      conn.secretToken,
    );

    return {
      fullName: repoFullName,
      private: true,
      defaultBranch: (data.defaultBranch ?? '').replace('refs/heads/', ''),
      project,
      id: data.id,
    };
  }

  async getDefaultBranch(repoFullName: string): Promise<string> {
    const repo = await this.getRepo(repoFullName);
    if (repo.defaultBranch) {
      return repo.defaultBranch;
    }

    const branches = await this.listBranches(repoFullName);
    return branches[0] ?? '';
  }

  async listBranches(repoFullName: string): Promise<string[]> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    let data: { value: any[] };
    try {
      data = await this.request<{ value: any[] }>(
        conn.providerUrl,
        `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/refs?filter=heads/`,
        conn.secretToken,
      );
    } catch (error: any) {
      if (error?.status === 404 && `${error.message}`.includes('Cannot find any branches')) {
        return [];
      }
      throw error;
    }

    return data.value.map((ref: any) => ref.name.replace('refs/heads/', ''));
  }

  async getTree(repoFullName: string, branch: string): Promise<AzureDevOpsRepoFile[]> {
    if (!branch) {
      return [];
    }

    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    let data: { value: any[] };
    try {
      data = await this.request<{ value: any[] }>(
        conn.providerUrl,
        `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/items?scopePath=/&recursionLevel=Full&includeContentMetadata=true&versionDescriptor.version=${encodeURIComponent(branch)}&versionDescriptor.versionType=branch`,
        conn.secretToken,
        { apiVersion: '7.1-preview.1' },
      );
    } catch (error: any) {
      if (error?.status === 404 && `${error.message}`.includes('Cannot find any branches')) {
        return [];
      }
      throw error;
    }

    return (data.value ?? []).map((item: any) => ({
      path: item.path.startsWith('/') ? item.path.slice(1) : item.path,
      type: item.isFolder ? 'dir' as const : 'file' as const,
      size: item.contentMetadata?.encodedLength ?? 0,
      sha: item.objectId ?? '',
    }));
  }

  async getFileContent(repoFullName: string, filePath: string, ref: string): Promise<AzureDevOpsFileContent> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    const url = `${conn.providerUrl}/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/items?path=${encodeURIComponent(filePath)}&versionDescriptor.version=${encodeURIComponent(ref)}&versionDescriptor.versionType=branch&includeContent=true&api-version=7.1-preview.1`;
    const encoded = Buffer.from(`:${conn.secretToken}`).toString('base64');

    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${encoded}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to get file content: ${res.status}: ${text}`);
    }

    const data = await res.json();
    return {
      path: filePath,
      content: data.content ?? '',
      sha: data.objectId ?? '',
      encoding: 'utf-8',
    };
  }

  async getFilesContent(repoFullName: string, paths: string[], ref: string): Promise<AzureDevOpsFileContent[]> {
    return Promise.all(paths.map((p) => this.getFileContent(repoFullName, p, ref)));
  }

  async listLanguages(repoFullName: string): Promise<Record<string, number>> {
    const cached = this.languageCache.get(repoFullName);
    if (cached) {
      return cached;
    }

    const defaultBranch = await this.getDefaultBranch(repoFullName);
    if (!defaultBranch) {
      this.languageCache.set(repoFullName, {});
      return {};
    }

    const tree = await this.getTree(repoFullName, defaultBranch);
    const totals: Record<string, number> = {};

    for (const entry of tree) {
      if (entry.type !== 'file') continue;

      const language = this.detectLanguage(entry.path);
      if (!language) continue;

      const size = Math.max(entry.size ?? 0, 1);
      totals[language] = (totals[language] ?? 0) + size;
    }

    const sorted = Object.fromEntries(
      Object.entries(totals).sort((left, right) => right[1] - left[1]),
    );

    this.languageCache.set(repoFullName, sorted);
    return sorted;
  }

  async countOpenWorkItems(repoFullName: string): Promise<number> {
    const conn = await this.resolveConnection(repoFullName);
    const { project } = this.parseFullName(repoFullName, conn.providerUrl);

    const wiql = [
      `SELECT [System.Id] FROM workitems WHERE [System.TeamProject] = '${project}'`,
      `AND [System.State] <> 'Closed'`,
      `AND [System.State] <> 'Done'`,
      `AND [System.State] <> 'Removed'`,
      'ORDER BY [System.ChangedDate] DESC',
    ].join(' ');

    const queryResult = await this.request<{ workItems: any[] }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/wit/wiql`,
      conn.secretToken,
      { method: 'POST', body: { query: wiql } },
    );

    return queryResult.workItems?.length ?? 0;
  }

  async countOpenPullRequests(repoFullName: string): Promise<number> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    const data = await this.request<{ value: any[]; count: number }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests?searchCriteria.status=active&$top=1&$skip=0`,
      conn.secretToken,
    );

    return data.count ?? data.value?.length ?? 0;
  }

  // ─── Git Operations ────────────────────────────────────

  async createBranch(repoFullName: string, branchName: string, baseBranch: string): Promise<void> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    // Get the base branch ref to find the source SHA
    const refsData = await this.request<{ value: any[] }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/refs?filter=heads/${encodeURIComponent(baseBranch)}`,
      conn.secretToken,
    );

    const baseRef = refsData.value?.[0];
    if (!baseRef) throw new Error(`Base branch '${baseBranch}' not found`);

    // Check if branch already exists
    const existingRefs = await this.request<{ value: any[] }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/refs?filter=heads/${encodeURIComponent(branchName)}`,
      conn.secretToken,
    );

    if (existingRefs.value?.length > 0) {
      this.logger.log(`Branch ${branchName} already exists, skipping creation.`);
      return;
    }

    await this.request(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/refs`,
      conn.secretToken,
      {
        method: 'POST',
        body: [
          {
            name: `refs/heads/${branchName}`,
            oldObjectId: '0000000000000000000000000000000000000000',
            newObjectId: baseRef.objectId,
          },
        ],
      },
    );

    this.logger.log(`Created branch ${branchName} from ${baseBranch}`);
  }

  async commitFiles(
    repoFullName: string,
    branchName: string,
    message: string,
    files: Array<{ path: string; content: string }>,
  ): Promise<string> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    // Get the current branch tip
    const refsData = await this.request<{ value: any[] }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/refs?filter=heads/${encodeURIComponent(branchName)}`,
      conn.secretToken,
    );

    const branchRef = refsData.value?.[0];
    if (!branchRef) throw new Error(`Branch '${branchName}' not found`);

    const changes = files.map((f) => ({
      changeType: 'edit', // or 'add' for new files
      item: { path: f.path.startsWith('/') ? f.path : `/${f.path}` },
      newContent: {
        content: Buffer.from(f.content).toString('base64'),
        contentType: 'base64encoded',
      },
    }));

    // Try edit first — if file doesn't exist, retry with 'add'
    const pushBody = {
      refUpdates: [
        { name: `refs/heads/${branchName}`, oldObjectId: branchRef.objectId },
      ],
      commits: [
        {
          comment: message,
          changes: changes,
        },
      ],
    };

    try {
      const result = await this.request<any>(
        conn.providerUrl,
        `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pushes`,
        conn.secretToken,
        { method: 'POST', body: pushBody },
      );

      const commitId = result.commits?.[0]?.commitId ?? '';
      this.logger.log(`Committed ${files.length} file(s) to ${branchName}`);
      return commitId;
    } catch (err: any) {
      // If edit fails because file doesn't exist, retry as 'add'
      if (err.status === 409 || String(err.message).includes('does not exist')) {
        for (const change of changes) {
          change.changeType = 'add';
        }

        // Re-read ref since push may have partially succeeded
        const refsData2 = await this.request<{ value: any[] }>(
          conn.providerUrl,
          `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/refs?filter=heads/${encodeURIComponent(branchName)}`,
          conn.secretToken,
        );
        pushBody.refUpdates[0].oldObjectId = refsData2.value[0].objectId;

        const result = await this.request<any>(
          conn.providerUrl,
          `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pushes`,
          conn.secretToken,
          { method: 'POST', body: pushBody },
        );

        const commitId = result.commits?.[0]?.commitId ?? '';
        this.logger.log(`Committed ${files.length} file(s) to ${branchName} (as new files)`);
        return commitId;
      }
      throw err;
    }
  }

  async createPullRequest(
    repoFullName: string,
    sourceBranch: string,
    targetBranch: string,
    title: string,
    body: string,
  ): Promise<AzureDevOpsCreatedPR> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    const prBody = {
      sourceRefName: `refs/heads/${sourceBranch}`,
      targetRefName: `refs/heads/${targetBranch}`,
      title,
      description: body,
    };

    const data = await this.request<any>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests`,
      conn.secretToken,
      { method: 'POST', body: prBody },
    );

    const prUrl = `${conn.providerUrl}/${encodeURIComponent(project)}/_git/${encodeURIComponent(repo)}/pullrequest/${data.pullRequestId}`;
    this.logger.log(`Opened PR #${data.pullRequestId}: ${prUrl}`);

    return {
      number: data.pullRequestId,
      url: prUrl,
      title: data.title,
    };
  }

  // ─── Issues (Work Items) ──────────────────────────────

  async listWorkItems(repoFullName: string, state?: string, top = 25, skip = 0, search?: string): Promise<{ items: any[]; totalCount: number }> {
    const conn = await this.resolveConnection(repoFullName);
    const { project } = this.parseFullName(repoFullName, conn.providerUrl);

    let wiql = `SELECT [System.Id], [System.Title], [System.State], [System.CreatedDate], [System.ChangedDate], [System.AssignedTo], [System.Description], [System.WorkItemType], [System.Tags] FROM workitems WHERE [System.TeamProject] = '${project}'`;

    if (state && state !== 'all') {
      wiql += ` AND [System.State] = '${state}'`;
    }
    if (search) {
      wiql += ` AND [System.Title] CONTAINS '${search}'`;
    }
    wiql += ' ORDER BY [System.ChangedDate] DESC';

    const queryResult = await this.request<{ workItems: any[] }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/wit/wiql`,
      conn.secretToken,
      { method: 'POST', body: { query: wiql } },
    );

    const totalCount = queryResult.workItems?.length ?? 0;
    const ids = (queryResult.workItems ?? []).slice(skip, skip + top).map((wi) => wi.id);
    if (ids.length === 0) return { items: [], totalCount };

    const batchData = await this.request<{ value: any[] }>(
      conn.providerUrl,
      `/_apis/wit/workitems?ids=${ids.join(',')}&$expand=none`,
      conn.secretToken,
    );

    const items = (batchData.value ?? []).map((wi) => ({
      number: wi.id,
      title: wi.fields?.['System.Title'] ?? '',
      body: wi.fields?.['System.Description'] ?? '',
      state: (wi.fields?.['System.State'] ?? 'New').toLowerCase(),
      labels: (wi.fields?.['System.Tags'] ?? '')
        .split(';')
        .map((t: string) => t.trim())
        .filter(Boolean)
        .map((t: string) => ({ name: t, color: '0078d4' })),
      user: wi.fields?.['System.AssignedTo']
        ? { login: wi.fields['System.AssignedTo'].uniqueName ?? wi.fields['System.AssignedTo'].displayName, avatarUrl: wi.fields['System.AssignedTo'].imageUrl ?? '' }
        : null,
      createdAt: wi.fields?.['System.CreatedDate'] ?? '',
      updatedAt: wi.fields?.['System.ChangedDate'] ?? '',
      commentsCount: 0,
      url: wi._links?.html?.href ?? `${conn.providerUrl}/${encodeURIComponent(project)}/_workitems/edit/${wi.id}`,
    }));

    return { items, totalCount };
  }

  async getWorkItem(repoFullName: string, workItemId: number): Promise<any> {
    const conn = await this.resolveConnection(repoFullName);
    const { project } = this.parseFullName(repoFullName, conn.providerUrl);

    const data = await this.request<any>(
      conn.providerUrl,
      `/_apis/wit/workitems/${workItemId}?$expand=all`,
      conn.secretToken,
    );

    // Get comments
    let comments: any[] = [];
    try {
      const commentsData = await this.request<{ comments: any[] }>(
        conn.providerUrl,
        `/_apis/wit/workitems/${workItemId}/comments`,
        conn.secretToken,
      );
      comments = (commentsData.comments ?? []).map((c) => ({
        id: c.id,
        body: c.text ?? '',
        user: c.createdBy ? { login: c.createdBy.uniqueName ?? c.createdBy.displayName, avatarUrl: c.createdBy.imageUrl ?? '' } : null,
        createdAt: c.createdDate ?? '',
      }));
    } catch {
      // Comments API may not be available
    }

    return {
      number: data.id,
      title: data.fields?.['System.Title'] ?? '',
      body: data.fields?.['System.Description'] ?? '',
      state: (data.fields?.['System.State'] ?? 'New').toLowerCase(),
      labels: (data.fields?.['System.Tags'] ?? '')
        .split(';')
        .map((t: string) => t.trim())
        .filter(Boolean)
        .map((t: string) => ({ name: t, color: '0078d4' })),
      user: data.fields?.['System.AssignedTo']
        ? { login: data.fields['System.AssignedTo'].uniqueName ?? data.fields['System.AssignedTo'].displayName, avatarUrl: data.fields['System.AssignedTo'].imageUrl ?? '' }
        : null,
      createdAt: data.fields?.['System.CreatedDate'] ?? '',
      updatedAt: data.fields?.['System.ChangedDate'] ?? '',
      commentsCount: comments.length,
      url: data._links?.html?.href ?? '',
      comments,
    };
  }

  // ─── Pull Requests ────────────────────────────────────

  async listPullRequests(
    repoFullName: string,
    state: 'open' | 'closed' | 'all' | 'draft' | 'merged' = 'open',
    top = 25,
    skip = 0,
  ): Promise<{ items: any[]; totalCount: number }> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    let statusFilter = 'active';
    if (state === 'closed' || state === 'merged') statusFilter = 'completed';
    else if (state === 'all') statusFilter = 'all';

    const data = await this.request<{ value: any[]; count: number }>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests?searchCriteria.status=${statusFilter}&$top=${top}&$skip=${skip}`,
      conn.secretToken,
    );

    let items = (data.value ?? []).map((pr) => this.mapPullRequest(pr, conn.providerUrl, project, repo));

    if (state === 'draft') {
      items = items.filter((pr) => pr.isDraft);
    } else if (state === 'merged') {
      items = items.filter((pr) => pr.merged);
    }

    return {
      items,
      totalCount: data.count ?? items.length,
    };
  }

  async getPullRequest(repoFullName: string, prNumber: number): Promise<any> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    const data = await this.request<any>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}`,
      conn.secretToken,
    );

    const pr: any = this.mapPullRequest(data, conn.providerUrl, project, repo);

    // Get iterations (changed files)
    try {
      const iterData = await this.request<{ value: any[] }>(
        conn.providerUrl,
        `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}/iterations`,
        conn.secretToken,
      );
      const lastIter = iterData.value?.[iterData.value.length - 1];
      if (lastIter) {
        const changesData = await this.request<{ changeEntries: any[] }>(
          conn.providerUrl,
          `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}/iterations/${lastIter.id}/changes`,
          conn.secretToken,
        );
        pr.changedFiles = (changesData.changeEntries ?? []).map((c) => c.item?.path?.replace(/^\//, '') ?? '');
        pr.diffFiles = (changesData.changeEntries ?? []).map((c) => ({
          filename: c.item?.path?.replace(/^\//, '') ?? '',
          status: c.changeType ?? 'edit',
          additions: 0,
          deletions: 0,
        }));
      }
    } catch {
      // not critical
    }

    // Get threads (comments / reviews)
    try {
      const threadsData = await this.request<{ value: any[] }>(
        conn.providerUrl,
        `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}/threads`,
        conn.secretToken,
      );
      pr.comments = (threadsData.value ?? [])
        .flatMap((thread) => thread.comments ?? [])
        .filter((c: any) => c.commentType === 'text')
        .map((c: any) => ({
          id: c.id,
          body: c.content ?? '',
          user: c.author ? { login: c.author.uniqueName ?? c.author.displayName, avatarUrl: c.author.imageUrl ?? '' } : null,
          createdAt: c.publishedDate ?? '',
        }));

      // Map reviewers as reviews
      pr.reviews = (data.reviewers ?? []).map((r: any) => ({
        id: 0,
        user: { login: r.uniqueName ?? r.displayName, avatarUrl: r.imageUrl ?? '' },
        state: r.vote > 0 ? 'APPROVED' : r.vote < 0 ? 'CHANGES_REQUESTED' : 'PENDING',
        body: '',
        submittedAt: '',
      }));
    } catch {
      // not critical
    }

    return pr;
  }

  async mergePullRequest(repoFullName: string, prNumber: number): Promise<void> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    // Get the last merge source commit
    const prData = await this.request<any>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}`,
      conn.secretToken,
    );

    await this.request(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}`,
      conn.secretToken,
      {
        method: 'PATCH',
        body: {
          status: 'completed',
          lastMergeSourceCommit: prData.lastMergeSourceCommit,
          completionOptions: { mergeStrategy: 'squash' },
        },
      },
    );

    this.logger.log(`Merged PR #${prNumber} on ${repoFullName}`);
  }

  async closePullRequest(repoFullName: string, prNumber: number): Promise<void> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    await this.request(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}`,
      conn.secretToken,
      { method: 'PATCH', body: { status: 'abandoned' } },
    );

    this.logger.log(`Closed PR #${prNumber} on ${repoFullName}`);
  }

  // ─── Comments ─────────────────────────────────────────

  async postWorkItemComment(repoFullName: string, workItemId: number, body: string): Promise<any> {
    const conn = await this.resolveConnection(repoFullName);

    const data = await this.request<any>(
      conn.providerUrl,
      `/_apis/wit/workitems/${workItemId}/comments`,
      conn.secretToken,
      { method: 'POST', body: { text: body } },
    );

    return {
      id: data.id,
      body: data.text ?? '',
      user: data.createdBy ? { login: data.createdBy.uniqueName ?? data.createdBy.displayName, avatarUrl: data.createdBy.imageUrl ?? '' } : null,
      createdAt: data.createdDate ?? '',
    };
  }

  async postPRComment(repoFullName: string, prNumber: number, body: string): Promise<any> {
    const conn = await this.resolveConnection(repoFullName);
    const { project, repo } = this.parseFullName(repoFullName, conn.providerUrl);

    const data = await this.request<any>(
      conn.providerUrl,
      `/${encodeURIComponent(project)}/_apis/git/repositories/${encodeURIComponent(repo)}/pullrequests/${prNumber}/threads`,
      conn.secretToken,
      {
        method: 'POST',
        body: {
          comments: [{ parentCommentId: 0, content: body, commentType: 'text' }],
          status: 'active',
        },
      },
    );

    const comment = data.comments?.[0];
    return {
      id: comment?.id ?? 0,
      body: comment?.content ?? body,
      user: comment?.author ? { login: comment.author.uniqueName ?? comment.author.displayName, avatarUrl: comment.author.imageUrl ?? '' } : null,
      createdAt: comment?.publishedDate ?? new Date().toISOString(),
    };
  }

  // ─── Helpers ──────────────────────────────────────────

  private mapPullRequest(pr: any, orgUrl: string, project: string, repo: string) {
    return {
      number: pr.pullRequestId,
      title: pr.title,
      body: pr.description ?? '',
      state: pr.status === 'completed' ? (pr.closedDate ? 'merged' : 'closed') : pr.status === 'abandoned' ? 'closed' : 'open',
      sourceBranch: (pr.sourceRefName ?? '').replace('refs/heads/', ''),
      targetBranch: (pr.targetRefName ?? '').replace('refs/heads/', ''),
      user: pr.createdBy ? { login: pr.createdBy.uniqueName ?? pr.createdBy.displayName, avatarUrl: pr.createdBy.imageUrl ?? '' } : null,
      url: `${orgUrl}/${encodeURIComponent(project)}/_git/${encodeURIComponent(repo)}/pullrequest/${pr.pullRequestId}`,
      createdAt: pr.creationDate ?? '',
      updatedAt: pr.closedDate ?? pr.creationDate ?? '',
      merged: pr.status === 'completed',
      isDraft: pr.isDraft ?? false,
      mergeable: pr.mergeStatus === 'succeeded' ? true : pr.mergeStatus === 'conflicts' ? false : null,
    };
  }
}
