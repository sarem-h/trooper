import { Module } from '@nestjs/common';
import { PullRequestsController } from './pull-requests.controller';
import { PullRequestsService } from './pull-requests.service';

@Module({
  controllers: [PullRequestsController],
  providers: [PullRequestsService],
})
export class PullRequestsModule {}
