import Link from "next/link";
import { BarChart3, Calculator, ChartNoAxesCombined, Landmark, Megaphone } from "lucide-react";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import type { Category } from "@/data/courses";

const tracks: { category: Category; tagline: string; gradient: string }[] = [
  { category: "Finance", tagline: "Accounting careers built by CAs", gradient: "from-navy/90 to-teal/60" },
  { category: "Taxation", tagline: "GST, income tax & real filing practice", gradient: "from-emerald/90 to-teal/60" },
  { category: "Analytics", tagline: "Power BI, SQL & Python for business", gradient: "from-teal/85 to-cta/60" },
  { category: "Marketing", tagline: "IIT iHub certified digital marketing", gradient: "from-gold/75 to-cta/60" },
  { category: "Gulf", tagline: "UAE VAT, corporate tax & GCC careers", gradient: "from-navy/85 to-gold/60" },
];

const categoryIcons = {
  Finance: Landmark,
  Taxation: Calculator,
  Analytics: ChartNoAxesCombined,
  Marketing: Megaphone,
  Gulf: BarChart3,
};

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export function TrackCards() {
  return (
    <section className="bg-bg-light py-24">
      <div className={container}>
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">Five Tracks. One Career Upgrade.</h2>
          <p className="mt-4 text-lg text-text-body">Pick the track that matches where you want to go.</p>
        </Reveal>
        <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {tracks.map((t) => {
            const TrackIcon = categoryIcons[t.category];
            return (
              <StaggerItem key={t.category}>
                <Link href="/all-courses" className="group relative block h-full">
                  <PhotoSlot
                    alt={`${t.category} track`}
                    caption={t.category}
                    subcaption={t.tagline}
                    gradient={t.gradient}
                    className="aspect-[3/4]"
                  />
                  <div className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-navy shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <TrackIcon className="h-5 w-5" />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
