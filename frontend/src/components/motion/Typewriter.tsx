import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Phase = "typing" | "holding" | "deleting";

/**
 * Types each word letter by letter, holds it, deletes it, then types the next —
 * with a blinking caret. Caret color is set via `caretClassName` because the
 * word itself is often gradient-clipped (transparent) text.
 */
export function Typewriter({
  words,
  className,
  caretClassName = "bg-mint",
  typingSpeed = 90,
  deletingSpeed = 45,
  holdTime = 1500,
}: {
  words: string[];
  className?: string;
  caretClassName?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  holdTime?: number;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  const word = words[wordIndex % words.length];

  useEffect(() => {
    let timer: number;
    if (phase === "typing") {
      if (length < word.length) {
        timer = window.setTimeout(() => setLength((l) => l + 1), typingSpeed);
      } else {
        setPhase("holding");
      }
    } else if (phase === "holding") {
      timer = window.setTimeout(() => setPhase("deleting"), holdTime);
    } else {
      if (length > 0) {
        timer = window.setTimeout(() => setLength((l) => l - 1), deletingSpeed);
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [phase, length, word, words.length, typingSpeed, deletingSpeed, holdTime]);

  return (
    <span className={cn("inline-flex items-center py-[0.12em] leading-[1.2]", className)}>
      <span>{word.slice(0, length)}</span>
      <span aria-hidden className={cn("ml-1 inline-block h-[0.78em] w-[3px] shrink-0 rounded-full animate-caret", caretClassName)} />
    </span>
  );
}