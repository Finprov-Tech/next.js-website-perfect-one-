import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { VerifyCertificatePageClient } from "../VerifyCertificatePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("verify-certificate");
  return buildMetadata(cmsPage, "/verify-certificate/");
}

export default async function VerifyCertificatePage() {
  const cmsPage = await getPageBySlug("verify-certificate");

  return <VerifyCertificatePageClient cmsPage={cmsPage} />;
}
