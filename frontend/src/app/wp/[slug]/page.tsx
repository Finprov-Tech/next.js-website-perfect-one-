import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, getBlogPostBySlug, getBlogPosts } from "@/lib/cms";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { generateBlogPostSchema } from "@/lib/seoSchemas";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogDetailView } from "@/components/blog/BlogDetailView";
import { fromCmsDetail, fromCmsSummary, relatedFromCms } from "@/lib/blogPostAdapter";
import { LandingPageClient } from "../../LandingPageClient";
import { CourseDetailView } from "@/components/courses/CourseDetailView";
import { BusinessProgramDetailView } from "@/components/business/BusinessProgramDetailView";
import { JobDetailView } from "@/components/careers/JobDetailView";
import { getCourseBySlugDualRead, getCourseCatalog } from "@/lib/courseCatalog";
import { relatedCoursesFromCatalog } from "@/lib/courseCatalogCore";
import { getBusinessProgram } from "@/data/business";
import { getJobBySlug } from "@/data/careers";
import { slugPath } from "@/lib/sitePaths";

export const dynamic = "force-dynamic";

// Internal target of the fallback rewrite in next.config.mjs — serves every
// finprov.com-style root slug (landing pages, blog posts, courses, business
// programs, and career openings).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = slugPath(slug);

  const cmsPage = await getPageBySlug(slug);
  if (cmsPage?.landing_page) {
    return buildMetadata(cmsPage, path);
  }

  const cmsPost = await getBlogPostBySlug(slug);
  if (cmsPost) {
    return buildMetadata(cmsPost, path);
  }

  const course = await getCourseBySlugDualRead(slug);
  if (course) {
    const title = course.seoTitle || `${course.title} | Finprov Learning`;
    const description = course.metaDescription || course.heroDesc || course.shortDesc;
    const canonical = course.canonicalUrl || `${SITE_URL}${path}`;
    const image = course.image
      ? /^https?:\/\//.test(course.image)
        ? course.image
        : `${SITE_URL}${course.image}`
      : `${SITE_URL}/finprov-wordmark.jpeg`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        siteName: "Finprov Learning",
        images: [{ url: image }],
      },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  }

  const program = getBusinessProgram(slug);
  if (program) {
    const title = `${program.title} | Finprov Business`;
    return {
      title,
      description: program.description,
      alternates: { canonical: `${SITE_URL}${path}` },
      openGraph: { title, description: program.description, type: "website", siteName: "Finprov Learning" },
      twitter: { card: "summary_large_image", title, description: program.description },
    };
  }

  const job = getJobBySlug(slug);
  if (job) {
    const title = `${job.title} — Finprov Careers`;
    const description = `Apply for ${job.title} at Finprov Learning in ${job.location}. View responsibilities, qualifications, and application process.`;
    return {
      title,
      description,
      alternates: { canonical: `${SITE_URL}${path}` },
      openGraph: { title, description, type: "website", siteName: "Finprov Learning" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  return { title: "Page Not Found | Finprov Learning" };
}

export default async function RootSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "contact-us") {
    redirect("/contact");
  }

  const cmsPage = await getPageBySlug(slug);
  if (cmsPage?.landing_page) {
    return <LandingPageClient cmsPage={cmsPage} slug={slug} />;
  }

  const cmsPost = await getBlogPostBySlug(slug);
  if (cmsPost) {
    const allCmsPosts = await getBlogPosts();
    const post = fromCmsDetail(cmsPost);
    const related = relatedFromCms(cmsPost, allCmsPosts, 4);
    const latestPosts = allCmsPosts.filter((p) => p.slug !== slug).slice(0, 5).map(fromCmsSummary);

    const schema = generateBlogPostSchema(cmsPost, `${SITE_URL}${slugPath(slug)}`);

    return (
      <>
        <JsonLd data={schema} />
        <BlogDetailView post={post} related={related} latestPosts={latestPosts} />
      </>
    );
  }

  const course = await getCourseBySlugDualRead(slug);
  if (course) {
    const catalog = await getCourseCatalog();
    return <CourseDetailView course={course} relatedCourses={relatedCoursesFromCatalog(catalog, course)} />;
  }

  const program = getBusinessProgram(slug);
  if (program) {
    return <BusinessProgramDetailView program={program} />;
  }

  const job = getJobBySlug(slug);
  if (job) {
    return <JobDetailView job={job} />;
  }

  notFound();
}
