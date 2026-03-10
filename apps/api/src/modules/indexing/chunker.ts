/**
 * Code-aware chunker for RAG indexing.
 *
 * Uses regex-based heuristics to split source files at function/class/method
 * boundaries. Falls back to a sliding window for unknown languages or
 * unstructured files (markdown, config, etc.).
 */

export interface CodeChunk {
  /** 0-based chunk index within the file */
  chunkIndex: number;
  /** The chunk text */
  content: string;
  /** Detected symbol name (function, class, method) or null */
  symbolName: string | null;
  /** Programming language (from file extension) */
  language: string;
  /** Approximate token count (chars / 4 heuristic) */
  tokenCount: number;
}

export type ContentType = 'code' | 'docs' | 'config' | 'infra' | 'tests' | 'other';

// ─── Language detection ─────────────────────────────────────

const EXT_TO_LANGUAGE: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
  py: 'python', go: 'go', rs: 'rust', cs: 'csharp', java: 'java',
  rb: 'ruby', php: 'php', swift: 'swift', kt: 'kotlin', scala: 'scala',
  c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp',
  md: 'markdown', json: 'json', yaml: 'yaml', yml: 'yaml',
  html: 'html', css: 'css', scss: 'scss', sql: 'sql',
  sh: 'shell', bash: 'shell', zsh: 'shell', ps1: 'powershell',
  prisma: 'prisma', graphql: 'graphql', proto: 'protobuf',
  dockerfile: 'dockerfile', toml: 'toml', xml: 'xml',
};

export function detectLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  const basename = filePath.split('/').pop()?.toLowerCase() ?? '';
  if (basename === 'dockerfile') return 'dockerfile';
  if (basename === 'makefile') return 'makefile';
  return EXT_TO_LANGUAGE[ext] ?? 'text';
}

export function detectContentType(filePath: string): ContentType {
  const normalized = filePath.toLowerCase();
  const fileName = normalized.split('/').pop() ?? normalized;

  if (
    normalized.includes('/test/') ||
    normalized.includes('/tests/') ||
    normalized.includes('/__tests__/') ||
    /\.(spec|test)\.[^./]+$/.test(fileName)
  ) {
    return 'tests';
  }

  if (
    fileName === 'readme.md' ||
    fileName === 'architecture.md' ||
    normalized.includes('/docs/') ||
    normalized.includes('/adr/') ||
    normalized.includes('/adrs/') ||
    /\.(md|mdx|txt|rst)$/.test(fileName)
  ) {
    return 'docs';
  }

  if (
    fileName === 'dockerfile' ||
    fileName.startsWith('dockerfile.') ||
    normalized.includes('.github/workflows/') ||
    normalized.includes('/helm/') ||
    normalized.includes('/k8s/') ||
    normalized.includes('/kubernetes/') ||
    /(^|\/)(compose|docker-compose)\.(yml|yaml)$/.test(normalized) ||
    /\.(tf|tfvars|hcl)$/.test(fileName)
  ) {
    return 'infra';
  }

  if (
    fileName === 'package.json' ||
    fileName === 'tsconfig.json' ||
    fileName === 'turbo.json' ||
    fileName === 'pnpm-workspace.yaml' ||
    fileName === 'prisma.config.ts' ||
    fileName.startsWith('.env') ||
    /\.(json|ya?ml|toml|ini|conf|config|properties)$/.test(fileName)
  ) {
    return 'config';
  }

  const language = detectLanguage(filePath);
  if (language !== 'text' && language !== 'markdown' && language !== 'json' && language !== 'yaml') {
    return 'code';
  }

  return 'other';
}

// ─── File exclusion ─────────────────────────────────────────

const SKIP_PATTERNS = [
  /node_modules\//,
  /\.git\//,
  /dist\//,
  /build\//,
  /\.next\//,
  /coverage\//,
  /\.turbo\//,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /\.min\.(js|css)$/,
  /\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|mp4|mp3|pdf|zip|tar|gz)$/i,
  /\.map$/,
  /generated\//,
];

export function shouldIndex(filePath: string): boolean {
  return !SKIP_PATTERNS.some((p) => p.test(filePath));
}

// ─── AST-aware boundary detection ───────────────────────────

/**
 * Regex patterns that detect top-level declaration boundaries.
 * Each match group captures the symbol name.
 */
