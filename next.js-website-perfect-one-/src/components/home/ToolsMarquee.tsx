import { Briefcase, Wrench } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { placementPartnerRows, toolRows } from "@/data/site";
import type { CMSPartnerLogo } from "@/lib/cms";

export function ToolsMarquee({ partnerLogos }: { partnerLogos?: CMSPartnerLogo[] | null }) {
  const cmsPartners = partnerLogos?.filter((p) => p.kind === "partner").map((p) => p.name);
  const cmsTools = partnerLogos?.filter((p) => p.kind === "tool").map((p) => p.name);

  const topRow = cmsPartners?.length ? cmsPartners : placementPartnerRows[0].concat(placementPartnerRows[1]);
  const bottomRow = cmsTools?.length ? cmsTools : toolRows[0].concat(toolRows[1]);

  return (
    <section className="section-ambient overflow-hidden py-14">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-cta">Top Recruiters &amp; Software Tools</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Our Placement Partners &amp; Industry Tools
          </h2>
          <p className="mt-4 text-base text-text-body">
            300+ recruiters and corporate partners hiring Finprov learners trained on industry-leading software.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="mt-12 space-y-5">
          {/* Top Row: Recruiters & Companies — Scrolls LEFT */}
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max items-center gap-4 animate-marquee-slow">
              {[...Array(2)].map((_, r) => (
                <div key={r} className="flex items-center gap-4 pr-4">
                  {topRow.map((partner, i) => (
                    <span
                      key={`${r}-${partner}-${i}`}
                      className="frost-light group inline-flex items-center gap-2.5 whitespace-nowrap rounded-2xl px-6 py-4 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald/[.08] text-emerald transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Briefcase className="h-3.5 w-3.5" />
                      </span>
                      {partner}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row: Software & Tools — Scrolls RIGHT */}
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max items-center gap-4 animate-marquee-reverse">
              {[...Array(2)].map((_, r) => (
                <div key={r} className="flex items-center gap-4 pr-4">
                  {bottomRow.map((tool, i) => (
                    <span
                      key={`${r}-${tool}-${i}`}
                      className="frost-light group inline-flex items-center gap-2.5 whitespace-nowrap rounded-2xl border border-gold/30 bg-gold/5 px-6 py-4 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold/15 text-amber-700 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                        <Wrench className="h-3.5 w-3.5" />
                      </span>
                      {tool}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
