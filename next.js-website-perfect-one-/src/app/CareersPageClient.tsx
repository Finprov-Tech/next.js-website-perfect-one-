'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, ChevronRight, Compass, Mail, MapPin, Phone, Search, Send, Sparkles, User } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PopularTopicsFooter } from "@/components/site/PopularTopicsFooter";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { careerHero, culturePerks, jobOpenings, type Department, type JobOpening } from "@/data/careers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import { resolveCmsLink, type CMSPage } from "@/lib/cms";
import { RichText } from "@/components/site/RichText";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

const departments: (Department | "All")[] = [
  "All",
  "Growth & Sales",
  "Marketing",
  "Technology",
  "Academics",
  "Operations",
];

export function CareersPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const [selectedDept, setSelectedDept] = useState<Department | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [applyModal, setApplyModal] = useState<{ open: boolean; job?: JobOpening }>({ open: false });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({ name: "", email: "", phone: "", experience: "", note: "" });

  const banner = cmsPage?.banner ?? null;
  const whyFinprov = cmsPage?.why_finprov ?? null;
  const cta = cmsPage?.cta ?? null;

  const heroBadge = banner?.badge_text || careerHero.subtitle;
  const heroHeading = banner?.heading || careerHero.title;
  const heroParagraph = banner?.paragraph || careerHero.description;

  const perksEyebrow = whyFinprov?.sub_heading || "Life at Finprov";
  const perksHeading = whyFinprov?.heading || "Why Build Your Career With Us?";
  const perksParagraph =
    whyFinprov?.paragraph ||
    "We cultivate an environment where ambition meets support. Here is what you can expect when you join our team.";
  const perks = whyFinprov?.feature_cards?.length
    ? whyFinprov.feature_cards.map((c) => ({ title: c.title, description: c.description }))
    : culturePerks;

  const ctaHeading = cta?.heading || "Don't see the right position?";
  const ctaParagraph =
    cta?.paragraph ||
    "We are always on the lookout for exceptional talent. Send your resume directly to our HR team and we will reach out when a relevant opportunity opens up.";
  const secondaryLabel = cta?.secondary_cta_text || `WhatsApp HR (${careerHero.applyPhone})`;
  const secondaryHref = resolveCmsLink(
    cta?.secondary_cta_internal_page,
    cta?.secondary_cta_external_url,
    `https://wa.me/${careerHero.applyPhone.replace(/[^0-9]/g, "")}`,
  );

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/career/`) ?? organizationSchema;

  const filteredJobs = useMemo(() => {
    return jobOpenings.filter((job) => {
      const matchesDept = selectedDept === "All" || job.department === selectedDept;
      const matchesQuery =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesQuery;
    });
  }, [selectedDept, searchQuery]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setApplyModal({ open: false });
      setApplicant({ name: "", email: "", phone: "", experience: "", note: "" });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy py-20 text-white md:py-24">
        <div className="pointer-events-none absolute -left-16 top-4 h-80 w-80 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -right-16 bottom-4 h-80 w-80 rounded-full bg-cta/15 blur-3xl animate-blob animation-delay-2000" />

        <div className={`${container} relative grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center`}>
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal border border-white/10"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {heroBadge}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight"
            >
              {heroHeading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl"
            >
              <RichText html={heroParagraph} />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="#openings"
                className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3.5 text-sm font-semibold text-white shadow-e2 transition-all hover:bg-cta-hover hover:shadow-e3"
              >
                <Briefcase className="h-4 w-4" /> View {jobOpenings.length} Open Positions
              </a>
              <a
                href={`mailto:${careerHero.applyEmail}`}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-sm font-semibold text-white border border-white/15 backdrop-blur-md transition-all hover:bg-white/20"
              >
                <Mail className="h-4 w-4" /> Send Resume Direct
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <PhotoSlot
              alt="Finprov Careers"
              caption="Join Finprov's vibrant team of innovators, educators, and leaders"
              className="aspect-[4/3] shadow-2xl ring-1 ring-white/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Culture & Perks Section */}
      <section className="py-20 bg-bg-light/60 border-b border-navy/5">
        <div className={container}>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-teal">{perksEyebrow}</span>
              <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
                {perksHeading}
              </h2>
              <p className="mt-3 text-navy/70">
                <RichText html={perksParagraph} />
              </p>
            </div>
          </Reveal>

          <div className="mt-12">
            <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((perk, i) => (
                <StaggerItem key={i}>
                  <div className="h-full rounded-2xl bg-white p-6 shadow-sm border border-navy/5 transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal font-bold">
                      {i + 1}
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-navy">{perk.title}</h3>
                    <p className="mt-2 text-sm text-navy/70 leading-relaxed">{perk.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="py-20">
        <div className={container}>
          <Reveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal">Current Openings</span>
                <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
                  Explore Open Roles ({filteredJobs.length})
                </h2>
                <p className="mt-2 text-navy/70">
                  Find the role that matches your skills and aspirations across our offices in Kochi, Bangalore, and Cherthala.
                </p>
              </div>

              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-navy/15 bg-white py-2.5 pl-10 pr-4 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-navy/10 pb-4">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  selectedDept === dept
                    ? "bg-navy text-white shadow-sm"
                    : "bg-bg-light text-navy/70 hover:bg-navy/10 hover:text-navy"
                }`}
              >
                {dept} {dept !== "All" && `(${jobOpenings.filter((j) => j.department === dept).length})`}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-navy/20 p-12 text-center">
                <Compass className="mx-auto h-12 w-12 text-navy/30" />
                <h3 className="mt-4 text-lg font-bold text-navy">No positions found</h3>
                <p className="mt-1 text-sm text-navy/60">
                  Try adjusting your search criteria or explore other departments.
                </p>
                <button
                  onClick={() => {
                    setSelectedDept("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <StaggerGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <StaggerItem key={job.id}>
                    <div className="group flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-navy/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-teal/30">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-[11px] font-bold text-teal uppercase tracking-wider">
                            {job.department}
                          </span>
                          <span className="text-xs text-navy/50 font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location.split("(")[0].trim()}
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-extrabold text-navy group-hover:text-teal transition-colors">
                          {job.title}
                        </h3>

                        <p className="mt-2 text-sm text-navy/70 line-clamp-3 leading-relaxed">
                          {job.shortDesc}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-navy/5 pt-4">
                        <div className="flex items-center justify-between text-xs text-navy/60 font-medium mb-4">
                          <span>Experience: {job.experience}</span>
                          <span>Type: {job.type}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/career/${job.slug}`}
                            className="inline-flex items-center justify-center gap-1 rounded-xl bg-bg-light px-3 py-2 text-xs font-bold text-navy hover:bg-navy/10 transition-colors"
                          >
                            Details <ChevronRight className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => setApplyModal({ open: true, job })}
                            className="inline-flex items-center justify-center gap-1 rounded-xl bg-cta px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-cta-hover transition-colors"
                          >
                            Apply Now <Send className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        </div>
      </section>

      {/* Direct Application CTA Section */}
      <section className="bg-navy py-16 text-white">
        <div className={`${container} text-center`}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold sm:text-3xl">{ctaHeading}</h2>
            <p className="mt-3 text-white/80 leading-relaxed text-sm sm:text-base">
              <RichText html={ctaParagraph} />
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${careerHero.applyEmail}?subject=General Application - Finprov Careers`}
                className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-cta-hover transition-colors"
              >
                <Mail className="h-4 w-4" /> Email Resume ({careerHero.applyEmail})
              </a>
              <a
                href={secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Phone className="h-4 w-4" /> {secondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <Dialog open={applyModal.open} onOpenChange={(open) => setApplyModal({ open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-navy">
              Apply for {applyModal.job?.title || "Role at Finprov"}
            </DialogTitle>
          </DialogHeader>

          {formSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">Application Submitted!</h3>
              <p className="mt-2 text-sm text-navy/70">
                Thank you for applying for <span className="font-semibold text-navy">{applyModal.job?.title}</span>. Our recruitment team will review your application and get in touch with you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                  <input
                    required
                    type="text"
                    placeholder="Enter your full name"
                    value={applicant.name}
                    onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                    className="w-full rounded-xl border border-navy/15 bg-white py-2.5 pl-9 pr-3 text-sm text-navy focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                    <input
                      required
                      type="email"
                      placeholder="you@email.com"
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      className="w-full rounded-xl border border-navy/15 bg-white py-2.5 pl-9 pr-3 text-sm text-navy focus:border-teal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy/40" />
                    <input
                      required
                      type="tel"
                      placeholder="+91 Mobile"
                      value={applicant.phone}
                      onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                      className="w-full rounded-xl border border-navy/15 bg-white py-2.5 pl-9 pr-3 text-sm text-navy focus:border-teal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">Years of Experience</label>
                <input
                  type="text"
                  placeholder="e.g. 3 years in EdTech / Digital Marketing"
                  value={applicant.experience}
                  onChange={(e) => setApplicant({ ...applicant, experience: e.target.value })}
                  className="w-full rounded-xl border border-navy/15 bg-white py-2.5 px-3 text-sm text-navy focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">Cover Note / Summary</label>
                <textarea
                  rows={3}
                  placeholder="Briefly tell us why you are a great fit for this role..."
                  value={applicant.note}
                  onChange={(e) => setApplicant({ ...applicant, note: e.target.value })}
                  className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy focus:border-teal focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModal({ open: false })}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-navy/70 hover:bg-bg-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cta-hover"
                >
                  <Send className="h-3.5 w-3.5" /> Submit Application
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <PopularTopicsFooter />
      <SiteFooter />
    </div>
  );
}
