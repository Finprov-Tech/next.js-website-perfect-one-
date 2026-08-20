'use client';

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactAdvisors } from "@/components/home/ContactAdvisors";
import { Faq } from "@/components/site/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import type { CMSPage } from "@/lib/cms";

export function ContactPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/contact/`) ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      <main className="pt-24 sm:pt-28">
        <ContactAdvisors heroHeading={cmsPage?.banner?.heading} />
      </main>

      <Faq faqItems={cmsPage?.faq} />
      <SiteFooter />
    </div>
  );
}
