"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type NavSection = { id: string; label: string };

/** Sticky jump-to-section bar for the page editor. Plain anchor links do
 * the actual scrolling (works even without JS); the IntersectionObserver
 * here only drives which pill is highlighted as the active section. */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  // Native `#hash` navigation doesn't reliably scroll a target sitting
  // inside a nested `overflow-y-auto` container (the page body itself
  // never scrolls — `main` does) — so a plain hash from a direct link or
  // page reload lands with the right URL but no actual scroll. Do it by
  // hand instead of trusting the browser here.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !sections.some((s) => s.id === hash)) return;
    const el = document.getElementById(hash);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
      setActiveId(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  function goTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  }

  if (sections.length === 0) return null;

  return (
    <nav className="sticky top-0 z-10 -mx-6 mb-5 flex gap-1.5 overflow-x-auto border-b border-border bg-bg-light/95 px-6 py-2.5 backdrop-blur">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={(event) => goTo(event, s.id)}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            activeId === s.id ? "bg-cta text-white" : "text-text-body/70 hover:bg-card hover:text-navy",
          )}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
