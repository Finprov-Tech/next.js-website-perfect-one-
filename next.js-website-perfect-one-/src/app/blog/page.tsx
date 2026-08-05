'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Compass,
  Newspaper,
  PartyPopper,
  Scale,
  Target,
  Search,
  Clock,
  ArrowRight,
  ChevronRight,
  Mail,
  CheckCircle2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { posts } from "@/data/blog";

const container = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12";
const dateFmt = new Intl.DateTimeFormat("en-IN", { year: "numeric", month: "short", day: "numeric" });

const categoryIcons: Record<string, LucideIcon> = {
  "Career Guidance": Compass,
  "Accounting Trends": BarChart3,
  Skills: Zap,
  "Placement Tips": Target,
  "Regulatory Updates": Scale,
  "Campus Life": PartyPopper,
};

const postImages: Record<string, string> = {
  "cloud-based-accounting-transforming-industry": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
  "gcc-vat-uae-taxation-career-opportunities": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  "sap-fico-vs-tally-prime-career-guide": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "big-4-accounting-interview-preparation-guide": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  "data-analytics-in-finance-and-accounting": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "gst-return-filing-common-mistakes-to-avoid": "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
};

const defaultImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80";

export default function BlogIndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const gridPosts = filtered.slice(0, visibleCount);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-navy text-white selection:bg-gold selection:text-navy">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy py-24 sm:py-32 text-center text-white border-b border-white/10">
        <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')` }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/90" />
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-emerald/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className={`${container} relative z-10 text-center`}>
          <span className="inline-block rounded-md bg-gold/20 border border-gold/40 px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-gold">
            FINPROV JOURNAL
          </span>

          <h1 className="mt-5 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-md">
            BLOG &amp; INSIGHTS
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 font-medium">
            Explore industry updates, career roadmaps, GST filing blueprints, and SAP FICO guides from practicing CAs.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles on GST, SAP, Tax, Placement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 pl-12 pr-12 py-3.5 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all focus:border-gold focus:bg-white/20 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation Bar */}
      <section className="sticky top-0 z-30 bg-navy/95 backdrop-blur-md border-b border-white/10 py-4">
        <div className={container}>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(6);
                  }}
                  className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-emerald text-white shadow-lg shadow-emerald/30 scale-105"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat === "All" ? "ALL POSTS" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid Layout */}
      <section className="py-14 sm:py-20 bg-navy/95">
        <div className={container}>
          <div className="mb-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Showing {gridPosts.length} of {filtered.length} Articles</span>
            {activeCategory !== "All" && (
              <span className="text-gold font-extrabold">Category: {activeCategory}</span>
            )}
          </div>

          {gridPosts.length === 0 ? (
            <div className="my-12 rounded-xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
              <p className="text-base font-bold text-white">No articles matched your search.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold hover:underline uppercase"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" key={`${activeCategory}-${searchQuery}`}>
              {gridPosts.map((p) => {
                const bgImg = postImages[p.slug] || defaultImage;

                return (
                  <StaggerItem key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="block h-full">
                      <article className="group relative h-[440px] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-2xl transition-all duration-500 hover:border-gold/50 hover:shadow-emerald/20">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url('${bgImg}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-black/40 transition-opacity duration-300 group-hover:opacity-95" />
                        <div className="absolute inset-0 bg-emerald/90 opacity-0 transition-opacity duration-300 group-hover:opacity-95 backdrop-blur-sm" />

                        <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-md bg-gold px-3 py-1 text-[10px] font-black uppercase tracking-wider text-navy shadow-md group-hover:bg-navy group-hover:text-gold transition-colors">
                              {p.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-white/90">
                              <Clock className="h-3.5 w-3.5 text-gold group-hover:text-white" /> {p.readTime}
                            </span>
                          </div>

                          <div>
                            <div className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
                              {dateFmt.format(new Date(p.date))} &bull; BY {p.author.name}
                            </div>

                            <h2 className="mt-2 text-xl font-black uppercase leading-snug text-white tracking-tight group-hover:text-white transition-all">
                              {p.title}
                            </h2>

                            <p className="mt-3 text-xs leading-relaxed text-white/90 line-clamp-3">
                              {p.excerpt}
                            </p>

                            <div className="mt-6 flex items-center">
                              <span className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-xs font-black uppercase tracking-wider text-navy shadow-lg group-hover:bg-navy group-hover:text-white transition-all duration-300">
                                READ FULL POST <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          )}

          {gridPosts.length < filtered.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="rounded-md border-2 border-emerald bg-emerald px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-emerald/90 hover:scale-105 active:scale-95"
              >
                LOAD MORE POSTS
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-navy text-white border-t border-white/10 relative overflow-hidden">
        <div className={container}>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-gold/20 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-gold border border-gold/30">
              <Mail className="h-3.5 w-3.5" /> WEEKLY BRIEFING
            </span>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl text-white">
              Stay Updated on Corporate Tax &amp; SAP Trends
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Join 12,000+ finance professionals receiving weekly updates directly in their inbox.
            </p>

            {subscribed ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-500/20 px-6 py-3 text-xs font-bold text-mint border border-emerald-500/40">
                <CheckCircle2 className="h-4 w-4" /> You're subscribed to Finprov Journal!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-xs text-white placeholder-slate-400 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-gold px-6 py-3 text-xs font-black uppercase tracking-wider text-navy hover:bg-gold-light transition-all shadow-lg"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
