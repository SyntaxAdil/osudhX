import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import Logo from "../ui/logo";
import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";

const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/medicines" },
  { name: "Categories", href: "/categories" },
  
] as const;

const SOCIAL_LINKS = [
  {
    icon: FaGithub,
    label: "GitHub",
    href: "#",
  },
  {
    icon: FaTwitter,
    label: "Twitter",
    href: "#",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "#",
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />

            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Smart pharmacy management made simple, efficient, and accessible
              for modern pharmacies.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-background text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="size-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Navigation
            </h3>

            <nav className="flex flex-col gap-3">
              {NAVIGATION_LINKS.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Support
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    support@osudhx.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaPhone className="mt-0.5 size-4 -scale-x-100 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    +880 1234-567890
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Our Location
            </h3>

            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-0.5 size-4 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium text-foreground">
                  Dhaka, Bangladesh
                </p>

                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Built for modern pharmacies and healthcare businesses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-3 border-t border-border/60 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OsudhX. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <p>
              Built By
              <span className="font-medium text-md text-foreground">
                <a
                  href="https://github.com/syntaxadil"
                  target="_blank"
                  className={cn(buttonVariants({ variant: "link" }))}
                >
                  Abdur Rahman
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
