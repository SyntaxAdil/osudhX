// app/error.tsx
"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="p-4 rounded-3xl bg-destructive/10 text-destructive mb-6">
        <AlertTriangle className="h-16 w-16" />
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
        Something went wrong!
      </h2>

      <p className="text-muted-foreground max-w-md mb-8">
        {error.message || "An unexpected error occurred. Please try again later."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/60 bg-card text-foreground font-semibold shadow-sm hover:bg-muted/50 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}