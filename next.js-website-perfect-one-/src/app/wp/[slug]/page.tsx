import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, getBlogPostBySlug, getBlogPosts } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { generateBlogPostSchema } from "@/lib/seoSchemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogDetailView } from "@/components/blog/BlogDetailView";
import { fromCmsDetail, relatedFromCms } from "@/lib/blogPostAdapter";
import { LandingPageClient } from "../../LandingPageClient";

// Internal target of the fallback rewrite in next.config.mjs — any request
// path that doesn't match a real route (e.g. /about, /courses/[slug]) falls
// through to here, keeping migrated WordPress URLs at their original
// top-level path (landing pages and blog posts alike).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmsPage = await getPageBySlug(slug);
  if (cmsPage?.landing_page) {
    return buildMetadata(cmsPage, `/${slug}/`);
  }

  const cmsPost = await getBlogPostBySlug(slug);
  if (cmsPost) {
    return buildMetadata(cmsPost, `/${slug}/`);
  }

  return { title: "Page Not Found | Finprov Learning" };
}

export default async function WordPressLegacyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPage = await getPageBySlug(slug);

  if (cmsPage?.landing_page) {
    return <LandingPageClient cmsPage={cmsPage} slug={slug} />;
  }

  const cmsPost = await getBlogPostBySlug(slug);
  if (cmsPost) {
    const allCmsPosts = await getBlogPosts();
    const post = fromCmsDetail(cmsPost);
    const related = relatedFromCms(cmsPost, allCmsPosts);
    const schema = generateBlogPostSchema(cmsPost, `${SITE_URL}/${slug}/`);

    return (
      <>
        <JsonLd data={schema} />
        <BlogDetailView post={post} related={related} />
      </>
    );
  }

  notFound();
}
