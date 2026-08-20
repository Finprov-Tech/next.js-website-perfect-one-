import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { TeamPageClient } from "../TeamPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("team");
  return buildMetadata(cmsPage, "/team/");
}

export default async function TeamPage() {
  const cmsPage = await getPageBySlug("team");

  return <TeamPageClient cmsPage={cmsPage} />;
}
