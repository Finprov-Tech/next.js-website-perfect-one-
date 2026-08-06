import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { ContactPageClient } from "../ContactPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("contact");
  return buildMetadata(cmsPage, "/contact/");
}

export default async function ContactPage() {
  const cmsPage = await getPageBySlug("contact");

  return <ContactPageClient cmsPage={cmsPage} />;
}
