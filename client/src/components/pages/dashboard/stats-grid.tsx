// src/components/pages/dashboard/stats-grid.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StatItem } from "@/types/dashboard";

interface StatsGridProps {
  stats: StatItem[];
  columns?: 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridColsClass =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-4`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-6 rounded-2xl border border-border/60 bg-card shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <span className={`p-2 rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h3
                className={`text-2xl font-bold ${
                  stat.isDestructive ? "text-destructive" : "text-foreground"
                }`}
              >
                {stat.value}
              </h3>
              {stat.trend && (
                <span
                  className={`flex items-center text-xs font-semibold ${
                    stat.trend.isPositive ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {stat.trend.isPositive ? (
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-0.5" />
                  )}
                  {stat.trend.value}
                </span>
              )}
              {stat.trend?.label && !stat.trend.value && (
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.trend.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}