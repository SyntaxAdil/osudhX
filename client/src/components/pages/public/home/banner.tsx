import Link from "next/link";
import { Button } from "@/components/ui/button";

function Banner() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32 min-h-[88dvh]">
      {/* Optional subtle background grid effect matching the aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 md:pt-26">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-16">
          Simplify Every Part of Your <br />
          <span className="text-primary">Pharmacy Operations.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
          A clinically precise, intelligent platform to manage inventory,
          process orders, and track patient consultations with unparalleled
          efficiency.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg" className="cursor-pointer">
              Get Started
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="cursor-pointer">
              Browse Medicines
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
export default Banner;
