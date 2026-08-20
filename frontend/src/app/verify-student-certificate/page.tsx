import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { VerifyCertificatePageClient } from "../VerifyCertificatePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("verify-student-certificate");
  return buildMetadata(cmsPage, "/verify-student-certificate/");
}

export default async function VerifyCertificatePage() {
  const cmsPage = await getPageBySlug("verify-student-certificate");

  return <VerifyCertificatePageClient cmsPage={cmsPage} />;
}
