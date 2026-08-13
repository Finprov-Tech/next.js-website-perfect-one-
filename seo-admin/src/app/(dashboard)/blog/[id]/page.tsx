import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BlogPostEditor, type BlogPostDetail, type BlogCategoryItem, type AuthorItem } from "@/components/BlogPostEditor";
import { djangoFetch, djangoJson, ApiError, SessionExpiredError } from "@/lib/api";

async function getBlogPost(id: string): Promise<BlogPostDetail> {
  try {
    const res = await djangoFetch(`/api/v1/seo-panel/blog-posts/${id}/`);
    if (res.status === 404) notFound();
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
    return res.json();
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

async function getCategories(): Promise<BlogCategoryItem[]> {
  try {
    return await djangoJson<BlogCategoryItem[]>("/api/v1/seo-panel/blog-categories/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

async function getAuthors(): Promise<AuthorItem[]> {
  try {
    return await djangoJson<AuthorItem[]>("/api/v1/seo-panel/authors/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function BlogPostEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories, authors] = await Promise.all([getBlogPost(id), getCategories(), getAuthors()]);

  return (
    <>
      <TopBar title={post.title} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-1.5 text-sm font-semibold text-text-body hover:text-navy">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog Posts
          </Link>
          <a
            href={post.live_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-cta hover:border-cta"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Post
          </a>
        </div>

        <div className="mx-auto max-w-3xl">
          <BlogPostEditor post={post} categories={categories} authors={authors} />
        </div>
      </main>
    </>
  );
}
