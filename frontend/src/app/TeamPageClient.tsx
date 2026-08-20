'use client';

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { EnquireModal } from "@/components/site/EnquireModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { resolveCmsImageUrl, resolveCmsLink, type CMSPage } from "@/lib/cms";
import { RichText } from "@/components/site/RichText";

import anandPhoto from "@/assets/experts/anand-kumar.webp";
import veenaPhoto from "@/assets/experts/veena-vijayan.webp";
import taniyaPhoto from "@/assets/experts/taniya-mathew.webp";
import anishPhoto from "@/assets/experts/anish-thomas.webp";

const container = "mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12";

const getImageSrc = (img: any) => (typeof img === "string" ? img : img?.src || "");

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Management" | "Faculty";
  photo?: string;
  photoAlt?: string;
  experience?: string;
  credentials?: string;
  quote?: string;
  bio: string;
  highlights?: string[];
}

const defaultMembers: TeamMember[] = [
  // MANAGEMENT MEMBERS (6)
  {
    id: "anand-kumar",
    name: "CA Anand Kumar",
    role: "Founder & Chairman",
    category: "Management",
    photo: getImageSrc(anandPhoto),
    experience: "20+ Years Practice",
    credentials: "Chartered Accountant & Finance Specialist",
    quote: "Transforming traditional accounting education into real corporate mastery.",
    highlights: ["Corporate Practices & Profit Optimization", "Investment Banking & Mergers", "Startup Financial Mentor"],
    bio: "Anand Kumar is an expert Finance professional with strong commercial, strategic and operational focus. With twenty plus years of experience in multiple geographies and multiple industry sectors, his core specialities are corporate practices development, cost reduction & profit optimization, working capital management, credit risk management, investment banking, mergers & acquisition, ERP selection & implementation, business analytics, Joint Ventures (JVs). He has been a financial mentor and advisor to several startups and new businesses. As Chairman, he leads the organization's long-term vision and strategic direction."
  },
  {
    id: "veena-vijayan",
    name: "CA Veena Vijayan",
    role: "Chief Operating Officer & CEO",
    category: "Management",
    photo: getImageSrc(veenaPhoto),
    experience: "15+ Years Practice",
    credentials: "Chartered Accountant & Ex-Audit Partner",
    quote: "Empowering every student with high-precision systems and career-ready confidence.",
    highlights: ["Audit & Statutory Compliance", "Operational Systems & Quality", "Corporate Strategy"],
    bio: "Ms. Veena Vijayan is a Chartered Accountant with over 15 years of hands-on experience in finance, accounting, taxation, audit, and compliance across different industries. Throughout her career, she has taken on key responsibilities from managing finance and accounts departments to working as an Audit Manager and later becoming an Audit Partner. As Chief Operating Officer at Finprov, Ms. Veena focuses on building efficient systems, improving team performance, and delivering high-quality learning experiences."
  },
  {
    id: "alex-wijnen",
    name: "Alex Wijnen",
    role: "Strategic Advisor",
    category: "Management",
    experience: "35+ Years Practice",
    credentials: "Ex-EY Senior Partner & Deloitte Partner (Amsterdam)",
    highlights: ["Cross-Border Restructuring", "Deloitte & EY Partner", "Tax Model Improvement"],
    bio: "Alex Wijnen is a Chartered Accountant qualified from the Institute of Chartered Accountants in Australia and Dutch Institute of Registered Accountants. He has more than 35 years of professional experience in Finance & Accounting. During his career, he has held various prestigious positions such as Partner at Deloitte & Senior Partner at EY Amsterdam. His expertise lies in cross border restructuring and tax aligned operating model improvements."
  },
  {
    id: "philip-luke",
    name: "Philip Luke",
    role: "Strategic Advisor",
    category: "Management",
    credentials: "Corporate Governance Specialist",
    highlights: ["Corporate Strategy", "Policy Compliance", "Institutional Scaling"],
    bio: "Senior corporate advisor with decades of experience guiding educational institutions and multinational businesses on corporate strategy, policy compliance, and strategic expansion."
  },
  {
    id: "sr-nair",
    name: "SR Nair",
    role: "Strategic Advisor",
    category: "Management",
    credentials: "Technology & Enterprise Mentor",
    highlights: ["Enterprise Mentorship", "AI Infrastructure", "Digital Expansion"],
    bio: "Prominent entrepreneur, technology mentor, and strategic corporate advisor helping Finprov scale its digital infrastructure, AI integration, and national reach."
  },
  {
    id: "preetha-pk",
    name: "Preetha P. K",
    role: "General Manager — Operations",
    category: "Management",
    credentials: "Operations & Delivery Head",
    highlights: ["Operational Governance", "Center Administration", "Delivery Quality"],
    bio: "Manages operational governance, center administration, and student experience protocols across all physical and online learning hubs at Finprov."
  },

  // FACULTY MEMBERS (8)
  {
    id: "remesh-naick",
    name: "CA Remesh Naick",
    role: "Taxation & Auditing Faculty",
    category: "Faculty",
    experience: "25+ Years Exp",
    credentials: "Practicing Chartered Accountant",
    highlights: ["Indirect Taxation", "Auditing & Compliance", "Practical Case Studies"],
    bio: "Remesh Naick is a Chartered Accountant with more than 25 plus years of diverse experience, spreading from industries to conventional practice in the area of taxation, advisory, audit and compliance services. Along with handling the responsibilities of a practicing Chartered accountant, he has been teaching students on various subjects such as indirect taxes, auditing, etc. and sharing his passion for finance and accounting."
  },
  {
    id: "anu-jose",
    name: "CA Anu Jose",
    role: "Income Tax & Capital Gains Faculty",
    category: "Faculty",
    experience: "15+ Years Exp",
    credentials: "Chartered Accountant & ACCA IFRS Certified",
    highlights: ["Ex-Big 4 International Tax", "Capital Gains Planning", "ACCA IFRS Certified"],
    bio: "Anu Jose is a Chartered Accountant with more than 15 plus years of experience in public accounting and consulting. Anu is also IFRS certified from the Association of Chartered Certified Accountants (ACCA). She was part of International Tax Services and Supply Chain Management for 6 years in one of the Big 4 accounting firms. At Finprov, she proudly takes on the role of Income Tax Faculty."
  },
  {
    id: "anish-thomas",
    name: "CA Anish Thomas",
    role: "Academic Head & Faculty — Karnataka",
    category: "Faculty",
    photo: getImageSrc(anishPhoto),
    experience: "20+ Years Exp (14 Yrs Big 4)",
    credentials: "Chartered Accountant & Ex-Big 4 Senior Manager",
    quote: "Integrating Big 4 auditing rigor with modern AI data analytics.",
    highlights: ["14 Years Big 4 Assurance", "Retail & Tech Practice", "AI & Data Analytics"],
    bio: "Mr. Anish Thomas is a Chartered Accountant with nearly 20 years of experience, including 14 years with Big 4 firms, where he gained expertise in financial accounting, assurance, and advisory services across sectors like Retail, Technology, and Private Equity. He serves as Academic Head for Karnataka, combining his professional acumen with a passion for teaching and training future finance professionals. Anish integrates data analytics, automation, and AI-driven tools."
  },
  {
    id: "taniya-mathew",
    name: "CA Taniya Mathew",
    role: "Academic Head & Faculty — Kerala",
    category: "Faculty",
    photo: getImageSrc(taniyaPhoto),
    experience: "9+ Years Practice",
    credentials: "Chartered Accountant & Ex-Audit Manager",
    quote: "Creating industry-aligned curriculum that turns knowledge into corporate capability.",
    highlights: ["Taxation & Audit Manager", "Academic Delivery Lead", "Curriculum Development"],
    bio: "Taniya Mathew is a Chartered Accountant with over nine years of experience across various industries, having held key roles such as Audit Manager, Tax Manager and Finance Manager. Her diverse expertise, combined with a strong passion for education and mentoring, has led her to take on the role of Kerala Academic Head at Finprov. In this capacity, she plays a pivotal role in developing high-quality, industry-relevant learning modules."
  },
  {
    id: "roshly-roy",
    name: "Roshly Roy",
    role: "Lead Trainer — SAP S/4HANA",
    category: "Faculty",
    credentials: "Certified SAP FI & MM Specialist",
    highlights: ["SAP S/4HANA FI & MM", "Corporate Finance Operations", "ERP Lab Training"],
    bio: "Roshly Roy is a certified SAP Trainer with extensive experience in finance operations and training. In her role as Lead trainer – SAP at Finprov, she imparts the highest standards of training across FI and MM modules. With her wealth of experience and passion for training she ensures students understand the intricacies within SAP modules and gain practical insights."
  },
  {
    id: "anisha-charles",
    name: "Anisha Charles",
    role: "Practical Accounting & Finance Faculty",
    category: "Faculty",
    credentials: "Master of Commerce (M.Com)",
    highlights: ["Practical Bookkeeping", "Corporate Workflows", "Student Success"],
    bio: "Anisha Charles is a post-graduate in commerce with a keen interest shown in accounting and finance. After completing her masters, she landed her first job in the industry but soon after she began her career in teaching. She joins Finprov with a credible experience working in the industry and teaching, enhancing the student and learning experience of Finprov."
  },
  {
    id: "deena-augustine",
    name: "Deena Augustine",
    role: "Practical Accounting & Business Law Faculty",
    category: "Faculty",
    credentials: "M.Com, CMA Intermediate, SET Certified",
    highlights: ["GST Filing & ESI/PF", "Business Laws", "CMA Intermediate"],
    bio: "Deena Augustine is a passionate educator known for her dynamic teaching style and unwavering dedication to student growth. She holds a postgraduate degree in Commerce and has completed the CMA India Intermediate, currently pursuing her finals. Additionally, she has successfully cracked the SET exam for Commerce. At Finprov, she is a subject matter expert in Practical accounting, GST Filing, ESI PF and business law."
  },
  {
    id: "sreejith-t",
    name: "Sreejith T",
    role: "Lead Digital Marketing Trainer",
    category: "Faculty",
    experience: "5+ Years Exp",
    credentials: "Results-Driven Growth Specialist",
    highlights: ["SEO & Google Ads", "Social Media Strategy", "Placement Records"],
    bio: "Sreejith T is a highly experienced digital marketing trainer with 5+ years of expertise in empowering entrepreneurs, marketers, and businesses to thrive online. With a proven track record of delivering results-driven training, He has mentored hundreds of aspiring marketers with impressive placement records in renowned companies."
  }
];

