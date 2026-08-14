import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ModuleCard, SelectableModuleItems } from "@/components/ModuleCard";
import { PageUrlManager } from "@/components/PageUrlManager";
import { SEOMetaCard } from "@/components/SEOMetaCard";
import { djangoFetch, ApiError, SessionExpiredError } from "@/lib/api";
import { PAGE_SECTIONS, orderedSectionKeysForPage } from "@/lib/moduleSchemas";

type PageDetail = {
  id: number;
  name: string;
  slug: string;
  status: string;
  page_type: { name: string; slug: string } | null;
  live_url: string;
  seo: (Record<string, unknown> & { id: number; word_count?: number }) | null;
} & Record<string, unknown>;

async function getPageDetail(slug: string): Promise<PageDetail> {
  try {
    const res = await djangoFetch(`/api/v1/seo-panel/pages/${slug}/`);
    if (res.status === 404) notFound();
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
    return res.json();
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function PageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageDetail(slug);

  return (
    <>
      <TopBar title={page.name} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/pages" className="flex items-center gap-1.5 text-sm font-semibold text-text-body hover:text-navy">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-body">
              <FileText className="h-3.5 w-3.5 text-cta" />
              {(page.seo?.word_count ?? 0).toLocaleString()} total words
            </span>
            <a
              href={page.live_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-cta hover:border-cta"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Live Page
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-5">
          <PageUrlManager currentSlug={page.slug} liveUrl={page.live_url} />
          {page.seo && <SEOMetaCard data={page.seo} />}

          {orderedSectionKeysForPage(page.slug).map((key) => {
            const { kind, schema } = PAGE_SECTIONS[key];
            const value = page[key];
            if (kind === "single") {
              if (!value) return null;
              const data = value as Record<string, unknown> & { id: number };
              return <ModuleCard key={key} schema={schema} data={data} />;
            }
            const list = (value as (Record<string, unknown> & { id: number })[] | undefined) ?? [];
            if (list.length === 0 && !schema.canCreate) return null;
            return (
              <div key={key}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-body/60">{schema.title}s</h2>
                <SelectableModuleItems schema={schema} items={list} parentId={page.id} />
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
