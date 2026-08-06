import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { TestimonialsPageClient } from "../TestimonialsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("testimonials");
  return buildMetadata(cmsPage, "/testimonials/");
}

export default async function TestimonialsPage() {
  const cmsPage = await getPageBySlug("testimonials");

  return <TestimonialsPageClient cmsPage={cmsPage} />;
}
