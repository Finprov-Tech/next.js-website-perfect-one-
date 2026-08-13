"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Trash2, TriangleAlert } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";

export type BlogSection = { id: number; post: number; heading: string; body: string };

function SectionCard({ section, onDeleted }: { section: BlogSection; onDeleted: (id: number) => void }) {
  const [heading, setHeading] = useState(section.heading);
  const [body, setBody] = useState(section.body);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [deleting, setDeleting] = useState(false);

  const dirty = heading !== section.heading || body !== section.body;

  async function handleSave() {
    setStatus("saving");
    const res = await fetch(`/api/proxy/blog-post-sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heading, body }),
    });
    if (res.ok) {
      section.heading = heading;
      section.body = body;
      setStatus("saved");
    } else {
      setStatus("error");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this section?")) return;
    setDeleting(true);
    const res = await fetch(`/api/proxy/blog-post-sections/${section.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) onDeleted(section.id);
  }

  return (
    <div className="rounded-xl border border-border bg-bg-light/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <input
          value={heading}
          onChange={(e) => {
            setHeading(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Section heading"
          className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-semibold text-navy focus:border-cta focus:outline-none"
        />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-body/60 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      <RichTextEditor
        value={body}
        onChange={(v) => {
          setBody(v);
          if (status !== "idle") setStatus("idle");
        }}
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || status === "saving"}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
            dirty ? "bg-cta text-white hover:bg-cta-hover" : "bg-border text-text-body/50"
          }`}
        >
          {status === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {status === "saving" ? "Saving…" : "Save Section"}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
            <TriangleAlert className="h-3.5 w-3.5" /> Save failed
          </span>
        )}
      </div>
    </div>
  );
}

export function BlogSectionsEditor({ postId, initialSections }: { postId: number; initialSections: BlogSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    const res = await fetch("/api/proxy/blog-post-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: postId, heading: "New section", body: "" }),
    });
    setAdding(false);
    if (res.ok) {
      const data = await res.json();
      setSections((prev) => [...prev, data]);
    }
  }

  function handleDeleted(id: number) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-navy">Article Sections</h3>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center gap-1.5 rounded-lg bg-cta/10 px-3 py-1.5 text-xs font-bold text-cta hover:bg-cta/20 disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-text-body/60">
          No sections yet — add one to start writing the article body.
        </p>
      ) : (
        <div className="space-y-4">
          {sections.map((s) => (
            <SectionCard key={s.id} section={s} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
