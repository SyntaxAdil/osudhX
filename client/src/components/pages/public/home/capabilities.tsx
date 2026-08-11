// components/capabilities.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShieldCheck,
  PackageSearch,
  ShoppingCart,
  BarChart3,
  Truck,
  FileCheck2,
} from "lucide-react";
import { SectionHeader } from "../../../shared/section-header";

interface CapabilityItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const capabilitiesData: CapabilityItem[] = [
  {
    icon: ShieldCheck,
    title: "Secure User Access",
    description:
      "Secure authentication with role-based access for customers and administrators.",
  },
  {
    icon: PackageSearch,
    title: "Medicine Management",
    description:
      "Organize medicines with categories, stock availability, pricing, and product information.",
  },
  {
    icon: ShoppingCart,
    title: "Easy Ordering",
    description:
      "Simple and efficient medicine ordering with quantity management and order tracking.",
  },
  {
    icon: BarChart3,
    title: "Order Tracking",
    description:
      "Track orders from pending and confirmation through shipping and final delivery.",
  },
  {
    icon: Truck,
    title: "Inventory & Stock",
    description:
      "Monitor medicine stock levels and keep product availability up to date.",
  },
  {
    icon: FileCheck2,
    title: "Order Management",
    description:
      "Manage customer orders with clear status updates, order details, and delivery information.",
  },
];

export function Capabilities() {
  return (
    <section className="w-full py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Core Capabilities"
          description="Engineered for precision, designed for speed. Everything you need to run a modern clinical pharmacy."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {capabilitiesData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={index}
                className="border-border/60 bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 group"
              >
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
