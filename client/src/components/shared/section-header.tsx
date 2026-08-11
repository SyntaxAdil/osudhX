import React from "react";
import Link from "next/link";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description: string;
  align?: "center" | "left";
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function SectionHeader({
  badge,
  title,
  description,
  align = "left",
  actionText,
  actionHref,
  onActionClick,
}: SectionHeaderProps) {
  const hasAction = actionText && (actionHref || onActionClick);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/40 ${
        align === "center" ? "text-center sm:text-center sm:flex-col mx-auto max-w-2xl" : "text-left"
      }`}
    >
      <div className={`space-y-1.5 ${align === "center" ? "mx-auto" : ""}`}>
        {badge && (
          <span className="inline-block text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-1">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      {hasAction && (
        <div className={align === "center" ? "mx-auto mt-2" : "self-start sm:self-auto"}>
          {actionHref ? (
            <Link
              href={actionHref}
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group"
            >
              <span>{actionText}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group cursor-pointer"
            >
              <span>{actionText}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}