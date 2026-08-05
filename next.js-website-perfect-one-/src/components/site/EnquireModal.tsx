'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, GraduationCap, Phone, Sparkles, User, X } from "lucide-react";
import finprovMark from "@/assets/finprov-mark.jpeg";
import { courses } from "@/data/courses";
import { site } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

const logoSrc = typeof finprovMark === "string" ? finprovMark : (finprovMark as any)?.src || "/finprov-mark.jpeg";

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.18 + i * 0.07, duration: 0.4, ease } }),
};

const inputCls =
  "w-full rounded-xl border border-border bg-bg-light/60 py-3 pl-11 pr-4 text-sm text-navy placeholder:text-text-body/50 outline-none transition-all focus:border-cta focus:bg-white focus:ring-4 focus:ring-cta/10";

export function EnquireModal({
  open,
  onClose,
  defaultCourse,
}: {
  open: boolean;
  onClose: () => void;
  defaultCourse?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(defaultCourse ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (defaultCourse) setCourse(defaultCourse);
  }, [defaultCourse]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, handleEscape]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setCourse(defaultCourse ?? "");
    setSubmitted(false);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.45, ease }}
            className="glass-solid gloss-soft relative z-10 w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl shadow-navy/30 ring-1 ring-white/60"
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-navy/5 text-navy transition-all hover:bg-navy hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {!submitted ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-xl bg-white shadow-e1 ring-1 ring-navy/5">
                    <img src={logoSrc} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2.5 py-0.5 text-[11px] font-bold text-mint-deep">
                      <Sparkles className="h-3 w-3 text-gold" /> Free Consultation
                    </div>
                    <h3 className="mt-0.5 text-xl font-extrabold text-navy">Take the First Step</h3>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-text-body/80 leading-relaxed">
                  Leave your details below. An advisor will connect with program details, fee breakdown, and batch timings.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/70">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Nair"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </motion.div>

                  <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/70">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </motion.div>

                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-navy/70">Preferred Course</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/40" />
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className={`${inputCls} appearance-none bg-no-repeat`}
                      >
                        <option value="">Select a course (optional)</option>
                        {courses.map((c) => (
                          <option key={c.slug} value={c.title}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>

                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible" className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gloss relative w-full overflow-hidden rounded-xl bg-cta py-3.5 text-center text-sm font-bold text-white shadow-xl shadow-cta/25 transition-all hover:bg-cta-hover disabled:opacity-70"
                    >
                      {submitting ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Submitting...
                        </span>
                      ) : (
                        "Request Call Back"
                      )}
                    </button>
                  </motion.div>
                </form>

                <p className="mt-4 text-center text-[11px] text-text-body/60">
                  Or reach us directly at{" "}
                  <a href={site.phoneHref} className="font-bold text-navy hover:underline">
                    {site.phone}
                  </a>
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint/20 text-mint">
                  <CheckCircle2 className="h-10 w-10 text-emerald" />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold text-navy">Thank You, {name}!</h3>
                <p className="mt-2 text-sm text-text-body/80">
                  Your request has been received. One of our academic counselors will call you shortly on{" "}
                  <span className="font-bold text-navy">{phone}</span>.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-dark"
                >
                  Done
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
