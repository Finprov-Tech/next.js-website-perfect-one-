import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import type { Testimonial } from "@/data/testimonials";

const reelGradients = [
  "from-navy/90 to-teal/60",
  "from-teal/85 to-cta/60",
  "from-cta/85 to-navy/70",
  "from-gold/70 to-navy/70",
];

export function ReelStories({ stories }: { stories: Testimonial[] }) {
  return (
    <div className="flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {stories.map((s, i) => (
        <motion.div key={s.name} whileHover={{ y: -6 }} className="w-40 shrink-0 sm:w-48">
          <div className="relative">
            <PhotoSlot
              src={s.photo}
              alt={s.name}
              caption={s.name}
              subcaption={s.role}
              gradient={reelGradients[i % reelGradients.length]}
              className="aspect-[9/16]"
              hover={false}
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy shadow-lg">
              <Play className="ml-0.5 h-5 w-5 fill-navy" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
