import { resolveCmsImageUrl, type CMSBlogPostDetail, type CMSBlogPostSummary } from "@/lib/cms";
import type { Post } from "@/data/blog";

export function fromCmsSummary(p: CMSBlogPostSummary): Post {
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

export function fromCmsDetail(p: CMSBlogPostDetail): Post {
  return {
    ...fromCmsSummary(p),
    author: {
      name: p.author_name,
      role: p.author_role,
      bio: p.author_bio || undefined,
      photoUrl: p.author_photo ? resolveCmsImageUrl(p.author_photo) || undefined : undefined,
    },
    sections: p.sections.map((s) => ({ heading: s.heading, body: s.body })),
  };
}

export function relatedFromCms(post: CMSBlogPostDetail, allPosts: CMSBlogPostSummary[], count = 3): Post[] {
  const sameCategory = allPosts
    .filter((p) => p.slug !== post.slug && p.category?.name === post.category?.name)
    .slice(0, count);
  const chosen =
    sameCategory.length > 0
      ? sameCategory
      : allPosts.filter((p) => p.slug !== post.slug).slice(0, count);
  return chosen.map(fromCmsSummary);
}
