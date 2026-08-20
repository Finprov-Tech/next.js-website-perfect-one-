"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown, Clock, List } from "lucide-react";
import type { Post } from "@/data/blog";
import { BlogAuthorCard } from "@/components/blog/BlogAuthorCard";
import type { TocEntry } from "@/lib/blogToc";
import { formatBlogDateShort } from "@/lib/formatBlogDate";
import { slugPath } from "@/lib/sitePaths";

type BlogSidebarProps = {
  post: Post;
  sections: TocEntry[];
  latestPosts: Post[];
};

const defaultThumb =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80";

const SITE_HEADER = 96;
const BOTTOM_GAP = 16;
const SECTION_GAP = 24; // space-y-6

function isTocFullyShown(toc: HTMLElement, vh: number): boolean {
  const rect = toc.getBoundingClientRect();
  const available = vh - SITE_HEADER - BOTTOM_GAP;
  const fitsInViewport = rect.height <= available;

  if (fitsInViewport) {
    return rect.top >= SITE_HEADER && rect.bottom <= vh - BOTTOM_GAP;
  }

  // Tall TOC: every item has scrolled into view when the bottom reaches the viewport edge.
  return rect.bottom <= vh - BOTTOM_GAP;
}

/**
 * Scroll with page (position: relative) until TOC is fully shown, then switch to sticky.
 * DOM-only updates — no React state — to avoid flicker.
 */
function useSidebarStickyTop(
  stickyRef: RefObject<HTMLDivElement | null>,
  authorRef: RefObject<HTMLDivElement | null>,
  tocRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const sticky = stickyRef.current;
    const author = authorRef.current;
    const toc = tocRef.current;
    if (!sticky || !author || !toc) return;

    const disableStick = () => {
      sticky.style.position = "relative";
      sticky.style.top = "";
    };

    const enableStick = () => {
      const vh = window.innerHeight;
      const stickAfterHeight = author.offsetHeight + SECTION_GAP + toc.offsetHeight;
      sticky.style.position = "sticky";
      sticky.style.top = `${vh - stickAfterHeight - BOTTOM_GAP}px`;
    };

    const sync = () => {
      if (isTocFullyShown(toc, window.innerHeight)) enableStick();
      else disableStick();
    };

    disableStick();
    sync();

    const io = new IntersectionObserver(sync, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(toc);

    const ro = new ResizeObserver(sync);
    ro.observe(toc);
    ro.observe(author);

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [stickyRef, authorRef, tocRef]);
}

function useTocSpy(sections: TocEntry[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return activeId;
}

function TableOfContents({ sections, activeId }: { sections: TocEntry[]; activeId: string }) {
  const [open, setOpen] = useState(true);

  if (sections.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-2.5">
          <List className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-black uppercase tracking-wide text-navy">Table of Contents</h3>
        </div>
        <p className="mt-3 text-sm text-slate-500">No headings found in this article.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 bg-navy px-5 py-4 text-left text-white transition-colors hover:bg-navy/95"
      >
        <span className="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.2em]">
          <List className="h-4 w-4 text-gold" />
          Table of Contents
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <nav aria-label="Table of contents">
          <ul className="space-y-0.5 px-3 py-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium leading-snug transition-colors ${
                    activeId === s.id
                      ? "bg-emerald/10 font-bold text-emerald"
                      : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                  }`}
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

function LatestPostsList({ latestPosts }: { latestPosts: Post[] }) {
  if (latestPosts.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy/5 text-navy">
          <Clock className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-black uppercase tracking-wide text-navy">Latest Posts</h3>
      </div>
      <ul className="mt-4 space-y-4">
        {latestPosts.slice(0, 4).map((p) => (
          <li key={p.slug}>
            <Link href={slugPath(p.slug)} className="group flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={p.coverImageUrl || defaultThumb}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 flex-1">
                {formatBlogDateShort(p.date) ? (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                    {formatBlogDateShort(p.date)}
                  </p>
                ) : null}
                <p className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-navy group-hover:text-emerald">
                  {p.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlogSidebarMobile({ post, sections }: { post: Post; sections: TocEntry[] }) {
  const activeId = useTocSpy(sections);
  return (
    <div className="space-y-6">
      <BlogAuthorCard post={post} />
      <TableOfContents sections={sections} activeId={activeId} />
    </div>
  );
}

export function BlogSidebarDesktop({ post, sections, latestPosts }: BlogSidebarProps) {
  const activeId = useTocSpy(sections);
  const stickyRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  useSidebarStickyTop(stickyRef, authorRef, tocRef);

  return (
    <aside className="hidden lg:block lg:self-stretch">
      <div ref={stickyRef} className="z-10 w-full space-y-6">
        <div ref={authorRef}>
          <BlogAuthorCard post={post} />
        </div>
        <div ref={tocRef}>
          <TableOfContents sections={sections} activeId={activeId} />
        </div>
        <LatestPostsList latestPosts={latestPosts} />
      </div>
    </aside>
  );
}
