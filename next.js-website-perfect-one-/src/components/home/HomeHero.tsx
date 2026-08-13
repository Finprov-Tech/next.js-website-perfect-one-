'use client';

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, MapPin, UsersRound } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import heroStudent from "@/assets/hero-student.png";
import { Typewriter } from "@/components/motion/Typewriter";
import { Magnetic } from "@/components/motion/Magnetic";
import { siteStats } from "@/data/site";
import { resolveCmsImageUrl, resolveCmsLink, type CMSBanner } from "@/lib/cms";
import { RichText } from "@/components/site/RichText";
import { CmsIcon } from "@/lib/icons";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

const heroStudentSrc = typeof heroStudent === "string" ? heroStudent : (heroStudent as any)?.src || "/hero-student.png";

const defaultAnimatedWords = ["Accounting.", "Analytics.", "Marketing.", "Gulf Careers."];

export function HomeHero({
  onEnquire,
  heroBanner,
}: {
  onEnquire: () => void;
  heroBanner?: CMSBanner | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const headline = heroBanner?.heading || "Digital-First World. Future-Ready";
  const subParagraph =
    heroBanner?.paragraph ||
    `Finprov transforms aspiring professionals into industry-ready talent through real workplace exposure — ${siteStats.coursesOffered}+ programs in accounting, taxation, data analytics, and digital marketing, with a curriculum that evolves as fast as the industry does.`;
  const ctaLabel = heroBanner?.cta_text || "Explore Courses";
  const ctaHref = resolveCmsLink(heroBanner?.cta_internal_page, heroBanner?.cta_external_url, "/courses");
  const heroImageSrc = resolveCmsImageUrl(heroBanner?.image) || heroStudentSrc;
  const heroImageAlt = heroBanner?.image_alt || "Finprov learner ready for a finance career";

  const animatedWords = heroBanner?.animated_words?.length
    ? heroBanner.animated_words.map((w) => w.word)
    : defaultAnimatedWords;

  const badgeText = heroBanner?.badge_text || "Founded & led by Chartered Accountants";
  const badgeIcon = heroBanner?.badge_icon || "award";
  const centresText = heroBanner?.centres_text || `${siteStats.centres} centres · Kerala & Bengaluru`;

  // Secondary button: becomes a real link only if the CMS provided one; otherwise
  // it keeps opening the enquiry modal, exactly as today.
  const secondaryLabel = heroBanner?.secondary_cta_text || "Free Consultation";
  const secondaryHasLink = Boolean(heroBanner?.secondary_cta_internal_page || heroBanner?.secondary_cta_external_url);
  const secondaryHref = secondaryHasLink
    ? resolveCmsLink(heroBanner?.secondary_cta_internal_page, heroBanner?.secondary_cta_external_url, "#")
    : null;

  const topCardTitle = heroBanner?.top_card_title || "IIT Palakkad iHub";
  const topCardSubtitle = heroBanner?.top_card_subtitle || "Certified programs";
  const topCardIcon = heroBanner?.top_card_icon || "graduation-cap";

  const bottomCardTitle = heroBanner?.bottom_card_title || "Learn directly from practising CAs";
  const bottomCardSubtitle =
    heroBanner?.bottom_card_subtitle || `${siteStats.yearsExpertise}+ years of combined industry expertise`;

  const floatingStatValue = heroBanner?.floating_stat_value || `${siteStats.placements.toLocaleString()}+`;
  const floatingStatLabel = heroBanner?.floating_stat_label || "careers launched";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    let ctx: gsap.Context | null = null;
    const splits: SplitType[] = [];
    let cancelled = false;

    const build = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set(
            [
              "[data-hero-headline]",
              "[data-hero-sub]",
              "[data-hero-ctas]",
              "[data-hero-badges]",
              "[data-hero-portrait]",
              "[data-hero-chip]",
            ],
            { clearProps: "all" },
          );
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const headline = section.querySelector("[data-hero-title]") as HTMLElement | null;
          if (headline) {
            const split = new SplitType(headline, { types: "words,chars" });
            splits.push(split);

            gsap.from(split.chars, {
              opacity: 0,
              y: 28,
              rotateX: -45,
              stagger: 0.018,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.1,
            });
          }

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from("[data-hero-sub]", { opacity: 0, y: 20, duration: 0.7 }, 0.4)
            .from("[data-hero-ctas]", { opacity: 0, y: 20, duration: 0.6 }, 0.55)
            .from("[data-hero-badges] > *", { opacity: 0, scale: 0.9, stagger: 0.06, duration: 0.5 }, 0.7);

          const portrait = section.querySelector("[data-hero-portrait]");
          const panel = section.querySelector("[data-hero-panel]");

          if (portrait && panel) {
            gsap.fromTo(
              portrait,
              { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
              {
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
                duration: 1.1,
                ease: "power4.inOut",
                delay: 0.3,
              },
            );

            gsap.fromTo(panel, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: "power3.out", delay: 0.3 });
          }

          gsap.from("[data-hero-chip]", {
            opacity: 0,
            y: 24,
            scale: 0.9,
            stagger: 0.12,
            duration: 0.7,
            ease: "back.out(1.6)",
            delay: 0.9,
          });

          // Scrubbed depth movement (parallax) as the user scrolls out of the hero
          const scrub = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          scrub
            .to("[data-hero-headline]", { y: -40, opacity: 0.4, ease: "none" }, 0)
            .to("[data-hero-portrait]", { y: 60, scale: 0.96, ease: "none" }, 0)
            .to("[data-hero-chip]", { y: (i) => (i === 0 ? 90 : -30), ease: "none" }, 0);
        });
      }, section);
    };

    build();

    return () => {
      cancelled = true;
      splits.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative z-10 isolate overflow-hidden bg-gradient-to-br from-navy via-[oklch(0.24_0.08_252)] to-emerald-deep text-white"
    >
      <div className="pointer-events-none absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-grid-lines opacity-70 [mask-image:linear-gradient(180deg,black,transparent_85%)]" />
        <div className="absolute -left-32 top-16 h-[380px] w-[380px] rounded-full bg-cta/20 blur-3xl" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-mint/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
      </div>

      <div className={`${container} relative z-10 grid gap-6 pb-8 pt-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-8 lg:pb-10 lg:pt-8`}>
        {/* Foreground copy plane */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/10 px-3.5 py-1 text-xs font-medium text-mint sm:text-sm">
              <CmsIcon name={badgeIcon} className="h-3.5 w-3.5" />
              <span>
                {badgeText}
              </span>
            </div>

            <Link
              href="/#centre-map"
              aria-label="View our centre locations"
              className="hidden items-center gap-1.5 rounded-full text-xs text-white/60 transition-colors hover:text-gold sm:inline-flex sm:text-sm"
            >
              <MapPin className="h-3.5 w-3.5" /> {centresText}
            </Link>
          </motion.div>

          <h1 className="mt-3.5 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px]">
            <span data-hero-title>{headline}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint via-teal to-gold">
              <Typewriter
                words={animatedWords}
              />
            </span>
          </h1>

          <p data-hero-sub className="mt-3 max-w-[540px] text-xs leading-relaxed text-white/80 sm:text-base">
            <RichText html={subParagraph} />
          </p>

          <div data-hero-ctas className="mt-5 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <Link href={ctaHref}>
                <motion.span
                  whileTap={{ scale: 0.98 }}
                  className="btn-gloss group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy shadow-e3 transition-shadow duration-200 hover:shadow-e4 sm:text-base"
                >
                  {ctaLabel}
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-gold transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </motion.span>
              </Link>
            </Magnetic>
            {secondaryHref ? (
              <Link href={secondaryHref}>
                <motion.span
                  whileTap={{ scale: 0.97 }}
                  className="frost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:text-mint sm:text-base"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-mint" />
                  {secondaryLabel}
                </motion.span>
              </Link>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onEnquire}
                className="frost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:text-mint sm:text-base"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-mint" />
                {secondaryLabel}
              </motion.button>
            )}
          </div>

          <div data-hero-badges className="mt-5 flex flex-wrap gap-2">
            {["100% placement assistance", "7-day free trial", "EMI options"].map((b) => (
              <span
                key={b}
                className="frost inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white/90 sm:text-xs"
              >
                <BadgeCheck className="h-3.5 w-3.5 text-mint" /> {b}
              </span>
            ))}
          </div>
        </div>

        {/* Midground plane */}
        <div className="relative flex items-start justify-center lg:justify-end">
          <div className="relative mt-2 lg:mt-0">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/20 blur-2xl" />

            <div
              data-hero-portrait
              className="relative z-10 w-[min(82vw,380px)] will-change-transform [will-change:transform,clip-path]"
            >
              <div className="absolute inset-x-0 bottom-0 top-[60px] overflow-hidden rounded-[2.2rem] ring-1 ring-white/25">
                <div
                  data-hero-panel
                  className="absolute inset-0 bg-gradient-to-b from-mint via-[oklch(0.62_0.14_245)] to-emerald-deep will-change-transform"
                >
                  <div className="absolute inset-0 bg-grid-lines opacity-50" />
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-xl" />
                </div>
              </div>
              <img
                src={heroImageSrc}
                alt={heroImageAlt}
                width={450}
                height={450}
                className="relative z-10 w-full object-contain drop-shadow-[0_24px_40px_rgba(3,15,45,0.5)]"
              />
              <div className="glass-dark gloss-soft absolute inset-x-0 bottom-0 z-20 rounded-2xl p-3.5">
                <p className="text-xs sm:text-sm font-bold text-white">{bottomCardTitle}</p>
                <p className="mt-0.5 text-[11px] sm:text-xs text-white/75">{bottomCardSubtitle}</p>
              </div>

              <div data-hero-chip className="absolute bottom-28 right-2 z-20 will-change-transform">
                <div className="glass-gloss gloss-soft rounded-2xl px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-mint/15 text-mint">
                      <UsersRound className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none text-white">{floatingStatValue}</div>
                      <div className="mt-1 text-[10px] text-white/70">{floatingStatLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div data-hero-chip className="relative left-0 bottom-80 z-20 w-[170px] will-change-transform">
              <div className="glass-gloss gloss-soft rounded-2xl px-3 py-2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute left-0 grid h-7 w-7 place-items-center rounded-full bg-mint/15 text-mint">
                    <CmsIcon name={topCardIcon} className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 text-center">
                    <div className="whitespace-nowrap text-[11px] font-bold text-white">{topCardTitle}</div>
                    <div className="text-[10px] text-white/70">{topCardSubtitle}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
