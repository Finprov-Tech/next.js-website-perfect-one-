import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { TermsPageClient } from "../TermsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("terms");
  return buildMetadata(cmsPage, "/terms/");
}

export default async function TermsPage() {
  const cmsPage = await getPageBySlug("terms");

  return <TermsPageClient cmsPage={cmsPage} />;
}
