'use client';

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import keralaStudents from "@/assets/kerala-students.png";
import { Reveal } from "@/components/motion/Reveal";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { lifeAtFinprov } from "@/data/site";
import { resolveCmsImageUrl, type CMSLifeAtFinprovSection } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

const keralaStudentsSrc = typeof keralaStudents === "string" ? keralaStudents : (keralaStudents as any)?.src || "";

const gradients = [
  "from-emerald/85 to-teal/60",
  "from-gold/75 to-cta/50",
  "from-navy/85 to-teal/60",
  "from-teal/80 to-mint/60",
  "from-cta/75 to-navy/70",
  "from-emerald/80 to-gold/50",
];

export function LifeAtFinprov({ lifeAtFinprov: cmsSection }: { lifeAtFinprov?: CMSLifeAtFinprovSection | null } = {}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  const eyebrow = cmsSection?.sub_heading || "Beyond the classroom";
  const heading = cmsSection?.heading || "Life at Finprov";
  const paragraph =
    cmsSection?.paragraph ||
    "Celebrations, presentations, and industry visits — learning here looks a lot like the workplaces you're headed to, with more cake.";
  const gallery = cmsSection?.images?.length
    ? cmsSection.images.map((g) => ({ title: g.caption, photo: resolveCmsImageUrl(g.image) || undefined }))
    : lifeAtFinprov.map((event, i) => ({ title: event.title, photo: i === 0 ? keralaStudentsSrc : undefined }));

  return (
    <section className="section-ambient overflow-hidden py-12">
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="inline-block rounded-full bg-cta/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[.14em] text-cta">
              {eyebrow}
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-navy sm:text-5xl">{heading}</h2>
            <p className="mt-3 max-w-lg text-base text-text-body">
              {paragraph}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex gap-2">
            {([-1, 1] as const).map((dir) => (
              <motion.button
                key={dir}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => scrollBy(dir as 1 | -1)}
                aria-label={dir === 1 ? "Scroll right" : "Scroll left"}
                className="frost-light grid h-11 w-11 place-items-center rounded-full text-navy transition-colors hover:bg-navy hover:text-white"
              >
                {dir === 1 ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </motion.button>
            ))}
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.12}>
        <div
          ref={scroller}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-[max(2.5rem,calc((100vw-1320px)/2+3.5rem))] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((event, i) => (
            <motion.article
              key={event.title}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="glass gloss-soft w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl"
            >
              <PhotoSlot
                src={event.photo}
                alt={event.title}
                gradient={gradients[i % gradients.length]}
                className="aspect-[4/3] rounded-none ring-0"
                hover={false}
              />
              <div className="p-5">
                <h3 className="text-lg font-bold text-navy">{event.title}</h3>
              </div>
            </motion.article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