const BOUNDARY_PATTERNS: Record<string, RegExp[]> = {
  typescript: [
    /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/m,
    /^(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/m,
    /^(?:export\s+)?interface\s+(\w+)/m,
    /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=/m,
    /^(?:export\s+)?enum\s+(\w+)/m,
    /^(?:export\s+)?type\s+(\w+)/m,
  ],
  javascript: [
    /^(?:export\s+)?(?:async\s+)?function\s+(\w+)/m,
    /^(?:export\s+)?class\s+(\w+)/m,
    /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=/m,
  ],
  python: [
    /^(?:async\s+)?def\s+(\w+)/m,
    /^class\s+(\w+)/m,
  ],
  go: [
    /^func\s+(?:\([^)]+\)\s+)?(\w+)/m,
    /^type\s+(\w+)\s+struct/m,
    /^type\s+(\w+)\s+interface/m,
  ],
  rust: [
    /^(?:pub\s+)?(?:async\s+)?fn\s+(\w+)/m,
    /^(?:pub\s+)?struct\s+(\w+)/m,
    /^(?:pub\s+)?enum\s+(\w+)/m,
    /^(?:pub\s+)?trait\s+(\w+)/m,
    /^impl(?:<[^>]*>)?\s+(\w+)/m,
  ],
  csharp: [
    /^(?:public|private|protected|internal)?\s*(?:static\s+)?(?:async\s+)?(?:\w+\s+)+(\w+)\s*\(/m,
    /^(?:public|private|protected|internal)?\s*(?:abstract\s+)?class\s+(\w+)/m,
    /^(?:public|private|protected|internal)?\s*interface\s+(\w+)/m,
  ],
  java: [
    /^(?:public|private|protected)?\s*(?:static\s+)?(?:\w+\s+)+(\w+)\s*\(/m,
    /^(?:public|private|protected)?\s*(?:abstract\s+)?class\s+(\w+)/m,
    /^(?:public|private|protected)?\s*interface\s+(\w+)/m,
  ],
};

// ─── Chunking logic ─────────────────────────────────────────

const MAX_CHUNK_CHARS = 2000; // ~500 tokens
const OVERLAP_CHARS = 400;    // ~100 tokens overlap

/**
 * Chunk a source file into segments.
 * - For supported languages: split at function/class/method boundaries.
 * - For other files: sliding window with overlap.
 */
export function chunkFile(filePath: string, content: string): CodeChunk[] {
  const language = detectLanguage(filePath);
  const patterns = BOUNDARY_PATTERNS[language];

  if (patterns && content.length > MAX_CHUNK_CHARS) {
    return chunkByBoundaries(content, language, patterns);
  }

  // Small files or unsupported languages → sliding window (or single chunk)
  if (content.length <= MAX_CHUNK_CHARS) {
    return [{
      chunkIndex: 0,
      content,
      symbolName: null,
      language,
      tokenCount: estimateTokens(content),
    }];
  }

  return chunkSlidingWindow(content, language);
}

function chunkByBoundaries(
  content: string,
  language: string,
  patterns: RegExp[],
): CodeChunk[] {
  const lines = content.split('\n');
  // Find line indices that start a new declaration
  const boundaries: Array<{ line: number; symbol: string }> = [];

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of patterns) {
      const match = lines[i].match(pattern);
      if (match) {
        boundaries.push({ line: i, symbol: match[1] ?? 'anonymous' });
        break; // one match per line
      }
    }
  }

  if (boundaries.length === 0) {
    return chunkSlidingWindow(content, language);
  }

  const chunks: CodeChunk[] = [];
  let chunkIndex = 0;

  for (let b = 0; b < boundaries.length; b++) {
    const start = b === 0 ? 0 : boundaries[b].line;
    const end = b + 1 < boundaries.length ? boundaries[b + 1].line : lines.length;
    let chunkContent = lines.slice(start, end).join('\n');

    // If the first boundary doesn't start at line 0, include the preamble (imports, etc.)
    if (b === 0 && boundaries[0].line > 0) {
      const preamble = lines.slice(0, boundaries[0].line).join('\n');
      if (preamble.trim().length > 0) {
        chunks.push({
          chunkIndex: chunkIndex++,
          content: preamble,
          symbolName: '_preamble',
          language,
          tokenCount: estimateTokens(preamble),
        });
      }
      chunkContent = lines.slice(boundaries[b].line, end).join('\n');
    }

    // If chunk is too large, sub-split with sliding window
    if (chunkContent.length > MAX_CHUNK_CHARS * 2) {
      const subChunks = chunkSlidingWindow(chunkContent, language);
      for (const sub of subChunks) {
        chunks.push({
          ...sub,
          chunkIndex: chunkIndex++,
          symbolName: boundaries[b].symbol,
        });
      }
    } else {
      chunks.push({
        chunkIndex: chunkIndex++,
        content: chunkContent,
        symbolName: boundaries[b].symbol,
        language,
        tokenCount: estimateTokens(chunkContent),
      });
    }
  }

  return chunks;
}

function chunkSlidingWindow(content: string, language: string): CodeChunk[] {
  const chunks: CodeChunk[] = [];
  let offset = 0;
  let chunkIndex = 0;

  while (offset < content.length) {
    const end = Math.min(offset + MAX_CHUNK_CHARS, content.length);
    const slice = content.slice(offset, end);
    chunks.push({
      chunkIndex: chunkIndex++,
      content: slice,
      symbolName: null,
      language,
      tokenCount: estimateTokens(slice),
    });
    // Advance by (max - overlap) to create overlapping windows
    offset += MAX_CHUNK_CHARS - OVERLAP_CHARS;
  }

  return chunks;
}

function estimateTokens(text: string): number {
  // Rough heuristic: ~4 chars per token for code
  return Math.ceil(text.length / 4);
}
