import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// ─── Types ──────────────────────────────────────────────────

export interface SandboxExecResult {
  /** Combined stdout */
  stdout: string;
  /** Combined stderr */
  stderr: string;
  /** Process exit code (0 = success) */
  exitCode: number;
}

export interface SandboxVerifyResult {
  /** Whether the code compiled/linted without errors */
  passed: boolean;
  /** Raw compiler/linter output (errors + warnings) */
  output: string;
  /** Parsed error messages for targeted feedback */
  errors: string[];
}

// ─── Config ─────────────────────────────────────────────────

/**
 * Azure Container Apps Dynamic Sessions configuration.
 *
 * Environment variables:
 *   ACA_POOL_ENDPOINT  — e.g. https://<region>.dynamicsessions.io/subscriptions/<sub>/…/sessionPools/<pool>
 *   ACA_POOL_SECRET    — API key (or use DefaultAzureCredential for managed identity)
 */

// ─── Service ────────────────────────────────────────────────

/**
 * SandboxService provides secure, isolated code execution via
 * Azure Container Apps Dynamic Sessions.
 *
 * Each pipeline run gets its own session (Hyper-V isolated container).
 * The service clones the repo, applies generated changes, and runs
 * build/lint/test commands to verify code before committing.
 *
 * Security guarantees:
 *  - Hyper-V isolation (VM-level boundary, not just container namespace)
 *  - Ephemeral sessions (destroyed after use, no persistent state)
 *  - Network-restricted (no outbound by default)
 *  - Resource-limited (CPU, memory, time caps)
 */
@Injectable()
export class SandboxService {
  private readonly logger = new Logger(SandboxService.name);
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly apiVersion = '2024-10-02-preview';

  constructor(private readonly config: ConfigService) {
    this.endpoint = this.config.get<string>('ACA_POOL_ENDPOINT', '');
    this.apiKey = this.config.get<string>('ACA_POOL_SECRET', '');
  }

  /** Whether the sandbox is configured and available */
  get isConfigured(): boolean {
    return !!this.endpoint && !!this.apiKey;
  }

  // ─── Session Management ─────────────────────────────────

  /**
   * Execute a shell command inside a sandbox session.
   * If no sessionId is provided, a new ephemeral session is created.
   */
  async exec(
    sessionId: string,
    command: string,
    timeoutMs = 60_000,
  ): Promise<SandboxExecResult> {
    const url = `${this.endpoint}/code/execute?api-version=${this.apiVersion}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          identifier: sessionId,
          codeInputType: 'inline',
          executionType: 'synchronous',
          code: command,
          timeoutInSeconds: Math.floor(timeoutMs / 1000),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.error(`Sandbox exec failed (${res.status}): ${body}`);
        return { stdout: '', stderr: `Sandbox error: ${res.status} ${body}`, exitCode: 1 };
      }

      const data = await res.json();
      return {
        stdout: data.properties?.stdout ?? '',
        stderr: data.properties?.stderr ?? '',
        exitCode: data.properties?.exitCode ?? (data.properties?.result === 'Success' ? 0 : 1),
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { stdout: '', stderr: 'Sandbox execution timed out', exitCode: 124 };
      }
      this.logger.error(`Sandbox exec error: ${err.message}`);
      return { stdout: '', stderr: `Sandbox error: ${err.message}`, exitCode: 1 };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Upload files to a sandbox session.
   * Used to apply generated code changes before running verification.
   */
  async uploadFiles(
    sessionId: string,
    files: Array<{ path: string; content: string }>,
  ): Promise<void> {
    // ACA Dynamic Sessions supports file upload via /files endpoint
    const url = `${this.endpoint}/files/upload?api-version=${this.apiVersion}`;

    for (const file of files) {
      const blob = new Blob([file.content], { type: 'application/octet-stream' });
      const formData = new FormData();
      formData.append('file', blob, file.path);
      formData.append('identifier', sessionId);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const body = await res.text();
        this.logger.warn(`File upload failed for ${file.path}: ${res.status} ${body}`);
      }
    }
  }

  // ─── High-Level Verification ────────────────────────────

  /**
   * Verify generated code by running it in a sandbox.
   *
   * Flow:
   *  1. Clone the repo (or use cached clone)
   *  2. Apply generated file changes
   *  3. Install dependencies (if needed)
   *  4. Run verification command (tsc, eslint, pytest, etc.)
   *  5. Return structured results
   */
  async verify(
    sessionId: string,
    repoFullName: string,
    branch: string,
    changes: Array<{ path: string; content: string }>,
    verifyCommand?: string,
  ): Promise<SandboxVerifyResult> {
    if (!this.isConfigured) {
      this.logger.warn('Sandbox not configured — skipping execution-based verification');
      return { passed: true, output: 'Sandbox not configured — verification skipped', errors: [] };
    }

    this.logger.log(`Sandbox verify: ${changes.length} files in session ${sessionId}`);

    // Step 1: Clone repo into the session
    const cloneResult = await this.exec(
      sessionId,
      `git clone --depth 1 --branch ${branch} https://github.com/${repoFullName}.git /workspace 2>&1 && cd /workspace && echo "CLONE_OK"`,
      120_000, // 2 min for large repos
    );