function ScrollMemberCard({
  member,
  index,
  progress,
  total,
}: {
  member: TeamMember;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const center = index / Math.max(total - 1, 1);
  const step = 1 / Math.max(total - 1, 1);
  const phase = (value: number) => (value - center) / step;
  const fromLeft = index % 2 === 0;

  const x = useTransform(progress, (value) => {
    const position = phase(value);
    const entering = fromLeft ? -42 : 42;
    const exiting = fromLeft ? -48 : 48;
    return `${position < 0 ? position * entering : position * exiting}vw`;
  });
  const y = useTransform(progress, (value) => {
    const position = phase(value);
    const entering = fromLeft ? -24 : 18;
    const exiting = fromLeft ? -28 : 24;
    return `${position < 0 ? Math.abs(position) * entering : position * exiting}vh`;
  });
  const scale = useTransform(progress, (value) => {
    const position = phase(value);
    return 1 - Math.abs(position) * (position < 0 ? 0.68 : 0.58);
  });
  const opacity = useTransform(progress, (value) => Math.max(0, 1 - Math.abs(phase(value)) * 1.35));
  const rotateY = useTransform(progress, (value) => phase(value) * (fromLeft ? 62 : -62));
  const rotateZ = useTransform(progress, (value) => phase(value) * (fromLeft ? 12 : -12));
  const filter = useTransform(
    progress,
    (value) => `blur(${Math.max(0, (Math.abs(phase(value)) - 0.15) * 9.5)}px)`,
  );

  return (
    <motion.article
      style={{ x, y, scale, opacity, rotateY, rotateZ, filter, zIndex: total - index }}
      className="absolute left-1/2 top-1/2 h-[min(58vh,540px)] w-[min(76vw,390px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-white/25 bg-[#102b4a] shadow-[0_30px_100px_rgba(0,0,0,.55)] [transform-style:preserve-3d]"
    >
      {member.photo ? (
        <img src={member.photo} alt={member.photoAlt || member.name} className="h-full w-full object-cover object-top" />
      ) : (
        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_32%,rgba(48,167,203,.38),transparent_35%),linear-gradient(145deg,#153a59,#071426)]">
          <span className="text-8xl font-extrabold tracking-[-.1em] text-white/12">
            {member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#04101f] via-[#04101f]/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#ffb703]">{member.category}</p>
        <h3 className="mt-2 text-2xl font-bold leading-none text-white">{member.name}</h3>
        <p className="mt-2 text-xs font-medium text-white/58">{member.role}</p>
      </div>
    </motion.article>
  );
}

export function TeamPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const sceneRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const banner = cmsPage?.banner ?? null;
  const credentials = cmsPage?.credentials ?? null;
  const team = cmsPage?.team ?? null;
  const cta = cmsPage?.cta ?? null;

  const heroBadge = banner?.badge_text || "The people behind the progress";
  const heroHeading = banner?.heading || "Meet the team.";
  const heroParagraph =
    banner?.paragraph ||
    "Practicing experts, patient educators, and ambitious operators building finance careers that move forward.";

  const stats: [string, string][] = credentials?.items?.length
    ? credentials.items.map((item) => [item.value, item.title])
    : [
        ["14", "specialists"],
        ["100+", "years combined"],
        ["Big 4", "experience"],
        ["1", "shared mission"],
      ];

  const allMembers: TeamMember[] = team?.members?.length
    ? team.members.map((m) => ({
        id: String(m.id),
        name: m.name,
        role: m.role,
        category: (m.category as "Management" | "Faculty") || "Management",
        photo: resolveCmsImageUrl(m.photo) ?? undefined,
        photoAlt: m.photo_alt || undefined,
        experience: m.experience || undefined,
        credentials: m.credentials || undefined,
        quote: m.quote || undefined,
        bio: m.bio,
        highlights: m.highlights ? m.highlights.split("\n").filter(Boolean) : undefined,
      }))
    : defaultMembers;

  const ctaEyebrow = cta?.sub_heading || "Learn from people who do the work";
  const ctaHeading = cta?.heading || "Your next mentor is already here.";
  const ctaLabel = cta?.cta_text || "Explore programs";
  const ctaHref = resolveCmsLink(cta?.cta_internal_page, cta?.cta_external_url, "/all-courses");
  const secondaryLabel = cta?.secondary_cta_text || "Talk to an advisor";
  const secondaryHasLink = Boolean(cta?.secondary_cta_internal_page || cta?.secondary_cta_external_url);
  const secondaryHref = secondaryHasLink
    ? resolveCmsLink(cta?.secondary_cta_internal_page, cta?.secondary_cta_external_url, "#")
    : null;

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/team/`) ?? organizationSchema;

  const activeMember = allMembers[activeIndex] ?? allMembers[0];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(allMembers.length - 1, Math.max(0, Math.round(latest * (allMembers.length - 1))));
    setActiveIndex((current) => current === next ? current : next);
  });

  return (
    <div className="min-h-screen bg-[#06101f] font-sans text-white antialiased selection:bg-[#ffb703] selection:text-[#06101f]">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      <main>
        <section className="relative flex min-h-[94svh] items-end overflow-hidden pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_32%,rgba(25,142,196,.28),transparent_28%),radial-gradient(circle_at_22%_76%,rgba(255,183,3,.18),transparent_25%),linear-gradient(135deg,#071426_0%,#030914_65%,#071426_100%)]" />
          <div className="scene-grain opacity-[.035]" />
          <div className="pointer-events-none absolute left-[62%] top-[21%] h-[min(48vw,580px)] w-[min(48vw,580px)] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute left-[66%] top-[25%] h-[min(40vw,480px)] w-[min(40vw,480px)] rounded-full border border-[#ffb703]/20" />
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            className="pointer-events-none absolute left-[70%] top-[29%] hidden h-[min(32vw,390px)] w-[min(32vw,390px)] rounded-full border border-dashed border-white/20 lg:block"
          />

          <div className={`${container} relative z-10 pb-14 sm:pb-20`}>
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_340px]">
              <Reveal>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.28em] text-[#ffb703]">
                  <span className="h-px w-10 bg-[#ffb703]" />
                  {heroBadge}
                </div>
                <h1 className="mt-7 max-w-5xl text-[clamp(3.7rem,9.6vw,9rem)] font-extrabold leading-[.82] tracking-[-.075em] text-white">
                  {banner?.heading ? (
                    heroHeading
                  ) : (
                    <>
                      Meet the <span className="block text-[#ffb703]">team.</span>
                    </>
                  )}
                </h1>
              </Reveal>

              <Reveal delay={0.15} className="lg:pb-3">
                <p className="max-w-sm text-base leading-7 text-white/62">
                  <RichText html={heroParagraph} />
                </p>
                <a href="#meet-the-team" className="mt-8 inline-flex items-center gap-3 text-sm font-bold text-white">
                  Explore our people
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/5">
                    <ArrowDown className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            </div>

            <div className="mt-16 grid grid-cols-2 border-y border-white/10 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="border-white/10 px-4 py-5 first:pl-0 sm:border-r sm:last:border-r-0">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[.2em] text-white/38">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={sceneRef}
          id="meet-the-team"
          style={{ height: `${Math.max(760, allMembers.length * 78)}vh` }}
          className="relative border-t border-white/10 bg-[#071426]"
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(22,129,179,.3),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(255,183,3,.12),transparent_24%),linear-gradient(145deg,#0b1d36,#030a15_70%)]" />
            <div className="scene-grain opacity-[.045]" />
            <div className="scene-vignette" />
            <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(255,255,255,.55)_1px,transparent_1px)] [background-size:74px_74px]" />

            <div className="absolute left-5 top-24 z-40 sm:left-10 lg:left-12">
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#ffb703]">The Finprov orbit</p>
              <p className="mt-2 max-w-[180px] text-xs leading-5 text-white/45">Keep scrolling to meet every mind behind the mission.</p>
            </div>

            <div className="absolute right-5 top-24 z-40 text-right sm:right-10 lg:right-12">
              <p className="text-2xl font-bold tabular-nums text-white">
                {String(activeIndex + 1).padStart(2, "0")}
                <span className="text-white/25"> / {String(allMembers.length).padStart(2, "0")}</span>
              </p>
              <div className="mt-3 ml-auto h-1 w-28 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full origin-left bg-[#ffb703]" style={{ scaleX: scrollYProgress }} />
              </div>
            </div>

            <div className="absolute inset-0 z-10 [perspective:1100px]">
              {allMembers.map((member, index) => (
                <ScrollMemberCard
                  key={member.id}
                  member={member}
                  index={index}
                  total={allMembers.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[#04101f] via-[#04101f]/90 to-transparent pb-7 pt-24 sm:pb-10">
              <div className={`${container} grid items-end gap-5 lg:grid-cols-[1fr_1.2fr]`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMember.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#ffb703]">{activeMember.category}</p>
                    <h2 className="mt-2 text-3xl font-bold leading-none tracking-[-.04em] text-white sm:text-4xl">{activeMember.name}</h2>
                    <p className="mt-2 text-sm font-medium text-[#ffb703]/80">{activeMember.role}</p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeMember.id}-details`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hidden border-l border-white/15 pl-6 lg:block"
                  >
                    <p className="line-clamp-3 text-xs leading-6 text-white/52"><RichText html={activeMember.bio} /></p>
                    {activeMember.highlights && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                        {activeMember.highlights.map((highlight) => (
                          <span key={highlight} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-white/48">
                            <CheckCircle2 className="h-3 w-3 text-[#ffb703]" />
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(64vw,720px)] w-[min(64vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.06]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(45vw,510px)] w-[min(45vw,510px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffb703]/10" />
          </div>
        </section>

        <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-28 border-t border-b border-white/10">
          <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

          <div className={`${container} relative`}>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <Reveal>
                <p className="text-[11px] font-black uppercase tracking-[.28em] text-gold">{ctaEyebrow}</p>
                <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[.95] tracking-[-.05em] sm:text-6xl text-white">
                  {ctaHeading}
                </h2>
              </Reveal>
              <div className="flex flex-wrap gap-3">
                <Link href={ctaHref} className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 text-sm font-black text-navy shadow-xl transition-all hover:scale-105 hover:bg-gold-light">
                  {ctaLabel} <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
                {secondaryHref ? (
                  <Link href={secondaryHref} className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
                    {secondaryLabel}
                  </Link>
                ) : (
                  <button onClick={() => setEnquireOpen(true)} className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
                    {secondaryLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <EnquireModal open={enquireOpen} onClose={() => setEnquireOpen(false)} />
    </div>
  );
}
