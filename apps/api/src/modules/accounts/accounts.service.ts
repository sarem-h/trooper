import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.linkedAccount.findMany({
      include: { connection: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.client.linkedAccount.findUnique({
      where: { id },
      include: { connection: true },
    });
    if (!account) throw new NotFoundException(`LinkedAccount ${id} not found`);
    return account;
  }

  async create(data: {
    displayName: string;
    providerUsername: string;
    email: string;
    provider: string;
    authMethod: string;
    status?: string;
    avatarUrl?: string;
    connectionId?: string;
    expiresAt?: string;
  }) {
    return this.prisma.client.linkedAccount.create({
      data: {
        displayName: data.displayName,
        providerUsername: data.providerUsername,
        email: data.email,
        provider: data.provider,
        authMethod: data.authMethod,
        status: data.status ?? 'active',
        avatarUrl: data.avatarUrl,
        ...(data.connectionId ? { connection: { connect: { id: data.connectionId } } } : {}),
        ...(data.expiresAt ? { expiresAt: new Date(data.expiresAt) } : {}),
      },
    });
  }

  async update(id: string, data: Partial<{ status: string; avatarUrl: string; expiresAt: string | null }>) {
    await this.findOne(id);
    return this.prisma.client.linkedAccount.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.client.linkedAccount.delete({ where: { id } });
  }
}
