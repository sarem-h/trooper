"use client";

import { useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { findMarkdownRenderTool, findMarkdownRenderToolById, useMarkdownRenderTools, type MarkdownRenderTool } from "@/components/ui/render-tools";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  tools?: MarkdownRenderTool[];
}

type MarkdownSegment =
  | { type: "markdown"; content: string }
  | { type: "tool"; toolId: string; payload: string };

function parseMarkdownSegments(content: string): MarkdownSegment[] {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const segments: MarkdownSegment[] = [];
  let markdownBuffer: string[] = [];

  const flushMarkdown = () => {
    if (markdownBuffer.length === 0) return;
    segments.push({ type: "markdown", content: markdownBuffer.join("\n") });
    markdownBuffer = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const match = line.match(/^:::tool\s+([a-z0-9][\w-]*)\s*$/i);

    if (!match) {
      markdownBuffer.push(line);
      continue;
    }

    const toolId = match[1]?.trim().toLowerCase();
    if (!toolId) {
      markdownBuffer.push(line);
      continue;
    }

    let endIndex = index + 1;
    while (endIndex < lines.length && lines[endIndex]?.trim() !== ":::") {
      endIndex += 1;
    }

    if (endIndex >= lines.length) {
      markdownBuffer.push(line);
      continue;
    }

    flushMarkdown();
    segments.push({
      type: "tool",
      toolId,
      payload: lines.slice(index + 1, endIndex).join("\n").trim(),
    });
    index = endIndex;
  }

  flushMarkdown();

  return segments;
}

function getTextContent(children: ComponentPropsWithoutRef<"code">["children"]): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === "string") return child;
        if (typeof child === "number") return String(child);
        if (child && typeof child === "object" && "props" in child) {
          return getTextContent((child as { props?: { children?: ComponentPropsWithoutRef<"code">["children"] } }).props?.children);
        }
        return "";
      })
      .join("");
  }
  if (typeof children === "number") return String(children);
  if (children && typeof children === "object" && "props" in children) {
    return getTextContent((children as { props?: { children?: ComponentPropsWithoutRef<"code">["children"] } }).props?.children);
  }
  return "";
}

export function MarkdownRenderer({ content, className, tools }: MarkdownRendererProps) {
  if (!content) return null;
  const activeTools = useMarkdownRenderTools(tools);
  const segments = useMemo(() => parseMarkdownSegments(content), [content]);

  return (
    <div className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "tool") {
          const tool = findMarkdownRenderToolById(segment.toolId, activeTools);
          if (tool) {
            return <div key={`tool-${segment.toolId}-${index}`}>{tool.render({ code: segment.payload, language: segment.toolId })}</div>;
          }

          return (
            <pre key={`tool-fallback-${segment.toolId}-${index}`} className="bg-[var(--color-canvas-inset)] border border-[var(--color-border-muted)] rounded-md p-3 mb-3 overflow-x-auto text-xs font-mono text-[var(--color-fg-default)]">
              <code>{`:::tool ${segment.toolId}\n${segment.payload}\n:::`}</code>
            </pre>
          );
        }

        if (!segment.content.trim()) {
          return null;
        }

        return (
          <ReactMarkdown
            key={`markdown-${index}`}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="text-xl font-bold text-[var(--color-fg-default)] mt-6 mb-3 pb-2 border-b border-[var(--color-border-muted)]">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mt-5 mb-2 pb-1.5 border-b border-[var(--color-border-muted)]">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-semibold text-[var(--color-fg-default)] mt-4 mb-2">
                  {children}
                </h3>
              ),

              // Paragraphs
              p: ({ children }) => (
                <p className="text-sm text-[var(--color-fg-default)] mb-3 leading-relaxed">
                  {children}
                </p>
              ),

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-sm text-[var(--color-fg-default)] mb-3 space-y-1 ml-2">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-sm text-[var(--color-fg-default)] mb-3 space-y-1 ml-2">
                  {children}
                </ol>
              ),

              // Code blocks
              code: ({ className: codeClassName, children, ...props }) => {
                const languageMatch = codeClassName?.match(/language-([\w-]+)/);
                const language = languageMatch?.[1];
                const isInline = !codeClassName;
                if (isInline) {
                  return (
                    <code className="bg-[var(--color-canvas-subtle)] text-[var(--color-fg-default)] text-xs px-1.5 py-0.5 rounded font-mono border border-[var(--color-border-muted)]">
                      {children}
                    </code>
                  );
                }

                const tool = findMarkdownRenderTool(language, activeTools);
                if (tool) {
                  return tool.render({ code: getTextContent(children).trim(), language });
                }

                return (
                  <code className={`text-xs font-mono ${codeClassName ?? ""}`} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-[var(--color-canvas-inset)] border border-[var(--color-border-muted)] rounded-md p-3 mb-3 overflow-x-auto text-xs font-mono text-[var(--color-fg-default)]">
                  {children}
                </pre>
              ),

              // Blockquotes
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[var(--color-border-default)] pl-4 text-sm text-[var(--color-fg-muted)] mb-3 italic">
                  {children}
                </blockquote>
              ),

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent-fg)] hover:underline text-sm"
                >
                  {children}
                </a>
              ),

              // Images
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt ?? ""}
                  className="max-w-full rounded-md my-2"
                  loading="lazy"
                />
              ),

              // Tables
              table: ({ children }) => (
                <div className="overflow-x-auto mb-3">
                  <table className="min-w-full text-xs border border-[var(--color-border-muted)] rounded-md">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-[var(--color-canvas-subtle)] px-3 py-2 text-left font-semibold text-[var(--color-fg-default)] border-b border-[var(--color-border-muted)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-3 py-2 text-[var(--color-fg-default)] border-b border-[var(--color-border-muted)]">
                  {children}
                </td>
              ),

              // Horizontal rule
              hr: () => (
                <hr className="border-[var(--color-border-muted)] my-4" />
              ),

              // Task list items
              input: ({ checked, ...props }) => (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-1.5 accent-[var(--color-accent-fg)]"
                  {...props}
                />
              ),
            }}
          >
            {segment.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
