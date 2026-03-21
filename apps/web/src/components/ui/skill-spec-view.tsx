"use client";

import { useMemo, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";

type ParsedSkillSection = {
  key: string;
  title: string;
  content: string;
  items: string[];
  paragraphs: string[];
};

type ParsedSkillSpec = {
  title: string;
  summary: string;
  outputs?: ParsedSkillSection;
  bestFor?: ParsedSkillSection;
  collapsibleSections: ParsedSkillSection[];
};

interface SkillSpecViewProps {
  uiMarkdown?: string | null;
  fullMarkdown?: string | null;
  className?: string;
}

function normalizeSectionTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function parseSectionContent(content: string) {
  const lines = content.split("\n");
  const items: string[] = [];
  const paragraphs: string[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    paragraphs.push(paragraphBuffer.join(" ").trim());
    paragraphBuffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    const listMatch = trimmed.match(/^([-*+]|(\d+\.))\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      if (listMatch[3]?.trim()) {
        items.push(listMatch[3].trim());
      }
      continue;
    }

    if (!trimmed.startsWith("#")) {
      paragraphBuffer.push(trimmed);
    }
  }

  flushParagraph();

  return { items, paragraphs };
}

function parseSkillSpec(markdown?: string | null): ParsedSkillSpec | null {
  if (!markdown?.trim()) return null;

  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  const titleMatch = normalized.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() || "Saved Skill";
  const bodyWithoutTitle = normalized.replace(/^#\s+.+\n?/, "").trim();
  const sectionMatches = Array.from(bodyWithoutTitle.matchAll(/^##\s+(.+)$/gm));

  const sections: ParsedSkillSection[] = [];
  let summary = "";

  if (sectionMatches.length === 0) {
    const { items, paragraphs } = parseSectionContent(bodyWithoutTitle);
    summary = paragraphs[0] ?? "";

    return {
      title,
      summary,
      collapsibleSections:
        items.length > 0 || paragraphs.length > 1
          ? [
              {
                key: "details",
                title: "Details",
                content: bodyWithoutTitle,
                items,
                paragraphs: paragraphs.slice(summary ? 1 : 0),
              },
            ]
          : [],
    };
  }

  const intro = bodyWithoutTitle.slice(0, sectionMatches[0]?.index ?? 0).trim();
  if (intro) {
    summary = intro.replace(/\n+/g, " ").trim();
  }

  for (let index = 0; index < sectionMatches.length; index += 1) {
    const current = sectionMatches[index];
    const next = sectionMatches[index + 1];
    const titleText = current[1]?.trim() ?? "Section";
    const contentStart = (current.index ?? 0) + current[0].length;
    const contentEnd = next?.index ?? bodyWithoutTitle.length;
    const content = bodyWithoutTitle.slice(contentStart, contentEnd).trim();
    const { items, paragraphs } = parseSectionContent(content);

    sections.push({
      key: normalizeSectionTitle(titleText),
      title: titleText,
      content,
      items,
      paragraphs,
    });
  }

  const summarySection = sections.find((section) => section.key === "summary");
  if (!summary && summarySection) {
    summary = summarySection.paragraphs[0] ?? summarySection.items[0] ?? "";
  }

  const outputs = sections.find((section) => section.key === "outputs");
  const bestFor = sections.find((section) => section.key === "best for");
  const hiddenSectionKeys = new Set(["summary", "outputs", "best for"]);

  return {
    title,
    summary,
    outputs,
    bestFor,
    collapsibleSections: sections.filter((section) => !hiddenSectionKeys.has(section.key)),
  };
}

function renderTextBlock(section: ParsedSkillSection) {
  if (section.items.length > 0) {
    return (
      <ul className="space-y-2 text-sm text-[var(--color-fg-default)]">
        {section.items.map((item) => (
          <li key={item} className="flex gap-2 leading-6">
            <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent-emphasis)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2 text-sm leading-6 text-[var(--color-fg-default)]">
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function renderWorkflow(section: ParsedSkillSection) {
  const steps = section.items.length > 0 ? section.items : section.paragraphs;

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={`${section.key}-${index}`} className="flex gap-3 rounded-md bg-[var(--color-canvas-subtle)] px-3 py-3">
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-xs font-semibold text-[var(--color-accent-fg)]">
            {index + 1}
          </div>
          <div className="text-sm leading-6 text-[var(--color-fg-default)]">{step}</div>
        </div>
      ))}
    </div>
  );
}

function DisclosureSection({ section, defaultOpen = false }: { section: ParsedSkillSection; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const normalizedKey = normalizeSectionTitle(section.title);
  const isWorkflow = normalizedKey === "how it works" || normalizedKey === "workflow" || normalizedKey === "execution workflow";

  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div>
          <div className="text-sm font-semibold text-[var(--color-fg-default)]">{section.title}</div>
          <div className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">{open ? "Hide details" : "Show details"}</div>
        </div>
        <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-200", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80")}>
        <div className="overflow-hidden">
          <div className="border-t border-[var(--color-border-muted)] px-4 py-4">
            {isWorkflow ? renderWorkflow(section) : renderTextBlock(section)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillSpecView({ uiMarkdown, fullMarkdown, className }: SkillSpecViewProps) {
  const [showFullSpec, setShowFullSpec] = useState(false);
  const parsed = useMemo(() => parseSkillSpec(uiMarkdown), [uiMarkdown]);
  const fallbackMarkdown = fullMarkdown?.trim() || uiMarkdown?.trim() || "";
  const shouldUseStructuredView = Boolean(
    uiMarkdown?.trim() &&
      parsed &&
      (parsed.summary || parsed.outputs || parsed.bestFor || parsed.collapsibleSections.length > 0)
  );

  if (!fallbackMarkdown) {
    return null;
  }

  if (!shouldUseStructuredView || !parsed) {
    return (
      <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4", className)}>
        <MarkdownRenderer
          content={fallbackMarkdown}
          className="[&_h1]:mt-0 [&_h1]:text-2xl [&_h1]:font-semibold [&_table]:bg-white [&_pre]:bg-slate-950 [&_pre]:text-slate-100"
        />
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4", className)}>
      <div className="rounded-xl border border-[var(--color-border-default)] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">Skill</Badge>
          <Badge variant="default">UI spec</Badge>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-fg-default)]">{parsed.title}</h2>
        {parsed.summary ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-fg-muted)]">{parsed.summary}</p> : null}
      </div>

      {parsed.outputs || parsed.bestFor ? (
        <div className="grid gap-4 md:grid-cols-2">
          {parsed.outputs ? (
            <div className="rounded-xl border border-[var(--color-border-default)] bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="done">Outputs</Badge>
              </div>
              {renderTextBlock(parsed.outputs)}
            </div>
          ) : null}

          {parsed.bestFor ? (
            <div className="rounded-xl border border-[var(--color-border-default)] bg-white px-4 py-4 shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="success">Best For</Badge>
              </div>
              {renderTextBlock(parsed.bestFor)}
            </div>
          ) : null}
        </div>
      ) : null}

      {parsed.collapsibleSections.length > 0 ? (
        <div className="space-y-3">
          {parsed.collapsibleSections.map((section, index) => (
            <DisclosureSection
              key={`${section.key}-${index}`}
              section={section}
              defaultOpen={index === 0 && normalizeSectionTitle(section.title) === "how it works"}
            />
          ))}
        </div>
      ) : null}

      {fullMarkdown?.trim() ? (
        <div className="rounded-xl border border-[var(--color-border-default)] bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-[var(--color-fg-default)]">Full specification</div>
              <div className="mt-0.5 text-xs text-[var(--color-fg-subtle)]">Reveal the execution-grade contract used when the skill runs.</div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFullSpec((current) => !current)}>
              <FileText className="h-4 w-4" />
              {showFullSpec ? "Hide Full Specification" : "View Full Specification"}
            </Button>
          </div>
          <div className={cn("grid transition-all duration-300 ease-out", showFullSpec ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-80")}>
            <div className="overflow-hidden">
              <div className="border-t border-[var(--color-border-muted)] px-4 py-4">
                <MarkdownRenderer
                  content={fullMarkdown}
                  className="[&_h1]:mt-0 [&_h1]:text-2xl [&_h1]:font-semibold [&_table]:bg-white [&_pre]:bg-slate-950 [&_pre]:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}