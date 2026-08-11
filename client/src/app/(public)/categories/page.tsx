// src/app/categories/page.tsx
import { categoriesMetadata } from "./metadata";
import { CategoriesContainer } from "@/components/pages/public/categories/categories-container";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata = categoriesMetadata;

export default function CategoriesPage() {
  return (
    <main className="w-full py-12 px-4 md:px-6 lg:px-8 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader
          title="Medicine Categories"
          description="Explore all available medicine categories to find treatments efficiently."
          align="left"
        />

        <CategoriesContainer />
      </div>
    </main>
  );
}