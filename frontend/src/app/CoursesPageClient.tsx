'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Clock3, MonitorSmartphone, ChevronLeft, ChevronRight, Search, Sparkles, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EnquireModal } from "@/components/site/EnquireModal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import CourseCardArt from "@/components/site/CardArt";
import { categories, programTypes, type Category, type ProgramType } from "@/data/courses";
import { useCourseCatalog } from "@/components/providers/CourseCatalogProvider";
import { CmsIcon } from "@/lib/icons";
import type { CMSPage } from "@/lib/cms";
import { slugPath } from "@/lib/sitePaths";
import { RichText } from "@/components/site/RichText";
import learnersPhoto from "@/assets/kerala-students.png";

const container = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12";
const ITEMS_PER_PAGE = 9; // divides evenly into the 3-column grid — no dangling partial row
const learnersPhotoSrc = typeof learnersPhoto === "string" ? learnersPhoto : (learnersPhoto as { src: string }).src;

export function CoursesPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const courses = useCourseCatalog();
  const banner = cmsPage?.banner ?? null;

  const heroBadge = banner?.badge_text || "Job-Oriented Certification Programs";
  const heroHeading = banner?.heading || "Future-Ready Programs Tailored for You";
  const heroParagraph =
    banner?.paragraph ||
    `${courses.length} programs across finance, taxation, analytics, digital marketing, and Gulf careers. Filter by category or track to find your fit.`;

  const [category, setCategory] = useState<Category | "All">("All");
  const [programType, setProgramType] = useState<ProgramType | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; course?: string }>({ open: false });

  // Reset to page 1 whenever filters change
  const handleCategoryChange = (c: Category | "All") => {
    setCategory(c);
    setPage(1);
  };

  const handleProgramTypeChange = (t: ProgramType | "All") => {
    setProgramType(t);
    setPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      courses.filter(
        (c) =>
          (category === "All" || c.category === category) &&
          (programType === "All" || c.programType === programType) &&
          (searchQuery === "" ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.tool.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [category, programType, searchQuery]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;

  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      const gridEl = document.getElementById("course-grid-container");
      if (gridEl) {
        gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Modern Hero Header */}
      <section className="relative overflow-hidden bg-navy py-12 sm:py-16 text-white">
        <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

        <div className={`${container} relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center`}>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
              {banner?.badge_icon ? (
                <CmsIcon name={banner.badge_icon} className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}{" "}
              {heroBadge}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              {heroHeading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-white/80"
            >
              <RichText html={heroParagraph} />
            </motion.p>

            {/* Prominent High-Visibility Search Bar */}
            <div className="mt-6 max-w-xl relative">
              <div className="relative flex items-center rounded-2xl bg-white p-1.5 shadow-2xl shadow-black/40 ring-2 ring-gold/70 transition-all focus-within:ring-gold focus-within:ring-4">
                <Search className="ml-3.5 h-5 w-5 shrink-0 text-navy" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search courses by title, skill or software (e.g. SAP, Tally, GST)..."
                  className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm font-semibold text-navy placeholder:text-navy/50 outline-none"
                />
                {searchQuery ? (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="mr-1 rounded-xl bg-navy/10 px-3 py-1.5 text-xs font-bold text-navy hover:bg-navy/20"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="mr-1 hidden sm:inline-flex rounded-xl bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-navy shadow-sm">
                    Search
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="hidden lg:block"
          >
            <PhotoSlot
              src={learnersPhotoSrc}
              alt="Learners studying at Finprov"
              caption="Real learners, real outcomes"
              gradient="from-cta/80 to-navy/70"
              className="aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden border border-white/15"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Filter & Course Grid Section */}
      <section className="section-ambient py-10 sm:py-16" id="course-grid-container">
        <div className={container}>
          {/* Category Filter Pills */}
          <Reveal className="flex flex-wrap justify-center gap-2">
            {(["All", ...categories] as const).map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`relative rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  category === c ? "text-white shadow-md" : "frost-light text-navy/80 hover:text-navy hover:bg-white"
                }`}
              >
                {category === c && (
                  <motion.span
                    layoutId="cat-pill"
                    className="absolute inset-0 rounded-full bg-navy"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </Reveal>

          {/* Program Type Track Pills */}
          <Reveal delay={0.1} className="mt-4 flex flex-wrap justify-center gap-2">
            {(["All", ...programTypes] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleProgramTypeChange(t)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                  programType === t
                    ? "border-cta bg-cta/10 text-cta font-bold shadow-sm"
                    : "border-border/80 bg-white text-text-body hover:border-navy/30"
                }`}
              >
                {t}
              </button>
            ))}
          </Reveal>

          {/* Page status summary */}
          <div className="mt-6 flex items-center justify-between border-b border-border/60 pb-4 text-xs font-semibold text-text-body/70">
            <span className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-emerald" />
              Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} Courses
            </span>
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="text-xs font-bold text-cta hover:underline"
              >
                Clear search query
              </button>
            )}
          </div>

          {/* Stagger Grid of Premium Course Cards */}
          <StaggerGrid
            className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            key={`${category}-${programType}-${searchQuery}-${page}`}
          >
            {paginatedCourses.map((c) => (
              <StaggerItem key={c.slug}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-xl">
                  {/* Top Image Artwork */}
                  <div>
                    <CourseCardArt slug={c.slug} image={c.image} alt={c.title} className="h-28 sm:h-32 overflow-hidden rounded-xl bg-navy/5" />

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
                      href={slugPath(c.slug)}
                      className="flex-1 rounded-xl border border-navy/30 px-2.5 py-2 text-center text-[11px] sm:text-xs font-bold text-navy transition-all hover:bg-navy hover:text-white"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => setModal({ open: true, course: c.title })}
                      className="btn-gloss flex-1 rounded-xl bg-cta px-2.5 py-2 text-center text-[11px] sm:text-xs font-bold text-white shadow-md shadow-cta/20 transition-all hover:bg-cta-hover"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {filtered.length === 0 && (
            <div className="mt-12 rounded-2xl bg-white p-8 text-center border border-border shadow-sm">
              <p className="text-sm font-bold text-navy">No programs match your search or filter options.</p>
              <p className="mt-1 text-xs text-text-body">Try clearing your search query or selecting a different category pill.</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setProgramType("All");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-xl bg-navy px-5 py-2 text-xs font-bold text-white"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold text-navy shadow-sm transition-all hover:bg-navy hover:text-white disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <div className="flex flex-wrap items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                      page === p
                        ? "bg-navy text-white shadow-md scale-105"
                        : "border border-border bg-white text-navy hover:bg-bg-light"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-xl bg-navy px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy-light disabled:opacity-30 disabled:pointer-events-none"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
      <EnquireModal open={modal.open} onClose={() => setModal({ open: false })} defaultCourse={modal.course} />
    </div>
  );
}
