import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { courses } from "@/data/courses";
import { posts } from "@/data/blog";
import { jobOpenings } from "@/data/careers";
import { businessProgramAreas, businessProgramSlug } from "@/data/business";
import { getBlogPosts } from "@/lib/cms";

const STATIC_ROUTES = [
  "/about/",
  "/admission/",
  "/blog/",
  "/business/",
  "/careers/",
  "/contact/",
  "/courses/",
  "/events/",
  "/faq/",
  "/placements/",
  "/privacy-policy/",
  "/team/",
  "/terms/",
  "/testimonials/",
  "/verify-certificate/",
];

type CmsPageSummary = {
  slug: string;
  is_homepage: boolean;
  include_in_sitemap: boolean;
  updated_at: string;
};

async function getCmsPages(): Promise<CmsPageSummary[]> {
  const base = process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${base}/api/v1/pages/`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? data) as CmsPageSummary[];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsPages = await getCmsPages();

  const cmsEntries: MetadataRoute.Sitemap = cmsPages
    .filter((p) => p.include_in_sitemap !== false)
    .map((p) => ({
      url: p.is_homepage ? `${SITE_URL}/` : `${SITE_URL}/${p.slug}/`,
      lastModified: p.updated_at,
      changeFrequency: p.is_homepage ? "daily" : "weekly",
      priority: p.is_homepage ? 1.0 : 0.7,
    }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}/`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cmsBlogPosts = await getBlogPosts();
  const blogPostSource = cmsBlogPosts.length ? cmsBlogPosts : posts;
  const blogEntries: MetadataRoute.Sitemap = blogPostSource.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const careerEntries: MetadataRoute.Sitemap = jobOpenings.map((j) => ({
    url: `${SITE_URL}/careers/${j.slug}/`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const businessEntries: MetadataRoute.Sitemap = businessProgramAreas
    .flatMap((area) => area.programs)
    .map((title) => ({
      url: `${SITE_URL}/business/${businessProgramSlug(title)}/`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));

  // If the Home page isn't in the CMS yet (fresh install), still list "/" so
  // the site always has a homepage entry.
  const hasHomeEntry = cmsEntries.some((entry) => entry.url === `${SITE_URL}/`);
  const fallbackHome: MetadataRoute.Sitemap = hasHomeEntry
    ? []
    : [{ url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0 }];

  return [
    ...fallbackHome,
    ...cmsEntries,
    ...staticEntries,
    ...courseEntries,
    ...blogEntries,
    ...careerEntries,
    ...businessEntries,
  ];
}
