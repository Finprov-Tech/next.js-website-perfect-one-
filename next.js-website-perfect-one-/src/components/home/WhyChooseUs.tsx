'use client';

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import keralaStudents from "@/assets/kerala-students.png";
import keralaAdvisor from "@/assets/kerala-advisor.png";
import heroMentor from "@/assets/hero-mentor.png";
import { Reveal } from "@/components/motion/Reveal";
import { whyChooseUs } from "@/data/site";
import type { CMSWhyFinprovSection } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

const getImageSrc = (img: any) => (typeof img === "string" ? img : img?.src || "");

const notes = [
  { text: "GST filing", cls: "bg-[#fff3c4] -rotate-6 left-[2%] top-[6%]" },
  { text: "Balance sheet", cls: "bg-[#d8ecff] rotate-3 right-[4%] top-[2%]" },
  { text: "Power BI dashboard", cls: "bg-[#cfe8ff] -rotate-3 left-[6%] bottom-[10%]" },
  { text: "Mock interview", cls: "bg-[#dde6ff] rotate-6 right-[8%] bottom-[4%]" },
];

export function WhyChooseUs({ whyFinprovSection }: { whyFinprovSection?: CMSWhyFinprovSection | null }) {
  const photos = [
    { src: getImageSrc(keralaStudents), cls: "left-[16%] top-[18%] h-28 w-28 -rotate-3" },
    { src: getImageSrc(keralaAdvisor), cls: "right-[18%] top-[34%] h-24 w-24 rotate-2" },
    { src: getImageSrc(heroMentor), cls: "left-[30%] bottom-[16%] h-24 w-24 rotate-6" },
  ];

  const subHeading =
    whyFinprovSection?.sub_heading ||
    "We don't just teach skills — we help you build a growth mindset that lasts a lifetime.";
  const items = whyFinprovSection?.feature_cards?.length
    ? whyFinprovSection.feature_cards.map((f) => ({ title: f.title }))
    : whyChooseUs.slice(0, 4).map((w) => ({ title: w.title }));

  return (
    <section className="section-ambient overflow-hidden py-8 sm:py-10">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]`}>
        {/* Sticky-note & photo collage */}
        <Reveal className="relative hidden min-h-[360px] lg:block">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-teal/30 animate-orbit" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/40" />

          {photos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 240, damping: 18 }}
              whileHover={{ scale: 1.12, rotate: 0, zIndex: 10 }}
              className={`absolute overflow-hidden rounded-3xl shadow-xl ring-4 ring-white ${p.cls}`}
            >
              <img src={p.src} alt="Life at Finprov" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
          ))}

          {notes.map((n, i) => (
            <motion.div
              key={n.text}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08, rotate: 0 }}
              className={`absolute rounded-sm px-4 py-3 font-hand text-xl font-semibold text-navy/80 shadow-md ${n.cls}`}
            >
              {n.text}
            </motion.div>
          ))}

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-emerald text-white shadow-2xl shadow-emerald/30"
          >
            <BadgeCheck className="h-8 w-8" />
          </motion.div>
        </Reveal>

        <div>
          <Reveal>
            {whyFinprovSection?.heading ? (
              <h2 className="font-hand text-6xl font-bold text-navy sm:text-7xl">{whyFinprovSection.heading}</h2>
            ) : (
              <h2 className="font-hand text-6xl font-bold text-navy sm:text-7xl">
                Why <span className="text-emerald">choose us?</span>
              </h2>
            )}
            <p className="mt-5 max-w-md text-lg leading-relaxed text-text-body">
              {subHeading}
            </p>
          </Reveal>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="frost-light group flex flex-col justify-between rounded-xl p-4 transition-all hover:bg-white hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald">0{i + 1}</span>
                    <h3 className="text-sm font-bold text-navy">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
