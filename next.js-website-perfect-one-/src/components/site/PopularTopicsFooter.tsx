import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { slugPath } from "@/lib/sitePaths";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export const popularCoursesLinks = [
  { label: "PGDIFA", to: slugPath("pg-diploma-in-indian-and-foreign-accounting-course") },
  { label: "IIT IHub Certified Digital Marketing Course", to: slugPath("iit-ihub-certified-digital-marketing-program-uae") },
  { label: "Digital Marketing Specialist Program", to: slugPath("digital-marketing-specialist-program") },
  { label: "SAP S/4HANA FI", to: slugPath("sap-s-4hana-fi-uae") },
  { label: "IBAP", to: slugPath("certification-in-business-finance-and-analytics") },
  { label: "Business Accounting Specialist Program (BASP)", to: slugPath("business-accounting-specialist-program") },
  { label: "SAP S/4HANA MM", to: slugPath("sap-mm-material-management") },
];

export const browseTopicsLinks = [
  { label: "Diploma In Indian Accounting", to: slugPath("diploma-in-indian-accounting-dia") },
  { label: "CBAT", to: slugPath("certification-in-business-accounting-taxation") },
  { label: "PPC Specialist Program", to: slugPath("ppc-specialist-program") },
  { label: "SEO Specialist Course", to: slugPath("seo-specialist-course") },
  { label: "Certification In MS Office", to: slugPath("ms-office-course") },
  { label: "UAE Corporate Tax", to: slugPath("uae-corporate-tax") },
  { label: "Tally Prime", to: slugPath("tally-prime-certification") },
];

export const upskillLinks = [
  { label: "Zoho Books", to: slugPath("zoho-books") },
  { label: "Gulf VAT", to: slugPath("gulf-vat") },
  { label: "GST + Simulation Software", to: slugPath("tally-prime-certification") },
  { label: "Basics Of Microsoft Excel", to: slugPath("basics-of-microsoft-excel") },
  { label: "Practical Accounting", to: slugPath("practical-accounting") },
  { label: "Income Tax", to: slugPath("income-tax-tds-tcs-advance-tax") },
  { label: "Business Valuation", to: slugPath("business-valuation") },
  { label: "Language Lab", to: slugPath("language-lab") },
];

export const blogLinks = [
  { label: "How Cloud-Based Accounting Is Transforming The Industry?", to: slugPath("how-cloud-based-accounting-is-transforming-industry") },
  { label: "5 Innovative TallyPrime Features That Simplify GST Compliance For Your Business", to: slugPath("tallyprime-features-that-simplify-gst-compliance") },
  { label: "Top 10 Reasons To Choose Tally For Your Business", to: slugPath("reasons-to-choose-tally-software-for-your-business") },
  { label: "Understanding Accrual Vs. Cash Accounting: Which Method Is Right For You?", to: slugPath("accrual-and-cash-accounting-differences") },
  { label: "10 Simple Steps To Begin Learning Tally Prime", to: slugPath("steps-to-learn-tally-prime") },
];

export function PopularTopicsFooter() {
  return (
    <section className="bg-[#f5f6fa] py-16 border-t border-navy/5 text-navy">
      <div className={container}>
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Column 1: Popular Courses */}
            <div>
              <h3 className="text-lg font-extrabold text-navy tracking-tight mb-5">
                Popular Courses
              </h3>
              <ul className="space-y-3">
                {popularCoursesLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.to}
                      className="text-sm font-medium text-navy/70 transition-colors hover:text-teal hover:underline leading-relaxed block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Browse Topics */}
            <div>
              <h3 className="text-lg font-extrabold text-navy tracking-tight mb-5">
                Browse Topics
              </h3>
              <ul className="space-y-3">
                {browseTopicsLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.to}
                      className="text-sm font-medium text-navy/70 transition-colors hover:text-teal hover:underline leading-relaxed block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Upskill */}
            <div>
              <h3 className="text-lg font-extrabold text-navy tracking-tight mb-5">
                Upskill
              </h3>
              <ul className="space-y-3">
                {upskillLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.to}
                      className="text-sm font-medium text-navy/70 transition-colors hover:text-teal hover:underline leading-relaxed block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Blog */}
            <div>
              <h3 className="text-lg font-extrabold text-navy tracking-tight mb-5">
                Blog
              </h3>
              <ul className="space-y-3.5">
                {blogLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.to}
                      className="text-sm font-medium text-navy/70 transition-colors hover:text-teal hover:underline leading-relaxed block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
