import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { courses } from "@/data/courses";
import { locations, site } from "@/data/site";
import advisorImg from "@/assets/advisor.jpg";
import heroMentorImg from "@/assets/hero-mentor.png";
import heroStudentImg from "@/assets/hero-student.png";
import keralaAdvisorImg from "@/assets/kerala-advisor.png";
import keralaKarnatakaMap from "@/assets/kerala-karnataka-original.png";
import keralaStudentsImg from "@/assets/kerala-students.png";
import vytillaCampusImg from "@/assets/vytilla-campus.jpg";
import alappuzhaCampusImg from "@/assets/campus_photos/alappuzha.jpg";
import bengaluruKoramangalaCampusImg from "@/assets/campus_photos/bengaluru-koramangala.jpg";
import bengaluruVijayanagarCampusImg from "@/assets/campus_photos/bengaluru-vijayanagar.jpg";
import ernakulamSouthCampusImg from "@/assets/campus_photos/ernakulam-south.jpg";
import kollamCampusImg from "@/assets/campus_photos/kollam.jpg";
import kozhikodeCampusImg from "@/assets/campus_photos/kozhikode.jpg";
import manjeriCampusImg from "@/assets/campus_photos/manjeri.jpg";
import pandalamCampusImg from "@/assets/campus_photos/pandalam.jpg";
import trivandrumCampusImg from "@/assets/campus_photos/trivandrum.jpg";

const container = "mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10 xl:px-14";

const contactRows = [
  { icon: Mail, label: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: site.phone, href: site.phoneHref },
  { icon: MessageCircle, label: `WhatsApp: ${site.whatsapp}`, href: site.whatsappHref },
];

const campusDetails = locations.map((name) => {
  if (name.includes("Vyttila")) return { name, address: site.headOffice, isOnline: false };
  if (name.includes("Koramangala")) return { name, address: site.bengaluruOffice, isOnline: false };
  if (name.includes("Online")) return { name, address: "Live instructor-led classes from anywhere.", isOnline: true };
  return { name, address: "Contact us for the campus address and directions.", isOnline: false };
});

const mapPositions: Record<string, { left: string; top: string; state: "Kerala" | "Karnataka" }> = {
  "Kochi · Vyttila (HQ)": { left: "57.5%", top: "81.9%", state: "Kerala" },
  "Ernakulam South": { left: "53.9%", top: "82.2%", state: "Kerala" },
  Kozhikode: { left: "47.5%", top: "70.2%", state: "Kerala" },
  Trivandrum: { left: "63.4%", top: "95.7%", state: "Kerala" },
  Kollam: { left: "59%", top: "93.8%", state: "Kerala" },
  Alappuzha: { left: "54.9%", top: "88.4%", state: "Kerala" },
  Manjeri: { left: "50.6%", top: "71.9%", state: "Kerala" },
  Pandalam: { left: "60%", top: "90.3%", state: "Kerala" },
  "Bengaluru · Koramangala": { left: "77.2%", top: "57.5%", state: "Karnataka" },
  "Bengaluru · Vijayanagar": { left: "76.4%", top: "56%", state: "Karnataka" },
};

const mappedCampuses = campusDetails.filter((campus) => !campus.isOnline);
const navigationCampuses = [...mappedCampuses].sort(
  (a, b) => Number.parseFloat(mapPositions[a.name].top) - Number.parseFloat(mapPositions[b.name].top),
);
const onlineCampus = campusDetails.find((campus) => campus.isOnline)!;

