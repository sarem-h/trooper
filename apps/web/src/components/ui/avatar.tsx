import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

function Avatar({ className, src, alt, fallback, size = "md", ...props }: AvatarProps) {
  const initials = fallback ?? alt?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-canvas-inset)] text-[var(--color-fg-muted)] font-medium",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt ?? ""} className="h-full w-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
