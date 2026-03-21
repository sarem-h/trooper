"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Braces, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MarkdownRenderToolProps = {
  code: string;
  language?: string;
};

export type MarkdownRenderTool = {
  id: string;
  label: string;
  matches: (language?: string) => boolean;
  render: (props: MarkdownRenderToolProps) => React.ReactNode;
};

function normalizeMermaidLabel(label: string) {
  return label.replace(/"/g, "'").trim();
}

function sanitizeMermaidCode(code: string) {
  return code.replace(/(\b[a-zA-Z][\w-]*)\[([^\]\n]+)\]/g, (match, nodeId: string, rawLabel: string) => {
    const label = rawLabel.trim();

    if (!label) return match;
    if (label.startsWith('"') && label.endsWith('"')) return match;

    // Preserve cylinder-style shapes such as [(Database)].
    if (label.startsWith("(") && label.endsWith(")")) return match;

    // Plain alphanumeric labels are usually safe already.
    if (/^[a-zA-Z0-9 _-]+$/.test(label)) return match;

    return `${nodeId}["${normalizeMermaidLabel(label)}"]`;
  });
}

function MermaidToolFrame({ code }: { code: string }) {
  const instanceId = useId();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSource, setShowSource] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      setLoading(true);
      setError(null);

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            fontFamily: "Georgia, 'Times New Roman', serif",
            primaryColor: "#eef5f2",
            primaryBorderColor: "#24533a",
            primaryTextColor: "#122218",
            lineColor: "#355f49",
            secondaryColor: "#f7fbf6",
            tertiaryColor: "#f1ede2",
            clusterBkg: "#f8fbfa",
            clusterBorder: "#9bb7a5",
            background: "#ffffff",
          },
          flowchart: {
            curve: "basis",
            htmlLabels: true,
            nodeSpacing: 35,
            rankSpacing: 45,
            padding: 16,
          },
        });

        const renderId = `trooper-mermaid-${instanceId.replace(/:/g, "-")}`;

        let rendered;
        try {
          rendered = await mermaid.render(renderId, code);
        } catch {
          // Retry once with safer label quoting for common LLM-generated flowchart syntax.
          rendered = await mermaid.render(`${renderId}-safe`, sanitizeMermaidCode(code));
        }

        if (!cancelled) {
          setSvg(rendered.svg);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Mermaid rendering failed.");
          setSvg(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, instanceId]);

  return (
    <section className="my-5 overflow-hidden rounded-[18px] border border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcfb_100%)] shadow-[0_10px_24px_rgba(19,31,23,0.05)]">
      <div className="border-b border-[rgba(31,41,55,0.08)] bg-[linear-gradient(180deg,rgba(248,251,250,0.98),rgba(244,247,245,0.96))] px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#24533a]">
              <span className="inline-flex items-center rounded-full border border-[rgba(36,83,58,0.12)] bg-white px-2.5 py-1">Mermaid</span>
              <span className="truncate text-[#6a7f72]">Rendered inline</span>
            </div>
            <h3 className="mt-2 text-sm font-semibold tracking-[-0.01em] text-[#122218]">Architecture diagram</h3>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-white text-[11px]" onClick={() => setShowSource((current) => !current)}>
            <Braces className="h-4 w-4" />
            {showSource ? "Hide source" : "Show source"}
          </Button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="rounded-[14px] border border-[rgba(36,83,58,0.08)] bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center gap-3 text-sm text-[#4f6559]">
              <Loader2 className="h-4 w-4 animate-spin text-[#24533a]" />
              Rendering Mermaid diagram
            </div>
          ) : error ? (
            <div className="rounded-xl border border-[var(--color-warning-emphasis)] bg-[var(--color-warning-subtle)] px-4 py-3 text-sm text-[var(--color-warning-fg)]">
              Mermaid rendering failed. Showing source instead. {error}
            </div>
          ) : svg ? (
            <div
              className="mermaid-tool-output overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : null}
        </div>

        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            showSource || Boolean(error) ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="rounded-xl border border-[rgba(31,41,55,0.08)] bg-[#0f1720] px-4 py-4 text-xs text-[#d8e1ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a6b8]">
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", (showSource || Boolean(error)) && "rotate-180")} />
                Mermaid source
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono leading-6">{code}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const markdownRenderTools: MarkdownRenderTool[] = [
  {
    id: "mermaid",
    label: "Mermaid Renderer Tool",
    matches: (language) => language?.toLowerCase() === "mermaid",
    render: ({ code }) => <MermaidToolFrame code={code} />,
  },
];

export function findMarkdownRenderTool(language: string | undefined, tools: MarkdownRenderTool[]) {
  return tools.find((tool) => tool.matches(language));
}

export function findMarkdownRenderToolById(toolId: string | undefined, tools: MarkdownRenderTool[]) {
  if (!toolId) return undefined;
  return tools.find((tool) => tool.id === toolId);
}

export function useMarkdownRenderTools(tools?: MarkdownRenderTool[]) {
  return useMemo(() => tools ?? markdownRenderTools, [tools]);
}