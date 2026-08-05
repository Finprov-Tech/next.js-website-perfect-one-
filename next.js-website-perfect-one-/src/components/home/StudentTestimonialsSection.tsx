'use client';

import { useState, useEffect, useCallback } from "react";
import { Star, Play, X } from "lucide-react";
import { studentTestimonials, StudentTestimonial } from "@/data/studentTestimonials";
import { Reveal } from "@/components/motion/Reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { resolveCmsImageUrl, type CMSTestimonial } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10";

function fromCms(t: CMSTestimonial): StudentTestimonial {
  return {
    id: String(t.id),
    name: t.name,
    program: t.program,
    rating: t.rating,
    type: t.kind,
    quote: t.quote || undefined,
    photoUrl: resolveCmsImageUrl(t.avatar) || undefined,
    videoUrl: t.video_url || undefined,
    videoThumbnail: resolveCmsImageUrl(t.video_thumbnail) || undefined,
  };
}

export function StudentTestimonialsSection({ testimonials }: { testimonials?: CMSTestimonial[] | null }) {
  const items: StudentTestimonial[] = testimonials?.length ? testimonials.map(fromCms) : studentTestimonials;
  const [selectedVideo, setSelectedVideo] = useState<StudentTestimonial | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  // Auto-play / continuous slide every 3.5 seconds
  useEffect(() => {
    if (!api || selectedVideo) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [api, selectedVideo]);

  return (
    <section className="section-ambient overflow-hidden py-14">
      <div className={container}>
        {/* Header matching exact screenshot text */}
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-tight">
              Hear What Our Students <br className="hidden sm:inline" />
              Have To Say About Us!
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm leading-relaxed text-text-body/90 sm:text-base">
              Our students, trained through our job oriented courses, are chosen by leading companies, with many working across India and abroad.
            </p>
          </div>
        </Reveal>

        {/* Embla Carousel Slider */}
        <div className="relative mt-10 px-2 sm:px-6">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="group relative flex h-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
                    {item.type === "video" ? (
                      /* Video Card matching original site banner design */
                      <div className="flex h-full flex-col justify-between">
                        <div className="relative h-full overflow-hidden rounded-xl bg-navy shadow-inner">
                          <img
                            src={item.videoThumbnail}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
                          
                          {/* Banner Badge overlay */}
                          <div className="absolute left-3 top-3 rounded-full bg-gold/90 px-3 py-1 text-[10px] font-extrabold uppercase text-navy">
                            Video Review
                          </div>

                          {/* Video Title Text */}
                          <div className="absolute left-4 right-4 top-12 text-center">
                            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
                              What I've <br />
                              <span className="text-gold">Learned</span> <br />
                              from Finprov
                            </span>
                          </div>

                          {/* Play Button */}
                          <button
                            onClick={() => setSelectedVideo(item)}
                            aria-label={`Play video review by ${item.name}`}
                            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-navy shadow-2xl backdrop-blur-sm transition-transform hover:scale-115 group-hover:scale-110"
                          >
                            <Play className="h-6 w-6 fill-navy text-navy translate-x-0.5" />
                          </button>

                          <div className="absolute bottom-3 left-4 right-4 text-center">
                            <p className="text-xs font-bold text-white/90">{item.name}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Text Card matching original site screenshot */
                      <div className="flex h-full flex-col justify-between">
                        <div>
                          {/* Rating Stars */}
                          <div className="flex items-center gap-1 text-amber-400">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400" />
                            ))}
                          </div>

                          {/* Quote Text */}
                          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-text-body/90 line-clamp-6">
                            "{item.quote}"
                          </p>
                        </div>

                        {/* Student Avatar & Details */}
                        <div className="mt-4 flex items-center gap-3.5 border-t border-border/60 pt-4">
                          {item.photoUrl ? (
                            <img
                              src={item.photoUrl}
                              alt={item.name}
                              className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald/30"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                              {item.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-navy text-sm">{item.name}</h4>
                            <p className="text-xs text-text-body/70">{item.program}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Left and Right navigation arrows matching screenshot */}
            <CarouselPrevious className="-left-4 sm:-left-6 h-10 w-10 border-navy/20 bg-white/90 text-navy shadow-md hover:bg-navy hover:text-white" />
            <CarouselNext className="-right-4 sm:-right-6 h-10 w-10 border-navy/20 bg-white/90 text-navy shadow-md hover:bg-navy hover:text-white" />
          </Carousel>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative aspect-video w-full">
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.name}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-navy p-4 text-white">
              <h3 className="font-bold text-lg">{selectedVideo.name}</h3>
              <p className="text-xs text-white/70">{selectedVideo.program}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
