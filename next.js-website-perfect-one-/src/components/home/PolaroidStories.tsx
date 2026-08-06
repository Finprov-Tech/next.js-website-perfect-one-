'use client';

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { testimonials } from "@/data/testimonials";
import { resolveCmsImageUrl, type CMSTestimonial } from "@/lib/cms";

const tilts = [-3, 2.5, -2, 3, -2.5, 2];

function Polaroid({ name, role, company, photo, tilt }: { name: string; role: string; company: string; photo?: string; tilt: number }) {
  return (
    <div className="flex w-52 sm:w-56 shrink-0 flex-col items-center">
      <p className="mb-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-navy/55">{company}</p>
      <motion.div
        whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
        style={{ rotate: tilt }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="group relative w-full rounded-xl bg-white p-3 pb-4 shadow-lg shadow-navy/15 ring-1 ring-border/80"
      >
        {/* tape */}
        <span className="absolute -top-2.5 left-1/2 h-4 w-16 -translate-x-1/2 -rotate-2 rounded-sm bg-gold/45 backdrop-blur-[1px] shadow-sm" />
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-teal/20 via-slate-50 to-mint/20 border border-slate-100">
          {photo ? (
            <img src={photo} alt={name} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" loading="lazy" />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <User className="h-12 w-12 text-navy/25" strokeWidth={1.25} />
            </div>
          )}
        </div>
        <p className="mt-2.5 text-center text-sm font-extrabold text-navy">{name}</p>
        <p className="text-center text-xs font-medium text-slate-500 mt-0.5">{role}</p>
      </motion.div>
    </div>
  );
}

export function PolaroidStories({ testimonials: cmsTestimonials }: { testimonials?: CMSTestimonial[] | null } = {}) {
  const stories = cmsTestimonials?.length
    ? cmsTestimonials.map((t) => ({ name: t.name, role: t.designation, company: t.company, photo: resolveCmsImageUrl(t.avatar) || undefined }))
    : testimonials.map((t) => ({ name: t.name, role: t.role, company: t.company, photo: t.photo }));

  return (
    <section className="section-ambient overflow-hidden py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="inline-block rounded-full bg-mint/30 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[.16em] text-emerald border border-emerald/20 shadow-sm">
            SUCCESS STORIES
          </span>
          <h2 className="mt-2 font-hand text-3xl font-bold text-navy sm:text-4xl lg:text-5xl tracking-tight">
            From Classroom Training to Industry Roles
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-text-body/80 max-w-xl mx-auto font-medium">
            People who started just like you — now working in finance, analytics, and marketing.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="group/marquee mt-8 overflow-hidden pb-4 pt-2 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <div className="flex w-max gap-7 animate-marquee-slow group-hover/marquee:[animation-play-state:paused]">
            {[...Array(2)].map((_, r) => (
              <div key={r} className="flex gap-7 pr-7">
                {stories.map((t, i) => (
                  <Polaroid
                    key={`${r}-${t.name}`}
                    name={t.name}
                    role={t.role}
                    company={t.company}
                    photo={t.photo}
                    tilt={tilts[i % tilts.length]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
