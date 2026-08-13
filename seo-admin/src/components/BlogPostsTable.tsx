"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Loader2, Pencil, Plus, Search, Trash2, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type BlogPostListItem = {
  id: number;
  title: string;
  slug: string;
  category_name: string;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  published_date: string | null;
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

function slugifyForNewPost() {
  return `untitled-post-${Date.now().toString(36)}`;
}

/** Dashboard stat tiles link here with ?status=published / ?missing=title
 * etc. — this is what makes those tiles actually navigate to the matching
 * pre-filtered list instead of just being decorative numbers. */
export function BlogPostsTable({ posts }: { posts: BlogPostListItem[] }) {
  const router = useRouter();
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
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
    if (status !== "all" && p.status !== status) return false;
    if (missingFilter === "any" && p.seo_title && p.meta_description && p.focus_keyword) return false;
    if (missingFilter === "title" && p.seo_title) return false;
    if (missingFilter === "description" && p.meta_description) return false;
    if (missingFilter === "keyword" && p.focus_keyword) return false;
    return true;
  });

  async function handleCreate() {
    setCreating(true);
    setError(null);
    const res = await fetch("/api/proxy/blog-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled Post", slug: slugifyForNewPost(), status: "draft" }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError("Couldn't create a new post.");
      return;
    }
    router.push(`/blog/${data.id}`);
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setBusyId(id);
    const res = await fetch(`/api/proxy/blog-posts/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Search className="h-4 w-4 text-text-body/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or slug…"
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

        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-1.5 rounded-lg bg-cta px-3.5 py-2 text-sm font-bold text-white hover:bg-cta-hover disabled:opacity-60"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          New Post
        </button>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-bg-light text-xs font-bold uppercase tracking-wide text-text-body/70">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3">Last Modified</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-bg-light/60">
                <td className="px-5 py-3 font-semibold text-navy">
                  {p.title}
                  {p.is_featured && (
                    <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">
                      Featured
                    </span>
                  )}
                  <span className="block font-mono text-xs font-normal text-text-body/60">/blog/{p.slug}</span>
                </td>
                <td className="px-5 py-3 text-text-body">{p.category_name || "—"}</td>
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
                <td className="px-5 py-3 text-text-body">
                  {p.published_date ? new Date(p.published_date).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="px-5 py-3 text-text-body">{new Date(p.updated_at).toLocaleDateString("en-GB")}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-body/60 hover:bg-bg-light hover:text-cta"
                      title="View live post"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Link
                      href={`/blog/${p.id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-cta/10 px-3 py-1.5 text-xs font-bold text-cta hover:bg-cta/20"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={busyId === p.id}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-body/60 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-text-body/50">
                  No blog posts match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
