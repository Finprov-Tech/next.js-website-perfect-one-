import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { AdmissionPageClient } from "../AdmissionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("admission");
  return buildMetadata(cmsPage, "/admission/");
}

export default async function AdmissionPage() {
  const cmsPage = await getPageBySlug("admission");

  return <AdmissionPageClient cmsPage={cmsPage} />;
}
