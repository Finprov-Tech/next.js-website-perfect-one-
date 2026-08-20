'use client';

import Link from "next/link";
import { ArrowUpRight, BarChart3, Building2, Check, ChevronDown, Clock3, Handshake, Lightbulb, MonitorSmartphone, Users } from "lucide-react";
import { useState } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { RichText } from "@/components/site/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";
import { businessProgramAreas, businessProgramSlug, getBusinessProgramDuration, hasOriginalBusinessProgramDetail } from "@/data/business";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { resolveCmsLink, type CMSPage } from "@/lib/cms";
import { slugPath } from "@/lib/sitePaths";
import { CmsIcon } from "@/lib/icons";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

const methodology = [
  ["Identification Of Needs Analysis", "We start with a TNA to pinpoint goals, gaps, and key skills your workforce needs."],
  ["Content Development", "Our team creates tailored training programs focused on goals and practical outcomes."],
  ["Experiential and Case-based learning", "We use real-case projects to help participants grasp concepts and apply learning confidently."],
  ["Continuous Assessment & Feedback", "We drive learning via interactive assessments, teamwork, and ongoing feedback."],
  ["Measurable Outcomes", "Finprov provides assessments, performance reports, feedback analysis, and learning analytics to track training effectiveness."],
  ["Post-Training Reinforcement", "We provide ongoing support after the classroom experience with follow-up sessions that help learners translate knowledge into workplace practice."],
] as const;

const defaultSolutions = [
  ["Corporate Training", "We deliver fully customized training programs designed specifically to meet your business objectives. This strengthens your organization’s performance and ensures your team’s skills are directly aligned with your strategic goals.", Building2],
  ["Hire-Deploy model", "In the hire-deploy model, we help you source and pool candidates based on your specific requirements. This ensures that your business receives the right talent quickly and efficiently, perfectly aligned with your hiring needs.", Users],
  ["Hire-Train-Deploy Model", "In our hire-train-deploy model, we select candidates based on your requirements, train them with the right skills as per your requirements and deploy them to your organization so that they are job-ready from day one.", Handshake],
  ["Managed Training Services", "Managed Training Services (MLS) is a professional solution where we operate as your organisation’s full learning partner, handling every stage of the training cycle, from planning and designing programmes to delivering them and assessing their impact. With our expertise, your organisation benefits from a smooth, comprehensive learning setup without having to maintain an internal training team.", BarChart3],
] as const;

const caseStudies = [
  {
    title: "Public Limited Real Estate Company",
    need: "Strengthen the finance team’s capability to apply key Ind AS standards relevant to the real estate sector, with the objective of reducing audit remarks, improving reporting accuracy, and accelerating month-end closing.",
    solution: "Custom 8-hour Ind AS training covering Ind AS 1, 40, 113, 116. Real-estate–specific case studies on revenue recognition, leases, investment property, and fair valuation. Practical worksheets, model entries, and daily-use checklists to reinforce accurate application.",
    outcomes: ["70% reduction in Ind AS-related audit queries within the next reporting cycle.", "80% faster month-end closing.", "95% improvement in accuracy scores on post-training assessments."],
  },
  {
    title: "KPO of a UAE-Based Retail Business Conglomerate",
    need: "Implement a structured, skills-based promotion framework for the finance team with clear competency benchmarks for role transitions from Jr. Accountant → Accountant → Sr. Accountant.",
    solution: "20-hour SAP accounting training on expenses, income, treasury, and tax modules. Role-based simulations and practical case studies aligned with actual responsibilities. Post-training assessment with SAP posting tasks and an objective scoring rubric to determine promotion readiness.",
    outcomes: ["100% alignment of promotion decisions with competency-based test results.", "40% improvement in SAP posting accuracy during evaluations.", "80% reduction in process errors reported by supervisors within one quarter."],
  },
] as const;

const defaultBusinessFaqs = [
  ["What makes Finprov’s corporate training program unique?", "Finprov combines expert-led instruction, real-world case studies, hands-on tools, customized learning paths, assessments, and post-training support. Programs are designed by industry professionals to ensure immediate workplace impact."],
  ["Does Finprov offer customized training programs for companies?", "Yes. Every program can be tailored to the company’s industry, skill gaps, tools used, and business goals."],
  ["Does Finprov provide certifications after training?", "Yes. Every program can be tailored to the company’s industry, skill gaps, tools used, and business goals."],
  ["Can Finprov deliver training onsite, virtually, or in hybrid mode?", "Absolutely. Finprov offers flexible delivery formats, including onsite at your office, fully online, or hybrid."],
  ["Does Finprov support post-training evaluation and reporting?", "Yes. Finprov provides assessments, performance reports, feedback analysis, and learning analytics to track training effectiveness."],
] as const;

