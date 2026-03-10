import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { ScmProvider, ScmCapabilities } from './scm.types';
import { GitHubScmProvider } from './github.scm-provider';

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

  /** Resolve the correct provider for a repo full name.
   *  For now, we only have GitHub, but future: parse the URL or look up Connections. */
  resolveForRepo(_repoFullName: string): ScmProvider {
    // TODO: in the future, look up the Connection / LinkedRepository
    // table to determine which provider handles this repo.
    return this.getDefault();
  }
}
