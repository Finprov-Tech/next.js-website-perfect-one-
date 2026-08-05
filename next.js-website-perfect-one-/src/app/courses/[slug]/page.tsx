import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses, getCourseBySlug } from "@/data/courses";
import { CourseDetailView } from "@/components/courses/CourseDetailView";

export async function generateStaticParams() {
  return courses.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found | Finprov",
    };
  }

  const title = course.seoTitle || `${course.title} | Finprov Learning`;
  const description = course.metaDescription || course.heroDesc || course.shortDesc;
  const canonical = course.canonicalUrl || `https://finprov.com/courses/${course.slug}/`;
  const image = course.image ? `https://finprov.com${course.image}` : "https://finprov.com/finprov-wordmark.jpeg";

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "Finprov Learning",
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseDetailView course={course} />;
}
