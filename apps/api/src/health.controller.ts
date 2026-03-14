import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('health/ready')
  async getReadiness() {
    try {
      return await this.healthService.getReadiness();
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        checks: {
          database: 'down',
        },
        message: error instanceof Error ? error.message : 'Readiness checks failed',
      });
    }
  }
}