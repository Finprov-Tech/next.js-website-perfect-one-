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
      <h2 className="text-xl font-bold text-navy">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-body">{children}</div>
    </div>
  );
}

const defaultSections: { title: string; body: string }[] = [
  {
    title: "Who we are",
    body: `<p>Finprov Learning Private Limited ("Finprov", "we", "us", or "our") operates the website finprov.com and related subdomains, learning portals, and mobile applications. Our website address is: https://finprov.com.</p>
<p>We are committed to protecting the privacy of our students, website visitors, and corporate clients. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, enroll in our courses, register for events, or interact with our services.</p>`,
  },
  {
    title: "Information We Collect",
    body: `<p>We collect information that you voluntarily provide to us when registering on the site, filling out enquiry forms, enrolling in courses, subscribing to newsletters, or contacting our team.</p>
<ul><li><strong>Personal Identification Information:</strong> Name, email address, phone number, WhatsApp number, date of birth, gender, educational qualifications, and mailing address.</li><li><strong>Academic &amp; Career Details:</strong> Institution attended, year of passing, current employment status, work experience, and career interests.</li><li><strong>Payment &amp; Transaction Data:</strong> Billing address, transaction history, and payment status (processed securely through authorized third-party payment gateways like Razorpay/Cashfree). We do NOT store credit/debit card numbers or CVV on our servers.</li><li><strong>Technical &amp; Usage Data:</strong> IP address, browser type, device information, operating system, referring URL, pages visited, time spent on pages, and cookies.</li></ul>`,
  },
  {
    title: "Comments & Forum Contributions",
    body: `<p>When visitors leave comments or forum posts on the site, we collect the data shown in the comments form, along with the visitor's IP address and browser user agent string to help spam detection.</p>
<p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available at https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p>`,
  },
  {
    title: "Media & Document Uploads",
    body: `<p>If you upload images or documents to the website (such as identity proof, mark sheets, or resume files during admission or job applications), you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website. Uploaded identity and academic documents are strictly confidential and restricted to authorized admission staff only.</p>`,
  },
  {
    title: "Cookies & Tracking Technologies",
    body: `<p>If you leave a comment or log into our portal, you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p>
<p>If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</p>
<p>When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</p>`,
  },
  {
    title: "Embedded Content From Other Websites",
    body: `<p>Articles and pages on this site may include embedded content (e.g. videos, images, articles, map views). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p>
<p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p>`,
  },
  {
    title: "How We Use Your Information",
    body: `<p>We use the collected information for the following core purposes:</p>
<ul><li>To process course enrollments, issue student IDs, and manage academic records.</li><li>To deliver live online classes, e-learning content, and course completion certificates.</li><li>To provide 100% placement support, schedule interviews, and share resumes with corporate hiring partners.</li><li>To send important course updates, batch schedules, exam dates, and administrative notices via SMS, Email, or WhatsApp.</li><li>To process payments and send tax invoices.</li><li>To improve our website functionality, curriculum quality, and student user experience.</li></ul>`,
  },
  {
    title: "Who We Share Your Data With",
    body: `<p>We do NOT sell, trade, or rent your personal identification information to third parties for marketing purposes.</p>
<p>We may share necessary data with trusted service providers who assist us in operating our website, conducting our business, or serving our students (such as payment gateways, SMS/Email service providers, cloud hosting servers, and corporate recruiters for placement drives), provided those parties agree to keep this information strictly confidential.</p>
<p>If you request a password reset, your IP address will be included in the reset email.</p>`,
  },
  {
    title: "How Long We Retain Your Data",
    body: `<p>If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.</p>
<p>For users that register on our website or enroll in our courses, we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information. Student academic &amp; certification records are retained permanently for online verification purposes.</p>`,
  },
  {
    title: "What Rights You Have Over Your Data",
    body: `<p>If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us.</p>
<p>You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, regulatory, or security purposes.</p>`,
  },
  {
    title: "Where Your Data Is Sent",
    body: `<p>Visitor comments and form submissions may be checked through an automated spam detection service. Data is processed on secure cloud infrastructure hosted in ISO-certified data centers.</p>`,
  },
  {
    title: "Contact Information",
    body: `<p>For any questions regarding this Privacy Policy or to exercise your data rights, please contact our Data Protection Compliance Officer:</p>
<p><strong>Finprov Learning Private Limited</strong><br>Vyttila, Kochi, Kerala — 682019<br>Email: contact@finprov.com<br>Phone: +91 89214 02568</p>`,
  },
];

export function PrivacyPolicyPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const banner = cmsPage?.banner ?? null;
  const heroBadge = banner?.badge_text || "Legal";
  const heroHeading = banner?.heading || "Privacy Policy";

  const sections = cmsPage?.legal_sections?.length
    ? cmsPage.legal_sections.map((s) => ({ title: s.title, body: s.body }))
    : defaultSections;

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/privacy-policy/`) ?? organizationSchema;

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
