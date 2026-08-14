/** Field schemas for the page editor — one entry per module type, mirroring
 * the exact field allowlist in backend/seo_panel/serializers.py. If a field
 * isn't listed there, it isn't listed here either (images/icons/ordering/
 * active flags/heading_level/structure are never editable from this panel).
 * Keep these two files in sync if the allowlist ever changes. */

export type FieldType = "text" | "richtext" | "textarea" | "select" | "image" | "number" | "boolean" | "keywords" | "checkboxes";

export type FieldSchema = {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  /** Shows a live character counter + green/amber/red bar under the input —
   * same thresholds as the old admin's seo_counters.js. */
  counter?: { min: number; max: number };
};

export type ModuleSchema = {
  title: string;
  endpoint: string; // proxy path prefix, e.g. "modules/banners"
  fields: FieldSchema[];
  parentField?: string;
  canCreate?: boolean;
  canDelete?: boolean;
  itemsKey?: string; // key in the API payload holding a repeating child array
  itemSchema?: ModuleSchema; // schema for each item — may itself have itemsKey (Quiz -> questions -> options)
};

const text = (name: string, label: string): FieldSchema => ({ name, label, type: "text" });
const rich = (name: string, label: string): FieldSchema => ({ name, label, type: "richtext" });
const textarea = (name: string, label: string): FieldSchema => ({ name, label, type: "textarea" });
const image = (name: string, label: string): FieldSchema => ({ name, label, type: "image" });
const ORDER_FIELDS: FieldSchema[] = [
  { name: "display_order", label: "Display order", type: "number" },
  { name: "is_active", label: "Visible on website", type: "boolean" },
];

const LINK_FIELDS = (prefix = "cta") => [
  text(`${prefix}_text`, "Button text"),
  text(`${prefix}_external_url`, "Button link (path or URL)"),
];

export const BANNER_SCHEMA: ModuleSchema = {
  title: "Banner",
  endpoint: "modules/banners",
  fields: [
    text("heading", "Heading"),
    text("sub_heading", "Sub-heading"),
    rich("paragraph", "Paragraph"),
    rich("rich_text", "Secondary paragraph"),
    text("badge_text", "Top badge text"),
    text("centres_text", "Centres / location line"),
    ...LINK_FIELDS("cta"),
    ...LINK_FIELDS("secondary_cta"),
    text("top_card_title", "Top floating card title"),
    text("top_card_subtitle", "Top floating card subtitle"),
    text("bottom_card_title", "Bottom floating card title"),
    text("bottom_card_subtitle", "Bottom floating card subtitle"),
    text("floating_stat_value", "Floating stat value"),
    text("floating_stat_label", "Floating stat label"),
    image("image", "Banner image"),
    text("image_alt", "Banner image alt text"),
    ...ORDER_FIELDS,
  ],
};

export const CREDENTIAL_ITEM_SCHEMA: ModuleSchema = {
  title: "Credential item",
  endpoint: "modules/credential-items",
  fields: [text("title", "Title"), text("value", "Value"), ...ORDER_FIELDS],
  parentField: "credentials", canCreate: true, canDelete: true,
};

export const SCROLL_ITEM_SCHEMA: ModuleSchema = {
  title: "Ticker item",
  endpoint: "modules/scroll-items",
  fields: [text("text", "Text"), ...ORDER_FIELDS],
  parentField: "scroll_section", canCreate: true, canDelete: true,
};

export const SCROLL_SECTION_SCHEMA: ModuleSchema = {
  title: "Announcement ticker",
  endpoint: "modules/scroll-sections",
  fields: [text("heading", "Heading (internal label, not shown publicly)"), ...ORDER_FIELDS],
  itemsKey: "items",
  itemSchema: SCROLL_ITEM_SCHEMA,
};

export const CREDENTIALS_SCHEMA: ModuleSchema = {
  title: "Credentials",
  endpoint: "modules/credentials",
  fields: [text("heading", "Heading"), text("sub_heading", "Sub-heading"), rich("paragraph", "Paragraph"), image("image", "Section image"), text("image_alt", "Section image alt text"), ...ORDER_FIELDS],
  itemsKey: "items",
  itemSchema: CREDENTIAL_ITEM_SCHEMA,
};

export const COURSE_CARD_SCHEMA: ModuleSchema = {
  title: "Course card",
  endpoint: "modules/course-cards",
  fields: [
    text("title", "Title"),
    text("slug", "Course slug"),
    text("category", "Category"),
    text("program_type", "Program type"),
    text("badge", "Badge"),
    text("duration", "Duration"),
    text("mode", "Mode"),
    text("tool", "Tool"),
    textarea("description", "Description"),
    image("image", "Course image"),
    text("image_alt", "Course image alt text"),
    ...LINK_FIELDS("button"),
    ...ORDER_FIELDS,
  ],
  parentField: "course_section", canCreate: true, canDelete: true,
};

