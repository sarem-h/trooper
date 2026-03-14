import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { AgentModule } from './modules/agent/agent.module';
import { WorkItemsModule } from './modules/work-items/work-items.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { PullRequestsModule } from './modules/pull-requests/pull-requests.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RepositoriesModule } from './modules/repositories/repositories.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { MaskingModule } from './modules/masking/masking.module';
import { IndexingModule } from './modules/indexing/indexing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { McpModule } from './modules/mcp/mcp.module';
import { LlmModule } from './modules/llm/llm.module';
import { CopilotModule } from './modules/copilot/copilot.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
    PrismaModule,
    AgentModule,
    WorkItemsModule,
    ConnectionsModule,
    PullRequestsModule,
    AccountsModule,
    RepositoriesModule,
    WebhooksModule,
    MaskingModule,
    IndexingModule,
    DashboardModule,
    PipelineModule,
    McpModule,
    LlmModule,
    CopilotModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule {}
