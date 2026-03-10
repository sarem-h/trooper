import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PullRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.pullRequest.findMany({
      include: { workItem: true, run: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pr = await this.prisma.client.pullRequest.findUnique({
      where: { id },
      include: { workItem: true, run: true },
    });
    if (!pr) throw new NotFoundException(`PullRequest ${id} not found`);
    return pr;
  }

  async create(data: {
    azurePRId: number;
    title: string;
    sourceBranch: string;
    targetBranch: string;
    status?: string;
    reviewerAlias?: string;
    workItemId: string;
    runId: string;
    url: string;
  }) {
    return this.prisma.client.pullRequest.create({ data });
  }

  async update(id: string, data: Partial<{ status: string; reviewerAlias: string; rejectionComment: string }>) {
    await this.findOne(id);
    return this.prisma.client.pullRequest.update({ where: { id }, data });
  }
}
