'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { siteStats } from "@/data/site";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

export function AboutBand() {
  return (
    <section id="about" className="relative overflow-hidden bg-[oklch(0.96_0.015_220)] py-10 text-blue sm:py-12">
      <div className="pointer-events-none absolute inset-0 welcome-grid opacity-40" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-cta/20 blur-3xl animate-blob" />

      <div className={`${container} relative grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]`}>
        <Reveal>
          <span className="frost inline-flex items-center gap-2.5 rounded-full py-1.5 pl-4 pr-1.5 text-sm font-semibold">
            About Finprov
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-8 w-8 place-items-center rounded-full bg-cta text-white"
            >
              <ArrowDown className="h-4 w-4" />
            </motion.span>
          </span>
          <h2 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
            We Started Small.
            <br />
            Now We're Building Futures.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="text-lg leading-relaxed ">
            What began as a group of Chartered Accountants determined to close the gap between commerce education
            and real jobs has grown into {siteStats.centres} centres across Kerala and Bengaluru — three schools,{" "}
            {siteStats.coursesOffered}+ programs, and {siteStats.placements.toLocaleString()}+ careers launched.
            Finprov continues to shape real careers through real practice.
          </p>
          <Link href="/about">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gloss mt-8 inline-flex rounded-full bg-cta px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-cta/25"
            >
              Know More About Us
            </motion.span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