export const COURSE_SECTION_SCHEMA: ModuleSchema = {
  title: "Course section",
  endpoint: "modules/course-sections",
  fields: [text("heading", "Heading"), text("sub_heading", "Sub-heading"), textarea("paragraph", "Paragraph"), image("background_image", "Background image"), text("background_image_alt", "Background image alt text"), ...LINK_FIELDS("button"), ...ORDER_FIELDS],
  itemsKey: "cards",
  itemSchema: COURSE_CARD_SCHEMA,
};

export const FEATURE_CARD_SCHEMA: ModuleSchema = {
  title: "Feature card",
  endpoint: "modules/feature-cards",
  fields: [text("title", "Title"), textarea("description", "Description"), image("image", "Card image"), text("image_alt", "Card image alt text"), ...ORDER_FIELDS],
  parentField: "why_finprov_section", canCreate: true, canDelete: true,
};

export const WHY_FINPROV_SCHEMA: ModuleSchema = {
  title: "Why Finprov",
  endpoint: "modules/why-finprov",
  fields: [text("heading", "Heading"), text("sub_heading", "Sub-heading"), rich("paragraph", "Paragraph"), ...ORDER_FIELDS],
  itemsKey: "feature_cards",
  itemSchema: FEATURE_CARD_SCHEMA,
};

export const PLACEMENT_STAT_SCHEMA: ModuleSchema = {
  title: "Placement stat",
  endpoint: "modules/placement-stats",
  fields: [text("label", "Label"), text("value", "Value"), ...ORDER_FIELDS],
  parentField: "placement_section", canCreate: true, canDelete: true,
};

export const PLACEMENT_SECTION_SCHEMA: ModuleSchema = {
  title: "Placements",
  endpoint: "modules/placement-sections",
  fields: [text("heading", "Heading"), text("sub_heading", "Sub-heading"), rich("paragraph", "Paragraph"), image("image", "Section image"), text("image_alt", "Section image alt text"), ...LINK_FIELDS("cta"), ...ORDER_FIELDS],
  itemsKey: "stats",
  itemSchema: PLACEMENT_STAT_SCHEMA,
};

export const CTA_SCHEMA: ModuleSchema = {
  title: "Call to action",
  endpoint: "modules/ctas",
  fields: [
    text("heading", "Heading"),
    text("sub_heading", "Sub-heading"),
    rich("paragraph", "Paragraph"),
    ...LINK_FIELDS("cta"),
    ...LINK_FIELDS("secondary_cta"),
  ],
};

export const TESTIMONIAL_SCHEMA: ModuleSchema = {
  title: "Testimonial",
  endpoint: "modules/testimonials",
  fields: [
    text("name", "Name"),
    text("company", "Company"),
    text("designation", "Designation"),
    text("program", "Program"),
    rich("quote", "Quote"),
    { name: "rating", label: "Rating (0-5)", type: "number" },
    { name: "kind", label: "Type", type: "select", options: [{ value: "text", label: "Text" }, { value: "video", label: "Video" }] },
    image("avatar", "Avatar"),
    text("avatar_alt", "Avatar alt text"),
    text("video_url", "Video URL"),
    image("video_thumbnail", "Video thumbnail"),
    text("video_thumbnail_alt", "Video thumbnail alt text"),
    ...ORDER_FIELDS,
  ],
  parentField: "page", canCreate: true, canDelete: true,
};

export const PARTNER_LOGO_SCHEMA: ModuleSchema = {
  title: "Partner logo",
  endpoint: "modules/partner-logos",
  fields: [text("name", "Name"), { name: "kind", label: "Type", type: "select", options: [{ value: "partner", label: "Hiring partner" }, { value: "tool", label: "Software tool" }] }, image("logo", "Logo"), text("logo_alt", "Logo alt text"), text("website_url", "Website link"), ...ORDER_FIELDS],
  parentField: "page", canCreate: true, canDelete: true,
};

export const FAQ_SCHEMA: ModuleSchema = {
  title: "FAQ",
  endpoint: "modules/faqs",
  fields: [text("question", "Question"), rich("answer", "Answer"), ...ORDER_FIELDS],
  parentField: "page", canCreate: true, canDelete: true,
};

export const QUIZ_OPTION_SCHEMA: ModuleSchema = {
  title: "Option",
  endpoint: "modules/quiz-options",
  fields: [text("label", "Label"), text("category", "Recommendation category"), ...ORDER_FIELDS],
  parentField: "question", canCreate: true, canDelete: true,
};

