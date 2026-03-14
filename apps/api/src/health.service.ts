import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getLiveness() {
    return {
      status: 'ok',
      service: 'trooper-api',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  async getReadiness() {
    await this.prisma.client.$queryRawUnsafe('SELECT 1');

    return {
      status: 'ready',
      checks: {
        database: 'up',
      },
      timestamp: new Date().toISOString(),
    };
  }
}