import { Injectable, Logger } from '@nestjs/common';
import { ScmRegistry } from '../scm';
import type { ScmSecurityAlert } from '../scm/scm.types';
import type { TaskContext } from '@trooper/shared';
import type { SecuritySeverity } from '../scm/scm.types';

export interface SecuritySummary {
  totalAlerts: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  alerts: ScmSecurityAlert[];
}

export interface BatchDraftRequest {
  repoFullName: string;
  minSeverity?: SecuritySeverity;
  alertTypes?: string[];
  maxAlerts?: number;
}

export interface BatchDraftResult {
  totalAlerts: number;
  drafted: number;
  contexts: TaskContext[];
}

@Injectable()
export class SecurityAnalysisService {
  private readonly logger = new Logger(SecurityAnalysisService.name);

  constructor(private readonly scm: ScmRegistry) {}

  async getSecuritySummary(repoFullName: string): Promise<SecuritySummary> {
    const provider = this.scm.resolveForRepo(repoFullName);
    const caps = this.scm.getCapabilities(provider.providerType);

    if (!caps.security) {
      return { totalAlerts: 0, critical: 0, high: 0, medium: 0, low: 0, alerts: [] };
    }

    const alerts = await provider.listSecurityAlerts(repoFullName);

    return {
      totalAlerts: alerts.length,
      critical: alerts.filter((a) => a.severity === 'critical').length,
      high: alerts.filter((a) => a.severity === 'high').length,
      medium: alerts.filter((a) => a.severity === 'medium').length,
      low: alerts.filter((a) => a.severity === 'low').length,
      alerts,
    };
  }

  alertToTaskContext(repoFullName: string, alert: ScmSecurityAlert): TaskContext {
    return {
      type: 'security',
      repositoryFullName: repoFullName,
      refNumber: alert.id,
      title: alert.title,
      body: alert.description,
      alertType: alert.alertType,
      severity: alert.severity,
      affectedComponent: alert.affectedComponent,
    };
  }

  /**
   * Batch-prepare security alert contexts for auto-drafting.
   * Filters by severity threshold and alert types.
   */
  async prepareBatchDraft(req: BatchDraftRequest): Promise<BatchDraftResult> {
    const severityOrder: SecuritySeverity[] = ['critical', 'high', 'medium', 'low', 'info'];
    const minIdx = req.minSeverity ? severityOrder.indexOf(req.minSeverity) : 1; // default: high+

    const summary = await this.getSecuritySummary(req.repoFullName);
    let filtered = summary.alerts.filter((a) => {
      const idx = severityOrder.indexOf(a.severity);
      return idx >= 0 && idx <= minIdx;
    });

    if (req.alertTypes?.length) {
      filtered = filtered.filter((a) => req.alertTypes!.includes(a.alertType));
    }

    const max = req.maxAlerts ?? 10;
    const selected = filtered.slice(0, max);

    const contexts = selected.map((a) => this.alertToTaskContext(req.repoFullName, a));

    this.logger.log(
      `Batch security draft: ${summary.totalAlerts} total → ${filtered.length} matching → ${selected.length} selected for ${req.repoFullName}`,
    );

    return {
      totalAlerts: summary.totalAlerts,
      drafted: selected.length,
      contexts,
    };
  }
}
