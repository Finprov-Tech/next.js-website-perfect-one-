'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/Reveal";
import { faqs as defaultFaqs } from "@/data/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateFaqSchema } from "@/lib/seoSchemas";
import type { CMSFAQItem } from "@/lib/cms";

export function Faq({
  title = "Frequently Asked Questions",
  subtitle = "Everything you're probably wondering before you enquire.",
  faqItems,
}: {
  title?: string;
  subtitle?: string;
  faqItems?: CMSFAQItem[] | null;
}) {
  const faqs = faqItems?.length ? faqItems.map((f) => ({ q: f.question, a: f.answer })) : defaultFaqs;
  const faqSchema = generateFaqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })));

  return (
    <section className="bg-bg-light py-24">
      <JsonLd data={faqSchema} />
      <div className="mx-auto w-full max-w-[900px] px-6 md:px-8">
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-text-body">{subtitle}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="gloss-light rounded-2xl border-none bg-white px-6 py-2 shadow-e1 transition-all duration-300 hover:shadow-e2 data-[state=open]:shadow-e2"
              >
                <AccordionTrigger className="text-left font-bold text-navy hover:no-underline sm:text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-text-body/80 sm:text-base leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
