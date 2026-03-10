import { Module, Global } from '@nestjs/common';
import { LlmService } from './llm.service';
import { ExecutionOrchestratorService } from './execution-orchestrator.service';
import { SandboxService } from './sandbox.service';

/**
 * LLM Module
 *
 * Provides the LLM service (Azure AI Foundry wrapper), the
 * Execution Orchestrator (multi-agent planning + parallel code gen),
 * and the Sandbox service (Azure Container Apps Dynamic Sessions
 * for secure code execution and verification).
 */
@Global()
@Module({
  providers: [LlmService, ExecutionOrchestratorService, SandboxService],
  exports: [LlmService, ExecutionOrchestratorService, SandboxService],
})
export class LlmModule {}
