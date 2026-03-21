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

  async getTasks(statusFilter?: string) {
    // Normalize the status filter into an array of allowed statuses
    const statusList = statusFilter
      ? statusFilter.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    const [workItems, standaloneRuns] = await Promise.all([
      // All work items with their latest run and PR
      this.prisma.client.workItem.findMany({
        where: statusList ? { status: { in: statusList } } : undefined,
        orderBy: { updatedAt: 'desc' },
        include: {
          agentRuns: {
            orderBy: { startedAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              startedAt: true,
              completedAt: true,
              branchName: true,
              userQuery: true,
              planSummary: true,
              steps: {
                orderBy: { timestamp: 'desc' },
                take: 1,
                select: { label: true, timestamp: true },
              },
            },
          },
          pullRequests: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, prNumber: true, status: true, url: true },
          },
        },
      }),
      // Agent runs NOT linked to any work item (ad-hoc / manual triggers)
      this.prisma.client.agentRun.findMany({
        where: {
          workItemId: null,
          ...(statusList ? { status: { in: statusList } } : {}),
        },
        orderBy: { startedAt: 'desc' },
        include: {
          steps: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            select: { label: true, timestamp: true },
          },
          pullRequests: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, prNumber: true, status: true, url: true },
          },
        },
      }),
    ]);

    // Normalise into a unified shape
    const tasks: Array<{
      type: 'work-item' | 'run';
      id: string;
      title: string;
      status: string;
      source: string;
      repository: string | null;
      lastActivity: string;
      summary: string | null;
      branchName: string | null;
      latestSignal: string | null;
      latestSignalAt: string | null;
      workItemNumber: number | null;
      linkedRun: { id: string; status: string } | null;
      linkedPR: { number: number | null; status: string; url: string } | null;
    }> = [];

    for (const wi of workItems) {
      const run = wi.agentRuns[0] ?? null;
      const pr = wi.pullRequests[0] ?? null;
      tasks.push({
        type: 'work-item',
        id: wi.id,
        title: wi.title,
        status: run ? run.status : wi.status,
        source: 'azure-devops',
        repository: wi.repositoryFullName ?? null,
        lastActivity: wi.updatedAt.toISOString(),
        summary: wi.userQuery ?? wi.description ?? run?.planSummary ?? null,
        branchName: run?.branchName ?? wi.targetBranch ?? null,
        latestSignal: run?.steps[0]?.label ?? run?.planSummary ?? null,
        latestSignalAt: run?.steps[0]?.timestamp?.toISOString?.() ?? run?.completedAt?.toISOString?.() ?? run?.startedAt?.toISOString?.() ?? wi.updatedAt.toISOString(),
        workItemNumber: wi.azureId,
        linkedRun: run ? { id: run.id, status: run.status } : null,
        linkedPR: pr ? { number: pr.prNumber, status: pr.status, url: pr.url } : null,
      });
    }

    for (const run of standaloneRuns) {
      const pr = run.pullRequests[0] ?? null;
      tasks.push({
        type: 'run',
        id: run.id,
        title: run.userQuery ?? 'Untitled task',
        status: run.status,
        source: 'manual',
        repository: run.repositoryFullName ?? null,
        lastActivity: (run.completedAt ?? run.startedAt).toISOString(),
        summary: run.planSummary ?? run.userQuery ?? null,
        branchName: run.branchName ?? null,
        latestSignal: run.steps[0]?.label ?? run.planSummary ?? null,
        latestSignalAt: run.steps[0]?.timestamp?.toISOString?.() ?? (run.completedAt ?? run.startedAt).toISOString(),
        workItemNumber: null,
        linkedRun: { id: run.id, status: run.status },
        linkedPR: pr ? { number: pr.prNumber, status: pr.status, url: pr.url } : null,
      });
    }

    // Sort all by lastActivity descending
    tasks.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());

    return tasks;
  }
}