export const QUIZ_QUESTION_SCHEMA: ModuleSchema = {
  title: "Question",
  endpoint: "modules/quiz-questions",
  fields: [text("question_text", "Question text"), ...ORDER_FIELDS],
  parentField: "quiz", canCreate: true, canDelete: true,
  itemsKey: "options",
  itemSchema: QUIZ_OPTION_SCHEMA,
};

export const QUIZ_SCHEMA: ModuleSchema = {
  title: "Quiz",
  endpoint: "modules/quizzes",
  fields: [text("heading", "Heading"), text("description", "Eyebrow / description"), text("next_button_text", "Next button text"), ...LINK_FIELDS("cta"), ...ORDER_FIELDS],
  itemsKey: "questions",
  itemSchema: QUIZ_QUESTION_SCHEMA,
};

export const TEAM_MEMBER_SCHEMA: ModuleSchema = {
  title: "Team member",
  endpoint: "modules/team-members",
  fields: [
    text("name", "Name"),
    text("role", "Role"),
    text("category", "Category"),
    text("experience", "Experience"),
    text("credentials", "Credentials"),
    text("quote", "Short quote"),
    image("photo", "Photo"),
    text("photo_alt", "Photo alt text"),
    rich("bio", "Bio"),
    textarea("highlights", "Highlights (one per line)"),
    ...ORDER_FIELDS,
  ],
  parentField: "team_section", canCreate: true, canDelete: true,
};

export const TEAM_SECTION_SCHEMA: ModuleSchema = {
  title: "Team",
  endpoint: "modules/team-sections",
  fields: [text("heading", "Heading"), text("sub_heading", "Sub-heading"), rich("paragraph", "Paragraph"), ...ORDER_FIELDS],
  itemsKey: "members",
  itemSchema: TEAM_MEMBER_SCHEMA,
};

export const GALLERY_IMAGE_SCHEMA: ModuleSchema = {
  title: "Gallery image",
  endpoint: "modules/gallery-images",
  fields: [text("caption", "Caption"), image("image", "Gallery image"), text("image_alt", "Image alt text"), ...ORDER_FIELDS],
  parentField: "section", canCreate: true, canDelete: true,
};

export const LIFE_AT_FINPROV_SCHEMA: ModuleSchema = {
  title: "Life at Finprov",
  endpoint: "modules/life-at-finprov",
  fields: [text("heading", "Heading"), text("sub_heading", "Sub-heading"), rich("paragraph", "Paragraph"), ...ORDER_FIELDS],
  itemsKey: "images",
  itemSchema: GALLERY_IMAGE_SCHEMA,
};

export const LEGAL_SECTION_SCHEMA: ModuleSchema = {
  title: "Legal section",
  endpoint: "modules/legal-sections",
  fields: [text("title", "Title"), rich("body", "Body"), ...ORDER_FIELDS],
  parentField: "page", canCreate: true, canDelete: true,
};

export const LANDING_PAGE_BODY_SCHEMA: ModuleSchema = {
  title: "Landing page content",
  endpoint: "modules/landing-page-bodies",
  fields: [text("h1", "H1 heading"), rich("body", "Body"), ...ORDER_FIELDS],
};

export const HISTORY_MILESTONE_SCHEMA: ModuleSchema = {
  title: "Milestone",
  endpoint: "modules/history-milestones",
  fields: [text("year_label", "Year label"), text("title", "Title"), textarea("description", "Description"), ...ORDER_FIELDS],
  parentField: "section", canCreate: true, canDelete: true,
};

export const HISTORY_SECTION_SCHEMA: ModuleSchema = {
  title: "History timeline",
  endpoint: "modules/history-sections",
  fields: [text("eyebrow", "Eyebrow label"), text("heading", "Heading"), text("sub_heading", "Sub-heading / intro"), ...ORDER_FIELDS],
  itemsKey: "milestones",
  itemSchema: HISTORY_MILESTONE_SCHEMA,
};

