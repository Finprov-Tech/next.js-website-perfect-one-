import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import finprovWordmark from "@/assets/finprov-wordmark.jpeg";
import { site } from "@/data/site";

const container = "mx-auto w-full max-w-[1320px] px-6 md:px-8 lg:px-12";

const officialLocations = [
  "Kochi, Vytilla HO",
  "Kochi , Vytilla",
  "Ernakulam South",
  "Trivandrum",
  "Manjeri",
  "Pandalam",
  "Alappuzha",
  "Kollam",
  "Kozhikode",
  "Koramangala, Bengaluru",
  "Vijayanagar, Bengaluru",
];

const columns = [
  {
    title: "Programs",
    links: [
      { label: "All Courses", to: "/all-courses" },
      { label: "Finance", to: "/all-courses" },
      { label: "Analytics", to: "/all-courses" },
      { label: "Marketing", to: "/all-courses" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", to: "/team" },
      { label: "Online Admission", to: "/admission" },
      { label: "Careers", to: "/career" },
      { label: "Placements", to: "/placement" },
      { label: "Student Testimonials", to: "/testimonials" },
      { label: "Blog", to: "/blog" },
      { label: "Events & Workshops", to: "/events" },
      { label: "FAQ", to: "/faq" },
      { label: "Certificate Verification", to: "/verify-student-certificate" },
    ],
  },
] as const;

const logoSrc = typeof finprovWordmark === "string" ? finprovWordmark : (finprovWordmark as any)?.src || "/finprov-wordmark.jpeg";

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="h-1 w-full bg-gradient-to-r from-teal via-cta to-gold animate-gradient-x" />
      <div className={`${container} py-14`}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex rounded-xl bg-white px-3 py-2 shadow-lg shadow-black/10 transition-transform duration-300 hover:scale-105">
              <img src={logoSrc} alt="Finprov" className="h-8 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed">
              Industry-validated finance, analytics, and marketing programs — built for freshers and working
              professionals ready to accelerate their careers.
            </p>
          </div>

          {/* Programs & Company */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">{col.title}</h4>
              <ul className="mt-3.5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.to} className="text-xs sm:text-sm transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Our Locations List matching original screenshot */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Our Locations</h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              {officialLocations.map((loc) => (
                <li key={loc}>
                  <Link
                    href="/#centre-map"
                    className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-gold"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-white fill-white" />
                    <span>{loc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs md:flex-row">
          <p>© 2026 Finprov Learning Pvt Ltd. Excel in Accounting, Data Analytics and Digital Marketing.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
