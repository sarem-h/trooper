import { Module } from '@nestjs/common';
import { IndexingController } from './indexing.controller';
import { IndexingService } from './indexing.service';
import { RagService } from './rag.service';
import { GitHubService } from '../pipeline/github.service';

@Module({
  controllers: [IndexingController],
  providers: [IndexingService, RagService, GitHubService],
  exports: [IndexingService, RagService],
})
export class IndexingModule {}
