import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { TermsPageClient } from "../TermsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("terms-and-conditions");
  return buildMetadata(cmsPage, "/terms-and-conditions/");
}

export default async function TermsPage() {
  const cmsPage = await getPageBySlug("terms-and-conditions");

  return <TermsPageClient cmsPage={cmsPage} />;
}