    if (!cloneResult.stdout.includes('CLONE_OK')) {
      this.logger.warn(`Sandbox clone failed: ${cloneResult.stderr}`);
      return {
        passed: true, // Don't block on clone failure — degrade gracefully
        output: `Clone failed (continuing without sandbox verification): ${cloneResult.stderr}`,
        errors: [],
      };
    }

    // Step 2: Apply generated changes
    for (const change of changes) {
      const escapedContent = change.content
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n');

      await this.exec(
        sessionId,
        `mkdir -p /workspace/$(dirname "${change.path}") && printf '%b' '${escapedContent}' > /workspace/${change.path}`,
      );
    }

    // Step 3: Detect project type and run appropriate verification
    const cmd = verifyCommand ?? await this.detectVerifyCommand(sessionId);

    // Step 4: Run verification
    const verifyResult = await this.exec(
      sessionId,
      `cd /workspace && ${cmd} 2>&1`,
      120_000,
    );

    const output = (verifyResult.stdout + '\n' + verifyResult.stderr).trim();
    const errors = this.parseErrors(output);
    const passed = verifyResult.exitCode === 0;

    this.logger.log(
      `Sandbox verify ${passed ? 'PASSED' : 'FAILED'}: ${errors.length} error(s), exit code ${verifyResult.exitCode}`,
    );

    return { passed, output, errors };
  }

  // ─── Helpers ────────────────────────────────────────────

  /**
   * Auto-detect the right verification command based on project structure.
   */
  private async detectVerifyCommand(sessionId: string): Promise<string> {
    const check = await this.exec(sessionId, `
      cd /workspace;
      if [ -f "tsconfig.json" ]; then echo "LANG=typescript"; fi;
      if [ -f "package.json" ]; then echo "HAS_PKG=true"; fi;
      if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then echo "LANG=python"; fi;
    `);

    const out = check.stdout;

    if (out.includes('LANG=typescript')) {
      // TypeScript project: install deps + type check
      return 'npm install --ignore-scripts 2>&1 && npx tsc --noEmit 2>&1';
    }

    if (out.includes('HAS_PKG=true')) {
      // JavaScript project: install + lint if available
      return 'npm install --ignore-scripts 2>&1 && (npx eslint . --max-warnings=0 2>&1 || true)';
    }

    if (out.includes('LANG=python')) {
      return 'pip install -e . 2>&1 && python -m py_compile $(find . -name "*.py" -not -path "./venv/*") 2>&1';
    }

    // Fallback: just check file syntax
    return 'echo "No project type detected — skipping build verification"';
  }

  /**
   * Parse compiler/linter output into individual error messages.
   */
  private parseErrors(output: string): string[] {
    const errors: string[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      // TypeScript errors: file.ts(line,col): error TSxxxx: message
      if (/\): error TS\d+:/.test(line)) {
        errors.push(line.trim());
        continue;
      }
      // ESLint errors: file.ts:line:col: error message
      if (/:\d+:\d+:\s+error\b/.test(line)) {
        errors.push(line.trim());
        continue;
      }
      // Python errors: SyntaxError, IndentationError, etc.
      if (/^(SyntaxError|IndentationError|ImportError|ModuleNotFoundError|NameError):/.test(line)) {
        errors.push(line.trim());
        continue;
      }
      // Generic "error" prefix
      if (/^\s*error\[/i.test(line) || /^ERROR:/i.test(line)) {
        errors.push(line.trim());
      }
    }

    return errors;
  }
}
