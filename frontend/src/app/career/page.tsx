import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { CareersPageClient } from "../CareersPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("career");
  return buildMetadata(cmsPage, "/career/");
}

export default async function CareersPage() {
  const cmsPage = await getPageBySlug("career");

  return <CareersPageClient cmsPage={cmsPage} />;
}
