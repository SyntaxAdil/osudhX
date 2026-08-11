import { medicinesMetadata } from "./metadata";
import { MedicinesContainer } from "@/components/pages/public/medicines/medicines-container";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata = medicinesMetadata;

export default function MedicinesPage() {
  return (
    <main className="w-full py-12 px-4 md:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader
          title="Browse Medicines"
          description="Find authentic medicines, view details, and place orders directly from verified sources."
          align="left"
        />

        <MedicinesContainer />
      </div>
    </main>
  );
}
