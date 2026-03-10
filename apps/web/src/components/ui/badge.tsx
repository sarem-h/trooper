import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-border-default)] bg-[var(--color-canvas-subtle)] text-[var(--color-fg-default)]",
        success:
          "border-[var(--color-accent-emphasis)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-fg)]",
        danger:
          "border-[var(--color-danger-emphasis)] bg-[var(--color-danger-subtle)] text-[var(--color-danger-fg)]",
        warning:
          "border-[var(--color-warning-emphasis)] bg-[var(--color-warning-subtle)] text-[var(--color-warning-fg)]",
        info: "border-[var(--color-info-emphasis)] bg-[var(--color-info-subtle)] text-[var(--color-info-fg)]",
        done: "border-[var(--color-done-emphasis)] bg-[var(--color-done-subtle)] text-[var(--color-done-fg)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
