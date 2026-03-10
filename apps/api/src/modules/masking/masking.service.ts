import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MaskingService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Masking Rules ──

  async findAllRules() {
    return this.prisma.client.maskingRule.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async createRule(data: { pattern: string; description: string; enabled?: boolean; builtIn?: boolean; regex?: string }) {
    return this.prisma.client.maskingRule.create({ data });
  }

  async updateRule(id: string, data: Partial<{ enabled: boolean; pattern: string; description: string; regex: string | null }>) {
    const rule = await this.prisma.client.maskingRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException(`MaskingRule ${id} not found`);
    return this.prisma.client.maskingRule.update({ where: { id }, data });
  }

  async removeRule(id: string) {
    const rule = await this.prisma.client.maskingRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException(`MaskingRule ${id} not found`);
    return this.prisma.client.maskingRule.delete({ where: { id } });
  }

  // ── Masking Audit ──

  async findAllAudit() {
    return this.prisma.client.maskingAuditEntry.findMany({ orderBy: { timestamp: 'desc' } });
  }

  async createAuditEntry(data: { runId: string; pattern: string; matchCount: number; filesAffected: string[] }) {
    return this.prisma.client.maskingAuditEntry.create({ data });
  }
}
