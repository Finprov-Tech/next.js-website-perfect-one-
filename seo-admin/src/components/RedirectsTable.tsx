"use client";

import { useState } from "react";
import { Check, Loader2, Pencil, Plus, Search, Trash2, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type RedirectItem = {
  id: number;
  old_path: string;
  new_path: string;
  redirect_type: 301 | 302;
  is_active: boolean;
  created_at: string;
  chain_warning: boolean;
};

type DraftRedirect = { old_path: string; new_path: string; redirect_type: 301 | 302; is_active: boolean };

const EMPTY_DRAFT: DraftRedirect = { old_path: "", new_path: "", redirect_type: 301, is_active: true };

function summarize(errors: Record<string, unknown>): string {
  const first = Object.entries(errors)[0];
  if (!first) return "Something went wrong.";
  const [field, messages] = first;
  const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
  return `${field}: ${text}`;
}

export function RedirectsTable({ initialRedirects }: { initialRedirects: RedirectItem[] }) {
  const [redirects, setRedirects] = useState(initialRedirects);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<DraftRedirect>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<DraftRedirect>(EMPTY_DRAFT);
  const [busyId, setBusyId] = useState<number | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = redirects.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.old_path.toLowerCase().includes(q) || r.new_path.toLowerCase().includes(q);
  });

  async function handleCreate() {
    setBusyId("new");
    setError(null);
    const res = await fetch("/api/proxy/redirects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(summarize(data));
      return;
    }
    setRedirects((prev) => [data, ...prev]);
    setDraft(EMPTY_DRAFT);
    setAdding(false);
  }

  function startEdit(r: RedirectItem) {
    setEditingId(r.id);
    setEditDraft({ old_path: r.old_path, new_path: r.new_path, redirect_type: r.redirect_type, is_active: r.is_active });
    setError(null);
  }

  async function handleUpdate(id: number) {
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/proxy/redirects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(summarize(data));
      return;
    }
    setRedirects((prev) => prev.map((r) => (r.id === id ? data : r)));
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this redirect?")) return;
    setBusyId(id);
    const res = await fetch(`/api/proxy/redirects/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setRedirects((prev) => prev.filter((r) => r.id !== id));
  }

  async function toggleActive(r: RedirectItem) {
    setBusyId(r.id);
    const res = await fetch(`/api/proxy/redirects/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !r.is_active }),
    });
    const data = await res.json();
    setBusyId(null);
    if (res.ok) setRedirects((prev) => prev.map((x) => (x.id === r.id ? data : x)));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-text-body/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by old or new path…"
            className="w-64 bg-transparent text-sm text-navy outline-none placeholder:text-text-body/40"
          />
        </div>
        <button
          onClick={() => {
            setAdding((v) => !v);
            setError(null);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-cta px-3.5 py-2 text-sm font-bold text-white hover:bg-cta-hover"
        >
          <Plus className="h-4 w-4" />
          Add Redirect
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
              <th className="px-5 py-3">Old URL</th>
              <th className="px-5 py-3">New URL</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Active</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {adding && (
              <tr className="border-b border-border/60 bg-cta/5">
                <td className="px-5 py-2.5">
                  <input
                    value={draft.old_path}
                    onChange={(e) => setDraft((d) => ({ ...d, old_path: e.target.value }))}
                    placeholder="/old-path"
                    className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
                  />
                </td>
                <td className="px-5 py-2.5">
                  <input
                    value={draft.new_path}
                    onChange={(e) => setDraft((d) => ({ ...d, new_path: e.target.value }))}
                    placeholder="/new-path"
                    className="w-full rounded-md border border-border px-2 py-1.5 text-sm"
                  />
                </td>
                <td className="px-5 py-2.5">
                  <select
                    value={draft.redirect_type}
                    onChange={(e) => setDraft((d) => ({ ...d, redirect_type: Number(e.target.value) as 301 | 302 }))}
                    className="rounded-md border border-border bg-white px-2 py-1.5 text-sm"
                  >
                    <option value={301}>301 Permanent</option>
                    <option value={302}>302 Temporary</option>
                  </select>
                </td>
                <td className="px-5 py-2.5">—</td>
                <td className="px-5 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleCreate}
                      disabled={busyId === "new" || !draft.old_path || !draft.new_path}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald text-white disabled:opacity-50"
                    >
                      {busyId === "new" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => setAdding(false)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-body"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {filtered.map((r) => {
              const isEditing = editingId === r.id;
              return (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-bg-light/60">
                  <td className="px-5 py-3 font-mono text-xs text-navy">
                    {isEditing ? (
                      <input
                        value={editDraft.old_path}
                        onChange={(e) => setEditDraft((d) => ({ ...d, old_path: e.target.value }))}
                        className="w-full rounded-md border border-border px-2 py-1 text-xs"
                      />
                    ) : (
                      r.old_path
                    )}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-body">
                    {isEditing ? (
                      <input
                        value={editDraft.new_path}
                        onChange={(e) => setEditDraft((d) => ({ ...d, new_path: e.target.value }))}
                        className="w-full rounded-md border border-border px-2 py-1 text-xs"
                      />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {r.new_path}
                        {r.chain_warning && (
                          <span title="This redirect chains into another redirect">
                            <TriangleAlert className="h-3.5 w-3.5 text-gold" />
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <select
                        value={editDraft.redirect_type}
                        onChange={(e) => setEditDraft((d) => ({ ...d, redirect_type: Number(e.target.value) as 301 | 302 }))}
                        className="rounded-md border border-border bg-white px-2 py-1 text-xs"
                      >
                        <option value={301}>301</option>
                        <option value={302}>302</option>
                      </select>
                    ) : (
                      <span className="rounded-full bg-bg-light px-2 py-0.5 text-xs font-semibold text-text-body">{r.redirect_type}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(r)}
                      disabled={busyId === r.id}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                        r.is_active ? "bg-emerald/10 text-emerald" : "bg-border text-text-body/50",
                      )}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdate(r.id)}
                            disabled={busyId === r.id}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald text-white disabled:opacity-50"
                          >
                            {busyId === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-body"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(r)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-body/60 hover:bg-bg-light hover:text-cta"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={busyId === r.id}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-body/60 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && !adding && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-text-body/50">
                  No redirects match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
