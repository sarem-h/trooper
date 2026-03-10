import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RagService, type SyncProgress } from './rag.service';

type SyncJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface SyncJobSnapshot {
  id: string;
  repository: string;
  branch: string;
  tenantId: string;
  status: SyncJobStatus;
  totalFiles: number;
  processedFiles: number;
  totalChunks: number;
  currentFile?: string;
  result?: { totalFiles: number; totalChunks: number };
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

@Injectable()
export class IndexingService {
  private readonly jobs = new Map<string, SyncJobSnapshot>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly rag: RagService,
  ) {}

  async findAll() {
    return this.prisma.client.indexState.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  async findByRepo(repository: string, branch: string, tenantId = 'default') {
    return this.prisma.client.indexState.findUnique({
      where: { tenantId_repository_branch: { tenantId, repository, branch } },
    });
  }

  getJob(jobId: string) {
    return this.jobs.get(jobId) ?? null;
  }

  getActiveJob(repository: string, branch: string, tenantId = 'default') {
    return [...this.jobs.values()].find(
      (job) =>
        job.repository === repository &&
        job.branch === branch &&
        job.tenantId === tenantId &&
        (job.status === 'queued' || job.status === 'running'),
    ) ?? null;
  }

  startSync(repository: string, branch: string, tenantId = 'default') {
    const existing = this.getActiveJob(repository, branch, tenantId);
    if (existing) {
      return existing;
    }

    const job: SyncJobSnapshot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      repository,
      branch,
      tenantId,
      status: 'queued',
      totalFiles: 0,
      processedFiles: 0,
      totalChunks: 0,
      startedAt: new Date().toISOString(),
    };
    this.jobs.set(job.id, job);

    void this.runSyncJob(job.id);

    return job;
  }

  private async runSyncJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }

    job.status = 'running';

    try {
      const result = await this.rag.syncRepository(
        job.repository,
        job.branch,
        (progress: SyncProgress) => {
          job.totalFiles = progress.totalFiles;
          job.processedFiles = progress.processedFiles;
          job.totalChunks = progress.totalChunks;
          job.currentFile = progress.currentFile;
        },
        job.tenantId,
      );

      job.status = 'completed';
      job.result = result;
      job.totalFiles = result.totalFiles;
      job.processedFiles = result.totalFiles;
      job.totalChunks = result.totalChunks;
      job.finishedAt = new Date().toISOString();
    } catch (err: any) {
      job.status = 'failed';
      job.error = err.message;
      job.finishedAt = new Date().toISOString();
    }
  }

  async upsert(data: {
    repository: string;
    branch: string;
    status?: string;
    totalFiles?: number;
    indexedFiles?: number;
    lastSyncAt?: string;
  }) {
    const tenantId = (data as any).tenantId ?? 'default';
    return this.prisma.client.indexState.upsert({
      where: { tenantId_repository_branch: { tenantId, repository: data.repository, branch: data.branch } },
      create: { ...data, tenantId },
      update: data,
    });
  }
}
