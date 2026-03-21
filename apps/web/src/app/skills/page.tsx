"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Loader2, PencilRuler, Play, Plus, Save, Search, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillSpecView } from "@/components/ui/skill-spec-view";
import { copilot, type CopilotModelOption, type SkillDraftResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

type DraftHistoryEntry = {
  id: string;
  summary: string;
  createdAt: string;
  modelLabel?: string;
};

type SavedSkill = {
  id: string;
  name: string;
  specFull: string;
  specUi: string;
  prompt: string;
  intent: string;
  createdAt: string;
  preferredModelId?: string;
  preferredModelLabel?: string;
};

type ViewMode = "library" | "create";
type DraftMode = "new" | "refine";

const STORAGE_KEY = "trooper.skills.saved.v1";
const SKILL_MODEL_STORAGE_KEY = "trooper.skills.model.v1";
const ACTIVE_SKILL_EXECUTION_KEY = "trooper.skills.execution.v1";

const FALLBACK_MODEL_OPTIONS: CopilotModelOption[] = [
  {
    id: "balanced",
    label: "gpt-4.1-mini",
    description: "Recommended default for fast drafting.",
    tier: "worker",
    isDefault: true,
  },
  {
    id: "quality",
    label: "gpt-4.1",
    description: "Higher quality drafting when precision matters more than latency.",
    tier: "thinker",
    isDefault: false,
  },
  {
    id: "reasoning",
    label: "gpt-5.1-thinking",
    description: "Best for ambiguous or complex skill design.",
    tier: "thinker",
    isDefault: false,
  },
];

const STARTER_PROMPT =
  "Design a reusable architecture diagram skill. The skill should stay repository-agnostic while being drafted, then when executed it should accept a selected repository as runtime context, use indexed code and Swarm analysis, and produce a clean markdown architecture brief with Mermaid output.";

const STARTER_HISTORY: DraftHistoryEntry[] = [
  {
    id: "history-1",
    summary: "Initialized the draft workspace with the default authoring template.",
    createdAt: new Date(0).toISOString(),
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "custom-skill";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function splitIntent(prompt: string) {
  const normalized = prompt.trim();
  if (!normalized) {
    return {
      name: "Architecture Diagram Designer",
      objective: "Create a reusable architecture diagram skill.",
    };
  }

  const sentence = normalized.split(/[.!?\n]/)[0]?.trim() || normalized;
  const name = sentence.length > 56 ? `${sentence.slice(0, 53).trim()}...` : sentence;

  return {
    name,
    objective: normalized,
  };
}

function buildSkillMarkdown(prompt: string, notes: string[] = []) {
  const { name, objective } = splitIntent(prompt);
  const latestUserInputs = notes.slice(-3).map((note) => `- ${note}`).join("\n");

  return `# ${name}

## Skill Overview

This skill is designed for software and platform engineers who need a repeatable architecture reading workflow. The skill is authored once, saved to the library, and later executed against whichever repository the operator selects in Git Explorer.

## Objective

${objective}

## Authoring Principle

- Keep the skill repository-agnostic while drafting.
- Bind the target repository only when the user runs the skill.
- Use indexed code context and Swarm analysis only during execution.

## Runtime Contract

When this skill is used:

1. The operator selects a repository in Git Explorer.
2. Trooper confirms index availability and active branch context.
3. Swarm reads the selected repository thoroughly using grounded indexed context.
4. The skill applies its analysis instructions to the live repository.
5. Trooper returns a markdown artifact and any requested diagram output.

## Execution Methodology

### Phase 1: Runtime Repository Binding

- Require explicit repository selection before execution.
- Prefer grounded repository context over generic assumptions.
- Surface indexing or branch issues before analysis starts.

### Phase 2: Structural Analysis

- Use indexed repository context to locate applications, services, packages, configuration, pipelines, and infrastructure descriptors.
- Ask Swarm to inspect the repository holistically rather than file-by-file only.
- Prioritize architectural seams: application layers, runtime boundaries, integrations, persistence, auth, messaging, and deployment surfaces.

### Phase 3: Output Synthesis

- Produce a concise markdown artifact for SWE and DevOps engineers.
- Separate observed facts from inferred structure.
- Call out unknowns instead of inventing architecture.

## Expected Outputs

- Markdown summary
- Major system boundaries
- Data flow and integration notes
- Deployment and operational considerations
- Mermaid diagram source
- Open questions and assumptions

## Guardrails

- Never claim repository facts that are not supported by index-backed or inspected evidence.
- Keep the saved skill reusable; runtime repo selection should provide the codebase context.
- Avoid bloated output. Optimize for reviewability and operator handoff.
- Make the final artifact readable by engineers, not prompt-oriented.

## Current Draft Notes

${latestUserInputs || "- No additional user refinements captured yet."}

## Suggested Mermaid Shape

\`\`\`mermaid
flowchart TD
    A[Saved skill selected from library] --> B[User chooses repository in Git Explorer]
    B --> C[Index validation]
    C --> D[Swarm reads repository]
    D --> E[Skill applies analysis workflow]
    E --> F[Markdown artifact]
    E --> G[Mermaid diagram output]
\`\`\`

## Save and Use

Save this skill to the library once the contract is stable. Repository selection happens later when the operator actually runs it.
`;
}

function buildSkillUiMarkdown(prompt: string, notes: string[] = []) {
  const { name, objective } = splitIntent(prompt);
  const latestNotes = notes.slice(-2).map((note) => `- ${note}`).join("\n");

  return `# ${name}

## Summary

Reusable saved skill for repository-aware analysis at runtime. Draft once, then bind a target repo only when the operator runs it.

## Outputs

- Markdown summary
- Architecture or systems findings
- Mermaid diagram when requested and supported by evidence

## Best For

- Repeatable repo analysis workflows
- Architecture reviews
- Indexed codebase inspections with clear operator guardrails

## How It Works

1. Save the reusable skill contract.
2. Pick the target repository when running it.
3. Validate index and branch context.
4. Analyze the repository with grounded code evidence.
5. Return a concise engineering artifact.

## What You'll Get

- Observed facts grounded in repository evidence
- Inferred structure called out explicitly
- Unknowns listed instead of guessed

## Rules & Assumptions

- Repository context is attached only at runtime.
- Execution should use indexed code and Swarm-style inspection.
- Keep output reviewable and engineer-facing.

${objective ? `## Advanced Details

${objective}

` : ""}${latestNotes || ""}`.trimEnd();
}

function buildLibraryEmptyMarkdown() {
  return `# Skills Library

Your saved skills should be the primary surface here.

## Expected flow

1. Review saved skills first.
2. Select one to inspect or refine.
3. Create a new skill only when needed.
4. When using a skill later, attach repository context through Git Explorer.
`;
}

function readSavedSkillsFromStorage(): SavedSkill[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<
      SavedSkill & {
        markdown?: string;
      }
    >;

    return parsed.map((skill) => ({
      ...skill,
      specFull: skill.specFull ?? skill.markdown ?? "",
      specUi: skill.specUi ?? skill.markdown ?? skill.specFull ?? "",
    }));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export default function SkillsPage() {
  const router = useRouter();
  const [savedSkills, setSavedSkills] = useState<SavedSkill[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("library");
  const [draftMode, setDraftMode] = useState<DraftMode>("new");
  const [draftPrompt, setDraftPrompt] = useState(STARTER_PROMPT);
  const [draftSpecFull, setDraftSpecFull] = useState(() => buildSkillMarkdown(STARTER_PROMPT));
  const [draftSpecUi, setDraftSpecUi] = useState(() => buildSkillUiMarkdown(STARTER_PROMPT));
  const [draftHistory, setDraftHistory] = useState<DraftHistoryEntry[]>(STARTER_HISTORY);
  const [isDrafting, setIsDrafting] = useState(false);
  const [copilotModels, setCopilotModels] = useState<CopilotModelOption[]>(FALLBACK_MODEL_OPTIONS);
  const [copilotModelsLoading, setCopilotModelsLoading] = useState(false);
  const [modelLoadError, setModelLoadError] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(
    FALLBACK_MODEL_OPTIONS.find((model) => model.isDefault)?.id ?? null
  );
  const [skillQuery, setSkillQuery] = useState("");
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  useEffect(() => {
    const storedSkills = readSavedSkillsFromStorage();
    setSavedSkills(storedSkills);
    setSelectedSkillId((current) => current ?? storedSkills[0]?.id ?? null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCopilotModels = async () => {
      setCopilotModelsLoading(true);
      setModelLoadError(null);

      try {
        const models = await copilot.models();
        if (cancelled || models.length === 0) return;

        setCopilotModels(models);

        const storedModelId = typeof window !== "undefined" ? localStorage.getItem(SKILL_MODEL_STORAGE_KEY) : null;
        const validStoredModelId = storedModelId && models.some((model) => model.id === storedModelId) ? storedModelId : null;
        const defaultModelId = models.find((model) => model.isDefault)?.id ?? models[0]?.id ?? null;
        const nextModelId = validStoredModelId ?? defaultModelId;

        setSelectedModelId(nextModelId);

        if (nextModelId && typeof window !== "undefined") {
          localStorage.setItem(SKILL_MODEL_STORAGE_KEY, nextModelId);
        }
      } catch (error) {
        console.error("Failed to load Copilot models for skill drafting:", error);
        if (!cancelled) {
          setModelLoadError("Draft updates still run locally; the model list could not be refreshed from the backend.");
        }
      } finally {
        if (!cancelled) {
          setCopilotModelsLoading(false);
        }
      }
    };

    loadCopilotModels();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSkills = useMemo(() => {
    const normalized = skillQuery.trim().toLowerCase();
    if (!normalized) return savedSkills;

    return savedSkills.filter((skill) => {
      return (
        skill.name.toLowerCase().includes(normalized) ||
        skill.intent.toLowerCase().includes(normalized) ||
        skill.prompt.toLowerCase().includes(normalized)
      );
    });
  }, [savedSkills, skillQuery]);

  const selectedSkill = savedSkills.find((skill) => skill.id === selectedSkillId) ?? filteredSkills[0] ?? null;
  const selectedModel = useMemo(
    () => copilotModels.find((model) => model.id === selectedModelId) ?? copilotModels.find((model) => model.isDefault) ?? null,
    [copilotModels, selectedModelId]
  );
  const activeUiMarkdown = viewMode === "create"
    ? draftSpecUi
    : selectedSkill?.specUi ?? selectedSkill?.specFull ?? buildLibraryEmptyMarkdown();
  const activeFullMarkdown = viewMode === "create"
    ? draftSpecFull
    : selectedSkill?.specFull ?? buildLibraryEmptyMarkdown();

  async function handleDraftSubmit() {
    if (!draftPrompt.trim()) return;

    const promptValue = draftPrompt.trim();
    setIsDrafting(true);
    setSaveNotice(null);

    try {
      const result: SkillDraftResponse = await copilot.draftSkill({
        prompt: promptValue,
        currentSpecFull: draftSpecFull,
        currentSpecUi: draftSpecUi,
        modelId: selectedModel?.id,
        draftMode,
      });

      setDraftSpecFull(result.specFull);
      setDraftSpecUi(result.specUi);
      setDraftHistory((current) => [
        {
          id: `history-${Date.now()}`,
          summary: result.changeSummary,
          createdAt: new Date().toISOString(),
          modelLabel: result.modelLabel,
        },
        ...current,
      ].slice(0, 6));
    } catch (error) {
      console.error("Failed to draft skill via backend:", error);
      setDraftSpecFull(buildSkillMarkdown(promptValue, [promptValue]));
      setDraftSpecUi(buildSkillUiMarkdown(promptValue, [promptValue]));
      setDraftHistory((current) => [
        {
          id: `history-${Date.now()}`,
          summary: "Backend drafting failed, so the draft fell back to the local template update.",
          createdAt: new Date().toISOString(),
          modelLabel: selectedModel?.label,
        },
        ...current,
      ].slice(0, 6));
    } finally {
      setIsDrafting(false);
    }
  }

  function persistSkills(next: SavedSkill[]) {
    setSavedSkills(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }

  function handleSaveSkill() {
    if (!draftPrompt.trim()) {
      setSaveNotice("Write a draft before saving the skill.");
      return;
    }

    const parsedIntent = splitIntent(draftPrompt);
    const nextSkill: SavedSkill = {
      id: `${slugify(parsedIntent.name)}-${Date.now()}`,
      name: parsedIntent.name,
      specFull: draftSpecFull,
      specUi: draftSpecUi,
      prompt: draftPrompt.trim(),
      intent: parsedIntent.objective,
      createdAt: new Date().toISOString(),
      preferredModelId: selectedModel?.id,
      preferredModelLabel: selectedModel?.label,
    };

    const next = [nextSkill, ...savedSkills];
    persistSkills(next);
    setSelectedSkillId(nextSkill.id);
    setViewMode("library");
    setSaveNotice(`Saved ${parsedIntent.name} to the skills library.`);
  }

  function handleLoadSavedSkill(skill: SavedSkill) {
    setSelectedSkillId(skill.id);
    setViewMode("library");
    setSaveNotice(`Viewing ${skill.name}.`);
  }

  function handleStartNewSkill() {
    setDraftMode("new");
    setViewMode("create");
    setDraftPrompt(STARTER_PROMPT);
    setDraftSpecFull(buildSkillMarkdown(STARTER_PROMPT));
    setDraftSpecUi(buildSkillUiMarkdown(STARTER_PROMPT));
    setDraftHistory([
      {
        id: `history-${Date.now()}`,
        summary: "Started a new skill draft from the default template.",
        createdAt: new Date().toISOString(),
      },
    ]);
    setSaveNotice(null);
  }

  function handleEditSkill(skill: SavedSkill) {
    setDraftMode("refine");
    setDraftPrompt(skill.prompt);
    if (skill.preferredModelId) {
      setSelectedModelId(skill.preferredModelId);
      if (typeof window !== "undefined") {
        localStorage.setItem(SKILL_MODEL_STORAGE_KEY, skill.preferredModelId);
      }
    }
    setDraftSpecFull(skill.specFull);
    setDraftSpecUi(skill.specUi);
    setDraftHistory([
      {
        id: `history-${Date.now()}`,
        summary: `Loaded ${skill.name} from the library for refinement.`,
        createdAt: new Date().toISOString(),
        modelLabel: skill.preferredModelLabel,
      },
    ]);
    setViewMode("create");
    setSelectedSkillId(skill.id);
    setSaveNotice(`Editing ${skill.name}.`);
  }

  function handleDeleteSkill(skill: SavedSkill) {
    const shouldDelete = window.confirm(`Delete ${skill.name} from the skills library?`);
    if (!shouldDelete) return;

    const next = savedSkills.filter((entry) => entry.id !== skill.id);
    persistSkills(next);

    if (selectedSkillId === skill.id) {
      setSelectedSkillId(next[0]?.id ?? null);
    }

    setSaveNotice(`Deleted ${skill.name} from the skills library.`);
  }

  function handleUseSkill(skill: SavedSkill) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        ACTIVE_SKILL_EXECUTION_KEY,
        JSON.stringify({
          id: skill.id,
          name: skill.name,
          prompt: skill.prompt,
          specFull: skill.specFull,
          specUi: skill.specUi,
          preferredModelId: skill.preferredModelId,
          preferredModelLabel: skill.preferredModelLabel,
        })
      );
    }

    router.push("/skills/run");
  }

  function handleModelChange(nextModelId: string) {
    setSelectedModelId(nextModelId);
    if (typeof window !== "undefined") {
      localStorage.setItem(SKILL_MODEL_STORAGE_KEY, nextModelId);
    }
  }

  return (
    <div data-flush-layout className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--color-canvas-default)]">
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <section className="rounded-lg bg-white shadow-[0_6px_18px_rgba(31,41,55,0.08)]">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-[var(--color-accent-fg)]" />
              <h1 className="text-sm font-semibold text-[var(--color-fg-default)]">
                {viewMode === "library" ? "Skills" : draftMode === "new" ? "New Skill Draft" : "Refine Skill"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {viewMode === "library" ? (
                <>
                  <Badge variant="done">Library first</Badge>
                  <Badge variant="default">Browse and inspect</Badge>
                  <Badge variant="info">Repo at runtime</Badge>
                </>
              ) : (
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setViewMode("library")}>
                  Back to library
                </Button>
              )}
            </div>
          </div>
        </section>

        {viewMode === "create" ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
            <div className="grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <Card className="flex min-h-0 flex-col overflow-hidden border-0 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <CardHeader className="px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm">Draft workspace</CardTitle>
                      <CardDescription>Draft the reusable skill contract and review each revision.</CardDescription>
                    </div>
                    <label className="grid gap-1 text-[11px] text-[var(--color-fg-subtle)]">
                      <span className="font-medium uppercase tracking-[0.08em]">Model</span>
                      <select
                        value={selectedModel?.id ?? ""}
                        onChange={(event) => handleModelChange(event.target.value)}
                        disabled={copilotModelsLoading || copilotModels.length === 0}
                        className="h-9 min-w-[180px] rounded-md border border-[var(--color-border-muted)] bg-white px-3 text-sm text-[var(--color-fg-default)]"
                      >
                        {copilotModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3">
                  <div className="flex items-center justify-between gap-3 rounded-md bg-[#f3f6fa] px-3 py-2 text-[11px] text-[var(--color-fg-subtle)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="truncate">
                      {draftMode === "new"
                        ? "New draft session"
                        : `Refining ${selectedSkill?.name ?? "selected skill"}`}
                    </div>
                    <div className="truncate">
                      {modelLoadError ? "Model list fallback" : selectedModel?.description ?? "Backend model selected"}
                    </div>
                  </div>

                  <div className="rounded-md bg-[#0f1720] px-3 py-2 text-[#d7e0ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/10 pb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8ea0b5]">
                      <span>Draft history</span>
                      {isDrafting ? (
                        <div className="flex items-center gap-2 text-[#b7c6d6]">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          syncing
                        </div>
                      ) : (
                        <span>{draftHistory.length} entries</span>
                      )}
                    </div>
                    <div className="h-44 space-y-2 overflow-y-auto pr-1">
                      {draftHistory.map((entry, index) => (
                        <div key={entry.id} className="rounded-md border border-white/8 bg-white/4 px-3 py-2 font-mono shadow-[0_1px_2px_rgba(0,0,0,0.16)]">
                          <div className="flex items-center justify-between gap-3 text-[11px] text-[#8ea0b5]">
                            <div className="flex items-center gap-2">
                              <span className="text-[#73c991]">{index === 0 ? "HEAD" : `rev-${String(draftHistory.length - index).padStart(2, "0")}`}</span>
                              <span>{entry.id.slice(-6)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {entry.modelLabel ? <span>{entry.modelLabel}</span> : null}
                              <span>{timeAgo(entry.createdAt)}</span>
                            </div>
                          </div>
                          <div className="mt-1 text-xs leading-6 text-[#e6edf3]">
                            <span className="mr-2 text-[#73c991]">+</span>
                            {entry.summary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col rounded-md bg-[#f3f6fa] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[var(--color-fg-default)]">Skill instructions</div>
                        <div className="text-xs text-[var(--color-fg-subtle)]">
                          Write the contract the model should turn into a reusable saved skill: workflow, outputs, evidence rules, and operator guardrails.
                        </div>
                      </div>
                      {selectedModel ? (
                        <Badge variant={selectedModel.tier === "thinker" ? "done" : "info"}>{selectedModel.label}</Badge>
                      ) : null}
                    </div>

                    <textarea
                      value={draftPrompt}
                      onChange={(event) => setDraftPrompt(event.target.value)}
                      placeholder="Describe the skill behavior, expected outputs, runtime contract, and guardrails."
                      className="min-h-0 flex-1 rounded-md border border-[var(--color-border-muted)] bg-white px-3 py-3 text-sm leading-6 text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)]"
                    />

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] leading-5 text-[var(--color-fg-subtle)]">
                        {modelLoadError
                          ? modelLoadError
                          : "Draft updates now go through the backend copilot service using the selected model."}
                      </div>
                      <Button size="sm" className="gap-2" onClick={handleDraftSubmit} disabled={isDrafting || !draftPrompt.trim()}>
                        {isDrafting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Update draft
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex min-h-0 flex-col overflow-hidden border-0 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                <CardHeader className="px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm">Draft preview</CardTitle>
                      <CardDescription>Review the contract before saving it to the library</CardDescription>
                    </div>
                    <Button size="sm" className="gap-2" onClick={handleSaveSkill} disabled={isDrafting}>
                      <Save className="h-4 w-4" />
                      Save skill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3">
                  <div
                    className={cn(
                      "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg shadow-[0_6px_18px_rgba(15,23,42,0.08)] transition-all",
                      isDrafting
                        ? "bg-[linear-gradient(135deg,rgba(16,110,190,0.20)_0%,rgba(255,255,255,0.92)_34%,rgba(115,201,145,0.18)_68%,rgba(16,110,190,0.22)_100%)]"
                        : "bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
                    )}
                  >
                    {isDrafting ? (
                      <div className="pointer-events-none absolute inset-0 trooper-shimmer opacity-90" aria-hidden="true" />
                    ) : null}
                    <div className={cn("min-h-0 flex-1 overflow-y-auto transition-opacity", isDrafting ? "opacity-30" : "opacity-100")}>
                      <SkillSpecView
                        key={`draft-${draftHistory[0]?.id ?? "seed"}`}
                        uiMarkdown={activeUiMarkdown}
                        fullMarkdown={activeFullMarkdown}
                      />
                    </div>
                    {isDrafting ? (
                      <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/82 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-fg-default)] shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-accent-emphasis)]" />
                          Updating draft preview
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {saveNotice ? (
                    <div className="rounded-md border border-[var(--color-success-emphasis)] bg-[var(--color-success-subtle)] px-3 py-2 text-xs text-[var(--color-success-fg)]">
                      {saveNotice}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[340px_minmax(0,1fr)]">
            <Card className="flex min-h-0 flex-col overflow-hidden border-0 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
              <CardHeader className="px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm">Saved skills</CardTitle>
                    <CardDescription>Browse the library first, then inspect or refine a selected skill</CardDescription>
                  </div>
                  <Badge variant="default">{savedSkills.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3">
                <Button size="sm" className="w-full gap-2" onClick={handleStartNewSkill}>
                  <Plus className="h-4 w-4" />
                  New skill draft
                </Button>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fg-subtle)]" />
                  <input
                    value={skillQuery}
                    onChange={(event) => setSkillQuery(event.target.value)}
                    placeholder="Search saved skills"
                    className="h-9 w-full rounded-md border border-[var(--color-border-default)] bg-[var(--color-canvas-overlay)] pl-9 pr-3 text-sm text-[var(--color-fg-default)] placeholder:text-[var(--color-fg-subtle)]"
                  />
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {filteredSkills.length === 0 ? (
                    <div className="rounded-md bg-[#f3f6fa] px-3 py-5 text-sm text-[var(--color-fg-muted)]">
                      {savedSkills.length === 0
                        ? "No saved skills yet. Create one when you need a new reusable workflow."
                        : "No saved skills match this search."}
                    </div>
                  ) : (
                    filteredSkills.map((skill) => {
                      const isSelected = skill.id === selectedSkill?.id;

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => handleLoadSavedSkill(skill)}
                          className={cn(
                            "w-full rounded-md px-3 py-3 text-left transition-colors shadow-[0_4px_12px_rgba(15,23,42,0.06)]",
                            isSelected
                              ? "bg-white ring-1 ring-[var(--color-accent-emphasis)]"
                              : "bg-[#f4f7fb] hover:bg-white"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-[var(--color-fg-default)]">{skill.name}</div>
                              <div className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-fg-subtle)]">{skill.intent}</div>
                            </div>
                            <Badge variant="success">Ready</Badge>
                          </div>
                          <div className="mt-2 text-[11px] text-[var(--color-fg-subtle)]">Saved {timeAgo(skill.createdAt)}</div>
                        </button>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="flex min-h-0 flex-col overflow-hidden border-0 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
              <CardHeader className="px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-sm">Skill detail</CardTitle>
                    <CardDescription>
                      {selectedSkill
                        ? "Review saved skills first, then open one for refinement or later execution."
                        : "Your saved library appears here. Creation is secondary and starts from the left rail."}
                    </CardDescription>
                  </div>
                  {selectedSkill ? (
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="gap-2" onClick={() => handleUseSkill(selectedSkill)}>
                        <Play className="h-4 w-4" />
                        Use skill
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleEditSkill(selectedSkill)}>
                        <PencilRuler className="h-4 w-4" />
                        Refine draft
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDeleteSkill(selectedSkill)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-3 py-3">
                {selectedSkill ? (
                  <div className="flex items-center gap-2 text-xs text-[var(--color-fg-subtle)]">
                    <Badge variant="success">Saved</Badge>
                    <span>Library item</span>
                    <span>•</span>
                    <span>{timeAgo(selectedSkill.createdAt)}</span>
                    <span>•</span>
                    <span>Use skill to choose the target repo at runtime</span>
                  </div>
                ) : (
                  <div className="rounded-md bg-[#f3f6fa] px-3 py-3 text-sm text-[var(--color-fg-muted)]">
                    No skill selected. Pick a saved skill from the left, or start a new draft.
                  </div>
                )}

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-[var(--color-fg-default)]">
                          {selectedSkill?.name ?? "Skills library"}
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">
                          {selectedSkill
                            ? "Saved contract ready for later execution against a selected repository."
                            : "Saved skills should lead the experience. Create only when the library needs something new."}
                        </div>
                      </div>
                      {selectedSkill ? <Badge variant="done">Reusable</Badge> : <Badge variant="default">Library</Badge>}
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    <SkillSpecView
                      key={`library-${selectedSkill?.id ?? "empty"}`}
                      uiMarkdown={activeUiMarkdown}
                      fullMarkdown={activeFullMarkdown}
                    />
                  </div>
                </div>

                {saveNotice ? (
                  <div className="rounded-md border border-[var(--color-success-emphasis)] bg-[var(--color-success-subtle)] px-3 py-2 text-xs text-[var(--color-success-fg)]">
                    {saveNotice}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}