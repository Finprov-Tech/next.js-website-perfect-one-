'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Target,
  Compass,
  Trophy,
  ShieldCheck,
  Sparkles,
  Lightbulb,
  HeartHandshake,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import keralaStudents from "@/assets/kerala-students.png";
import anandKumarPhoto from "@/assets/experts/anand-kumar.webp";
import veenaVijayanPhoto from "@/assets/experts/veena-vijayan.webp";
import taniyaMathewPhoto from "@/assets/experts/taniya-mathew.webp";
import anishThomasPhoto from "@/assets/experts/anish-thomas.webp";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { CountUp } from "@/components/motion/CountUp";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { useState } from "react";
import { EnquireModal } from "@/components/site/EnquireModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { parseCountValue, resolveCmsImageUrl, resolveCmsLink } from "@/lib/cms";
import { RichText } from "@/components/site/RichText";
import { CmsIcon } from "@/lib/icons";
import type { CMSPage } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

const getImageSrc = (img: any) => (typeof img === "string" ? img : img?.src || "");

const timeline = [
  {
    year: "2014 — The Foundation",
    title: "Chartered Accountants spot the industry gap",
    desc: "Senior CAs with decades of combined practice realized traditional commerce degrees lacked hands-on GST, Tally, and SAP skills. Finprov was born to bridge this exact divide.",
  },
  {
    year: "2017 — Software-First Curriculum",
    title: "Launch of real filing simulations",
    desc: "Pioneered real-time tax filing, live corporate accounting software practice, and e-invoicing simulations directly inside the classroom.",
  },
  {
    year: "2020 — Multi-Disciplinary Expansion",
    title: "Three specialized skill schools",
    desc: "Expanded beyond finance into Digital Marketing and Data Analytics, empowering graduates for modern tech-enabled business roles.",
  },
  {
    year: "2023 — IIT Palakkad iHub Partnership",
    title: "National recognition & certification",
    desc: "Earned official certification partnership with IIT Palakkad iHub for Advanced Digital Marketing and SAP S/4HANA specialization.",
  },
  {
    year: "Present & Future",
    title: "10 Centres, 4,500+ Placements & Online Reach",
    desc: "Operating across Kochi, Calicut, Trivandrum, Bengaluru, and virtual classrooms nationwide, maintaining a 98% placement track record.",
  },
];

const defaultCoreValues = [
  {
    icon: Target,
    title: "Practicality First",
    desc: "We focus 80% of our training on real software tools, live GST portals, and simulated balance sheets used by top employers.",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Career Support",
    desc: "Our commitment doesn't end at graduation. We provide continuous placement assistance, interview practice, and career upgrades for life.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    desc: "Our curriculum is reviewed quarterly by practicing CAs and industry leaders to incorporate emerging software and regulatory changes.",
  },
  {
    icon: ShieldCheck,
    title: "Uncompromising Integrity",
    desc: "We instill ethical accounting practices, transparent compliance, and professional standards in every single student.",
  },
];

const defaultStats = [
  { value: "4,500+", label: "Learners Placed" },
  { value: "300+", label: "Hiring Partners" },
  { value: "10", label: "Centres & Online" },
  { value: "98%", label: "Placement Success Rate" },
];

const experts = [
  {
    name: "CA Anand Kumar H",
    role: "Founder and Chairman",
    photo: getImageSrc(anandKumarPhoto),
    bio: "Finprov offers high-quality training to enhance skills across accounting and finance, helping students stay competitive whether looking for a new job or advancing in their career.",
  },
  {
    name: "CA Veena Vijayan",
    role: "CEO",
    photo: getImageSrc(veenaVijayanPhoto),
    bio: "Leads executive strategy, institutional partnerships, and operational excellence across all Finprov academies and digital learning verticals.",
  },
  {
    name: "CA Taniya Mathew",
    role: "Academic Head - Kerala",
    photo: getImageSrc(taniyaMathewPhoto),
    bio: "Directs academic quality, faculty development, and signature simulation labs for Finprov learning centers across Kerala.",
  },
  {
    name: "CA Anish Thomas",
    role: "Academic Head - Karnataka",
    photo: getImageSrc(anishThomasPhoto),
    bio: "Leads academic operations, corporate placement initiatives, and software-driven training verticals across Karnataka campuses.",
  },
];

