import { Suspense } from "react";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { PagesTable, type PageListItem } from "@/components/PagesTable";
import { djangoJson, SessionExpiredError } from "@/lib/api";

async function getPages(): Promise<PageListItem[]> {
  try {
    return await djangoJson<PageListItem[]>("/api/v1/seo-panel/pages/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function PagesListPage() {
  const pages = await getPages();

  return (
    <>
      <TopBar title="Pages" />
      <main className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={null}>
          <PagesTable pages={pages} />
        </Suspense>
      </main>
    </>
  );
}
