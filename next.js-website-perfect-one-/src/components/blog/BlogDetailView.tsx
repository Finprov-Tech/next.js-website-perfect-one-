'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  ChevronRight,
  Check,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { getRelatedPosts, type BlogPost } from "@/data/blog";

const container = "mx-auto w-full max-w-[900px] px-5 sm:px-8";
const dateFmt = new Intl.DateTimeFormat("en-IN", { year: "numeric", month: "long", day: "numeric" });

const postImages: Record<string, string> = {
  "cloud-based-accounting-transforming-industry": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  "gcc-vat-uae-taxation-career-opportunities": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "sap-fico-vs-tally-prime-career-guide": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "big-4-accounting-interview-preparation-guide": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
  "data-analytics-in-finance-and-accounting": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "gst-return-filing-common-mistakes-to-avoid": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
};

const defaultImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";

export function BlogDetailView({ post, related: relatedProp }: { post: BlogPost; related?: BlogPost[] }) {
  const related = relatedProp ?? getRelatedPosts(post);
  const [copied, setCopied] = useState(false);

  const heroImg = post.coverImageUrl || postImages[post.slug] || defaultImage;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 selection:bg-gold selection:text-navy">
      <ScrollProgress />
      <SiteHeader />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-24 border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-10" />
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className={`${container} relative z-10`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> BACK TO JOURNAL
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <span className="inline-block rounded-md bg-gold px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-navy shadow-md">
              {post.category}
            </span>

            <h1 className="mt-4 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy font-black text-sm shadow-md">
                  {post.author.name[0]}
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white">{post.author.name}</div>
                  <div className="text-[11px] text-slate-400">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold" /> {dateFmt.format(new Date(post.date))}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold" /> {post.readTime}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-gold hover:text-navy hover:border-gold"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald" /> : <Share2 className="h-3.5 w-3.5" />}
                  {copied ? "COPIED LINK" : "SHARE"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Reading Canvas */}
      <article className="py-14 sm:py-20">
        <div className={container}>
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
            <img
              src={heroImg}
              alt={post.title}
              className="h-[320px] sm:h-[460px] w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4 rounded-md bg-navy/80 px-3 py-1 text-[10px] font-bold text-white/90 backdrop-blur-md">
              FINPROV EDITORIAL
            </div>
          </div>

          <div className="mt-10 rounded-2xl border-l-4 border-gold bg-amber-500/10 p-6 sm:p-8 backdrop-blur-sm">
            <p className="text-base sm:text-lg font-semibold leading-relaxed text-navy">
              "{post.excerpt}"
            </p>
          </div>

          {post.sections.length > 1 && (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-navy">
                <BookOpen className="h-4 w-4 text-emerald" /> ARTICLE OVERVIEW
              </div>
              <ul className="mt-3 space-y-2">
                {post.sections.map((s) => (
                  <li key={s.heading}>
                    <a
                      href={`#${s.heading.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-xs font-bold text-slate-600 hover:text-emerald transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="h-3 w-3 text-gold" /> {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12 space-y-12 text-slate-700">
            {post.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.05}>
                <div id={s.heading.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight text-navy border-b border-slate-200 pb-3">
                    <span className="text-gold mr-2">#</span> {s.heading}
                  </h2>
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 font-normal">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-emerald/30 bg-emerald/5 p-8">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald">
              <Award className="h-4 w-4" /> KEY PRACTICAL TAKEAWAY
            </div>
            <h3 className="mt-2 text-lg font-bold text-navy">
              Mastering Accounting &amp; Tax Workflows in Practice
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Applying these concepts standardizes financial reporting, minimizes GST/VAT audit risk, and equips professionals for corporate accounting roles across India and the Gulf region.
            </p>
          </div>

          <Reveal className="mt-14 overflow-hidden rounded-2xl border border-navy/20 bg-navy p-8 sm:p-10 text-white shadow-2xl relative">
            <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gold/20 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-gold border border-gold/30">
                <Sparkles className="h-3.5 w-3.5" /> FINPROV CERTIFICATION
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black uppercase text-white">
                Ready to Build These Skills in Real Life?
              </h3>
              <p className="mt-2 text-sm text-slate-300 max-w-xl">
                Get hands-on training with real-time case studies, SAP ERP software access, and 100% placement support from CA faculty.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/courses"
                  className="rounded-md bg-gold px-6 py-3 text-xs font-black uppercase tracking-wider text-navy shadow-lg hover:bg-gold-light hover:scale-105 transition-all inline-flex items-center gap-2"
                >
                  EXPLORE CERTIFICATION PROGRAMS <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md border border-white/20 bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-white/20 transition-all"
                >
                  TALK TO ACADEMIC COUNSELOR
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-slate-900 py-16 text-white border-t border-white/10">
          <div className={container}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                MORE FROM FINPROV JOURNAL
              </h2>
              <Link href="/blog" className="text-xs font-bold text-gold hover:underline uppercase flex items-center gap-1">
                VIEW ALL ARTICLES <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => {
                const bgImg = p.coverImageUrl || postImages[p.slug] || defaultImage;
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="block">
                    <article className="group relative h-[360px] w-full overflow-hidden rounded-xl border border-white/10 bg-navy shadow-xl transition-all duration-300 hover:border-gold/50">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${bgImg}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
                      <div className="absolute inset-0 bg-emerald/90 opacity-0 transition-opacity duration-300 group-hover:opacity-95 backdrop-blur-sm" />

                      <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                        <span className="w-fit rounded-md bg-gold px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-navy shadow-md">
                          {p.category}
                        </span>

                        <div>
                          <div className="text-[10px] font-bold text-white/80 uppercase">
                            {p.readTime} &bull; {dateFmt.format(new Date(p.date))}
                          </div>
                          <h3 className="mt-2 text-base font-black uppercase leading-snug text-white group-hover:text-white transition-colors">
                            {p.title}
                          </h3>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase text-gold group-hover:text-white">
                            READ POST <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
