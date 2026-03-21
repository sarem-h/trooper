import { Injectable, Logger } from '@nestjs/common';
import { GitHubService } from '../github.service';
import type {
  ScmProvider,
  ScmCapabilities,
  ScmRepo,
  ScmRepoFile,
  ScmFileContent,
  ScmIssue,
  ScmIssueDetail,
  ScmIssueComment,
  ScmPullRequest,
  ScmSecurityAlert,
  ScmCreatedPR,
  ScmForkResult,
} from './scm.types';

/**
 * GitHub implementation of the universal ScmProvider interface.
 *
 * Wraps Octokit to expose a provider-agnostic API surface that the pipeline,
 * MCP tools, and UI controllers consume without knowing they're talking to GitHub.
 */
@Injectable()
export class GitHubScmProvider implements ScmProvider {
  readonly providerType = 'github';
  private readonly logger = new Logger(GitHubScmProvider.name);
  private readonly activityCache = new Map<string, { value: { openIssues: number; openPRs: number }; expiresAt: number }>();
  private static readonly ACTIVITY_CACHE_TTL_MS = 60_000;

  static readonly capabilities: ScmCapabilities = {
    issues: true,
    pullRequests: true,
    security: true,
    fork: true,
  };

  constructor(private readonly github: GitHubService) {}

  private split(fullName: string) {
    const [owner, repo] = fullName.split('/');
    return { owner, repo };
  }

  private async getDefaultClient() {
    return this.github.getOctokit();
  }

  private async getRepoClient(repoFullName: string) {
    return this.github.getOctokit(repoFullName);
  }

  private readCachedActivity(repoFullName: string) {
    const cached = this.activityCache.get(repoFullName);
    if (!cached) return null;

    if (cached.expiresAt <= Date.now()) {
      this.activityCache.delete(repoFullName);
      return null;
    }

    return cached.value;
  }

  private writeCachedActivity(repoFullName: string, value: { openIssues: number; openPRs: number }) {
    this.activityCache.set(repoFullName, {
      value,
      expiresAt: Date.now() + GitHubScmProvider.ACTIVITY_CACHE_TTL_MS,
    });
  }

  private getLastPageFromLinkHeader(linkHeader?: string) {
    if (!linkHeader) return null;

    const lastMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    if (lastMatch) {
      return parseInt(lastMatch[1], 10);
    }

    const nextMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="next"/);
    if (nextMatch) {
      return parseInt(nextMatch[1], 10);
    }

    return null;
  }

  // ── Repository ──────────────────────────────────────────

  async listRepos(): Promise<ScmRepo[]> {
    const octokit = await this.getDefaultClient();
    const repos: ScmRepo[] = [];
    for await (const response of octokit.paginate.iterator(
      octokit.repos.listForAuthenticatedUser,
      { per_page: 100, sort: 'updated' },
    )) {
      for (const r of response.data) {
        repos.push({
          fullName: r.full_name,
          private: r.private,
          defaultBranch: r.default_branch,
          pushAccess: r.permissions?.push ?? false,
          parentFullName: (r as any).parent?.full_name,
          description: r.description ?? undefined,
          language: r.language ?? undefined,
          stars: r.stargazers_count,
          openIssuesCount: r.open_issues_count,
          ownerAvatarUrl: r.owner.avatar_url,
          provider: 'github',
        });
      }
    }
    return repos;
  }

