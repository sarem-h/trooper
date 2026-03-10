import { Controller, Post, Get, Body, UsePipes, Logger } from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CopilotQuerySchema, CopilotAskSchema } from '@trooper/shared';
import type { CopilotQuery, CopilotCardResponse, CopilotModelOption } from '@trooper/shared';

@Controller('copilot')
export class CopilotController {
  private readonly logger = new Logger(CopilotController.name);

  constructor(private readonly copilot: CopilotService) {}

  @Get('models')
  async models(): Promise<CopilotModelOption[]> {
    return this.copilot.listModels();
  }

  /**
   * POST /api/copilot/summarize
   * Fast metadata-only analysis using the worker model.
   */
  @Post('summarize')
  @UsePipes(new ZodValidationPipe(CopilotQuerySchema))
  async summarize(@Body() dto: CopilotQuery): Promise<CopilotCardResponse> {
    this.logger.log(`Copilot summarize: ${dto.type} #${dto.refNumber} in ${dto.repositoryFullName}`);
    return this.copilot.summarize(dto);
  }

  /**
   * POST /api/copilot/ground
   * Deep RAG-enriched analysis using the thinker model.
   */
  @Post('ground')
  @UsePipes(new ZodValidationPipe(CopilotQuerySchema))
  async ground(@Body() dto: CopilotQuery): Promise<CopilotCardResponse> {
    this.logger.log(`Copilot ground: ${dto.type} #${dto.refNumber} in ${dto.repositoryFullName}`);
    return this.copilot.ground(dto, dto.branch ?? 'main');
  }

  /**
   * POST /api/copilot/ask
   * Single-turn follow-up Q&A.
   */
  @Post('ask')
  @UsePipes(new ZodValidationPipe(CopilotAskSchema))
  async ask(
    @Body() dto: CopilotQuery & { question: string; priorSummary: string },
  ): Promise<{ answerMarkdown: string }> {
    this.logger.log(`Copilot ask: ${dto.type} #${dto.refNumber} — "${dto.question.slice(0, 60)}"`);
    return this.copilot.ask(dto, dto.question, dto.priorSummary);
  }
}
