'use client';

import { useState } from "react";
import { HelpCircle, ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateFaqSchema } from "@/lib/seoSchemas";
import type { CMSPage } from "@/lib/cms";
import { RichText } from "@/components/site/RichText";

const container = "mx-auto w-full max-w-[960px] px-6 md:px-8";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const officialFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Who should take an online course?",
    answer:
      "Freshers, Graduates, Junior finance professionals who want a career upgrade, professionals who need digital skill updates to manage and monitor teams etc.",
  },
  {
    id: "faq-2",
    question: "How do I access my course?",
    answer:
      "For e-learning courses, You can access the course through the Finprov website by giving your credentials. For online classes, links will be provided to you via mail or WhatsApp.",
  },
  {
    id: "faq-3",
    question: "Are there prerequisites or language requirements?",
    answer:
      "No, and there are no Language requirements. However certain courses have individual criteria for eligibility.",
  },
  {
    id: "faq-4",
    question: "Can I take more than one course at a time?",
    answer: "Yes. You can do multiple courses at a time.",
  },
  {
    id: "faq-5",
    question: "Is there an EMI option?",
    answer:
      "Yes, we have no-cost EMI options for selected courses. You can also pay the complete fee in up to 3 instalments.",
  },
  {
    id: "faq-6",
    question: "My payment did not go through. What do I do?",
    answer:
      "You can contact our support team via WhatsApp or via mail contact@finprov.com",
  },
  {
    id: "faq-7",
    question: "Does Finprov provide placement assistance?",
    answer:
      "Yes! All job-assured and diploma programs include 100% placement support, resume optimization, mock interview sessions, and direct recruitment drives with 300+ hiring partners across India and the Gulf.",
  },
  {
    id: "faq-8",
    question: "How do employers verify my Finprov certificate?",
    answer:
      "Employers can verify your certificate anytime through our official online Certificate Verification Portal by entering your unique Certificate Number or Registration ID.",
  },
];

export function FaqPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const banner = cmsPage?.banner ?? null;
  const heroBadge = banner?.badge_text || "Support & Answers";
  const heroHeading = banner?.heading || "Frequently Asked Questions";
  const heroParagraph =
    banner?.paragraph ||
    "Accounting, Finance & Digital Marketing Course FAQs — Have any questions? We are here to help.";

  const faqs: FaqItem[] = cmsPage?.faq?.length
    ? cmsPage.faq.map((f) => ({ id: String(f.id), question: f.question, answer: f.answer }))
    : officialFaqs;

  const faqSchema = generateFaqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={faqSchema} />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />

        <div className={`${container} relative text-center`}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
            <HelpCircle className="h-4 w-4" /> {heroBadge}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            {heroHeading}
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            <RichText html={heroParagraph} />
          </p>
        </div>
      </section>

      {/* FAQ Content Section */}
      <section className="py-14">
        <div className={container}>
          {/* FAQ Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIds[faq.id] ?? index < 2;
              return (
                <div
                  key={faq.id}
                  className="glass gloss-soft overflow-hidden rounded-2xl border border-border transition-all hover:border-navy/20"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-navy hover:text-emerald"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-emerald transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-border/60 bg-white/50 p-5 pt-4 text-sm leading-relaxed text-text-body">
                      <RichText html={faq.answer} as="div" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need More Help Box */}
          <div className="mt-12 rounded-2xl border border-emerald/20 bg-emerald/5 p-8 text-center text-navy shadow-sm">
            <h3 className="text-xl font-bold">Still Have Questions?</h3>
            <p className="mt-2 text-sm text-text-body">
              Our support team is available to assist you with admissions, course access, and career guidance.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-white transition-colors hover:bg-navy-light"
              >
                <Mail className="h-4 w-4 text-gold" /> {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-5 py-2.5 text-navy transition-colors hover:bg-navy/5"
              >
                <Phone className="h-4 w-4 text-emerald" /> {site.phone}
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-white shadow-md transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4 fill-white" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
