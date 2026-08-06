'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Building2, Briefcase } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { CountUp } from "@/components/motion/CountUp";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { ReelStories } from "@/components/site/ReelStories";
import { hiringPartners, placementStats, testimonials as staticTestimonials, type Testimonial } from "@/data/testimonials";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { parseCountValue, resolveCmsImageUrl, resolveCmsLink, type CMSPage, type CMSTestimonial } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

function fromCmsTestimonial(t: CMSTestimonial): Testimonial {
  return {
    initials: t.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    name: t.name,
    role: t.designation,
    company: t.company,
    quote: t.quote,
    program: t.program,
    photo: resolveCmsImageUrl(t.avatar) || undefined,
  };
}

export function PlacementsPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const placements = cmsPage?.placements ?? null;

  const heroHeading = placements?.heading || "Placement Highlights FY2026";
  const heroSubHeading =
    placements?.sub_heading || "Real outcomes from learners who trained on the tools employers actually use.";

  const stats = placements?.stats?.length
    ? placements.stats.map((s) => ({ label: s.label, value: s.value }))
    : [
        { label: "Learners Placed", value: String(placementStats.learnersPlaced) },
        { label: "Unique Roles Explored", value: `${placementStats.uniqueRolesExplored}+` },
        { label: "Interviews Conducted", value: `${placementStats.interviewsConducted}+` },
        { label: "Companies Hired", value: `${placementStats.companiesHired}+` },
      ];

  const learningParagraph =
    placements?.paragraph ||
    `Our supportive environment combines experienced instructors with hands-on, tool-led learning. We back every cohort with 100% placement assistance and a ${placementStats.placementRecord}% placement record.`;

  const ctaLabel = placements?.cta_text || "Explore Programs";
  const ctaHref = resolveCmsLink(placements?.cta_internal_page, placements?.cta_external_url, "/courses");

  const testimonials: Testimonial[] = cmsPage?.testimonials?.length
    ? cmsPage.testimonials.map(fromCmsTestimonial)
    : staticTestimonials;

  const partnerNames: string[] = cmsPage?.partner_logos?.length
    ? cmsPage.partner_logos.map((p) => p.name)
    : hiringPartners;
  const topPartners = partnerNames.slice(0, Math.ceil(partnerNames.length / 2));
  const bottomPartners = partnerNames.slice(Math.ceil(partnerNames.length / 2));

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/placement/`) ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      {/* Hero stat band */}
      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-25" />
        <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-blob" />
        <div className={`${container} relative text-center`}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            {heroHeading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-lg text-white/70"
          >
            {heroSubHeading}
          </motion.p>

          <StaggerGrid className="glass-dark gloss-soft mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-8 rounded-3xl p-8 md:grid-cols-4">
            {stats.map((s) => {
              const { end, suffix } = parseCountValue(s.value);
              return (
                <StaggerItem key={s.label}>
                  <Stat value={<CountUp end={end} suffix={suffix} />} label={s.label} />
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* Success reels */}
      <section className="py-16">
        <div className={container}>
          <Reveal className="text-center">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Watch Real Placement Stories</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <ReelStories stories={testimonials} />
          </Reveal>
        </div>
      </section>

      {/* From learning to earning */}
      <section className="py-24">
        <div className={`${container} grid gap-16 lg:grid-cols-2 lg:items-center`}>
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-widest text-teal">Our Placements</span>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              From <span className="text-teal">Learning</span> to Earning.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-text-body">{learningParagraph}</p>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-bg-light p-5 ring-1 ring-border">
              <div className="btn-gloss grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal/15 text-teal">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-navy">{placementStats.placementRecord}% Placement Record</p>
                <p className="text-sm text-text-body">Our programs are designed to land your dream career.</p>
              </div>
            </div>
            <Link
              href={ctaHref}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {ctaLabel} →
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
            {testimonials.slice(0, 4).map((t, i) => (
              <motion.div
                key={t.initials + i}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-5 text-white shadow-lg ${
                  ["bg-navy", "bg-teal", "bg-cta", "bg-gold text-navy"][i % 4]
                } ${i % 2 === 1 ? "mt-8" : ""}`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide opacity-70">Placed</div>
                <p className="mt-2 font-bold">{t.name}</p>
                <p className="text-sm opacity-80">{t.role}</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Success stories */}
      <section className="section-ambient py-24">
        <div className={container}>
          <Reveal className="text-center">
            <span className="inline-block rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
              Success Stories
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-navy sm:text-5xl">From Training to Industry Roles</h2>
            <p className="mt-4 text-lg text-text-body">People who started just like you — now working in the field.</p>
          </Reveal>

          <StaggerGrid className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <motion.div whileHover={{ y: -6 }} className="glass gloss-soft flex h-full flex-col rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <PhotoSlot src={t.photo} alt={t.name} className="h-12 w-12 rounded-full" hover={false} />
                    <div>
                      <p className="font-bold text-navy">{t.name}</p>
                      <p className="text-xs text-text-body">
                        {t.role} · {t.company}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm italic leading-relaxed text-text-body">"{t.quote}"</p>
                  <p className="mt-4 text-xs font-semibold text-teal">{t.program}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Dual Direction Hiring partner marquees */}
      <section className="py-20 overflow-hidden">
        <div className={container}>
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">Our Hiring Partners</h2>
          </Reveal>
        </div>
        <div className="mt-12 space-y-4">
          {/* Top Row: Scrolls LEFT */}
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max items-center gap-12 px-8 animate-marquee-slow">
              {[...Array(2)].map((_, r) => (
                <div key={r} className="flex items-center gap-12">
                  {topPartners.map((p) => (
                    <div key={`${r}-${p}`} className="flex items-center gap-2 text-xl font-bold text-navy/50 grayscale transition-all hover:text-teal hover:grayscale-0">
                      <Building2 className="h-5 w-5 text-teal/60" />
                      {p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Scrolls RIGHT */}
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max items-center gap-12 px-8 animate-marquee-reverse">
              {[...Array(2)].map((_, r) => (
                <div key={r} className="flex items-center gap-12">
                  {bottomPartners.map((p) => (
                    <div key={`${r}-${p}`} className="flex items-center gap-2 text-xl font-bold text-navy/50 grayscale transition-all hover:text-cta hover:grayscale-0">
                      <Briefcase className="h-5 w-5 text-cta/60" />
                      {p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs font-medium text-white/70">{label}</div>
    </div>
  );
}
