import { medicineDetailMetadata } from "./metadata";
import { MedicineDetailContainer } from "@/components/pages/public/medicines/medicine-detail-container";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = medicineDetailMetadata;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MedicineDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="w-full py-12 px-4 md:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link
          href="/medicines"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Medicines
        </Link>

        <MedicineDetailContainer id={id} />
      </div>
    </main>
  );
}