import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { AboutPageClient } from "../AboutPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("about");
  return buildMetadata(cmsPage, "/about/");
}

export default async function AboutPage() {
  const cmsPage = await getPageBySlug("about");

  return <AboutPageClient cmsPage={cmsPage} />;
}
