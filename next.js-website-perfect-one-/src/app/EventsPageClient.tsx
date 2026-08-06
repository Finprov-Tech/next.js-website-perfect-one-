'use client';

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { eventsData, pastEvents, type EventItem } from "@/data/events";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import type { CMSPage } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export function EventsPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

  const banner = cmsPage?.banner ?? null;
  const heroBadge = banner?.badge_text || "Our Events";
  const heroHeading = banner?.heading || "Events For Entrepreneurs & Students";
  const heroParagraph =
    banner?.paragraph ||
    "Hands-on workshops, live webinars, and career bootcamps led by practicing Chartered Accountants and industry leaders.";

  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/events/`) ?? organizationSchema;

  const categories = ["All", "Webinar", "Workshop", "Bootcamp", "Placement Drive"];

  const filteredEvents = eventsData.filter((event) => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "All" ||
      (selectedLocation === "Online" && (event.mode === "Online" || event.mode === "Hybrid")) ||
      event.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speaker.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocation && matchesSearch;
  });

  const featuredEvent = eventsData.find((e) => e.featured) || eventsData[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-20" />
        <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
        <div className={`${container} relative text-center`}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-gold"
          >
            <Sparkles className="h-3.5 w-3.5" /> {heroBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight"
          >
            {banner?.heading ? (
              heroHeading
            ) : (
              <>
                Events For <span className="text-gold">Entrepreneurs &amp; Students</span>
              </>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-white/80 font-normal"
          >
            {heroParagraph}
          </motion.p>
        </div>
      </section>

      {/* Featured Event Spotlight */}
      {featuredEvent && (
        <section className="-mt-8 relative z-20">
          <div className={container}>
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-2xl transition-all hover:border-teal/30">
              <div className="bg-gradient-to-r from-navy via-[oklch(0.25_0.08_252)] to-navy px-6 py-3 text-white flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" /> Featured Upcoming Event
                </span>
                <span className="rounded-full bg-gold/20 px-3 py-0.5 text-[11px] font-extrabold text-gold ring-1 ring-gold/40">
                  Limited Seats ({featuredEvent.seatsLeft} Remaining)
                </span>
              </div>

              <div className="p-6 sm:p-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
                      {featuredEvent.category}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {featuredEvent.mode}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl leading-tight">
                    {featuredEvent.title}
                  </h2>

                  <p className="mt-3 text-sm text-text-body leading-relaxed">
                    {featuredEvent.description}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
                      <Calendar className="h-4 w-4 text-teal" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
                      <Clock className="h-4 w-4 text-teal" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 sm:col-span-2">
                      <MapPin className="h-4 w-4 text-teal shrink-0" />
                      <span className="truncate">{featuredEvent.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setActiveModalEvent(featuredEvent)}
                      className="inline-flex items-center gap-2 rounded-xl bg-teal px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-teal-dark hover:scale-105"
                    >
                      Reserve Your Spot Free <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 text-center">
                  <img
                    src={featuredEvent.speaker.photo}
                    alt={featuredEvent.speaker.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <h3 className="mt-3 text-base font-extrabold text-navy">{featuredEvent.speaker.name}</h3>
                  <p className="text-xs font-semibold text-teal">{featuredEvent.speaker.role}</p>
                  <p className="text-[11px] text-slate-500">{featuredEvent.speaker.company}</p>

                  <div className="mt-4 border-t border-slate-200 pt-3 text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Key Highlights:</span>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                      {featuredEvent.keyTakeaways.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-teal shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Events Catalog & Filter Section */}
      <section className="py-14 sm:py-16">
        <div className={container}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal">Upcoming Schedule</span>
              <h2 className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">Explore Upcoming Events</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events or speakers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs font-medium focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-teal focus:outline-none"
              >
                <option value="All">All Locations</option>
                <option value="Online">Online Webinars</option>
                <option value="Kochi">Kochi Centre</option>
                <option value="Bangalore">Bangalore Centre</option>
                <option value="Trivandrum">Trivandrum Centre</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-navy text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredEvents.length === 0 ? (
            <div className="my-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-base font-bold text-slate-600">No events matched your filter criteria.</p>
              <p className="mt-1 text-xs text-slate-400">Try adjusting your search query or category filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedLocation("All");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <StaggerGrid className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <StaggerItem key={event.id}>
                  <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-teal/10 px-3 py-1 text-[11px] font-bold text-teal">
                          {event.category}
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <Users className="h-3 w-3" /> {event.seatsLeft} seats left
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold text-navy group-hover:text-teal transition-colors">
                        {event.title}
                      </h3>

                      <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>

                      <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-teal shrink-0" />
                          <span className="font-semibold text-slate-700">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-teal shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-teal shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3">
                        <img
                          src={event.speaker.photo}
                          alt={event.speaker.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <div className="truncate text-xs">
                          <div className="font-bold text-navy truncate">{event.speaker.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{event.speaker.role}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => setActiveModalEvent(event)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy py-2.5 text-xs font-bold text-white transition-colors hover:bg-teal"
                      >
                        Register Free <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </div>
      </section>

      {/* Past Event Highlights & Gallery */}
      <section className="py-14 bg-bg-light/60 border-t border-border">
        <div className={container}>
          <Reveal className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal">Recent Successes</span>
            <h2 className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">Past Event Highlights</h2>
            <p className="mt-2 text-xs sm:text-sm text-text-body max-w-xl mx-auto font-normal">
              A glimpse into Finprov’s previous masterclasses, corporate summits, and placement drives.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pastEvents.map((pe) => (
              <div key={pe.title} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={pe.image}
                    alt={pe.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-navy">
                    {pe.attendees}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-navy leading-snug">{pe.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{pe.date}</span>
                    <span>{pe.mode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      <EventRegisterModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />
    </div>
  );
}

function EventRegisterModal({
  event,
  onClose,
}: {
  event: EventItem | null;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    qualification: "B.Com / Commerce Graduate",
  });

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl z-10 border border-slate-200">
        <div className="bg-navy p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <span className="inline-block rounded-full bg-gold/20 px-3 py-0.5 text-[11px] font-extrabold text-gold ring-1 ring-gold/30 uppercase tracking-wider">
            Free Event Registration
          </span>
          <h3 className="mt-2 text-xl font-extrabold leading-snug">{event.title}</h3>
          <p className="mt-1 text-xs text-white/70 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gold" /> {event.date} &bull; {event.time}
          </p>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="mt-4 text-xl font-extrabold text-navy">Registration Confirmed!</h4>
              <p className="mt-2 text-xs text-slate-600">
                We have reserved your seat for <strong className="text-navy">{event.title}</strong>. A confirmation link &amp; access instructions have been sent to your email.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-6 rounded-xl bg-navy px-6 py-2.5 text-xs font-bold text-white hover:bg-teal"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-medium focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Mobile Number (WhatsApp) *</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-medium focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-medium focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Highest Qualification</label>
                <div className="relative mt-1">
                  <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-medium focus:border-teal focus:outline-none"
                  >
                    <option value="B.Com / M.Com">B.Com / M.Com</option>
                    <option value="CA / CMA / CS Aspirant">CA / CMA / CS Aspirant</option>
                    <option value="MBA / BBA Finance">MBA / BBA Finance</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gold py-3 text-xs font-extrabold text-navy shadow-md hover:bg-gold-light"
                >
                  Confirm Free Event Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
