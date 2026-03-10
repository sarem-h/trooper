import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RepositoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.linkedRepository.findMany({
      include: { connection: true, assumeAccount: true, webhooks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const repo = await this.prisma.client.linkedRepository.findUnique({
      where: { id },
      include: { connection: true, assumeAccount: true, webhooks: true },
    });
    if (!repo) throw new NotFoundException(`Repository ${id} not found`);
    return repo;
  }

  async create(data: {
    name: string;
    fullName: string;
    provider: string;
    connectionId: string;
    defaultBranch: string;
    identityMode?: string;
    assumeAccountId?: string;
    indexEnabled?: boolean;
    defaultReviewer?: string;
  }) {
    return this.prisma.client.linkedRepository.create({
      data: {
        ...data,
        identityMode: data.identityMode ?? 'service_account',
      },
    });
  }

  async update(id: string, data: Partial<{
    identityMode: string;
    assumeAccountId: string | null;
    indexEnabled: boolean;
    defaultReviewer: string | null;
    webhookActive: boolean;
  }>) {
    await this.findOne(id);
    return this.prisma.client.linkedRepository.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.linkedRepository.delete({ where: { id } });
  }
}
