import { Module, OnModuleInit } from '@nestjs/common';
import { ScmRegistry } from './scm.registry';
import { GitHubScmProvider } from './github.scm-provider';
import { AzureDevOpsScmProvider } from './azure-devops.scm-provider';
import { GitHubService } from '../github.service';
import { AzureDevOpsService } from '../azure-devops.service';
import { ConnectionsModule } from '../../connections/connections.module';

@Module({
  imports: [ConnectionsModule],
  providers: [ScmRegistry, GitHubScmProvider, AzureDevOpsScmProvider, GitHubService, AzureDevOpsService],
  exports: [ScmRegistry, GitHubService, AzureDevOpsService],
})
export class ScmModule implements OnModuleInit {
  constructor(
    private readonly scm: ScmRegistry,
    private readonly githubScm: GitHubScmProvider,
    private readonly azureDevOpsScm: AzureDevOpsScmProvider,
  ) {}

  onModuleInit() {
    this.scm.register(this.githubScm, GitHubScmProvider.capabilities);
    this.scm.register(this.azureDevOpsScm, AzureDevOpsScmProvider.capabilities);
  }
}
