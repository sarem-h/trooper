"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { copilot, type CopilotCardResponse, type CopilotQuery } from "@/lib/api";

interface ScmIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  labels: { name: string; color: string }[];
  url: string;
}

interface ScmPR {
  number: number;
  title: string;
  body: string;
  state: string;
  sourceBranch: string;
  url: string;
  isDraft?: boolean;
  changedFiles?: string[];
}

interface GroundingRequestOptions {
  stageLimit?: number;
  includeTrace?: boolean;
}

const DEBOUNCE_MS = 150;
const METADATA_RESULT_TTL_MS = 15 * 60 * 1000;
const GROUNDED_RESULT_TTL_MS = 15 * 60 * 1000;
const METADATA_RESULT_STORAGE_PREFIX = "trooper.repo-copilot.metadata";
const GROUNDED_RESULT_STORAGE_PREFIX = "trooper.repo-copilot.grounded";

interface PersistedCopilotResult {
  result: CopilotCardResponse;
  cachedAt: number;
  expiresAt: number;
  version: 1;
}

function isStorageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readPersistedResult(storageKey: string) {
  if (!isStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedCopilotResult;
    if (!parsed?.result || typeof parsed.expiresAt !== "number") {
      window.localStorage.removeItem(storageKey);
      return null;
    }

    if (Date.now() > parsed.expiresAt) {
      window.localStorage.removeItem(storageKey);
      return null;
    }

    return parsed.result;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function writePersistedResult(storageKey: string, result: CopilotCardResponse, ttlMs: number) {
  if (!isStorageAvailable()) return;

  const cachedAt = Date.now();
  const payload: PersistedCopilotResult = {
    result,
    cachedAt,
    expiresAt: cachedAt + ttlMs,
    version: 1,
  };

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Ignore storage write failures such as quota limits.
  }
}

/**
 * Hook that fetches a copilot summary for the selected issue or PR.
 * Features: debounce, abort on rapid selection, client-side cache.
 */
export function useCopilotSummary(
  kind: "issue" | "pull",
  item: ScmIssue | ScmPR | null,
  repoFullName: string,
  modelId?: string | null,
  branch?: string,
) {
  const [summary, setSummary] = useState<CopilotCardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [grounding, setGrounding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"metadata" | "codebase">("metadata");
  const [summaryTargetKey, setSummaryTargetKey] = useState<string | null>(null);

  const summaryCacheRef = useRef(new Map<string, CopilotCardResponse>());
  const groundingCacheRef = useRef(new Map<string, CopilotCardResponse>());
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildCacheKey = useCallback(
    (target: ScmIssue | ScmPR, mode: "metadata" | "codebase") =>
      `${kind}-${modelId ?? "default"}-${branch ?? "default"}-${mode}-${target.number}`,
    [branch, kind, modelId],
  );

  const buildItemKey = useCallback(
    (target: ScmIssue | ScmPR) => `${kind}-${modelId ?? "default"}-${branch ?? "default"}-${target.number}`,
    [branch, kind, modelId],
  );

  const activeItemKey = item ? buildItemKey(item) : null;
  const hasActiveSummary = summary !== null && summaryTargetKey === activeItemKey;
  const visibleSummary = hasActiveSummary ? summary : null;
  const visibleAnalysisMode = hasActiveSummary ? analysisMode : "metadata";

  const buildGroundedStorageKey = useCallback(
    (target: ScmIssue | ScmPR) =>
      `${GROUNDED_RESULT_STORAGE_PREFIX}.${repoFullName}.${kind}.${target.number}.${kind === "pull" ? (target as ScmPR).sourceBranch : branch ?? "default"}.${modelId ?? "default"}`,
    [branch, kind, modelId, repoFullName],
  );

  const buildMetadataStorageKey = useCallback(
    (target: ScmIssue | ScmPR) =>
      `${METADATA_RESULT_STORAGE_PREFIX}.${repoFullName}.${kind}.${target.number}.${kind === "pull" ? (target as ScmPR).sourceBranch : branch ?? "default"}.${modelId ?? "default"}`,
    [branch, kind, modelId, repoFullName],
  );

  const buildQuery = useCallback(
    (target: ScmIssue | ScmPR, options?: GroundingRequestOptions): CopilotQuery => ({
      type: kind,
      repositoryFullName: repoFullName,
      refNumber: target.number,
      title: target.title,
      body: target.body ?? "",
      modelId: modelId ?? undefined,
      state: target.state,
      labels:
        kind === "issue"
          ? (target as ScmIssue).labels?.map((label) => label.name)
          : undefined,
      branch:
        kind === "pull"
          ? (target as ScmPR).sourceBranch
          : branch ?? undefined,
      changedFiles:
        kind === "pull" ? (target as ScmPR).changedFiles : undefined,
      groundingStageLimit: options?.stageLimit,
      includeGroundingTrace: options?.includeTrace,
    }),
    [branch, kind, modelId, repoFullName],
  );

  const fetchSummary = useCallback(
    async (target: ScmIssue | ScmPR) => {
      const itemKey = buildItemKey(target);
      const groundedCacheKey = buildCacheKey(target, "codebase");
      const grounded = groundingCacheRef.current.get(groundedCacheKey);
      if (grounded) {
        setSummary(grounded);
        setSummaryTargetKey(itemKey);
        setAnalysisMode("codebase");
        setLoading(false);
        setGrounding(false);
        setError(null);
        return;
      }

      const persistedGrounded = readPersistedResult(buildGroundedStorageKey(target));
      if (persistedGrounded) {
        groundingCacheRef.current.set(groundedCacheKey, persistedGrounded);
        setSummary(persistedGrounded);
        setSummaryTargetKey(itemKey);
        setAnalysisMode("codebase");
        setLoading(false);
        setGrounding(false);
        setError(null);
        return;
      }

      const cacheKey = buildCacheKey(target, "metadata");
      const cached = summaryCacheRef.current.get(cacheKey);
      if (cached) {
        setSummary(cached);
        setSummaryTargetKey(itemKey);
        setAnalysisMode("metadata");
        setLoading(false);
        setGrounding(false);
        setError(null);
        return;
      }

      const persistedMetadata = readPersistedResult(buildMetadataStorageKey(target));
      if (persistedMetadata) {
        summaryCacheRef.current.set(cacheKey, persistedMetadata);
        setSummary(persistedMetadata);
        setSummaryTargetKey(itemKey);
        setAnalysisMode("metadata");
        setLoading(false);
        setGrounding(false);
        setError(null);
        return;
      }

      // Abort any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setGrounding(false);
      setLoading(true);
      setError(null);
      setSummary(null);
      setSummaryTargetKey(null);
      setAnalysisMode("metadata");

      try {
        const result = await copilot.summarize(buildQuery(target));

        // Only apply if this request wasn't aborted
        if (!controller.signal.aborted) {
          summaryCacheRef.current.set(cacheKey, result);
          writePersistedResult(buildMetadataStorageKey(target), result, METADATA_RESULT_TTL_MS);
          setSummary(result);
          setSummaryTargetKey(itemKey);
          setAnalysisMode("metadata");
          setLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load summary");
          setLoading(false);
        }
      }
    },
    [buildCacheKey, buildGroundedStorageKey, buildItemKey, buildMetadataStorageKey, buildQuery],
  );

  useEffect(() => {
    // Clear debounce timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!item) {
      setSummary(null);
      setSummaryTargetKey(null);
      setLoading(false);
      setGrounding(false);
      setError(null);
      setAnalysisMode("metadata");
      abortRef.current?.abort();
      return;
    }

    abortRef.current?.abort();

    // Check cache immediately — skip debounce on hit
    const itemKey = buildItemKey(item);
    const groundedCacheKey = buildCacheKey(item, "codebase");
    const grounded = groundingCacheRef.current.get(groundedCacheKey);
    if (grounded) {
      setSummary(grounded);
      setSummaryTargetKey(itemKey);
      setAnalysisMode("codebase");
      setLoading(false);
      setGrounding(false);
      setError(null);
      return;
    }

    const persistedGrounded = readPersistedResult(buildGroundedStorageKey(item));
    if (persistedGrounded) {
      groundingCacheRef.current.set(groundedCacheKey, persistedGrounded);
      setSummary(persistedGrounded);
      setSummaryTargetKey(itemKey);
      setAnalysisMode("codebase");
      setLoading(false);
      setGrounding(false);
      setError(null);
      return;
    }

    const cacheKey = buildCacheKey(item, "metadata");
    const cached = summaryCacheRef.current.get(cacheKey);
    if (cached) {
      setSummary(cached);
      setSummaryTargetKey(itemKey);
      setAnalysisMode("metadata");
      setLoading(false);
      setGrounding(false);
      setError(null);
      return;
    }

    const persistedMetadata = readPersistedResult(buildMetadataStorageKey(item));
    if (persistedMetadata) {
      summaryCacheRef.current.set(cacheKey, persistedMetadata);
      setSummary(persistedMetadata);
      setSummaryTargetKey(itemKey);
      setAnalysisMode("metadata");
      setLoading(false);
      setGrounding(false);
      setError(null);
      return;
    }

    // Switch the panel immediately to the new selection's loading state.
    setSummary(null);
    setSummaryTargetKey(null);
    setGrounding(false);
    setError(null);
    setAnalysisMode("metadata");
    setLoading(true);
    timerRef.current = setTimeout(() => {
      fetchSummary(item);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      abortRef.current?.abort();
    };
  }, [buildCacheKey, buildGroundedStorageKey, buildItemKey, buildMetadataStorageKey, fetchSummary, item]);

  const reanalyzeWithCodeContext = useCallback(async (
    forceRefresh = false,
    options?: GroundingRequestOptions,
  ) => {
    if (!item) return;

    const isVerificationRun = typeof options?.stageLimit === "number";

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const cacheKey = buildCacheKey(item, "codebase");
    if (!forceRefresh && !isVerificationRun) {
      const cached = groundingCacheRef.current.get(cacheKey);
      if (cached) {
        setSummary(cached);
        setSummaryTargetKey(buildItemKey(item));
        setAnalysisMode("codebase");
        setGrounding(false);
        setLoading(false);
        setError(null);
        return;
      }

      const persistedGrounded = readPersistedResult(buildGroundedStorageKey(item));
      if (persistedGrounded) {
        groundingCacheRef.current.set(cacheKey, persistedGrounded);
        setSummary(persistedGrounded);
        setSummaryTargetKey(buildItemKey(item));
        setAnalysisMode("codebase");
        setGrounding(false);
        setLoading(false);
        setError(null);
        return;
      }
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(false);
    setGrounding(true);
    setError(null);
    setSummary(null);
    setSummaryTargetKey(null);

    try {
      const result = await copilot.ground(buildQuery(item, {
        stageLimit: options?.stageLimit,
        includeTrace: options?.includeTrace ?? isVerificationRun,
      }));
      if (!controller.signal.aborted) {
        if (!isVerificationRun) {
          groundingCacheRef.current.set(cacheKey, result);
          writePersistedResult(buildGroundedStorageKey(item), result, GROUNDED_RESULT_TTL_MS);
        }
        setSummary(result);
        setSummaryTargetKey(buildItemKey(item));
        setAnalysisMode("codebase");
        setGrounding(false);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Failed to reanalyze with code context");
        setGrounding(false);
      }
    }
  }, [buildCacheKey, buildGroundedStorageKey, buildItemKey, buildQuery, item]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    summary: visibleSummary,
    loading,
    grounding,
    error,
    analysisMode: visibleAnalysisMode,
    reanalyzeWithCodeContext,
  };
}
