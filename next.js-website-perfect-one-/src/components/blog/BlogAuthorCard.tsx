import { Linkedin } from "lucide-react";
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

function photoSrc(img: StaticImageData | string | undefined): string | undefined {
  if (!img) return undefined;
  return typeof img === "string" ? img : img.src;
}

export function resolveAuthorPhoto(post: Post): string | undefined {
  if (post.author.photoUrl) return post.author.photoUrl;
  return photoSrc(AUTHOR_PHOTOS[post.author.name]);
}

type BlogAuthorCardProps = {
  post: Post;
  className?: string;
};

export function BlogAuthorCard({ post, className = "" }: BlogAuthorCardProps) {
  const photo = resolveAuthorPhoto(post);
  const linkedinUrl = post.author.linkedinUrl?.trim() || "#";
  const bio = post.author.bio?.trim() || "Finprov faculty and editorial contributor.";

  return (
    <aside className={`relative ${className}`}>
      <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
        <div className="relative h-44 w-36 overflow-visible sm:h-48 sm:w-40">
          {/* Circle frame — shoulders sit inside; head extends above */}
          <div
            className="absolute bottom-0 left-1/2 h-[7.5rem] w-[7.5rem] -translate-x-1/2 rounded-full border border-white/20 bg-navy/40 shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:h-[8.5rem] sm:w-[8.5rem]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-1 left-1/2 h-[7rem] w-[7rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/10 to-transparent sm:h-[8rem] sm:w-[8rem]"
            aria-hidden
          />

          {photo ? (
            <img
              src={photo}
              alt={post.author.name}
              className="relative z-10 mx-auto h-[11.5rem] w-[8.5rem] object-cover object-top drop-shadow-[0_20px_28px_rgba(0,0,0,0.55)] sm:h-[12.5rem] sm:w-[9.5rem] [transform:translateZ(0)_scale(1.02)]"
            />
          ) : (
            <div className="relative z-10 mx-auto flex h-[7.5rem] w-[7.5rem] items-center justify-center rounded-full bg-gold text-3xl font-black text-navy shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:h-[8.5rem] sm:w-[8.5rem]">
              {post.author.name[0]}
            </div>
          )}

          <a
            href={linkedinUrl}
            aria-label={`${post.author.name} on LinkedIn`}
            className="absolute bottom-1 right-0 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-4 ring-navy transition-transform hover:scale-110 sm:right-1"
            {...(linkedinUrl === "#" ? { onClick: (e) => e.preventDefault() } : { target: "_blank", rel: "noopener noreferrer" })}
          >
            <Linkedin className="h-5 w-5 fill-current" />
          </a>
        </div>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-gold">Written by</p>

        <h3 className="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{post.author.name}</h3>

        {post.author.role ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{post.author.role}</p>
        ) : null}

        <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-slate-300/90 line-clamp-5">{bio}</p>

        <div className="mt-5 hidden h-px w-16 bg-gradient-to-r from-gold to-transparent lg:block" />
      </div>
    </aside>
  );
}
