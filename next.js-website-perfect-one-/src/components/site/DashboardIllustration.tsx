import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const bars = [
  { x: 10, h: 38, fill: "var(--teal)" },
  { x: 34, h: 58, fill: "var(--cta)" },
  { x: 58, h: 44, fill: "var(--teal)" },
  { x: 82, h: 70, fill: "var(--cta)" },
  { x: 106, h: 52, fill: "var(--teal)" },
  { x: 130, h: 84, fill: "var(--cta)" },
  { x: 154, h: 64, fill: "var(--teal)" },
  { x: 178, h: 96, fill: "var(--gold)" },
];

export function DashboardIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-white/95 p-4 shadow-2xl ring-1 ring-border backdrop-blur", className)}>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-destructive/60" />
        <span className="h-2 w-2 rounded-full bg-gold" />
        <span className="h-2 w-2 rounded-full bg-teal" />
        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-text-body/60">Live Dashboard</span>
      </div>
      <svg viewBox="0 0 220 120" className="mt-3 w-full">
        {bars.map((b, i) => (
          <motion.rect
            key={b.x}
            x={b.x}
            width={14}
            rx={3}
            fill={b.fill}
            initial={{ height: 0, y: 110 }}
            whileInView={{ height: b.h, y: 110 - b.h }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        <motion.path
          d="M10 82 C 40 62, 60 92, 92 64 S 150 28, 210 38"
          fill="none"
          stroke="var(--gold)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-text-body/70">
        <span>Revenue vs Target</span>
        <span className="font-bold text-teal">↑ 24%</span>
      </div>
    </div>
  );
}
