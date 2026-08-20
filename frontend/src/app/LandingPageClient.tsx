'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Download, GraduationCap, MessageCircle, Sparkles, Users,
  TrendingUp, Building2, Star, Shield, ArrowRight, BadgeCheck,
  BookOpen, Award, HelpCircle, Briefcase, Globe, CheckCircle2,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { EnquireModal } from "@/components/site/EnquireModal";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { RichText } from "@/components/site/RichText";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { site } from "@/data/site";
import { parseLandingContent } from "@/lib/landingContent";
import type { CMSPage } from "@/lib/cms";

import bengaluruKoramangalaImg from "@/assets/campus_photos/bengaluru-koramangala.jpg";
import vytillaCampusImg from "@/assets/vytilla-campus.jpg";
import kozhikodeCampusImg from "@/assets/campus_photos/kozhikode.jpg";
import kollamCampusImg from "@/assets/campus_photos/kollam.jpg";
import trivandrumCampusImg from "@/assets/campus_photos/trivandrum.jpg";
import manjeriCampusImg from "@/assets/campus_photos/manjeri.jpg";
import pandalamCampusImg from "@/assets/campus_photos/pandalam.jpg";
import alappuzhaCampusImg from "@/assets/campus_photos/alappuzha.jpg";
import ernakulamSouthCampusImg from "@/assets/campus_photos/ernakulam-south.jpg";

const container = "mx-auto w-full max-w-[1150px] px-5 sm:px-8 lg:px-10";

const asSrc = (img: unknown) => (typeof img === "string" ? img : (img as { src: string })?.src);

/** Best-effort real photo for the hero, matched from the page's own title —
 * a sample image the CMS team can swap for the page's real photo later.
 * Falls back to the on-brand gradient PhotoSlot already used elsewhere on
 * the site when no city is recognized. */
const CITY_IMAGE_MATCHERS: [RegExp, unknown][] = [
  [/bangalore|bengaluru|koramangala|vijayanagar/i, bengaluruKoramangalaImg],
  [/kochi|ernakulam|vyttila|vytilla/i, ernakulamSouthCampusImg],
  [/kozhikode|calicut/i, kozhikodeCampusImg],
  [/kollam/i, kollamCampusImg],
  [/trivandrum|thiruvananthapuram/i, trivandrumCampusImg],
  [/manjeri/i, manjeriCampusImg],
  [/pandalam/i, pandalamCampusImg],
  [/alappuzha/i, alappuzhaCampusImg],
];

function heroImageFor(text: string): string | undefined {
  const match = CITY_IMAGE_MATCHERS.find(([re]) => re.test(text));
  return match ? asSrc(match[1]) : asSrc(vytillaCampusImg);
}

const SECTION_ICONS = [BookOpen, Award, Users, Building2, Briefcase, HelpCircle, Sparkles, Globe, GraduationCap];

const stats = [
  { icon: Users, value: "1000+", label: "Students Placed" },
  { icon: TrendingUp, value: "90%", label: "Placement Rate" },
  { icon: Building2, value: "100+", label: "Hiring Partners" },
  { icon: Star, value: "4.8/5", label: "Course Rating" },
  { icon: Shield, value: "100%", label: "Placement Support" },
];

/** Generic renderer for the programmatic SEO landing pages migrated from
 * WordPress (course/city long-tail pages) — one H1 plus one rich-text body,
 * unlike the core site pages which are built from typed modules. Presents
 * that single body as a structured, animated page instead of one long
 * unstyled block of text. */
export function LandingPageClient({ cmsPage, slug }: { cmsPage: CMSPage; slug: string }) {
  const landingPage = cmsPage.landing_page!;
  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/${slug}/`) ?? organizationSchema;
  const [modalOpen, setModalOpen] = useState(false);

  const { heroLead, sections } = useMemo(() => parseLandingContent(landingPage.body), [landingPage.body]);
  const heroImage = useMemo(() => heroImageFor(`${landingPage.h1} ${slug}`), [landingPage.h1, slug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <ScrollProgress />
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-12 sm:py-20 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal/20 blur-[80px] animate-blob" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-[80px]" />

        <div className={`${container} relative grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center`}>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/60 mb-5 flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-gold/90 truncate max-w-[280px]">{landingPage.h1}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-extrabold text-gold ring-1 ring-gold/40 mb-4">
                <Sparkles className="h-3 w-3" />
                Finprov Learning
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-[2.6rem] leading-tight">
                {landingPage.h1}
              </h1>

              {heroLead && (
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/85 max-w-2xl">
                  {heroLead}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Expert-Led Training", "Practical Learning", "100% Placement Support"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white/90 backdrop-blur">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald" />
                    {badge}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-navy shadow-lg shadow-gold/30 transition-all hover:scale-105 hover:shadow-gold/50 hover:shadow-xl"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  Download Brochure
                </button>
                <Link
                  href="/admission"
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
              src={heroImage}
              alt={landingPage.h1}
              caption="Finprov Learning"
              subcaption="Sample image — swap anytime from the CMS"
              gradient="from-teal/80 to-navy/70"
              className="aspect-[4/3] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/15"
            />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-white py-5 shadow-sm">
        <div className={container}>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {stats.map(({ icon: Icon, value, label }) => (
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

      {/* CONTENT SECTIONS */}
      <section className="py-16 sm:py-24">
        <div className={`${container} max-w-[860px]`}>
          <div className="space-y-10">
            {sections.map((section, i) => {
              const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
              return (
                <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
                  <div className="rounded-2xl border border-border/70 bg-white p-6 sm:p-8 shadow-sm">
                    {section.heading && (
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cta/12">
                          <Icon className="h-5 w-5 text-cta" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-navy leading-snug">{section.heading}</h2>
                      </div>
                    )}

                    {section.html && (
                      <RichText
                        as="div"
                        html={section.html}
                        className="space-y-4 text-sm sm:text-base leading-relaxed text-text-body"
                      />
                    )}

                    {section.badges.length > 0 && (
                      <StaggerGrid className="flex flex-wrap gap-2.5">
                        {section.badges.map((badge) => (
                          <StaggerItem key={badge}>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-light px-3.5 py-2 text-xs font-bold text-navy">
                              <BadgeCheck className="h-3.5 w-3.5 text-teal" />
                              {badge}
                            </span>
                          </StaggerItem>
                        ))}
                      </StaggerGrid>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* CLOSING CTA */}
          <Reveal delay={Math.min(sections.length * 0.05, 0.3) + 0.1} className="mt-14">
            <div className="rounded-3xl bg-gradient-to-br from-navy to-navy/90 p-8 sm:p-10 text-white relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-teal/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold mb-5">
                  <Globe className="h-3.5 w-3.5" />
                  Career Placement Support
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight max-w-xl">
                  Ready to Start Your Professional Journey?
                </h3>
                <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-xl">
                  Our dedicated placement cell works directly with top firms across India and GCC countries to help you land high-paying roles upon completion.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-xs font-extrabold text-navy shadow-lg shadow-gold/30 hover:scale-105 transition-transform"
                  >
                    <Sparkles className="h-4 w-4" />
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
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
      <EnquireModal open={modalOpen} onClose={() => setModalOpen(false)} defaultCourse={landingPage.h1} />
    </div>
  );
}
