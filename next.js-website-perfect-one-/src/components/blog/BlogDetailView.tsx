'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { type BlogPost } from "@/data/blog";
import { RichText } from "@/components/site/RichText";
import { BlogSidebarDesktop, BlogSidebarMobile } from "@/components/blog/BlogSidebar";
import { formatBlogDate, formatBlogDateShort } from "@/lib/formatBlogDate";
import { buildTocEntries, injectHeadingIds, sectionWrapperId } from "@/lib/blogToc";

function bodyStartsWithIntroHeading(html: string): boolean {
  return /^\s*<h[23][^>]*>\s*(?:<[^>]+>\s*)*Introduction\b/i.test(html.trim());
}
import { slugPath } from "@/lib/sitePaths";

const container = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12";

const postImages: Record<string, string> = {
  "cloud-based-accounting-transforming-industry": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
  "gcc-vat-uae-taxation-career-opportunities": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "sap-fico-vs-tally-prime-career-guide": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  "big-4-accounting-interview-preparation-guide": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
  "data-analytics-in-finance-and-accounting": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "gst-return-filing-common-mistakes-to-avoid": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
};

const defaultImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";

export function BlogDetailView({
  post,
  related = [],
  latestPosts = [],
}: {
  post: BlogPost;
  related?: BlogPost[];
  latestPosts?: BlogPost[];
}) {
  const heroImg = post.coverImageUrl || postImages[post.slug] || defaultImage;
  const dateLabel = formatBlogDate(post.date);

  const tocSections = useMemo(() => buildTocEntries(post.sections), [post.sections]);

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 selection:bg-gold selection:text-navy">
      <ScrollProgress />
      <SiteHeader />

      {/* Hero — full-bleed image + overlay */}
      <section className="relative min-h-[340px] overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/60" />

        <div className={`${container} relative z-10 flex min-h-[340px] flex-col justify-end pb-16 pt-28 sm:min-h-[420px] sm:pb-20 lg:min-h-[480px]`}>
          <Link
            href="/blog"
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            {post.category ? (
              <span className="inline-block rounded-full border border-gold/40 bg-gold/20 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-gold backdrop-blur-sm">
                {post.category.replace(/&amp;/g, "&")}
              </span>
            ) : null}

            <h1 className="mt-5 text-2xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              {dateLabel ? <span className="text-sm text-white/80">{dateLabel}</span> : null}
              {post.readTime ? (
                <span className="flex items-center gap-1.5 text-white/70">
                  <Clock className="h-4 w-4 text-gold" />
                  {post.readTime}
                </span>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main + sidebar */}
      <div className={`${container} relative z-20 -mt-12 pb-16 sm:-mt-16 lg:-mt-20`}>
        <div className="mb-6 lg:hidden">
          <BlogSidebarMobile post={post} sections={tocSections} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch lg:gap-10">
          <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
            <div className="space-y-10">
              {post.sections.map((s, i) => {
                const titled = s.heading.trim();
                const isFirst = i === 0 && !titled;
                const showSyntheticIntro = isFirst && !bodyStartsWithIntroHeading(s.body);
                const wrapperId = titled
                  ? tocSections.find((t) => t.heading === titled)?.id ?? sectionWrapperId(titled, i)
                  : isFirst
                    ? tocSections.find((t) => t.heading === "Introduction")?.id ?? "introduction"
                    : sectionWrapperId("", i);
                const bodyHtml = injectHeadingIds(s.body, tocSections);

                return (
                  <Reveal key={`${wrapperId}-${i}`} delay={i * 0.04}>
                    <div id={wrapperId} className="scroll-mt-32">
                      {titled ? (
                        <h2 className="flex items-center gap-4 border-b border-slate-100 pb-4 text-xl font-black text-navy sm:text-2xl">
                          <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold to-emerald" aria-hidden />
                          {titled}
                        </h2>
                      ) : showSyntheticIntro ? (
                        <h2 className="flex items-center gap-4 border-b border-slate-100 pb-4 text-xl font-black text-navy sm:text-2xl">
                          <span className="h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-gold to-emerald" aria-hidden />
                          Introduction
                        </h2>
                      ) : null}
                      <RichText
                        html={bodyHtml}
                        as="div"
                        className={`blog-prose prose prose-slate max-w-none text-base leading-[1.85] text-slate-600 sm:text-[1.05rem] ${titled || showSyntheticIntro ? "mt-5" : ""}`}
                      />
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl bg-navy p-8 text-white sm:p-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gold">
                <Sparkles className="h-3.5 w-3.5" /> Finprov Certification
              </span>
              <h3 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                Ready to build these skills in real life?
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                Hands-on training with real case studies, SAP ERP access, and placement support from practicing CAs.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/all-courses"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-black uppercase tracking-wider text-navy transition-transform hover:scale-[1.02]"
                >
                  Explore programs <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                >
                  Talk to counselor
                </Link>
              </div>
            </div>
          </article>

          <BlogSidebarDesktop post={post} sections={tocSections} latestPosts={latestPosts} />
        </div>
      </div>

      {/* Read Next */}
      {related.length > 0 ? (
        <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20">
          <div className={container}>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald">Keep reading</p>
                <h2 className="mt-1 text-2xl font-black text-navy sm:text-3xl">Read Next</h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald transition-colors hover:text-navy"
              >
                View all articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {related.slice(0, 4).map((p, idx) => {
                const bgImg = p.coverImageUrl || postImages[p.slug] || defaultImage;
                const label = idx === 0 ? "Previous post" : "Latest";
                return (
                  <Link key={p.slug} href={slugPath(p.slug)} className="group block">
                    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={bgImg}
                          alt={p.coverImageAlt || p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-navy shadow-sm">
                          {label}
                        </span>
                      </div>
                      <div className="p-5">
                        {formatBlogDateShort(p.date) ? (
                          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {formatBlogDateShort(p.date)}
                          </p>
                        ) : null}
                        <h3 className="mt-2 line-clamp-3 text-sm font-black leading-snug text-navy group-hover:text-emerald sm:text-base">
                          {p.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </div>
  );
}
