'use client';

import { motion } from "framer-motion";
import { ArrowUpRight, User } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { mentors } from "@/data/mentors";

const container = "mx-auto w-full max-w-[1340px] px-5 sm:px-8 lg:px-10";

function HandArrow() {
  return (
    <svg viewBox="0 0 40 34" className="h-5 w-6 text-mint" fill="none" aria-hidden>
      <path d="M6 4c4 12 12 20 26 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
      <path d="M26 28l7-1-3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MentorsBand({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section className="relative bg-white">
      <svg viewBox="0 0 1440 48" className="block w-full text-emerald-deep" preserveAspectRatio="none" aria-hidden>
        <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" fill="currentColor" />
      </svg>
      <div className="relative overflow-hidden bg-emerald-deep py-12 sm:py-16 lg:py-20 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-70" />

        <div className={`${container} relative`}>
          <div className="grid items-end gap-6 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onEnquire}
                className="glass-solid gloss-soft group inline-flex items-center gap-2.5 rounded-full py-2 pl-5 pr-2 text-xs sm:text-sm font-extrabold text-emerald-deep shadow-lg"
              >
                Start Your Finance Career
                <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-deep text-mint transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </motion.button>
            </Reveal>

            <Reveal delay={0.1} className="lg:text-right">
              <p className="font-mono text-xs font-bold text-mint">03</p>
              <h2 className="mt-0.5 text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-[.18em] text-white">
                Mentors who actually show up
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/75 max-w-md lg:ml-auto">
                Our Founder, CEO, and academic heads don't just guide — they teach, review, and grow with you.
              </p>
            </Reveal>
          </div>

          <StaggerGrid className="mt-10 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
            {mentors.map((m) => (
              <StaggerItem key={m.name}>
                <div className="group flex flex-col items-center">
                  <div className="flex h-11 flex-col items-center justify-end">
                    <span className="font-hand text-xl font-semibold leading-none text-white">{m.name.replace(/^CA /, "")}</span>
                    <HandArrow />
                  </div>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="frost relative mt-1.5 aspect-square w-full max-w-[195px] sm:max-w-[210px] overflow-hidden rounded-2xl border border-white/20 shadow-xl"
                  >
                    {m.photo ? (
                      <img
                        src={typeof m.photo === "string" ? m.photo : (m.photo as any)?.src}
                        alt={m.name}
                        className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        <User className="h-11 w-11 text-white/25" strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-deep/95 via-emerald-deep/65 to-transparent p-3 pt-7">
                      <p className="text-xs sm:text-sm font-extrabold leading-tight text-white">{m.name}</p>
                      <p className="mt-0.5 text-[11px] font-bold text-mint line-clamp-1">{m.role}</p>
                    </div>
                  </motion.div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}
