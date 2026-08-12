// app/not-found.tsx
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="p-4 rounded-3xl bg-primary/10 text-primary mb-6 animate-bounce">
        <FileQuestion className="h-16 w-16" />
      </div>
      
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
        Page Not Found
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-90 transition-opacity"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}