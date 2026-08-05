'use client';

import Link from "next/link";
import { ArrowLeft, Briefcase, CheckCircle2, Mail, MapPin, Phone, Send, Share2, User } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PopularTopicsFooter } from "@/components/site/PopularTopicsFooter";
import { Reveal } from "@/components/motion/Reveal";
import { type JobOpening } from "@/data/careers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export function JobDetailView({ job }: { job: JobOpening }) {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [applicant, setApplicant] = useState({ name: "", email: "", phone: "", experience: "", note: "" });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setApplyModalOpen(false);
      setApplicant({ name: "", email: "", phone: "", experience: "", note: "" });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy py-16 text-white md:py-20">
        <div className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
        
        <div className={container}>
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal hover:underline mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Job Openings
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-bold text-teal uppercase tracking-wider">
              {job.department}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {job.location}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> {job.type}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
            {job.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setApplyModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-bold text-white shadow-e2 transition-all hover:bg-cta-hover"
            >
              <Send className="h-4 w-4" /> Apply for this Position
            </button>
            <a
              href={`mailto:${job.applyEmail}?subject=Application for ${job.title}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white border border-white/15 hover:bg-white/20"
            >
              <Mail className="h-4 w-4" /> Email Resume
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-16">
        <div className={`${container} grid gap-12 lg:grid-cols-[1fr_360px]`}>
          
          <div className="space-y-8">
            <Reveal>
              <div className="rounded-2xl bg-white p-8 shadow-sm border border-navy/10">
                <h2 className="text-xl font-bold text-navy border-b border-navy/10 pb-4 mb-6">
                  Job Overview & Description
                </h2>

                <div className="prose prose-navy max-w-none text-navy/80 whitespace-pre-line leading-relaxed font-normal text-base">
                  {job.description}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl bg-teal/10 p-8 border border-teal/20">
                <h3 className="text-lg font-bold text-navy">Ready to Apply?</h3>
                <p className="mt-2 text-sm text-navy/70">
                  Please send your updated resume along with any portfolio/work samples directly to our HR team, or click the Apply Now button to submit your details online.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cta-hover"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit Online Application
                  </button>
                  <a
                    href={`mailto:${job.applyEmail}?subject=Application for ${job.title}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white hover:bg-navy/90"
                  >
                    <Mail className="h-3.5 w-3.5" /> Send to {job.applyEmail}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-navy/10 sticky top-24">
              <h3 className="text-base font-bold text-navy border-b border-navy/10 pb-3 mb-4">
                Job Overview
              </h3>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/50">Department</dt>
                  <dd className="mt-1 font-semibold text-navy">{job.department}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/50">Location</dt>
                  <dd className="mt-1 font-semibold text-navy">{job.location}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/50">Experience Required</dt>
                  <dd className="mt-1 font-semibold text-navy">{job.experience}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/50">Employment Type</dt>
                  <dd className="mt-1 font-semibold text-navy">{job.type}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-navy/50">Direct Contact Email</dt>
                  <dd className="mt-1 font-semibold text-teal hover:underline">
                    <a href={`mailto:${job.applyEmail}`}>{job.applyEmail}</a>
                  </dd>
                </div>
                {job.applyPhone && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-navy/50">WhatsApp HR</dt>
                    <dd className="mt-1 font-semibold text-navy">
                      <a href={`https://wa.me/${job.applyPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-teal">
                        {job.applyPhone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 pt-4 border-t border-navy/10 space-y-3">
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cta py-3 text-xs font-bold text-white shadow-sm hover:bg-cta-hover"
                >
                  <Send className="h-3.5 w-3.5" /> Apply Now
                </button>
                <a
                  href={job.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-bg-light py-2.5 text-xs font-bold text-navy/70 hover:bg-navy/10"
                >
                  <Share2 className="h-3.5 w-3.5" /> View on Original Site
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Apply Modal */}
      <Dialog open={applyModalOpen} onOpenChange={(open) => setApplyModalOpen(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-navy">
              Apply for {job.title}
            </DialogTitle>
          </DialogHeader>

          {formSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal/15 text-teal">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">Application Submitted!</h3>
              <p className="mt-2 text-sm text-navy/70">
                Thank you for applying for <span className="font-semibold text-navy">{job.title}</span>. Our recruitment team will review your profile and contact you soon.
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
                  onClick={() => setApplyModalOpen(false)}
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
