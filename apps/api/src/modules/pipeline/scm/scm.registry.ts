import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ScmProvider, ScmCapabilities } from './scm.types';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Central registry and factory for SCM providers.
 *
 * The pipeline and controllers ask the registry for a provider by type
 * (or get the default). The registry handles:
 *  - Provider registration
 *  - Default provider selection
 *  - Capability checking (so callers can degrade gracefully)
 */
@Injectable()
export class ScmRegistry {
  private readonly logger = new Logger(ScmRegistry.name);
  private readonly providers = new Map<string, ScmProvider>();
  private readonly caps = new Map<string, ScmCapabilities>();
  private defaultProviderType = 'github';

  constructor(private readonly prisma: PrismaService) {}

  /** Register a provider at startup */
  register(provider: ScmProvider, capabilities: ScmCapabilities): void {
    this.providers.set(provider.providerType, provider);
    this.caps.set(provider.providerType, capabilities);
    this.logger.log(`SCM provider registered: "${provider.providerType}"`);
  }

  /** Get a provider by type, or throw */
  get(providerType: string): ScmProvider {
    const p = this.providers.get(providerType);
    if (!p) throw new NotFoundException(`SCM provider "${providerType}" not registered`);
    return p;
  }

  /** Get the default provider (currently GitHub) */
  getDefault(): ScmProvider {
    return this.get(this.defaultProviderType);
  }

  /** Check what a provider supports before calling optional methods */
  getCapabilities(providerType: string): ScmCapabilities {
    return this.caps.get(providerType) ?? { issues: false, pullRequests: false, security: false, fork: false };
  }

  /** List all registered provider types */
  listProviderTypes(): string[] {
    return [...this.providers.keys()];
  }

  /**
   * Resolve the correct provider for a repo full name.
   * Uses a synchronous heuristic first, then falls back to the default.
   * For DB-backed resolution, use resolveForRepoAsync().
   */
  resolveForRepo(repoFullName: string): ScmProvider {
    // Check the provider cache set by resolveForRepoAsync
    const cached = this.repoProviderCache.get(repoFullName);
    if (cached && this.providers.has(cached)) {
      return this.get(cached);
    }

    return this.getDefault();
  }

  private readonly repoProviderCache = new Map<string, string>();

  /**
   * Async version: resolve provider by querying the database for repository linkage.
   * Also populates a synchronous cache so that subsequent resolveForRepo() calls
   * for the same repo work without database access.
   */
  async resolveForRepoAsync(repoFullName: string, providerHint?: string): Promise<ScmProvider> {
    if (providerHint && this.providers.has(providerHint)) {
       this.repoProviderCache.set(repoFullName, providerHint);
       return this.get(providerHint);
    }
    
    // Check in-memory cache first even if no hint provided
    const cached = this.repoProviderCache.get(repoFullName);
    if (cached && this.providers.has(cached)) {
      return this.get(cached);
    }

    // Check LinkedRepository table for explicit provider linkage
    const linked = await this.prisma.client.linkedRepository.findFirst({
      where: { fullName: repoFullName },
      orderBy: { updatedAt: 'desc' },
    });

    if (linked?.provider && this.providers.has(linked.provider)) {
      this.repoProviderCache.set(repoFullName, linked.provider);
      return this.get(linked.provider);
    }

    // Check Connection table — if the repo matches a connection, use that provider
    const connection = await this.prisma.client.connection.findFirst({
      where: {
        secretToken: { not: null },
        status: { in: ['active', 'expiring'] },
      },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });

    if (connection?.provider && this.providers.has(connection.provider)) {
      // Don't cache generic connection match — it's the default behavior
    }

    return this.getDefault();
  }
}
