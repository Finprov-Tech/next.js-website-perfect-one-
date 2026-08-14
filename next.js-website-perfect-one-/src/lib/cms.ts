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
  image_alt: string;
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
  video_thumbnail_alt: string;
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

/** `body` is raw HTML, already sanitized server-side (see LegalSectionSerializer). */
export type CMSLegalSection = {
  id: number;
  title: string;
  body: string;
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

export type CMSMetaRobots = string;

export type CMSSchemaType =
  | "none"
  | "webpage"
  | "organization"
  | "article"
  | "blogposting"
  | "faq"
  | "course"
  | "breadcrumb"
  | "localbusiness"
  | "product";

export type CMSSeoMeta = {
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  meta_robots: CMSMetaRobots;
  og_title: string;
  og_description: string;
  og_image: string | null;
  og_url: string;
  schema_type: CMSSchemaType;
  custom_schema_json: Record<string, unknown> | null;
  include_in_sitemap: boolean;
  author_name: string;
  author_bio: string;
  author_image: string | null;
  word_count: number | null;
};

export type CMSSiteSettings = {
  site_name: string;
  site_logo: string | null;
  default_og_image: string | null;
  custom_404_title: string;
  custom_404_message: string;
  custom_404_image: string | null;
};

export type CMSRedirect = {
  old_path: string;
  new_path: string;
  redirect_type: 301 | 302;
};

export type CMSQuizOption = {
  id: number;
  label: string;
  category: string;
  display_order: number;
};

export type CMSQuizQuestion = {
  id: number;
  question_text: string;
  options: CMSQuizOption[];
  display_order: number;
};

export type CMSQuiz = {
  id: number;
  heading: string;
  description: string;
  next_button_text: string;
  cta_text: string;
  cta_internal_page: string | null;
  cta_external_url: string;
  questions: CMSQuizQuestion[];
  display_order: number;
};

export type CMSTeamMember = {
  id: number;
  name: string;
  role: string;
  category: string;
  experience: string;
  credentials: string;
  quote: string;
  photo: string | null;
  photo_alt: string;
  bio: string;
  highlights: string;
  display_order: number;
};

export type CMSTeamSection = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  members: CMSTeamMember[];
  display_order: number;
};

export type CMSGalleryImage = {
  id: number;
  image: string | null;
  image_alt: string;
  caption: string;
  display_order: number;
};

export type CMSLifeAtFinprovSection = {
  id: number;
  heading: string;
  sub_heading: string;
  heading_level: string;
  paragraph: string;
  images: CMSGalleryImage[];
  display_order: number;
};

/** `body` is raw HTML, already sanitized server-side (see LandingPageBodySerializer). */
export type CMSLandingPageBody = {
  id: number;
  h1: string;
  body: string;
};

export type CMSHistoryMilestone = {
  id: number;
  year_label: string;
  title: string;
  description: string;
  display_order: number;
};

export type CMSHistorySection = {
  id: number;
  eyebrow: string;
  heading: string;
  sub_heading: string;
  heading_level: string;
  milestones: CMSHistoryMilestone[];
  display_order: number;
};

export type CMSPage = {
  id: number;
  name: string;
  slug: string;
  page_type: CMSPageType | null;
  is_homepage: boolean;
  status: string;
  seo: CMSSeoMeta | null;
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
  quiz: CMSQuiz | null;
  team: CMSTeamSection | null;
  life_at_finprov: CMSLifeAtFinprovSection | null;
  legal_sections: CMSLegalSection[];
  landing_page: CMSLandingPageBody | null;
  history: CMSHistorySection | null;
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

export type CMSBlogCategory = {
  name: string;
  slug: string;
};

export type CMSBlogPostSection = {
  id: number;
  heading: string;
  body: string;
  display_order: number;
};

export type CMSBlogPostSummary = {
  title: string;
  slug: string;
  excerpt: string;
  category: CMSBlogCategory | null;
  cover_image: string | null;
  cover_image_alt: string;
  author_name: string;
  author_role: string;
  published_date: string | null;
  read_time: string;
  is_featured: boolean;
};

export type CMSBlogPostDetail = CMSBlogPostSummary & {
  sections: CMSBlogPostSection[];
  seo: CMSSeoMeta | null;
};

/** Fetches all published blog posts (list shape, no sections/seo). Returns [] on any failure. */
export async function getBlogPosts(): Promise<CMSBlogPostSummary[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/blog/posts/`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? data) as CMSBlogPostSummary[];
  } catch {
    return [];
  }
}

/** Fetches all blog categories. Returns [] on any failure. */
export async function getBlogCategories(): Promise<CMSBlogCategory[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/blog/categories/`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? data) as CMSBlogCategory[];
  } catch {
    return [];
  }
}

/** Fetches one published blog post by slug (full detail incl. sections + seo). Null on any failure. */
export async function getBlogPostBySlug(slug: string): Promise<CMSBlogPostDetail | null> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/blog/posts/${slug}/`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CMSBlogPostDetail;
  } catch {
    return null;
  }
}

/** Fetches the singleton site settings (branding + custom 404) from the Django CMS. */
export async function getSiteSettings(): Promise<CMSSiteSettings | null> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/site-settings/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as CMSSiteSettings;
  } catch {
    return null;
  }
}

/** Fetches active 301/302 redirects from the Django CMS, used by middleware.ts. */
export async function getActiveRedirects(): Promise<CMSRedirect[]> {
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/redirects/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return (await res.json()) as CMSRedirect[];
  } catch {
    return [];
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
