import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { BusinessPageClient } from "../BusinessPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("business");
  return buildMetadata(cmsPage, "/business/");
}

export default async function BusinessPage() {
  const cmsPage = await getPageBySlug("business");

  return <BusinessPageClient cmsPage={cmsPage} />;
}