async searchRepos(query: string, page: number = 1): Promise<ScmRepo[]> {
  const octokit = await this.getDefaultClient();
    if (!query || query.trim().length === 0) return this.listRepos();

    // First, try to handle exact owner/repo format quickly
    if (query.includes('/') && query.split('/').length === 2 && !query.includes(' ')) {
      try {
        const [owner, repo] = query.split('/');
        const { data: r } = await octokit.repos.get({ owner, repo });
        return [{
          fullName: r.full_name,
          private: r.private,
          defaultBranch: r.default_branch,
          pushAccess: r.permissions?.push ?? false,
          parentFullName: (r as any).parent?.full_name,
          description: r.description ?? undefined,
          language: r.language ?? undefined,
          stars: r.stargazers_count,
          openIssuesCount: r.open_issues_count,
          ownerAvatarUrl: r.owner.avatar_url,
          provider: 'github',
        }];
      } catch (err: any) {
        // Fall back to general search if direct fetch fails
      }
    }

    const { data } = await octokit.search.repos({
      q: query,
      per_page: 10,
      page,
      sort: 'stars',
      order: 'desc',
    });
    
    return data.items.map((r: any) => ({
      fullName: r.full_name,
      private: r.private,
      defaultBranch: r.default_branch,
      pushAccess: r.permissions?.push ?? false,
      parentFullName: r.parent?.full_name,
      description: r.description ?? undefined,
      language: r.language ?? undefined,
      stars: r.stargazers_count,
      openIssuesCount: r.open_issues_count,
      ownerAvatarUrl: r.owner?.avatar_url,
      provider: 'github',
    }));
  }

  async getRepo(repoFullName: string): Promise<ScmRepo> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      fullName: data.full_name,
      private: data.private,
      defaultBranch: data.default_branch,
      pushAccess: data.permissions?.push ?? false,
      parentFullName: data.parent?.full_name,
      description: data.description ?? undefined,
      language: data.language ?? undefined,
      stars: data.stargazers_count,
      openIssuesCount: data.open_issues_count,
      ownerAvatarUrl: data.owner.avatar_url,
      provider: 'github',
    };
  }

  async getDefaultBranch(repoFullName: string): Promise<string> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.repos.get({ owner, repo });
    return data.default_branch;
  }

  async listBranches(repoFullName: string): Promise<string[]> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const branches: string[] = [];
    for await (const response of octokit.paginate.iterator(
      octokit.repos.listBranches,
      { owner, repo, per_page: 100 },
    )) {
      for (const b of response.data) {
        branches.push(b.name);
      }
    }
    return branches;
  }

  async getTree(repoFullName: string, branch: string): Promise<ScmRepoFile[]> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.git.getTree({
      owner, repo,
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

  async getFileContent(repoFullName: string, filePath: string, ref: string): Promise<ScmFileContent> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.repos.getContent({ owner, repo, path: filePath, ref });
    if (Array.isArray(data) || data.type !== 'file') {
      throw new Error(`${filePath} is not a file`);
    }
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { path: filePath, content, sha: data.sha, encoding: 'utf-8' };
  }

  async getFilesContent(repoFullName: string, paths: string[], ref: string): Promise<ScmFileContent[]> {
    return Promise.all(paths.map((p) => this.getFileContent(repoFullName, p, ref)));
  }

  // ── Issues ──────────────────────────────────────────────

  async listIssues(
    repoFullName: string,
    state: 'open' | 'closed' | 'all' = 'open',
    perPage = 25,
    page = 1,
    search?: string,
  ): Promise<{ items: ScmIssue[]; totalCount: number }> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const qualifiers = [`repo:${owner}/${repo}`, 'is:issue'];
    if (state !== 'all') qualifiers.push(`is:${state}`);
    if (search) qualifiers.push(search);

    const { data } = await octokit.search.issuesAndPullRequests({
      q: qualifiers.join(' '),
      per_page: perPage,
      page,
      sort: 'updated',
      order: 'desc',
    });

    return {
      items: data.items.map((issue) => ({
        number: issue.number,
        title: issue.title,
        body: issue.body ?? '',
        state: issue.state ?? 'open',
        labels: (issue.labels ?? []).map((l) =>
          typeof l === 'string' ? { name: l, color: '' } : { name: l.name ?? '', color: l.color ?? '' },
        ),
        user: issue.user ? { login: issue.user.login, avatarUrl: issue.user.avatar_url } : null,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        commentsCount: issue.comments,
        url: issue.html_url,
      })),
      totalCount: data.total_count,
    };
  }

  async getIssue(repoFullName: string, issueNumber: number): Promise<ScmIssueDetail> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data: issue } = await octokit.issues.get({ owner, repo, issue_number: issueNumber });
    const { data: comments } = await octokit.issues.listComments({ owner, repo, issue_number: issueNumber, per_page: 50 });

    return {
      number: issue.number,
      title: issue.title,
      body: issue.body ?? '',
      state: issue.state ?? 'open',
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

  // ── Pull Requests ───────────────────────────────────────

  async listPullRequests(
    repoFullName: string,
    state: 'open' | 'closed' | 'all' | 'draft' | 'merged' = 'open',
    perPage = 25,
    page = 1,
    sort: 'updated' | 'created' = 'updated',
  ): Promise<{ items: ScmPullRequest[]; totalCount: number }> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const qualifiers = [`repo:${owner}/${repo}`, 'is:pr'];

    switch (state) {
      case 'open': qualifiers.push('is:open'); break;
      case 'draft': qualifiers.push('is:open', 'draft:true'); break;
      case 'merged': qualifiers.push('is:merged'); break;
      case 'closed': qualifiers.push('is:closed', 'is:unmerged'); break;
      // 'all' — no state qualifier
    }

    const { data } = await octokit.search.issuesAndPullRequests({
      q: qualifiers.join(' '),
      per_page: perPage,
      page,
      sort,
      order: 'desc',
    });

    return {
      items: data.items.map((item) => ({
        number: item.number,
        title: item.title,
        body: item.body ?? '',
        state: (item as any).pull_request?.merged_at ? 'merged' : (item.state ?? 'open'),
        sourceBranch: '',
        targetBranch: '',
        user: item.user ? { login: item.user.login, avatarUrl: item.user.avatar_url } : null,
        url: item.html_url,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        merged: Boolean((item as any).pull_request?.merged_at),
        isDraft: (item as any).draft ?? false,
      })),
      totalCount: data.total_count,
    };
  }

  async getPullRequest(repoFullName: string, prNumber: number): Promise<ScmPullRequest> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
    const { data: files } = await octokit.pulls.listFiles({ owner, repo, pull_number: prNumber, per_page: 100 });
    const { data: reviews } = await octokit.pulls.listReviews({ owner, repo, pull_number: prNumber, per_page: 100 });
    const { data: comments } = await octokit.issues.listComments({ owner, repo, issue_number: prNumber, per_page: 50 });
    return {
      number: pr.number,
      title: pr.title,
      body: pr.body ?? '',
      state: pr.merged ? 'merged' : pr.state,
      sourceBranch: pr.head.ref,
      targetBranch: pr.base.ref,
      user: pr.user ? { login: pr.user.login, avatarUrl: pr.user.avatar_url } : null,
      url: pr.html_url,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      changedFiles: files.map((f) => f.filename),
      merged: pr.merged,
      mergeable: pr.mergeable,
      isDraft: pr.draft,
      additions: pr.additions,
      deletions: pr.deletions,
      commitsCount: pr.commits,
      reviewDecision: pr.mergeable_state,
      diffFiles: files.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch,
      })),
      reviews: reviews.map((r) => ({
        id: r.id,
        user: r.user ? { login: r.user.login, avatarUrl: r.user.avatar_url } : null,
        state: r.state,
        body: r.body ?? '',
        submittedAt: r.submitted_at ?? '',
      })),
      comments: comments.map((c) => ({
        id: c.id,
        body: c.body ?? '',
        user: c.user ? { login: c.user.login, avatarUrl: c.user.avatar_url } : null,
        createdAt: c.created_at,
      })),
    };
  }

  // ── Security ────────────────────────────────────────────

  async listSecurityAlerts(repoFullName: string): Promise<ScmSecurityAlert[]> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const alerts: ScmSecurityAlert[] = [];

    // Dependabot alerts
    try {
      const { data: depAlerts } = await octokit.request(
        'GET /repos/{owner}/{repo}/dependabot/alerts',
        { owner, repo, state: 'open', per_page: 50 },
      );
      for (const a of depAlerts as any[]) {
        alerts.push({
          id: a.number,
          alertType: 'dependabot',
          severity: this.mapSeverity(a.security_vulnerability?.severity),
          state: a.state === 'open' ? 'open' : a.state === 'fixed' ? 'fixed' : 'dismissed',
          title: a.security_advisory?.summary ?? `Dependency alert #${a.number}`,
          description: a.security_advisory?.description ?? '',
          affectedComponent: a.dependency?.package?.name ?? '',
          cveId: a.security_advisory?.cve_id,
          cweIds: a.security_advisory?.cwes?.map((c: any) => c.cwe_id) ?? [],
          tool: 'Dependabot',
          url: a.html_url,
          createdAt: a.created_at,
          fixAvailable: !!a.security_vulnerability?.first_patched_version,
        });
      }
    } catch (err: any) {
      this.logger.debug(`Dependabot alerts not available for ${repoFullName}: ${err.message}`);
    }

    // Code scanning alerts
    try {
      const { data: codeAlerts } = await octokit.request(
        'GET /repos/{owner}/{repo}/code-scanning/alerts',
        { owner, repo, state: 'open', per_page: 50 },
      );
      for (const a of codeAlerts as any[]) {
        alerts.push({
          id: a.number,
          alertType: 'code_scanning',
          severity: this.mapSeverity(a.rule?.security_severity_level ?? a.rule?.severity),
          state: a.state === 'open' ? 'open' : a.state === 'fixed' ? 'fixed' : 'dismissed',
          title: a.rule?.description ?? `Code scanning alert #${a.number}`,
          description: a.most_recent_instance?.message?.text ?? '',
          affectedComponent: a.most_recent_instance?.location?.path ?? '',
          cweIds: a.rule?.tags?.filter((t: string) => t.startsWith('cwe-')) ?? [],
          tool: a.tool?.name ?? 'CodeQL',
          url: a.html_url,
          createdAt: a.created_at,
          filePath: a.most_recent_instance?.location?.path,
          startLine: a.most_recent_instance?.location?.start_line,
          endLine: a.most_recent_instance?.location?.end_line,
        });
      }
    } catch (err: any) {
      this.logger.debug(`Code scanning alerts not available for ${repoFullName}: ${err.message}`);
    }

    return alerts;
  }

  async getSecurityAlert(repoFullName: string, alertId: number, alertType: string): Promise<ScmSecurityAlert> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    if (alertType === 'dependabot') {
      const { data: a } = await octokit.request(
        'GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}',
        { owner, repo, alert_number: alertId },
      ) as { data: any };
      return {
        id: a.number,
        alertType: 'dependabot',
        severity: this.mapSeverity(a.security_vulnerability?.severity),
        state: a.state === 'open' ? 'open' : a.state === 'fixed' ? 'fixed' : 'dismissed',
        title: a.security_advisory?.summary ?? `Dependency alert #${a.number}`,
        description: a.security_advisory?.description ?? '',
        affectedComponent: a.dependency?.package?.name ?? '',
        cveId: a.security_advisory?.cve_id,
        cweIds: a.security_advisory?.cwes?.map((c: any) => c.cwe_id) ?? [],
        tool: 'Dependabot',
        url: a.html_url,
        createdAt: a.created_at,
        fixAvailable: !!a.security_vulnerability?.first_patched_version,
      };
    }
    // Code scanning
    const { data: a } = await octokit.request(
      'GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}',
      { owner, repo, alert_number: alertId },
    ) as { data: any };
    return {
      id: a.number,
      alertType: 'code_scanning',
      severity: this.mapSeverity(a.rule?.security_severity_level ?? a.rule?.severity),
      state: a.state === 'open' ? 'open' : a.state === 'fixed' ? 'fixed' : 'dismissed',
      title: a.rule?.description ?? `Code scanning alert #${a.number}`,
      description: a.most_recent_instance?.message?.text ?? '',
      affectedComponent: a.most_recent_instance?.location?.path ?? '',
      cweIds: a.rule?.tags?.filter((t: string) => t.startsWith('cwe-')) ?? [],
      tool: a.tool?.name ?? 'CodeQL',
      url: a.html_url,
      createdAt: a.created_at,
      filePath: a.most_recent_instance?.location?.path,
      startLine: a.most_recent_instance?.location?.start_line,
      endLine: a.most_recent_instance?.location?.end_line,
    };
  }

  // ── Git Operations ──────────────────────────────────────

  async createBranch(repoFullName: string, branchName: string, baseBranch: string): Promise<void> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    try {
      await octokit.git.getRef({ owner, repo, ref: `heads/${branchName}` });
      this.logger.log(`Branch ${branchName} already exists, skipping creation.`);
      return;
    } catch (err: any) {
      if (err.status !== 404) throw err;
    }
    const { data: refData } = await octokit.git.getRef({ owner, repo, ref: `heads/${baseBranch}` });
    await octokit.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha: refData.object.sha });
    this.logger.log(`Created branch ${branchName} from ${baseBranch}`);
  }

  async commitFiles(
    repoFullName: string,
    branchName: string,
    message: string,
    files: Array<{ path: string; content: string }>,
  ): Promise<string> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data: refData } = await octokit.git.getRef({ owner, repo, ref: `heads/${branchName}` });
    const latestCommitSha = refData.object.sha;
    const { data: commitData } = await octokit.git.getCommit({ owner, repo, commit_sha: latestCommitSha });
    const baseTreeSha = commitData.tree.sha;
    const treeItems = await Promise.all(
      files.map(async (f) => {
        const { data: blob } = await octokit.git.createBlob({ owner, repo, content: f.content, encoding: 'utf-8' });
        return { path: f.path, mode: '100644' as const, type: 'blob' as const, sha: blob.sha };
      }),
    );
    const { data: newTree } = await octokit.git.createTree({ owner, repo, base_tree: baseTreeSha, tree: treeItems });
    const { data: newCommit } = await octokit.git.createCommit({ owner, repo, message, tree: newTree.sha, parents: [latestCommitSha] });
    await octokit.git.updateRef({ owner, repo, ref: `heads/${branchName}`, sha: newCommit.sha });
    this.logger.log(`Committed ${files.length} file(s) to ${branchName}`);
    return newCommit.sha;
  }

  async createPullRequest(
    repoFullName: string,
    head: string,
    base: string,
    title: string,
    body: string,
  ): Promise<ScmCreatedPR> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data: existingPrs } = await octokit.pulls.list({
      owner, repo, head: `${owner}:${head}`, base, state: 'open',
    });
    if (existingPrs.length > 0) {
      const existing = existingPrs[0];
      this.logger.log(`PR already exists: #${existing.number}`);
      return { number: existing.number, url: existing.html_url, title: existing.title };
    }
    const { data } = await octokit.pulls.create({ owner, repo, head, base, title, body });
    this.logger.log(`Opened PR #${data.number}: ${data.html_url}`);
    return { number: data.number, url: data.html_url, title: data.title };
  }

  // ── Fork-and-PR ─────────────────────────────────────────

  async checkPushAccess(repoFullName: string): Promise<boolean> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    try {
      const { data } = await octokit.repos.get({ owner, repo });
      return data.permissions?.push ?? false;
    } catch {
      return false;
    }
  }

  async forkRepo(repoFullName: string): Promise<ScmForkResult> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    try {
      const { data } = await octokit.repos.createFork({ owner, repo });
      // GitHub takes a few seconds to finish forking — poll until ready
      const forkFullName = data.full_name;
      let ready = false;
      for (let i = 0; i < 10; i++) {
        try {
          await octokit.repos.get({ owner: data.owner.login, repo: data.name });
          ready = true;
          break;
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      if (!ready) {
        this.logger.warn(`Fork ${forkFullName} may not be ready yet — proceeding anyway`);
      }
      this.logger.log(`Forked ${repoFullName} → ${forkFullName}`);
      return { fullName: forkFullName, defaultBranch: data.default_branch, existed: false };
    } catch (err: any) {
      // 202 + existing fork
      if (err.status === 202 || (err.message && err.message.includes('already exists'))) {
        const { data: me } = await octokit.users.getAuthenticated();
        const forkFullName = `${me.login}/${repo}`;
        const { data: forkData } = await octokit.repos.get({ owner: me.login, repo });
        this.logger.log(`Fork already exists: ${forkFullName}`);
        return { fullName: forkFullName, defaultBranch: forkData.default_branch, existed: true };
      }
      throw err;
    }
  }

  async createCrossRepoPR(
    upstreamFullName: string,
    forkFullName: string,
    head: string,
    base: string,
    title: string,
    body: string,
  ): Promise<ScmCreatedPR> {
    const octokit = await this.getRepoClient(upstreamFullName);
    const { owner: upstreamOwner, repo } = this.split(upstreamFullName);
    const { owner: forkOwner } = this.split(forkFullName);
    const crossHead = `${forkOwner}:${head}`;
    // Check for existing cross-repo PR
    const { data: existingPrs } = await octokit.pulls.list({
      owner: upstreamOwner, repo, head: crossHead, base, state: 'open',
    });
    if (existingPrs.length > 0) {
      const existing = existingPrs[0];
      this.logger.log(`Cross-repo PR already exists: #${existing.number}`);
      return { number: existing.number, url: existing.html_url, title: existing.title };
    }
    const { data } = await octokit.pulls.create({
      owner: upstreamOwner, repo, head: crossHead, base, title, body,
      maintainer_can_modify: true,
    });
    this.logger.log(`Opened cross-repo PR #${data.number}: ${data.html_url}`);
    return { number: data.number, url: data.html_url, title: data.title };
  }

  // ── Helpers ─────────────────────────────────────────────

  private mapSeverity(s?: string): ScmSecurityAlert['severity'] {
    switch (s?.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': case 'moderate': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  }
  // ── Comments ───────────────────────────────────────

  async postIssueComment(repoFullName: string, issueNumber: number, body: string) {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.issues.createComment({ owner, repo, issue_number: issueNumber, body });
    return {
      id: data.id,
      body: data.body ?? '',
      user: data.user ? { login: data.user.login, avatarUrl: data.user.avatar_url } : null,
      createdAt: data.created_at,
    };
  }

  async postPRComment(repoFullName: string, prNumber: number, body: string) {
    return this.postIssueComment(repoFullName, prNumber, body);
  }

  // ── PR Actions ─────────────────────────────────────

  async mergePullRequest(repoFullName: string, prNumber: number, mergeMethod: 'merge' | 'squash' | 'rebase' = 'merge') {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    await octokit.pulls.merge({ owner, repo, pull_number: prNumber, merge_method: mergeMethod });
    this.logger.log(`Merged PR #${prNumber} on ${repoFullName} (${mergeMethod})`);
  }

  async closePullRequest(repoFullName: string, prNumber: number) {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    await octokit.pulls.update({ owner, repo, pull_number: prNumber, state: 'closed' });
    this.logger.log(`Closed PR #${prNumber} on ${repoFullName}`);
  }

  // ── Enrichment ─────────────────────────────────────

  async getRepoActivity(repoFullName: string): Promise<{ openIssues: number; openPRs: number }> {
    const cached = this.readCachedActivity(repoFullName);
    if (cached) {
      return cached;
    }

    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);

    try {
      const [repoRes, prsRes] = await Promise.all([
        octokit.repos.get({ owner, repo }),
        octokit.pulls.list({
          owner,
          repo,
          state: 'open',
          per_page: 1,
          sort: 'updated',
          direction: 'desc',
        }),
      ]);

      const openPRs = prsRes.data.length === 0
        ? 0
        : (this.getLastPageFromLinkHeader(prsRes.headers.link) ?? 1);
      const openIssues = Math.max((repoRes.data.open_issues_count ?? 0) - openPRs, 0);
      const value = { openIssues, openPRs };

      this.writeCachedActivity(repoFullName, value);
      return value;
    } catch (error: any) {
      if (error?.status === 403) {
        const stale = this.activityCache.get(repoFullName)?.value;
        if (stale) {
          this.logger.warn(`GitHub activity lookup throttled for ${repoFullName}; serving cached counts.`);
          return stale;
        }
      }

      throw error;
    }
  }

  async listLanguages(repoFullName: string): Promise<Record<string, number>> {
    const octokit = await this.getRepoClient(repoFullName);
    const { owner, repo } = this.split(repoFullName);
    const { data } = await octokit.repos.listLanguages({ owner, repo });
    return data;
  }
}
