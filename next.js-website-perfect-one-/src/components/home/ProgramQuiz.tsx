'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, PartyPopper, RotateCcw } from "lucide-react";
import Link from "next/link";
import keralaAdvisor from "@/assets/kerala-advisor.png";
import { Reveal } from "@/components/motion/Reveal";
import { courses, type Category } from "@/data/courses";
import { resolveCmsLink, type CMSQuiz } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10";
const ease = [0.16, 1, 0.3, 1] as const;

const advisorImg = typeof keralaAdvisor === "string" ? keralaAdvisor : (keralaAdvisor as any)?.src || "/kerala-advisor.png";

type Step = {
  question: string;
  options: string[];
};

const steps: Step[] = [
  {
    question: "Which field excites you the most?",
    options: ["Finance & Accounting", "Taxation", "Data Analytics", "Digital Marketing", "Gulf Careers"],
  },
  {
    question: "Where are you in your journey right now?",
    options: ["Student / Final Year", "Fresh Graduate", "Working Professional", "Planning a Gulf Move"],
  },
  {
    question: "How would you prefer to learn?",
    options: ["Classroom", "Online Live", "Hybrid", "Weekend Batches"],
  },
];

const fieldToCategory: Record<string, Category> = {
  "Finance & Accounting": "Finance",
  Taxation: "Taxation",
  "Data Analytics": "Analytics",
  "Digital Marketing": "Marketing",
  "Gulf Careers": "Gulf",
};

function recommend(answers: string[]) {
  const category: Category = answers[1] === "Planning a Gulf Move" ? "Gulf" : (fieldToCategory[answers[0]] ?? "Finance");
  const pool = courses.filter((c) => c.category === category);
  if (answers[1] === "Working Professional") {
    const exec = pool.find((c) => c.programType === "Executive");
    if (exec) return exec;
  }
  return pool.find((c) => c.programType === "Job Assured") ?? pool[0] ?? courses[0];
}

