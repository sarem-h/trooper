import { Controller, Get, Post, Body, Param, Query, HttpCode, NotFoundException } from '@nestjs/common';
import { IndexingService } from './indexing.service';
import { RagService } from './rag.service';

@Controller('indexing')
export class IndexingController {
  constructor(
    private readonly indexingService: IndexingService,
    private readonly ragService: RagService,
  ) {}

  @Get()
  findAll() { return this.indexingService.findAll(); }

  @Post()
  upsert(@Body() dto: { repository: string; branch: string; status?: string; totalFiles?: number; indexedFiles?: number }) {
    return this.indexingService.upsert(dto);
  }

  /** Get index state for a specific repo/branch */
  @Get('status')
  async status(
    @Query('repository') repository: string,
    @Query('branch') branch: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const [state, activeJob] = await Promise.all([
      this.indexingService.findByRepo(repository, branch, tenantId),
      Promise.resolve(this.indexingService.getActiveJob(repository, branch, tenantId)),
    ]);

    return {
      ...(state ?? { repository, branch, tenantId: tenantId ?? 'default', status: null, totalFiles: 0, indexedFiles: 0, lastSyncAt: null }),
      activeJob,
    };
  }

  /** Queue a background RAG sync for a repository */
  @Post('sync')
  @HttpCode(202)
  sync(@Body() dto: { repository: string; branch: string; tenantId?: string }) {
    return this.indexingService.startSync(dto.repository, dto.branch, dto.tenantId);
  }

  @Get('jobs/:jobId')
  job(@Param('jobId') jobId: string) {
    const job = this.indexingService.getJob(jobId);
    if (!job) {
      throw new NotFoundException(`Indexing job ${jobId} not found`);
    }
    return job;
  }

  /** Get index statistics */
  @Get('stats')
  async stats() {
    return this.ragService.getStats();
  }

  /** List indexed files for a repo/branch */
  @Get('files')
  async files(
    @Query('repository') repository: string,
    @Query('branch') branch: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.ragService.getIndexedFiles(repository, branch, tenantId);
  }

  /** Get chunks for a specific file */
  @Get('files/chunks')
  async fileChunks(
    @Query('repository') repository: string,
    @Query('branch') branch: string,
    @Query('filePath') filePath: string,
    @Query('tenantId') tenantId?: string,
  ) {
    return this.ragService.getFileChunks(repository, branch, filePath, tenantId);
  }

  /** Semantic search: hybrid query for testing retrieval quality */
  @Post('search')
  async search(
    @Body() dto: { repository: string; branch: string; query: string; topK?: number; tenantId?: string },
  ) {
    return this.ragService.queryRelevantChunks(
      dto.repository,
      dto.branch,
      dto.query,
      dto.topK,
      dto.tenantId,
    );
  }
}