export const SEO_META_SCHEMA: ModuleSchema = {
  title: "SEO",
  endpoint: "seo-meta",
  fields: [
    { name: "seo_title", label: "SEO title", type: "text", counter: { min: 50, max: 60 } },
    { name: "meta_description", label: "Meta description", type: "textarea", counter: { min: 150, max: 160 } },
    text("focus_keyword", "Focus keyword"),
    { name: "secondary_keywords", label: "Secondary keywords", type: "keywords" },
    text("canonical_url", "Canonical URL — leave blank to auto-use this page's own URL"),
    {
      name: "meta_robots",
      label: "Robots",
      type: "checkboxes",
      options: [
        { value: "index", label: "Index" },
        { value: "noindex", label: "Noindex" },
        { value: "follow", label: "Follow" },
        { value: "nofollow", label: "Nofollow" },
      ],
    },
    { name: "include_in_sitemap", label: "Include in sitemap", type: "boolean" },
    { name: "og_title", label: "OpenGraph title", type: "text", counter: { min: 40, max: 60 } },
    { name: "og_description", label: "OpenGraph description", type: "textarea", counter: { min: 60, max: 110 } },
    { name: "og_image", label: "OpenGraph image", type: "image" },
    text("og_image_alt", "OpenGraph image alt text"),
    text("og_url", "OpenGraph URL — leave blank to auto-use the canonical URL"),
    {
      name: "schema_type",
      label: "Schema type",
      type: "select",
      options: [
        { value: "none", label: "None" },
        { value: "webpage", label: "WebPage" },
        { value: "organization", label: "Organization" },
        { value: "article", label: "Article" },
        { value: "blogposting", label: "BlogPosting" },
        { value: "faq", label: "FAQ" },
        { value: "course", label: "Course" },
        { value: "breadcrumb", label: "Breadcrumb" },
        { value: "localbusiness", label: "LocalBusiness" },
        { value: "product", label: "Product" },
      ],
    },
  ],
};

// Every possible key PageDetailSEOPanelSerializer can return, and how to
// render it: 'single' (one object or null) vs 'array' (list, possibly
// empty). Matches the exact shape from backend/seo_panel/serializers.py's
// PageDetailSEOPanelSerializer — nothing here is a guess about which
// modules a page has; that's driven entirely by which keys are non-null/
// non-empty in the actual API response.
export const PAGE_SECTIONS: Record<string, { kind: "single" | "array"; schema: ModuleSchema }> = {
  banner: { kind: "single", schema: BANNER_SCHEMA },
  scroll_section: { kind: "single", schema: SCROLL_SECTION_SCHEMA },
  credentials: { kind: "single", schema: CREDENTIALS_SCHEMA },
  courses: { kind: "single", schema: COURSE_SECTION_SCHEMA },
  why_finprov: { kind: "single", schema: WHY_FINPROV_SCHEMA },
  placements: { kind: "single", schema: PLACEMENT_SECTION_SCHEMA },
  cta: { kind: "single", schema: CTA_SCHEMA },
  testimonials: { kind: "array", schema: TESTIMONIAL_SCHEMA },
  partner_logos: { kind: "array", schema: PARTNER_LOGO_SCHEMA },
  faq: { kind: "array", schema: FAQ_SCHEMA },
  quiz: { kind: "single", schema: QUIZ_SCHEMA },
  team: { kind: "single", schema: TEAM_SECTION_SCHEMA },
  life_at_finprov: { kind: "single", schema: LIFE_AT_FINPROV_SCHEMA },
  legal_sections: { kind: "array", schema: LEGAL_SECTION_SCHEMA },
  landing_page: { kind: "single", schema: LANDING_PAGE_BODY_SCHEMA },
  history: { kind: "single", schema: HISTORY_SECTION_SCHEMA },
};

// Per-page visual order for the page editor — deliberately NOT the same
// order every page uses. Each page renders its modules in a different
// sequence on the live site (see the Round 3 audit in the plan file), so
// the panel must mirror that per page rather than use one global order.
// A page whose slug isn't listed here (e.g. a WP-migrated landing page)
// falls back to Object.keys(PAGE_SECTIONS)'s declaration order.
export const PAGE_SECTION_ORDER: Record<string, string[]> = {
  home: [
    "banner", "scroll_section", "credentials", "courses", "quiz", "placements",
    "testimonials", "cta", "partner_logos", "team", "why_finprov", "life_at_finprov", "faq",
  ],
  about: ["banner", "credentials", "team", "history", "why_finprov", "cta"],
  courses: ["banner", "courses"],
  placement: ["placements", "testimonials", "partner_logos"],
  business: ["banner", "why_finprov", "cta", "faq"],
  blog: ["banner", "cta"],
  contact: ["banner", "faq"],
  admission: ["banner"],
  career: ["banner", "why_finprov", "cta"],
  team: ["banner", "credentials", "team", "cta"],
  testimonials: ["banner", "testimonials"],
  events: ["banner"],
  faq: ["banner", "faq"],
  "verify-student-certificate": ["banner"],
  "privacy-policy": ["banner", "legal_sections"],
  "terms-and-conditions": ["banner", "legal_sections"],
};

/** Returns this page's section keys in the order they actually render on
 * the live site, falling back to declaration order for an unlisted page. */
export function orderedSectionKeysForPage(pageSlug: string): string[] {
  return PAGE_SECTION_ORDER[pageSlug] ?? Object.keys(PAGE_SECTIONS);
}
