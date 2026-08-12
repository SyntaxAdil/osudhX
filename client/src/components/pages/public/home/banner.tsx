"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "../../../../lib/auth-client";
import { ArrowRight, LayoutDashboard, Search } from "lucide-react";

function Banner() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-20 min-h-[88dvh]">
      {/* Optional subtle background grid effect matching the aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center md:pt-26">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-16">
          Simplify Every Part of Your <br />
          <span className="text-primary">Pharmacy Operations.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg px-2">
          A clinically precise, intelligent platform to manage inventory,
          process orders, and track patient consultations with unparalleled
          efficiency.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 px-2">
          {/* Conditional CTA based on user authentication */}
          {user ? (
            <Link href="/dashboard">
              <Button className="h-11 px-6 cursor-pointer gap-2 text-base font-medium">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button className="h-11 px-6 cursor-pointer gap-2 text-base font-medium">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <Link href="/medicines">
            <Button variant="outline" className="h-11 px-6 cursor-pointer gap-2 text-base font-medium">
              <Search className="h-4 w-4" />
              <span>Browse Medicines</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Banner;