const campusCoordinates: Record<string, { lat: number; lng: number }> = {
  "Kochi · Vyttila (HQ)": { lat: 9.9658, lng: 76.3195 },
  "Ernakulam South": { lat: 9.9691, lng: 76.2897 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
  Trivandrum: { lat: 8.5241, lng: 76.9366 },
  Kollam: { lat: 8.8932, lng: 76.6141 },
  Alappuzha: { lat: 9.4981, lng: 76.3388 },
  Manjeri: { lat: 11.1197, lng: 76.1215 },
  Pandalam: { lat: 9.2312, lng: 76.6836 },
  "Bengaluru · Koramangala": { lat: 12.9352, lng: 77.6245 },
  "Bengaluru · Vijayanagar": { lat: 12.9716, lng: 77.5346 },
};

const campusImages: Record<string, any> = {
  "Kochi · Vyttila (HQ)": vytillaCampusImg,
  "Ernakulam South": ernakulamSouthCampusImg,
  Kozhikode: kozhikodeCampusImg,
  Trivandrum: trivandrumCampusImg,
  Kollam: kollamCampusImg,
  Alappuzha: alappuzhaCampusImg,
  Manjeri: manjeriCampusImg,
  Pandalam: pandalamCampusImg,
  "Bengaluru · Koramangala": bengaluruKoramangalaCampusImg,
  "Bengaluru · Vijayanagar": bengaluruVijayanagarCampusImg,
};

function InteractiveCampusMap({
  selectedCampus,
  onSelectCampus,
}: {
  selectedCampus: string | null;
  onSelectCampus: (name: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // Dynamically inject Leaflet CSS if not already loaded
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("marker-pulse-css")) {
      const style = document.createElement("style");
      style.id = "marker-pulse-css";
      style.innerHTML = `
        @keyframes markerPulse {
          0% { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .leaflet-tooltip.rich-campus-tooltip {
          background: #0B192C !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          border-radius: 14px !important;
          padding: 8px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
          color: #FFFFFF !important;
        }
        .leaflet-tooltip-right.rich-campus-tooltip::before {
          border-right-color: #0B192C !important;
          border-top-color: transparent !important;
          top: 75% !important;
        }
        .leaflet-tooltip-top.rich-campus-tooltip::before {
          border-top-color: #0B192C !important;
        }
      `;
      document.head.appendChild(style);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current || leafletInstance.current) return;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([10.5, 76.5], 7);

      leafletInstance.current = map;

      // Use clean, crisp tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Create interactive 'F' pins for all campuses
      navigationCampuses.forEach((campus) => {
        const coords = campusCoordinates[campus.name];
        if (!coords) return;

        const customIcon = L.divIcon({
          className: "custom-f-pin",
          html: `<div style="
            background: #0284C7;
            color: #FFFFFF;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 2px solid #FFFFFF;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-style: italic;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.25s ease;
          ">F</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const photoUrl = campusImages[campus.name] || vytillaCampusImg;
        const tooltipContent = `
          <div style="width: 170px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="width: 100%; height: 95px; border-radius: 9px; overflow: hidden; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.15);">
              <img src="${photoUrl}" alt="${campus.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="font-weight: 800; font-size: 12px; color: #F59E0B; text-transform: uppercase; margin-bottom: 2px;">
              ${campus.name}
            </div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.75); line-height: 1.3; font-weight: 500;">
              ${campus.address}
            </div>
          </div>
        `;

        const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map);
        marker.bindTooltip(tooltipContent, {
          direction: "right",
          className: "rich-campus-tooltip",
          offset: [15, -30],
        });

        // ON CLICKING ANY MAP PIN: Reflect directly on the right side box!
        marker.on("click", () => {
          onSelectCampus(campus.name);
        });

        markersRef.current[campus.name] = marker;
      });
    };

    if (!(window as any).L) {
      if (!document.getElementById("leaflet-js")) {
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.body.appendChild(script);
      } else {
        document.getElementById("leaflet-js")?.addEventListener("load", initMap);
      }
    } else {
      initMap();
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  // Highlight selected campus pin with Gold 'F' badge without zooming in
  useEffect(() => {
    if (!(window as any).L) return;
    const L = (window as any).L;

    navigationCampuses.forEach((campus) => {
      const marker = markersRef.current[campus.name];
      if (!marker) return;
      const isActive = campus.name === selectedCampus;

      const icon = L.divIcon({
        className: "custom-f-pin",
        html: isActive
          ? `<div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
              <div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                background: rgba(245, 158, 11, 0.5);
                animation: markerPulse 1.5s ease-out infinite;
              "></div>
              <div style="
                position: relative;
                background: #F59E0B;
                color: #0B192C;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 3px solid #FFFFFF;
                box-shadow: 0 4px 18px rgba(245, 158, 11, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 900;
                font-style: italic;
                font-size: 15px;
                cursor: pointer;
                z-index: 50;
              ">F</div>
            </div>`
          : `<div style="
              background: #0284C7;
              color: #FFFFFF;
              width: 26px;
              height: 26px;
              border-radius: 50%;
              border: 2px solid #FFFFFF;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-style: italic;
              font-size: 11px;
              cursor: pointer;
              transition: all 0.25s ease;
            ">F</div>`,
        iconSize: [isActive ? 36 : 26, isActive ? 36 : 26],
        iconAnchor: [isActive ? 18 : 13, isActive ? 18 : 13],
      });

      marker.setIcon(icon);
      if (isActive) {
        marker.openTooltip();
      } else {
        marker.closeTooltip();
      }
    });
  }, [selectedCampus]);

  return <div ref={mapRef} className="h-full w-full min-h-[360px] sm:min-h-[400px]" />;
}

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/[.07] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-gold/70 focus:bg-white/10";

