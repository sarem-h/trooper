import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { PullRequestsService } from './pull-requests.service';

@Controller('pull-requests')
export class PullRequestsController {
  constructor(private readonly prService: PullRequestsService) {}

  @Get()
  findAll() {
    return this.prService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prService.findOne(id);
  }

  @Post()
  create(@Body() dto: {
    azurePRId: number;
    title: string;
    sourceBranch: string;
    targetBranch: string;
    workItemId: string;
    runId: string;
    url: string;
    reviewerAlias?: string;
  }) {
    return this.prService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.prService.update(id, dto);
  }
}
