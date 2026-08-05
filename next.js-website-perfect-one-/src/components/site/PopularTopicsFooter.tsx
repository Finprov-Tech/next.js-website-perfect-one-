import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

export const popularCoursesLinks = [
  { label: "PGDIFA", to: "/courses/pgdifa-indian-foreign-accounting" },
  { label: "IIT IHub Certified Digital Marketing Course", to: "/courses/digital-marketing-iit-ihub" },
  { label: "Digital Marketing Specialist Program", to: "/courses/digital-marketing-iit-ihub" },
  { label: "SAP S/4HANA FI", to: "/courses/sap-s4hana-fi" },
  { label: "IBAP", to: "/courses/ibap-international-business-accounting" },
  { label: "Business Accounting Specialist Program (BASP)", to: "/courses/basp-business-accounting-specialist" },
  { label: "SAP S/4HANA MM", to: "/courses/sap-s4hana-mm" },
];

export const browseTopicsLinks = [
  { label: "Diploma In Indian Accounting", to: "/courses/dia-diploma-indian-accounting" },
  { label: "CBAT", to: "/courses/cbat-certification-business-accounting" },
  { label: "PPC Specialist Program", to: "/courses/seo-ppc-specialist" },
  { label: "SEO Specialist Course", to: "/courses/seo-ppc-specialist" },
  { label: "Certification In MS Office", to: "/courses/certification-ms-office" },
  { label: "UAE Corporate Tax", to: "/courses/uae-corporate-tax" },
  { label: "Tally Prime", to: "/courses/tally-prime-gst" },
];

export const upskillLinks = [
  { label: "Zoho Books", to: "/courses/zoho-books" },
  { label: "Gulf VAT", to: "/courses/gulf-accounting-analyst" },
  { label: "GST + Simulation Software", to: "/courses/tally-prime-gst" },
  { label: "Basics Of Microsoft Excel", to: "/courses/certification-ms-office" },
  { label: "Practical Accounting", to: "/courses/pgbat-business-accounting-taxation" },
  { label: "Income Tax", to: "/courses/pgbat-business-accounting-taxation" },
  { label: "Business Valuation", to: "/courses/basp-business-accounting-specialist" },
  { label: "Language Lab", to: "/courses/pgdifa-indian-foreign-accounting" },
];

export const blogLinks = [
  { label: "How Cloud-Based Accounting Is Transforming The Industry?", to: "/blog/cloud-based-accounting-transforming-industry" },
  { label: "5 Innovative TallyPrime Features That Simplify GST Compliance For Your Business", to: "/blog/tallyprime-features-simplify-gst-compliance" },
  { label: "Top 10 Reasons To Choose Tally For Your Business", to: "/blog/top-10-reasons-choose-tally-software" },
  { label: "Understanding Accrual Vs. Cash Accounting: Which Method Is Right For You?", to: "/blog/accrual-vs-cash-accounting-method" },
  { label: "10 Simple Steps To Begin Learning Tally Prime", to: "/blog/10-simple-steps-begin-learning-tally-prime" },
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
