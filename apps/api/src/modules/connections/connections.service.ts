import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { AuthStatus, ConnectionAuthMethod, GitProvider } from '@trooper/shared';
import type { CreateConnectionDto, UpdateConnectionDto } from '@trooper/shared';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(ConnectionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const connections = await this.prisma.client.connection.findMany({
      include: {
        _count: { select: { linkedAccounts: true, repositories: true } },
      },
      orderBy: [{ provider: 'asc' }, { isDefault: 'desc' }, { updatedAt: 'desc' }],
    });

    return connections.map((connection) => this.sanitize(connection));
  }

  async findOne(id: string) {
    const connection = await this.findRawOne(id);
    if (!connection) throw new NotFoundException(`Connection ${id} not found`);
    return this.sanitize(connection);
  }

  async create(data: CreateConnectionDto) {
    if (data.authMethod !== ConnectionAuthMethod.PAT) {
      throw new BadRequestException('Only PAT-based connections are supported right now.');
    }

    const normalized = await this.normalizeCreateInput(data);
    const existingCount = await this.prisma.client.connection.count({
      where: { provider: normalized.provider },
    });
    const shouldBeDefault = data.isDefault ?? existingCount === 0;

    const connection = await this.prisma.client.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.connection.updateMany({
          where: { provider: normalized.provider },
          data: { isDefault: false },
        });
      }

      return tx.connection.create({
        data: {
          ...normalized,
          isDefault: shouldBeDefault,
        },
        include: {
          _count: { select: { linkedAccounts: true, repositories: true } },
        },
      });
    });

    this.logger.log(`Created ${normalized.provider} connection ${connection.id}${shouldBeDefault ? ' (default)' : ''}`);
    return this.sanitize(connection);
  }

  async update(id: string, data: UpdateConnectionDto) {
    const existing = await this.findRawOne(id);
    if (!existing) throw new NotFoundException(`Connection ${id} not found`);

    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) patch.name = data.name.trim();
    if (data.status !== undefined) patch.status = data.status;
    if (data.scopes !== undefined) patch.scopes = data.scopes;
    if (data.providerAccountName !== undefined) patch.providerAccountName = data.providerAccountName.trim();
    if (data.providerUrl !== undefined) patch.providerUrl = data.providerUrl;
    if (data.expiresAt !== undefined) patch.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    if (data.token) {
      if (existing.authMethod !== ConnectionAuthMethod.PAT) {
        throw new BadRequestException('Only PAT tokens can be rotated through this endpoint.');
      }

      const tokenMetadata = existing.provider === GitProvider.GitHub
        ? await this.buildGitHubConnectionMetadata(data.token, data.name ?? existing.name, data.expiresAt ?? undefined)
        : this.buildAzureDevOpsMetadata({
            name: data.name ?? existing.name,
            providerAccountName: data.providerAccountName ?? existing.providerAccountName,
            providerUrl: data.providerUrl ?? existing.providerUrl,
            expiresAt: data.expiresAt,
          });

      patch.providerAccountName = tokenMetadata.providerAccountName;
      patch.providerUrl = tokenMetadata.providerUrl;
      patch.scopes = tokenMetadata.scopes;
      patch.status = tokenMetadata.status;
      patch.secretToken = data.token;
      patch.secretLastFour = data.token.slice(-4);
      patch.expiresAt = tokenMetadata.expiresAt;
    }

    const connection = await this.prisma.client.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.connection.updateMany({
          where: { provider: existing.provider },
          data: { isDefault: false },
        });
        patch.isDefault = true;
      }

      return tx.connection.update({
        where: { id },
        data: patch,
        include: {
          _count: { select: { linkedAccounts: true, repositories: true } },
        },
      });
    });

    return this.sanitize(connection);
  }

  async remove(id: string) {
    const existing = await this.findRawOne(id);
    if (!existing) throw new NotFoundException(`Connection ${id} not found`);

    await this.prisma.client.$transaction(async (tx) => {
      await tx.connection.delete({ where: { id } });

      if (!existing.isDefault) {
        return;
      }

      const replacement = await tx.connection.findFirst({
        where: { provider: existing.provider },
        orderBy: { updatedAt: 'desc' },
      });

      if (replacement) {
        await tx.connection.update({
          where: { id: replacement.id },
          data: { isDefault: true },
        });
      }
    });
  }

  async resolveConnection(provider: GitProvider, repoFullName?: string) {
    if (repoFullName) {
      const linked = await this.prisma.client.linkedRepository.findFirst({
        where: { fullName: repoFullName, provider },
        include: { connection: true },
        orderBy: { updatedAt: 'desc' },
      });

      if (linked?.connection?.secretToken && this.isUsableStatus(linked.connection.status)) {
        return linked.connection;
      }
    }

    return this.prisma.client.connection.findFirst({
      where: {
        provider,
        secretToken: { not: null },
        status: { in: [AuthStatus.Active, AuthStatus.Expiring] },
      },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  private async findRawOne(id: string) {
    return this.prisma.client.connection.findUnique({
      where: { id },
      include: {
        _count: { select: { linkedAccounts: true, repositories: true } },
      },
    });
  }

  private sanitize(connection: any) {
    const { secretToken, secretLastFour, _count, ...rest } = connection;

    return {
      ...rest,
      scopes: rest.scopes ?? [],
      hasToken: Boolean(secretToken),
      tokenPreview: secretLastFour ? `••••${secretLastFour}` : undefined,
      repositoryCount: _count?.repositories ?? 0,
      linkedAccountCount: _count?.linkedAccounts ?? 0,
    };
  }

  private isUsableStatus(status: string) {
    return status === AuthStatus.Active || status === AuthStatus.Expiring;
  }

  private async normalizeCreateInput(data: CreateConnectionDto) {
    if (data.provider === GitProvider.GitHub) {
      return this.buildGitHubConnectionMetadata(data.token, data.name, data.expiresAt);
    }

    return this.buildAzureDevOpsMetadata(data);
  }

  private async buildGitHubConnectionMetadata(token: string, name: string, expiresAt?: string) {
    const octokit = new Octokit({ auth: token });
    const response = await octokit.request('GET /user');
    const scopesHeader = response.headers['x-oauth-scopes'];
    const scopes = typeof scopesHeader === 'string'
      ? scopesHeader.split(',').map((scope) => scope.trim()).filter(Boolean)
      : [];

    return {
      name: name.trim(),
      provider: GitProvider.GitHub,
      authMethod: ConnectionAuthMethod.PAT,
      providerAccountName: response.data.login,
      providerUrl: response.data.html_url,
      secretToken: token,
      secretLastFour: token.slice(-4),
      status: AuthStatus.Active,
      scopes,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };
  }

  private buildAzureDevOpsMetadata(data: {
    name: string;
    providerAccountName?: string;
    providerUrl?: string;
    token?: string;
    expiresAt?: string | null;
  }) {
    const providerUrl = data.providerUrl?.trim();
    const providerAccountName = data.providerAccountName?.trim() ?? this.extractAzureAccountName(providerUrl);

    if (!providerUrl) {
      throw new BadRequestException('Azure DevOps connections require an organization URL.');
    }

    if (!providerAccountName) {
      throw new BadRequestException('Azure DevOps connections require an organization name or URL Trooper can parse.');
    }

    return {
      name: data.name.trim(),
      provider: GitProvider.AzureRepos,
      authMethod: ConnectionAuthMethod.PAT,
      providerAccountName,
      providerUrl,
      secretToken: data.token,
      secretLastFour: data.token?.slice(-4),
      status: AuthStatus.Active,
      scopes: [],
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    };
  }

  private extractAzureAccountName(providerUrl?: string) {
    if (!providerUrl) return undefined;

    try {
      const url = new URL(providerUrl);
      if (url.hostname === 'dev.azure.com') {
        const [organization] = url.pathname.split('/').filter(Boolean);
        return organization;
      }

      return url.hostname.split('.')[0];
    } catch {
      return undefined;
    }
  }
}
