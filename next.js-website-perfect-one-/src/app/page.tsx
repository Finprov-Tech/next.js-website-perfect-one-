import { getPageBySlug } from "@/lib/cms";
import { HomePageClient } from "./HomePageClient";

export default async function HomePage() {
  const cmsPage = await getPageBySlug("home");

  return <HomePageClient cmsPage={cmsPage} />;
}
