import { Module, OnModuleInit } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';
import { PipelineStepTracker } from './pipeline-step-tracker.service';
import { PipelinePlanningService } from './pipeline-planning.service';
import { PipelineExecutionService } from './pipeline-execution.service';
import { GitHubService } from './github.service';
import { ScmRegistry, GitHubScmProvider } from './scm';
import { TaskDrafterService, SecurityAnalysisService } from './drafting';
import { MaskingModule } from '../masking/masking.module';
import { IndexingModule } from '../indexing/indexing.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [EventEmitterModule.forRoot(), MaskingModule, IndexingModule, ConnectionsModule],
  controllers: [PipelineController],
  providers: [PipelineService, PipelineStepTracker, PipelinePlanningService, PipelineExecutionService, GitHubService, ScmRegistry, GitHubScmProvider, TaskDrafterService, SecurityAnalysisService],
  exports: [PipelineService, GitHubService, ScmRegistry],
})
export class PipelineModule implements OnModuleInit {
  constructor(
    private readonly scm: ScmRegistry,
    private readonly githubScm: GitHubScmProvider,
  ) {}

  onModuleInit() {
    this.scm.register(this.githubScm, GitHubScmProvider.capabilities);
  }
}
