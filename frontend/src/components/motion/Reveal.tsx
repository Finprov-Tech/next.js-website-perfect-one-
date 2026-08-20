import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  y?: number;
  duration?: number;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Reveal({ children, className, id, delay = 0, y = 28, duration = 0.6 }: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease: easeOut } },
  };

  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
