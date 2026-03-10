import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.webhookConfig.findMany({
      include: { repository: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const wh = await this.prisma.client.webhookConfig.findUnique({
      where: { id },
      include: { repository: true },
    });
    if (!wh) throw new NotFoundException(`Webhook ${id} not found`);
    return wh;
  }

  async create(data: {
    repositoryId: string;
    event: string;
    endpointPath: string;
    active?: boolean;
    secretConfigured?: boolean;
  }) {
    return this.prisma.client.webhookConfig.create({ data });
  }

  async update(id: string, data: Partial<{ active: boolean; secretConfigured: boolean }>) {
    await this.findOne(id);
    return this.prisma.client.webhookConfig.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.webhookConfig.delete({ where: { id } });
  }
}
