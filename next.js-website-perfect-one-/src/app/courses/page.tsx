import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { CoursesPageClient } from "../CoursesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("courses");
  return buildMetadata(cmsPage, "/courses/");
}

export default async function CoursesPage() {
  const cmsPage = await getPageBySlug("courses");

  return <CoursesPageClient cmsPage={cmsPage} />;
}
