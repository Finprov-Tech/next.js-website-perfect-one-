import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileCheck2,
  FileClock,
  Files,
  ArrowRightLeft,
  ArrowUpRight,
  TriangleAlert,
  Newspaper,
} from "lucide-react";
import { djangoJson, SessionExpiredError } from "@/lib/api";
import { TopBar } from "@/components/TopBar";
import { StatTile } from "@/components/StatTile";

type DashboardStats = {
  total_pages: number;
  published_pages: number;
  draft_pages: number;
  missing_seo_title: number;
  missing_meta_description: number;
  missing_focus_keyword: number;
  total_blog_posts: number;
  published_blog_posts: number;
};

async function getStats(): Promise<DashboardStats> {
  try {
    return await djangoJson<DashboardStats>("/api/v1/seo-panel/dashboard/stats/");
  } catch (err) {
    if (err instanceof SessionExpiredError) redirect("/login");
    throw err;
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <>
      <TopBar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatTile label="Total Pages" value={stats.total_pages} icon={Files} href="/pages" />
          <StatTile label="Published Pages" value={stats.published_pages} icon={FileCheck2} href="/pages?status=published" />
          <StatTile label="Draft Pages" value={stats.draft_pages} icon={FileClock} href="/pages?status=draft" />
          <StatTile
            label="Missing SEO Title"
            value={stats.missing_seo_title}
            icon={TriangleAlert}
            tone="warning"
            href="/pages?missing=title"
          />
          <StatTile
            label="Missing Meta Description"
            value={stats.missing_meta_description}
            icon={TriangleAlert}
            tone="warning"
            href="/pages?missing=description"
          />
          <StatTile
            label="Missing Focus Keyword"
            value={stats.missing_focus_keyword}
            icon={TriangleAlert}
            tone="warning"
            href="/pages?missing=keyword"
          />
          <StatTile label="Total Blog Posts" value={stats.total_blog_posts} icon={Newspaper} href="/blog" />
          <StatTile
            label="Published Blog Posts"
            value={stats.published_blog_posts}
            icon={Newspaper}
            href="/blog?status=published"
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-body/70">Quick links</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pages"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-cta"
            >
              <Files className="h-4 w-4 text-cta" />
              Manage Pages
              <ArrowUpRight className="h-3.5 w-3.5 text-text-body/50" />
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-cta"
            >
              <Newspaper className="h-4 w-4 text-cta" />
              Manage Blog Posts
              <ArrowUpRight className="h-3.5 w-3.5 text-text-body/50" />
            </Link>
            <Link
              href="/redirects"
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:border-cta"
            >
              <ArrowRightLeft className="h-4 w-4 text-cta" />
              Manage Redirects
              <ArrowUpRight className="h-3.5 w-3.5 text-text-body/50" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
