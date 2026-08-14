import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { RedirectsTable, type RedirectItem } from "@/components/RedirectsTable";
import { ModuleForm } from "@/components/ModuleForm";
import { djangoJson, SessionExpiredError } from "@/lib/api";
import type { FieldSchema } from "@/lib/moduleSchemas";

type SiteSettings = {
  id: number;
  custom_404_title: string;
  custom_404_message: string;
  custom_404_image: string | null;
};

const NOT_FOUND_FIELDS: FieldSchema[] = [
  { name: "custom_404_title", label: "404 page title", type: "text" },
  { name: "custom_404_message", label: "404 page message", type: "textarea" },
  { name: "custom_404_image", label: "404 page image", type: "image" },
];

async function getRedirects(): Promise<RedirectItem[]> {
  try {
    return await djangoJson<RedirectItem[]>("/api/v1/seo-panel/redirects/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await djangoJson<SiteSettings>("/api/v1/seo-panel/site-settings/1/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function RedirectsPage() {
  const [redirects, settings] = await Promise.all([getRedirects(), getSiteSettings()]);
  const publicSiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://127.0.0.1:3000";

  return (
    <>
      <TopBar title="Redirects" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 grid gap-4 xl:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-bold text-navy">How redirects work</h2>
            <div className="mt-3 space-y-3 text-sm text-text-body">
              <p><strong className="text-navy">301 Permanent:</strong> use when a page has moved for good. Search engines transfer signals to the destination.</p>
              <p><strong className="text-navy">302 Temporary:</strong> use when the move is temporary and the original URL will return.</p>
              <p><strong className="text-navy">404 Not Found:</strong> this is not a redirect. Missing URLs keep a real 404 response and show the custom page with a homepage button.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-navy">Custom 404 page</h2>
                <p className="mt-1 text-xs text-text-body/60">The public page automatically includes a “Back to Home” button.</p>
              </div>
              <a href={`${publicSiteUrl}/404-page-preview-missing`} target="_blank" rel="noreferrer" className="shrink-0 text-xs font-bold text-cta hover:underline">
                Preview 404
              </a>
            </div>
            <ModuleForm endpoint="site-settings" id={settings.id} fields={NOT_FOUND_FIELDS} initialData={settings} />
          </section>
        </div>
        <RedirectsTable initialRedirects={redirects} />
      </main>
    </>
  );
}
