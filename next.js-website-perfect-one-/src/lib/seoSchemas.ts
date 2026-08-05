import type { Course } from "@/data/courses";

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
