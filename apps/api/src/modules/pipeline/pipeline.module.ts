import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';
import { PipelineStepTracker } from './pipeline-step-tracker.service';
import { PipelinePlanningService } from './pipeline-planning.service';
import { PipelineExecutionService } from './pipeline-execution.service';
import { ScmModule } from './scm';
import { TaskDrafterService, SecurityAnalysisService } from './drafting';
import { MaskingModule } from '../masking/masking.module';
import { IndexingModule } from '../indexing/indexing.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [EventEmitterModule.forRoot(), MaskingModule, IndexingModule, ConnectionsModule, ScmModule],
  controllers: [PipelineController],
  providers: [PipelineService, PipelineStepTracker, PipelinePlanningService, PipelineExecutionService, TaskDrafterService, SecurityAnalysisService],
  exports: [PipelineService, ScmModule],
})
export class PipelineModule {}
