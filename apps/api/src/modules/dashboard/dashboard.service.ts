import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [
      pendingWorkItems,
      activeRuns,
      openPRs,
      recentRuns,
      totalMasked,
    ] = await Promise.all([
      this.prisma.client.workItem.count({ where: { status: 'pending' } }),
      this.prisma.client.agentRun.count({ where: { status: { in: ['running', 'queued'] } } }),
      this.prisma.client.pullRequest.count({ where: { status: 'open' } }),
      this.prisma.client.agentRun.findMany({
        take: 10,
        orderBy: { startedAt: 'desc' },
        include: { workItem: { select: { title: true } } },
      }),
      this.prisma.client.maskingAuditEntry.aggregate({ _sum: { matchCount: true } }),
    ]);

    return {
      kpis: {
        pendingWorkItems,
        activeRuns,
        openPRs,
        secretsMasked: totalMasked._sum.matchCount ?? 0,
      },
      recentRuns,
    };
  }
}
