import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { PrivacyPolicyPageClient } from "../PrivacyPolicyPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("privacy-policy");
  return buildMetadata(cmsPage, "/privacy-policy/");
}

export default async function PrivacyPolicyPage() {
  const cmsPage = await getPageBySlug("privacy-policy");

  return <PrivacyPolicyPageClient cmsPage={cmsPage} />;
}