const awards = [
  {
    title: "IIT Palakkad iHub Certified",
    subtitle: "Official Technology & Skill Partner",
    desc: "Recognized by IIT Palakkad iHub for delivering industry-standard digital and tech skill programs.",
  },
  {
    title: "Best Finance & Accounting Institute",
    subtitle: "South India Excellence Awards 2024",
    desc: "Awarded for highest student placement rate and practical curriculum in accounting education.",
  },
  {
    title: "Authorized Tally & SAP Practice Hub",
    subtitle: "Official Enterprise Software Certification",
    desc: "Direct integration with official enterprise software standards, ensuring 100% employer-ready skills.",
  },
];

export function AboutPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const [enquireOpen, setEnquireOpen] = useState(false);

  const banner = cmsPage?.banner ?? null;
  const credentials = cmsPage?.credentials ?? null;
  const whyFinprov = cmsPage?.why_finprov ?? null;
  const cta = cmsPage?.cta ?? null;

  const heroBadge = banner?.badge_text || "About Finprov Learning";
  const heroHeading = banner?.heading || "We Started Small. Now We're Building Futures.";
  const heroParagraph =
    banner?.paragraph ||
    "Founded by practicing Chartered Accountants, Finprov Learning bridges the gap between traditional degrees and real-world corporate demands across 10 centres in Kerala and Karnataka, plus online learning.";
  const heroImage = resolveCmsImageUrl(banner?.image) || getImageSrc(keralaStudents);
  const heroImageAlt = banner?.image_alt || "Finprov learners collaborating in the classroom";
  const heroFloatingBadge = banner?.top_card_title || "Founded by CAs";

  const stats = credentials?.items?.length
    ? credentials.items.map((item) => ({ value: item.value, label: item.title }))
    : defaultStats;

  const coreValues = whyFinprov?.feature_cards?.length
    ? whyFinprov.feature_cards.map((card) => ({ icon: null, iconKey: card.icon, title: card.title, desc: card.description }))
    : defaultCoreValues.map((v) => ({ icon: v.icon, iconKey: null as string | null, title: v.title, desc: v.desc }));

  const teamMembers = cmsPage?.team?.members?.length
    ? cmsPage.team.members.map((m) => ({
        name: m.name,
        role: m.role,
        photo: resolveCmsImageUrl(m.photo) || getImageSrc(keralaStudents),
        photoAlt: m.photo_alt || m.name,
        bio: m.bio,
      }))
    : experts.map((e) => ({ ...e, photoAlt: e.name }));

  const historyEyebrow = cmsPage?.history?.eyebrow || "Decade of Excellence";
  const historyHeading = cmsPage?.history?.heading || "Finprov's History & Growth";
  const historySubheading =
    cmsPage?.history?.sub_heading || "From a single classroom in Kochi to a premier multi-city educational institution.";
  const timelineItems = cmsPage?.history?.milestones?.length
    ? cmsPage.history.milestones.map((m) => ({ year: m.year_label, title: m.title, desc: m.description }))
    : timeline;

  const ctaHeading = cta?.heading || "Ready to Build a High-Growth Career?";
  const ctaParagraph =
    cta?.paragraph ||
    "Join over 4,500+ successful graduates placed in top MNCs, Big 4 audit firms, and leading technology companies across India.";
  const ctaLabel = cta?.cta_text || "Explore Our Programs";
  const ctaHref = resolveCmsLink(cta?.cta_internal_page, cta?.cta_external_url, "/all-courses");
  const secondaryLabel = cta?.secondary_cta_text || "Speak with a Counselor";
  const secondaryHasLink = Boolean(cta?.secondary_cta_internal_page || cta?.secondary_cta_external_url);
  const secondaryHref = secondaryHasLink
    ? resolveCmsLink(cta?.secondary_cta_internal_page, cta?.secondary_cta_external_url, "#")
    : null;

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/about/`) ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-14 text-white">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div
          className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        />
        <div className={`${container} relative grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-center`}>
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-mint ring-1 ring-white/20"
            >
              {banner?.badge_icon ? (
                <CmsIcon name={banner.badge_icon} className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}{" "}
              {heroBadge}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight"
            >
              {heroHeading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/80 font-normal"
            >
              <RichText html={heroParagraph} />
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative max-w-[460px] mx-auto lg:max-w-none w-full"
          >
            <PhotoSlot
              src={heroImage}
              alt={heroImageAlt}
              caption="Our Classrooms"
              subcaption="Empowering thousands of learners every year"
              gradient="from-teal/80 to-cta/70"
              className="aspect-[4/3] max-h-[360px] w-full"
            />
            <div className="absolute -left-3 -top-3 animate-float rounded-xl bg-gold px-3.5 py-1.5 text-xs font-black text-navy shadow-lg">
              {heroFloatingBadge}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="border-b border-border bg-white py-8 sm:py-10">
        <div className={`${container} grid grid-cols-2 gap-8 text-center md:grid-cols-4`}>
          {stats.map((s) => {
            const { end, suffix } = parseCountValue(s.value);
            return <Stat key={s.label} value={<CountUp end={end} suffix={suffix} />} label={s.label} />;
          })}
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-10 sm:py-12 bg-bg-light/50">
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal">Our Core Purpose</span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Vision &amp; Mission</h2>
            <p className="mt-2 text-xs sm:text-sm text-text-body max-w-xl mx-auto font-normal">
              Driven by a commitment to build high-earning, confident professionals through practical education.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal delay={0.1}>
              <div className="glass gloss-soft flex h-full flex-col justify-between rounded-2xl p-5 sm:p-6 border border-border/80 shadow-md hover:shadow-lg transition-all">
                <div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal mb-3.5">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-navy">Our Vision</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-body">
                    To be India's most trusted and innovator-driven career academy, empowering every commerce, finance, and tech aspirant with practical, software-driven expertise to excel in the global economy.
                  </p>
                </div>
                <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-teal flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Global Standards &bull; Practical Mastery
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="glass gloss-soft flex h-full flex-col justify-between rounded-2xl p-5 sm:p-6 border border-border/80 shadow-md hover:shadow-lg transition-all">
                <div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold mb-3.5">
                    <Target className="h-5 w-5 text-gold-dark" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-navy">Our Mission</h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-body">
                    To deliver hands-on, job-oriented programs certified by top industry partners like IIT Palakkad iHub and SAP. We equip students with real GST filing, Tally Prime, and corporate workflow skills backed by 100% placement support.
                  </p>
                </div>
                <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-gold-dark flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> IIT Palakkad iHub Partner &bull; Live Tax Filings
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Leadership & Experts Section */}
      <section className="py-10 sm:py-12" id="experts">
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal">Leadership &amp; Governance</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Meet Our Experts</h2>
            <p className="mt-3 text-sm text-text-body max-w-xl mx-auto">
              Guided by practicing Chartered Accountants and industry leaders with decades of corporate leadership.
            </p>
          </Reveal>

          <StaggerGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((e) => (
              <StaggerItem key={e.name}>
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-2xl hover:shadow-[#0077c5]/10">
                  <div>
                    <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/4.8] w-full">
                      <img
                        src={e.photo}
                        alt={e.photoAlt}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="mt-4">
                      <span className="inline-block rounded-full bg-[#0077c5]/10 px-3 py-1 text-[11px] font-bold text-[#0077c5]">
                        {e.role}
                      </span>
                      <h3 className="mt-2.5 text-lg font-extrabold text-navy group-hover:text-[#0077c5] transition-colors">
                        {e.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {e.bio}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3.5">
                    <Link
                      href="/team"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077c5] transition-colors hover:text-navy"
                    >
                      View Full Profile <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Finprov's History & Journey Timeline */}
      <section className="bg-navy py-12 sm:py-14 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-teal/15 blur-3xl" />
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-mint">{historyEyebrow}</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{historyHeading}</h2>
            <p className="mt-3 text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              {historySubheading}
            </p>
          </Reveal>

          <div className="relative mt-10">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/20 md:left-1/2" />
            <div className="space-y-8">
              {timelineItems.map((t, i) => (
                <Reveal key={t.year} delay={i * 0.05}>
                  <div
                    className={`relative flex flex-col gap-4 pl-12 md:grid md:grid-cols-2 md:gap-8 md:pl-0 ${
                      i % 2 === 1 ? "md:text-right" : ""
                    }`}
                  >
                    <div className="absolute left-4 top-1.5 h-4 w-4 -translate-x-1/2 rounded-full bg-gold ring-4 ring-gold/30 md:left-1/2" />
                    <div className={i % 2 === 1 ? "md:order-2" : ""}>
                      <span className="text-xs font-bold uppercase tracking-widest text-mint">{t.year}</span>
                      <h3 className="mt-1 text-lg font-bold text-white">{t.title}</h3>
                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/75">{t.desc}</p>
                    </div>
                    <div className={i % 2 === 1 ? "md:order-1" : ""} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Achievements */}
      <section className="py-10 sm:py-12 bg-bg-light/40">
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal">Accreditations &amp; Honors</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Awards &amp; Achievements</h2>
            <p className="mt-3 text-sm text-text-body max-w-2xl mx-auto">
              Validated by leading technology hubs, government bodies, and educational awards.
            </p>
          </Reveal>

          <StaggerGrid className="mt-10 grid gap-6 md:grid-cols-3">
            {awards.map((a) => (
              <StaggerItem key={a.title}>
                <div className="glass gloss-soft flex h-full flex-col justify-between rounded-3xl p-6 border border-border/80 shadow-md hover:shadow-xl transition-all">
                  <div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark mb-4">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-navy">{a.title}</h3>
                    <p className="text-xs font-semibold text-teal mt-1">{a.subtitle}</p>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-text-body">{a.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-10 sm:py-12">
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal">Our Pillars</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Core Values</h2>
            <p className="mt-3 text-sm text-text-body max-w-2xl mx-auto">
              The fundamental principles that guide our teaching methodology and student mentorship.
            </p>
          </Reveal>

          <StaggerGrid className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((v) => {
              const IconComp = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <div className="glass gloss-soft flex h-full flex-col rounded-2xl p-6 border border-border/80 hover:border-teal/40 transition-colors">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal mb-4">
                      {IconComp ? <IconComp className="h-5 w-5" /> : <CmsIcon name={v.iconKey} className="h-5 w-5" />}
                    </div>
                    <h3 className="font-bold text-navy text-lg">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-body">{v.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* Single Bottom Call To Action */}
      <section className="py-12 sm:py-14 bg-gradient-to-br from-navy via-[oklch(0.25_0.08_252)] to-navy text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className={`${container} relative text-center`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-4 py-1 text-xs font-bold text-gold ring-1 ring-gold/30">
            <Sparkles className="h-3.5 w-3.5" /> Start Your Learning Journey
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">{ctaHeading}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-white/80"><RichText html={ctaParagraph} /></p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 font-bold text-navy shadow-xl transition-all hover:bg-gold-light hover:scale-105"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryHref ? (
              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white transition-all hover:bg-white/20"
              >
                {secondaryLabel}
              </Link>
            ) : (
              <button
                onClick={() => setEnquireOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white transition-all hover:bg-white/20"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />

      <EnquireModal open={enquireOpen} onClose={() => setEnquireOpen(false)} />
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-navy sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm font-medium text-text-body">{label}</div>
    </div>
  );
}
