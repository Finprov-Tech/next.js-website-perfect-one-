import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { FaqPageClient } from "../FaqPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("faq");
  return buildMetadata(cmsPage, "/faq/");
}

export default async function FaqPage() {
  const cmsPage = await getPageBySlug("faq");

  return <FaqPageClient cmsPage={cmsPage} />;
}
