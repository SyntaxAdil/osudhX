import { PackageX } from "lucide-react";

interface NoDataProps {
  title?: string;
  message?: string;
}

export function NoData({
  title = "No Data Found",
  message = "There are no items to display at the moment.",
}: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border/60 bg-muted/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <PackageX className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}