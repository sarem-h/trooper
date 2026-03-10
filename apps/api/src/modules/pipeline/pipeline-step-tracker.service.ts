import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { AgentRunStatus, AgentStepType, PipelineStage } from '@trooper/shared';

@Injectable()
export class PipelineStepTracker {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  async addStep(
    runId: string,
    stage: PipelineStage,
    type: AgentStepType,
    label: string,
    detail: string | null,
    order: number,
    status: string = 'completed',
  ) {
    const step = await this.prisma.client.agentStep.create({
      data: {
        runId,
        type,
        status,
        label: `[${stage}] ${label}`,
        detail,
        order,
      },
    });
    this.events.emit(`pipeline.step`, { runId, step });
  }

  async updateStepStatus(
    runId: string,
    stage: PipelineStage,
    status: string,
    detail?: string,
  ) {
    const step = await this.prisma.client.agentStep.findFirst({
      where: { runId, label: { startsWith: `[${stage}]` } },
      orderBy: { order: 'desc' },
    });
    if (step) {
      const durationMs = status !== 'running'
        ? Math.round(Date.now() - step.timestamp.getTime())
        : undefined;
      const updated = await this.prisma.client.agentStep.update({
        where: { id: step.id },
        data: { status, ...(detail ? { detail } : {}), ...(durationMs ? { durationMs } : {}) },
      });
      this.events.emit(`pipeline.step`, { runId, step: updated });
    }
  }

  async failRun(runId: string, error: string) {
    await this.prisma.client.agentRun.update({
      where: { id: runId },
      data: {
        status: AgentRunStatus.Failed,
        error,
        completedAt: new Date(),
      },
    });
    this.events.emit('pipeline.run', { runId, status: AgentRunStatus.Failed });

    const runningStep = await this.prisma.client.agentStep.findFirst({
      where: { runId, status: 'running' },
      orderBy: { order: 'desc' },
    });
    if (runningStep) {
      const updated = await this.prisma.client.agentStep.update({
        where: { id: runningStep.id },
        data: { status: 'failed', detail: error },
      });
      this.events.emit('pipeline.step', { runId, step: updated });
    }
  }
}
