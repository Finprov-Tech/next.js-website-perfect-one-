import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";
import { EventsPageClient } from "../EventsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPageBySlug("events");
  return buildMetadata(cmsPage, "/events/");
}

export default async function EventsPage() {
  const cmsPage = await getPageBySlug("events");

  return <EventsPageClient cmsPage={cmsPage} />;
}
