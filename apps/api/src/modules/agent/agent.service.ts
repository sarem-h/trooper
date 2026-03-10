import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Agent Runs ──

  async findAllRuns() {
    return this.prisma.client.agentRun.findMany({
      include: { steps: true, workItem: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOneRun(id: string) {
    const run = await this.prisma.client.agentRun.findUnique({
      where: { id },
      include: { steps: { orderBy: { timestamp: 'asc' } }, workItem: true },
    });
    if (!run) throw new NotFoundException(`AgentRun ${id} not found`);
    return run;
  }

  async createRun(data: { workItemId: string; branchName?: string }) {
    return this.prisma.client.agentRun.create({ data });
  }

  async updateRun(id: string, data: Partial<{ status: string; branchName: string; prId: string; completedAt: string }>) {
    await this.findOneRun(id);
    return this.prisma.client.agentRun.update({ where: { id }, data });
  }

  // ── Agent Steps ──

  async findStepsByRun(runId: string) {
    return this.prisma.client.agentStep.findMany({
      where: { runId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async createStep(data: { runId: string; type: string; label: string; detail?: string; durationMs?: number }) {
    return this.prisma.client.agentStep.create({ data });
  }
}
