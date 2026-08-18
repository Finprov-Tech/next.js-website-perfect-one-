"use client";

import { useState } from "react";
import { Check, Link2, Loader2, TriangleAlert } from "lucide-react";

function summarizeError(data: unknown): string {
  if (!data || typeof data !== "object") return "The slug could not be changed.";
  const value = (data as Record<string, unknown>).slug;
  if (Array.isArray(value)) return value.map(String).join(" ");
  if (value) return String(value);
  return "The slug could not be changed.";
}

export function PageUrlManager({ currentSlug, liveUrl }: { currentSlug: string; liveUrl: string }) {
  const [slug, setSlug] = useState(currentSlug);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const changed = slug.trim() !== currentSlug;

  async function save() {
    const nextSlug = slug.trim().toLowerCase();
    if (!nextSlug || !changed) return;
    if (!window.confirm(`Change the page URL to /${nextSlug}/? The old URL will permanently redirect to it.`)) return;

    setStatus("saving");
    setError(null);
    try {
      const response = await fetch(`/api/proxy/pages/${encodeURIComponent(currentSlug)}/slug`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: nextSlug }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(summarizeError(data));
        setStatus("error");
        return;
      }
      window.location.replace(`/pages/${encodeURIComponent(nextSlug)}`);
    } catch {
      setError("Couldn't reach the server.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Link2 className="h-4 w-4 text-cta" />
        <h2 className="text-sm font-bold text-navy">URL management</h2>
      </div>
      <label className="mb-1 block text-xs font-semibold text-text-body/70">
        Page slug<span className="ml-0.5 text-destructive">*</span>
      </label>
      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1 items-center rounded-lg border border-border focus-within:border-cta">
          <span className="shrink-0 border-r border-border px-3 py-2 text-sm text-text-body/50">/</span>
          <input
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setStatus("idle");
              setError(null);
            }}
            className="min-w-0 flex-1 px-3 py-2 text-sm text-navy outline-none"
            spellCheck={false}
          />
          <span className="shrink-0 border-l border-border px-3 py-2 text-sm text-text-body/50">/</span>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={!changed || status === "saving"}
          className="flex items-center gap-1.5 rounded-lg bg-cta px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-border disabled:text-text-body/50"
        >
          {status === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {status === "saving" ? "Changing…" : "Change URL"}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-text-body/60">
        Current URL: {liveUrl}. Changing it creates a permanent 301 redirect and updates the sitemap automatically.
      </p>
      {error && (
        <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-destructive">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