export function ContactAdvisors() {
  const [sent, setSent] = useState(false);
  const [hoveredCampus, setHoveredCampus] = useState<string | null>(null);
  const [lockedCampus, setLockedCampus] = useState<string | null>(null);
  const [lastPreviewedCampus, setLastPreviewedCampus] = useState(mappedCampuses[0].name);
  const activeCampusName = hoveredCampus ?? lockedCampus ?? lastPreviewedCampus;
  const activeCampus = mappedCampuses.find((campus) => campus.name === activeCampusName)!;
  const activeCampusIndex = navigationCampuses.findIndex((campus) => campus.name === activeCampusName);

  const selectedCoords = lockedCampus ? campusCoordinates[lockedCampus] : null;
  const iframeSrc = selectedCoords
    ? `https://maps.google.com/maps?q=${encodeURIComponent(`Finprov Learning ${lockedCampus}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://www.google.com/maps/d/embed?mid=1_4F2J4hLz4nwveAtNe80tkSqFwrrafc&ehbc=2E312F&noprof=1&ll=10.5,76.5&z=7`;

  const selectRelativeCampus = (direction: -1 | 1) => {
    const nextIndex = (activeCampusIndex + direction + navigationCampuses.length) % navigationCampuses.length;
    setHoveredCampus(null);
    setLockedCampus(navigationCampuses[nextIndex].name);
  };

  return (
    <section className="section-ambient relative overflow-hidden py-12" id="contact">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:linear-gradient(180deg,transparent,black_30%,black_70%,transparent)]" />
      <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-gold/15 blur-3xl animate-blob" />

      <div className={`${container} relative grid items-center gap-16 lg:grid-cols-[1fr_1fr]`}>
        <Reveal>
          <h2 className="max-w-lg text-4xl font-bold leading-[1.15] tracking-tight text-navy sm:text-[44px]">
            Reach Out To Our Learning Advisors To Choose The Right Program
          </h2>

          <div className="mt-9 space-y-4">
            {contactRows.map((row) => {
              const Icon = row.icon;
              return (
                <motion.a
                  key={row.label}
                  href={row.href}
                  whileHover={{ x: 6 }}
                  className="group flex w-fit items-center gap-3.5 text-navy"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy/[.06] text-navy transition-colors group-hover:bg-emerald group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm font-semibold">{row.label}</span>
                </motion.a>
              );
            })}
          </div>

        </Reveal>

        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="glass-navy gloss-soft relative mx-auto w-full max-w-md rounded-[1.8rem] p-7 sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] welcome-grid opacity-50" />
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="relative space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-white/70">Full name</label>
                      <input required placeholder="Enter full name" className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-white/70">Course</label>
                      <select required defaultValue="" className={`${inputCls} [&>option]:text-navy`}>
                        <option value="" disabled>
                          Select course
                        </option>
                        {courses.map((c) => (
                          <option key={c.slug}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-white/70">Phone number</label>
                      <div className="flex gap-2">
                        <span className="grid shrink-0 place-items-center rounded-xl border border-white/15 bg-white/[.07] px-3 text-sm font-bold text-white/80">
                          +91
                        </span>
                        <input required type="tel" placeholder="Phone number" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-white/70">Mail id</label>
                      <input required type="email" placeholder="Enter mail id" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/70">Message</label>
                    <textarea rows={4} placeholder="Type your message" className={`${inputCls} resize-none`} />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-gloss w-full rounded-full bg-gold py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy shadow-lg shadow-gold/25"
                  >
                    Enquire Now
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex min-h-[380px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
                  >
                    <CheckCircle2 className="h-16 w-16 text-mint" />
                  </motion.div>
                  <h3 className="mt-5 text-2xl font-bold text-white">Enquiry received</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                    A learning advisor will call you back within 30 minutes during working hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm font-semibold text-gold underline underline-offset-4 hover:text-gold/80"
                  >
                    Send another enquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Reveal>
      </div>

      <Reveal id="centre-map" className={`${container} relative mt-20 scroll-mt-24`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cta">Our centres</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">Visit a Finprov centre near you</h3>
          </div>
          <p className="flex items-center gap-2 text-sm font-medium text-text-body">
            <MapPin className="h-4 w-4 text-gold" /> {locations.length - 1} centres &amp; online
          </p>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-navy/10 bg-white shadow-e3 lg:grid-cols-[1.55fr_.8fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#edf6ff] sm:min-h-[400px] z-10">
            <InteractiveCampusMap
              selectedCampus={lockedCampus}
              onSelectCampus={(name) => {
                setHoveredCampus(null);
                setLockedCampus(name);
              }}
            />
          </div>

          <div className="flex flex-col justify-center bg-navy p-6 text-white sm:p-9">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 text-xs font-extrabold text-white">4.9</span>
                  <span className="text-[11px] text-white/60">(500+ Reviews)</span>
                </div>
                <p className="mt-1 text-xs text-white/55">
                  {String(activeCampusIndex + 1).padStart(2, "0")} / {String(navigationCampuses.length).padStart(2, "0")} Official Hubs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous centre"
                  onClick={() => selectRelativeCampus(-1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[.07] text-white transition-all hover:-translate-x-0.5 hover:border-gold/60 hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next centre"
                  onClick={() => selectRelativeCampus(1)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[.07] text-white transition-all hover:translate-x-0.5 hover:border-gold/60 hover:bg-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Campus Dropdown Selector */}
            <div className="mb-5">
              <select
                value={lockedCampus || ""}
                onChange={(e) => {
                  setHoveredCampus(null);
                  setLockedCampus(e.target.value || null);
                }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur focus:border-gold focus:ring-2 focus:ring-gold/30"
              >
                <option value="" className="bg-navy text-gold font-bold">📍 Show All Centres (Overview Map)</option>
                {navigationCampuses.map((campus) => (
                  <option key={campus.name} value={campus.name} className="bg-navy text-white font-medium">
                    {campus.name} ({mapPositions[campus.name]?.state || "Kerala"})
                  </option>
                ))}
              </select>
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={activeCampus.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="rounded-3xl border border-white/15 bg-white/[.08] p-6 shadow-2xl backdrop-blur"
              >
                <div className="relative mb-4 h-36 w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                  <img
                    src={typeof (campusImages[activeCampus.name] || keralaAdvisorImg) === "string" ? (campusImages[activeCampus.name] || keralaAdvisorImg) : (campusImages[activeCampus.name] || keralaAdvisorImg)?.src}
                    alt={`Finprov ${activeCampus.name} Campus`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-navy/70 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur">
                      Finprov {activeCampus.name} Hub
                    </span>
                    <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-extrabold text-navy shadow-sm">
                      {mapPositions[activeCampus.name]?.state || "Kerala"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-navy shadow-md">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="rounded-full bg-mint/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-mint">
                        Verified Campus
                      </span>
                      <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] text-gold">{mapPositions[activeCampus.name]?.state || "Kerala"}</p>
                    </div>
                  </div>
                </div>
                <h4 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-white">{activeCampus.name}</h4>
                <p className="mt-3 text-xs leading-relaxed text-white/80">{activeCampus.address}</p>
                <div className="mt-4 space-y-1.5 text-xs text-white/70 border-t border-white/10 pt-3">
                  <p className="flex items-center gap-2 font-semibold text-white/90">
                    <Phone className="h-3.5 w-3.5 text-gold" /> {site.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-mint" /> Open: Mon – Sat (9:00 AM – 6:30 PM)
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a href={site.phoneHref} className="flex items-center justify-center gap-1.5 rounded-xl bg-cta px-3 py-3 text-center text-xs font-bold text-white shadow-md transition-colors hover:bg-cta-hover">
                    <Phone className="h-3.5 w-3.5" /> Call Hub
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Finprov Learning ${activeCampus.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-gold px-3 py-3 text-center text-xs font-bold text-gold transition-colors hover:bg-gold hover:text-navy shadow-md"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Directions ↗
                  </a>
                </div>
              </motion.article>
            </AnimatePresence>

            <a href={site.whatsappHref} className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.05] p-4 transition-colors hover:bg-white/10">
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-mint">{onlineCampus.name}</span>
                <span className="mt-1 block text-xs text-white/60">{onlineCampus.address}</span>
              </span>
              <MessageCircle className="h-5 w-5 text-gold" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