export function BusinessPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const [selectedAreaTitle, setSelectedAreaTitle] = useState<string>(businessProgramAreas[0].title);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());

  const banner = cmsPage?.banner ?? null;
  const whyFinprov = cmsPage?.why_finprov ?? null;
  const cta = cmsPage?.cta ?? null;

  const heroBadge = banner?.badge_text || "Finprov Business";
  const heroHeading = banner?.heading || "Upskill Your Team, Strengthen Your Business!";
  const heroParagraph1 =
    banner?.paragraph ||
    "In today’s competitive environment, your employees are the driving force behind your success. Develop your team with modern, in-demand skills that enhance efficiency, innovation, and organizational growth.";
  const heroParagraph2 =
    banner?.rich_text ||
    "Finprov Learning works closely with organizations to create and deliver customized corporate training programs that align employee skills with business strategy.";

  const solutionsHeading = whyFinprov?.heading || "How Businesses Grow With Finprov Training";
  const solutionsEyebrow = whyFinprov?.sub_heading || "Business solutions";
  const solutionsParagraph =
    whyFinprov?.paragraph ||
    "Build a future-ready workforce with learning solutions shaped around your business goals. We bring the right skills, the right talent, and the right training to drive organisational growth.";
  const solutions = whyFinprov?.feature_cards?.length
    ? whyFinprov.feature_cards.map((c) => ({ title: c.title, description: c.description, iconKey: c.icon as string | null, Icon: null }))
    : defaultSolutions.map(([title, description, Icon]) => ({ title, description, iconKey: null as string | null, Icon }));

  const ctaHeading = cta?.heading || "Connect With Our Experts";
  const ctaParagraph = cta?.paragraph || "Find the right learning and hiring solutions with support from our expert team.";
  const ctaLabel = cta?.cta_text || "Talk to Finprov";
  const ctaHref = resolveCmsLink(cta?.cta_internal_page, cta?.cta_external_url, "/contact");

  const businessFaqs: readonly (readonly [string, string])[] = cmsPage?.faq?.length
    ? cmsPage.faq.map((f) => [f.question, f.answer] as const)
    : defaultBusinessFaqs;

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/business/`) ?? organizationSchema;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      <section className="relative overflow-hidden bg-navy py-14 text-white sm:py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-[400px] w-[400px] rounded-full bg-cta/25 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[380px] w-[380px] rounded-full bg-gold/20 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className={`${container} relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center`}>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              {heroBadge}
            </div>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {heroHeading}
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/85">
              <RichText html={heroParagraph1} />
            </p>
            <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-white/75">
              <RichText html={heroParagraph2} />
            </p>
            <div className="mt-6 flex flex-wrap gap-3.5">
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn-gloss inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs sm:text-sm font-extrabold text-navy shadow-lg shadow-gold/20 transition-transform duration-300 hover:scale-105"
              >
                Connect with our experts <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${site.email}?subject=Corporate%20training%20enquiry`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-white/20"
              >
                Request a proposal
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="glass-dark gloss-soft rounded-2xl p-6 sm:p-7 border border-white/15 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <MonitorSmartphone className="h-6 w-6 text-gold" />
              </div>
              <p className="mt-4 text-xl sm:text-2xl font-extrabold text-white leading-snug">Flexible delivery, measurable impact</p>
              <div className="mt-5 space-y-3 text-xs sm:text-sm text-white/85 font-medium">
                {["Onsite, online, and hybrid delivery", "Role- and industry-specific learning paths", "Assessments, feedback, and learning analytics"].map((item) => (
                  <p key={item} className="flex items-center gap-2.5">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint/20 text-mint">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-ambient py-24">
        <div className={container}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">Corporate training products</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-5xl">Corporate Training Products</h2>
          </Reveal>

          <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {businessProgramAreas.map((area) => (
              <button
                key={area.title}
                type="button"
                onClick={() => setSelectedAreaTitle(area.title)}
                className={`rounded-xl px-4 py-4 text-sm font-bold transition-colors sm:text-base ${selectedAreaTitle === area.title ? "bg-cta text-white shadow-lg shadow-cta/20" : "bg-navy/[0.06] text-navy hover:bg-navy/[0.1]"}`}
              >
                {area.title}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {businessProgramAreas.map((area, areaIndex) => {
              if (area.title !== selectedAreaTitle) return null;
              const expanded = expandedAreas.has(area.title);
              const visiblePrograms = expanded ? area.programs : area.programs.slice(0, 3);

              return (
              <Reveal key={area.title} delay={Math.min(areaIndex * 0.04, 0.2)}>
                <section className="glass gloss-soft rounded-3xl p-6 sm:p-8">
                  <div>
                    <div>
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cta/10 text-cta"><Lightbulb className="h-5 w-5" /></span>
                      <h3 className="mt-4 text-2xl font-bold text-navy">{area.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-text-body">{area.description}</p>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {visiblePrograms.map((program) => {
                        const cardContent = <><p className="font-semibold leading-snug text-navy">{program}</p><span className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cta">Know more <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span><span className="mt-1 flex items-center gap-1.5 text-xs text-text-body"><Clock3 className="h-3.5 w-3.5" /> Online / Offline · {getBusinessProgramDuration(program)}</span></>;
                        const className = "group rounded-2xl border border-border bg-white p-4 transition-all hover:-translate-y-1 hover:border-cta/30 hover:shadow-lg hover:shadow-cta/10";
                        return hasOriginalBusinessProgramDetail(program) ? <Link key={program} href={slugPath(businessProgramSlug(program))} className={className}>{cardContent}</Link> : <a key={program} href={site.whatsappHref} target="_blank" rel="noreferrer" className={className}>{cardContent}</a>;
                      })}
                    </div>
                  </div>
                  {area.programs.length > 3 && <button type="button" onClick={() => setExpandedAreas((current) => { const next = new Set(current); if (next.has(area.title)) next.delete(area.title); else next.add(area.title); return next; })} className="mt-6 text-sm font-bold text-cta underline underline-offset-4">{expanded ? "View less" : "View more"}</button>}
                </section>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy py-24 text-white">
        <div className={`${container} grid gap-12 lg:grid-cols-[0.8fr_1.2fr]`}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Our methodology</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Our Corporate Training Methodology</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/70">Companies trust Finprov to create real impact through customised training programs. Our methodology follows a structured process designed to meet company goals and empower teams to perform at their best.</p>
          </Reveal>
          <div className="space-y-4">
            {methodology.map(([title, description], index) => (
              <Reveal key={title} delay={index * 0.05}>
                <div className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-sm font-extrabold text-navy">{index + 1}</span>
                  <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-white/70">{description}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ambient py-24">
        <div className={container}>
          <Reveal><p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">{solutionsEyebrow}</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">{solutionsHeading}</h2><p className="mt-4 max-w-2xl text-text-body"><RichText html={solutionsParagraph} /></p></Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {solutions.map((s, index) => (
              <Reveal key={s.title} delay={index * 0.06}>
                <div className="glass gloss-soft h-full rounded-3xl p-7">
                  {s.Icon ? <s.Icon className="h-8 w-8 text-cta" /> : <CmsIcon name={s.iconKey} className="h-8 w-8 text-cta" />}
                  <h3 className="mt-5 text-xl font-bold text-navy">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-text-body">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 rounded-3xl bg-gradient-to-r from-cta via-teal to-cta p-8 text-center text-white shadow-xl shadow-cta/20 sm:p-12">
              <h2 className="text-3xl font-bold">{ctaHeading}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/80"><RichText html={ctaParagraph} /></p>
              <Link href={ctaHref} className="btn-gloss mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-navy">{ctaLabel} <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[oklch(0.97_0.014_225)] py-24">
        <div className={container}>
          <Reveal><p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">Case studies</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">Real-world learning impact</h2><p className="mt-4 max-w-2xl text-text-body">A look at how tailored training can address specific capability needs in finance teams.</p></Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {caseStudies.map((study, index) => (
              <Reveal key={study.title} delay={index * 0.08}>
                <article className="glass gloss-soft h-full rounded-3xl p-7"><h3 className="text-xl font-bold text-navy">{study.title}</h3><div className="mt-6 space-y-5 text-sm leading-relaxed text-text-body"><p><span className="font-bold text-navy">Need: </span>{study.need}</p><p><span className="font-bold text-navy">Solution: </span>{study.solution}</p><div><p className="font-bold text-navy">Measurable outcomes</p><ul className="mt-2 space-y-2">{study.outcomes.map((outcome) => <li key={outcome} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />{outcome}</li>)}</ul></div></div></article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ambient py-24">
        <div className={`${container} grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center`}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">Finprov Learning Business</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">Are you ready to upskill your team?</h2>
            <p className="mt-5 max-w-md leading-relaxed text-text-body">Connect with our team to discuss your organisation’s goals, team size, delivery preference, and learning priorities.</p>
          </Reveal>
          <Reveal delay={0.1} className="glass gloss-soft rounded-3xl p-7 sm:p-9">
            <form action={`mailto:${site.email}`} method="post" encType="text/plain" className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-navy">Name<input required name="name" className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none focus:border-cta focus:ring-4 focus:ring-cta/10" /></label>
              <label className="text-sm font-semibold text-navy">Work email<input required type="email" name="email" className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none focus:border-cta focus:ring-4 focus:ring-cta/10" /></label>
              <label className="text-sm font-semibold text-navy">Phone number<input required type="tel" name="phone" className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none focus:border-cta focus:ring-4 focus:ring-cta/10" /></label>
              <label className="text-sm font-semibold text-navy">Company<input required name="company" className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-normal outline-none focus:border-cta focus:ring-4 focus:ring-cta/10" /></label>
              <button className="btn-gloss sm:col-span-2 mt-2 rounded-xl bg-cta px-5 py-3.5 font-bold text-white transition-colors hover:bg-cta-hover">Submit details</button>
            </form>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy py-24 text-white">
        <div className={`${container} grid gap-10 lg:grid-cols-[0.75fr_1.25fr]`}>
          <Reveal><p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">Frequently asked questions</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Questions from business teams</h2></Reveal>
          <div className="space-y-3">
            {businessFaqs.map(([question, answer], index) => <Reveal key={question} delay={index * 0.05}><details open={index === 0} className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold"><span>{question}</span><ChevronDown className="h-5 w-5 shrink-0 text-gold transition-transform duration-200 group-open:rotate-180" /></summary><p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/70">{answer}</p></details></Reveal>)}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
