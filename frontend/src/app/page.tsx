import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { HomePageClient } from "./HomePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("home");
  return buildMetadata(cmsPage, "/");
}

export default async function HomePage() {
  const cmsPage = await getPageBySlug("home");

  return <HomePageClient cmsPage={cmsPage} />;
}
