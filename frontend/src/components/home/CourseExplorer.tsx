'use client';

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BarChart3, Clock3, MonitorSmartphone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import CourseCardArt from "@/components/site/CardArt";
import { categories, categoryLabels, programTypes, type Category, type ProgramType } from "@/data/courses";
import { useCourseCatalog } from "@/components/providers/CourseCatalogProvider";
import { findCourseInCatalog, type CourseCatalogCourse } from "@/lib/courseCatalogCore";
import { resolveCmsImageUrl, resolveCmsLink, type CMSCourseCard, type CMSCourseSection } from "@/lib/cms";
import { slugPath } from "@/lib/sitePaths";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";
const ease = [0.16, 1, 0.3, 1] as const;

// badgeCls in the original catalog varies by category, not by badge text —
// mirrored here so CMS-driven cards keep the exact same per-category styling.
const BADGE_CLS_BY_CATEGORY: Record<string, string> = {
  Finance: "bg-gold/15 text-navy",
  Taxation: "bg-teal/15 text-teal",
  Analytics: "bg-navy/10 text-navy",
  Marketing: "bg-destructive/10 text-destructive",
  Gulf: "bg-navy/10 text-navy",
};

type DisplayCard = {
  slug: string;
  image?: string;
  imageAlt?: string;
  badge: string;
  badgeCls: string;
  category: string;
  programType: string;
  title: string;
  shortDesc: string;
  duration: string;
  mode: string;
  tool: string;
  buttonHref: string;
  buttonText: string;
};

function fromCmsCard(c: CMSCourseCard, course?: CourseCatalogCourse): DisplayCard {
  return {
    slug: course?.slug || c.slug,
    image: course?.image || resolveCmsImageUrl(c.image) || undefined,
    imageAlt: course?.imageAlt || c.image_alt || course?.title || c.title,
    badge: course?.badge || c.badge,
    badgeCls: course?.badgeCls || BADGE_CLS_BY_CATEGORY[course?.category || c.category] || "bg-navy/10 text-navy",
    category: course?.category || c.category,
    programType: course?.programType || c.program_type,
    title: course?.title || c.title,
    shortDesc: course?.shortDesc || c.description,
    duration: course?.duration || c.duration,
    mode: course?.mode || c.mode,
    tool: course?.tool || c.tool,
    buttonHref: resolveCmsLink(c.button_internal_page, c.button_external_url, slugPath(c.slug)),
    buttonText: c.button_text || "View Details",
  };
}

function fromStaticCourse(c: CourseCatalogCourse): DisplayCard {
  return {
    slug: c.slug,
    image: c.image,
    imageAlt: c.imageAlt || c.title,
    badge: c.badge,
    badgeCls: c.badgeCls,
    category: c.category,
    programType: c.programType,
    title: c.title,
    shortDesc: c.shortDesc,
    duration: c.duration,
    mode: c.mode,
    tool: c.tool,
    buttonHref: slugPath(c.slug),
    buttonText: "View Details",
  };
}

