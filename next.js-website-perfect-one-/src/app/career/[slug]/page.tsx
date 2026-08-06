import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { jobOpenings, getJobBySlug } from "@/data/careers";
import { JobDetailView } from "@/components/careers/JobDetailView";

export async function generateStaticParams() {
  return jobOpenings.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: "Job Opening Not Found | Finprov Careers",
    };
  }

  const title = `${job.title} — Finprov Careers`;
  const description = `Apply for ${job.title} at Finprov Learning in ${job.location}. View responsibilities, qualifications, and application process.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Finprov Learning",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return <JobDetailView job={job} />;
}
