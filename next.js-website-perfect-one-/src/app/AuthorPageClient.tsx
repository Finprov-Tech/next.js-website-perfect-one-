'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { resolveCmsImageUrl, type CMSAuthorDetail, type CMSBlogPostSummary } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12";
const dateFmt = new Intl.DateTimeFormat("en-IN", { year: "numeric", month: "short", day: "numeric" });
const defaultImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80";

function postHref(slug: string) {
  return `/${slug}`;
}

export function AuthorPageClient({ author }: { author: CMSAuthorDetail }) {
  const [visibleCount, setVisibleCount] = useState(9);
  const posts = author.posts;
  const visiblePosts = useMemo(() => posts.slice(0, visibleCount), [posts, visibleCount]);
  const photoUrl = resolveCmsImageUrl(author.photo);

  return (
    <div className="min-h-screen bg-navy text-white selection:bg-gold selection:text-navy">
      <SiteHeader />

      <section className="relative overflow-hidden bg-navy py-20 sm:py-28 text-center text-white border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/90" />

        <div className={`${container} relative z-10`}>
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={author.name}
              className="mx-auto h-24 w-24 rounded-full border-4 border-gold object-cover shadow-xl"
            />
          ) : null}
          <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-gold">Author</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            {author.name}
          </h1>
          {author.role ? (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-300">{author.role}</p>
          ) : null}
          {author.bio ? (
            <p className="mx-auto mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-300">{author.bio}</p>
          ) : null}
          <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
            {posts.length} published {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-navy/95">
        <div className={container}>
          {visiblePosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
              <p className="text-base font-bold text-white">No published articles yet.</p>
              <Link href="/blog" className="mt-4 inline-flex text-xs font-bold text-gold hover:underline uppercase">
                Browse all posts
              </Link>
            </div>
          ) : (
            <StaggerGrid className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((p: CMSBlogPostSummary) => {
                const bgImg = resolveCmsImageUrl(p.cover_image) || defaultImage;
                return (
                  <StaggerItem key={p.slug}>
                    <Link href={postHref(p.slug)} className="block h-full">
                      <article className="group relative h-[440px] w-full overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-2xl transition-all duration-500 hover:border-gold/50">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url('${bgImg}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-black/40" />
                        <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white">
                          <span className="w-fit rounded-md bg-gold px-3 py-1 text-[10px] font-black uppercase tracking-wider text-navy">
                            {p.category?.name || "Blog"}
                          </span>
                          <div>
                            <div className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
                              {p.published_date ? dateFmt.format(new Date(p.published_date)) : ""}
                            </div>
                            <h2 className="mt-2 text-xl font-black uppercase leading-snug text-white line-clamp-3">{p.title}</h2>
                            <p className="mt-3 text-xs leading-relaxed text-white/90 line-clamp-3">{p.excerpt}</p>
                            <div className="mt-6 flex items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-gold">
                                READ POST <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                              <span className="flex items-center gap-1 text-[11px] font-bold text-white/90">
                                <Clock className="h-3.5 w-3.5 text-gold" /> {p.read_time}
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

          {visiblePosts.length < posts.length ? (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="rounded-md border-2 border-emerald bg-emerald px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-emerald/90"
              >
                LOAD MORE POSTS
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
