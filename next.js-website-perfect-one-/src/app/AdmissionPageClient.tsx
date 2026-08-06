'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import {
  User,
  GraduationCap,
  BookOpen,
  CreditCard,
  Download,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Upload,
  BadgeCheck,
  CheckCircle2
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { courses } from "@/data/courses";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSchemaForPage, organizationSchema } from "@/lib/seoSchemas";
import { SITE_URL } from "@/lib/seo";
import type { CMSPage } from "@/lib/cms";

const container = "mx-auto w-full max-w-[1200px] px-6 md:px-8 lg:px-[120px]";

const campuses = [
  "Kochi - Vytilla Main Campus",
  "Calicut - Mavoor Road Campus",
  "Trivandrum - Kazhakkoottam Campus",
  "Bengaluru - Koramangala Center",
  "Bengaluru - Vijayanagar Center",
  "Manjeri - Central Campus",
  "Kollam - High Street Center",
  "Alappuzha - Town Center",
  "Pandalam - College Junction",
  "Online Virtual Classroom",
];

const qualifications = [
  "B.Com (Finance / Taxation / Co-operation)",
  "M.Com / MBA / PGDM",
  "BBA / BBM",
  "B.Tech / BE / BCA / BSc",
  "Higher Secondary (Plus Two / 12th Pass)",
  "Chartered Accountant / ACCA Student",
  "Working Professional / Other",
];

