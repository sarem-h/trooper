import { Module, OnModuleInit, Global } from '@nestjs/common';
import { McpRegistry } from './mcp.registry';
import { GitHubToolProvider } from './providers/github.provider';
import { AzureReposToolProvider } from './providers/azure-repos.provider';
import { GitHubService } from '../pipeline/github.service';
import { AzureDevOpsService } from '../pipeline/azure-devops.service';
import { PipelineModule } from '../pipeline/pipeline.module';

/**
 * MCP Module
 *
 * Manages the tool registry and provider registration.
 * Global so that the LLM module can inject McpRegistry directly.
 */
@Global()
@Module({
  imports: [PipelineModule],
  providers: [McpRegistry],
  exports: [McpRegistry],
})
export class McpModule implements OnModuleInit {
  constructor(
    private readonly registry: McpRegistry,
    private readonly github: GitHubService,
    private readonly azureDevOps: AzureDevOpsService,
  ) {}

  onModuleInit() {
    // Register providers at startup
    this.registry.registerProvider(new GitHubToolProvider(this.github));
    this.registry.registerProvider(new AzureReposToolProvider(this.azureDevOps));
  }
}
