'use client';

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Decorative cursor companion: a crisp dot that hugs the pointer and a
 * frosted ring that glides after it on a spring. Desktop (fine pointer)
 * only — touch devices never mount it. The native cursor stays visible.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [overInteractive, setOverInteractive] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const dotX = useSpring(x, { stiffness: 900, damping: 55, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 900, damping: 55, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 160, damping: 22, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 160, damping: 22, mass: 0.7 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setOverInteractive(!!target?.closest?.("a, button, [role='button'], input, select, textarea, label"));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90]"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: overInteractive ? 1.7 : 1, opacity: overInteractive ? 0.9 : 0.6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cta/50 bg-cta/[.06] backdrop-blur-[2px]" />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ x: dotX, y: dotY }}>
        <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cta shadow-[0_0_10px_rgba(37,99,235,.65)]" />
      </motion.div>
    </>
  );
}
