import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SearchClient,
  SearchIndexClient,
  AzureKeyCredential,
  KnownSearchFieldDataType,
  KnownVectorSearchAlgorithmKind,
  KnownVectorSearchAlgorithmMetric,
} from '@azure/search-documents';
import { PrismaService } from '../../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { GitHubService } from '../pipeline/github.service';
import { ScmRegistry } from '../pipeline/scm';
import { chunkFile, shouldIndex, detectLanguage, detectContentType, type ContentType } from './chunker';
import type { CodeChunk } from './chunker';

// ─── Document schema for Azure AI Search ────────────────────

export interface CodeChunkDocument {
  id: string;
  /** Tenant / Account ID — enforces row-level security in the shared pooled index */
  tenantId: string;
  repository: string;
  branch: string;
  filePath: string;
  fileSha: string;
  chunkIndex: number;
  language: string;
  contentType: ContentType;
  symbolName: string;
  content: string;
  tokenCount: number;
  contentVector?: number[];
}

export interface RetrievedChunk {
  filePath: string;
  chunkIndex: number;
  symbolName: string;
  language: string;
  content: string;
  score: number;
}

export interface SyncProgress {
  status: 'syncing' | 'idle' | 'error';
  totalFiles: number;
  processedFiles: number;
  totalChunks: number;
  currentFile?: string;
}

interface IndexedFileState {
  filePath: string;
  fileSha?: string;
}

// ─── Constants ──────────────────────────────────────────────

const INDEX_NAME_DEFAULT = 'code-chunks';
const EMBEDDING_DIMENSIONS = 3072; // text-embedding-3-large
const EMBED_BATCH_SIZE = 100;
const UPLOAD_BATCH_SIZE = 500;
const TOP_K_DEFAULT = 20;

