import { Injectable, Logger } from '@nestjs/common';
import { AzureDevOpsService } from '../azure-devops.service';
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
  PaginatedList,
} from './scm.types';

/**
 * Azure DevOps implementation of the universal ScmProvider interface.
 *
 * Wraps the AzureDevOpsService to expose a provider-agnostic API surface that
 * the pipeline, MCP tools, and UI controllers consume without knowing they're
 * talking to Azure DevOps.
 */
@Injectable()
export class AzureDevOpsScmProvider implements ScmProvider {
  readonly providerType = 'azure_repos';
  private readonly logger = new Logger(AzureDevOpsScmProvider.name);

  static readonly capabilities: ScmCapabilities = {
    issues: true,       // mapped to Azure DevOps Work Items
    pullRequests: true,
    security: false,    // Azure DevOps has no equivalent security alerts API
    fork: false,        // Forking not common in Azure DevOps git flow
  };

  constructor(private readonly azureDevOps: AzureDevOpsService) {}

  // ── Repository ──────────────────────────────────────────

  async listRepos(): Promise<ScmRepo[]> {
    const repos = await this.azureDevOps.listRepos();
    return repos.map((r) => ({
      fullName: r.fullName,
      private: r.private,
      defaultBranch: r.defaultBranch,
      pushAccess: true, // Azure DevOps doesn't expose this; assume true for PAT
      description: undefined,
      language: undefined,
      stars: 0,
      openIssuesCount: 0,
      ownerAvatarUrl: undefined,
      provider: 'azure_repos',
    }));
  }

