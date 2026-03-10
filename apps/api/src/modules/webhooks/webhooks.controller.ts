import { Controller, Get, Post, Put, Delete, Param, Body, Headers, Logger, HttpCode, RawBodyRequest, Req } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';
import { PipelineService } from '../pipeline/pipeline.service';
import type { Request } from 'express';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly pipeline: PipelineService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  findAll() { return this.webhooksService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.webhooksService.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.webhooksService.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.webhooksService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.webhooksService.remove(id); }

  // ─── Inbound webhook receiver ──────────────────────────────

  /**
   * POST /api/webhooks/receive
   * Receives GitHub webhook events with HMAC-SHA256 verification.
   * Currently handles: issues.opened → auto-trigger pipeline
   */
  @Post('receive')
  @HttpCode(200)
  async receive(
    @Headers('x-hub-signature-256') signature: string | undefined,
    @Headers('x-github-event') event: string | undefined,
    @Headers('x-github-delivery') deliveryId: string | undefined,
    @Body() payload: any,
  ) {
    this.logger.log(`Webhook received: event=${event}, delivery=${deliveryId}`);

    // Verify HMAC signature if webhook secret is configured
    const secret = this.config.get<string>('GITHUB_WEBHOOK_SECRET');
    if (secret && signature) {
      const expected = 'sha256=' + createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');
      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expected);
      if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
        this.logger.warn(`Webhook signature mismatch for delivery ${deliveryId}`);
        return { status: 'rejected', reason: 'invalid signature' };
      }
    }

    // Route by event type
    if (event === 'issues' && payload.action === 'opened') {
      return this.handleIssueOpened(payload);
    }

    // Unhandled event — acknowledge
    this.logger.log(`Ignoring unhandled event: ${event}.${payload.action ?? ''}`);
    return { status: 'ignored', event };
  }

  private async handleIssueOpened(payload: any) {
    const issue = payload.issue;
    const repo = payload.repository;
    if (!issue || !repo) {
      return { status: 'ignored', reason: 'missing issue or repo in payload' };
    }

    const repoFullName = repo.full_name;
    const query = `GitHub Issue #${issue.number}: ${issue.title}\n\n${issue.body ?? ''}`;

    this.logger.log(`Auto-triggering pipeline for issue #${issue.number} on ${repoFullName}`);

    const result = await this.pipeline.trigger({
      repositoryFullName: repoFullName,
      userQuery: query,
    });

    return {
      status: 'triggered',
      runId: result.runId,
      issue: issue.number,
      repo: repoFullName,
    };
  }
}
