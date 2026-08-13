"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Plus, Trash2, TriangleAlert } from "lucide-react";
import { SEOMetaCard } from "@/components/SEOMetaCard";
import { CharCounter } from "@/components/ModuleForm";
import { BlogSectionsEditor, type BlogSection } from "@/components/BlogSectionsEditor";

export type BlogCategoryItem = { id: number; name: string; slug: string };
export type AuthorItem = { id: number; name: string; role: string; bio: string; photo: string | null; photo_alt: string };

export type BlogPostDetail = {
  id: number;
  title: string;
  slug: string;
  category: number | null;
  category_name: string;
  excerpt: string;
  cover_image: string | null;
  cover_image_alt: string;
  author: number | null;
  author_name: string;
  author_role: string;
  published_date: string | null;
  read_time: string;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  live_url: string;
  seo: (Record<string, unknown> & { id: number }) | null;
  sections: BlogSection[];
};

type FormState = {
  title: string;
  slug: string;
  category: number | null;
  excerpt: string;
  cover_image_alt: string;
  author: number | null;
  published_date: string;
  read_time: string;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
};

const EMPTY_NEW_AUTHOR = { name: "", role: "", bio: "" };

function toFormState(post: BlogPostDetail): FormState {
  return {
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    cover_image_alt: post.cover_image_alt,
    author: post.author,
    published_date: post.published_date ?? "",
    read_time: post.read_time,
    is_featured: post.is_featured,
    status: post.status,
  };
}

