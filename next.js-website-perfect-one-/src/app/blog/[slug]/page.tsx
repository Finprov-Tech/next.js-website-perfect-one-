import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts, getPostBySlug, getRelatedPosts, type Post } from "@/data/blog";
import { getBlogPostBySlug, getBlogPosts, resolveCmsImageUrl, type CMSBlogPostDetail, type CMSBlogPostSummary } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { generateBlogPostSchema, organizationSchema } from "@/lib/seoSchemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogDetailView } from "@/components/blog/BlogDetailView";

export async function generateStaticParams() {
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

function fromCmsSummary(p: CMSBlogPostSummary): Post {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category?.name || "",
    date: p.published_date || "",
    readTime: p.read_time,
    gradient: "",
    author: { name: p.author_name, role: p.author_role },
    sections: [],
    coverImageUrl: resolveCmsImageUrl(p.cover_image) || undefined,
    coverImageAlt: p.cover_image_alt || undefined,
  };
}

function fromCmsDetail(p: CMSBlogPostDetail): Post {
  return {
    ...fromCmsSummary(p),
    sections: p.sections.map((s) => ({ heading: s.heading, body: s.body })),
  };
}

function relatedFromCms(post: CMSBlogPostDetail, allPosts: CMSBlogPostSummary[], count = 3): Post[] {
  const sameCategory = allPosts.filter((p) => p.slug !== post.slug && p.category?.name === post.category?.name).slice(0, count);
  const chosen = sameCategory.length > 0 ? sameCategory : allPosts.filter((p) => p.slug !== post.slug).slice(0, count);
  return chosen.map(fromCmsSummary);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmsPost = await getBlogPostBySlug(slug);
  if (cmsPost) {
    return buildMetadata(cmsPost, `/blog/${slug}/`);
  }

  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article Not Found | Finprov Journal" };
  }

  const title = `${post.title} — Finprov Editorial Journal`;
  const description = post.excerpt;
  return {
    title,
    description,
    openGraph: { title, description, type: "article", siteName: "Finprov Learning" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPost = await getBlogPostBySlug(slug);

  if (cmsPost) {
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

  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={organizationSchema} />
      <BlogDetailView post={post} related={getRelatedPosts(post)} />
    </>
  );
}
