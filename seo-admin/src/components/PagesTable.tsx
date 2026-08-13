"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Search, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageListItem = {
  id: number;
  name: string;
  slug: string;
  page_type: { name: string; slug: string } | null;
  status: "draft" | "published" | "archived";
  updated_at: string;
  live_url: string;
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
};

type StatusFilter = "all" | "published" | "draft";
type MissingFilter = "all" | "any" | "title" | "description" | "keyword";

const MISSING_LABELS: Record<Exclude<MissingFilter, "all">, string> = {
  any: "Missing SEO",
  title: "Missing SEO Title",
  description: "Missing Meta Description",
  keyword: "Missing Focus Keyword",
};

function isStatusFilter(v: string | null): v is StatusFilter {
  return v === "published" || v === "draft";
}
function isMissingFilter(v: string | null): v is Exclude<MissingFilter, "all"> {
  return v === "any" || v === "title" || v === "description" || v === "keyword";
}

/** Dashboard stat tiles link here with ?status=published / ?missing=title
 * etc. — this is what makes those tiles actually navigate to the matching
 * pre-filtered list instead of just being decorative numbers. */
export function PagesTable({ pages }: { pages: PageListItem[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>(() => {
    const v = searchParams.get("status");
    return isStatusFilter(v) ? v : "all";
  });
  const [missingFilter, setMissingFilter] = useState<MissingFilter>(() => {
    const v = searchParams.get("missing");
    return isMissingFilter(v) ? v : "all";
  });

  const pageTypes = useMemo(
    () => Array.from(new Set(pages.map((p) => p.page_type?.name).filter(Boolean))) as string[],
    [pages],
  );
  const [pageType, setPageType] = useState<string>("all");

  const filtered = pages.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
    if (status !== "all" && p.status !== status) return false;
    if (pageType !== "all" && p.page_type?.name !== pageType) return false;
    if (missingFilter === "any" && p.seo_title && p.meta_description && p.focus_keyword) return false;
    if (missingFilter === "title" && p.seo_title) return false;
    if (missingFilter === "description" && p.meta_description) return false;
    if (missingFilter === "keyword" && p.focus_keyword) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-text-body/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or slug…"
            className="w-56 bg-transparent text-sm text-navy outline-none placeholder:text-text-body/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-navy"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <select
          value={pageType}
          onChange={(e) => setPageType(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-navy"
        >
          <option value="all">All page types</option>
          {pageTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {missingFilter === "all" ? (
          <button
            onClick={() => setMissingFilter("any")}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-text-body transition-colors"
          >
            <TriangleAlert className="h-3.5 w-3.5" />
            Missing SEO only
          </button>
        ) : (
          <button
            onClick={() => setMissingFilter("all")}
            className="flex items-center gap-1.5 rounded-lg border border-gold bg-gold/10 px-3 py-2 text-sm font-semibold text-gold transition-colors"
          >
            <TriangleAlert className="h-3.5 w-3.5" />
            {MISSING_LABELS[missingFilter]}
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-bg-light text-xs font-bold uppercase tracking-wide text-text-body/70">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Page Type</th>
              <th className="px-5 py-3">Last Modified</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-bg-light/60">
                <td className="px-5 py-3 font-semibold text-navy">{p.name}</td>
                <td className="px-5 py-3 font-mono text-xs text-text-body">/{p.slug}</td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      p.status === "published" ? "bg-emerald/10 text-emerald" : "bg-gold/15 text-gold",
                    )}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-text-body">{p.page_type?.name ?? "—"}</td>
                <td className="px-5 py-3 text-text-body">{new Date(p.updated_at).toLocaleDateString("en-GB")}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-body/60 hover:bg-bg-light hover:text-cta"
                      title="View live page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Link
                      href={`/pages/${p.slug}`}
                      className="flex items-center gap-1.5 rounded-lg bg-cta/10 px-3 py-1.5 text-xs font-bold text-cta hover:bg-cta/20"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-text-body/50">
                  No pages match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
