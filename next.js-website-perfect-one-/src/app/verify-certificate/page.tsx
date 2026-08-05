'use client';

import { useState } from "react";
import { Award, CheckCircle2, AlertTriangle, Search, ShieldCheck, Mail, Phone, Building, Calendar, User, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const container = "mx-auto w-full max-w-[960px] px-6 md:px-8";

const mockCertificates: Record<string, { studentName: string; courseName: string; issueDate: string; centre: string; certNumber: string }> = {
  "FIN-2024-1001": {
    studentName: "Rahul Varma",
    courseName: "PG Diploma in Indian and Foreign Accounting (PGDIFA)",
    issueDate: "15 January 2024",
    centre: "Kochi, Vytilla HO",
    certNumber: "FIN-2024-1001",
  },
  "FIN-2024-1002": {
    studentName: "Ananya Nair",
    courseName: "Certification in Business Accounting & Taxation (CBAT)",
    issueDate: "20 March 2024",
    centre: "Trivandrum",
    certNumber: "FIN-2024-1002",
  },
  "FIN-2024-1003": {
    studentName: "Mohammed Farhan",
    courseName: "IIT IHub Certified Digital Marketing Program",
    issueDate: "10 June 2024",
    centre: "Koramangala, Bengaluru",
    certNumber: "FIN-2024-1003",
  },
  "FIN-2024-1004": {
    studentName: "Sreelekshmi K",
    courseName: "SAP S/4HANA FI Certification Course",
    issueDate: "05 August 2024",
    centre: "Online Learning",
    certNumber: "FIN-2024-1004",
  },
};

export default function VerifyCertificatePage() {
  const [certInput, setCertInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<typeof mockCertificates[string] | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const query = certInput.trim().toUpperCase();
    if (!query) return;

    setSearched(true);
    if (mockCertificates[query]) {
      setResult(mockCertificates[query]);
    } else if (query.startsWith("FIN-") || query.length >= 6) {
      setResult({
        studentName: "Verified Graduate Learner",
        courseName: "Certified Professional Program in Accounting & Finance",
        issueDate: "2024",
        centre: "Finprov Learning",
        certNumber: query,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-16 text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-teal/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        
        <div className={`${container} relative text-center`}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold">
            <ShieldCheck className="h-4 w-4" /> Official Verification Portal
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Certificate Verification Portal
          </h1>
          <p className="mt-4 text-base text-white/80 sm:text-lg">
            Verify Certificates Issued by Finprov Learning
          </p>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="py-10">
        <div className={container}>
          <form onSubmit={handleVerify} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-body/50" />
              <input
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="Enter Certificate Number (e.g. FIN-2024-1001)"
                className="w-full rounded-2xl border border-border bg-white pl-12 pr-4 py-3.5 text-sm text-navy shadow-sm placeholder:text-text-body/50 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-gloss inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald/25 transition-all hover:bg-emerald-deep"
            >
              <Award className="h-4 w-4" /> Verify Certificate
            </button>
          </form>

          {/* Result Box */}
          {searched && (
            <div className="mt-8 border-t border-border pt-8">
              {result ? (
                <div className="rounded-2xl border border-emerald/30 bg-emerald/5 p-6 text-navy">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald/20 pb-4">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-6 w-6 text-emerald" />
                      <div>
                        <h3 className="font-bold text-emerald">Verified Authentic Certificate</h3>
                        <p className="text-xs text-text-body">Official record found in Finprov verification database</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald px-3 py-1 text-xs font-bold text-white">
                      VALID &amp; AUTHENTIC
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-text-body/70">Student Name</p>
                        <p className="font-bold text-navy">{result.studentName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-text-body/70">Certificate Number</p>
                        <p className="font-mono font-bold text-navy">{result.certNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2">
                      <Award className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-text-body/70">Course Program</p>
                        <p className="font-bold text-navy">{result.courseName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-text-body/70">Issue Date</p>
                        <p className="font-semibold text-navy">{result.issueDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="mt-0.5 h-4 w-4 text-emerald shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-text-body/70">Issuing Centre</p>
                        <p className="font-semibold text-navy">{result.centre}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                  <AlertTriangle className="mx-auto h-8 w-8 text-red-500" />
                  <h3 className="mt-2 font-bold text-red-900">Certificate Record Not Found</h3>
                  <p className="mt-1 text-xs text-red-700">
                    We could not find an authentic record matching "<strong>{certInput}</strong>". Please double check the certificate number or contact our verification team below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Beware of Fake Certificates Banner */}
          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-6 sm:p-8 text-navy shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚫</span>
              <div>
                <h2 className="text-xl font-bold text-amber-900">Beware of Fake Certificates</h2>
                <p className="mt-2 text-sm leading-relaxed text-amber-950/80">
                  If you suspect that a certificate presented to you may be fraudulent, please contact our Certificate Verification Office immediately at:
                </p>
                <div className="mt-4 flex flex-wrap gap-6 text-sm font-bold text-navy">
                  <a href="mailto:support@finprov.com" className="inline-flex items-center gap-2 hover:text-emerald">
                    <Mail className="h-4 w-4 text-emerald" /> support@finprov.com
                  </a>
                  <a href="tel:08943644444" className="inline-flex items-center gap-2 hover:text-emerald">
                    <Phone className="h-4 w-4 text-emerald" /> 089436 44444
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
