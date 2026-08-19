'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, MessageCircle, Download, FileText, Sparkles, Clock,
  Wrench, Building2, CheckCircle2, ChevronRight, Award, BookOpen,
  Users, TrendingUp, GraduationCap, Star, ArrowRight, ChevronDown,
  Briefcase, Globe, Shield, PlayCircle, HelpCircle, Check
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EnquireModal } from "@/components/site/EnquireModal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getRelatedCourses, type Course } from "@/data/courses";
import type { CourseCatalogCourse } from "@/lib/courseCatalogCore";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateCourseSchema, generateBreadcrumbSchema, generateFaqSchema } from "@/lib/seoSchemas";

const container = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12";

const toList = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val as string[];
  if (typeof val === "string") {
    return val.split(/\r?\n|,/).map(s => s.trim().replace(/^[•\-\*]\s*/, '')).filter(Boolean);
  }
  return [];
};

const toCurriculum = (val: unknown) => {
  if (!val) return [];
  if (Array.isArray(val)) return val as { title: string; topics: string[] }[];
  if (typeof val === "string") {
    const blocks = val.split(/\n\n+/);
    return blocks.map((block, i) => {
      const lines = block.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
      const title = lines[0] ? lines[0].replace(/^Topic\s*\d+:?\s*/i, '').replace(/^Module\s*\d+:?\s*/i, '') : `Module ${i + 1}`;
      const topics = lines.slice(1).map((l: string) => l.replace(/^[•\-\*]\s*/, ''));
      return { title, topics: topics.length > 0 ? topics : [title] };
    });
  }
  return [];
};

const categoryAccent: Record<string, { from: string; to: string; badge: string }> = {
  Finance: { from: "from-navy", to: "to-teal", badge: "bg-teal/20 text-teal" },
  Taxation: { from: "from-navy", to: "to-gold", badge: "bg-gold/20 text-amber-700" },
  Analytics: { from: "from-navy", to: "to-cta", badge: "bg-cta/20 text-cta" },
  Marketing: { from: "from-navy", to: "to-emerald", badge: "bg-emerald/20 text-emerald" },
  Gulf: { from: "from-navy", to: "to-gold", badge: "bg-gold/20 text-amber-700" },
};

