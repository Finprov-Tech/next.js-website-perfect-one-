'use client';

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import type { CMSPage } from "@/lib/cms";

const container = "mx-auto w-full max-w-[860px] px-6 md:px-8";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-text-body">{children}</div>
    </div>
  );
}

const defaultSections: { title: string; body: string }[] = [
  {
    title: "Terms of Use",
    body: `<p>These Terms &amp; Conditions ("Terms") of (a) use of our website https://finprov.com/ ("Website"), or any products or services in connection with the Website/products ("Services") or (b) any modes of registrations or usage of products are between Finprov Learning Private Limited ("Company/We/Us/Our") and its users ("User/You/Your").</p>
<p>These Terms constitute an electronic record in accordance with the provisions of the Information Technology Act, 2000 and the Information Technology (Intermediaries guidelines) Rules, 2011 thereunder, as amended from time to time.</p>`,
  },
  {
    title: "Legal notice",
    body: `<p>All textual, graphical, video, and other content appearing on this Website unless otherwise noted, are the property of the Company.</p>`,
  },
  {
    title: "General",
    body: `<p>You agree to the terms and conditions outlined in this Terms of Use ("Terms of Use") with respect to https://finprov.com/ ("Finprov Learning"/"Website"). These Terms of Use constitute the entire and only agreement between us and you and supersedes all prior or contemporaneous agreements, representations, warranties and understandings with respect to the Website, the content, products or services provided by or through the Website.</p>
<p>Your use/access/browsing of the Website or the Services or products or registration (with or without payment/with or without a subscription) through any means shall signify Your acceptance of the Terms and Your agreement to be legally bound by the same.</p>`,
  },
  {
    title: "Copyright",
    body: `<p>The content, organization, graphics, design, compilation, magnetic translation, videos, digital conversion and other matters related to the Website are protected under applicable copyrights, trademarks and other proprietary rights. The copying, redistribution, use or publication by you of any such matters or any part of the Website is strictly prohibited.</p>`,
  },
  {
    title: "User Restrictions",
    body: `<p>Your use of our products, Website, Services is solely for Your personal and non-commercial use. Any use of the Website, Services or products or their contents other than for personal purposes is prohibited.</p>`,
  },
  {
    title: "Refunds & Cancellation Policy",
    body: `<p>Each course or program may have specific refund guidelines. Once enrolled and access is granted to digital course materials or live classes, fees are non-refundable except under special circumstances approved in writing by Finprov management.</p>`,
  },
  {
    title: "Contact Information",
    body: `<p>Finprov Learning Private Limited<br>Vyttila, Kochi, Kerala — 682019<br>Email: contact@finprov.com<br>Phone: +91 89214 02568</p>`,
  },
];

export function TermsPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const banner = cmsPage?.banner ?? null;
  const heroBadge = banner?.badge_text || "Legal";
  const heroHeading = banner?.heading || "Terms and Conditions";

  const sections = cmsPage?.legal_sections?.length
    ? cmsPage.legal_sections.map((s) => ({ title: s.title, body: s.body }))
    : defaultSections;

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/terms/`) ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-cta/20 blur-3xl" />
        <div className={`${container} relative`}>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">{heroBadge}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {heroHeading}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className={container}>
          <h2 className="text-xl font-bold text-navy">Terms and Conditions – Finprov</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-body">
            <p>
              This is a legal and binding agreement between you, the user (referred to as "user" or
              "you") of the Programs, as defined below, and Finprov (referred to as "we", "us" or
              "Finprov") stating the terms that govern your use of the Platform, as defined below.
              The website https://finprov.com/ and Other services (collectively referred to as the
              "Platform") and the information, and other materials contained therein are provided and
              operated by Finprov. Finprov offers curated and specially designed online higher
              education and industry-relevant programs and career assistance services ("Programs").
            </p>
            <p>
              Please review our Terms of Use, Privacy Policy and other policies available on the
              Platform (collectively referred to as the "Terms") that govern the use of the Platform
              and Programs. By accepting these Terms in any manner or accessing the website, you
              consent, agree and undertake to abide, be bound by and adhere to the Terms and if you
              do not agree to these Terms, you are not entitled to avail of/use the Programs and any
              use thereafter shall be unauthorised.
            </p>

            <h3 className="pt-2 text-base font-bold text-navy">Terms &amp; Conditions</h3>
            <p>
              Finprov ("https://finprov.com/"). Owned by Finprov Learning Private Limited
              ("Company"), a company duly registered and incorporated under the Companies Act, 2013,
              Located at Kochi, Kerala, India. We maintain this Website as a service to our
              customers. By using our website, you are agreeing to comply with and be bound by the
              following Terms of Use. Please review the following Terms of Use carefully. If you do
              not agree to any of these terms, you should not use, review, or subscribe to the
              website, information and educational services we provide respectively.
            </p>
          </div>

          {sections.map((section) => (
            <Section key={section.title} title={section.title}>
              <div
                className="space-y-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-navy [&_a]:text-emerald [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
            </Section>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
