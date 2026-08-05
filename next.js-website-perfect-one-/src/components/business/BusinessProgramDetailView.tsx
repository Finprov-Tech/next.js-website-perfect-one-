'use client';

import Link from "next/link";
import { ArrowLeft, Check, Clock3, MonitorSmartphone, UserRound } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Reveal } from "@/components/motion/Reveal";
import { type BusinessProgram } from "@/data/business";
import { site } from "@/data/site";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export function BusinessProgramDetailView({ program }: { program: BusinessProgram }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className={`${container} relative`}>
          <Link
            href="/business"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Finprov Business
          </Link>
          <Reveal>
            <p className="mt-10 text-sm font-bold uppercase tracking-[0.18em] text-gold">
              {program.area}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              {program.title}
            </h1>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <MonitorSmartphone className="h-4 w-4 text-mint" /> Online / Offline
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <Clock3 className="h-4 w-4 text-mint" /> {program.duration}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-white py-16">
        <div className={container}>
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-navy">
              Introduction to {program.title.replace(/ Program$/, "")} Program
            </h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-cta">
              Program Snapshot
            </p>
            <p className="mt-8 max-w-4xl text-lg leading-relaxed text-text-body">
              {program.detail.snapshot}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-ambient py-20">
        <div className={`${container} grid gap-12 lg:grid-cols-[1.35fr_0.65fr]`}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">
              Program overview
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy">{program.title}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-body">
              {program.detail.overview}
            </p>
            <div className="mt-5 rounded-3xl border border-cta/15 bg-white p-7">
              <h3 className="text-xl font-bold text-navy">Delivery details</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <p className="rounded-2xl bg-bg-light p-4 text-sm text-text-body">
                  <span className="block font-bold text-navy">Type</span>Online / Offline
                </p>
                <p className="rounded-2xl bg-bg-light p-4 text-sm text-text-body">
                  <span className="block font-bold text-navy">Duration</span>
                  {program.duration}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:h-fit">
            <aside className="glass-navy gloss-soft rounded-3xl p-7 text-white">
              <h2 className="text-2xl font-bold">Connect with our experts</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Discuss your team’s needs and build the right learning plan.
              </p>
              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(program.title)}`}
                className="mt-6 block rounded-xl bg-gold px-4 py-3 text-center font-bold text-navy"
              >
                Request a proposal
              </a>
              <Link
                href="/contact"
                className="mt-3 block rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-bold hover:bg-white/10"
              >
                Talk to Finprov
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className={container}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">
              Key Highlights of {program.title.replace(/ Program$/, "")} Program
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">
              What does this program have to offer?
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-3xl border border-cta/15 bg-bg-light p-6 sm:p-8">
                <h3 className="text-xl font-bold leading-snug text-navy">
                  Top Skills You Will Learn From The {program.title.replace(/ Program$/, "")} Program
                </h3>
                <p className="mt-3 text-sm font-semibold text-cta">
                  Our curriculum covers in-demand industry relevant topics
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {program.detail.skills.map((skill: string) => (
                    <li key={skill} className="flex gap-2 text-sm text-text-body">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
            <Reveal delay={0.08}>
              <article className="h-full rounded-3xl border border-cta/15 bg-bg-light p-6 sm:p-8">
                <h3 className="text-xl font-bold text-navy">Who Is This Program For?</h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {program.detail.audience.map((group: string) => (
                    <li key={group} className="flex gap-2 text-sm text-text-body">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      {group}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-white">
        <div className={container}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
              Program highlights
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Skills you’ll acquire
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {program.detail.acquiredSkills.map((skill: string, index: number) => (
              <Reveal key={skill} delay={index * 0.04}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <Check className="h-5 w-5 text-mint" />
                  <h3 className="mt-4 font-bold">{skill}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ambient py-20">
        <div className={container}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">
              Learn from industry experts
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">
              Meet our expert team
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-text-body">
              {program.detail.expertIntro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["CA Anand Kumar", "CEO"],
              ["CA Veena Vijayan", "COO"],
              ["CA Deepa", "Business Valuation Expert"],
              ["CA Shameema Shajahan", "Corporate Training Lead – UAE"],
              ["CA Anish Thomas", "Academic Head – Karnataka"],
            ].map(([name, role], index) => (
              <Reveal key={name} delay={index * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-white p-5 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cta/10 text-cta">
                    <UserRound className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy">{name}</h3>
                  <p className="mt-1 text-xs text-text-body">{role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[oklch(0.97_0.014_225)] py-20">
        <div className={container}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">Admissions</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">
              How to apply
            </h2>
            <p className="mt-4 max-w-2xl text-text-body">
              The application journey is simple and straightforward, and can be completed in three easy steps.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Fill the application form",
                "Fill out the application form on the upGrad portal",
              ],
              [
                "02",
                "Get Shortlisted",
                "You will receive a shortlisting email based on your profile",
              ],
              [
                "03",
                "Block Your Seat",
                "Secure your seat by paying the course fee",
              ],
            ].map(([number, title, description], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-sm">
                  <span className="text-sm font-extrabold text-cta">{number}</span>
                  <h3 className="mt-4 text-xl font-bold text-navy">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-body">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {program.detail.faqs.length > 0 && (
        <section className="section-ambient py-20">
          <div className={`${container} grid gap-10 lg:grid-cols-[0.85fr_1.15fr]`}>
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cta">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-text-body">
                The application journey is simple and straightforward, and can be completed in three easy steps.
              </p>
            </Reveal>
            <div className="space-y-3">
              {program.detail.faqs.map(([question, answer], index) => (
                <Reveal key={question} delay={index * 0.04}>
                  <details
                    open={index === 0}
                    className="group rounded-2xl border border-border bg-white p-5"
                  >
                    <summary className="cursor-pointer list-none font-bold text-navy">
                      {question}
                    </summary>
                    <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-text-body">
                      {answer}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy py-20 text-white">
        <div className={`${container} grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center`}>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
              Connect with us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Build the right program for your team
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/70">
              Tell us about your organisation, participants, and learning goals. Our team will help you plan the next step.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <form
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
              className="grid gap-4 rounded-3xl bg-white p-6 text-navy sm:grid-cols-2 sm:p-8"
            >
              <label className="text-sm font-semibold">
                Name
                <input
                  required
                  name="name"
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-cta"
                />
              </label>
              <label className="text-sm font-semibold">
                Work Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-cta"
                />
              </label>
              <label className="text-sm font-semibold">
                Phone Number
                <input
                  required
                  type="tel"
                  name="phone"
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-cta"
                />
              </label>
              <label className="text-sm font-semibold">
                Company
                <input
                  required
                  name="company"
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 font-normal outline-none focus:border-cta"
                />
              </label>
              <input type="hidden" name="program" value={program.title} />
              <button className="sm:col-span-2 rounded-xl bg-cta px-5 py-3.5 font-bold text-white hover:bg-cta-hover">
                Submit details
              </button>
            </form>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
