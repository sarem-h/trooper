import { Module } from '@nestjs/common';
import { IndexingController } from './indexing.controller';
import { IndexingService } from './indexing.service';
import { RagService } from './rag.service';
import { ScmModule } from '../pipeline/scm';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [ConnectionsModule, ScmModule],
  controllers: [IndexingController],
  providers: [IndexingService, RagService],
  exports: [IndexingService, RagService],
})
export class IndexingModule {}