export function CourseExplorer({
  onEnquire,
  courseSection,
}: {
  onEnquire: (course?: string) => void;
  courseSection?: CMSCourseSection | null;
}) {
  const courses = useCourseCatalog();
  const [category, setCategory] = useState<Category>("Finance");
  const [programType, setProgramType] = useState<ProgramType | "All">("All");
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const heading = courseSection?.heading || "Future-Ready Programs Tailored for You";
  const subHeading = courseSection?.sub_heading || "Pick a school, then a track — every program ends in placement support.";
  const footerHref = resolveCmsLink(courseSection?.button_internal_page, courseSection?.button_external_url, "/all-courses");
  const footerText = courseSection?.button_text || `Compare all ${courses.length} programs side-by-side`;

  const allCards: DisplayCard[] = useMemo(() => {
    if (courseSection?.cards?.length) {
      return courseSection.cards.map((card) => fromCmsCard(card, findCourseInCatalog(courses, card.slug)));
    }
    return courses.map(fromStaticCourse);
  }, [courseSection, courses]);

  const visible = useMemo(() => {
    const inCategory = allCards.filter((c) => c.category === category);
    const filtered = programType === "All" ? inCategory : inCategory.filter((c) => c.programType === programType);
    const result = filtered.length > 0 ? filtered : inCategory;
    return result.slice(0, 6);
  }, [allCards, category, programType]);

  // Duplicate items array so card #1 seamlessly follows card #6 with no end or stopping
  const loopItems = useMemo(() => {
    return [...visible, ...visible];
  }, [visible]);

  // Silent mathematical loop reset when reaching halfway point
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const half = el.scrollWidth / 2;
    if (half > 0) {
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += half;
      }
    }
  };

  // Continuous non-stop smooth sideways glide animation
  useEffect(() => {
    let animId: number;
    const animateScroll = () => {
      if (!isHovered && scrollRef.current) {
        const el = scrollRef.current;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) {
          el.scrollLeft -= half;
        } else {
          el.scrollLeft += 0.8; // Smooth 60fps continuous non-stop motion
        }
      }
      animId = requestAnimationFrame(animateScroll);
    };
    animId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  return (
    <section className="section-ambient py-12" id="courses">
      <div className={container}>
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">{heading}</h2>
          <p className="mt-4 text-lg text-text-body">{subHeading}</p>
        </Reveal>

        {/* Category tabs with sliding underline */}
        <Reveal delay={0.08} className="mt-12">
          <div className="flex justify-center overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`relative whitespace-nowrap px-5 py-3.5 text-sm font-semibold transition-colors sm:text-base ${
                    category === c ? "text-emerald" : "text-text-body hover:text-navy"
                  }`}
                >
                  {categoryLabels[c]}
                  {category === c && (
                    <motion.span
                      layoutId="explorer-underline"
                      className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-emerald"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Program-type pills */}
        <Reveal delay={0.12} className="mt-6 flex flex-wrap justify-center gap-2">
          {(["All", ...programTypes] as const).map((t) => (
            <button
              key={t}
              onClick={() => setProgramType(t)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                programType === t
                  ? "btn-gloss bg-emerald text-white shadow-lg shadow-emerald/25"
                  : "frost-light text-text-body hover:text-navy"
              }`}
            >
              {t === "All" ? "All Programs" : `${t} Programs`}
            </button>
          ))}
        </Reveal>

        {/* Horizontal Sideways Movement Track with Auto-Loop */}
        <div
          className="relative mt-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
          >
          <AnimatePresence mode="popLayout">
            {loopItems.map((c, i) => (
              <motion.div
                key={`${c.slug}-${i}`}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                transition={{ duration: 0.45, ease, delay: i * 0.05 }}
                className="snap-start shrink-0 w-[84vw] sm:w-[350px] md:w-[380px] lg:w-[400px]"
              >
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald/40 hover:shadow-2xl">
                  {/* Top Image Artwork */}
                  <div>
                    <CourseCardArt slug={c.slug} image={c.image} alt={c.imageAlt} className="h-28 sm:h-32 overflow-hidden rounded-xl bg-navy/5" />

                    {/* Badge & Category Row */}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase ${c.badgeCls}`}>
                        {c.badge}
                      </span>
                      <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[9px] font-bold text-navy/70">
                        {c.category}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="mt-2 text-sm sm:text-base font-bold leading-snug text-navy group-hover:text-cta transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-text-body/80 line-clamp-2">
                      {c.shortDesc}
                    </p>

                    {/* Micro Details List */}
                    <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-2 text-[11px] sm:text-xs">
                      <li className="flex items-center gap-1.5 text-text-body">
                        <Clock3 className="h-3 w-3 text-emerald shrink-0" />
                        <span>Duration: <b className="font-bold text-navy">{c.duration}</b></span>
                      </li>
                      <li className="flex items-center gap-1.5 text-text-body">
                        <MonitorSmartphone className="h-3 w-3 text-emerald shrink-0" />
                        <span>Mode: <b className="font-bold text-navy">{c.mode}</b></span>
                      </li>
                      <li className="flex items-center gap-1.5 text-text-body">
                        <BarChart3 className="h-3 w-3 text-emerald shrink-0" />
                        <span>Software: <b className="font-bold text-navy">{c.tool}</b></span>
                      </li>
                    </ul>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="mt-4 flex items-center gap-2 pt-1">
                    <Link
                      href={c.buttonHref}
                      className="flex-1 rounded-xl border border-navy/30 px-2.5 py-2 text-center text-[11px] sm:text-xs font-bold text-navy transition-all hover:bg-navy hover:text-white"
                    >
                      {c.buttonText}
                    </Link>
                    <button
                      onClick={() => onEnquire(c.title)}
                      className="btn-gloss flex-1 rounded-xl bg-cta px-2.5 py-2 text-center text-[11px] sm:text-xs font-bold text-white shadow-md shadow-cta/20 transition-all hover:bg-cta-hover"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          </div>
        </div>

        <Reveal delay={0.1} className="mt-8 text-center">
          <Link
            href={footerHref}
            className="frost-light group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-emerald transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {footerText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
