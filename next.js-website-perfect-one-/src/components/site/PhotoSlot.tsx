import { motion } from "framer-motion";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoSlotProps = {
  src?: string;
  alt: string;
  caption?: string;
  subcaption?: string;
  className?: string;
  gradient?: string;
  hover?: boolean;
};

export function PhotoSlot({
  src,
  alt,
  caption,
  subcaption,
  className,
  gradient = "from-navy/85 via-teal/50 to-cta/60",
  hover = true,
}: PhotoSlotProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      className={cn("relative overflow-hidden rounded-3xl ring-1 ring-border", className)}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className={cn("relative flex h-full w-full items-center justify-center bg-gradient-to-br", gradient)}>
          <div className="absolute inset-0 bg-grid-white opacity-30" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -left-10 bottom-8 h-24 w-24 rounded-full bg-white/10" />
          <User className="relative h-1/3 w-1/3 max-h-16 max-w-16 min-h-4 min-w-4 text-white/40" strokeWidth={1.25} />
        </div>
      )}
      {(caption || subcaption) && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {caption && <p className="text-sm font-semibold text-white">{caption}</p>}
          {subcaption && <p className="text-xs text-white/70">{subcaption}</p>}
        </div>
      )}
    </motion.div>
  );
}
