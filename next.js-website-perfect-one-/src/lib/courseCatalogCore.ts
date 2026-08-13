import type { Course } from "@/data/courses";

export type CourseCatalogCourse = Course & { imageAlt?: string };

export type DjangoCourse = {
  slug?: unknown;
  aliases?: unknown;
  title?: unknown;
  category?: unknown;
  program_type?: unknown;
  badge?: unknown;
  badge_css_class?: unknown;
  duration?: unknown;
  mode?: unknown;
  tool_summary?: unknown;
  short_description?: unknown;
  hero_description?: unknown;
  snapshot_text?: unknown;
  online_fees?: unknown;
  offline_fees?: unknown;
  fee_summary?: unknown;
  eligibility?: unknown;
  hours_of_learning?: unknown;
  industry_projects?: unknown;
  tools_used_stat?: unknown;
  image?: unknown;
  image_alt?: unknown;
  syllabus_pdf?: unknown;
  highlights?: unknown;
  tools?: unknown;
  hiring_partners?: unknown;
  skills?: unknown;
  audiences?: unknown;
  job_opportunities?: unknown;
  certifications?: unknown;
  career_prospects?: unknown;
  curriculum_modules?: unknown;
  faqs?: unknown;
  seo?: unknown;
};

const text = (value: unknown) => (typeof value === "string" ? value : "");
const optionalText = (value: unknown) => {
  const valueText = text(value);
  return valueText || undefined;
};

function itemTexts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text((item as { text?: unknown })?.text)).filter(Boolean);
}

function mediaUrl(value: unknown, cmsOrigin: string): string | undefined {
  const path = optionalText(value);
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${cmsOrigin.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function normalizeDjangoCourse(value: unknown, cmsOrigin: string): CourseCatalogCourse | null {
  if (!value || typeof value !== "object") return null;
  const row = value as DjangoCourse;
  const slug = text(row.slug).trim().toLowerCase();
  const title = text(row.title).trim();
  const category = text(row.category);
  const programType = text(row.program_type);
  if (!slug || !title || !["Finance", "Taxation", "Analytics", "Marketing", "Gulf"].includes(category)) return null;
  if (!["Job Assured", "Certification", "Executive"].includes(programType)) return null;

  const seo = row.seo && typeof row.seo === "object" ? row.seo as Record<string, unknown> : {};
  const curriculum = Array.isArray(row.curriculum_modules)
    ? row.curriculum_modules.map((module) => ({
        title: text((module as { title?: unknown })?.title),
        topics: Array.isArray((module as { topics?: unknown })?.topics)
          ? ((module as { topics: unknown[] }).topics).map(text).filter(Boolean)
          : [],
      })).filter((module) => module.title)
    : [];
  const faqs = Array.isArray(row.faqs)
    ? row.faqs.map((faq) => ({
        question: text((faq as { question?: unknown })?.question),
        answer: text((faq as { answer?: unknown })?.answer),
      })).filter((faq) => faq.question)
    : [];

  return {
    slug,
    aliases: Array.isArray(row.aliases) ? row.aliases.map(text).filter(Boolean) : [],
    title,
    category: category as Course["category"],
    programType: programType as Course["programType"],
    badge: text(row.badge),
    badgeCls: text(row.badge_css_class) || "bg-navy/10 text-navy",
    duration: text(row.duration),
    mode: text(row.mode),
    tool: text(row.tool_summary),
    shortDesc: text(row.short_description),
    heroDesc: text(row.hero_description),
    onlineFees: optionalText(row.online_fees),
    offlineFees: optionalText(row.offline_fees),
    highlights: itemTexts(row.highlights),
    tools: itemTexts(row.tools),
    hiringPartners: itemTexts(row.hiring_partners),
    curriculum,
    fee: text(row.fee_summary),
    image: mediaUrl(row.image, cmsOrigin),
    imageAlt: optionalText(row.image_alt),
    seoTitle: optionalText(seo.seo_title),
    metaDescription: optionalText(seo.meta_description),
    canonicalUrl: optionalText(seo.canonical_url),
    snapshotText: optionalText(row.snapshot_text),
    jobOpportunities: itemTexts(row.job_opportunities),
    whoIsThisFor: itemTexts(row.audiences),
    topSkills: itemTexts(row.skills),
    faqs,
    eligibility: optionalText(row.eligibility),
    certifications: itemTexts(row.certifications),
    careerProspects: itemTexts(row.career_prospects),
    syllabusPdf: mediaUrl(row.syllabus_pdf, cmsOrigin),
    hoursOfLearning: optionalText(row.hours_of_learning),
    industryProjects: optionalText(row.industry_projects),
    toolsUsed: optionalText(row.tools_used_stat),
  };
}

export function chooseCourseCatalog(apiPayload: unknown, fallback: CourseCatalogCourse[], cmsOrigin: string): CourseCatalogCourse[] {
  const rows = Array.isArray(apiPayload)
    ? apiPayload
    : apiPayload && typeof apiPayload === "object" && Array.isArray((apiPayload as { results?: unknown }).results)
      ? (apiPayload as { results: unknown[] }).results
      : [];
  const normalized = rows.map((row) => normalizeDjangoCourse(row, cmsOrigin)).filter((row): row is CourseCatalogCourse => Boolean(row));
  if (normalized.length === 0 || normalized.length !== rows.length) return fallback;

  const fallbackSlugs = new Set(fallback.map((course) => course.slug));
  const cmsBySlug = new Map<string, CourseCatalogCourse>();
  for (const course of normalized) {
    if (!fallbackSlugs.has(course.slug) || cmsBySlug.has(course.slug)) return fallback;
    cmsBySlug.set(course.slug, course);
  }

  return fallback.map((course) => cmsBySlug.get(course.slug) ?? course);
}

export function findCourseInCatalog(catalog: CourseCatalogCourse[], slug: string): CourseCatalogCourse | undefined {
  if (!slug) return undefined;
  const normalizedSlug = slug.toLowerCase();
  return catalog.find((course) => course.slug === normalizedSlug || course.aliases?.includes(normalizedSlug));
}

export function relatedCoursesFromCatalog(catalog: CourseCatalogCourse[], course: CourseCatalogCourse, count = 3) {
  const sameCategory = catalog.filter((item) => item.slug !== course.slug && item.category === course.category).slice(0, count);
  return sameCategory.length ? sameCategory : catalog.filter((item) => item.slug !== course.slug).slice(0, count);
}
