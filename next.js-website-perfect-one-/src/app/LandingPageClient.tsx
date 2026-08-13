'use client';

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { RichText } from "@/components/site/RichText";
import type { CMSPage } from "@/lib/cms";

const container = "mx-auto w-full max-w-[860px] px-6 md:px-8";

/** Generic renderer for the programmatic SEO landing pages migrated from
 * WordPress (course/city long-tail pages) — one H1 plus one rich-text body,
 * unlike the core site pages which are built from typed modules. */
export function LandingPageClient({ cmsPage, slug }: { cmsPage: CMSPage; slug: string }) {
  const landingPage = cmsPage.landing_page!;
  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/${slug}/`) ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      <section className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-cta/20 blur-3xl" />
        <div className={`${container} relative`}>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{landingPage.h1}</h1>
        </div>
      </section>

      <section className="py-14">
        <div className={container}>
          <RichText
            as="div"
            html={landingPage.body}
            className="space-y-4 text-sm leading-relaxed text-text-body"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
