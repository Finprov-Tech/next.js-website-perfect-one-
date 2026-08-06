'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Asterisk, Trophy } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { placementStats, testimonials } from "@/data/testimonials";
import { resolveCmsImageUrl, resolveCmsLink, type CMSCTA } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

const cardStyles = [
  "bg-gradient-to-b from-[oklch(0.55_0.2_255)] to-[oklch(0.4_0.18_262)] text-white",
  "bg-gradient-to-b from-gold to-[oklch(0.68_0.17_60)] text-navy",
  "bg-gradient-to-b from-mint to-teal text-emerald-deep",
  "bg-gradient-to-b from-[oklch(0.5_0.19_280)] to-[oklch(0.38_0.17_285)] text-white",
];

export function LearningToEarning({ cta }: { cta?: CMSCTA | null }) {
  const placed = testimonials.slice(0, 4);
  const paragraph =
    cta?.paragraph ||
    `Experienced instructors, hands-on software training, and a placement cell that stays with you. Every Finprov program carries 100% placement assistance — and our learners hold a ${placementStats.placementRecord}% placement record across cohorts.`;
  const ctaLabel = cta?.cta_text || "More Placements";
  const ctaHref = resolveCmsLink(cta?.cta_internal_page, cta?.cta_external_url, "/placement");
  const bgImage = resolveCmsImageUrl(cta?.image);

  return (
    <section className="relative overflow-hidden bg-[oklch(0.24_0.07_250)] py-12 text-white">
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[oklch(0.24_0.07_250)]/80" />
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-15" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-mint/10 blur-3xl animate-blob" />

      <div className={`${container} relative grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]`}>
        <Reveal>
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.2em] text-mint">
            <Asterisk className="h-4 w-4" /> Our Placements
          </p>
          {cta?.heading ? (
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-[52px] sm:leading-[1.05]">{cta.heading}</h2>
          ) : (
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-[52px] sm:leading-[1.05]">
              From <span className="bg-gradient-to-r from-mint to-teal bg-clip-text text-transparent animate-gradient-x">Learning</span> to{" "}
              <span className="bg-gradient-to-r from-gold to-mint bg-clip-text text-transparent animate-gradient-x">Earning</span>
            </h2>
          )}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
            {paragraph}
          </p>

          <div className="glass-dark gloss-soft mt-8 flex items-center gap-4 rounded-2xl p-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mint/15 text-mint">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold">{placementStats.placementRecord}% Placement Record</p>
              <p className="text-sm text-white/60">Programs designed to crack your dream career.</p>
            </div>
          </div>

          <Link href={ctaHref}>
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="frost group mt-9 inline-flex items-center gap-2.5 rounded-full py-2 pl-6 pr-2 text-sm font-bold transition-transform hover:-translate-y-0.5"
            >
              {ctaLabel}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-mint text-emerald-deep transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </motion.span>
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {placed.map((t, i) => (
              <motion.div
                key={t.name}
                whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className={`gloss relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-black/30 ring-1 ring-white/25 ${cardStyles[i % cardStyles.length]} ${
                  i % 2 === 1 ? "mt-10" : ""
                }`}
              >
                <div className="placed-texture pointer-events-none absolute -left-1 top-1 select-none text-[44px] font-extrabold uppercase leading-[0.95]">
                  Placed
                  <br />
                  Placed
                  <br />
                  Placed
                </div>
                <div className="relative pt-20">
                  <p className="text-lg font-extrabold leading-tight">{t.name}</p>
                  <p className="mt-1 text-sm font-medium opacity-85">
                    {t.role} at {t.company}
                  </p>
                  <p className="mt-3 rounded-lg bg-black/15 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide backdrop-blur-sm">
                    {t.program}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
