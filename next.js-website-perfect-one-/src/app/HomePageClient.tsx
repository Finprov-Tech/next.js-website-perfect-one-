'use client';

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EnquireModal } from "@/components/site/EnquireModal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Faq } from "@/components/site/Faq";
import { HomeHero } from "@/components/home/HomeHero";
import { AcademiesStrip } from "@/components/home/AcademiesStrip";
import { CourseExplorer } from "@/components/home/CourseExplorer";
import { ProgramQuiz } from "@/components/home/ProgramQuiz";
import { AboutBand } from "@/components/home/AboutBand";
import { PlacementHighlights } from "@/components/home/PlacementHighlights";
import { PolaroidStories } from "@/components/home/PolaroidStories";
import { StudentTestimonialsSection } from "@/components/home/StudentTestimonialsSection";
import { LearningToEarning } from "@/components/home/LearningToEarning";
import { ToolsMarquee } from "@/components/home/ToolsMarquee";
import { MentorsBand } from "@/components/home/MentorsBand";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { LifeAtFinprov } from "@/components/home/LifeAtFinprov";
import { scrollToSection } from "@/lib/scroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import type { CMSPage } from "@/lib/cms";

const defaultTickerItems = [
  "Admissions Open 2026–27",
  "100% Placement Assistance",
  "EMI Options Available",
  "Kochi · Kozhikode · Trivandrum · Bengaluru · Online",
  "4,500+ Careers Launched",
];

function AnnouncementTicker({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden border-y border-white/40 bg-gold py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.5),inset_0_-1px_0_rgba(120,70,0,.15)]">
      <div className="flex w-max animate-marquee-reverse items-center whitespace-nowrap">
        {[...Array(2)].map((_, r) => (
          <div key={r} className="flex items-center text-sm font-bold tracking-wide text-navy">
            {items.map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center">
                <span className="px-5">{item}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-navy/35" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroToPrograms({
  onEnquire,
  cmsPage,
}: {
  onEnquire: (course?: string) => void;
  cmsPage: CMSPage | null;
}) {
  const tickerItems = cmsPage?.scroll_section?.items?.length
    ? cmsPage.scroll_section.items.map((i) => i.text)
    : defaultTickerItems;
  const backdropRef = useRef<HTMLDivElement>(null);
  const [backdropHeight, setBackdropHeight] = useState(0);

  useLayoutEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    const updateHeight = () => setBackdropHeight(backdrop.getBoundingClientRect().height);
    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(backdrop);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="relative z-10 isolate">
      <div
        ref={backdropRef}
        className="sticky z-0 overflow-hidden bg-emerald"
        style={backdropHeight ? { top: `calc(100dvh - ${backdropHeight}px)` } : undefined}
      >
        <HomeHero onEnquire={() => onEnquire()} heroBanner={cmsPage?.banner ?? null} />
        <AnnouncementTicker items={tickerItems} />
        <AcademiesStrip credentials={cmsPage?.credentials ?? null} />
      </div>

      <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-white/70 bg-white shadow-[0_-30px_90px_rgba(0,0,0,0.45),0_30px_90px_rgba(0,0,0,0.32)] sm:rounded-[3.5rem] lg:rounded-[4rem]">
        <CourseExplorer onEnquire={onEnquire} courseSection={cmsPage?.courses ?? null} />
        <ProgramQuiz onEnquire={onEnquire} quiz={cmsPage?.quiz ?? null} />
        <AboutBand />
      </div>
    </div>
  );
}

function ProgramsExitToPlacement({ placementSection }: { placementSection: CMSPage["placements"] }) {
  return (
    <div className="relative -mt-[100dvh] h-[200dvh] bg-emerald">
      <div className="sticky top-0 z-0 h-screen overflow-hidden bg-emerald">
        <PlacementHighlights placementSection={placementSection} />
      </div>
    </div>
  );
}

export function HomePageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const [modal, setModal] = useState<{ open: boolean; course?: string }>({ open: false });
  const openModal = (course?: string) => setModal({ open: true, course });

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = hash.replace("#", "");
    const frame = window.requestAnimationFrame(() => scrollToSection(target));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const pageSchema = generateSchemaForPage(cmsPage, SITE_URL + "/") ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <ScrollProgress />
      <SiteHeader />

      <HeroToPrograms onEnquire={openModal} cmsPage={cmsPage} />

      <ProgramsExitToPlacement placementSection={cmsPage?.placements ?? null} />
      <StudentTestimonialsSection testimonials={cmsPage?.testimonials ?? null} />
      <PolaroidStories testimonials={cmsPage?.testimonials ?? null} />
      <LearningToEarning cta={cmsPage?.cta ?? null} />
      <ToolsMarquee partnerLogos={cmsPage?.partner_logos ?? null} />
      <MentorsBand onEnquire={() => openModal()} team={cmsPage?.team ?? null} />
      <WhyChooseUs whyFinprovSection={cmsPage?.why_finprov ?? null} />
      <LifeAtFinprov lifeAtFinprov={cmsPage?.life_at_finprov ?? null} />
      <Faq faqItems={cmsPage?.faq ?? null} />

      <SiteFooter />
      <EnquireModal open={modal.open} onClose={() => setModal({ open: false })} defaultCourse={modal.course} />
    </div>
  );
}
