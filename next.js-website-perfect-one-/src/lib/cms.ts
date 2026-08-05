// NEXT_PUBLIC_ prefix required: resolveCmsImageUrl() runs inside Client
// Components, and only NEXT_PUBLIC_ vars are inlined into the browser bundle
// — a server-only var here would resolve to `undefined` after hydration and
// break image srcs.
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000";

export type CMSPageType = {
  name: string;
  slug: string;
};

export type CMSHeroAnimatedWord = {
  id: number;
  word: string;
  display_order: number;
};

export type CMSBanner = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  rich_text: string;
  badge_text: string;
  badge_icon: string;
  centres_text: string;
  cta_text: string;
  cta_internal_page: string | null;
  cta_external_url: string;
  secondary_cta_text: string;
  secondary_cta_internal_page: string | null;
  secondary_cta_external_url: string;
  top_card_title: string;
  top_card_subtitle: string;
  top_card_icon: string;
  bottom_card_title: string;
  bottom_card_subtitle: string;
  bottom_card_icon: string;
  floating_stat_value: string;
  floating_stat_label: string;
  animated_words: CMSHeroAnimatedWord[];
  image: string | null;
  image_alt: string;
  display_order: number;
};

export type CMSScrollItem = {
  id: number;
  text: string;
  icon: string;
  display_order: number;
};

export type CMSScrollSection = {
  id: number;
  heading: string;
  items: CMSScrollItem[];
  display_order: number;
};

export type CMSCredentialItem = {
  id: number;
  title: string;
  value: string;
  icon: string;
  display_order: number;
};

export type CMSCredentials = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  image: string | null;
  image_alt: string;
  items: CMSCredentialItem[];
  display_order: number;
};

export type CMSCourseCard = {
  id: number;
  title: string;
  slug: string;
  category: string;
  program_type: string;
  badge: string;
  duration: string;
  mode: string;
  tool: string;
  description: string;
  image: string | null;
  image_alt: string;
  button_text: string;
  button_internal_page: string | null;
  button_external_url: string;
  display_order: number;
};

export type CMSCourseSection = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  background_image: string | null;
  background_image_alt: string;
  button_text: string;
  button_internal_page: string | null;
  button_external_url: string;
  cards: CMSCourseCard[];
  display_order: number;
};

export type CMSFeatureCard = {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  display_order: number;
};

export type CMSWhyFinprovSection = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  feature_cards: CMSFeatureCard[];
  display_order: number;
};

export type CMSPlacementStat = {
  id: number;
  label: string;
  value: string;
  display_order: number;
};

export type CMSPlacementSection = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  cta_text: string;
  cta_internal_page: string | null;
  cta_external_url: string;
  image: string | null;
  image_alt: string;
  stats: CMSPlacementStat[];
  display_order: number;
};

export type CMSTestimonial = {
  id: number;
  name: string;
  program: string;
  company: string;
  designation: string;
  quote: string;
  avatar: string | null;
  avatar_alt: string;
  rating: number;
  kind: "text" | "video";
  video_url: string;
  video_thumbnail: string | null;
  display_order: number;
};

export type CMSPartnerLogo = {
  id: number;
  name: string;
  kind: "partner" | "tool";
  logo: string | null;
  logo_alt: string;
  website_url: string;
  display_order: number;
};

export type CMSFAQItem = {
  id: number;
  question: string;
  answer: string;
  display_order: number;
};

export type CMSCTA = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  cta_text: string;
  cta_internal_page: string | null;
  cta_external_url: string;
  secondary_cta_text: string;
  secondary_cta_internal_page: string | null;
  secondary_cta_external_url: string;
  image: string | null;
  image_alt: string;
  display_order: number;
};

export type CMSPage = {
  id: number;
  name: string;
  slug: string;
  page_type: CMSPageType | null;
  is_homepage: boolean;
  status: string;
  seo: Record<string, unknown> | null;
  banner: CMSBanner | null;
  scroll_section: CMSScrollSection | null;
  credentials: CMSCredentials | null;
  courses: CMSCourseSection | null;
  why_finprov: CMSWhyFinprovSection | null;
  placements: CMSPlacementSection | null;
  testimonials: CMSTestimonial[];
  partner_logos: CMSPartnerLogo[];
  faq: CMSFAQItem[];
  cta: CMSCTA | null;
};

/**
 * Fetches a published page (with its SEO + active modules) from the Django CMS.
 * Returns null on any failure (CMS down, network error, 404) so callers can
 * fall back to hardcoded content instead of breaking the page.
 */
export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/pages/${slug}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as CMSPage;
  } catch {
    return null;
  }
}

/** Django returns media paths like "/media/...". Prefix the CMS host if not already absolute. */
export function resolveCmsImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${CMS_API_URL}${path}`;
}

/** Resolves a CTA link: internal page slug > external URL > the given fallback path. */
export function resolveCmsLink(
  internalPage: string | null | undefined,
  externalUrl: string | null | undefined,
  fallback: string,
): string {
  return externalUrl || (internalPage ? `/${internalPage}` : fallback);
}

/** Parses a display value like "12,000+" into { end: 12000, suffix: "+" } for CountUp-style animation. */
export function parseCountValue(value: string): { end: number; suffix: string } {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return { end: 0, suffix: value };
  return { end: parseInt(match[1].replace(/,/g, ""), 10) || 0, suffix: match[2] };
}
