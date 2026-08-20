import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { PlacementsPageClient } from "../PlacementsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("placement");
  return buildMetadata(cmsPage, "/placement/");
}

export default async function PlacementsPage() {
  const cmsPage = await getPageBySlug("placement");

  return <PlacementsPageClient cmsPage={cmsPage} />;
}