  async searchRepos(query: string, page: number = 1): Promise<ScmRepo[]> {
    // Azure DevOps doesn't have a dedicated repo search — filter from listRepos
    const allRepos = await this.listRepos();
    if (!query || query.trim().length === 0) return allRepos;

    const q = query.toLowerCase();
    return allRepos.filter(
      (r) => r.fullName.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q),
    );
  }

  async getRepo(repoFullName: string): Promise<ScmRepo> {
    const r = await this.azureDevOps.getRepo(repoFullName);
    return {
      fullName: r.fullName,
      private: r.private,
      defaultBranch: r.defaultBranch,
      pushAccess: true,
      description: undefined,
      language: undefined,
      stars: 0,
      openIssuesCount: 0,
      ownerAvatarUrl: undefined,
      provider: 'azure_repos',
    };
  }

  async getDefaultBranch(repoFullName: string): Promise<string> {
    return this.azureDevOps.getDefaultBranch(repoFullName);
  }

  async listBranches(repoFullName: string): Promise<string[]> {
    return this.azureDevOps.listBranches(repoFullName);
  }

  async getTree(repoFullName: string, branch: string): Promise<ScmRepoFile[]> {
    return this.azureDevOps.getTree(repoFullName, branch);
  }

  async getFileContent(repoFullName: string, filePath: string, ref: string): Promise<ScmFileContent> {
    return this.azureDevOps.getFileContent(repoFullName, filePath, ref);
  }

  async getFilesContent(repoFullName: string, paths: string[], ref: string): Promise<ScmFileContent[]> {
    return this.azureDevOps.getFilesContent(repoFullName, paths, ref);
  }

  // ── Issues (Azure DevOps Work Items) ───────────────────

  async listIssues(
    repoFullName: string,
    state: 'open' | 'closed' | 'all' = 'open',
    perPage = 25,
    page = 1,
    search?: string,
  ): Promise<PaginatedList<ScmIssue>> {
    const adoState = state === 'open' ? 'New' : state === 'closed' ? 'Closed' : undefined;
    const skip = (page - 1) * perPage;
    let result;
    try {
      result = await this.azureDevOps.listWorkItems(repoFullName, adoState, perPage, skip, search);
    } catch (error: any) {
      if (error?.status === 401 || error?.status === 403) {
        this.logger.warn(`Azure DevOps work items unavailable for ${repoFullName}; returning empty issue list`);
        return {
          items: [],
          totalCount: 0,
          availability: {
            status: 'limited',
            reason: 'This Azure DevOps PAT can access code, but it does not include Work Items scope.',
          },
        };
      }
      throw error;
    }

    return {
      items: result.items,
      totalCount: result.totalCount,
      availability: {
        status: 'ok',
      },
    };
  }

  async getIssue(repoFullName: string, issueNumber: number): Promise<ScmIssueDetail> {
    return this.azureDevOps.getWorkItem(repoFullName, issueNumber);
  }

  // ── Pull Requests ───────────────────────────────────────

  async listPullRequests(
    repoFullName: string,
    state: 'open' | 'closed' | 'all' | 'draft' | 'merged' = 'open',
    perPage = 25,
    page = 1,
    _sort?: 'updated' | 'created',
  ): Promise<PaginatedList<ScmPullRequest>> {
    const skip = (page - 1) * perPage;
    const result = await this.azureDevOps.listPullRequests(repoFullName, state, perPage, skip);
    return {
      items: result.items,
      totalCount: result.totalCount,
    };
  }

  async getPullRequest(repoFullName: string, prNumber: number): Promise<ScmPullRequest> {
    return this.azureDevOps.getPullRequest(repoFullName, prNumber);
  }

  // ── Security (not supported by Azure DevOps) ──────────

  async listSecurityAlerts(_repoFullName: string): Promise<ScmSecurityAlert[]> {
    return [];
  }

  async getSecurityAlert(_repoFullName: string, _alertId: number, _alertType: string): Promise<ScmSecurityAlert> {
    throw new Error('Security alerts are not available for Azure DevOps repositories.');
  }

  // ── Git Operations ──────────────────────────────────────

  async createBranch(repoFullName: string, branchName: string, baseBranch: string): Promise<void> {
    return this.azureDevOps.createBranch(repoFullName, branchName, baseBranch);
  }

  async commitFiles(
    repoFullName: string,
    branchName: string,
    message: string,
    files: Array<{ path: string; content: string }>,
  ): Promise<string> {
    return this.azureDevOps.commitFiles(repoFullName, branchName, message, files);
  }

  async createPullRequest(
    repoFullName: string,
    head: string,
    base: string,
    title: string,
    body: string,
  ): Promise<ScmCreatedPR> {
    return this.azureDevOps.createPullRequest(repoFullName, head, base, title, body);
  }

  // ── Comments ───────────────────────────────────────────

  async postIssueComment(repoFullName: string, issueNumber: number, body: string): Promise<ScmIssueComment> {
    return this.azureDevOps.postWorkItemComment(repoFullName, issueNumber, body);
  }

  async postPRComment(repoFullName: string, prNumber: number, body: string): Promise<ScmIssueComment> {
    return this.azureDevOps.postPRComment(repoFullName, prNumber, body);
  }

  // ── PR Actions ─────────────────────────────────────────

  async mergePullRequest(repoFullName: string, prNumber: number, _mergeMethod?: 'merge' | 'squash' | 'rebase'): Promise<void> {
    return this.azureDevOps.mergePullRequest(repoFullName, prNumber);
  }

  async closePullRequest(repoFullName: string, prNumber: number): Promise<void> {
    return this.azureDevOps.closePullRequest(repoFullName, prNumber);
  }

  // ── Fork (not supported for Azure DevOps) ──────────────

  async checkPushAccess(_repoFullName: string): Promise<boolean> {
    return true;
  }

  async forkRepo(_repoFullName: string): Promise<ScmForkResult> {
    throw new Error('Forking is not supported for Azure DevOps repositories.');
  }

  async createCrossRepoPR(
    _upstreamFullName: string,
    _forkFullName: string,
    _head: string,
    _base: string,
    _title: string,
    _body: string,
  ): Promise<ScmCreatedPR> {
    throw new Error('Cross-repo PRs are not supported for Azure DevOps repositories.');
  }

  // ── Enrichment ─────────────────────────────────────────

  async getRepoActivity(repoFullName: string): Promise<{ openIssues: number; openPRs: number }> {
    try {
      const [openIssues, openPRs] = await Promise.all([
        this.azureDevOps.countOpenWorkItems(repoFullName),
        this.azureDevOps.countOpenPullRequests(repoFullName),
      ]);
      return { openIssues, openPRs };
    } catch {
      return { openIssues: 0, openPRs: 0 };
    }
  }

  async listLanguages(repoFullName: string): Promise<Record<string, number>> {
    return this.azureDevOps.listLanguages(repoFullName);
  }
}
