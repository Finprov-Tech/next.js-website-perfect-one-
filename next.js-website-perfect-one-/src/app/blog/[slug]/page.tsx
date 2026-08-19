import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { generateBlogPostSchema } from "@/lib/seoSchemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogDetailView } from "@/components/blog/BlogDetailView";
import { fromCmsDetail, relatedFromCms } from "@/lib/blogPostAdapter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmsPost = await getBlogPostBySlug(slug);
  if (!cmsPost) {
    return { title: "Article Not Found | Finprov Journal" };
  }
  return buildMetadata(cmsPost, `/blog/${slug}/`);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPost = await getBlogPostBySlug(slug);
  if (!cmsPost) {
    notFound();
  }

  const allCmsPosts = await getBlogPosts();
  const post = fromCmsDetail(cmsPost);
  const related = relatedFromCms(cmsPost, allCmsPosts);
  const schema = generateBlogPostSchema(cmsPost, `${SITE_URL}/blog/${slug}/`);

  return (
    <>
      <JsonLd data={schema} />
      <BlogDetailView post={post} related={related} />
    </>
  );
}
