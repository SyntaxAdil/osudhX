// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border/60 shadow-sm">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading content, please wait...
        </p>
      </div>
    </div>
  );
}