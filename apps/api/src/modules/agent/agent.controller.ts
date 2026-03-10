import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { AgentService } from './agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('runs')
  findAllRuns() {
    return this.agentService.findAllRuns();
  }

  @Get('runs/:id')
  findOneRun(@Param('id') id: string) {
    return this.agentService.findOneRun(id);
  }

  @Post('runs')
  createRun(@Body() dto: { workItemId: string; branchName?: string }) {
    return this.agentService.createRun(dto);
  }

  @Put('runs/:id')
  updateRun(@Param('id') id: string, @Body() dto: any) {
    return this.agentService.updateRun(id, dto);
  }

  @Get('runs/:runId/steps')
  findSteps(@Param('runId') runId: string) {
    return this.agentService.findStepsByRun(runId);
  }

  @Post('runs/:runId/steps')
  createStep(@Param('runId') runId: string, @Body() dto: { type: string; label: string; detail?: string; durationMs?: number }) {
    return this.agentService.createStep({ ...dto, runId });
  }
}
