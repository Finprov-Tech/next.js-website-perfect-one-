import type { Metadata } from "next";
import type { CMSSeoMeta } from "@/lib/cms";
import { resolveCmsImageUrl } from "@/lib/cms";

export const SITE_URL = "https://finprov.com";
export const SITE_NAME = "Finprov Learning";

export const SITE_DEFAULT_TITLE = "Finprov — Master Finance. Accelerate Your Global Career.";
export const SITE_DEFAULT_DESCRIPTION =
  "Industry-validated finance programs with SAP, Tally & Power BI training. 100% placement assistance for freshers and working professionals.";
export const SITE_DEFAULT_IMAGE = `${SITE_URL}/finprov-wordmark.jpeg`;

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Parses the CMS's combined "index,follow" style value into Next's robots object. */
function parseRobots(metaRobots: string | undefined): Metadata["robots"] {
  if (!metaRobots) return undefined;
  const [indexPart, followPart] = metaRobots.split(",");
  return {
    index: indexPart !== "noindex",
    follow: followPart !== "nofollow",
  };
}

/**
 * Builds a Next.js `Metadata` object for anything carrying a CMS `seo` object —
 * a `CMSPage` or a `CMSBlogPostDetail` both satisfy this shape structurally —
 * given the site-relative path (e.g. "/", "/about/", "/blog/my-post/"). Every
 * field falls back to a sensible site-wide default so nothing ever ships with
 * blank metadata, and `null` (CMS unreachable/not published) degrades the same way.
 */
export function buildMetadata(cmsEntity: { seo: CMSSeoMeta | null } | null, path: string): Metadata {
  const seo = cmsEntity?.seo ?? null;
  const canonical = seo?.canonical_url || absoluteUrl(path);

  const title = seo?.seo_title || SITE_DEFAULT_TITLE;
  const description = seo?.meta_description || SITE_DEFAULT_DESCRIPTION;

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;
  const ogImage = resolveCmsImageUrl(seo?.og_image) || SITE_DEFAULT_IMAGE;
  const ogUrl = seo?.og_url || canonical;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: parseRobots(seo?.meta_robots),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      type: "website",
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}
