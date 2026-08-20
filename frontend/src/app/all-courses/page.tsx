import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { CoursesPageClient } from "../CoursesPageClient";

// Lives at /all-courses (not /courses) to match the legacy WordPress site's
// URL for the courses listing page — preserves existing SEO rankings/links.
// /courses/ 301-redirects here via the DB-driven Redirect created when the
// page's slug was changed (see middleware.ts).

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("all-courses");
  return buildMetadata(cmsPage, "/all-courses/");
}

export default async function AllCoursesPage() {
  const cmsPage = await getPageBySlug("all-courses");

  return <CoursesPageClient cmsPage={cmsPage} />;
}
