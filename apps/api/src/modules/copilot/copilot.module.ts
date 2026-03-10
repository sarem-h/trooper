import { Module } from '@nestjs/common';
import { CopilotController } from './copilot.controller';
import { CopilotService } from './copilot.service';
import { IndexingModule } from '../indexing/indexing.module';
import { PipelineModule } from '../pipeline/pipeline.module';

@Module({
  imports: [IndexingModule, PipelineModule],
  controllers: [CopilotController],
  providers: [CopilotService],
})
export class CopilotModule {}
