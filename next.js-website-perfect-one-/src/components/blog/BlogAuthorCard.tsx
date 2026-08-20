import Link from "next/link";
import { ArrowRight, Linkedin, User } from "lucide-react";
import type { StaticImageData } from "next/image";
import type { Post } from "@/data/blog";

import anandPhoto from "@/assets/experts/anand-kumar.webp";
import veenaPhoto from "@/assets/experts/veena-vijayan.webp";
import taniyaPhoto from "@/assets/experts/taniya-mathew.webp";
import anishPhoto from "@/assets/experts/anish-thomas.webp";

const AUTHOR_PHOTOS: Record<string, StaticImageData> = {
  "CA Veena Vijayan": veenaPhoto,
  "CA Anand Kumar": anandPhoto,
  "CA Taniya": taniyaPhoto,
  "CA Anish": anishPhoto,
};

const AUTHOR_PHOTOS_BY_SLUG: Record<string, StaticImageData> = {
  "ca-veena-vijayan": veenaPhoto,
  "ca-anand-kumar": anandPhoto,
  "ca-taniya": taniyaPhoto,
  "ca-anish": anishPhoto,
};

function photoSrc(img: StaticImageData | string | undefined): string | undefined {
  if (!img) return undefined;
  return typeof img === "string" ? img : img.src;
}

function slugifyAuthorName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function resolveAuthorPhoto(author: Post["author"]): string | undefined {
  if (author.photoUrl) return author.photoUrl;
  if (author.slug && AUTHOR_PHOTOS_BY_SLUG[author.slug]) {
    return photoSrc(AUTHOR_PHOTOS_BY_SLUG[author.slug]);
  }
  return photoSrc(AUTHOR_PHOTOS[author.name]);
}

export function authorArchiveHref(author: Post["author"]): string | null {
  const slug = author.slug?.trim() || slugifyAuthorName(author.name);
  return slug ? `/author/${slug}` : null;
}

type BlogAuthorCardProps = {
  post: Post;
  className?: string;
};

export function BlogAuthorCard({
  post,
  className = "",
}: BlogAuthorCardProps) {
  const { author } = post;
  const photo = resolveAuthorPhoto(author);
  const authorHref = authorArchiveHref(author);
  const linkedinUrl = author.linkedinUrl?.trim() || "#";
  const bio = author.bio?.trim() || "Finprov faculty and editorial contributor.";

  return (
    <aside className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ${className}`}>
      <div className="flex flex-col items-center text-center">
        <div
          className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-2 ring-gold/30"
          aria-label={photo ? `${author.name} profile photo` : `${author.name} profile photo placeholder`}
        >
          {photo ? (
            <img src={photo} alt={author.name} className="h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-b from-navy to-navy/90 text-gold">
              <User className="h-8 w-8 opacity-80" aria-hidden />
              <span className="text-xl font-black">{author.name[0]}</span>
            </div>
          )}
        </div>

        <h3 className="mt-4 text-lg font-black text-navy">{author.name}</h3>

        {author.role ? (
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald">{author.role}</p>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-slate-500 line-clamp-5">{bio}</p>

        {authorHref ? (
          <Link
            href={authorHref}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-white transition-colors hover:bg-navy/90"
          >
            View all blogs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}

        <a
          href={linkedinUrl}
          aria-label={`${author.name} on LinkedIn`}
          className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[#0A66C2] transition-all hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 hover:scale-105"
          {...(linkedinUrl === "#" ? { onClick: (e) => e.preventDefault() } : { target: "_blank", rel: "noopener noreferrer" })}
        >
          <Linkedin className="h-5 w-5 fill-current" />
        </a>
      </div>
    </aside>
  );
}
