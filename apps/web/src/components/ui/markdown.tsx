"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={className}>
      <ReactMarkdown
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
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code className="bg-[var(--color-canvas-subtle)] text-[var(--color-fg-default)] text-xs px-1.5 py-0.5 rounded font-mono border border-[var(--color-border-muted)]">
                  {children}
                </code>
              );
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
