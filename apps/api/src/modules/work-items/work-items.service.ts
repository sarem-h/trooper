import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WorkItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.workItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.client.workItem.findUnique({
      where: { id },
      include: { agentRuns: { include: { steps: true } }, pullRequests: true },
    });
    if (!item) throw new NotFoundException(`WorkItem ${id} not found`);
    return item;
  }

  async create(data: {
    azureId: number;
    title: string;
    description: string;
    type: string;
    status?: string;
    assignedTo?: string;
  }) {
    return this.prisma.client.workItem.create({ data });
  }

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    status: string;
    assignedTo: string | null;
    linkedRunId: string | null;
    linkedPRId: string | null;
  }>) {
    await this.findOne(id);
    return this.prisma.client.workItem.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.workItem.delete({ where: { id } });
  }
}
