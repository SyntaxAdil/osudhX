"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import AvatarDropdown from "../ui/avatar-dropdown";
import { useSession } from "../../lib/auth-client";
import Logo from "../ui/logo";

const Navbar = () => {
  const NavLinks = [
    { id: 1, href: "/", label: "Home" },
    { id: 2, href: "/medicines", label: "Medicines" },
    { id: 3, href: "/categories", label: "Categories" },
  ];
  //   navlink
  const active = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // user data
  const { data: session, refetch, isPending } = useSession();
  const user = session?.user;

  // handle nav butttons
  const handleNavButtons = (className: string, isHide?: boolean) => {
    return user ? (
      <div className={isHide ? "hidden md:block" : ""}>
        <AvatarDropdown user={user} />
      </div>
    ) : (
      <div className={className}>
        <Button
          onClick={() => handleNavigation("/login")}
          className="cursor-pointer"
          variant="link"
        >
          Sign In
        </Button>
        <Button
          onClick={() => handleNavigation("/register")}
          className="px-5 rounded-md font-bold cursor-pointer"
        >
          Start Writing
        </Button>
      </div>
    );
  };
  // render nav links
  const renderLinks = (isMobile = false) =>
    NavLinks.map((link) => (
      <li key={`${isMobile ? "mobile" : "desktop"}-${link.id}`}>
        <Link
          onClick={() => setIsMenuOpen(false)}
          className={` transition-colors duration-200 block font-medium py-2 ${active === link.href ? "text-primary" : "hover:text-primary"}`}
          href={link.href}
        >
          {link.label}
        </Link>
      </li>
    ));

  // handle Navigation function
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setIsMenuOpen((p) => !p);
    router.push(href);
  };
  return (
    <header className="border-b border-accent fixed top-0 left-0 right-0 z-40 ">
      <nav className="flex items-center justify-between container max-w-7xl mx-auto h-16 px-4 relative z-50 bg-background">
        <h1 className="text-2xl font-bold">
          <Link href={"/"}>
            <Logo />
          </Link>
        </h1>

        <ul className="hidden md:flex items-center gap-6">
          {renderLinks(false)}
        </ul>

        {/* nav buttons desktop */}
        {handleNavButtons("hidden md:flex items-center gap-4", true)}

        <Button
          onClick={() => setIsMenuOpen((p) => !p)}
          variant="ghost"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          aria-expanded={isMenuOpen}
          className="rounded-sm cursor-pointer block md:hidden z-50"
        >
          {isMenuOpen ? <FaX size={18} /> : <FaBars size={18} />}
        </Button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 backdrop-blur-sm md:hidden">
          <div className="fixed left-0 top-0 h-full w-full max-w-xs border-r border-accent bg-background p-6 pt-20 flex flex-col justify-between shadow-md animate-in slide-in-from-left duration-300">
            <div>
              <ul className="space-y-4 text-left">{renderLinks(true)}</ul>
            </div>
            {/* nav buttons mobile */}
            {handleNavButtons(
              "flex flex-col gap-3 pt-6 border-t border-accent",
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
