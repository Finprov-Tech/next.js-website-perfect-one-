import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts, getPostBySlug } from "@/data/blog";
import { BlogDetailView } from "@/components/blog/BlogDetailView";

export async function generateStaticParams() {
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Finprov Journal",
    };
  }

  const title = `${post.title} — Finprov Editorial Journal`;
  const description = post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Finprov Learning",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailView post={post} />;
}
