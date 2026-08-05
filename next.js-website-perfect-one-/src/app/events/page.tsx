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

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export type EventItem = {
  id: string;
  title: string;
  category: "Webinar" | "Workshop" | "Bootcamp" | "Placement Drive";
  date: string;
  time: string;
  mode: "Online" | "Onsite" | "Hybrid";
  location: string;
  speaker: {
    name: string;
    role: string;
    company: string;
    photo: string;
  };
  description: string;
  keyTakeaways: string[];
  seatsLeft: number;
  featured?: boolean;
};

const eventsData: EventItem[] = [
  {
    id: "gst-filing-masterclass-2026",
    title: "Live GST 3.0 & Practical E-Invoicing Workshop",
    category: "Workshop",
    date: "Saturday, 14 Feb 2026",
    time: "10:00 AM – 1:00 PM IST",
    mode: "Hybrid",
    location: "Kochi Vyttila Centre & Online Live Zoom",
    speaker: {
      name: "CA Anand Kumar",
      role: "Partner & Head of Tax Training",
      company: "Finprov Academy",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "A hands-on, live practical workshop on real portal GST 3.0 returns filing (GSTR-1, GSTR-3B, GSTR-9), ITC reconciliation, and e-invoicing workflows for modern accounting professionals.",
    keyTakeaways: [
      "Live portal demo on GSTR-1 & GSTR-3B generation",
      "E-Invoicing rules & portal integration in Tally Prime",
      "Automated ITC Reconciliation techniques using MS Excel",
      "Q&A session with practicing Chartered Accountants",
    ],
    seatsLeft: 14,
    featured: true,
  },
  {
    id: "sap-fico-implementation-bootcamp",
    title: "SAP S/4HANA FICO Implementation Masterclass",
    category: "Workshop",
    date: "Wednesday, 18 Feb 2026",
    time: "06:30 PM – 08:30 PM IST",
    mode: "Online",
    location: "Interactive Online Webinar",
    speaker: {
      name: "Veena Vijayan",
      role: "Lead SAP Consultant & Corporate Trainer",
      company: "Ex-Big4 / Finprov",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Discover real corporate SAP S/4HANA posting workflows, GL configuration, asset accounting, and financial closing procedures required by MNCs and Global Capability Centres.",
    keyTakeaways: [
      "Overview of SAP S/4HANA vs ECC architecture",
      "GL & Accounts Payable / Receivable posting demo",
      "Step-by-step roadmap to get SAP Certified",
      "Interactive Q&A on SAP consulting roles",
    ],
    seatsLeft: 22,
    featured: false,
  },
  {
    id: "big4-interview-career-blueprint",
    title: "Big 4 Audit & Accounting Career Blueprint Bootcamp",
    category: "Bootcamp",
    date: "Sunday, 22 Feb 2026",
    time: "02:00 PM – 06:00 PM IST",
    mode: "Onsite",
    location: "Finprov Bangalore Centre (Koramangala)",
    speaker: {
      name: "Anish Thomas",
      role: "Senior Director — Career & Placements",
      company: "Finprov Learning",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "An intensive 4-hour boot camp designed for B.Com, M.Com, and MBA graduates preparing for technical interviews and case studies at EY, Deloitte, PwC, KPMG, and top MNCs.",
    keyTakeaways: [
      "Technical accounting question bank & answer frameworks",
      "Resume optimization for Big 4 Applicant Tracking Systems",
      "Live mock interview demonstration with expert feedback",
      "Direct referral pool for top bootcamp performers",
    ],
    seatsLeft: 8,
    featured: true,
  },
  {
    id: "gulf-vat-corporate-tax-webinar",
    title: "GCC Gulf VAT & UAE Corporate Tax Masterclass",
    category: "Webinar",
    date: "Thursday, 26 Feb 2026",
    time: "07:00 PM – 08:30 PM IST",
    mode: "Online",
    location: "Online Live Stream",
    speaker: {
      name: "Taniya Mathew",
      role: "GCC Tax Consultant & Academic Lead",
      company: "Finprov Academy",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Learn the fundamentals of UAE Corporate Tax compliance, GCC VAT calculations, Zoho Books tax configuration, and remote accounting jobs for Gulf enterprises.",
    keyTakeaways: [
      "UAE Corporate Tax rate slabs & exempt income rules",
      "GCC VAT return filing procedures in FTA portal",
      "How to secure Gulf remote accounting projects from India",
      "Finprov GCC Certification pathway overview",
    ],
    seatsLeft: 35,
    featured: false,
  },
  {
    id: "finprov-mega-placement-drive-2026",
    title: "Finprov Mega Placement Drive FY2026",
    category: "Placement Drive",
    date: "Saturday, 07 Mar 2026",
    time: "09:30 AM – 04:30 PM IST",
    mode: "Onsite",
    location: "Finprov Kochi Centre (Vyttila Head Office)",
    speaker: {
      name: "Placement Cell",
      role: "25+ Hiring Employers & Recruiters",
      company: "MNCs & Audit Firms",
      photo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Exclusive recruitment drive for Finprov certified students and finance job seekers. Spot interview rounds with 25+ hiring partners offering roles in Tax, SAP, Audit, and Digital Marketing.",
    keyTakeaways: [
      "On-spot technical interview rounds with recruiters",
      "Salary packages ranging from 3.2 LPA to 7.5 LPA",
      "Resume review counter & career counseling desk",
      "Immediate job offer letters for selected candidates",
    ],
    seatsLeft: 40,
    featured: true,
  },
  {
    id: "digital-marketing-ai-automation",
    title: "AI-Powered Digital Marketing & Growth Masterclass",
    category: "Webinar",
    date: "Tuesday, 10 Mar 2026",
    time: "06:00 PM – 07:30 PM IST",
    mode: "Online",
    location: "Live Interactive Webinar",
    speaker: {
      name: "Rahul Sharma",
      role: "Performance Marketing Lead",
      company: "Finprov Digital Academy",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Master modern AI tools (ChatGPT, Midjourney, Meta Ads AI) to build high-converting performance marketing funnels, SEO strategies, and automated sales workflows.",
    keyTakeaways: [
      "Building AI prompts for high-CTR ad copy & graphics",
      "Google Ads Search & Performance Max campaign setup",
      "Marketing automation workflows using Zapier & CRM",
      "Portfolio creation tips for digital marketing freelancers",
    ],
    seatsLeft: 28,
    featured: false,
  },
];

const pastEvents = [
  {
    title: "Kerala Finance Conclave & Student Leadership Summit",
    date: "15 Jan 2026",
    attendees: "450+ Attendees",
    mode: "Onsite at Gokulam Park, Kochi",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "National Accounting & GST Compliance Webinar",
    date: "28 Dec 2025",
    attendees: "1,200+ Online Attendees",
    mode: "Live Broadcast",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "SAP S/4HANA Career Orientation Drive",
    date: "10 Dec 2025",
    attendees: "320+ Participants",
    mode: "Bangalore & Online",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

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
            <Sparkles className="h-3.5 w-3.5" /> Our Events
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight"
          >
            Events For <span className="text-gold">Entrepreneurs &amp; Students</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-white/80 font-normal"
          >
            Hands-on workshops, live webinars, and career bootcamps led by practicing Chartered Accountants and industry leaders.
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