export function BlogPostEditor({
  post,
  categories: initialCategories,
  authors: initialAuthors,
}: {
  post: BlogPostDetail;
  categories: BlogCategoryItem[];
  authors: AuthorItem[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<FormState>(() => toFormState(post));
  const [initial] = useState<FormState>(() => toFormState(post));
  const [categories, setCategories] = useState(initialCategories);
  const [authors, setAuthors] = useState(initialAuthors);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(post.cover_image);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingAuthor, setAddingAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState(EMPTY_NEW_AUTHOR);
  const [newAuthorPhoto, setNewAuthorPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const dirty = coverImage !== null || (Object.keys(values) as (keyof FormState)[]).some((k) => values[k] !== initial[k]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (status !== "idle") setStatus("idle");
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    const res = await fetch("/api/proxy/blog-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName.trim() }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories((prev) => [...prev, cat]);
      set("category", cat.id);
      setNewCategoryName("");
      setAddingCategory(false);
    }
  }

  async function handleAddAuthor() {
    if (!newAuthor.name.trim()) return;
    let body: BodyInit;
    let headers: Record<string, string> | undefined;
    if (newAuthorPhoto) {
      const fd = new FormData();
      fd.append("name", newAuthor.name.trim());
      fd.append("role", newAuthor.role.trim());
      fd.append("bio", newAuthor.bio.trim());
      fd.append("photo", newAuthorPhoto);
      body = fd;
    } else {
      body = JSON.stringify({ name: newAuthor.name.trim(), role: newAuthor.role.trim(), bio: newAuthor.bio.trim() });
      headers = { "Content-Type": "application/json" };
    }
    const res = await fetch("/api/proxy/authors", { method: "POST", body, headers });
    if (res.ok) {
      const author = await res.json();
      setAuthors((prev) => [...prev, author]);
      set("author", author.id);
      setNewAuthor(EMPTY_NEW_AUTHOR);
      setNewAuthorPhoto(null);
      setAddingAuthor(false);
    }
  }

  async function handleSave() {
    setStatus("saving");
    setErrorMessage(null);

    let body: BodyInit;
    let headers: Record<string, string> | undefined;

    if (coverImage) {
      const fd = new FormData();
      for (const [k, v] of Object.entries(values)) fd.append(k, v === null ? "" : String(v));
      fd.append("cover_image", coverImage);
      body = fd;
    } else {
      body = JSON.stringify(values);
      headers = { "Content-Type": "application/json" };
    }

    const res = await fetch(`/api/proxy/blog-posts/${post.id}`, { method: "PATCH", body, headers });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const first = Object.entries(data)[0];
      setErrorMessage(first ? `${first[0]}: ${Array.isArray(first[1]) ? first[1].join(" ") : first[1]}` : "Save failed.");
      setStatus("error");
      return;
    }
    const data = await res.json();
    setCoverImage(null);
    setCoverPreview(data.cover_image ?? null);
    setStatus("saved");
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/proxy/blog-posts/${post.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) router.push("/blog");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-navy">Post Details</h3>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Title</label>
            <input
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
            />
            <CharCounter length={values.title.length} min={40} max={70} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Slug</label>
            <input
              value={values.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm text-navy focus:border-cta focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Category</label>
            {addingCategory ? (
              <div className="flex items-center gap-2">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
                />
                <button
                  onClick={handleAddCategory}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald text-white"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAddingCategory(false)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-body"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={values.category ?? ""}
                  onChange={(e) => set("category", e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setAddingCategory(true)}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-body hover:border-cta hover:text-cta"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Excerpt</label>
            <textarea
              value={values.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
            />
            <CharCounter length={values.excerpt.length} min={120} max={160} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Cover image</label>
            <div className="flex items-center gap-3">
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPreview} alt="" className="h-12 w-20 rounded-lg border border-border object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setCoverImage(f);
                  if (status !== "idle") setStatus("idle");
                }}
                className="text-xs text-text-body"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Cover image alt text</label>
            <input
              value={values.cover_image_alt}
              onChange={(e) => set("cover_image_alt", e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-text-body/70">Author</label>
            {addingAuthor ? (
              <div className="space-y-2 rounded-lg border border-border bg-bg-light/40 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor((a) => ({ ...a, name: e.target.value }))}
                    placeholder="Name"
                    className="rounded-md border border-border px-2.5 py-1.5 text-sm text-navy focus:border-cta focus:outline-none"
                  />
                  <input
                    value={newAuthor.role}
                    onChange={(e) => setNewAuthor((a) => ({ ...a, role: e.target.value }))}
                    placeholder="Role (e.g. Accounting Faculty)"
                    className="rounded-md border border-border px-2.5 py-1.5 text-sm text-navy focus:border-cta focus:outline-none"
                  />
                </div>
                <textarea
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor((a) => ({ ...a, bio: e.target.value }))}
                  placeholder="Short bio (optional)"
                  rows={2}
                  className="w-full rounded-md border border-border px-2.5 py-1.5 text-sm text-navy focus:border-cta focus:outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewAuthorPhoto(e.target.files?.[0] ?? null)}
                  className="text-xs text-text-body"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddAuthor}
                    disabled={!newAuthor.name.trim()}
                    className="flex items-center gap-1 rounded-lg bg-emerald px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Add Author
                  </button>
                  <button
                    onClick={() => {
                      setAddingAuthor(false);
                      setNewAuthor(EMPTY_NEW_AUTHOR);
                      setNewAuthorPhoto(null);
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-body"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={values.author ?? ""}
                  onChange={(e) => set("author", e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
                >
                  <option value="">No author</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                      {a.role ? ` — ${a.role}` : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setAddingAuthor(true)}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-body hover:border-cta hover:text-cta"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-body/70">Published date</label>
              <input
                type="date"
                value={values.published_date}
                onChange={(e) => set("published_date", e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-body/70">Read time</label>
              <input
                value={values.read_time}
                onChange={(e) => set("read_time", e.target.value)}
                placeholder="5 min read"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-text-body/70">Status</label>
              <select
                value={values.status}
                onChange={(e) => set("status", e.target.value as FormState["status"])}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy focus:border-cta focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={values.is_featured}
                  onChange={(e) => set("is_featured", e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-cta"
                />
                Featured post
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || status === "saving"}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
              dirty ? "bg-cta text-white hover:bg-cta-hover" : "bg-border text-text-body/50"
            }`}
          >
            {status === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {status === "saving" ? "Saving…" : "Save"}
          </button>
          {status === "saved" && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
              <TriangleAlert className="h-3.5 w-3.5" /> {errorMessage}
            </span>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete Post
          </button>
        </div>
      </div>

      {post.seo && <SEOMetaCard data={post.seo} />}

      <BlogSectionsEditor postId={post.id} initialSections={post.sections} />
    </div>
  );
}
