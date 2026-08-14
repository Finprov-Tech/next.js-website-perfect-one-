'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { EnquireModal } from "@/components/site/EnquireModal";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import finprovMark from "@/assets/finprov-mark.jpeg";
import { cn } from "@/lib/utils";
import { scrollToSection, scrollToTop } from "@/lib/scroll";

const container = "mx-auto w-full max-w-[1400px]";

type NavItem = { label: string; hash?: string; to?: string };

const navLinks: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses" },
  { label: "Placements", to: "/placement" },
  { label: "Business", to: "/business" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const sectionIds = ["home", "about", "courses", "placements"];

const logoSrc = typeof finprovMark === "string" ? finprovMark : (finprovMark as any)?.src || "/finprov-mark.jpeg";

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const onHome = pathname === "/";

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy: highlight the nav item for the section currently in view when on homepage
  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [onHome]);

  const isItemActive = (item: NavItem) => {
    if (item.to === "/") {
      return onHome && (activeSection === "home" || !hash) && activeSection !== "contact";
    }
    if (item.to) {
      return pathname === item.to || pathname.startsWith(`${item.to}/`);
    }
    return onHome && activeSection === item.hash;
  };

  const handleHomeNavigation = (e?: React.MouseEvent) => {
    if (onHome) {
      if (e) e.preventDefault();
      scrollToTop();
      setActiveSection("home");
      if (window.location.hash) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleHashClick = (item: NavItem, customOnClick?: () => void) => {
    if (customOnClick) customOnClick();
    if (!item.to && item.hash && onHome) {
      scrollToSection(item.hash);
    }
  };

  const renderLink = (item: NavItem, className: string, onClick?: () => void) => {
    if (item.to === "/") {
      return (
        <Link
          href="/"
          className={className}
          onClick={(e) => {
            if (onClick) onClick();
            handleHomeNavigation(e);
          }}
          onMouseEnter={() => setHovered(item.label)}
        >
          {navLabel(item)}
        </Link>
      );
    }

    if (item.to) {
      return (
        <Link href={item.to} className={className} onClick={onClick} onMouseEnter={() => setHovered(item.label)}>
          {navLabel(item)}
        </Link>
      );
    }

    return (
      <Link
        href={`/#${item.hash}`}
        className={className}
        onClick={() => handleHashClick(item, onClick)}
        onMouseEnter={() => setHovered(item.label)}
      >
        {navLabel(item)}
      </Link>
    );
  };

  const navLabel = (item: NavItem) => (
    <>
      {hovered === item.label && (
        <motion.span
          layoutId="nav-hover-pill"
          className="absolute inset-0 rounded-full bg-navy/[0.06]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative">{item.label}</span>
      {isItemActive(item) && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-teal to-cta"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
    </>
  );

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 bg-navy px-3 pt-3 sm:px-5"
    >
      <div
        className={cn(
          `${container} glass gloss-soft flex items-center justify-between rounded-[26px] px-5 transition-all duration-300 sm:px-7`,
          scrolled ? "h-[64px] shadow-xl shadow-navy/10" : "h-[74px]",
        )}
      >
        <Link
          href="/"
          onClick={handleHomeNavigation}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Finprov home"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="h-11 w-11 overflow-hidden rounded-2xl bg-white shadow-e2 ring-1 ring-navy/5"
          >
            <img src={logoSrc} alt="" className="h-full w-full object-cover" />
          </motion.div>
          <span className="text-xl font-extrabold tracking-wide text-navy">
            FINPROV
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-cta" />
          </span>
        </Link>

        <motion.nav
          className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex"
          onMouseLeave={() => setHovered(null)}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
        >
          {navLinks.map((item) => (
            <motion.div
              key={item.label}
              variants={{ hidden: { opacity: 0, y: -14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderLink(
                item,
                cn(
                  "relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors xl:px-3.5",
                  isItemActive(item) ? "text-navy" : "text-navy/70 hover:text-navy",
                ),
              )}
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          className="flex shrink-0 items-center gap-2.5 xl:gap-3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-white shadow-e2 transition-[background-color,box-shadow] duration-200 hover:bg-cta-hover hover:shadow-e3 sm:inline-flex"
          >
            <PhoneCall className="h-4 w-4" /> Call Me Back
          </motion.button>
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="frost-light grid h-10 w-10 place-items-center rounded-xl text-navy lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </motion.div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-full max-w-xs">
          <SheetHeader>
            <SheetTitle className="text-navy">Menu</SheetTitle>
          </SheetHeader>
          <motion.nav
            className="mt-8 flex flex-col gap-1"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
          >
            {navLinks.map((item) => (
              <motion.div
                key={item.label}
                variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <SheetClose asChild>
                  {item.to === "/" ? (
                    <Link
                      href="/"
                      onClick={handleHomeNavigation}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-navy/80 transition-colors hover:bg-bg-light hover:text-navy"
                    >
                      {item.label}
                    </Link>
                  ) : item.to ? (
                    <Link
                      href={item.to}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-navy/80 transition-colors hover:bg-bg-light hover:text-navy"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      href={`/#${item.hash}`}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-navy/80 transition-colors hover:bg-bg-light hover:text-navy"
                    >
                      {item.label}
                    </Link>
                  )}
                </SheetClose>
              </motion.div>
            ))}
          </motion.nav>
        </SheetContent>
      </Sheet>

      <EnquireModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.header>
  );
}
