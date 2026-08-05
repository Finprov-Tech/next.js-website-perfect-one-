import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { PlacementsPageClient } from "../PlacementsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("placements");
  return buildMetadata(cmsPage, "/placements/");
}

export default async function PlacementsPage() {
  const cmsPage = await getPageBySlug("placements");

  return <PlacementsPageClient cmsPage={cmsPage} />;
}
