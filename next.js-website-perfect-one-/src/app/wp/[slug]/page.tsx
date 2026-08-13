import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { LandingPageClient } from "../../LandingPageClient";

// Internal target of the fallback rewrite in next.config.mjs — any request
// path that doesn't match a real route (e.g. /about, /courses/[slug]) falls
// through to here, keeping migrated WordPress landing pages at their
// original top-level URL (e.g. /accounting-courses-in-kochi) without a
// literal root-level [slug]/page.tsx, which conflicts with Next's build-time
// page-data collection for the other nested dynamic routes (business/
// [program], courses/[slug], career/[slug]).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmsPage = await getPageBySlug(slug);
  if (!cmsPage || !cmsPage.landing_page) {
    return { title: "Page Not Found | Finprov Learning" };
  }
  return buildMetadata(cmsPage, `/${slug}/`);
}

export default async function GenericLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmsPage = await getPageBySlug(slug);

  if (!cmsPage || !cmsPage.landing_page) {
    notFound();
  }

  return <LandingPageClient cmsPage={cmsPage} slug={slug} />;
}