function AdmissionContent({ cmsPage }: { cmsPage: CMSPage | null }) {
  const searchParams = useSearchParams();
  const searchParamCourse = searchParams.get("course") || "";

  const banner = cmsPage?.banner ?? null;
  const heroBadge = banner?.badge_text || "Official Online Admission Portal";
  const heroHeading = banner?.heading || "Complete Your Finprov Admission Online";
  const heroParagraph =
    banner?.paragraph ||
    "Secure your seat in 4 easy steps. Instant registration confirmation, student ID allocation, and batch reservation.";
  const pageSchema = generateSchemaForPage(cmsPage, `${SITE_URL}/admission/`) ?? organizationSchema;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const matched = courses.find((c) => c.slug === searchParamCourse) || courses[0];
    return {
      fullName: "",
      email: "",
      mobile: "",
      whatsapp: "",
      gender: "Female",
      dob: "",
      guardianName: "",

      qualification: qualifications[0],
      passingYear: "2025",
      institution: "",

      selectedCourseSlug: matched?.slug || (courses[0]?.slug || "pgbat"),
      mode: "Offline Campus",
      campus: campuses[0],
      batchTiming: "Morning (9:30 AM - 1:00 PM)",

      idType: "Aadhaar Card",
      idNumber: "",
      fileName: "",
      coupon: "",
      paymentMethod: "UPI / GPay / PhonePe",
      agreedTerms: false,
    };
  });

  useEffect(() => {
    if (searchParamCourse && courses.some((crs) => crs.slug === searchParamCourse)) {
      setFormData((prev) => ({ ...prev, selectedCourseSlug: searchParamCourse }));
    }
  }, [searchParamCourse]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `FIN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setApplicationId(generatedId);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentCourse = courses.find((c) => c.slug === formData.selectedCourseSlug) || courses[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={pageSchema} />
      <ScrollProgress />
      <SiteHeader />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />
        <div className={`${container} relative text-center`}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3.5 py-1 text-xs font-bold text-gold ring-1 ring-gold/30">
            <Sparkles className="h-3.5 w-3.5" /> {heroBadge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {heroHeading}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {heroParagraph}
          </p>
        </div>
      </section>

      {/* Main Registration Content */}
      <section className="py-14">
        <div className={container}>
          {!isSubmitted ? (
            <div className="mx-auto max-w-4xl">
              {/* Step Progress Tracker */}
              <div className="mb-10 flex items-center justify-between border-b border-border pb-6">
                {[
                  { num: 1, label: "Personal Details", icon: User },
                  { num: 2, label: "Qualification", icon: GraduationCap },
                  { num: 3, label: "Course & Campus", icon: BookOpen },
                  { num: 4, label: "Payment & Confirm", icon: CreditCard },
                ].map((s) => {
                  const Icon = s.icon;
                  const isActive = step === s.num;
                  const isDone = step > s.num;

                  return (
                    <div key={s.num} className="flex flex-1 flex-col items-center text-center">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl font-bold transition-all ${
                          isDone
                            ? "bg-teal text-white shadow-md"
                            : isActive
                            ? "bg-navy text-white shadow-lg ring-2 ring-gold"
                            : "bg-bg-light text-text-body/50"
                        }`}
                      >
                        {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                      </div>
                      <span
                        className={`mt-2 hidden text-xs font-semibold sm:block ${
                          isActive ? "text-navy" : isDone ? "text-teal" : "text-text-body/50"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step Form Box */}
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-3xl border border-border bg-white p-6 shadow-xl sm:p-10"
              >
                <form onSubmit={handleSubmit}>
                  {/* STEP 1: Personal Details */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                          <User className="h-5 w-5 text-teal" /> Step 1: Personal Details
                        </h2>
                        <p className="text-xs text-text-body">Enter your official name and contact information</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-navy">Full Name (As per Certificates) *</label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="e.g. Anjali Nair"
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="anjali@gmail.com"
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Mobile Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.mobile}
                            onChange={(e) => handleChange("mobile", e.target.value)}
                            placeholder="+91 98765 43210"
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">WhatsApp Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.whatsapp}
                            onChange={(e) => handleChange("whatsapp", e.target.value)}
                            placeholder="+91 98765 43210"
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Date of Birth *</label>
                          <input
                            type="date"
                            required
                            value={formData.dob}
                            onChange={(e) => handleChange("dob", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Gender *</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleChange("gender", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Qualification Details */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-teal" /> Step 2: Educational Qualification
                        </h2>
                        <p className="text-xs text-text-body">Tell us about your academic background</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-navy">Highest Qualification *</label>
                          <select
                            value={formData.qualification}
                            onChange={(e) => handleChange("qualification", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            {qualifications.map((q) => (
                              <option key={q} value={q}>
                                {q}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">College / University / School *</label>
                          <input
                            type="text"
                            required
                            value={formData.institution}
                            onChange={(e) => handleChange("institution", e.target.value)}
                            placeholder="e.g. Mahatma Gandhi University / Calicut University"
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Year of Passing *</label>
                          <select
                            value={formData.passingYear}
                            onChange={(e) => handleChange("passingYear", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            {["2026", "2025", "2024", "2023", "2022", "2021", "2020 & Earlier"].map((y) => (
                              <option key={y}>{y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Course & Campus Selection */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-teal" /> Step 3: Program & Campus Selection
                        </h2>
                        <p className="text-xs text-text-body">Choose your program, learning mode, and preferred campus</p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-navy">Select Program (70 Courses Available) *</label>
                          <select
                            value={formData.selectedCourseSlug}
                            onChange={(e) => handleChange("selectedCourseSlug", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm font-semibold text-navy focus:border-teal focus:outline-none"
                          >
                            {courses.map((c) => (
                              <option key={c.slug} value={c.slug}>
                                {c.title} ({c.duration} - {c.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Learning Mode *</label>
                          <select
                            value={formData.mode}
                            onChange={(e) => handleChange("mode", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            <option>Offline Campus (Classroom Training)</option>
                            <option>Online Live Interactive Classes</option>
                            <option>Online Self-Paced Certification</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">Preferred Campus Center *</label>
                          <select
                            value={formData.campus}
                            onChange={(e) => handleChange("campus", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            {campuses.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-navy">Preferred Batch Timing *</label>
                          <select
                            value={formData.batchTiming}
                            onChange={(e) => handleChange("batchTiming", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            <option>Morning Batch (9:30 AM - 1:00 PM)</option>
                            <option>Afternoon Batch (1:30 PM - 5:00 PM)</option>
                            <option>Evening Professional Batch (5:30 PM - 8:00 PM)</option>
                            <option>Weekend Batch (Saturday & Sunday)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Verification & Payment Confirmation */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="border-b border-border pb-4">
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-teal" /> Step 4: Admission Summary & Confirmation
                        </h2>
                        <p className="text-xs text-text-body">Review details and submit registration</p>
                      </div>

                      <div className="rounded-2xl border border-teal/30 bg-teal/5 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-bold text-white">
                              {currentCourse.category}
                            </span>
                            <h3 className="mt-2 text-lg font-bold text-navy">{currentCourse.title}</h3>
                            <p className="mt-1 text-xs text-text-body">
                              Duration: <b className="text-navy">{currentCourse.duration}</b> | Mode:{" "}
                              <b className="text-navy">{formData.mode}</b>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-text-body">Fee Details</span>
                            <p className="text-xl font-extrabold text-navy">{currentCourse.fee}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-navy">Identity Proof Type *</label>
                          <select
                            value={formData.idType}
                            onChange={(e) => handleChange("idType", e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          >
                            <option>Aadhaar Card</option>
                            <option>PAN Card</option>
                            <option>Passport</option>
                            <option>Voter ID</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-navy">ID Proof Number *</label>
                          <input
                            type="text"
                            required
                            value={formData.idNumber}
                            onChange={(e) => handleChange("idNumber", e.target.value)}
                            placeholder="Enter Aadhaar / PAN number"
                            className="mt-1.5 w-full rounded-xl border border-border bg-bg-light px-4 py-3 text-sm focus:border-teal focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed border-border p-5 text-center bg-bg-light">
                        <Upload className="mx-auto h-8 w-8 text-teal" />
                        <p className="mt-2 text-xs font-bold text-navy">Upload ID Proof / Mark Sheet Document</p>
                        <p className="text-[11px] text-text-body/70">PDF, JPG, PNG up to 5MB</p>
                        <input
                          type="file"
                          onChange={(e) => handleChange("fileName", e.target.files?.[0]?.name || "Document.pdf")}
                          className="mt-3 text-xs text-text-body"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          checked={formData.agreedTerms}
                          onChange={(e) => handleChange("agreedTerms", e.target.checked)}
                          className="h-4 w-4 rounded border-border text-teal focus:ring-teal"
                        />
                        <label htmlFor="terms" className="text-xs text-text-body">
                          I declare that the information provided is correct and I agree to Finprov Learning's admission guidelines and code of conduct.
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-xs font-bold text-navy transition-colors hover:bg-bg-light"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-navy-dark"
                      >
                        Continue to Step {step + 1} <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!formData.agreedTerms}
                        className="flex items-center gap-2 rounded-xl bg-cta px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        Complete Admission & Submit <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-2xl rounded-3xl border border-teal/40 bg-white p-8 text-center shadow-2xl sm:p-12"
            >
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-teal/15 text-teal ring-8 ring-teal/10">
                <BadgeCheck className="h-10 w-10" />
              </div>

              <span className="mt-6 inline-block rounded-full bg-gold/20 px-4 py-1 text-xs font-bold text-navy">
                Admission Status: CONFIRMED
              </span>

              <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">
                Congratulations, {formData.fullName}!
              </h2>
              <p className="mt-2 text-sm text-text-body">
                Your online admission application has been registered successfully.
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-bg-light p-6 text-left space-y-3">
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-xs text-text-body">Application ID</span>
                  <span className="text-sm font-extrabold text-navy">{applicationId}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-xs text-text-body">Selected Program</span>
                  <span className="text-sm font-bold text-teal">{currentCourse.title}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-xs text-text-body">Learning Mode</span>
                  <span className="text-xs font-semibold text-navy">{formData.mode}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <span className="text-xs text-text-body">Assigned Campus</span>
                  <span className="text-xs font-semibold text-navy">{formData.campus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-body">Registered Mobile</span>
                  <span className="text-xs font-semibold text-navy">{formData.mobile}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-navy-dark"
                >
                  <Download className="h-4 w-4" /> Download Admission Receipt
                </button>
                <Link
                  href="/courses"
                  className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-xs font-bold text-navy hover:bg-bg-light"
                >
                  Explore Other Courses
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export function AdmissionPageClient({ cmsPage }: { cmsPage: CMSPage | null }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy text-white flex items-center justify-center">Loading Admission Portal...</div>}>
      <AdmissionContent cmsPage={cmsPage} />
    </Suspense>
  );
}
