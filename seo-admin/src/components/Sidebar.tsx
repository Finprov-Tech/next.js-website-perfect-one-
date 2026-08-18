"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, ArrowRightLeft, Newspaper, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pages", label: "Pages", icon: FileText },
  { href: "/courses", label: "Courses", icon: GraduationCap },
  { href: "/blog", label: "Blog Posts", icon: Newspaper },
  { href: "/redirects", label: "Redirects", icon: ArrowRightLeft },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-navy">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/15">
          <Image src="/finprov-mark.jpeg" alt="Finprov" width={32} height={32} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-white">Finprov</p>
          <p className="text-[11px] font-medium leading-tight text-white/45">SEO Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-gold text-navy" : "text-white/65 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] text-white/35">Content &amp; SEO editing only</p>
      </div>
    </aside>
  );
}
