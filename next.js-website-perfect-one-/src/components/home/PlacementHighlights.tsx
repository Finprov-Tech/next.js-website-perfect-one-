'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { placementStats } from "@/data/testimonials";
import { parseCountValue, resolveCmsLink, type CMSPlacementSection } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

const defaultStats = [
  { end: placementStats.learnersPlaced, suffix: "+", label: "Learners Placed" },
  { end: placementStats.uniqueRolesExplored, suffix: "+", label: "Unique Job Roles Explored" },
  { end: placementStats.interviewsConducted, suffix: "+", label: "Interviews Conducted" },
  { end: placementStats.companiesHired, suffix: "+", label: "Companies Hired Our Learners" },
];

export function PlacementHighlights({ placementSection }: { placementSection?: CMSPlacementSection | null }) {
  const heading = placementSection?.heading || "Placement highlights FY2025–26";
  const ctaText = placementSection?.cta_text || "View Full Placement Report";
  const ctaHref = resolveCmsLink(placementSection?.cta_internal_page, placementSection?.cta_external_url, "/placements");
  const stats = placementSection?.stats?.length
    ? placementSection.stats.map((s) => ({ label: s.label, ...parseCountValue(s.value) }))
    : defaultStats;

  return (
    <section
      id="placements"
      className="relative -mt-px bg-emerald"
    >
      {/* Arched top curve, like the reference band */}
      <svg
        viewBox="0 0 1440 84"
        className="block w-full -mb-px text-emerald"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,84 C360,0 1080,0 1440,84 L1440,84 L0,84 Z"
          fill="currentColor"
        />
      </svg>
      <div className="relative overflow-hidden bg-emerald pb-20 pt-6 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-lines" />
        <div className={`${container} relative`}>
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          </Reveal>

          <Reveal delay={0.1} className="mx-auto mt-10 max-w-4xl">
            <div className="glass-solid gloss-soft rounded-3xl p-8 text-navy shadow-2xl shadow-black/25 sm:p-10">
              <StaggerGrid className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((s) => (
                  <StaggerItem key={s.label} className="text-center">
                    <div className="text-3xl font-extrabold tracking-tight text-emerald sm:text-4xl">
                      <CountUp end={s.end} suffix={s.suffix} />
                    </div>
                    <div className="mt-2 text-xs font-semibold leading-snug text-text-body sm:text-sm">{s.label}</div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
              <div className="mt-10 text-center">
                <Link href={ctaHref}>
                  <motion.span
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-gloss group inline-flex items-center gap-2 rounded-full bg-emerald px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald/30"
                  >
                    {ctaText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
