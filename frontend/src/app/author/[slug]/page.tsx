import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthorBySlug } from "@/lib/cms";
import { AuthorPageClient } from "../../AuthorPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) {
    return { title: "Author Not Found | Finprov Journal" };
  }

  const title = `${author.name}, Author at Finprov Learning`;
  const description = author.bio || `Articles by ${author.name} on Finprov Learning.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile", siteName: "Finprov Learning" },
    twitter: { card: "summary", title, description },
  };
}

export default async function AuthorArchivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) {
    notFound();
  }

  return <AuthorPageClient author={author} />;
}