export function CourseDetailView({ course, relatedCourses: suppliedRelatedCourses }: { course: CourseCatalogCourse; relatedCourses?: CourseCatalogCourse[] }) {
  const relatedCourses = suppliedRelatedCourses || getRelatedCourses(course);
  const [modalOpen, setModalOpen] = useState(false);
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeOfferTab, setActiveOfferTab] = useState<number>(0);

  const courseSchema = generateCourseSchema(course);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Courses", url: "/all-courses" },
    { name: course.title, url: `/courses/${course.slug}` },
  ]);
  const faqSchema = course.faqs && course.faqs.length > 0 ? generateFaqSchema(course.faqs) : null;

  const curriculum = toCurriculum(course.curriculum);
  const highlights = toList(course.highlights);
  const tools = toList(course.tools);
  const partners = toList(course.hiringPartners);
  const topSkills = toList(course.topSkills);
  const whoIsThisFor = toList(course.whoIsThisFor);
  const jobOpportunities = toList(course.jobOpportunities);
  const accent = categoryAccent[course.category] || categoryAccent.Finance;

  const defaultSkills = [
    `Core Concepts & Practical Application in ${course.title}`,
    `Hands-on Tools & Software Skills`,
    `Industry Best Practices & Workflow Optimization`,
    `Problem Solving & Case Study Analysis`,
    `Professional Certification & Career Readiness`
  ];

  const defaultWho = [
    "Students & Fresh Graduates seeking career opportunities",
    "Working Professionals upgrading their domain skills",
    "Career Switchers entering this industry",
    "Entrepreneurs & Business Owners seeking practical expertise"
  ];

  const defaultJobs = [
    `${course.title.replace(/Course|Program|Certification|Diploma/gi, '').trim()} Specialist`,
    `Junior / Senior Executive`,
    `Consultant & Domain Specialist`,
    `Freelance Specialist / Industry Practitioner`
  ];

  const offerTabs = [
    {
      id: "skills",
      label: `Top Skills You Will Learn From The ${course.badge || "Course"}`,
      items: topSkills.length > 0 ? topSkills : defaultSkills,
      note: `${course.title} will help you build practical skills and industry expertise.`
    },
    {
      id: "who",
      label: "Who Is This Program For?",
      items: whoIsThisFor.length > 0 ? whoIsThisFor : defaultWho,
      note: "Designed for learners of all levels looking to gain practical, real-world experience."
    },
    {
      id: "jobs",
      label: `Job Opportunities Post Our ${course.badge || "Course"}`,
      items: jobOpportunities.length > 0 ? jobOpportunities : defaultJobs,
      note: "Finprov's dedicated placement team assists you with 100% placement support to secure leading corporate roles."
    },
    {
      id: "eligibility",
      label: `Minimum Eligibility For ${course.badge || "Course"}`,
      items: [
        course.eligibility || "Plus Two (+2) or Graduation from a recognized university.",
        "Basic enthusiasm to learn and build practical skills.",
        "No prior advanced background required."
      ],
      note: "Open to students, freshers, and experienced professionals."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <ScrollProgress />
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-12 sm:py-20 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal/20 blur-[80px] animate-blob" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-[80px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-cta/10 blur-3xl" />

        <div className={`${container} relative grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60 mb-5 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <Link href="/all-courses" className="hover:text-white transition-colors">Courses</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-gold/90 truncate max-w-[220px]">{course.title}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4 flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ring-1 ring-gold/40 ${accent.badge}`}>
                  <Sparkles className="h-3 w-3" />
                  {course.badge || course.programType}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/15">
                  {course.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/15">
                  {course.mode}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-[2.75rem] leading-tight">
                {course.title.includes('(') ? (
                  <>
                    {course.title.split('(')[0]}
                    <span className="text-teal">({course.title.split('(')[1]}</span>
                  </>
                ) : (
                  course.title
                )}
              </h1>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/85 max-w-2xl">
                {course.heroDesc}
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
                  <Clock className="h-3.5 w-3.5 text-teal" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
                  <BookOpen className="h-3.5 w-3.5 text-gold" />
                  {curriculum.length} Modules
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
                  <Wrench className="h-3.5 w-3.5 text-emerald" />
                  {tools.length}+ Tools
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
                  <Building2 className="h-3.5 w-3.5 text-cta" />
                  100+ Hiring Partners
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-navy shadow-lg shadow-gold/30 transition-all hover:scale-105 hover:shadow-gold/50 hover:shadow-xl"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  Download Syllabus Brochure
                </button>
                <Link
                  href={`/admission?course=${course.slug}`}
                  className="group inline-flex items-center gap-2 rounded-xl border border-gold/50 bg-gold/10 px-5 py-3.5 text-sm font-bold text-gold transition-all hover:bg-gold hover:text-navy hover:shadow-lg hover:shadow-gold/20"
                >
                  <GraduationCap className="h-4 w-4" />
                  Apply Now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 hover:border-white/30"
                >
                  <MessageCircle className="h-4 w-4 text-emerald" />
                  Chat Now
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="flex flex-col items-center lg:items-end justify-center"
          >
            <PhotoSlot
              src={course.image}
              alt={course.imageAlt || course.title}
              caption={course.category}
              subcaption={course.tool}
              gradient="from-teal/80 to-navy/70"
              fit="contain"
              className="aspect-[16/9] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/15"
            />
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF STATS BAR */}
      <section className="border-b border-border bg-white py-5 shadow-sm">
        <div className={container}>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {[
              { icon: Users, value: "1000+", label: "Students Placed" },
              { icon: TrendingUp, value: "90%", label: "Placement Rate" },
              { icon: Building2, value: "100+", label: "Hiring Partners" },
              { icon: Star, value: "4.8/5", label: "Course Rating" },
              { icon: Shield, value: "100%", label: "Placement Support" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/8">
                  <Icon className="h-4 w-4 text-navy" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-navy leading-none">{value}</div>
                  <div className="text-[10px] font-semibold text-text-body/70 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1150px] px-5 sm:px-8">
          <div className="space-y-20">

            {/* COURSE SNAPSHOT SECTION */}
            <Reveal id="snapshot">
              <div className="text-left">
                <div className="inline-block rounded-full bg-amber-100/90 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-900 border border-amber-200/80 mb-3 shadow-xs">
                  Introduction to {course.title}
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-navy">
                  Course <span className="text-cta">Snapshot</span>
                </h2>

                <div className="mt-6 mb-6 rounded-2xl border border-sky-200/80 bg-white p-6 shadow-xs max-w-2xl">
                  <div className="grid grid-cols-3 divide-x divide-sky-100 text-center">
                    <div className="px-3">
                      <div className="text-2xl sm:text-3xl font-extrabold text-navy">{course.hoursOfLearning || "50+"}</div>
                      <div className="text-xs sm:text-sm font-semibold text-text-body/70 mt-1">Hours of Learning</div>
                    </div>
                    <div className="px-3">
                      <div className="text-2xl sm:text-3xl font-extrabold text-navy">{course.industryProjects || "2+"}</div>
                      <div className="text-xs sm:text-sm font-semibold text-text-body/70 mt-1">Industry Projects</div>
                    </div>
                    <div className="px-3">
                      <div className="text-2xl sm:text-3xl font-extrabold text-navy">{course.toolsUsed || `${tools.length}+`}</div>
                      <div className="text-xs sm:text-sm font-semibold text-text-body/70 mt-1">Tools Used</div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-base sm:text-lg leading-relaxed text-text-body/90 font-normal max-w-4xl whitespace-pre-line">
                  {course.snapshotText || course.heroDesc}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 items-center border-t border-border/60 pt-5">
                  {course.onlineFees && (
                    <div className="rounded-xl bg-navy/5 px-4 py-2 text-xs font-semibold text-navy">
                      <span className="text-text-body/70">Online Fee: </span>
                      <span className="font-extrabold">{course.onlineFees}</span>
                    </div>
                  )}
                  {course.offlineFees && (
                    <div className="rounded-xl bg-navy/5 px-4 py-2 text-xs font-semibold text-navy">
                      <span className="text-text-body/70">Classroom Fee: </span>
                      <span className="font-extrabold">{course.offlineFees}</span>
                    </div>
                  )}
                  <div className="rounded-xl bg-navy/5 px-4 py-2 text-xs font-semibold text-navy">
                    <span className="text-text-body/70">Duration: </span>
                    <span className="font-extrabold">{course.duration}</span>
                  </div>
                  <div className="rounded-xl bg-emerald/10 px-4 py-2 text-xs font-bold text-emerald">
                    100% Placement Support
                  </div>
                </div>
              </div>
            </Reveal>

            {/* WHAT DOES THIS COURSE HAVE TO OFFER? */}
            <Reveal id="offer">
              <div className="text-left mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                  What does this <span className="text-cta">course have to offer?</span>
                </h2>
                <p className="text-xs sm:text-sm text-text-body/70 mt-1">Explore key skills, target learners, career outcomes, and eligibility</p>
              </div>

              <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start rounded-3xl border border-border/80 bg-white p-4 sm:p-6 shadow-sm">
                <div className="flex flex-col gap-2">
                  {offerTabs.map((tab, idx) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveOfferTab(idx)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-xs sm:text-sm font-bold transition-all ${
                        activeOfferTab === idx
                          ? "bg-navy text-white shadow-md shadow-navy/20"
                          : "bg-bg-light text-navy hover:bg-navy/5"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${activeOfferTab === idx ? "rotate-90 text-gold" : "text-navy/40"}`} />
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl bg-bg-light/60 p-5 sm:p-6 border border-border/60 min-h-[300px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-navy mb-4 border-b border-border/60 pb-3">
                      {offerTabs[activeOfferTab].label}
                    </h3>
                    <ul className="space-y-2.5">
                      {offerTabs[activeOfferTab].items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-text-body">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-navy text-gold p-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {offerTabs[activeOfferTab].note && (
                    <p className="mt-6 text-xs text-text-body/80 italic border-t border-border/60 pt-3">
                      {offerTabs[activeOfferTab].note}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>

            {/* KEY HIGHLIGHTS */}
            {highlights.length > 0 && (
              <Reveal id="highlights">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/15">
                    <Award className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                      Key Highlights of <span className="text-cta">Course</span>
                    </h2>
                    <p className="text-xs text-text-body/70 mt-0.5">What makes this program industry leading</p>
                  </div>
                </div>
                <StaggerGrid className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-2">
                  {highlights.map((h, i) => (
                    <StaggerItem key={i}>
                      <div className="group flex items-start gap-3.5 rounded-2xl border border-border/70 bg-white p-5 shadow-sm transition-all hover:border-emerald/40 hover:shadow-md hover:-translate-y-0.5">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald/12 group-hover:bg-emerald/20 transition-colors">
                          <CheckCircle2 className="h-4 w-4 text-emerald" />
                        </div>
                        <span className="text-sm font-semibold text-navy leading-snug">{h}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </Reveal>
            )}

            {/* CURRICULUM SYLLABUS */}
            {curriculum.length > 0 && (
              <Reveal id="curriculum">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cta/15">
                      <FileText className="h-5 w-5 text-cta" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">World-Class Curriculum</h2>
                      <p className="text-xs text-text-body/70 mt-0.5">{curriculum.length} modules · Full practical breakdown</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-cta/40 bg-cta/8 px-4 py-2 text-xs font-bold text-cta hover:bg-cta hover:text-white transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Full Syllabus PDF
                  </button>
                </div>

                <div className="rounded-2xl border border-border/70 bg-white shadow-sm overflow-hidden">
                  {curriculum.map((m, i) => (
                    <div
                      key={i}
                      className={`border-b border-border/60 last:border-b-0 ${openModule === i ? 'bg-navy/3' : ''}`}
                    >
                      <button
                        onClick={() => setOpenModule(openModule === i ? null : i)}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-navy/3 transition-colors"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/8 text-xs font-extrabold text-navy">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-sm sm:text-base font-bold text-navy leading-snug">{m.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="hidden sm:block text-xs text-text-body/60 font-medium">
                            {toList(m.topics).length} topics
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-navy/50 transition-transform duration-200 ${openModule === i ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {openModule === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1">
                              <div className="grid sm:grid-cols-2 gap-2">
                                {toList(m.topics).map((topic, j) => (
                                  <div key={j} className="flex items-start gap-2.5 rounded-xl bg-white border border-border/60 px-3.5 py-2.5">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                                    <span className="text-xs font-medium text-text-body leading-snug">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* TOOLS & SOFTWARE */}
            {tools.length > 0 && (
              <Reveal id="tools">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                    <Wrench className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">Tools &amp; Software Covered</h2>
                    <p className="text-xs text-text-body/70 mt-0.5">Industry-standard tools practiced in real projects</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tools.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -3, scale: 1.04 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-2.5 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-navy shadow-sm hover:border-gold/40 hover:shadow-md transition-shadow cursor-default"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-teal to-cta shrink-0" />
                      {t}
                    </motion.div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* HIRING PARTNERS */}
            {partners.length > 0 && (
              <Reveal id="placements">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10">
                    <Briefcase className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">Top Recruiting Companies</h2>
                    <p className="text-xs text-text-body/70 mt-0.5">Leading corporate partners hiring our graduates</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-white to-bg-light p-6 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {partners.map((p, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.04, y: -2 }}
                        className="flex items-center justify-center rounded-xl border border-border/70 bg-white px-3 py-4 text-center text-xs sm:text-sm font-bold text-navy shadow-sm hover:border-teal/30 hover:shadow-md transition-all cursor-default"
                      >
                        <Building2 className="h-3.5 w-3.5 mr-1.5 text-teal/70 shrink-0" />
                        {p}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* FAQS */}
            {course.faqs && course.faqs.length > 0 && (
              <Reveal id="faqs">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15">
                    <HelpCircle className="h-5 w-5 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                      Frequently Asked <span className="text-cta">Questions</span>
                    </h2>
                    <p className="text-xs text-text-body/70 mt-0.5">Got questions? We have answers.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {course.faqs.map((faq: { question: string; answer: string }, i: number) => (
                    <div key={i} className="rounded-2xl border border-border/70 bg-white overflow-hidden shadow-sm hover:border-teal/30 transition-all">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-navy/3 transition-colors"
                      >
                        <span className="text-sm sm:text-base font-extrabold text-navy leading-snug">{faq.question}</span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-navy/50 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-cta' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-text-body border-t border-border/40 bg-bg-light/40">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {/* CAREER OPPORTUNITIES BANNER */}
            <Reveal>
              <div className="rounded-3xl bg-gradient-to-br from-navy to-navy/90 p-8 sm:p-10 text-white relative overflow-hidden">
                <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold mb-5">
                    <Globe className="h-3.5 w-3.5" />
                    Career Placement Support
                  </span>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                        Start Your Professional Journey Today
                      </h3>
                      <p className="mt-3 text-sm text-white/75 leading-relaxed">
                        Our dedicated placement cell works directly with top firms across India and GCC countries to help you land high-paying roles upon completion.
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => setModalOpen(true)}
                          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-xs font-extrabold text-navy shadow-lg shadow-gold/30 hover:scale-105 transition-transform"
                        >
                          <PlayCircle className="h-4 w-4" />
                          Enquire / Get Call Back
                        </button>
                        <a
                          href={site.whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 text-emerald" />
                          Talk to Academic Counselor
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Financial Analyst", "Tax Specialist", "SAP Consultant",
                        "Accounts Manager", "GST Practitioner", "Payroll Accountant"
                      ].map((role) => (
                        <div key={role} className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2.5">
                          <BadgeCheck className="h-3.5 w-3.5 text-teal shrink-0" />
                          <span className="text-xs font-semibold text-white/90">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* RELATED COURSES */}
      {relatedCourses.length > 0 && (
        <section className="bg-bg-light py-16 sm:py-20 border-t border-border/60">
          <div className={container}>
            <Reveal className="text-center mb-10">
              <span className="inline-block rounded-full bg-navy/10 px-4 py-1.5 text-xs font-bold text-navy mb-3">Explore More</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">Recommended Programs</h2>
              <p className="mt-2 text-sm text-text-body/70">Explore similar certified courses</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                  {relatedCourses.map((r) => (
                    <CarouselItem key={r.slug} className="sm:basis-1/2 lg:basis-1/3">
                      <motion.div
                        whileHover={{ y: -6 }}
                        className="flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md hover:border-teal/30 transition-all"
                      >
                        <div>
                          <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${r.badgeCls}`}>{r.badge}</span>
                          <h3 className="mt-3 text-sm font-extrabold text-navy leading-snug">{r.title}</h3>
                          <p className="mt-2 text-xs leading-relaxed text-text-body line-clamp-3">{r.shortDesc}</p>
                          <div className="mt-3 flex gap-3 text-xs text-text-body/70">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.duration}</span>
                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{r.mode}</span>
                          </div>
                        </div>
                        <Link
                          href={`/courses/${r.slug}`}
                          className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-cta hover:gap-2.5 transition-all"
                        >
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-5 h-9 w-9 border-border" />
                <CarouselNext className="-right-5 h-9 w-9 border-border" />
              </Carousel>
            </Reveal>
          </div>
        </section>
      )}

      <SiteFooter />
      <EnquireModal open={modalOpen} onClose={() => setModalOpen(false)} defaultCourse={course.title} />
    </div>
  );
}
