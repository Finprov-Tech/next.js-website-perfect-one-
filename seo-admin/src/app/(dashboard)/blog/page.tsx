import { Suspense } from "react";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { BlogPostsTable, type BlogPostListItem } from "@/components/BlogPostsTable";
import { djangoJson, SessionExpiredError } from "@/lib/api";

async function getBlogPosts(): Promise<BlogPostListItem[]> {
  try {
    return await djangoJson<BlogPostListItem[]>("/api/v1/seo-panel/blog-posts/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function BlogPostsListPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <TopBar title="Blog Posts" />
      <main className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={null}>
          <BlogPostsTable posts={posts} />
        </Suspense>
      </main>
    </>
  );
}