/** Escape a string value for use in OData $filter expressions */
function odataEscape(value: string): string {
  return value.replace(/'/g, "''");
}

@Injectable()
export class RagService implements OnModuleInit {
  private readonly logger = new Logger(RagService.name);
  private searchClient!: SearchClient<CodeChunkDocument>;
  private indexClient!: SearchIndexClient;
  private readonly indexName: string;
  private readonly endpoint: string;
  private readonly apiKey: string;
  private configured = false;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly llm: LlmService,
    private readonly github: GitHubService,
    private readonly scm: ScmRegistry,
  ) {
    this.endpoint = this.config.get<string>('AZURE_SEARCH_ENDPOINT') ?? '';
    this.apiKey = this.config.get<string>('AZURE_SEARCH_API_KEY') ?? '';
    this.indexName = this.config.get<string>('AZURE_SEARCH_INDEX_NAME') ?? INDEX_NAME_DEFAULT;
  }

  async onModuleInit() {
    if (!this.endpoint || !this.apiKey) {
      this.logger.warn('AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_API_KEY not set — RAG disabled');
      return;
    }

    const credential = new AzureKeyCredential(this.apiKey);
    this.indexClient = new SearchIndexClient(this.endpoint, credential);
    this.searchClient = new SearchClient<CodeChunkDocument>(
      this.endpoint,
      this.indexName,
      credential,
    );
    this.configured = true;

    try {
      await this.ensureIndex();
      this.logger.log(`RAG service initialized: index="${this.indexName}" at ${this.endpoint}`);
    } catch (err: any) {
      this.configured = false;
      this.logger.warn(`RAG service failed to connect — will retry on first use: ${err.message}`);
    }
  }

  /** Whether the service is configured and ready */
  get isReady(): boolean {
    return this.configured;
  }

  // ─── Index Management ───────────────────────────────────

  /** Create the search index if it doesn't exist. */
  private async ensureIndex(): Promise<void> {
    const requiredFields = [
      { name: 'fileSha', type: KnownSearchFieldDataType.String, filterable: true },
      { name: 'contentType', type: KnownSearchFieldDataType.String, filterable: true, facetable: true },
    ];

    try {
      const existing = await this.indexClient.getIndex(this.indexName);
      this.logger.debug(`Index "${this.indexName}" already exists`);

      const existingFieldNames = new Set(existing.fields.map((field: any) => field.name));
      const missingFields = requiredFields.filter((field) => !existingFieldNames.has(field.name));
      if (missingFields.length > 0) {
        await this.indexClient.createOrUpdateIndex({
          ...existing,
          fields: [...existing.fields, ...missingFields],
        } as any);
        this.logger.log(`Index "${this.indexName}" updated with ${missingFields.map((field) => field.name).join(', ')}`);
      }
      return;
    } catch (err: any) {
      if (err.statusCode !== 404) throw err;
    }

    // Index doesn't exist — create it
    this.logger.log(`Creating index "${this.indexName}"...`);
    try {
      await this.indexClient.createIndex({
        name: this.indexName,
        fields: [
          { name: 'id', type: KnownSearchFieldDataType.String, key: true, filterable: true },
          { name: 'tenantId', type: KnownSearchFieldDataType.String, filterable: true, facetable: true },
          { name: 'repository', type: KnownSearchFieldDataType.String, filterable: true, facetable: true },
          { name: 'branch', type: KnownSearchFieldDataType.String, filterable: true },
          { name: 'filePath', type: KnownSearchFieldDataType.String, searchable: true, filterable: true },
          { name: 'fileSha', type: KnownSearchFieldDataType.String, filterable: true },
          { name: 'chunkIndex', type: KnownSearchFieldDataType.Int32 },
          { name: 'language', type: KnownSearchFieldDataType.String, filterable: true, facetable: true },
          { name: 'contentType', type: KnownSearchFieldDataType.String, filterable: true, facetable: true },
          { name: 'symbolName', type: KnownSearchFieldDataType.String, searchable: true, filterable: true },
          { name: 'content', type: KnownSearchFieldDataType.String, searchable: true },
          { name: 'tokenCount', type: KnownSearchFieldDataType.Int32 },
          {
            name: 'contentVector',
            type: 'Collection(Edm.Single)',
            searchable: true,
            vectorSearchDimensions: EMBEDDING_DIMENSIONS,
            vectorSearchProfileName: 'default-profile',
          },
        ],
        vectorSearch: {
          algorithms: [
            {
              name: 'hnsw-algo',
              kind: KnownVectorSearchAlgorithmKind.Hnsw,
              parameters: {
                metric: KnownVectorSearchAlgorithmMetric.Cosine,
                m: 4,
                efConstruction: 400,
                efSearch: 500,
              },
            },
          ],
          profiles: [
            { name: 'default-profile', algorithmConfigurationName: 'hnsw-algo' },
          ],
        },
        semanticSearch: {
          configurations: [
            {
              name: 'default-semantic',
              prioritizedFields: {
                contentFields: [{ name: 'content' }],
                titleField: { name: 'symbolName' },
                keywordsFields: [{ name: 'filePath' }],
              },
            },
          ],
        },
      });
      this.logger.log(`Index "${this.indexName}" created successfully`);
    } catch (createErr: any) {
      // Handle race condition: another instance may have created it concurrently
      if (createErr.statusCode === 409 || createErr.message?.includes('already exists')) {
        this.logger.debug(`Index "${this.indexName}" was created concurrently — OK`);
      } else {
        throw createErr;
      }
    }
  }

  // ─── Sync (Indexing) ────────────────────────────────────

  /**
   * Sync a repository's codebase into the search index.
   * Fetches the file tree, chunks each file, embeds, and uploads.
   */
  async syncRepository(
    repository: string,
    branch: string,
    onProgress?: (progress: SyncProgress) => void,
    tenantId = 'default',
  ): Promise<{ totalFiles: number; totalChunks: number }> {
    if (!this.configured) throw new Error('RAG service not configured');

    // Update IndexState → syncing
    await this.updateIndexState(repository, branch, 'syncing', 0, 0, tenantId);

    try {
      // 1. Fetch file tree
      const provider = this.scm.resolveForRepo(repository);
      const tree = await provider.getTree(repository, branch);
      const files = tree
        .filter((f) => f.type === 'file' && shouldIndex(f.path))
        .filter((f) => f.size < 100_000); // skip files > 100KB

      const existingFiles = await this.getIndexedFileStates(repository, branch, tenantId);
      const existingByPath = new Map(existingFiles.map((file) => [file.filePath, file]));
      const treePaths = new Set(files.map((file) => file.path));
      const removedPaths = existingFiles
        .map((file) => file.filePath)
        .filter((filePath) => !treePaths.has(filePath));

      if (removedPaths.length > 0) {
        await this.deleteByFilePaths(repository, branch, tenantId, removedPaths);
      }

      const filesToProcess = files.filter((file) => existingByPath.get(file.path)?.fileSha !== file.sha);

      const totalFiles = files.length;
      let processedFiles = totalFiles - filesToProcess.length;
      let totalChunks = 0;
      const allDocs: CodeChunkDocument[] = [];

      if (filesToProcess.length === 0 && removedPaths.length === 0) {
        await this.updateIndexState(repository, branch, 'idle', totalFiles, totalFiles, tenantId);
        this.logger.log(`Sync skipped: ${repository}@${branch} already up to date`);
        return { totalFiles, totalChunks: 0 };
      }

      // 2. Process files in batches to avoid memory pressure
      const FILE_BATCH = 20;
      for (let i = 0; i < filesToProcess.length; i += FILE_BATCH) {
        const batch = filesToProcess.slice(i, i + FILE_BATCH);

        // Fetch file contents in parallel
        const contents = await Promise.all(
          batch.map(async (f) => {
            try {
              const fc = await provider.getFileContent(repository, f.path, branch);
              return { path: f.path, content: fc.content, sha: fc.sha };
            } catch {
              return null;
            }
          }),
        );

        // Chunk each file
        for (const file of contents) {
          if (!file) continue;

          await this.deleteByFilePaths(repository, branch, tenantId, [file.path]);

          const chunks = chunkFile(file.path, file.content);
          for (const chunk of chunks) {
            allDocs.push(this.buildDocument(repository, branch, file.path, file.sha, chunk, tenantId));
          }
          totalChunks += chunks.length;
          processedFiles++;

          onProgress?.({
            status: 'syncing',
            totalFiles,
            processedFiles,
            totalChunks,
            currentFile: file.path,
          });
        }
      }

      // 3. Embed all chunks in batches
      this.logger.log(`Embedding ${allDocs.length} chunks...`);
      for (let i = 0; i < allDocs.length; i += EMBED_BATCH_SIZE) {
        const batch = allDocs.slice(i, i + EMBED_BATCH_SIZE);
        const texts = batch.map((d) => `${d.filePath}\n${d.symbolName}\n${d.content}`);
        const embeddings = await this.llm.embedBatch(texts);
        for (let j = 0; j < batch.length; j++) {
          batch[j].contentVector = embeddings[j];
        }
      }

      // 4. Upload to Azure AI Search in batches
      this.logger.log(`Uploading ${allDocs.length} documents to search index...`);

      for (let i = 0; i < allDocs.length; i += UPLOAD_BATCH_SIZE) {
        const batch = allDocs.slice(i, i + UPLOAD_BATCH_SIZE);
        await this.searchClient.uploadDocuments(batch);
      }

      // 5. Update IndexState → idle
      await this.updateIndexState(repository, branch, 'idle', totalFiles, totalFiles, tenantId);

      this.logger.log(
        `Sync complete: ${repository}@${branch} — ${processedFiles} files, ${totalChunks} chunks`,
      );
      return { totalFiles: processedFiles, totalChunks };
    } catch (err: any) {
      this.logger.error(`Sync failed for ${repository}@${branch}: ${err.message}`);
      await this.updateIndexState(repository, branch, 'error', 0, 0, tenantId);
      throw err;
    }
  }

  // ─── Retrieval (Query) ──────────────────────────────────

  /**
   * Hybrid search: vector + BM25 keyword + semantic reranker.
   * Returns the top-K most relevant code chunks for the given query.
   */
  async queryRelevantChunks(
    repository: string,
    branch: string,
    query: string,
    topK = TOP_K_DEFAULT,
    tenantId = 'default',
  ): Promise<RetrievedChunk[]> {
    if (!this.configured) return [];

    // Embed the query
    const queryVector = await this.llm.embed(query);

    const results = await this.searchClient.search(query, {
      filter: `tenantId eq '${odataEscape(tenantId)}' and repository eq '${odataEscape(repository)}' and branch eq '${odataEscape(branch)}'`,
      top: topK,
      queryType: 'semantic',
      semanticSearchOptions: {
        configurationName: 'default-semantic',
      },
      vectorSearchOptions: {
        queries: [
          {
            kind: 'vector',
            vector: queryVector,
            kNearestNeighborsCount: topK,
            fields: ['contentVector'],
          },
        ],
      },
      select: ['filePath', 'chunkIndex', 'symbolName', 'language', 'content'],
    });

    const chunks: RetrievedChunk[] = [];
    for await (const result of results.results) {
      const doc = result.document;
      chunks.push({
        filePath: doc.filePath,
        chunkIndex: doc.chunkIndex,
        symbolName: doc.symbolName,
        language: doc.language,
        content: doc.content,
        score: result.score ?? 0,
      });
    }

    return chunks;
  }

  // ─── Browse / Stats ─────────────────────────────────────

  /** Get indexed files for a repo (grouped by file path) */
  async getIndexedFiles(
    repository: string,
    branch: string,
    tenantId = 'default',
  ): Promise<Array<{ filePath: string; language: string; chunkCount: number }>> {
    if (!this.configured) return [];

    const results = await this.searchClient.search('*', {
      filter: `tenantId eq '${odataEscape(tenantId)}' and repository eq '${odataEscape(repository)}' and branch eq '${odataEscape(branch)}'`,
      facets: ['filePath,count:1000'],
      top: 0, // we only need facets
    });

    const fileFacets = results.facets?.filePath;
    if (!fileFacets) return [];

    // For each file, get the language from one sample document
    const files: Array<{ filePath: string; language: string; chunkCount: number }> = [];
    for (const facet of fileFacets) {
      files.push({
        filePath: facet.value as string,
        language: detectLanguage(facet.value as string),
        chunkCount: facet.count ?? 0,
      });
    }

    return files;
  }

  /** Get chunks for a specific file */
  async getFileChunks(
    repository: string,
    branch: string,
    filePath: string,
    tenantId = 'default',
  ): Promise<Array<{ chunkIndex: number; symbolName: string; content: string; tokenCount: number }>> {
    if (!this.configured) return [];

    const results = await this.searchClient.search('*', {
      filter: `tenantId eq '${odataEscape(tenantId)}' and repository eq '${odataEscape(repository)}' and branch eq '${odataEscape(branch)}' and filePath eq '${odataEscape(filePath)}'`,
      orderBy: ['chunkIndex asc'],
      select: ['chunkIndex', 'symbolName', 'content', 'tokenCount'],
      top: 100,
    });

    const chunks: Array<{ chunkIndex: number; symbolName: string; content: string; tokenCount: number }> = [];
    for await (const result of results.results) {
      const doc = result.document;
      chunks.push({
        chunkIndex: doc.chunkIndex,
        symbolName: doc.symbolName,
        content: doc.content,
        tokenCount: doc.tokenCount,
      });
    }
    return chunks;
  }

  /** Get index statistics */
  async getStats(): Promise<{ documentCount: number; storageSize: number } | null> {
    if (!this.configured) return null;
    try {
      const stats = await this.indexClient.getIndexStatistics(this.indexName);
      return {
        documentCount: stats.documentCount ?? 0,
        storageSize: stats.storageSize ?? 0,
      };
    } catch {
      return null;
    }
  }

  // ─── Internal Helpers ───────────────────────────────────

  private buildDocument(
    repository: string,
    branch: string,
    filePath: string,
    fileSha: string,
    chunk: CodeChunk,
    tenantId: string,
  ): CodeChunkDocument {
    // Sanitize ID: Azure AI Search keys must be URL-safe
    const rawId = `${tenantId}:${repository}:${branch}:${filePath}:${chunk.chunkIndex}`;
    const id = Buffer.from(rawId).toString('base64url');

    return {
      id,
      tenantId,
      repository,
      branch,
      filePath,
      fileSha,
      chunkIndex: chunk.chunkIndex,
      language: chunk.language,
      contentType: detectContentType(filePath),
      symbolName: chunk.symbolName ?? '',
      content: chunk.content,
      tokenCount: chunk.tokenCount,
    };
  }

  private async getIndexedFileStates(
    repository: string,
    branch: string,
    tenantId: string,
  ): Promise<IndexedFileState[]> {
    const results = await this.searchClient.search('*', {
      filter: `tenantId eq '${odataEscape(tenantId)}' and repository eq '${odataEscape(repository)}' and branch eq '${odataEscape(branch)}'`,
      select: ['filePath', 'fileSha'],
      top: 5000,
    });

    const deduped = new Map<string, IndexedFileState>();
    for await (const result of results.results) {
      const doc = result.document as any;
      if (!deduped.has(doc.filePath)) {
        deduped.set(doc.filePath, { filePath: doc.filePath, fileSha: doc.fileSha });
      }
    }

    return [...deduped.values()];
  }

  private async deleteByRepoAndBranch(repository: string, branch: string, tenantId: string): Promise<void> {
    // Fetch all document IDs for this tenant/repo/branch and delete them
    const results = await this.searchClient.search('*', {
      filter: `tenantId eq '${odataEscape(tenantId)}' and repository eq '${odataEscape(repository)}' and branch eq '${odataEscape(branch)}'`,
      select: ['id'] as any,
      top: 5000,
    });

    const idsToDelete: Array<{ id: string }> = [];
    for await (const result of results.results) {
      idsToDelete.push({ id: (result.document as any).id });
    }

    if (idsToDelete.length > 0) {
      for (let i = 0; i < idsToDelete.length; i += UPLOAD_BATCH_SIZE) {
        const batch = idsToDelete.slice(i, i + UPLOAD_BATCH_SIZE);
        await this.searchClient.deleteDocuments(batch as any);
      }
      this.logger.log(`Deleted ${idsToDelete.length} old documents for ${repository}@${branch}`);
    }
  }

  private async deleteByFilePaths(
    repository: string,
    branch: string,
    tenantId: string,
    filePaths: string[],
  ): Promise<void> {
    if (filePaths.length === 0) {
      return;
    }

    const filters = filePaths.map((filePath) => `filePath eq '${odataEscape(filePath)}'`).join(' or ');
    const results = await this.searchClient.search('*', {
      filter: `tenantId eq '${odataEscape(tenantId)}' and repository eq '${odataEscape(repository)}' and branch eq '${odataEscape(branch)}' and (${filters})`,
      select: ['id'] as any,
      top: 5000,
    });

    const idsToDelete: Array<{ id: string }> = [];
    for await (const result of results.results) {
      idsToDelete.push({ id: (result.document as any).id });
    }

    if (idsToDelete.length > 0) {
      for (let i = 0; i < idsToDelete.length; i += UPLOAD_BATCH_SIZE) {
        const batch = idsToDelete.slice(i, i + UPLOAD_BATCH_SIZE);
        await this.searchClient.deleteDocuments(batch as any);
      }
      this.logger.log(`Deleted ${idsToDelete.length} stale document(s) across ${filePaths.length} file(s) for ${repository}@${branch}`);
    }
  }

  private async updateIndexState(
    repository: string,
    branch: string,
    status: string,
    totalFiles: number,
    indexedFiles: number,
    tenantId: string,
  ): Promise<void> {
    await this.prisma.client.indexState.upsert({
      where: { tenantId_repository_branch: { tenantId, repository, branch } },
      create: { tenantId, repository, branch, status, totalFiles, indexedFiles, lastSyncAt: new Date() },
      update: { status, totalFiles, indexedFiles, lastSyncAt: new Date() },
    });
  }
}