export function ProgramQuiz({ onEnquire, quiz }: { onEnquire: (course?: string) => void; quiz?: CMSQuiz | null }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const activeSteps: Step[] = quiz?.questions?.length
    ? quiz.questions.map((q) => ({ question: q.question_text, options: q.options.map((o) => o.label) }))
    : steps;
  const heading = quiz?.heading || "Unsure about which program meets your requirements?";
  const eyebrow = quiz?.description || "Take our quiz";
  const nextLabel = quiz?.next_button_text || "Next";
  const resultCtaLabel = quiz?.cta_text || "Get Free Counselling";
  const resultHasLink = Boolean(quiz?.cta_internal_page || quiz?.cta_external_url);
  const resultHref = resultHasLink ? resolveCmsLink(quiz?.cta_internal_page, quiz?.cta_external_url, "#") : null;

  const selected = answers[step];
  const result = useMemo(() => (done ? recommend(answers) : null), [done, answers]);

  const choose = (option: string) => {
    const next = [...answers];
    next[step] = option;
    setAnswers(next);
  };

  const goNext = () => {
    if (step < activeSteps.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
    setDone(false);
  };

  return (
    <section className="relative bg-white">
      <svg viewBox="0 0 1440 48" className="block w-full text-emerald" preserveAspectRatio="none" aria-hidden>
        <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" fill="currentColor" />
      </svg>
      <div className="relative overflow-hidden bg-emerald py-8 sm:py-12 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-60" />

        <div className={`${container} relative grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]`}>
          <div>
            <Reveal>
              <h2 className="max-w-lg text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {heading}
              </h2>
              <p className="mt-1 text-xs font-bold uppercase tracking-[.18em] text-mint">{eyebrow}</p>
            </Reveal>

            <div className="mt-5 min-h-[210px]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <p className="text-sm font-semibold text-white/90 sm:text-base">{activeSteps[step].question}</p>
                    <div className="mt-3.5 grid max-w-xl gap-2.5 sm:grid-cols-2">
                      {activeSteps[step].options.map((option) => {
                        const active = selected === option;
                        return (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => choose(option)}
                            className={`flex items-center gap-2.5 rounded-full px-4 py-2 text-left text-xs sm:text-sm font-semibold transition-all ${
                              active
                                ? "glass-solid gloss-soft text-emerald-deep shadow-md shadow-black/20"
                                : "frost text-white hover:-translate-y-0.5"
                            }`}
                          >
                            <span
                              className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                                active ? "border-emerald bg-emerald" : "border-white/50"
                              }`}
                            >
                              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                            {option}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex max-w-xl items-center justify-between border-t border-white/15 pt-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-white/80">
                          {step + 1}/{activeSteps.length}
                        </span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
                          <motion.div
                            className="h-full rounded-full bg-mint"
                            animate={{ width: `${((step + (selected ? 1 : 0)) / activeSteps.length) * 100}%` }}
                            transition={{ duration: 0.3, ease }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {step > 0 && (
                          <button
                            onClick={() => setStep(step - 1)}
                            className="inline-flex items-center gap-1 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/60"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" /> Back
                          </button>
                        )}
                        <motion.button
                          whileHover={selected ? { scale: 1.04 } : undefined}
                          whileTap={selected ? { scale: 0.96 } : undefined}
                          onClick={goNext}
                          disabled={!selected}
                          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-emerald-deep shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {step === activeSteps.length - 1 ? "See My Program" : nextLabel} <ArrowRight className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.94, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="max-w-xl"
                  >
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1 text-xs font-bold text-mint ring-1 ring-mint/30">
                      <PartyPopper className="h-3.5 w-3.5" /> Your match is ready
                    </div>
                    <div className="glass-solid gloss-soft mt-3 rounded-2xl p-5 text-navy shadow-xl shadow-black/25">
                      <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${result!.badgeCls}`}>{result!.badge}</span>
                      <h3 className="mt-2 text-xl font-bold leading-snug">{result!.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-text-body">{result!.shortDesc}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-emerald">
                        <span className="rounded-full bg-emerald/10 px-2.5 py-0.5">{result!.duration}</span>
                        <span className="rounded-full bg-emerald/10 px-2.5 py-0.5">{result!.mode}</span>
                        <span className="rounded-full bg-emerald/10 px-2.5 py-0.5">{result!.programType}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {resultHasLink ? (
                          <Link
                            href={resultHref!}
                            className="btn-gloss rounded-full bg-gold px-5 py-2 text-xs font-bold text-navy shadow-md shadow-gold/30"
                          >
                            {resultCtaLabel}
                          </Link>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onEnquire(result!.title)}
                            className="btn-gloss rounded-full bg-gold px-5 py-2 text-xs font-bold text-navy shadow-md shadow-gold/30"
                          >
                            {resultCtaLabel}
                          </motion.button>
                        )}
                        <button
                          onClick={restart}
                          className="inline-flex items-center gap-1 rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Retake
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Reveal delay={0.15} className="relative hidden justify-self-center lg:block">
            <div className="relative overflow-hidden rounded-t-full rounded-b-xl bg-gradient-to-b from-mint/60 to-emerald-deep/30 p-1.5 shadow-xl">
              <img
                src={typeof advisorImg === "string" ? advisorImg : (advisorImg as any)?.src}
                alt="Finprov learning advisor ready to help"
                width={220}
                height={260}
                className="h-[240px] w-[200px] rounded-t-full rounded-b-lg object-cover"
                loading="lazy"
              />
            </div>
            <div className="glass-solid gloss-soft absolute -left-5 bottom-4 rounded-xl px-3 py-2 text-navy shadow-md border border-white/60">
              <p className="text-[10px] text-text-body">Average response time</p>
              <p className="text-xs font-bold text-navy">Under 30 mins</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
