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
  HeartHandshake,
  ArrowRight,
  ArrowUpRight,
  Users,
  Rocket,
  Scale,
  Zap,
  BookOpen,
  MonitorPlay,
  MessageCircle,
} from "lucide-react";
import keralaStudents from "@/assets/kerala-students.png";
import aboutHeroImage from "@/assets/about-hero-student.png";
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

const heroSubHeading1 = "Achieve Excellence with World-Class Training & Education";
const heroSubHeading2 = "Leading Digital Marketing, Finance & Accounting Training Institute";
const heroIntro =
  "Finprov Learning is a leading education and upskilling platform aiming at an innovative and highest quality education in Digital marketing, Finance and Accounting. Providing training to both students and professionals, Finprov Learning's vision is to create world-class professionals in the sector with in-depth theoretical knowledge and ready to work, hands-on experience.";
const heroHighlights = [
  "Practical job training",
  "Case study based learning",
  "Real Work Experience",
  "Tech-enabled learning",
];

const visionText =
  "To enable learners worldwide to acquire industry relevant skills to pursue / accelerate career growth, creating successful businesses and improve their lives and communities.";
const missionText =
  "To deliver innovative and practical learning experiences that bridge the gap between education and industry standards, leveraging the latest technology to empower learners with job-ready skills, entrepreneurial expertise, and a commitment to continuous learning, ensuring career growth and meaningful impact on society.";

const ourStoryParagraphs = [
  "We founded Finprov Learning after being inspired by industry leaders, entrepreneurs, and experienced professionals. We recognized that many individuals lacked adequate education in key areas such as finance and digital marketing, which affected their careers and businesses. Our mission is to offer the right guidance and education in these fields to help individuals build successful careers. We have 40+ years of industry experience serving students. We have 11 locations across Kerala and Bangalore.",
  "Finprov has successfully trained thousands of our learners over the years by providing education, guidance, and leadership, resulting in over 4500+ placements across our organization. We focus on delivering practical learning that equips students to face real-world challenges, enabling them to grow professionally and achieve lasting success. Along with traditional offline training methods, we embrace technology-aided Online, E-learning, and Hybrid methods of learning, making education affordable and accessible for everyone.",
];

const pathToSuccessParagraphs = [
  "Finprov offers high-quality upskilling courses designed to help learners enhance their skills across various fields. We provide training that helps students stay competitive and succeed in their careers. Whether starting a new job or advancing in your current role, Finprov ensures you gain the right practical experience and expertise needed to thrive in today's job market.",
  "Our courses enhance professional skills to help individuals improve their corporate abilities and perform well in job interviews. We also provide placement assistance, connecting our learners with top global companies. With a focus on both technical and soft skills development, Finprov prepares students for career success in today's competitive environment.",
];

