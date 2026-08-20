import type { Metadata } from "next";
import { getBlogCategories, getBlogPosts, getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { BlogPageClient } from "../BlogPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("blog");
  return buildMetadata(cmsPage, "/blog/");
}

export default async function BlogIndexPage() {
  const [cmsPage, cmsPosts, cmsCategories] = await Promise.all([
    getPageBySlug("blog"),
    getBlogPosts(),
    getBlogCategories(),
  ]);

  return <BlogPageClient cmsPage={cmsPage} cmsPosts={cmsPosts} cmsCategories={cmsCategories} />;
}
