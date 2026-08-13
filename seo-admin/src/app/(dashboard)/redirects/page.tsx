import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { RedirectsTable, type RedirectItem } from "@/components/RedirectsTable";
import { djangoJson, SessionExpiredError } from "@/lib/api";

async function getRedirects(): Promise<RedirectItem[]> {
  try {
    return await djangoJson<RedirectItem[]>("/api/v1/seo-panel/redirects/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function RedirectsPage() {
  const redirects = await getRedirects();

  return (
    <>
      <TopBar title="Redirects" />
      <main className="flex-1 overflow-y-auto p-6">
        <RedirectsTable initialRedirects={redirects} />
      </main>
    </>
  );
}