const liveCoreValues = [
  {
    icon: HeartHandshake,
    title: "Learner First",
    points: [
      "We prioritise learners' success in every decision we make",
      "We listen, adapt and innovate to create the best learning experience",
    ],
  },
  {
    icon: Rocket,
    title: "Growth & Innovation",
    points: [
      "We constantly upskill ourselves and help others do the same",
      "We challenge the status quo and innovate to create better outcomes",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Accountability",
    points: [
      "We take complete ownership of our responsibilities and outcomes",
      "We hold ourselves and each other to high standards and deliver on our promises",
    ],
  },
  {
    icon: Users,
    title: "Teamwork",
    points: [
      "We support each other, communicate openly and win as one team",
      "We put team success above individual credit",
    ],
  },
  {
    icon: Scale,
    title: "Integrity",
    points: [
      "We act with honesty even when no one's watching",
      "We build and maintain trust with all stakeholders",
    ],
  },
  {
    icon: Zap,
    title: "Work Hard, Play Harder",
    points: ["We value both hard work and fun"],
  },
];

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

const defaultStats = [
  { value: "4,500+", label: "Learners Placed" },
  { value: "300+", label: "Hiring Partners" },
  { value: "11", label: "Centres & Online" },
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
  const [trialEmail, setTrialEmail] = useState("");
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  const banner = cmsPage?.banner ?? null;
  const credentials = cmsPage?.credentials ?? null;
  const cta = cmsPage?.cta ?? null;

  const heroBadge = banner?.badge_text || "About Finprov Learning";
  const heroHeading = banner?.heading || "About Finprov";
  const heroImage = getImageSrc(aboutHeroImage);
  const heroImageAlt = banner?.image_alt || "Finprov learner with books — professional training and placement support";
  const heroFloatingBadge = banner?.top_card_title || "Founded by CAs";

  const stats = credentials?.items?.length
    ? credentials.items.map((item) => ({ value: item.value, label: item.title }))
    : defaultStats;

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
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-3 text-xl font-bold text-mint sm:text-2xl"
            >
              {heroSubHeading1}
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-2 text-base font-semibold text-white/90 sm:text-lg"
            >
              {heroSubHeading2}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-white/80 font-normal"
            >
              {heroIntro}
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-5 grid gap-2 sm:grid-cols-2"
            >
              {heroHighlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </motion.ul>
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
              fit="contain"
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
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-body">{visionText}</p>
                </div>
                <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-teal flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Global career growth &bull; Lasting community impact
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
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-text-body">{missionText}</p>
                </div>
                <div className="mt-4 border-t border-border/60 pt-3 text-[11px] font-bold text-gold-dark flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Job-ready skills &bull; Industry-aligned learning
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-10 sm:py-12">
        <div className={container}>
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-wider text-teal">Our Story</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Built on Experience, Driven by Learners</h2>
            <div className="mt-6 max-w-3xl space-y-4 text-sm sm:text-base leading-relaxed text-text-body">
              {ourStoryParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Path to Success */}
      <section className="py-10 sm:py-12 bg-bg-light/50">
        <div className={container}>
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-wider text-teal">Career Support</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              We Help You Find Your Path To Success
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 text-sm sm:text-base leading-relaxed text-text-body">
              {pathToSuccessParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Leadership & Experts Section */}
      <section className="py-10 sm:py-12" id="experts">
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal">Leadership &amp; Governance</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Learn With the Industry Experts</h2>
            <p className="mt-3 text-sm text-text-body max-w-2xl mx-auto">
              Our team of expert trainers, with extensive industry experience, is committed to enhancing students&apos; professional
              skills and preparing them for rewarding careers in accounting and digital marketing.
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
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Core Values of Finprov Learning</h2>
            <p className="mt-3 text-sm text-text-body max-w-2xl mx-auto">
              The principles that guide every decision we make for our learners, teams, and partners.
            </p>
          </Reveal>

          <StaggerGrid className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveCoreValues.map((v) => {
              const IconComp = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <div className="glass gloss-soft flex h-full flex-col rounded-2xl p-6 border border-border/80 hover:border-teal/40 transition-colors">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal mb-4">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-navy text-lg">{v.title}</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-body">
                      {v.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* Professional Certificate CTA */}
      <section className="py-10 sm:py-12 bg-bg-light/50">
        <div className={`${container} text-center`}>
          <Reveal>
            <BookOpen className="mx-auto h-10 w-10 text-teal" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Take Our Courses &amp; Earn Professional Certificate
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-text-body">
              We are proudly being part of the worldwide change in education by developing and offering Accounting, Data Analytics
              and Digital Marketing courses.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/all-courses"
                className="inline-flex items-center gap-2 rounded-xl bg-cta px-6 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                <MonitorPlay className="h-4 w-4" /> Demo Class
              </Link>
              <button
                type="button"
                onClick={() => setEnquireOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-navy/15 bg-white px-6 py-3.5 text-sm font-bold text-navy shadow-sm transition-colors hover:border-teal/40 hover:bg-teal/5"
              >
                <MessageCircle className="h-4 w-4" /> Talk To An Expert
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Free trial */}
      <section className="py-10 sm:py-12">
        <div className={container}>
          <Reveal>
            <div className="glass gloss-soft mx-auto max-w-2xl rounded-3xl border border-border/80 p-8 text-center shadow-md sm:p-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
                <Sparkles className="h-3.5 w-3.5" /> Free Trial
              </span>
              <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">Try It Free for 7 Days</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-body">
                Experience our comprehensive finance and accounting courses firsthand. Start your free trial today and see how we
                can elevate your career prospects!
              </p>
              {trialSubmitted ? (
                <p className="mt-6 text-sm font-semibold text-teal">Thanks — we&apos;ll be in touch shortly.</p>
              ) : (
                <form
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (trialEmail.trim()) setTrialSubmitted(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    value={trialEmail}
                    onChange={(e) => setTrialEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-navy/90"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              <p className="mt-4 text-xs text-text-body/70">We care about your data in our privacy policy.</p>
            </div>
          </Reveal>
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
