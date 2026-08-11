"use client";

import { MedicineCard } from "@/components/card/medicine-card";
import { SectionHeader } from "../../../shared/section-header";

interface Product {
  id: string;
  name: string;
  genericName?: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  image: string;
  strength?: string;
  manufacturer?: string;
  stock?: number;
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Atorvastatin Calcium",
    genericName: "Generic Lipitor",
    category: "Cardiovascular",
    price: 1245,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=500",
    strength: "20mg",
    manufacturer: "Pfizer",
    stock: 50,
  },
  {
    id: "2",
    name: "Amoxicillin",
    genericName: "Generic Amoxil",
    category: "Antibiotic",
    price: 890,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=500",
    strength: "500mg",
    manufacturer: "GSK",
    stock: 30,
  },
  {
    id: "3",
    name: "Ibuprofen",
    genericName: "Generic Advil",
    category: "Pain Relief",
    price: 550,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=500",
    strength: "400mg",
    manufacturer: "Kenvue",
    stock: 100,
  },
  {
    id: "4",
    name: "Albuterol Sulfate",
    genericName: "ProAir HFA",
    category: "Respiratory",
    price: 3200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=500",
    strength: "90mcg",
    manufacturer: "Teva",
    stock: 15,
  },
];

export function FeaturedMedicines() {
  return (
    <section className="w-full py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Reusable SectionHeader Component */}
        <SectionHeader
          title="Featured Products"
          description="Top requested medicines available through our network."
          actionText="View Catalog"
          actionHref="/catalog"
          align="left"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <MedicineCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              image={product.image}
              manufacturer={product.manufacturer}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
