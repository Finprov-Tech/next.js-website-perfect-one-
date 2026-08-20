import type { Course } from "@/data/courses";
import type { CMSBlogPostDetail, CMSPage } from "@/lib/cms";
import { resolveCmsImageUrl } from "@/lib/cms";
import { SITE_URL } from "@/lib/seo";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://finprov.com/#organization",
      name: "Finprov Learning",
      alternateName: "Finprov Academy",
      url: "https://finprov.com",
      logo: "https://finprov.com/finprov-wordmark.jpeg",
      image: "https://finprov.com/finprov-wordmark.jpeg",
      description: "India's leading practical accounting, taxation, Gulf accounting, and data analytics training institute with 100% placement assistance.",
      telephone: "+91-8943644444",
      email: "contact@finprov.com",
      sameAs: [
        "https://www.facebook.com/finprov",
        "https://www.instagram.com/finprovlearning",
        "https://www.linkedin.com/company/finprov-learning",
        "https://www.youtube.com/@FinprovLearning"
      ]
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://finprov.com/#educational-organization",
      name: "Finprov Learning Institute",
      url: "https://finprov.com",
      parentOrganization: {
        "@id": "https://finprov.com/#organization"
      },
      description: "Industry-aligned professional finance, SAP, Tally Prime, US CMA, Gulf VAT, and Business Analytics training provider.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kochi",
        addressRegion: "Kerala",
        addressCountry: "IN"
      }
    }
  ]
};

export function generateFaqSchema(
  faqs: Array<{ question: string; answer: string }> | ReadonlyArray<readonly [string, string]>
) {
  const mainEntity = faqs.map((item) => {
    const q = Array.isArray(item) ? item[0] : (item as { question: string }).question;
    const a = Array.isArray(item) ? item[1] : (item as { answer: string }).answer;
    return {
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export function generateCourseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.shortDesc || course.heroDesc,
    provider: {
      "@type": "EducationalOrganization",
      name: "Finprov Learning",
      sameAs: "https://finprov.com",
    },
    courseMode: course.mode || "Online / Classroom",
    educationalCredentialAwarded: "Finprov Certified Finance Professional",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.mode || "Online / Classroom",
      duration: course.duration,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `https://finprov.com${item.url}`,
    })),
  };
}

export function generateWebPageSchema(cmsPage: CMSPage, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: cmsPage.seo?.seo_title || cmsPage.name,
    description: cmsPage.seo?.meta_description || undefined,
    url,
    isPartOf: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

/**
 * BlogPosting JSON-LD for a CMS blog post. `custom_schema_json` on the post's
 * own SEOMeta row, when set, takes precedence — same rule as `generateSchemaForPage`.
 */
export function generateBlogPostSchema(post: CMSBlogPostDetail, url: string) {
  if (post.seo?.custom_schema_json) return post.seo.custom_schema_json;

  const image = resolveCmsImageUrl(post.cover_image);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo?.seo_title || post.title,
    description: post.seo?.meta_description || post.excerpt || undefined,
    image: image || undefined,
    datePublished: post.published_date || undefined,
    author: post.author_name
      ? {
          "@type": "Person",
          name: post.author_name,
        }
      : undefined,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: url,
  };
}

/**
 * Dispatches to the right JSON-LD generator for a CMS page based on its
 * `seo.schema_type`. `custom_schema_json`, when set in the admin, always
 * takes precedence over the auto-generated schema for the selected type.
 */
export function generateSchemaForPage(cmsPage: CMSPage | null, url: string) {
  const seo = cmsPage?.seo;
  if (!seo) return null;
  if (seo.custom_schema_json) return seo.custom_schema_json;

  switch (seo.schema_type) {
    case "organization":
      return organizationSchema;
    case "webpage":
      return cmsPage ? generateWebPageSchema(cmsPage, url) : null;
    case "breadcrumb":
      return generateBreadcrumbSchema([{ name: cmsPage?.name ?? "", url }]);
    // "faq" is intentionally not handled here — the <Faq> component already
    // emits its own FAQPage JSON-LD from cmsPage.faq wherever it's rendered,
    // so dispatching it again here would duplicate that schema on the page.
    // article, blogposting, course, localbusiness, product, none: no generic
    // auto-generator yet — use "Custom schema JSON" in the admin as the escape hatch.
    default:
      return null;
  }
}
